import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

interface OptionItem {
  value: string;
  label: string;
  sublabel?: string;
}

interface TrenFilterBarProps {
  parameterOptions: OptionItem[];
  selectedParameterOption: OptionItem;
  onSelectParameter: (val: string) => void;
  lokasiOptions: OptionItem[];
  selectedLokasiOption: OptionItem;
  onSelectLokasi: (val: string) => void;
  selectedLokasiId: string;
  selectedLokasiNama?: string;
  detailCount: number;
  onResetLokasi: () => void;
}

export function TrenFilterBar({
  parameterOptions,
  selectedParameterOption,
  onSelectParameter,
  lokasiOptions,
  selectedLokasiOption,
  onSelectLokasi,
  selectedLokasiId,
  selectedLokasiNama,
  detailCount,
  onResetLokasi,
}: TrenFilterBarProps) {
  return (
    <Card className="border-border bg-card shadow-xs">
      <CardContent className="p-4 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Field className="w-full sm:w-auto flex-1">
            <FieldLabel>Pilih Parameter Kualitas Air:</FieldLabel>
            <Combobox<OptionItem>
              items={parameterOptions}
              value={selectedParameterOption}
              onValueChange={(val) => {
                if (val) onSelectParameter(val.value);
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
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        {item.sublabel && (
                          <span className="text-xs text-muted-foreground">
                            {item.sublabel}
                          </span>
                        )}
                      </div>
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field className="w-full sm:w-auto flex-1">
            <FieldLabel>Filter Lokasi / Pokdakan:</FieldLabel>
            <Combobox<OptionItem>
              items={lokasiOptions}
              value={selectedLokasiOption}
              onValueChange={(val) => {
                if (val) onSelectLokasi(val.value);
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
                        <span className="font-medium text-foreground">
                          {item.label}
                        </span>
                        {item.sublabel && (
                          <span className="text-xs text-muted-foreground">
                            {item.sublabel}
                          </span>
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
                  {selectedLokasiNama}
                </strong>{' '}
                ({detailCount} titik pengukuran)
                <span className="text-muted-foreground font-medium ml-1">
                  (Hasil Filter)
                </span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="xs"
              onClick={onResetLokasi}
              className="h-6 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
