import { Droplets, Plus } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/shadcn/card';
import type {
	BakuMutuItem,
	EvaluatedParameterRow,
	IKItem,
	OptionItem,
	ParameterRow
} from '../types';
import { ParameterRowItem } from './parameter-row-item';

type ParameterTableSectionProps = {
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
};

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
	onOverrideMaxChange
}: ParameterTableSectionProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between border-b pb-3'>
				<div>
					<CardTitle>2. Parameter Mutu Air & Instruksi Kerja (IK) Terkait</CardTitle>
					<CardDescription className='text-xs'>
						Setiap baris parameter wajib dihubungkan ke Instruksi Kerja (IK) yang digunakan beserta metode
						pengujian resminya.
					</CardDescription>
				</div>
				<Button
					className='cursor-pointer gap-1.5 text-xs'
					onClick={onAddParameterRow}
					size='sm'
					type='button'
					variant='outline'
				>
					<Plus className='size-3.5' />
					<span>Tambah Parameter</span>
				</Button>
			</CardHeader>

			<CardContent className='space-y-3 pt-4'>
				{parameterRows.length === 0 ? (
					<div className='border-border bg-muted/20 rounded-xl border-2 border-dashed px-4 py-10 text-center'>
						<Droplets className='text-muted-foreground/60 mx-auto mb-2 size-8' />
						<p className='text-foreground text-xs font-semibold'>Belum Ada Parameter Uji Ditambahkan</p>
						<p className='text-muted-foreground mx-auto mt-1 max-w-sm text-xs'>
							Pilih dan tambahkan parameter uji. Sistem akan otomatis memfilter Instruksi Kerja (IK) dan
							metode resmi yang sesuai.
						</p>
						<Button
							className='mt-4 cursor-pointer gap-1.5 text-xs'
							onClick={onAddParameterRow}
							size='sm'
							type='button'
						>
							<Plus className='size-3.5' />
							<span>Tambah Parameter Pertama</span>
						</Button>
					</div>
				) : (
					<div className='space-y-3'>
						{parameterRows.map((row, idx) => {
							const evalRow = evaluatedRows.find((r) => r.tempId === row.tempId);
							const currentBm = bakuMutuMap.get(row.baku_mutu_id);
							const currentOption = bakuMutuOptions.find((b) => b.value === row.baku_mutu_id) || null;
							const selectedIkDoc = ikMap.get(row.ik_id) || null;

							return (
								<ParameterRowItem
									bakuMutuOptions={bakuMutuOptions}
									currentBm={currentBm}
									currentOption={currentOption}
									evalRow={evalRow}
									idx={idx}
									ikList={ikList}
									key={row.tempId}
									onOverrideMaxChange={onOverrideMaxChange}
									onOverrideMinChange={onOverrideMinChange}
									onRemoveRow={onRemoveParameterRow}
									onSelectBakuMutu={onSelectBakuMutu}
									onSelectIk={onSelectIk}
									onToggleCustomAmbang={onToggleCustomAmbang}
									onValueChange={onValueChange}
									row={row}
									selectedIkDoc={selectedIkDoc}
									suhuLingkungan={suhuLingkungan}
								/>
							);
						})}

						<Button
							className='text-muted-foreground hover:text-foreground w-full cursor-pointer gap-1.5 border-dashed text-xs'
							onClick={onAddParameterRow}
							size='sm'
							type='button'
							variant='outline'
						>
							<Plus className='size-3.5' />
							<span>Tambah Parameter Uji Lainnya</span>
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
