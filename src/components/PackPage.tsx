"use client";

import { useMemo } from "react";
import { IconMeta, RecommendPack } from "@/types/icon";
import { searchIcons } from "@/lib/search";
import { getPackIcons } from "@/lib/getPackIcons";
import IconGrid from "./IconGrid";

interface PackPageProps {
  selectedPack: RecommendPack | null;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  onSelect?: (icon: IconMeta) => void;
  onToggleFavorite?: (id: string) => void;
  favoriteIds?: string[];
  query?: string;
}

export default function PackPage({ selectedPack, viewMode = "grid", onViewModeChange, onSelect, onToggleFavorite, favoriteIds = [], query = "" }: PackPageProps) {

  const packIcons = useMemo(() => {
    if (!selectedPack) return [];
    const icons = getPackIcons(selectedPack);
    return query.trim() ? searchIcons(query, icons) : icons;
  }, [selectedPack, query]);

  if (!selectedPack) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-gray-600">
        <span className="text-4xl mb-3">📦</span>
        <p className="text-sm">왼쪽에서 팩을 선택하세요</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {selectedPack.emoji} {selectedPack.name} — {packIcons.length.toLocaleString()} icons
        </p>
        {onViewModeChange && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
              title="그리드 뷰"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
              title="리스트 뷰"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="4" width="18" height="2.5" rx="1"/><rect x="3" y="10.75" width="18" height="2.5" rx="1"/>
                <rect x="3" y="17.5" width="18" height="2.5" rx="1"/>
              </svg>
            </button>
          </div>
        )}
      </div>
      <IconGrid
        icons={packIcons}
        viewMode={viewMode}
        favoriteIds={favoriteIds}
        onSelect={onSelect ?? (() => {})}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
