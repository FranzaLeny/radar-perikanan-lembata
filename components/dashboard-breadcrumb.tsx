'use client';

import { usePathname } from 'next/navigation';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/shadcn/breadcrumb';
import { APP_NAME } from '@/lib/constants';

const routeLabels: Record<string, { parent?: string; title: string }> = {
	'/dashboard': { title: 'Dashboard Utama' },
	'/uji-kualitas': { parent: 'Operasional', title: 'Daftar Hasil Uji' },
	'/uji-kualitas/input': { parent: 'Uji Kualitas Air', title: 'Input Uji Lapangan' },
	'/instruksi-kerja': { parent: 'Operasional', title: 'Instruksi Kerja & Jadwal Sampel' },
	'/lokasi-kolam': { parent: 'Master Data', title: 'Lokasi Kolam Pembudidaya' },
	'/baku-mutu': { parent: 'Master Data', title: 'Baku Mutu Air SNI & KKP' },
	'/pegawai': { parent: 'Master Data', title: 'Pegawai & Pejabat TTD' },
	'/pengguna': { parent: 'Master Data', title: 'Manajemen Pengguna' },
	'/tren': { parent: 'Analitik', title: 'Grafik Tren Mutu Air' },
	'/laporan': { parent: 'Laporan', title: 'Laporan Hasil Uji (LHU)' },
	'/laporan/rekap-tahunan': { parent: 'Laporan', title: 'Rekapitulasi Tahunan' }
};

export function DashboardBreadcrumb() {
	const pathname = usePathname();
	const current = routeLabels[pathname] || { title: 'Sistem Informasi Mutu Air' };

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem className='hidden md:block'>
					<BreadcrumbLink className='text-xs' href='/dashboard'>
						{APP_NAME}
					</BreadcrumbLink>
				</BreadcrumbItem>
				{current.parent && (
					<>
						<BreadcrumbSeparator className='hidden md:block' />
						<BreadcrumbItem className='hidden md:block'>
							<span className='text-muted-foreground text-xs'>{current.parent}</span>
						</BreadcrumbItem>
					</>
				)}
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage className='font-medium text-xs'>{current.title}</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
