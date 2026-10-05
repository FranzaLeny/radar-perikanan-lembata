import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Droplets, Plus } from 'lucide-react';
import type {
  BakuMutuItem,
  EvaluatedParameterRow,
  IKItem,
  OptionItem,
  ParameterRow,
} from '../types';
import { ParameterRowItem } from './parameter-row-item';

interface ParameterTableSectionProps {
  parameterRows: ParameterRow[];
  evaluatedRows: EvaluatedParameterRow[];
  bakuMutuMap: Map<string, BakuMutuItem>;
  bakuMutuOptions: OptionItem[];
  ikList: IKItem[];
  ikMap: Map<string, IKItem>;
  suhuLingkungan: string;
  onAddParameterRow: () => void;
  onRemoveParameterRow: (tempId: string) => void;
  onSelectBakuMutu: (tempId: string, bmId: string) => void;
  onSelectIk: (tempId: string, ikId: string) => void;
  onValueChange: (tempId: string, val: string) => void;
  onToggleCustomAmbang: (tempId: string) => void;
  onOverrideMinChange: (tempId: string, val: string) => void;
  onOverrideMaxChange: (tempId: string, val: string) => void;
}

export function ParameterTableSection({
  parameterRows,
  evaluatedRows,
  bakuMutuMap,
  bakuMutuOptions,
  ikList,
  ikMap,
  suhuLingkungan,
  onAddParameterRow,
  onRemoveParameterRow,
  onSelectBakuMutu,
  onSelectIk,
  onValueChange,
  onToggleCustomAmbang,
  onOverrideMinChange,
  onOverrideMaxChange,
}: ParameterTableSectionProps) {
  return (
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
          onClick={onAddParameterRow}
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
              onClick={onAddParameterRow}
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
              const selectedIkDoc = ikMap.get(row.ik_id) || null;

              return (
                <ParameterRowItem
                  key={row.tempId}
                  idx={idx}
                  row={row}
                  evalRow={evalRow}
                  currentBm={currentBm}
                  currentOption={currentOption}
                  bakuMutuOptions={bakuMutuOptions}
                  ikList={ikList}
                  selectedIkDoc={selectedIkDoc}
                  suhuLingkungan={suhuLingkungan}
                  onSelectBakuMutu={onSelectBakuMutu}
                  onSelectIk={onSelectIk}
                  onValueChange={onValueChange}
                  onToggleCustomAmbang={onToggleCustomAmbang}
                  onOverrideMinChange={onOverrideMinChange}
                  onOverrideMaxChange={onOverrideMaxChange}
                  onRemoveRow={onRemoveParameterRow}
                />
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddParameterRow}
              className="w-full gap-1.5 text-xs border-dashed text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Tambah Parameter Uji Lainnya</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
