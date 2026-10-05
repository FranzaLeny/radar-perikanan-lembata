export type StatusKelayakan = 'MEMENUHI' | 'MELEBIHI' | 'DIBAWAH';
export type Kesimpulan = 'NORMAL' | 'PERINGATAN' | 'KRITIS';

export interface EvaluasiParameter {
  baku_mutu_id: string;
  parameter: string;
  satuan: string;
  nilai_hasil: number;
  nilai_min: number | null;
  nilai_max: number | null;
  status_kelayakan: StatusKelayakan;
  rekomendasi?: string;
}

/**
 * Menghitung batas ambang dinamis berdasarkan suhu lingkungan (misal deviasi ± 2°C pada suhu air).
 */
export function hitungAmbangBatasDinamis(
  tipeAmbang: string | null | undefined,
  deviasiToleransi: number | null | undefined,
  suhuLingkungan: number | null | undefined,
  defaultMin: number | null | undefined,
  defaultMax: number | null | undefined
): { min: number | null; max: number | null; isDinamis: boolean; catatan: string | null } {
  if (
    tipeAmbang === 'deviasi_suhu_lingkungan' &&
    suhuLingkungan !== null &&
    suhuLingkungan !== undefined &&
    !isNaN(suhuLingkungan)
  ) {
    const dev = deviasiToleransi !== null && deviasiToleransi !== undefined ? Number(deviasiToleransi) : 2.0;
    const min = parseFloat((suhuLingkungan - dev).toFixed(2));
    const max = parseFloat((suhuLingkungan + dev).toFixed(2));
    return {
      min,
      max,
      isDinamis: true,
      catatan: `Baku mutu dihitung dari deviasi ±${dev}°C terhadap suhu lingkungan (${suhuLingkungan}°C)`,
    };
  }

  return {
    min: defaultMin !== null && defaultMin !== undefined ? Number(defaultMin) : null,
    max: defaultMax !== null && defaultMax !== undefined ? Number(defaultMax) : null,
    isDinamis: false,
    catatan: null,
  };
}

/**
 * Menghitung status kelayakan nilai parameter terhadap ambang batas baku mutu.
 * Logika ini berjalan server-side dan tidak dapat dimanipulasi dari client.
 */
export function hitungStatusKelayakan(
  nilai: number,
  nilaiMin: number | null,
  nilaiMax: number | null
): StatusKelayakan {
  if (nilaiMin !== null && nilaiMin !== undefined && nilai < nilaiMin) {
    return 'DIBAWAH';
  }
  if (nilaiMax !== null && nilaiMax !== undefined && nilai > nilaiMax) {
    return 'MELEBIHI';
  }
  return 'MEMENUHI';
}

/**
 * Menghitung kesimpulan umum status sampel air berdasarkan seluruh detail parameter.
 */
export function hitungKesimpulan(
  detailHasil: { status_kelayakan: StatusKelayakan }[]
): Kesimpulan {
  if (!detailHasil || detailHasil.length === 0) return 'NORMAL';

  const adaKritis = detailHasil.some(
    (d) => d.status_kelayakan === 'MELEBIHI' || d.status_kelayakan === 'DIBAWAH'
  );

  if (adaKritis) {
    return 'KRITIS';
  }

  return 'NORMAL';
}

/**
 * Memberikan rekomendasi teknis budidaya otomatis berdasarkan parameter yang menyimpang.
 */
export function dapatkanRekomendasiTeknis(
  parameterName: string,
  status: StatusKelayakan,
  nilaiHasil: number
): string {
  const p = parameterName.toLowerCase();

  if (status === 'MELEBIHI') {
    if (p.includes('amonia')) {
      return 'Kadar Amonia tinggi. Segera lakukan penyiponan kotoran di dasar kolam, kurangi pemberian pakan 30-50%, dan lakukan pergantian air bertahap.';
    }
    if (p.includes('nitrit')) {
      return 'Kadar Nitrit melebihi ambang batas aman. Tambahkan aerasi maksimal, aplikasikan garam krosok atau probiotik nitrifikasi, dan kurangi pakan.';
    }
    if (p.includes('ph')) {
      return 'pH air terlalu basa. Lakukan pergantian air bertahap dan aplikasikan bahan pereduksi pH aman seperti molase atau probiotik pengurai.';
    }
    if (p.includes('suhu')) {
      return 'Suhu air terlalu tinggi. Pasang jaring paranet untuk peneduh dan tingkatkan sirkulasi air segar.';
    }
    if (p.includes('turbiditas') || p.includes('kecerahan')) {
      return 'Tingkat kekeruhan tinggi. Cek sumber air masuk dan kurangi suspensi lumpur melalui pengendapan sebelum masuk kolam.';
    }
    return `Parameter ${parameterName} melebihi batas standar (${nilaiHasil}). Lakukan monitoring intensif dan penyesuaian operasional kolam.`;
  }

  if (status === 'DIBAWAH') {
    if (p.includes('do') || p.includes('oksigen')) {
      return 'Oksigen terlarut (DO) rendah. Nyalakan kincir air / aerator tambahan segera, bersihkan permukaan kolam dari lumut pekat, dan hentikan pakan sementara.';
    }
    if (p.includes('ph')) {
      return 'pH air terlalu asam. Lakukan pengapuran kolam secara bertahap menggunakan kapur pertanian (CaCO3 / dolomit) sampai pH kembali normal.';
    }
    if (p.includes('suhu')) {
      return 'Suhu air terlalu dingin. Kurangi volume pergantian air di malam hari dan sesuaikan takaran pakan harian.';
    }
    if (p.includes('kecerahan')) {
      return 'Kecerahan air rendah (terlalu keruh / padat plankton). Lakukan pergantian air 20-30% untuk mengendalikan blooming plankton.';
    }
    return `Parameter ${parameterName} berada di bawah batas minimum yang dipersyaratkan. Lakukan pengkondisian air kolam.`;
  }

  return 'Kondisi parameter dalam rentang optimal baku mutu budidaya.';
}
