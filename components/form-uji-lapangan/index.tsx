'use client';

import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { type LokasiItem, QuickAddLokasiDialog } from '@/components/quick-add-lokasi-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert';
import { submitHasilUjiAction, updateHasilUjiAction } from '@/lib/actions/uji-kualitas';
import {
	hitungAmbangBatasDinamis,
	hitungKesimpulan,
	hitungStatusKelayakan,
	type StatusKelayakan
} from '@/lib/validasi-baku-mutu';
import { EvaluasiLegalitasSection } from './sections/evaluasi-legalitas-section';
import { InformasiSampelSection } from './sections/informasi-sampel-section';
import { ParameterTableSection } from './sections/parameter-table-section';
import type {
	EvaluatedParameterRow,
	FormUjiLapanganProps,
	OptionItem,
	ParameterRow
} from './types';

// Re-export types for consumers
export * from './types';

// Generate kode sampel otomatis standar: SMP-YYYYMMDD-[3 DIGIT RANDOM]
function generateSampleNumber() {
	const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const rand = Math.floor(100 + Math.random() * 900);
	return `SMP-${today}-${rand}`;
}

// Format datetime-local sesuai zona waktu perangkat lokal
function getLocalNowString() {
	const now = new Date();
	const tzOffset = now.getTimezoneOffset() * 60000;
	return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function FormUjiLapangan({
	lokasiList,
	ikList,
	bakuMutuList,
	pegawaiList = [],
	prefilledIkId,
	prefilledLokasiId,
	currentOfficerName = 'Petugas Uji Lapangan',
	mode = 'create',
	existingUji
}: FormUjiLapanganProps) {
	const router = useRouter();

	// State Utama
	const [nomorSampel, setNomorSampel] = useState(
		() => existingUji?.nomor_sampel || generateSampleNumber()
	);
	const [lokasiListState, setLokasiListState] = useState<LokasiItem[]>(lokasiList);
	const [lokasiId, setLokasiId] = useState(
		existingUji?.lokasi_id || prefilledLokasiId || lokasiList[0]?.id || ''
	);
	const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

	// Suhu Udara Lingkungan Lapangan (°C)
	const [suhuLingkungan, setSuhuLingkungan] = useState<string>(
		existingUji?.suhu_lingkungan ? existingUji.suhu_lingkungan.toString() : ''
	);

	// SOP Induk: Opsional (pilihan SOP terarsip, manual, atau tanpa SOP)
	const initialSopId = existingUji?.sop_id || existingUji?.ik_id || prefilledIkId || '';
	const [tipeSop, setTipeSop] = useState<'arsip' | 'manual' | 'tanpa_sop'>(
		initialSopId ? 'arsip' : 'tanpa_sop'
	);
	const [sopId, setSopId] = useState<string>(initialSopId);
	const [sopManualKode, setSopManualKode] = useState('');
	const [sopManualJudul, setSopManualJudul] = useState('');

	// Pegawai & Penandatangan: Utamakan is_penanggungjawab, lalu kepala_dinas, lalu first
	const defaultPenandatangan =
		pegawaiList.find((p) => p.is_penanggungjawab) ||
		pegawaiList.find((p) => p.peran_tanda_tangan === 'kepala_dinas') ||
		pegawaiList[0];
	const pengujiPegawaiDefault =
		pegawaiList.find((p) => p.peran_tanda_tangan === 'penguji') || pegawaiList[0];

	const [pengujiPegawaiId, setPengujiPegawaiId] = useState<string>(
		existingUji?.penguji_pegawai_id || pengujiPegawaiDefault?.id || ''
	);
	const [penandatanganPegawaiId, setPenandatanganPegawaiId] = useState<string>(
		existingUji?.penandatangan_pegawai_id || defaultPenandatangan?.id || ''
	);
	const [petugasUji, setPetugasUji] = useState(
		existingUji?.petugas_uji || pengujiPegawaiDefault?.nama || currentOfficerName
	);

	// Narasi Evaluasi Lapangan
	const [catatanLapangan, setCatatanLapangan] = useState(existingUji?.catatan_lapangan || '');
	const [kesimpulanUmum, setKesimpulanUmum] = useState(existingUji?.kesimpulan_umum || '');
	const [saranRekomendasiLapangan, setSaranRekomendasiLapangan] = useState(
		existingUji?.saran_rekomendasi_lapangan || ''
	);

	// Metadata Pengujian
	const [tanggalPengambilan, setTanggalPengambilan] = useState(() => {
		if (existingUji?.tanggal_pengambilan) {
			const d = new Date(existingUji.tanggal_pengambilan);
			const tzOffset = d.getTimezoneOffset() * 60000;
			return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
		}
		return getLocalNowString();
	});

	// Maps untuk akses cepat data
	const bakuMutuMap = useMemo(() => {
		return new Map(bakuMutuList.map((b) => [b.id, b]));
	}, [bakuMutuList]);

	const ikMap = useMemo(() => {
		return new Map(ikList.map((ik) => [ik.id, ik]));
	}, [ikList]);

	// Fungsi pembantu: Cari IK pertama (Tingkatan 3) yang cocok untuk parameter tertentu
	const findDefaultIkForParam = (bmId: string): string => {
		const bm = bakuMutuMap.get(bmId);
		const ikCandidates = ikList.filter(
			(ik) =>
				ik.kategoriDokumen?.tingkatan === 3 ||
				ik.kategoriDokumen?.kode_kategori === 'IK' ||
				ik.kode_ik.startsWith('IK-') ||
				Boolean(ik.parameter_uji)
		);

		if (!bm) return ikCandidates[0]?.id || ikList[0]?.id || '';

		const paramName = bm.parameter.toLowerCase().trim();
		const matching = ikCandidates.find(
			(ik) => ik.parameter_uji && ik.parameter_uji.toLowerCase().trim() === paramName
		);
		if (matching) return matching.id;

		const byTitle = ikCandidates.find((ik) => ik.judul.toLowerCase().includes(paramName));
		if (byTitle) return byTitle.id;

		return ikCandidates[0]?.id || ikList[0]?.id || '';
	};

	// Parameter Dimulai Kosong (atau prefill saat edit)
	const [parameterRows, setParameterRows] = useState<ParameterRow[]>(() => {
		if (existingUji?.detailParameters && existingUji.detailParameters.length > 0) {
			return existingUji.detailParameters.map((d, idx) => ({
				tempId: `param-${idx}-${Date.now()}`,
				baku_mutu_id: d.baku_mutu_id,
				ik_id: d.ik_id || findDefaultIkForParam(d.baku_mutu_id),
				nilai_hasil: d.nilai_hasil.toString(),
				is_custom_ambang: Boolean(d.nilai_min_terapkan || d.nilai_max_terapkan),
				nilai_min_override:
					d.nilai_min_terapkan !== null && d.nilai_min_terapkan !== undefined
						? d.nilai_min_terapkan.toString()
						: '',
				nilai_max_override:
					d.nilai_max_terapkan !== null && d.nilai_max_terapkan !== undefined
						? d.nilai_max_terapkan.toString()
						: ''
			}));
		}
		return [];
	});

	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alertError, setAlertError] = useState<string | null>(null);

	// Options Pegawai Penguji
	const pengujiPegawaiOptions: OptionItem[] = useMemo(() => {
		return pegawaiList.map((p) => ({
			value: p.id,
			label: p.nama,
			sublabel: `${p.jabatan} • NIP. ${p.nip}`,
			badge: p.peran_tanda_tangan === 'penguji' ? 'Penguji' : undefined
		}));
	}, [pegawaiList]);

	// Options Pejabat Penandatangan LHU
	const penandatanganPegawaiOptions: OptionItem[] = useMemo(() => {
		return pegawaiList.map((p) => ({
			value: p.id,
			label: p.nama,
			sublabel: `${p.jabatan} • NIP. ${p.nip}${p.pangkat_golongan ? ` (${p.pangkat_golongan})` : ''}`,
			badge: p.is_penanggungjawab
				? '⭐ Default Penandatangan'
				: p.peran_tanda_tangan === 'kepala_dinas'
					? 'Kepala Dinas'
					: p.peran_tanda_tangan === 'pengelola_mutu'
						? 'Pengelola Mutu'
						: undefined
		}));
	}, [pegawaiList]);

	// Options Lokasi Kolam (hanya yang aktif)
	const lokasiOptions: OptionItem[] = useMemo(() => {
		return lokasiListState
			.filter((l) => l.aktif !== false)
			.map((l) => ({
				value: l.id,
				label: `${l.nama_pokdakan} (${l.pemilik})`,
				sublabel: `Kec. ${l.kecamatan}, Desa ${l.desa}${
					l.komoditas_ikan ? ` • Komoditas: ${l.komoditas_ikan}` : ''
				}`
			}));
	}, [lokasiListState]);

	// Options untuk Pilihan SOP Induk (Tingkatan 2: General / Umum)
	const sopOptions: OptionItem[] = useMemo(() => {
		return ikList
			.filter((doc) => {
				const isTingkat2General =
					doc.kategoriDokumen?.tingkatan === 2 ||
					doc.kategori?.toLowerCase().includes('sop') ||
					doc.kategoriDokumen?.kode_kategori === 'SOP' ||
					doc.kategoriDokumen?.kode_kategori === 'PP' ||
					doc.kode_ik.startsWith('SOP-') ||
					doc.kode_ik.startsWith('PP-');
				return isTingkat2General;
			})
			.map((sop) => ({
				value: sop.id,
				label: `[${sop.kode_ik}] ${sop.judul}`,
				sublabel: sop.kategori || sop.kategoriDokumen?.nama_kategori || 'Standar Operasional Prosedur'
			}));
	}, [ikList]);

	// Options Parameter Baku Mutu
	const bakuMutuOptions: OptionItem[] = useMemo(() => {
		return bakuMutuList.map((bm) => {
			let limitStr = '';
			if (bm.tipe_ambang_batas === 'deviasi_suhu_lingkungan') {
				limitStr = `Deviasi ±${bm.deviasi_toleransi || '2.00'}°C dari Suhu Udara`;
			} else {
				const min = bm.nilai_min;
				const max = bm.nilai_max;
				if (min !== null && max !== null) limitStr = `Ambang: ${min} – ${max} ${bm.satuan}`;
				else if (min !== null) limitStr = `Ambang: ≥ ${min} ${bm.satuan}`;
				else if (max !== null) limitStr = `Ambang: ≤ ${max} ${bm.satuan}`;
				else limitStr = 'Ambang: -';
			}

			return {
				value: bm.id,
				label: `${bm.parameter} (${bm.satuan})`,
				sublabel: `${limitStr} • ${bm.nomor_regulasi || 'PP No. 22/2021'}`,
				badge: bm.aktif ? 'Aktif' : 'Arsip Versi Lama'
			};
		});
	}, [bakuMutuList]);

	// Handlers untuk baris parameter
	const handleAddParameterRow = () => {
		const chosenIds = new Set(parameterRows.map((r) => r.baku_mutu_id));
		const available = bakuMutuList.find((b) => !chosenIds.has(b.id)) || bakuMutuList[0];
		const defaultBmId = available?.id || '';

		setParameterRows((prev) => [
			...prev,
			{
				tempId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
				baku_mutu_id: defaultBmId,
				ik_id: findDefaultIkForParam(defaultBmId),
				nilai_hasil: '',
				is_custom_ambang: false,
				nilai_min_override: '',
				nilai_max_override: ''
			}
		]);
	};

	const handleRemoveParameterRow = (tempId: string) => {
		setParameterRows((prev) => prev.filter((r) => r.tempId !== tempId));
	};

	const handleSelectBakuMutu = (tempId: string, bmId: string) => {
		const matchingIkId = findDefaultIkForParam(bmId);
		setParameterRows((prev) =>
			prev.map((r) =>
				r.tempId === tempId
					? {
							...r,
							baku_mutu_id: bmId,
							ik_id: matchingIkId,
							is_custom_ambang: false,
							nilai_min_override: '',
							nilai_max_override: ''
						}
					: r
			)
		);
	};

	const handleSelectIk = (tempId: string, ikIdVal: string) => {
		setParameterRows((prev) => prev.map((r) => (r.tempId === tempId ? { ...r, ik_id: ikIdVal } : r)));
	};

	const handleValueChange = (tempId: string, val: string) => {
		setParameterRows((prev) =>
			prev.map((r) => (r.tempId === tempId ? { ...r, nilai_hasil: val } : r))
		);
	};

	const handleToggleCustomAmbang = (tempId: string) => {
		setParameterRows((prev) =>
			prev.map((r) => {
				if (r.tempId !== tempId) return r;
				const currentBm = bakuMutuMap.get(r.baku_mutu_id);
				const willBeCustom = !r.is_custom_ambang;
				return {
					...r,
					is_custom_ambang: willBeCustom,
					nilai_min_override: willBeCustom && currentBm?.nilai_min ? currentBm.nilai_min : '',
					nilai_max_override: willBeCustom && currentBm?.nilai_max ? currentBm.nilai_max : ''
				};
			})
		);
	};

	const handleOverrideMinChange = (tempId: string, val: string) => {
		setParameterRows((prev) =>
			prev.map((r) => (r.tempId === tempId ? { ...r, nilai_min_override: val } : r))
		);
	};

	const handleOverrideMaxChange = (tempId: string, val: string) => {
		setParameterRows((prev) =>
			prev.map((r) => (r.tempId === tempId ? { ...r, nilai_max_override: val } : r))
		);
	};

	// Evaluasi Kesimpulan & Status Kelayakan Real-time
	const evaluatedRows: EvaluatedParameterRow[] = useMemo(() => {
		return parameterRows.map((r) => {
			const bm = bakuMutuMap.get(r.baku_mutu_id);
			const ik = ikMap.get(r.ik_id);

			let effectiveMin: number | null = null;
			let effectiveMax: number | null = null;
			let isDinamis = false;
			let catatanAmbang: string | null = null;

			if (r.is_custom_ambang && (r.nilai_min_override !== '' || r.nilai_max_override !== '')) {
				effectiveMin = r.nilai_min_override !== '' ? Number(r.nilai_min_override) : null;
				effectiveMax = r.nilai_max_override !== '' ? Number(r.nilai_max_override) : null;
				catatanAmbang = 'Disesuaikan manual di lapangan';
			} else if (bm) {
				const dynamicCalc = hitungAmbangBatasDinamis(
					bm.tipe_ambang_batas,
					bm.deviasi_toleransi !== null && bm.deviasi_toleransi !== undefined
						? Number(bm.deviasi_toleransi)
						: 2.0,
					suhuLingkungan !== '' ? Number(suhuLingkungan) : null,
					bm.nilai_min !== null && bm.nilai_min !== undefined ? Number(bm.nilai_min) : null,
					bm.nilai_max !== null && bm.nilai_max !== undefined ? Number(bm.nilai_max) : null
				);
				effectiveMin = dynamicCalc.min;
				effectiveMax = dynamicCalc.max;
				isDinamis = dynamicCalc.isDinamis;
				catatanAmbang = dynamicCalc.catatan;
			}

			if (!bm || r.nilai_hasil === '' || Number.isNaN(Number(r.nilai_hasil))) {
				return {
					...r,
					bm,
					ik,
					effectiveMin,
					effectiveMax,
					isDinamis,
					catatanAmbang,
					status: 'MEMENUHI' as StatusKelayakan,
					isEvaluated: false
				};
			}

			const numVal = Number(r.nilai_hasil);
			const status = hitungStatusKelayakan(numVal, effectiveMin, effectiveMax);

			return {
				...r,
				bm,
				ik,
				effectiveMin,
				effectiveMax,
				isDinamis,
				catatanAmbang,
				status,
				isEvaluated: true
			};
		});
	}, [parameterRows, bakuMutuMap, ikMap, suhuLingkungan]);

	const liveConclusion = useMemo(() => {
		const validRows = evaluatedRows.filter((r) => r.isEvaluated);
		if (validRows.length === 0) return null;
		return hitungKesimpulan(validRows.map((r) => ({ status_kelayakan: r.status })));
	}, [evaluatedRows]);

	const handleQuickAddSuccess = (newLokasi: LokasiItem) => {
		setLokasiListState((prev) => [newLokasi, ...prev]);
		setLokasiId(newLokasi.id);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFieldErrors({});
		setAlertError(null);

		if (!lokasiId) {
			setAlertError('Silakan pilih lokasi kolam pembudidaya.');
			return;
		}

		if (parameterRows.length === 0) {
			setAlertError('Silakan tambahkan minimal satu parameter uji untuk sampel ini.');
			return;
		}

		const emptyValues = parameterRows.some((r) => r.nilai_hasil.trim() === '');
		if (emptyValues) {
			setAlertError('Seluruh parameter uji yang ditambahkan harus diisi nilai pengukurannya.');
			return;
		}

		const emptyIk = parameterRows.some((r) => !r.ik_id);
		if (emptyIk) {
			setAlertError('Setiap parameter yang diuji wajib memilih Instruksi Kerja (IK) yang digunakan.');
			return;
		}

		const bmIds = parameterRows.map((r) => r.baku_mutu_id);
		if (new Set(bmIds).size !== bmIds.length) {
			setAlertError(
				'Terdapat parameter yang dipilih lebih dari satu kali. Hapus atau ganti parameter yang duplikat.'
			);
			return;
		}

		if (tipeSop === 'manual' && !sopManualJudul.trim()) {
			setAlertError('Harap isi judul atau metodologi SOP pengujian manual.');
			return;
		}

		setIsSubmitting(true);

		try {
			const details = evaluatedRows.map((r) => ({
				baku_mutu_id: r.baku_mutu_id,
				ik_id: r.ik_id,
				nilai_hasil: Number(r.nilai_hasil),
				nilai_min_terapkan: r.effectiveMin,
				nilai_max_terapkan: r.effectiveMax,
				catatan_ambang: r.catatanAmbang
			}));

			const payload = {
				nomor_sampel: nomorSampel.trim(),
				lokasi_id: lokasiId,
				tipe_sop: tipeSop,
				sop_id: tipeSop === 'arsip' && sopId ? sopId : undefined,
				ik_id: tipeSop === 'arsip' && sopId ? sopId : undefined,
				sop_manual_kode: tipeSop === 'manual' ? sopManualKode.trim() : undefined,
				sop_manual_judul: tipeSop === 'manual' ? sopManualJudul.trim() : undefined,
				suhu_lingkungan: suhuLingkungan !== '' ? Number(suhuLingkungan) : undefined,
				tanggal_pengambilan: new Date(tanggalPengambilan).toISOString(),
				petugas_uji: petugasUji.trim(),
				penguji_pegawai_id: pengujiPegawaiId || undefined,
				penandatangan_pegawai_id: penandatanganPegawaiId || undefined,
				catatan_lapangan: catatanLapangan.trim() || undefined,
				kesimpulan_umum: kesimpulanUmum.trim() || undefined,
				saran_rekomendasi_lapangan: saranRekomendasiLapangan.trim() || undefined,
				detail_parameter: details
			};

			if (mode === 'edit' && existingUji?.id) {
				const res = await updateHasilUjiAction(existingUji.id, payload);
				if (res.success) {
					toast.success(res.message || 'Data pengujian berhasil diperbarui.');
					router.push(`/laporan`);
					router.refresh();
				} else {
					if (res.errors) {
						setFieldErrors(res.errors as Record<string, string[]>);
					}
					setAlertError(res.message || 'Gagal memperbarui hasil uji.');
					toast.error(res.message || 'Gagal memperbarui.');
				}
			} else {
				const res = await submitHasilUjiAction(payload);

				if (res.success && res.data) {
					toast.success(res.message || 'Hasil uji lapangan berhasil disimpan.');
					router.push(`/laporan/${res.data.id}/cetak`);
				} else {
					if (res.errors) {
						setFieldErrors(res.errors as Record<string, string[]>);
					}
					setAlertError(res.message || 'Gagal menyimpan hasil uji.');
					toast.error(res.message || 'Gagal menyimpan.');
				}
			}
		} catch {
			setAlertError('Terjadi kegagalan komunikasi dengan server.');
			toast.error('Gagal menyimpan hasil uji.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedLokasiOption = lokasiOptions.find((l) => l.value === lokasiId) || null;
	const selectedSopOption = sopOptions.find((s) => s.value === sopId) || null;
	const selectedSopDoc = ikList.find((ik) => ik.id === sopId) || null;
	const selectedPengujiOption =
		pengujiPegawaiOptions.find((p) => p.value === pengujiPegawaiId) || null;
	const selectedPenandatanganOption =
		penandatanganPegawaiOptions.find((p) => p.value === penandatanganPegawaiId) || null;

	return (
		<>
			<form className='space-y-6' onSubmit={handleSubmit}>
				{alertError && (
					<Alert variant='destructive'>
						<AlertCircle className='size-4' />
						<AlertTitle>Validasi Pengujian</AlertTitle>
						<AlertDescription className='text-xs'>{alertError}</AlertDescription>
					</Alert>
				)}

				<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
					{/* Kolom Kiri: Metadata Sampel, Lokasi, & Parameter (2 Kolom) */}
					<div className='space-y-6 lg:col-span-2'>
						<InformasiSampelSection
							fieldErrors={fieldErrors}
							lokasiOptions={lokasiOptions}
							nomorSampel={nomorSampel}
							onNomorSampelChange={setNomorSampel}
							onOpenQuickAddLokasi={() => setIsQuickAddOpen(true)}
							onSelectLokasi={(val) => {
								if (val) setLokasiId(val.value);
							}}
							onSelectSop={setSopId}
							onSetTanggalNow={() => setTanggalPengambilan(getLocalNowString())}
							onSopManualJudulChange={setSopManualJudul}
							onSopManualKodeChange={setSopManualKode}
							onSuhuLingkunganChange={setSuhuLingkungan}
							onTanggalPengambilanChange={setTanggalPengambilan}
							onTipeSopChange={(t) => {
								setTipeSop(t);
								if (t === 'arsip' && !sopId && sopOptions[0]) setSopId(sopOptions[0].value);
								if (t === 'tanpa_sop') setSopId('');
							}}
							selectedLokasiOption={selectedLokasiOption}
							selectedSopDoc={selectedSopDoc}
							selectedSopOption={selectedSopOption}
							sopManualJudul={sopManualJudul}
							sopManualKode={sopManualKode}
							sopOptions={sopOptions}
							suhuLingkungan={suhuLingkungan}
							tanggalPengambilan={tanggalPengambilan}
							tipeSop={tipeSop}
						/>

						<ParameterTableSection
							bakuMutuMap={bakuMutuMap}
							bakuMutuOptions={bakuMutuOptions}
							evaluatedRows={evaluatedRows}
							ikList={ikList}
							ikMap={ikMap}
							onAddParameterRow={handleAddParameterRow}
							onOverrideMaxChange={handleOverrideMaxChange}
							onOverrideMinChange={handleOverrideMinChange}
							onRemoveParameterRow={handleRemoveParameterRow}
							onSelectBakuMutu={handleSelectBakuMutu}
							onSelectIk={handleSelectIk}
							onToggleCustomAmbang={handleToggleCustomAmbang}
							onValueChange={handleValueChange}
							parameterRows={parameterRows}
							suhuLingkungan={suhuLingkungan}
						/>
					</div>

					{/* Kolom Kanan: Evaluasi Kesimpulan, Legalitas & Rekomendasi (1 Kolom) */}
					<div className='space-y-3'>
						<EvaluasiLegalitasSection
							catatanLapangan={catatanLapangan}
							fieldErrors={fieldErrors}
							isSubmitting={isSubmitting}
							kesimpulanUmum={kesimpulanUmum}
							liveConclusion={liveConclusion}
							mode={mode}
							onCatatanLapanganChange={setCatatanLapangan}
							onKesimpulanUmumChange={setKesimpulanUmum}
							onPetugasUjiTextChange={setPetugasUji}
							onSaranRekomendasiChange={setSaranRekomendasiLapangan}
							onSelectPenandatangan={(val) => {
								if (val) setPenandatanganPegawaiId(val.value);
							}}
							onSelectPenguji={(val) => {
								if (val) {
									setPengujiPegawaiId(val.value);
									setPetugasUji(val.label);
								}
							}}
							penandatanganPegawaiOptions={penandatanganPegawaiOptions}
							pengujiPegawaiOptions={pengujiPegawaiOptions}
							saranRekomendasiLapangan={saranRekomendasiLapangan}
							selectedPenandatanganOption={selectedPenandatanganOption}
							selectedPengujiOption={selectedPengujiOption}
						/>
					</div>
				</div>
			</form>

			{/* Modal Quick-Add Lokasi Kolam */}
			<QuickAddLokasiDialog
				onOpenChange={setIsQuickAddOpen}
				onSuccess={handleQuickAddSuccess}
				open={isQuickAddOpen}
			/>
		</>
	);
}
