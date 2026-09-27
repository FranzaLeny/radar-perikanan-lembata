'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Droplets,
  Send,
  AlertCircle,
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { BadgeStatus } from '@/components/badge-status';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { toFieldErrors } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  QuickAddLokasiDialog,
  type LokasiItem,
} from '@/components/quick-add-lokasi-dialog';
import { toast } from 'sonner';
import { submitHasilUjiAction, updateHasilUjiAction } from '@/lib/actions/uji-kualitas';
import {
  hitungStatusKelayakan,
  hitungKesimpulan,
  type StatusKelayakan,
} from '@/lib/validasi-baku-mutu';

interface IKItem {
  id: string;
  kode_ik: string;
  judul: string;
  kategori?: string | null;
  file_path?: string | null;
}

interface BakuMutuItem {
  id: string;
  parameter: string;
  satuan: string;
  nilai_min: string | null;
  nilai_max: string | null;
  dasar_regulasi?: string | null;
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
  nilai_hasil: string;
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
  ik_id?: string | null;
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
    nilai_hasil: string;
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

  // Generate kode sampel otomatis standar: SMP-YYYYMMDD-[3 DIGIT RANDOM]
  const generateSampleNumber = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    return `SMP-${today}-${rand}`;
  };

  // Format datetime-local sesuai zona waktu perangkat lokal
  const getLocalNowString = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  // State Utama
  const [nomorSampel, setNomorSampel] = useState(
    existingUji?.nomor_sampel || generateSampleNumber()
  );
  const [lokasiListState, setLokasiListState] = useState<LokasiItem[]>(lokasiList);
  const [lokasiId, setLokasiId] = useState(
    existingUji?.lokasi_id || prefilledLokasiId || (lokasiList[0]?.id || '')
  );
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // SOP: 'arsip' atau 'manual'
  const [tipeSop, setTipeSop] = useState<'arsip' | 'manual'>('arsip');
  const [ikId, setIkId] = useState(
    existingUji?.ik_id || prefilledIkId || (ikList[0]?.id || '')
  );
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

  // 1. Parameter Dimulai Kosong (atau prefill saat edit)
  const [parameterRows, setParameterRows] = useState<ParameterRow[]>(() => {
    if (existingUji?.detailParameters && existingUji.detailParameters.length > 0) {
      return existingUji.detailParameters.map((d, idx) => ({
        tempId: `param-${idx}-${Date.now()}`,
        baku_mutu_id: d.baku_mutu_id,
        nilai_hasil: d.nilai_hasil.toString(),
      }));
    }
    return [];
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);

  useEffect(() => {
    if (prefilledLokasiId) setLokasiId(prefilledLokasiId);
    if (prefilledIkId) setIkId(prefilledIkId);
  }, [prefilledLokasiId, prefilledIkId]);

  // Options untuk Combobox Pegawai Penguji
  const pengujiPegawaiOptions: OptionItem[] = useMemo(() => {
    return pegawaiList.map((p) => ({
      value: p.id,
      label: p.nama,
      sublabel: `${p.jabatan} • NIP. ${p.nip}`,
      badge: p.peran_tanda_tangan === 'penguji' ? 'Penguji' : undefined,
    }));
  }, [pegawaiList]);

  // Options untuk Combobox Pejabat Penandatangan LHU
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

  // Options untuk Combobox Lokasi Kolam (hanya yang aktif)
  const lokasiOptions: OptionItem[] = useMemo(() => {
    return lokasiListState
      .filter((l) => l.aktif !== false)
      .map((l) => ({
        value: l.id,
        label: `${l.nama_pokdakan} (${l.pemilik})`,
        sublabel: `Kec. ${l.kecamatan}, Desa ${l.desa}${l.komoditas_ikan ? ` • Komoditas: ${l.komoditas_ikan}` : ''}`,
      }));
  }, [lokasiListState]);

  // Options untuk Combobox SOP Terarsip
  const ikOptions: OptionItem[] = useMemo(() => {
    return ikList.map((ik) => ({
      value: ik.id,
      label: `[${ik.kode_ik}] ${ik.judul}`,
      sublabel: ik.kategori || 'Standar Operasional Prosedur',
    }));
  }, [ikList]);

  // Options untuk Combobox Parameter Baku Mutu (Aktif & Versi Arsip)
  const bakuMutuOptions: OptionItem[] = useMemo(() => {
    return bakuMutuList.map((bm) => {
      const min = bm.nilai_min;
      const max = bm.nilai_max;
      let limitStr = 'Ambang batas: ';
      if (min !== null && max !== null) limitStr += `${min} – ${max} ${bm.satuan}`;
      else if (min !== null) limitStr += `≥ ${min} ${bm.satuan}`;
      else if (max !== null) limitStr += `≤ ${max} ${bm.satuan}`;
      else limitStr += '-';

      return {
        value: bm.id,
        label: `${bm.parameter} (${bm.satuan})`,
        sublabel: `${limitStr}${bm.dasar_regulasi ? ` • ${bm.dasar_regulasi}` : ''}`,
        badge: bm.aktif ? 'Aktif' : 'Arsip Versi Lama',
      };
    });
  }, [bakuMutuList]);

  // Map untuk akses cepat ke data baku mutu
  const bakuMutuMap = useMemo(() => {
    return new Map(bakuMutuList.map((b) => [b.id, b]));
  }, [bakuMutuList]);

  // Handler Tambah Baris Parameter
  const handleAddParameterRow = () => {
    // Pilih parameter pertama yang belum dipilih jika ada
    const chosenIds = new Set(parameterRows.map((r) => r.baku_mutu_id));
    const available = bakuMutuList.find((b) => !chosenIds.has(b.id));

    setParameterRows((prev) => [
      ...prev,
      {
        tempId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        baku_mutu_id: available?.id || (bakuMutuList[0]?.id || ''),
        nilai_hasil: '',
      },
    ]);
  };

  // Handler Hapus Baris Parameter
  const handleRemoveParameterRow = (tempId: string) => {
    setParameterRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  // Handler Ubah Parameter yang Dipilih pada Baris
  const handleSelectBakuMutu = (tempId: string, bmId: string) => {
    setParameterRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, baku_mutu_id: bmId } : r))
    );
  };

  // Handler Ubah Nilai Pengukuran
  const handleValueChange = (tempId: string, val: string) => {
    setParameterRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, nilai_hasil: val } : r))
    );
  };

  // Evaluasi Kesimpulan Real-time
  const evaluatedRows = useMemo(() => {
    return parameterRows.map((r) => {
      const bm = bakuMutuMap.get(r.baku_mutu_id);
      if (!bm || r.nilai_hasil === '' || isNaN(Number(r.nilai_hasil))) {
        return {
          ...r,
          bm,
          status: 'MEMENUHI' as StatusKelayakan,
          isEvaluated: false,
        };
      }

      const numVal = Number(r.nilai_hasil);
      const minVal = bm.nilai_min !== null ? Number(bm.nilai_min) : null;
      const maxVal = bm.nilai_max !== null ? Number(bm.nilai_max) : null;
      const status = hitungStatusKelayakan(numVal, minVal, maxVal);

      return {
        ...r,
        bm,
        status,
        isEvaluated: true,
      };
    });
  }, [parameterRows, bakuMutuMap]);

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

    // Cek duplikasi parameter
    const bmIds = parameterRows.map((r) => r.baku_mutu_id);
    if (new Set(bmIds).size !== bmIds.length) {
      setAlertError('Terdapat parameter yang dipilih lebih dari satu kali. Hapus atau ganti parameter yang duplikat.');
      return;
    }

    // Validasi SOP manual
    if (tipeSop === 'manual' && !sopManualJudul.trim()) {
      setAlertError('Harap isi judul atau metodologi SOP pengujian manual.');
      return;
    }

    setIsSubmitting(true);

    try {
      const details = parameterRows.map((r) => ({
        baku_mutu_id: r.baku_mutu_id,
        nilai_hasil: Number(r.nilai_hasil),
      }));

      const payload = {
        nomor_sampel: nomorSampel.trim(),
        lokasi_id: lokasiId,
        tipe_sop: tipeSop,
        ik_id: tipeSop === 'arsip' ? ikId : undefined,
        sop_manual_kode: tipeSop === 'manual' ? sopManualKode.trim() : undefined,
        sop_manual_judul: tipeSop === 'manual' ? sopManualJudul.trim() : undefined,
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
  const selectedIkOption = ikOptions.find((ik) => ik.value === ikId) || null;
  const selectedIk = ikList.find((ik) => ik.id === ikId) || null;
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
          {/* Kolom Kiri: Metadata Sampel & Lokasi (2 Kolom) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-heading">
                  1. Informasi Sampel & Titik Lokasi Kolam
                </CardTitle>
                <CardDescription className="text-xs">
                  Nomor kode identifikasi sampel, penanggung jawab, dan lokasi kolam budidaya.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Kode Sampel & Waktu Sampling Lapangan (Sejajar Sempurna) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <Field>
                    <div className="flex items-center justify-between h-7">
                      <FieldLabel htmlFor="nomorSampel">Kode / Nomor Sampel *</FieldLabel>
                      <Button
                        type="button"
                        size="xs"
                        onClick={() => setNomorSampel(generateSampleNumber())}
                        title="Acak kode sampel baru"
                        variant="ghost"
                        className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <RefreshCw className="size-3" />
                        <span>Acak Ulang</span>
                      </Button>
                    </div>
                    <Input
                      id="nomorSampel"
                      value={nomorSampel}
                      onChange={(e) => setNomorSampel(e.target.value)}
                      placeholder="Contoh: SMP-20260926-318"
                      className="font-mono font-semibold"
                      required
                    />
                    <FieldDescription>
                      Format standar otomatis atau ubah sesuai kode fisik botol laboratorium.
                    </FieldDescription>
                    <FieldError errors={toFieldErrors(fieldErrors.nomor_sampel)} />
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between h-7">
                      <FieldLabel htmlFor="tanggal">Waktu Sampling Lapangan *</FieldLabel>
                      <Button
                        type="button"
                        size="xs"
                        onClick={() => setTanggalPengambilan(getLocalNowString())}
                        title="Setel ke waktu saat ini"
                        variant="ghost"
                        className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <RefreshCw className="size-3" />
                        <span>Waktu Sekarang</span>
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
                    <FieldDescription>
                      Waktu saat pelaksanaan pengambilan sampel fisik air di lokasi kolam.
                    </FieldDescription>
                    <FieldError errors={toFieldErrors(fieldErrors.tanggal_pengambilan)} />
                  </Field>
                </div>

                {/* Lokasi Kolam: Combobox Autocomplete + Tombol Quick-Add */}
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

                  <FieldError errors={toFieldErrors(fieldErrors.lokasi_id)} />
                </Field>

                {/* SOP / Instruksi Kerja: Pilihan Arsip vs Input Manual */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Standar Operasional Prosedur (SOP / IK) *</FieldLabel>
                    <div className="flex items-center gap-1 p-0.5 bg-muted rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setTipeSop('arsip')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${tipeSop === 'arsip'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Pilih dari Arsip
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipeSop('manual')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${tipeSop === 'manual'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Isi Manual Lapangan
                      </button>
                    </div>
                  </div>

                  {tipeSop === 'arsip' ? (
                    <Field>
                      <Combobox<OptionItem>
                        items={ikOptions}
                        value={selectedIkOption}
                        onValueChange={(val) => {
                          if (val) setIkId(val.value);
                        }}
                        itemToStringValue={(item) => (item ? item.label : '')}
                      >
                        <ComboboxInput
                          placeholder="Pilih SOP / IK yang terdaftar..."
                          showClear
                        />
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
                      {selectedIk && selectedIk.file_path && (
                        <div className="flex items-center justify-between text-xs pt-1 px-1">
                          <span className="text-muted-foreground font-mono truncate max-w-[240px]">
                            Tautan: {selectedIk.file_path}
                          </span>
                          <a
                            href={selectedIk.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="size-3 text-muted-foreground" />
                            <span>Buka Tautan Dokumen</span>
                          </a>
                        </div>
                      )}
                    </Field>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 rounded-xl bg-muted/30 border border-border">
                      <Field>
                        <FieldLabel htmlFor="sopManualKode">Kode / No. SOP Manual</FieldLabel>
                        <Input
                          id="sopManualKode"
                          value={sopManualKode}
                          onChange={(e) => setSopManualKode(e.target.value)}
                          placeholder="IK-M-01"
                        />
                      </Field>
                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="sopManualJudul">Judul / Metodologi Pengujian *</FieldLabel>
                        <Input
                          id="sopManualJudul"
                          value={sopManualJudul}
                          onChange={(e) => setSopManualJudul(e.target.value)}
                          placeholder="Contoh: Pengujian Lapangan Strip Celup Kit Cepat"
                          required
                        />
                      </Field>
                    </div>
                  )}
                  <FieldDescription>
                    {tipeSop === 'arsip'
                      ? 'SOP resmi Dinas yang telah diterbitkan lengkap dengan barcode QR keabsahan.'
                      : 'SOP manual akan otomatis diarsipkan ke sistem dengan kode QR unik agar dokumen tetap terverifikasi.'}
                  </FieldDescription>
                </div>
              </CardContent>
            </Card>

            {/* Parameter Pengujian: Dimulai Kosong + Tambah/Hapus Dinamis */}
            <Card>
              <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-heading">
                    2. Parameter Mutu Air yang Diukur
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pilih dan tambahkan hanya parameter yang benar-benar diuji pada sampel ini.
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
                      Form pengujian dimulai kosong agar efisien. Klik tombol di bawah untuk menentukan parameter apa saja yang diuji pada sampel ini.
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
                  <div className="space-y-2.5">
                    {parameterRows.map((row, idx) => {
                      const evalRow = evaluatedRows.find((r) => r.tempId === row.tempId);
                      const currentBm = bakuMutuMap.get(row.baku_mutu_id);
                      const currentOption = bakuMutuOptions.find((b) => b.value === row.baku_mutu_id) || null;

                      return (
                        <div
                          key={row.tempId}
                          className="p-3 rounded-xl border border-border bg-card shadow-xs transition-all"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                            {/* Pilihan Parameter & Versi Baku Mutu via Combobox */}
                            <Field className="md:col-span-6">
                              <div className="flex items-center justify-between">
                                <FieldLabel>
                                  #{idx + 1} Parameter & Regulasi
                                </FieldLabel>
                                {currentBm && !currentBm.aktif && (
                                  <Badge variant="secondary" className="text-xs py-0 px-1 font-mono">
                                    Arsip Versi Lama
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
                                <ComboboxInput
                                  placeholder="Pilih parameter mutu..."
                                />
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
                                                className="text-xs py-0 px-1 font-mono"
                                              >
                                                {item.badge}
                                              </Badge>
                                            )}
                                          </div>
                                          {item.sublabel && (
                                            <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                                          )}
                                        </div>
                                      </ComboboxItem>
                                    )}
                                  </ComboboxList>
                                </ComboboxContent>
                              </Combobox>
                            </Field>

                            {/* Nilai Ukur Numerik */}
                            <Field className="md:col-span-3">
                              <FieldLabel>
                                Hasil Ukur {currentBm ? `(${currentBm.satuan})` : ''} *
                              </FieldLabel>
                              <Input
                                type="number"
                                step="0.01"
                                value={row.nilai_hasil}
                                onChange={(e) => handleValueChange(row.tempId, e.target.value)}
                                placeholder="Contoh: 7.5"
                                className="font-mono font-semibold"
                                required
                              />
                            </Field>

                            {/* Evaluasi Status Realtime & Tombol Hapus */}
                            <div className="md:col-span-3 flex items-center justify-between gap-2 h-9">
                              <div className="flex-1">
                                {evalRow?.isEvaluated ? (
                                  <BadgeStatus status={evalRow.status} size="sm" />
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">
                                    Masukkan nilai
                                  </span>
                                )}
                              </div>

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

          {/* Kolom Kanan: Evaluasi Kesimpulan & Petugas (1 Kolom) */}
          <div className="space-y-6">
            {/* Live Evaluasi Mutu */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="size-3.5" />
                  <span>Evaluasi Kepatuhan Otomatis</span>
                </div>
                <CardTitle className="text-base font-heading">
                  Status Kesimpulan Sampel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2 text-xs">
                {liveConclusion ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border">
                      <span className="font-semibold text-foreground">Kesimpulan Mutu:</span>
                      <BadgeStatus status={liveConclusion} size="md" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {liveConclusion === 'NORMAL' &&
                        'Seluruh parameter yang diuji memenuhi baku mutu air budidaya PP No. 22/2021.'}
                      {liveConclusion === 'PERINGATAN' &&
                        'Terdapat parameter yang mendekati ambang batas toleransi. Direkomendasikan evaluasi berkala.'}
                      {liveConclusion === 'KRITIS' &&
                        'Terdapat parameter yang melampaui ambang batas bahaya! Memerlukan tindakan korektif segera.'}
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
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-heading">
                  Legalitas & Penandatangan Dokumen
                </CardTitle>
                <CardDescription className="text-xs">
                  Petugas analisis uji lapangan dan pejabat berwenang penandatangan LHU.
                </CardDescription>
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
                      itemToStringValue={(item) => (item ? item.label : '')}
                    >
                      <ComboboxInput
                        placeholder="Pilih petugas terdaftar..."
                        showClear
                      />
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

                  <Input
                    id="petugasUji"
                    value={petugasUji}
                    onChange={(e) => setPetugasUji(e.target.value)}
                    placeholder="Atau ketik nama lengkap petugas..."
                    required
                  />
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
                      <ComboboxInput
                        placeholder="Pilih pejabat penandatangan..."
                        showClear
                      />
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
