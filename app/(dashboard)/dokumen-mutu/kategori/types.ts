import type { KategoriItem } from '../client';

export type KategoriWithCount = KategoriItem & { documentCount?: number };

export type KategoriDokumenClientProps = { initialList: KategoriWithCount[] };
