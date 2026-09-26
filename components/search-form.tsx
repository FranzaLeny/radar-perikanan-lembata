"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props} onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="py-0 px-2">
        <SidebarGroupContent className="relative">
          <Field>
            <FieldLabel htmlFor="sidebar-search" className="sr-only">
              Cari Menu
            </FieldLabel>
            <SidebarInput
              id="sidebar-search"
              placeholder="Cari menu & fitur..."
              className="pl-8 text-xs h-8 bg-muted/40 border-muted-foreground/20 focus-visible:ring-1"
            />
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 opacity-50 select-none text-muted-foreground" />
          </Field>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
