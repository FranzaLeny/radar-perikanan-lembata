import { z } from 'zod';

export const uuidSchema = z.string().uuid({ message: 'ID harus berformat UUID yang valid' });

export const koordinatSchema = z
	.string()
	.regex(/^-?\d{1,3}\.\d+,\s*-?\d{1,3}\.\d+$/, {
		message: 'Format titik koordinat harus: [latitude], [longitude] (contoh: -8.37123, 123.54123)'
	});

export const kodeIkSchema = z
	.string()
	.min(1, { message: 'Kode IK wajib diisi' })
	.regex(/^IK-[A-Za-z0-9-]+$/, {
		message: 'Format kode IK harus dimulai dengan IK- (contoh: IK-001, IK-SOP-01)'
	});
