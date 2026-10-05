'use client';

import React, { useState, useMemo } from 'react';
import { GrafikTren } from '@/components/grafik-tren';
import type {
  TrenClientProps,
  ChartDataPoint,
  DetailRow,
} from './types';
import { TrenHeader } from './_components/tren-header';
import { TrenFilterBar } from './_components/tren-filter-bar';
import { TrenHistoryTable } from './_components/tren-history-table';

export * from './types';

export function TrenClient({
  bakuMutuList,
  lokasiList,
  ujiList,
}: TrenClientProps) {
  const [selectedParameterId, setSelectedParameterId] = useState(
    bakuMutuList[0]?.id || ''
  );
  const [selectedLokasiId, setSelectedLokasiId] = useState('SEMUA');

  const parameterOptions = useMemo(
    () => [
      ...bakuMutuList.map((bm) => ({
        value: bm.id,
        label: `${bm.parameter} (${bm.satuan})`,
        sublabel:
          bm.nilai_min !== null && bm.nilai_max !== null
            ? `Standar: ${bm.nilai_min} – ${bm.nilai_max} ${bm.satuan}`
            : bm.nilai_min !== null
            ? `Standar: ≥ ${bm.nilai_min} ${bm.satuan}`
            : bm.nilai_max !== null
            ? `Standar: ≤ ${bm.nilai_max} ${bm.satuan}`
            : 'Standar baku mutu acuan',
      })),
    ],
    [bakuMutuList]
  );

  const selectedParameterOption =
    parameterOptions.find((p) => p.value === selectedParameterId) ||
    parameterOptions[0];

  const lokasiOptions = useMemo(
    () => [
      {
        value: 'SEMUA',
        label: 'Semua Lokasi Kolam',
        sublabel: 'Tampilkan seluruh titik pengujian',
      },
      ...lokasiList.map((loc) => ({
        value: loc.id,
        label: loc.nama_pokdakan,
        sublabel: `Kec. ${loc.kecamatan}`,
      })),
    ],
    [lokasiList]
  );

  const selectedLokasiOption =
    lokasiOptions.find((l) => l.value === selectedLokasiId) ||
    lokasiOptions[0];

  const selectedBakuMutu = bakuMutuList.find(
    (bm) => bm.id === selectedParameterId
  );

  // Filter pengujian berdasarkan parameter dan lokasi yang dipilih
  const { chartDataPoints, detailRows } = useMemo(() => {
    const points: ChartDataPoint[] = [];
    const rows: DetailRow[] = [];

    ujiList.forEach((u) => {
      if (selectedLokasiId !== 'SEMUA' && u.lokasi_id !== selectedLokasiId) {
        return;
      }

      const detail = u.detailParameters.find(
        (dp) => dp.baku_mutu_id === selectedParameterId
      );

      if (detail) {
        const formattedDate = new Date(
          u.tanggal_pengambilan
        ).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const val = Number(detail.nilai_hasil);

        points.push({
          tanggal: formattedDate,
          nilai: val,
          sampel: u.nomor_sampel,
          pokdakan: u.lokasi?.nama_pokdakan,
        });

        rows.push({
          id: detail.id,
          nomor_sampel: u.nomor_sampel,
          tanggal: formattedDate,
          pokdakan: u.lokasi?.nama_pokdakan || '-',
          nilai: val,
          status: detail.status_kelayakan || 'MEMENUHI',
        });
      }
    });

    return { chartDataPoints: points, detailRows: rows };
  }, [ujiList, selectedLokasiId, selectedParameterId]);

  return (
    <div className="space-y-6">
      <TrenHeader />

      <TrenFilterBar
        parameterOptions={parameterOptions}
        selectedParameterOption={selectedParameterOption}
        onSelectParameter={setSelectedParameterId}
        lokasiOptions={lokasiOptions}
        selectedLokasiOption={selectedLokasiOption}
        onSelectLokasi={setSelectedLokasiId}
        selectedLokasiId={selectedLokasiId}
        selectedLokasiNama={
          lokasiList.find((l) => l.id === selectedLokasiId)?.nama_pokdakan
        }
        detailCount={detailRows.length}
        onResetLokasi={() => setSelectedLokasiId('SEMUA')}
      />

      <GrafikTren
        title={`Tren Nilai Fluktuasi ${selectedBakuMutu?.parameter || ''}`}
        parameterName={selectedBakuMutu?.parameter || ''}
        satuan={selectedBakuMutu?.satuan || ''}
        nilaiMin={
          selectedBakuMutu?.nilai_min !== null &&
          selectedBakuMutu?.nilai_min !== undefined
            ? Number(selectedBakuMutu.nilai_min)
            : null
        }
        nilaiMax={
          selectedBakuMutu?.nilai_max !== null &&
          selectedBakuMutu?.nilai_max !== undefined
            ? Number(selectedBakuMutu.nilai_max)
            : null
        }
        data={chartDataPoints}
      />

      <TrenHistoryTable
        parameterName={selectedBakuMutu?.parameter || ''}
        satuan={selectedBakuMutu?.satuan || ''}
        rows={detailRows}
      />
    </div>
  );
}
