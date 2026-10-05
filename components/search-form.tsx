'use client';

import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/shadcn/sidebar';

export function SearchForm({ ...props }: React.ComponentProps<'form'>) {
	return (
		<form {...props} onSubmit={(e) => e.preventDefault()}>
			<SidebarGroup className='px-2 py-0'>
				<SidebarGroupContent className='relative'>
					<SidebarInput id='sidebar-search' placeholder='Cari menu & fitur...' />
				</SidebarGroupContent>
			</SidebarGroup>
		</form>
	);
}
