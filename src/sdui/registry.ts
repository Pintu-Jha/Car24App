// src/sdui/registry.ts
// Component registry — maps section.type strings to React Native components.
// Adding a new type: just add one line here. No renderer changes needed.
// Missing types fall through to UnknownFallback — renderer never crashes.

import React from 'react';
import { CardGrid } from '@/components/CardGrid';
import { CardRail } from '@/components/CardRail';
import { CategoryQuicklinks } from '@/components/CategoryQuicklinks';
import { HeaderSearch } from '@/components/HeaderSearch';
import { IconRail } from '@/components/IconRail';
import { ListRows } from '@/components/ListRows';
import { SectionHeader } from '@/components/SectionHeader';

export const componentRegistry: Record<string, any> = {
  header_search: HeaderSearch,
  category_quicklinks: CategoryQuicklinks,
  card_rail: CardRail,
  icon_rail: IconRail,
  card_grid: CardGrid,
  list_rows: ListRows,
  section_header: SectionHeader,
  // unknown_fallback is NEVER in the registry — it's the renderer's internal catch-all.
  // To add a new type: import its component above and add it here.
};
