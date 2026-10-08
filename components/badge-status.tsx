import { AlertOctagon, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type React from 'react';

import { Badge } from '@/components/shadcn/badge';
import { cn } from '@/lib/utils';

type BadgeStatusProps = {
	status: 'MEMENUHI' | 'MELEBIHI' | 'DIBAWAH' | 'NORMAL' | 'PERINGATAN' | 'KRITIS' | string;
	size?: 'sm' | 'md' | 'lg';
	showIcon?: boolean;
	className?: string;
};

export function BadgeStatus({ status, size = 'md', showIcon = true, className }: BadgeStatusProps) {
	const normalized = status ? status.toUpperCase() : 'NORMAL';

	let config: {
		badgeClass: string;
		icon: React.ElementType;
		iconClass: string;
		label: string;
		variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
	} = {
		badgeClass:
			'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
		icon: CheckCircle2,
		iconClass: 'text-emerald-600 dark:text-emerald-400',
		label: normalized,
		variant: 'outline'
	};

	if (normalized === 'MEMENUHI' || normalized === 'NORMAL') {
		config = {
			badgeClass:
				'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
			icon: CheckCircle2,
			iconClass: 'text-emerald-600 dark:text-emerald-400',
			label: normalized === 'NORMAL' ? 'Kondisi Normal' : 'Memenuhi Standar',
			variant: 'outline' as const
		};
	} else if (normalized === 'PERINGATAN' || normalized === 'DIBAWAH') {
		config = {
			badgeClass:
				'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
			icon: AlertTriangle,
			iconClass: 'text-amber-600 dark:text-amber-400',
			label: normalized === 'PERINGATAN' ? 'Peringatan' : 'Di Bawah Standar (Rendah)',
			variant: 'outline' as const
		};
	} else if (normalized === 'KRITIS' || normalized === 'MELEBIHI') {
		config = {
			badgeClass: 'bg-destructive/15 text-destructive border-destructive/30 dark:bg-destructive/25',
			icon: AlertOctagon,
			iconClass: 'text-destructive',
			label: normalized === 'KRITIS' ? 'Kritis' : 'Melebihi Ambang Batas',
			variant: 'destructive' as const
		};
	} else {
		config = {
			badgeClass: 'border-border bg-muted/60 text-muted-foreground',
			icon: Info,
			iconClass: 'text-muted-foreground',
			label: normalized,
			variant: 'secondary' as const
		};
	}

	const IconComponent = config.icon;

	const sizeClasses = {
		sm: '',
		md: 'h-6 px-2.5 gap-1.5',
		lg: 'text-sm h-7 px-3.5 gap-2 font-semibold'
	};

	const iconSizes = { sm: 12, md: 14, lg: 16 };

	return (
		<Badge
			className={cn('shadow-2xs', config.badgeClass, sizeClasses[size], className)}
			variant={config.variant}
		>
			{showIcon && (
				<IconComponent
					className={cn('pointer-events-none shrink-0', config.iconClass)}
					size={iconSizes[size]}
				/>
			)}
			<span>{config.label}</span>
		</Badge>
	);
}
