import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Thermometer, RefreshCw, Plus, ExternalLink } from 'lucide-react';
import { toFieldErrors } from '@/lib/utils';
import type { OptionItem, IKItem } from '../types';

interface InformasiSampelSectionProps {
  nomorSampel: string;
  onNomorSampelChange: (val: string) => void;
  suhuLingkungan: string;
  onSuhuLingkunganChange: (val: string) => void;
  tanggalPengambilan: string;
  onTanggalPengambilanChange: (val: string) => void;
  onSetTanggalNow: () => void;
  lokasiOptions: OptionItem[];
  selectedLokasiOption: OptionItem | null;
  onSelectLokasi: (val: OptionItem | null) => void;
  onOpenQuickAddLokasi: () => void;
  tipeSop: 'arsip' | 'manual' | 'tanpa_sop';
  onTipeSopChange: (tipe: 'arsip' | 'manual' | 'tanpa_sop') => void;
  sopOptions: OptionItem[];
  selectedSopOption: OptionItem | null;
  onSelectSop: (val: string) => void;
  selectedSopDoc: IKItem | null;
  sopManualKode: string;
  onSopManualKodeChange: (val: string) => void;
  sopManualJudul: string;
  onSopManualJudulChange: (val: string) => void;
  fieldErrors: Record<string, string[]>;
}

export function InformasiSampelSection({
  nomorSampel,
  onNomorSampelChange,
  suhuLingkungan,
  onSuhuLingkunganChange,
  tanggalPengambilan,
  onTanggalPengambilanChange,
  onSetTanggalNow,
  lokasiOptions,
  selectedLokasiOption,
  onSelectLokasi,
  onOpenQuickAddLokasi,
  tipeSop,
  onTipeSopChange,
  sopOptions,
  selectedSopOption,
  onSelectSop,
  selectedSopDoc,
  sopManualKode,
  onSopManualKodeChange,
  sopManualJudul,
  onSopManualJudulChange,
  fieldErrors,
}: InformasiSampelSectionProps) {
  return (
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
              onChange={(e) => onNomorSampelChange(e.target.value)}
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
              onChange={(e) => onSuhuLingkunganChange(e.target.value)}
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
                onClick={onSetTanggalNow}
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
              onChange={(e) => onTanggalPengambilanChange(e.target.value)}
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
              onClick={onOpenQuickAddLokasi}
              className="gap-1 cursor-pointer"
            >
              <Plus className="size-3" />
              <span>Tambah Lokasi Baru</span>
            </Button>
          </div>

          <Combobox<OptionItem>
            items={lokasiOptions}
            value={selectedLokasiOption}
            onValueChange={onSelectLokasi}
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
                        <span className="text-muted-foreground">{' • '}[{item.sublabel}]</span>
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
                onClick={() => onTipeSopChange('arsip')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  tipeSop === 'arsip'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pilih SOP
              </button>
              <button
                type="button"
                onClick={() => onTipeSopChange('tanpa_sop')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  tipeSop === 'tanpa_sop'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tanpa SOP
              </button>
              <button
                type="button"
                onClick={() => onTipeSopChange('manual')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  tipeSop === 'manual'
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
                onValueChange={(val) => onSelectSop(val ? val.value : '')}
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
                  onChange={(e) => onSopManualKodeChange(e.target.value)}
                  placeholder="SOP-M-01"
                />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="sopManualJudul">Judul Prosedur Manual *</FieldLabel>
                <Input
                  id="sopManualJudul"
                  value={sopManualJudul}
                  onChange={(e) => onSopManualJudulChange(e.target.value)}
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
  );
}
