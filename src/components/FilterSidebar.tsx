"use client";

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
  { value: "general-ui", label: "General UI" },
  { value: "diagram-primitives", label: "Diagram Primitives" },
];

interface FilterSidebarProps {
  selectedSets: IconSet[];
  selectedCategories: Category[];
  onSetChange: (set: IconSet) => void;
  onCategoryChange: (category: Category) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  selectedSets,
  selectedCategories,
  onSetChange,
  onCategoryChange,
  onReset,
}: FilterSidebarProps) {
  const hasFilter = selectedSets.length > 0 || selectedCategories.length > 0;

  return (
    <aside className="w-52 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">필터</h2>
        {hasFilter && (
          <button
            onClick={onReset}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            초기화
          </button>
        )}
      </div>

      <section className="mb-6">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          아이콘 세트
        </h3>
        <ul className="space-y-1.5">
          {ICON_SETS.map(({ value, label }) => (
            <li key={value}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSets.includes(value)}
                  onChange={() => onSetChange(value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          카테고리
        </h3>
        <ul className="space-y-1.5">
          {CATEGORIES.map(({ value, label }) => (
            <li key={value}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(value)}
                  onChange={() => onCategoryChange(value)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
