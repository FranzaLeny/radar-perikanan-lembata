import type { KategoriItem } from '../client';

export type KategoriWithCount = KategoriItem & { documentCount?: number };

export interface KategoriDokumenClientProps {
  initialList: KategoriWithCount[];
}
