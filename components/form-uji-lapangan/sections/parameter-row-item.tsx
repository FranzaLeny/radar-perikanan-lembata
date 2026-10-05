import React from 'react';
import { Badge } from '@/components/ui/badge';
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
  Field,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { BadgeStatus } from '@/components/badge-status';
import { FileCheck2, SlidersHorizontal, Thermometer, Trash2 } from 'lucide-react';
import type {
  ParameterRow,
  EvaluatedParameterRow,
  BakuMutuItem,
  OptionItem,
  IKItem,
} from '../types';

interface ParameterRowItemProps {
  idx: number;
  row: ParameterRow;
  evalRow: EvaluatedParameterRow | undefined;
  currentBm: BakuMutuItem | undefined;
  currentOption: OptionItem | null;
  bakuMutuOptions: OptionItem[];
  ikList: IKItem[];
  selectedIkDoc: IKItem | null;
  suhuLingkungan: string;
  onSelectBakuMutu: (tempId: string, bmId: string) => void;
  onSelectIk: (tempId: string, ikId: string) => void;
  onValueChange: (tempId: string, val: string) => void;
  onToggleCustomAmbang: (tempId: string) => void;
  onOverrideMinChange: (tempId: string, val: string) => void;
  onOverrideMaxChange: (tempId: string, val: string) => void;
  onRemoveRow: (tempId: string) => void;
}

export function ParameterRowItem({
  idx,
  row,
  evalRow,
  currentBm,
  currentOption,
  bakuMutuOptions,
  ikList,
  selectedIkDoc,
  suhuLingkungan,
  onSelectBakuMutu,
  onSelectIk,
  onValueChange,
  onToggleCustomAmbang,
  onOverrideMinChange,
  onOverrideMaxChange,
  onRemoveRow,
}: ParameterRowItemProps) {
  // Auto-Filter: Hanya IK yang cocok dengan parameter ini
  const paramName = currentBm?.parameter.toLowerCase().trim() || '';
  const filteredIks = ikList.filter((ik) => {
    if (!ik.parameter_uji) return false;
    return ik.parameter_uji.toLowerCase().trim() === paramName;
  });
  const availableIks = filteredIks.length > 0 ? filteredIks : ikList;
  const isDinamisSuhu = currentBm?.tipe_ambang_batas === 'deviasi_suhu_lingkungan';

  return (
    <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs transition-all space-y-3">
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
              if (val) onSelectBakuMutu(row.tempId, val.value);
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
            onChange={(e) => onSelectIk(row.tempId, e.target.value)}
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
            onChange={(e) => onValueChange(row.tempId, e.target.value)}
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
              onClick={() => onToggleCustomAmbang(row.tempId)}
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
                onChange={(e) => onOverrideMinChange(row.tempId, e.target.value)}
                placeholder="Min"
                className="font-mono text-xs h-7 w-20"
              />
              <span>s/d</span>
              <Input
                type="number"
                step="any"
                value={row.nilai_max_override}
                onChange={(e) => onOverrideMaxChange(row.tempId, e.target.value)}
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
            onClick={() => onRemoveRow(row.tempId)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
            title="Hapus parameter ini"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
