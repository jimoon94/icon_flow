"use client";

import { useMemo } from "react";
import { ICONS } from "@/data/icons";
import { IconSet, Category } from "@/types/icon";

const ICON_SETS: { value: IconSet; label: string }[] = [
  { value: "gcp", label: "GCP" },
  { value: "aws", label: "AWS" },
  { value: "tabler", label: "Tabler" },
  { value: "lucide", label: "Lucide" },
  { value: "material", label: "Material" },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "compute", label: "Compute" },
  { value: "storage-database", label: "Storage & Database" },
  { value: "networking", label: "Networking" },
  { value: "security-identity", label: "Security & Identity" },
  { value: "messaging-queue", label: "Messaging & Queue" },
  { value: "monitoring-logging", label: "Monitoring & Logging" },
  { value: "ai-ml", label: "AI & ML" },
  { value: "data-pipeline", label: "Data Pipeline" },
  { value: "api-integration", label: "API & Integration" },
  { value: "devops-cicd", label: "DevOps & CI/CD" },
  { value: "frontend-client", label: "Frontend & Client" },
  { value: "media", label: "Media" },
  { value: "navigation", label: "Navigation" },
  { value: "people-social", label: "People & Social" },
  { value: "maps-location", label: "Maps & Location" },
  { value: "finance", label: "Finance" },
  { value: "editor", label: "Editor" },
  { value: "brand", label: "Brand" },
  { value: "general-ui", label: "General UI" },
  { value: "diagram-primitives", label: "Diagram Primitives" },
];

interface SidebarProps {
  selectedSets: IconSet[];
  selectedCategories: Category[];
  onSetChange: (set: IconSet) => void;
  onResetSets: () => void;
  onCategoryChange: (category: Category) => void;
  onResetCategories: () => void;
  onReset: () => void;
  totalCount: number;
}

export default function Sidebar({
  selectedSets,
  selectedCategories,
  onSetChange,
  onResetSets,
  onCategoryChange,
  onResetCategories,
  onReset,
  totalCount,
}: SidebarProps) {
  const setCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const icon of ICONS) map[icon.set] = (map[icon.set] ?? 0) + 1;
    return map;
  }, []);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    const base = selectedSets.length > 0 ? ICONS.filter(i => selectedSets.includes(i.set)) : ICONS;
    for (const icon of base) map[icon.category] = (map[icon.category] ?? 0) + 1;
    return map;
  }, [selectedSets]);

  const hasFilter = selectedSets.length > 0 || selectedCategories.length > 0;

  return (
    <aside className="text-sm text-gray-700 dark:text-gray-300">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">View</p>
        {hasFilter && (
          <button onClick={onReset} className="text-xs text-red-500 hover:text-red-700">초기화</button>
        )}
      </div>

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">Sets</p>
      <button
        onClick={onResetSets}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
          selectedSets.length === 0 ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <span>All</span>
        <span className="text-xs text-gray-400">{totalCount.toLocaleString()}</span>
      </button>
      {ICON_SETS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSetChange(value)}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
            selectedSets.includes(value)
              ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <span>{label}</span>
          <span className="text-xs text-gray-400">{(setCounts[value] ?? 0).toLocaleString()}</span>
        </button>
      ))}

      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1 px-2">Categories</p>
      <button
        onClick={onResetCategories}
        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
          selectedCategories.length === 0 ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <span>All</span>
        <span className="text-xs text-gray-400">
          {(selectedSets.length > 0 ? ICONS.filter(i => selectedSets.includes(i.set)).length : totalCount).toLocaleString()}
        </span>
      </button>
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onCategoryChange(value)}
          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors ${
            selectedCategories.includes(value)
              ? "bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <span>{label}</span>
          <span className="text-xs text-gray-400">{(categoryCounts[value] ?? 0).toLocaleString()}</span>
        </button>
      ))}
    </aside>
  );
}
