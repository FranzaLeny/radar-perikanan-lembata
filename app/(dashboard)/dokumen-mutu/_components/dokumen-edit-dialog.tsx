'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateDokumenMutuAction } from '@/lib/actions/dokumen-mutu';
import type { KategoriItem, DokumenMutuItem } from '../types';

interface DokumenEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: DokumenMutuItem | null;
  kategoriList: KategoriItem[];
  parameterList: string[];
  onSuccess: (updatedDoc: DokumenMutuItem) => void;
}

export function DokumenEditDialog({
  isOpen,
  onOpenChange,
  editingItem,
  kategoriList,
  parameterList,
  onSuccess,
}: DokumenEditDialogProps) {
  const [editKategoriId, setEditKategoriId] = useState('');
  const [editJudul, setEditJudul] = useState('');
  const [editParameterUji, setEditParameterUji] = useState('');
  const [editMetodePengujian, setEditMetodePengujian] = useState('');
  const [editFilePath, setEditFilePath] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const isEditIKCategory = useMemo(() => {
    const kat = kategoriList.find((k) => k.id === editKategoriId);
    return kat?.kode_kategori === 'IK';
  }, [kategoriList, editKategoriId]);

  useEffect(() => {
    if (!isOpen || !editingItem) return;
    setEditKategoriId(editingItem.kategori_id || kategoriList[0]?.id || '');
    setEditJudul(editingItem.judul);
    setEditParameterUji(editingItem.parameter_uji || '');
    setEditMetodePengujian(editingItem.metode_pengujian || '');
    setEditFilePath(editingItem.file_path);
    setEditDeskripsi(editingItem.deskripsi || '');
  }, [isOpen, editingItem, kategoriList]);

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsUpdating(true);
    try {
      const res = await updateDokumenMutuAction(editingItem.id, {
        judul: editJudul,
        kategori_id: editKategoriId,
        parameter_uji: isEditIKCategory ? editParameterUji : undefined,
        metode_pengujian: isEditIKCategory ? editMetodePengujian : undefined,
        file_path: editFilePath,
        deskripsi: editDeskripsi,
      });

      if (res.success && res.data) {
        onSuccess(res.data as DokumenMutuItem);
        toast.success(res.message || 'Metadata dokumen berhasil diperbarui.');
        onOpenChange(false);
      } else {
        toast.error(res.message || 'Gagal memperbarui dokumen.');
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-4 text-primary" />
            <span>Edit Metadata Dokumen Mutu</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Perbarui informasi dokumen <strong>{editingItem?.kode_ik}</strong>. Perubahan berkas PDF akan menaikkan versi dokumen secara otomatis.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmitEdit} className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="edit_kategori">Kategori Dokumen</FieldLabel>
            <Select value={editKategoriId} onValueChange={(val) => val && setEditKategoriId(val)}>
              <SelectTrigger id="edit_kategori">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                {kategoriList.map((kat) => (
                  <SelectItem key={kat.id} value={kat.id}>
                    [{kat.kode_kategori}] {kat.nama_kategori}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit_judul">Judul Dokumen *</FieldLabel>
            <Input
              id="edit_judul"
              value={editJudul}
              onChange={(e) => setEditJudul(e.target.value)}
              required
            />
          </Field>

          {isEditIKCategory && (
            <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">
                Spesifikasi Instruksi Kerja (IK)
              </p>

              <Field>
                <FieldLabel htmlFor="edit_parameter_uji">Parameter Mutu Air</FieldLabel>
                <Select value={editParameterUji} onValueChange={(val) => val && setEditParameterUji(val)}>
                  <SelectTrigger id="edit_parameter_uji" className="bg-background">
                    <SelectValue placeholder="Pilih Parameter" />
                  </SelectTrigger>
                  <SelectContent>
                    {parameterList.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit_metode_pengujian">Metode / Acuan Resmi SNI</FieldLabel>
                <Input
                  id="edit_metode_pengujian"
                  value={editMetodePengujian}
                  onChange={(e) => setEditMetodePengujian(e.target.value)}
                  className="bg-background"
                />
              </Field>
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="edit_file_path">Path / URL Berkas PDF</FieldLabel>
            <Input
              id="edit_file_path"
              value={editFilePath}
              onChange={(e) => setEditFilePath(e.target.value)}
              className="font-mono text-xs"
              required
            />
            <FieldDescription className="text-[11px]">
              Jika URL PDF diubah, sistem otomatis menaikkan nomor versi (+1).
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="edit_deskripsi">Deskripsi / Ruang Lingkup</FieldLabel>
            <Input
              id="edit_deskripsi"
              value={editDeskripsi}
              onChange={(e) => setEditDeskripsi(e.target.value)}
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUpdating}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : (
                'Perbarui Dokumen'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
