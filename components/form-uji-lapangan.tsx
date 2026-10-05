'use client';

import {
  QuickAddLokasiDialog,
  type LokasiItem,
} from '@/components/quick-add-lokasi-dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitHasilUjiAction, updateHasilUjiAction } from '@/lib/actions/uji-kualitas';
import { toFieldErrors } from '@/lib/utils';
import {
  hitungAmbangBatasDinamis,
  hitungKesimpulan,
  hitungStatusKelayakan,
  type StatusKelayakan,
} from '@/lib/validasi-baku-mutu';
import {
  AlertCircle,
  Droplets,
  ExternalLink,
  FileCheck2,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Thermometer,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BadgeStatus } from './badge-status';

export interface IKItem {
  id: string;
  kode_ik: string;
  judul: string;
  kategori?: string | null;
  kategoriDokumen?: { kode_kategori: string; nama_kategori: string } | null;
  parameter_uji?: string | null;
  metode_pengujian?: string | null;
  file_path?: string | null;
}

export interface BakuMutuItem {
  id: string;
  parameter: string;
  satuan: string;
  nilai_min: string | null;
  nilai_max: string | null;
  nomor_regulasi: string;
  dasar_regulasi?: string | null;
  tipe_ambang_batas?: string | null;
  deviasi_toleransi?: string | null;
  aktif: boolean;
}

export interface PegawaiItem {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkat_golongan?: string | null;
  aktif: boolean;
  peran_tanda_tangan: string;
  is_penanggungjawab?: boolean;
}

interface ParameterRow {
  tempId: string;
  baku_mutu_id: string;
  ik_id: string; // Wajib per parameter
  nilai_hasil: string;
  is_custom_ambang: boolean;
  nilai_min_override: string;
  nilai_max_override: string;
}

export interface OptionItem {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
}

export interface ExistingUjiData {
  id: string;
  nomor_sampel: string;
  lokasi_id: string;
  sop_id?: string | null;
  ik_id?: string | null;
  suhu_lingkungan?: number | string | null;
  tanggal_pengambilan: Date | string;
  petugas_uji: string;
  penguji_pegawai_id?: string | null;
  penandatangan_pegawai_id?: string | null;
  catatan_lapangan?: string | null;
  kesimpulan_umum?: string | null;
  saran_rekomendasi_lapangan?: string | null;
  status?: string;
  detailParameters?: {
    baku_mutu_id: string;
    ik_id?: string;
    nilai_hasil: string | number;
    nilai_min_terapkan?: string | number | null;
    nilai_max_terapkan?: string | number | null;
    catatan_ambang?: string | null;
  }[];
}

interface FormUjiLapanganProps {
  lokasiList: LokasiItem[];
  ikList: IKItem[];
  bakuMutuList: BakuMutuItem[];
  pegawaiList?: PegawaiItem[];
  prefilledIkId?: string;
  prefilledLokasiId?: string;
  currentOfficerName?: string;
  mode?: 'create' | 'edit';
  existingUji?: ExistingUjiData;
}

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
  existingUji,
}: FormUjiLapanganProps) {
  const router = useRouter();


  // State Utama
  const [nomorSampel, setNomorSampel] = useState(
    () => existingUji?.nomor_sampel || generateSampleNumber()
  );
  const [lokasiListState, setLokasiListState] = useState<LokasiItem[]>(lokasiList);
  const [lokasiId, setLokasiId] = useState(
    existingUji?.lokasi_id || prefilledLokasiId || (lokasiList[0]?.id || '')
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
  const pengujiPegawaiDefault = pegawaiList.find((p) => p.peran_tanda_tangan === 'penguji') || pegawaiList[0];

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

  // Fungsi pembantu: Cari IK pertama yang cocok untuk parameter tertentu
  const findDefaultIkForParam = (bmId: string): string => {
    const bm = bakuMutuMap.get(bmId);
    if (!bm) return ikList[0]?.id || '';

    const paramName = bm.parameter.toLowerCase().trim();
    // Prioritaskan IK yang parameter_uji cocok
    const matching = ikList.find(
      (ik) => ik.parameter_uji && ik.parameter_uji.toLowerCase().trim() === paramName
    );
    if (matching) return matching.id;

    // Fallback IK yang judulnya mengandung nama parameter
    const byTitle = ikList.find((ik) => ik.judul.toLowerCase().includes(paramName));
    if (byTitle) return byTitle.id;

    return ikList[0]?.id || '';
  };

  // 1. Parameter Dimulai Kosong (atau prefill saat edit)
  const [parameterRows, setParameterRows] = useState<ParameterRow[]>(() => {
    if (existingUji?.detailParameters && existingUji.detailParameters.length > 0) {
      return existingUji.detailParameters.map((d, idx) => ({
        tempId: `param-${idx}-${Date.now()}`,
        baku_mutu_id: d.baku_mutu_id,
        ik_id: d.ik_id || findDefaultIkForParam(d.baku_mutu_id),
        nilai_hasil: d.nilai_hasil.toString(),
        is_custom_ambang: Boolean(d.nilai_min_terapkan || d.nilai_max_terapkan),
        nilai_min_override: d.nilai_min_terapkan !== null && d.nilai_min_terapkan !== undefined ? d.nilai_min_terapkan.toString() : '',
        nilai_max_override: d.nilai_max_terapkan !== null && d.nilai_max_terapkan !== undefined ? d.nilai_max_terapkan.toString() : '',
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
      badge: p.peran_tanda_tangan === 'penguji' ? 'Penguji' : undefined,
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
            : undefined,
    }));
  }, [pegawaiList]);

  // Options Lokasi Kolam (hanya yang aktif)
  const lokasiOptions: OptionItem[] = useMemo(() => {
    return lokasiListState
      .filter((l) => l.aktif !== false)
      .map((l) => ({
        value: l.id,
        label: `${l.nama_pokdakan} (${l.pemilik})`,
        sublabel: `Kec. ${l.kecamatan}, Desa ${l.desa}${l.komoditas_ikan ? ` • Komoditas: ${l.komoditas_ikan}` : ''}`,
      }));
  }, [lokasiListState]);

  // Options untuk Pilihan SOP Induk (Kategori SOP atau Prosedur Pelaksanaan)
  const sopOptions: OptionItem[] = useMemo(() => {
    return ikList
      .filter((doc) => {
        const isSopCategory =
          doc.kategori?.toLowerCase().includes('sop') ||
          doc.kategoriDokumen?.kode_kategori === 'SOP' ||
          doc.kategoriDokumen?.kode_kategori === 'PP' ||
          doc.kode_ik.startsWith('SOP-') ||
          doc.kode_ik.startsWith('PP-');
        // Jika belum ada SOP, sertakan dokumen apapun sebagai fallback
        return isSopCategory || !doc.parameter_uji;
      })
      .map((sop) => ({
        value: sop.id,
        label: `[${sop.kode_ik}] ${sop.judul}`,
        sublabel: sop.kategori || 'Standar Operasional Prosedur',
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
        badge: bm.aktif ? 'Aktif' : 'Arsip Versi Lama',
      };
    });
  }, [bakuMutuList]);

  // Handler Tambah Baris Parameter
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
        nilai_max_override: '',
      },
    ]);
  };

  // Handler Hapus Baris Parameter
  const handleRemoveParameterRow = (tempId: string) => {
    setParameterRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  // Handler Ubah Parameter pada Baris (otomatis ganti IK yang cocok)
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
            nilai_max_override: '',
          }
          : r
      )
    );
  };

  // Handler Ubah IK pada Baris
  const handleSelectIk = (tempId: string, ikIdVal: string) => {
    setParameterRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, ik_id: ikIdVal } : r))
    );
  };

  // Handler Ubah Nilai Pengukuran
  const handleValueChange = (tempId: string, val: string) => {
    setParameterRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, nilai_hasil: val } : r))
    );
  };

  // Handler Toggle Custom Ambang Batas
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
          nilai_max_override: willBeCustom && currentBm?.nilai_max ? currentBm.nilai_max : '',
        };
      })
    );
  };

  // Evaluasi Kesimpulan & Status Kelayakan Real-time (Termasuk Ambang Dinamis Suhu)
  const evaluatedRows = useMemo(() => {
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
          bm.deviasi_toleransi !== null && bm.deviasi_toleransi !== undefined ? Number(bm.deviasi_toleransi) : 2.0,
          suhuLingkungan !== '' ? Number(suhuLingkungan) : null,
          bm.nilai_min !== null && bm.nilai_min !== undefined ? Number(bm.nilai_min) : null,
          bm.nilai_max !== null && bm.nilai_max !== undefined ? Number(bm.nilai_max) : null
        );
        effectiveMin = dynamicCalc.min;
        effectiveMax = dynamicCalc.max;
        isDinamis = dynamicCalc.isDinamis;
        catatanAmbang = dynamicCalc.catatan;
      }

      if (!bm || r.nilai_hasil === '' || isNaN(Number(r.nilai_hasil))) {
        return {
          ...r,
          bm,
          ik,
          effectiveMin,
          effectiveMax,
          isDinamis,
          catatanAmbang,
          status: 'MEMENUHI' as StatusKelayakan,
          isEvaluated: false,
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
        isEvaluated: true,
      };
    });
  }, [parameterRows, bakuMutuMap, ikMap, suhuLingkungan]);

  const liveConclusion = useMemo(() => {
    const validRows = evaluatedRows.filter((r) => r.isEvaluated);
    if (validRows.length === 0) return null;
    return hitungKesimpulan(validRows.map((r) => ({ status_kelayakan: r.status })));
  }, [evaluatedRows]);

  // Handler Quick-Add Lokasi Berhasil
  const handleQuickAddSuccess = (newLokasi: LokasiItem) => {
    setLokasiListState((prev) => [newLokasi, ...prev]);
    setLokasiId(newLokasi.id);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setAlertError(null);

    // Validasi lokasi
    if (!lokasiId) {
      setAlertError('Silakan pilih lokasi kolam pembudidaya.');
      return;
    }

    // Validasi parameter
    if (parameterRows.length === 0) {
      setAlertError('Silakan tambahkan minimal satu parameter uji untuk sampel ini.');
      return;
    }

    // Cek ada baris yang belum diisi nilainya
    const emptyValues = parameterRows.some((r) => r.nilai_hasil.trim() === '');
    if (emptyValues) {
      setAlertError('Seluruh parameter uji yang ditambahkan harus diisi nilai pengukurannya.');
      return;
    }

    // Cek IK per parameter wajib diisi
    const emptyIk = parameterRows.some((r) => !r.ik_id);
    if (emptyIk) {
      setAlertError('Setiap parameter yang diuji wajib memilih Instruksi Kerja (IK) yang digunakan.');
      return;
    }

    // Cek duplikasi parameter
    const bmIds = parameterRows.map((r) => r.baku_mutu_id);
    if (new Set(bmIds).size !== bmIds.length) {
      setAlertError('Terdapat parameter yang dipilih lebih dari satu kali. Hapus atau ganti parameter yang duplikat.');
      return;
    }

    // Validasi SOP manual jika dipilih
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
        catatan_ambang: r.catatanAmbang,
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
        detail_parameter: details,
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
  const selectedPengujiOption = pengujiPegawaiOptions.find((p) => p.value === pengujiPegawaiId) || null;
  const selectedPenandatanganOption = penandatanganPegawaiOptions.find((p) => p.value === penandatanganPegawaiId) || null;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {alertError && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Validasi Pengujian</AlertTitle>
            <AlertDescription className="text-xs">{alertError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Metadata Sampel, Lokasi, & Parameter (2 Kolom) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-heading">
                  1. Informasi Sampel, Lokasi Kolam & Kondisi Lapangan
                </CardTitle>
                <CardDescription className="text-xs">
                  Identitas botol sampel, titik pemantauan kolam, waktu pengambilan, serta suhu udara sekitar.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Baris 1: Nomor Sampel, Suhu Lingkungan, Tanggal Sampling */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="nomorSampel">Nomor ID Sampel *</FieldLabel>
                    <Input
                      id="nomorSampel"
                      value={nomorSampel}
                      onChange={(e) => setNomorSampel(e.target.value)}
                      placeholder="SMP-YYYYMMDD-XXX"
                      className="font-mono font-semibold"
                      required
                    />
                    <FieldError errors={toFieldErrors(fieldErrors.nomor_sampel)} />
                  </Field>

                  <Field>
                    <div className="flex items-center gap-1.5">
                      <Thermometer className="size-3.5 text-amber-600" />
                      <FieldLabel htmlFor="suhuLingkungan">Suhu Lingkungan (°C)</FieldLabel>
                    </div>
                    <Input
                      id="suhuLingkungan"
                      type="number"
                      step="0.1"
                      value={suhuLingkungan}
                      onChange={(e) => setSuhuLingkungan(e.target.value)}
                      placeholder="Misal: 30.5"
                      className="font-mono"
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="tanggal">Waktu Pengambilan *</FieldLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => setTanggalPengambilan(getLocalNowString())}
                        className="text-[11px] gap-1 text-muted-foreground hover:text-foreground cursor-pointer h-5 px-1.5"
                      >
                        <RefreshCw className="size-3" />
                        <span>Sekarang</span>
                      </Button>
                    </div>
                    <Input
                      id="tanggal"
                      type="datetime-local"
                      value={tanggalPengambilan}
                      onChange={(e) => setTanggalPengambilan(e.target.value)}
                      className="font-mono"
                      required
                    />
                    <FieldError errors={toFieldErrors(fieldErrors.tanggal_pengambilan)} />
                  </Field>
                </div>

                {/* Lokasi Kolam: Combobox Autocomplete + Quick-Add */}
                <Field className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Titik Lokasi Kolam Pembudidaya (Pokdakan) *</FieldLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setIsQuickAddOpen(true)}
                      className="gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>Tambah Lokasi Baru</span>
                    </Button>
                  </div>

                  <Combobox<OptionItem>
                    items={lokasiOptions}
                    value={selectedLokasiOption}
                    onValueChange={(val) => {
                      if (val) setLokasiId(val.value);
                    }}
                    itemToStringValue={(item) => (item ? item.label : '')}
                  >
                    <ComboboxInput
                      placeholder="Pilih atau cari Pokdakan, pemilik, atau desa..."
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>Lokasi tidak ditemukan. Tekan &ldquo;+ Tambah Lokasi Baru&rdquo;.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            <div>
                              {item.label}
                              {item.sublabel && (
                                <span className="text-muted-foreground">{" • "}[{item.sublabel}]</span>
                              )}
                            </div>
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <FieldError errors={toFieldErrors(fieldErrors.lokasi_id)} />
                </Field>

                {/* SOP Induk: Opsional (Pilihan Umum) */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <FieldLabel className="text-xs font-semibold">
                        SOP / Prosedur Pelaksanaan Induk (Opsional)
                      </FieldLabel>
                      <p className="text-[11px] text-muted-foreground">
                        SOP bersifat umum untuk alur sampling. Pengujian spesifik tiap parameter diatur oleh Instruksi Kerja di bawah.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setTipeSop('arsip');
                          if (!sopId && sopOptions[0]) setSopId(sopOptions[0].value);
                        }}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${tipeSop === 'arsip'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Pilih SOP
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTipeSop('tanpa_sop');
                          setSopId('');
                        }}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${tipeSop === 'tanpa_sop'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Tanpa SOP
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipeSop('manual')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${tipeSop === 'manual'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Manual
                      </button>
                    </div>
                  </div>

                  {tipeSop === 'arsip' ? (
                    <Field>
                      <Combobox<OptionItem>
                        items={sopOptions}
                        value={selectedSopOption}
                        onValueChange={(val) => {
                          setSopId(val ? val.value : '');
                        }}
                        itemToStringValue={(item) => (item ? item.label : '')}
                      >
                        <ComboboxInput placeholder="Pilih SOP / Prosedur acuan induk..." showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>SOP tidak ditemukan.</ComboboxEmpty>
                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item.value} value={item}>
                                <div className="flex flex-col py-0.5 text-left">
                                  <span className="font-medium text-foreground">{item.label}</span>
                                  {item.sublabel && (
                                    <span className="text-muted-foreground">{item.sublabel}</span>
                                  )}
                                </div>
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {selectedSopDoc && selectedSopDoc.file_path && (
                        <div className="flex items-center justify-between text-xs pt-1 px-1">
                          <span className="text-muted-foreground font-mono truncate max-w-[240px]">
                            File: {selectedSopDoc.file_path}
                          </span>
                          <a
                            href={selectedSopDoc.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="size-3 text-muted-foreground" />
                            <span>Buka Dokumen SOP</span>
                          </a>
                        </div>
                      )}
                    </Field>
                  ) : tipeSop === 'manual' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-xl bg-muted/30 border border-border">
                      <Field>
                        <FieldLabel htmlFor="sopManualKode">Kode / No. SOP Manual</FieldLabel>
                        <Input
                          id="sopManualKode"
                          value={sopManualKode}
                          onChange={(e) => setSopManualKode(e.target.value)}
                          placeholder="SOP-M-01"
                        />
                      </Field>
                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="sopManualJudul">Judul Prosedur Manual *</FieldLabel>
                        <Input
                          id="sopManualJudul"
                          value={sopManualJudul}
                          onChange={(e) => setSopManualJudul(e.target.value)}
                          placeholder="Contoh: Prosedur Pengujian Mandiri Lapangan Kit Cepat"
                          required
                        />
                      </Field>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic bg-muted/20 p-2.5 rounded-lg border border-border">
                      Pengujian ini menggunakan standar umum dinas tanpa dokumen SOP spesifik.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Parameter Pengujian: Auto-Filter IK per Parameter & Ambang Dinamis */}
            <Card>
              <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading">
                    2. Parameter Mutu Air & Instruksi Kerja (IK) Terkait
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Setiap baris parameter wajib dihubungkan ke Instruksi Kerja (IK) yang digunakan beserta metode pengujian resminya.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddParameterRow}
                  className="gap-1.5 text-xs cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Tambah Parameter</span>
                </Button>
              </CardHeader>

              <CardContent className="pt-4 space-y-3">
                {parameterRows.length === 0 ? (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-border rounded-xl bg-muted/20">
                    <Droplets className="size-8 mx-auto text-muted-foreground/60 mb-2" />
                    <p className="font-semibold text-xs text-foreground">
                      Belum Ada Parameter Uji Ditambahkan
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Pilih dan tambahkan parameter uji. Sistem akan otomatis memfilter Instruksi Kerja (IK) dan metode resmi yang sesuai.
                    </p>
                    <Button
                      type="button"
                      onClick={handleAddParameterRow}
                      size="sm"
                      className="mt-4 gap-1.5 text-xs cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Tambah Parameter Pertama</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {parameterRows.map((row, idx) => {
                      const evalRow = evaluatedRows.find((r) => r.tempId === row.tempId);
                      const currentBm = bakuMutuMap.get(row.baku_mutu_id);
                      const currentOption = bakuMutuOptions.find((b) => b.value === row.baku_mutu_id) || null;

                      // Auto-Filter: Hanya IK yang cocok dengan parameter ini
                      const paramName = currentBm?.parameter.toLowerCase().trim() || '';
                      const filteredIks = ikList.filter((ik) => {
                        if (!ik.parameter_uji) return false;
                        return ik.parameter_uji.toLowerCase().trim() === paramName;
                      });
                      const availableIks = filteredIks.length > 0 ? filteredIks : ikList;
                      const selectedIkDoc = ikMap.get(row.ik_id) || null;

                      const isDinamisSuhu = currentBm?.tipe_ambang_batas === 'deviasi_suhu_lingkungan';

                      return (
                        <div
                          key={row.tempId}
                          className="p-3.5 rounded-xl border border-border bg-card shadow-xs transition-all space-y-3"
                        >
                          {/* Baris Atas: Parameter Uji & Pilihan IK (Auto-Filter) */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                            {/* Pilihan Parameter Baku Mutu */}
                            <Field className="md:col-span-5">
                              <div className="flex items-center justify-between">
                                <FieldLabel>#{idx + 1} Parameter Uji *</FieldLabel>
                                {currentBm && (
                                  <Badge variant="secondary" className="text-[11px] py-0 px-1 font-mono">
                                    {currentBm.nomor_regulasi || 'PP 22/2021'}
                                  </Badge>
                                )}
                              </div>

                              <Combobox<OptionItem>
                                items={bakuMutuOptions}
                                value={currentOption}
                                onValueChange={(val) => {
                                  if (val) handleSelectBakuMutu(row.tempId, val.value);
                                }}
                                itemToStringValue={(item) => (item ? item.label : '')}
                              >
                                <ComboboxInput placeholder="Pilih parameter kualitas air..." />
                                <ComboboxContent>
                                  <ComboboxEmpty>Parameter tidak ditemukan.</ComboboxEmpty>
                                  <ComboboxList>
                                    {(item) => (
                                      <ComboboxItem key={item.value} value={item}>
                                        <div className="flex flex-col py-0.5 text-left">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-medium text-foreground">{item.label}</span>
                                            {item.badge && (
                                              <Badge
                                                variant={item.badge === 'Aktif' ? 'outline' : 'secondary'}
                                                className="text-[11px] py-0 px-1 font-mono"
                                              >
                                                {item.badge}
                                              </Badge>
                                            )}
                                          </div>
                                          {item.sublabel && (
                                            <span className="text-[11px] text-muted-foreground">{item.sublabel}</span>
                                          )}
                                        </div>
                                      </ComboboxItem>
                                    )}
                                  </ComboboxList>
                                </ComboboxContent>
                              </Combobox>
                            </Field>

                            {/* Pilihan Instruksi Kerja (Auto-Filter sesuai Parameter) - WAJIB */}
                            <Field className="md:col-span-7">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <FileCheck2 className="size-3 text-primary" />
                                  <FieldLabel>Instruksi Kerja (IK) & Metode Uji *</FieldLabel>
                                </div>
                                <span className="text-[11px] text-muted-foreground">
                                  {filteredIks.length} IK tersedia
                                </span>
                              </div>

                              <select
                                value={row.ik_id}
                                onChange={(e) => handleSelectIk(row.tempId, e.target.value)}
                                className="w-full text-xs h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                required
                              >
                                {availableIks.map((ik) => (
                                  <option key={ik.id} value={ik.id} className="text-xs bg-popover text-foreground">
                                    [{ik.kode_ik}] {ik.judul} {ik.metode_pengujian ? `• Metode: ${ik.metode_pengujian}` : ''}
                                  </option>
                                ))}
                              </select>

                              {selectedIkDoc && selectedIkDoc.metode_pengujian && (
                                <p className="text-[11px] text-primary font-mono mt-1">
                                  Metode Resmi: <strong>{selectedIkDoc.metode_pengujian}</strong>
                                </p>
                              )}
                            </Field>
                          </div>

                          {/* Baris Bawah: Hasil Ukur, Info Ambang Batas & Evaluasi Realtime */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-2 border-t border-border/60">
                            {/* Input Hasil Ukur */}
                            <Field className="md:col-span-4">
                              <FieldLabel>
                                Hasil Pengukuran {currentBm ? `(${currentBm.satuan})` : ''} *
                              </FieldLabel>
                              <Input
                                type="number"
                                step="any"
                                value={row.nilai_hasil}
                                onChange={(e) => handleValueChange(row.tempId, e.target.value)}
                                placeholder="Contoh: 7.50"
                                className="font-mono font-semibold"
                                required
                              />
                            </Field>

                            {/* Ambang Batas Efektif (Dinamis / Statis) */}
                            <div className="md:col-span-5 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-medium">Batas Evaluasi:</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="xs"
                                  onClick={() => handleToggleCustomAmbang(row.tempId)}
                                  className="text-[11px] h-5 px-1.5 gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                                  title="Sesuaikan batas manual jika ada kondisi khusus lapangan"
                                >
                                  <SlidersHorizontal className="size-3" />
                                  <span>{row.is_custom_ambang ? 'Batal Override' : 'Sesuaikan'}</span>
                                </Button>
                              </div>

                              {row.is_custom_ambang ? (
                                <div className="flex items-center gap-1.5">
                                  <Input
                                    type="number"
                                    step="any"
                                    value={row.nilai_min_override}
                                    onChange={(e) =>
                                      setParameterRows((prev) =>
                                        prev.map((r) =>
                                          r.tempId === row.tempId ? { ...r, nilai_min_override: e.target.value } : r
                                        )
                                      )
                                    }
                                    placeholder="Min"
                                    className="font-mono text-xs h-7 w-20"
                                  />
                                  <span>s/d</span>
                                  <Input
                                    type="number"
                                    step="any"
                                    value={row.nilai_max_override}
                                    onChange={(e) =>
                                      setParameterRows((prev) =>
                                        prev.map((r) =>
                                          r.tempId === row.tempId ? { ...r, nilai_max_override: e.target.value } : r
                                        )
                                      )
                                    }
                                    placeholder="Max"
                                    className="font-mono text-xs h-7 w-20"
                                  />
                                  <span className="text-[11px] font-mono text-muted-foreground">{currentBm?.satuan}</span>
                                </div>
                              ) : isDinamisSuhu ? (
                                <div className="space-y-0.5">
                                  <Badge
                                    variant="outline"
                                    className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 text-[11px] gap-1"
                                  >
                                    <Thermometer className="size-2.5" />
                                    <span>
                                      {suhuLingkungan !== ''
                                        ? `Batas: ${evalRow?.effectiveMin ?? '-'} s/d ${evalRow?.effectiveMax ?? '-'} °C (Deviasi ±${currentBm?.deviasi_toleransi || 2}°C)`
                                        : `Deviasi ±${currentBm?.deviasi_toleransi || 2}°C dari Suhu Udara`}
                                    </span>
                                  </Badge>
                                </div>
                              ) : (
                                <span className="font-mono text-xs font-semibold text-foreground">
                                  {evalRow && evalRow.effectiveMin !== null && evalRow.effectiveMax !== null
                                    ? `${evalRow.effectiveMin} – ${evalRow.effectiveMax} ${currentBm?.satuan || ''}`
                                    : evalRow && evalRow.effectiveMin !== null
                                      ? `≥ ${evalRow.effectiveMin} ${currentBm?.satuan || ''}`
                                      : evalRow && evalRow.effectiveMax !== null
                                        ? `≤ ${evalRow.effectiveMax} ${currentBm?.satuan || ''}`
                                        : '-'}
                                </span>
                              )}
                            </div>

                            {/* Status Kelayakan & Tombol Hapus */}
                            <div className="md:col-span-3 flex items-center justify-end gap-2">
                              {evalRow?.isEvaluated ? (
                                <BadgeStatus status={evalRow.status} size="sm" />
                              ) : (
                                <span className="text-[11px] text-muted-foreground italic">Isi hasil ukur</span>
                              )}

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleRemoveParameterRow(row.tempId)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                                title="Hapus parameter ini"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddParameterRow}
                      className="w-full gap-1.5 text-xs border-dashed text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Plus className="size-3.5" />
                      <span>Tambah Parameter Uji Lainnya</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Evaluasi Kesimpulan, Legalitas & Rekomendasi (1 Kolom) */}
          <div className="space-y-3">
            {/* Live Evaluasi Mutu */}
            <Card >
              <CardContent>
                {liveConclusion ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ">
                      <span className="font-semibold text-foreground">Kualitas Air:</span>
                      <BadgeStatus status={liveConclusion} size="md" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {liveConclusion === 'NORMAL' &&
                        'Seluruh parameter yang diuji memenuhi baku mutu air budidaya PP No. 22/2021.'}
                      {liveConclusion === 'PERINGATAN' &&
                        'Terdapat parameter yang mendekati ambang batas toleransi. Direkomendasikan evaluasi berkala.'}
                      {liveConclusion === 'KRITIS' &&
                        'Terdapat parameter yang melampaui ambang batas aman! Memerlukan tindakan penanganan segera.'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-xs">
                    Tambahkan parameter dan isi nilai ukur untuk melihat evaluasi otomatis.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Petugas Penguji & Penandatangan Dokumen LHU */}
            <Card>
              <CardHeader>
                <CardTitle>Legalitas & Penandatangan Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Combobox Petugas Penguji */}
                <Field>
                  <FieldLabel htmlFor="petugasUji">Petugas Penguji Lapangan *</FieldLabel>
                  {pengujiPegawaiOptions.length > 0 ? (
                    <Combobox<OptionItem>
                      items={pengujiPegawaiOptions}
                      value={selectedPengujiOption}
                      onValueChange={(val) => {
                        if (val) {
                          setPengujiPegawaiId(val.value);
                          setPetugasUji(val.label);
                        }
                      }}
                      onInputValueChange={setPetugasUji}
                      itemToStringValue={(item) => (item ? item.label : '')}
                    >
                      <ComboboxInput placeholder="Pilih petugas terdaftar..." showClear />
                      <ComboboxContent>
                        <ComboboxEmpty>Pegawai tidak ditemukan.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              <div className="flex flex-col py-0.5 text-left">
                                <span className="font-medium text-foreground">{item.label}</span>
                                {item.sublabel && (
                                  <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                                )}
                              </div>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  ) : null}


                  <FieldError errors={toFieldErrors(fieldErrors.petugas_uji)} />
                </Field>

                {/* Combobox Pejabat Penandatangan LHU */}
                {penandatanganPegawaiOptions.length > 0 && (
                  <Field className="pt-2 border-t border-border">
                    <FieldLabel>Pejabat Penandatangan LHU (Pengesahan) *</FieldLabel>
                    <Combobox<OptionItem>
                      items={penandatanganPegawaiOptions}
                      value={selectedPenandatanganOption}
                      onValueChange={(val) => {
                        if (val) setPenandatanganPegawaiId(val.value);
                      }}
                      itemToStringValue={(item) => (item ? item.label : '')}
                    >
                      <ComboboxInput placeholder="Pilih pejabat penandatangan..." showClear />
                      <ComboboxContent>
                        <ComboboxEmpty>Pejabat tidak ditemukan.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item.value} value={item}>
                              <div className="flex flex-col py-0.5 text-left">
                                <span className="font-medium text-foreground">{item.label}</span>
                                {item.sublabel && (
                                  <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                                )}
                              </div>
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                    <FieldDescription>
                      Nama dan NIP pejabat ini akan tercantum di lembar pengesahan cetak LHU.
                    </FieldDescription>
                  </Field>
                )}
              </CardContent>
            </Card>

            {/* Narasi Evaluasi, Saran & Rekomendasi Terpadu */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">
                  Kesimpulan & Saran Rekomendasi Lapangan
                </CardTitle>
                <CardDescription className="text-xs">
                  Hasil telaah terpadu dan saran tindak lanjut bagi pembudidaya.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="kesimpulanUmum">Kesimpulan Umum Pengujian</FieldLabel>
                  <Textarea
                    id="kesimpulanUmum"
                    value={kesimpulanUmum}
                    onChange={(e) => setKesimpulanUmum(e.target.value)}
                    placeholder="Contoh: Secara umum parameter fisika dan kimia dalam batas aman budidaya, namun DO rendah saat dini hari..."
                    rows={2}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="saranRekomendasi">Saran / Rekomendasi Tindakan</FieldLabel>
                  <Textarea
                    id="saranRekomendasi"
                    value={saranRekomendasiLapangan}
                    onChange={(e) => setSaranRekomendasiLapangan(e.target.value)}
                    placeholder="Contoh: Nyalakan kincir aerasi minimal 6 jam pada malam hari dan kurangi feeding rate sebesar 15%..."
                    rows={2}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="catatan">Catatan Observasi Tambahan (Opsional)</FieldLabel>
                  <Textarea
                    id="catatan"
                    value={catatanLapangan}
                    onChange={(e) => setCatatanLapangan(e.target.value)}
                    placeholder="Kondisi cuaca hujan, kematian ikan, nafsu makan, debit air masuk..."
                    rows={2}
                  />
                </Field>
              </CardContent>

              <CardFooter className="pt-2 border-t border-border">
                <Button
                  type="submit"
                  size="default"
                  disabled={isSubmitting}
                  className="w-full gap-2 font-medium cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Menyimpan Hasil Uji...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>{mode === 'edit' ? 'Perbarui Data Pengujian' : 'Simpan & Terbitkan LHU'}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>

      {/* Modal Quick-Add Lokasi Kolam */}
      <QuickAddLokasiDialog
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
        onSuccess={handleQuickAddSuccess}
      />
    </>
  );
}
