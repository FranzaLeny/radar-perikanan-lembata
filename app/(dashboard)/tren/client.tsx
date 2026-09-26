'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
} from 'lucide-react';
import { GrafikTren } from '@/components/grafik-tren';
import { BadgeStatus } from '@/components/badge-status';
import { Badge } from '@/components/ui/badge';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';


import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BakuMutuItem {
  id: string;
  parameter: string;
  satuan: string;
  nilai_min: string | null;
  nilai_max: string | null;
}

interface LokasiItem {
  id: string;
  nama_pokdakan: string;
  kecamatan: string;
}

interface UjiItem {
  id: string;
  nomor_sampel: string;
  tanggal_pengambilan: Date;
  lokasi_id: string | null;
  lokasi: {
    nama_pokdakan: string;
    kecamatan: string;
  } | null;
  detailParameters: {
    id: string;
    baku_mutu_id: string | null;
    nilai_hasil: string;
    status_kelayakan: string | null;
    bakuMutu: {
      parameter: string;
      satuan: string;
      nilai_min: string | null;
      nilai_max: string | null;
    } | null;
  }[];
}

export function TrenClient({
  bakuMutuList,
  lokasiList,
  ujiList,
}: {
  bakuMutuList: BakuMutuItem[];
  lokasiList: LokasiItem[];
  ujiList: UjiItem[];
}) {
  const [selectedParameterId, setSelectedParameterId] = useState(
    bakuMutuList[0]?.id || ''
  );
  const [selectedLokasiId, setSelectedLokasiId] = useState('SEMUA');
  const parameterOptions = React.useMemo(() => [
    ...bakuMutuList.map((bm) => ({
      value: bm.id,
      label: `${bm.parameter} (${bm.satuan})`,
      sublabel: bm.nilai_min !== null && bm.nilai_max !== null
        ? `Standar: ${bm.nilai_min} – ${bm.nilai_max} ${bm.satuan}`
        : bm.nilai_min !== null
        ? `Standar: ≥ ${bm.nilai_min} ${bm.satuan}`
        : bm.nilai_max !== null
        ? `Standar: ≤ ${bm.nilai_max} ${bm.satuan}`
        : 'Standar baku mutu acuan',
    })),
  ], [bakuMutuList]);

  const selectedParameterOption = parameterOptions.find((p) => p.value === selectedParameterId) || parameterOptions[0];

  const lokasiOptions = React.useMemo(() => [
    { value: 'SEMUA', label: 'Semua Lokasi Kolam', sublabel: 'Tampilkan seluruh titik pengujian' },
    ...lokasiList.map((loc) => ({
      value: loc.id,
      label: loc.nama_pokdakan,
      sublabel: `Kec. ${loc.kecamatan}`,
    })),
  ], [lokasiList]);

  const selectedLokasiOption = lokasiOptions.find((l) => l.value === selectedLokasiId) || lokasiOptions[0];

  const selectedBakuMutu = bakuMutuList.find(
    (bm) => bm.id === selectedParameterId
  );

  // Filter pengujian berdasarkan parameter dan lokasi yang dipilih
  const chartDataPoints: {
    tanggal: string;
    nilai: number;
    sampel: string;
    pokdakan?: string;
  }[] = [];

  const detailRows: {
    id: string;
    nomor_sampel: string;
    tanggal: string;
    pokdakan: string;
    nilai: number;
    status: string;
  }[] = [];

  ujiList.forEach((u) => {
    if (selectedLokasiId !== 'SEMUA' && u.lokasi_id !== selectedLokasiId) {
      return;
    }

    const detail = u.detailParameters.find(
      (dp) => dp.baku_mutu_id === selectedParameterId
    );

    if (detail) {
      const formattedDate = new Date(u.tanggal_pengambilan).toLocaleDateString(
        'id-ID',
        { day: 'numeric', month: 'short' }
      );
      const val = Number(detail.nilai_hasil);

      chartDataPoints.push({
        tanggal: formattedDate,
        nilai: val,
        sampel: u.nomor_sampel,
        pokdakan: u.lokasi?.nama_pokdakan,
      });

      detailRows.push({
        id: detail.id,
        nomor_sampel: u.nomor_sampel,
        tanggal: formattedDate,
        pokdakan: u.lokasi?.nama_pokdakan || '-',
        nilai: val,
        status: detail.status_kelayakan || 'MEMENUHI',
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Badge variant="secondary" className="gap-1.5 px-2.5 py-0.5 mb-1.5 text-xs font-semibold uppercase tracking-wider">
          <TrendingUp className="size-3" />
          <span>Analisis & Visualisasi Tren</span>
        </Badge>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
          Visualisasi Tren Mutu Air Lapangan
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Pantau perubahan kualitas air dari waktu ke waktu per parameter terhadap ambang batas baku mutu resmi.
        </p>
      </div>

      {/* Filter Control Bar */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Field className="w-full sm:w-auto flex-1">
              <FieldLabel>
                Pilih Parameter Kualitas Air:
              </FieldLabel>
              <Combobox<{ value: string; label: string; sublabel?: string }>
                items={parameterOptions}
                value={selectedParameterOption}
                onValueChange={(val) => {
                  if (val) setSelectedParameterId(val.value);
                }}
                itemToStringValue={(item) => (item ? item.label : '')}
              >
                <ComboboxInput
                  placeholder="Cari atau pilih parameter..."
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>Parameter tidak ditemukan.</ComboboxEmpty>
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
            </Field>

            <Field className="w-full sm:w-auto flex-1">
              <FieldLabel>
                Filter Lokasi / Pokdakan:
              </FieldLabel>
              <Combobox<{ value: string; label: string; sublabel: string }>
                items={lokasiOptions}
                value={selectedLokasiOption}
                onValueChange={(val) => {
                  if (val) setSelectedLokasiId(val.value);
                }}
                itemToStringValue={(item) => (item ? item.label : '')}
              >
                <ComboboxInput
                  placeholder="Cari atau pilih lokasi kolam..."
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>Lokasi kolam tidak ditemukan.</ComboboxEmpty>
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
            </Field>
          </div>

          {/* Indikator Filter Aktif */}
          {selectedLokasiId !== 'SEMUA' && (
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>
                  Menampilkan data pengukuran untuk:{' '}
                  <strong className="text-foreground">
                    {lokasiList.find((l) => l.id === selectedLokasiId)?.nama_pokdakan}
                  </strong>{' '}
                  ({detailRows.length} titik pengukuran)
                  <span className="text-muted-foreground font-medium ml-1">(Hasil Filter)</span>
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setSelectedLokasiId('SEMUA')}
                className="h-6 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recharts Component */}
      <GrafikTren
        title={`Tren Nilai Fluktuasi ${selectedBakuMutu?.parameter || ''}`}
        parameterName={selectedBakuMutu?.parameter || ''}
        satuan={selectedBakuMutu?.satuan || ''}
        nilaiMin={
          selectedBakuMutu?.nilai_min !== null && selectedBakuMutu?.nilai_min !== undefined
            ? Number(selectedBakuMutu.nilai_min)
            : null
        }
        nilaiMax={
          selectedBakuMutu?.nilai_max !== null && selectedBakuMutu?.nilai_max !== undefined
            ? Number(selectedBakuMutu.nilai_max)
            : null
        }
        data={chartDataPoints}
      />

      {/* Historic Data Table for Selected Parameter */}
      <Card className="border-border bg-card shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Riwayat Titik Uji Parameter: {selectedBakuMutu?.parameter}
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono">
            Total {detailRows.length} titik pengukuran
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs font-semibold">Nomor Sampel</TableHead>
                <TableHead className="text-xs font-semibold">Pokdakan</TableHead>
                <TableHead className="text-xs font-semibold">Waktu Pengambilan</TableHead>
                <TableHead className="text-xs font-semibold font-mono">Nilai Pengukuran</TableHead>
                <TableHead className="text-xs font-semibold text-center">Status Kelayakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                    Belum ada data untuk parameter ini pada filter terpilih.
                  </TableCell>
                </TableRow>
              ) : (
                detailRows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono font-semibold text-foreground text-xs">
                      {row.nomor_sampel}
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-xs">
                      {row.pokdakan}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.tanggal}</TableCell>
                    <TableCell className="font-mono font-bold text-foreground text-xs">
                      {row.nilai} {selectedBakuMutu?.satuan}
                    </TableCell>
                    <TableCell className="text-center">
                      <BadgeStatus status={row.status} size="sm" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
