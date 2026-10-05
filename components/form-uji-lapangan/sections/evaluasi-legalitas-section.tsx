import { BadgeStatus } from '@/components/badge-status';
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
import { Textarea } from '@/components/ui/textarea';
import { toFieldErrors } from '@/lib/utils';
import type { Kesimpulan } from '@/lib/validasi-baku-mutu';
import { Loader2, Send } from 'lucide-react';
import type { OptionItem } from '../types';

interface EvaluasiLegalitasSectionProps {
  liveConclusion: Kesimpulan | null;
  pengujiPegawaiOptions: OptionItem[];
  selectedPengujiOption: OptionItem | null;
  onSelectPenguji: (val: OptionItem | null) => void;
  onPetugasUjiTextChange: (val: string) => void;
  penandatanganPegawaiOptions: OptionItem[];
  selectedPenandatanganOption: OptionItem | null;
  onSelectPenandatangan: (val: OptionItem | null) => void;
  kesimpulanUmum: string;
  onKesimpulanUmumChange: (val: string) => void;
  saranRekomendasiLapangan: string;
  onSaranRekomendasiChange: (val: string) => void;
  catatanLapangan: string;
  onCatatanLapanganChange: (val: string) => void;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  fieldErrors: Record<string, string[]>;
}

export function EvaluasiLegalitasSection({
  liveConclusion,
  pengujiPegawaiOptions,
  selectedPengujiOption,
  onSelectPenguji,
  onPetugasUjiTextChange,
  penandatanganPegawaiOptions,
  selectedPenandatanganOption,
  onSelectPenandatangan,
  kesimpulanUmum,
  onKesimpulanUmumChange,
  saranRekomendasiLapangan,
  onSaranRekomendasiChange,
  catatanLapangan,
  onCatatanLapanganChange,
  isSubmitting,
  mode,
  fieldErrors,
}: EvaluasiLegalitasSectionProps) {
  return (
    <div className="space-y-3">
      {/* Live Evaluasi Mutu */}
      <Card>
        <CardContent>
          {liveConclusion ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
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
                onValueChange={onSelectPenguji}
                onInputValueChange={onPetugasUjiTextChange}
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
                onValueChange={onSelectPenandatangan}
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
              onChange={(e) => onKesimpulanUmumChange(e.target.value)}
              placeholder="Contoh: Secara umum parameter fisika dan kimia dalam batas aman budidaya, namun DO rendah saat dini hari..."
              rows={2}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="saranRekomendasi">Saran / Rekomendasi Tindakan</FieldLabel>
            <Textarea
              id="saranRekomendasi"
              value={saranRekomendasiLapangan}
              onChange={(e) => onSaranRekomendasiChange(e.target.value)}
              placeholder="Contoh: Nyalakan kincir aerasi minimal 6 jam pada malam hari dan kurangi feeding rate sebesar 15%..."
              rows={2}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="catatan">Catatan Observasi Tambahan (Opsional)</FieldLabel>
            <Textarea
              id="catatan"
              value={catatanLapangan}
              onChange={(e) => onCatatanLapanganChange(e.target.value)}
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
  );
}
