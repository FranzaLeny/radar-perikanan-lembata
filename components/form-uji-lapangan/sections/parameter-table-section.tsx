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
					<CardTitle>
						2. Parameter Mutu Air & Instruksi Kerja (IK) Terkait
					</CardTitle>
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
					<div className='rounded-xl border-2 border-border border-dashed bg-muted/20 px-4 py-10 text-center'>
						<Droplets className='mx-auto mb-2 size-8 text-muted-foreground/60' />
						<p className='font-semibold text-foreground text-xs'>Belum Ada Parameter Uji Ditambahkan</p>
						<p className='mx-auto mt-1 max-w-sm text-muted-foreground text-xs'>
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
							className='w-full cursor-pointer gap-1.5 border-dashed text-muted-foreground text-xs hover:text-foreground'
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
