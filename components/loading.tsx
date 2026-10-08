import { cn } from 'cn';

import { Spinner } from './shadcn/spinner';

type LoadingProps = React.ComponentProps<'div'> & {
	spinnerProps?: React.ComponentProps<typeof Spinner>;
};

export const LoadingOverlay = ({ className, children, spinnerProps, ...props }: LoadingProps) => {
	return (
		<div
			className={cn(
				'absolute inset-0 z-52 hidden size-full cursor-wait items-center justify-center gap-2 rounded-xl backdrop-blur-xs data-[loading=true]:flex print:hidden',
				className
			)}
			{...props}
		>
			<Spinner {...spinnerProps} className={cn('size-10', spinnerProps?.className)} />
			{children}
		</div>
	);
};
export const Loading = ({ className, children, spinnerProps, ...props }: LoadingProps) => {
	return (
		<div
			className={cn(
				'inset-0 flex size-full cursor-wait items-center justify-center gap-2 print:hidden',
				className
			)}
			{...props}
		>
			<Spinner {...spinnerProps} className={cn('size-10', spinnerProps?.className)} />
			{children}
		</div>
	);
};

export const PageLoading = (
	props: React.ComponentProps<'div'> & { spinnerProps?: React.ComponentProps<typeof Spinner> }
) => {
	return (
		<Loading
			{...props}
			className={cn(
				'fixed z-999 flex size-10 h-full w-full items-center justify-center backdrop-brightness-50 print:hidden',
				props.className
			)}
		/>
	);
};
