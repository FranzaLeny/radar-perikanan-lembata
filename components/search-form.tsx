'use client';

import { SearchIcon } from 'lucide-react';

import { Field, FieldLabel } from '@/components/shadcn/field';
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/shadcn/sidebar';

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
	return (
		<form {...props} onSubmit={(e) => e.preventDefault()}>
			<SidebarGroup className='px-2 py-0'>
				<SidebarGroupContent className='relative'>
					<Field>
						<FieldLabel className='sr-only' htmlFor='sidebar-search'>
							Cari Menu
						</FieldLabel>
						<SidebarInput
							className='h-8 border-muted-foreground/20 bg-muted/40 pl-8 text-xs focus-visible:ring-1'
							id='sidebar-search'
							placeholder='Cari menu & fitur...'
						/>
						<SearchIcon className='pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 select-none text-muted-foreground opacity-50' />
					</Field>
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	);
}
