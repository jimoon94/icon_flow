"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ICONS } from "@/data/icons";
import { RECOMMEND_PACKS } from "@/data/packs";
import { IconMeta, IconSet, Category, RecommendPack } from "@/types/icon";
import { searchIcons } from "@/lib/search";
import { getPackIcons } from "@/lib/getPackIcons";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import IconGrid from "@/components/IconGrid";
import IconDetailPanel from "@/components/IconDetailPanel";
import ThemeToggle from "@/components/ThemeToggle";
import FavoritesPage from "@/components/FavoritesPage";
import PackPage from "@/components/PackPage";
import { useFavorites } from "@/lib/useFavorites";
import { useSearchHistory } from "@/lib/useSearchHistory";
import LogoIcon from "@/components/LogoIcon";

type Tab = "icons" | "favorites" | "recommend";

const TABS: { value: Tab; label: string }[] = [
  { value: "icons", label: "Icons" },
  { value: "favorites", label: "Favorites" },
  { value: "recommend", label: "Packs" },
];

const ViewToggle = ({ viewMode, onChange }: { viewMode: "grid" | "list"; onChange: (m: "grid" | "list") => void }) => (
  <div className="flex items-center gap-1">
    <button
      onClick={() => onChange("grid")}
      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "grid" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
      title="그리드 뷰"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    </button>
    <button
      onClick={() => onChange("list")}
      className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === "list" ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
      title="리스트 뷰"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="4" width="18" height="2.5" rx="1"/><rect x="3" y="10.75" width="18" height="2.5" rx="1"/>
        <rect x="3" y="17.5" width="18" height="2.5" rx="1"/>
      </svg>
    </button>
  </div>
);

const VALID_TABS: Tab[] = ["icons", "favorites", "recommend"];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") as Tab | null;
  const tab: Tab = rawTab && VALID_TABS.includes(rawTab) ? rawTab : "icons";

  const setTab = (next: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.push(`?${params.toString()}`);
  };
  const [query, setQuery] = useState<string>("");
  const [selectedSets, setSelectedSets] = useState<IconSet[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconMeta | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPack, setSelectedPack] = useState<RecommendPack | null>(null);
  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();
  const { history: searchHistory, addSearch, removeSearch } = useSearchHistory();

  const toggleSet = (set: IconSet) => {
    setSelectedSets((prev) =>
      prev.includes(set) ? prev.filter((s) => s !== set) : [...prev, set]
    );
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedSets([]);
    setSelectedCategories([]);
    setQuery("");
  };

  const filteredIcons = useMemo(() => {
    let result = searchIcons(query, ICONS);
    if (selectedSets.length > 0) result = result.filter((icon) => selectedSets.includes(icon.set));
    if (selectedCategories.length > 0) result = result.filter((icon) => selectedCategories.includes(icon.category));
    if (!query.trim()) result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [query, selectedSets, selectedCategories]);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-950">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 h-screen sticky top-0 flex flex-col bg-white dark:bg-gray-950">
        <div className="px-5 py-3 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 h-[42px]">
            <LogoIcon size={24} />
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Pickon</h1>
          </div>
        </div>

        {/* 탐색/즐겨찾기 필터 */}
        <div className={`flex-1 overflow-y-auto px-5 pb-5 ${tab === "recommend" ? "hidden" : ""}`}>
          <Sidebar
            selectedSets={selectedSets}
            selectedCategories={selectedCategories}
            onSetChange={toggleSet}
            onResetSets={() => setSelectedSets([])}
            onCategoryChange={toggleCategory}
            onResetCategories={() => setSelectedCategories([])}
            onReset={resetFilters}
            totalCount={tab === "favorites" ? favoriteIds.length : ICONS.length}
            sourceIcons={tab === "favorites" ? ICONS.filter(i => favoriteIds.includes(i.id)) : undefined}
          />
        </div>

        {/* 팩 목록 */}
        {tab === "recommend" && (
          <div className="flex-1 overflow-y-auto py-3">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 px-5">Packs</p>
            {RECOMMEND_PACKS.map((pack) => {
              const count = getPackIcons(pack).length;
              const isSelected = selectedPack?.id === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(isSelected ? null : pack)}
                  className={`w-full flex items-center gap-2.5 px-5 py-2 text-left transition-colors ${
                    isSelected
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-base flex-shrink-0">{pack.emoji}</span>
                  <span className="flex-1 text-sm truncate">{pack.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{count.toLocaleString()}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-1 flex-shrink-0">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  tab === value
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              history={searchHistory}
              onAddHistory={addSearch}
              onRemoveHistory={removeSearch}
            />
          </div>
          <ThemeToggle />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          {tab === "icons" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400">{filteredIcons.length.toLocaleString()} icons</p>
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
              </div>
              <IconGrid
                icons={filteredIcons}
                viewMode={viewMode}
                favoriteIds={favoriteIds}
                onSelect={setSelectedIcon}
                onToggleFavorite={toggleFavorite}
              />
            </>
          )}
          {tab === "favorites" && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400">{favoriteIds.length.toLocaleString()} icons</p>
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
              </div>
              <FavoritesPage
                favoriteIds={favoriteIds}
                query={query}
                viewMode={viewMode}
                selectedSets={selectedSets}
                selectedCategories={selectedCategories}
                onSelect={setSelectedIcon}
                onToggleFavorite={toggleFavorite}
              />
            </>
          )}
          {tab === "recommend" && (
            <PackPage
              selectedPack={selectedPack}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSelect={setSelectedIcon}
              onToggleFavorite={toggleFavorite}
              favoriteIds={favoriteIds}
              query={query}
            />
          )}
        </div>
      </div>

      {selectedIcon && (
        <IconDetailPanel
          icon={selectedIcon}
          isFavorite={isFavorite(selectedIcon.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedIcon(null)}
        />
      )}
    </div>
  );
}
