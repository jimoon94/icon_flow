"use client";

import { useRef, useMemo, useEffect, useState, memo } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { IconMeta } from "@/types/icon";
import IconCard from "./IconCard";
import { loadTabler, loadLucide, loadMaterial, getTablerIcon, getLucideIcon, getMaterialIcon } from "@/lib/iconLoader";

const CARD_SIZE = 72;
const GAP = 4;
const LIST_ROW_HEIGHT = 44;

const SET_BADGE: Record<string, { label: string; className: string }> = {
  gcp: { label: "GCP", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  aws: { label: "AWS", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  tabler: { label: "Tabler", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  lucide: { label: "Lucide", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  material: { label: "Material", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

const CATEGORY_LABEL: Record<string, string> = {
  "compute": "Compute", "storage-database": "Storage", "networking": "Networking",
  "security-identity": "Security", "messaging-queue": "Messaging", "monitoring-logging": "Monitoring",
  "ai-ml": "AI/ML", "data-pipeline": "Data", "api-integration": "API", "devops-cicd": "DevOps",
  "frontend-client": "Frontend", "media": "Media", "navigation": "Navigation",
  "people-social": "Social", "maps-location": "Maps", "finance": "Finance",
  "editor": "Editor", "brand": "Brand", "general-ui": "General", "diagram-primitives": "Diagram",
};

function SmallIcon({ icon }: { icon: IconMeta }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (icon.tablerName) loadTabler().then(() => { if (!cancelled) forceUpdate(n => n + 1); });
    else if (icon.lucideName) loadLucide().then(() => { if (!cancelled) forceUpdate(n => n + 1); });
    else if (icon.materialName) loadMaterial().then(() => { if (!cancelled) forceUpdate(n => n + 1); });
    return () => { cancelled = true; };
  }, [icon.tablerName, icon.lucideName, icon.materialName]);

  if (icon.svgUrl) return <img src={icon.svgUrl} alt={icon.name} className="w-5 h-5 object-contain" />;

  const Component = icon.tablerName ? getTablerIcon(icon.tablerName)
    : icon.lucideName ? getLucideIcon(icon.lucideName)
    : icon.materialName ? getMaterialIcon(icon.materialName)
    : null;

  if (!Component) return <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />;
  if (icon.tablerName) return <span className="text-gray-800 dark:text-gray-200"><Component size={20} stroke={2} color="currentColor" /></span>;
  if (icon.lucideName) return <span className="text-gray-800 dark:text-gray-200"><Component size={20} strokeWidth={2} color="currentColor" /></span>;
  return <span className="text-gray-800 dark:text-gray-200"><Component sx={{ fontSize: 20 }} /></span>;
}

const IconListRow = memo(function IconListRow({
  icon, isFavorite, onSelect, onToggleFavorite,
}: {
  icon: IconMeta;
  isFavorite: boolean;
  onSelect: (icon: IconMeta) => void;
  onToggleFavorite?: (id: string) => void;
}) {
  const badge = SET_BADGE[icon.set];
  return (
    <div
      className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
      style={{ height: LIST_ROW_HEIGHT }}
      onClick={(e) => { e.stopPropagation(); onSelect(icon); }}
    >
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-md">
        <SmallIcon icon={icon} />
      </div>
      <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate">{icon.name}</span>
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${badge?.className ?? "bg-gray-100 text-gray-500"}`}>
        {badge?.label ?? icon.set}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 w-16 text-right">
        {CATEGORY_LABEL[icon.category] ?? icon.category}
      </span>
      {onToggleFavorite && (
        <button
          className={`flex-shrink-0 transition-opacity cursor-pointer ${
            isFavorite ? "opacity-100 text-red-400" : "opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-400"
          }`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(icon.id); }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      )}
    </div>
  );
});

interface IconGridProps {
  icons: IconMeta[];
  viewMode?: "grid" | "list";
  highlightedIds?: string[];
  favoriteIds?: string[];
  onSelect: (icon: IconMeta) => void;
  onToggleFavorite?: (id: string) => void;
}

export default function IconGrid({ icons, viewMode = "grid", highlightedIds = [], favoriteIds = [], onSelect, onToggleFavorite }: IconGridProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(10);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (viewMode !== "grid") return;
    const el = listRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setContainerWidth(width);
      setCols(Math.max(2, Math.floor(width / (CARD_SIZE + GAP))));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewMode]);

  const cardSize = containerWidth > 0 && cols > 0
    ? Math.floor((containerWidth - GAP * (cols - 1)) / cols)
    : CARD_SIZE;

  const gridRows = useMemo(() => {
    if (viewMode !== "grid") return [];
    const result: IconMeta[][] = [];
    for (let i = 0; i < icons.length; i += cols) result.push(icons.slice(i, i + cols));
    return result;
  }, [icons, cols, viewMode]);

  const gridVirtualizer = useWindowVirtualizer({
    count: viewMode === "grid" ? gridRows.length : 0,
    estimateSize: () => cardSize + GAP,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  const listVirtualizer = useWindowVirtualizer({
    count: viewMode === "list" ? icons.length : 0,
    estimateSize: () => LIST_ROW_HEIGHT,
    overscan: 10,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  if (icons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">검색 결과가 없습니다</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div ref={listRef} className="overflow-x-hidden">
        <div style={{ height: listVirtualizer.getTotalSize(), position: "relative" }}>
          {listVirtualizer.getVirtualItems().map((virtualRow) => {
            const icon = icons[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: "absolute",
                  top: virtualRow.start - listVirtualizer.options.scrollMargin,
                  left: 0, right: 0,
                  height: LIST_ROW_HEIGHT,
                }}
              >
                <IconListRow
                  icon={icon}
                  isFavorite={favoriteIds.includes(icon.id)}
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="overflow-x-hidden">
      <div style={{ height: gridVirtualizer.getTotalSize(), position: "relative" }}>
        {gridVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowIcons = gridRows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: virtualRow.start - gridVirtualizer.options.scrollMargin,
                left: 0, right: 0,
                height: cardSize,
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: GAP,
              }}
            >
              {rowIcons.map((icon) => (
                <IconCard
                  key={icon.id}
                  icon={icon}
                  highlighted={highlightedIds.includes(icon.id)}
                  isFavorite={favoriteIds.includes(icon.id)}
                  onSelect={onSelect}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
