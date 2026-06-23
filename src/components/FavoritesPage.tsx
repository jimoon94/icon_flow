"use client";

import { useMemo } from "react";
import { ICONS } from "@/data/icons";
import { IconMeta, IconSet, Category } from "@/types/icon";
import { searchIcons } from "@/lib/search";
import IconGrid from "./IconGrid";

interface FavoritesPageProps {
  favoriteIds: string[];
  query?: string;
  viewMode: "grid" | "list";
  selectedSets?: IconSet[];
  selectedCategories?: Category[];
  onSelect: (icon: IconMeta) => void;
  onToggleFavorite: (id: string) => void;
}

export default function FavoritesPage({ favoriteIds, query = "", viewMode, selectedSets = [], selectedCategories = [], onSelect, onToggleFavorite }: FavoritesPageProps) {
  const favoriteIcons = useMemo(() => {
    let result = ICONS.filter((i) => favoriteIds.includes(i.id));
    if (selectedSets.length > 0) result = result.filter((i) => selectedSets.includes(i.set));
    if (selectedCategories.length > 0) result = result.filter((i) => selectedCategories.includes(i.category));
    return query.trim() ? searchIcons(query, result) : result;
  }, [favoriteIds, query, selectedSets, selectedCategories]);

  if (favoriteIcons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-gray-600">
        <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="text-sm">즐겨찾기한 아이콘이 없습니다</p>
        <p className="text-xs mt-1 text-gray-300 dark:text-gray-700">아이콘 위에서 ♡ 버튼을 클릭하세요</p>
      </div>
    );
  }

  return (
    <div>
      <IconGrid
        icons={favoriteIcons}
        viewMode={viewMode}
        favoriteIds={favoriteIds}
        onSelect={onSelect}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
