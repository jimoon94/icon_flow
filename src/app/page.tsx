"use client";

import { useState, useMemo } from "react";
import { ICONS } from "@/data/icons";
import { IconMeta, IconSet, Category } from "@/types/icon";
import { searchIcons } from "@/lib/search";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import IconGrid from "@/components/IconGrid";
import IconDetailPanel from "@/components/IconDetailPanel";
import ThemeToggle from "@/components/ThemeToggle";
import ComparePage from "@/components/ComparePage";
import RecommendPage from "@/components/RecommendPage";

type Tab = "explore" | "compare" | "recommend";

const TABS: { value: Tab; label: string }[] = [
  { value: "explore", label: "Icons" },
  { value: "compare", label: "Compare" },
  { value: "recommend", label: "Packs" },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>("explore");
  const [query, setQuery] = useState("");
  const [selectedSets, setSelectedSets] = useState<IconSet[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconMeta | null>(null);

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
      <div className="w-56 flex-shrink-0 border-r border-gray-100 dark:border-gray-800 p-5 overflow-y-auto h-screen sticky top-0 bg-white dark:bg-gray-950">
        <h1 className="text-base font-bold text-gray-900 dark:text-white mb-6">IconFlow</h1>

        {tab === "explore" ? (
          <Sidebar
            selectedSets={selectedSets}
            selectedCategories={selectedCategories}
            onSetChange={toggleSet}
            onResetSets={() => setSelectedSets([])}
            onCategoryChange={toggleCategory}
            onResetCategories={() => setSelectedCategories([])}
            onReset={resetFilters}
            totalCount={ICONS.length}
          />
        ) : (
          <nav className="space-y-1">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  tab === value
                    ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="flex items-center gap-1">
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
          <ThemeToggle />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-4">
          {tab === "explore" && (
            <>
              <p className="text-xs text-gray-400 mb-3">{filteredIcons.length.toLocaleString()} icons</p>
              <IconGrid icons={filteredIcons} onSelect={setSelectedIcon} />
            </>
          )}
          {tab === "compare" && <ComparePage />}
          {tab === "recommend" && <RecommendPage />}
        </div>
      </div>

      {selectedIcon && (
        <IconDetailPanel icon={selectedIcon} onClose={() => setSelectedIcon(null)} />
      )}
    </div>
  );
}
