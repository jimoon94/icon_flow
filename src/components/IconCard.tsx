"use client";

import { useEffect, useState, memo } from "react";
import { IconMeta } from "@/types/icon";
import { loadTabler, loadLucide, loadMaterial, getTablerIcon, getLucideIcon, getMaterialIcon } from "@/lib/iconLoader";

interface IconCardProps {
  icon: IconMeta;
  highlighted?: boolean;
  onSelect: (icon: IconMeta) => void;
}

const SET_BADGE: Record<string, { label: string; className: string }> = {
  gcp: { label: "GCP", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  aws: { label: "AWS", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  tabler: { label: "Tabler", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  lucide: { label: "Lucide", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  material: { label: "Material", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

function DynamicIcon({ icon }: { icon: IconMeta }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (icon.tablerName) {
      loadTabler().then(() => { if (!cancelled) forceUpdate((n) => n + 1); });
    } else if (icon.lucideName) {
      loadLucide().then(() => { if (!cancelled) forceUpdate((n) => n + 1); });
    } else if (icon.materialName) {
      loadMaterial().then(() => { if (!cancelled) forceUpdate((n) => n + 1); });
    }
    return () => { cancelled = true; };
  }, [icon.tablerName, icon.lucideName, icon.materialName]);

  const Component = icon.tablerName
    ? getTablerIcon(icon.tablerName)
    : icon.lucideName
    ? getLucideIcon(icon.lucideName)
    : icon.materialName
    ? getMaterialIcon(icon.materialName)
    : null;

  if (icon.svgUrl) {
    return (
      <img
        src={icon.svgUrl}
        alt={icon.name}
        className="w-6 h-6 object-contain"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }

  if (!Component) {
    return <div className="w-6 h-6 bg-gray-50 rounded animate-pulse" />;
  }

  if (icon.tablerName) {
    return <span className="text-gray-900 dark:text-gray-100"><Component size={24} stroke={2} color="currentColor" /></span>;
  }
  if (icon.lucideName) {
    return <span className="text-gray-900 dark:text-gray-100"><Component size={24} strokeWidth={2} color="currentColor" /></span>;
  }
  return <span className="text-gray-900 dark:text-gray-100"><Component sx={{ fontSize: 24 }} /></span>;
}

const IconCard = memo(function IconCard({ icon, highlighted = false, onSelect }: IconCardProps) {
  const badge = SET_BADGE[icon.set];

  return (
    <div
      className={`group relative flex flex-col items-center justify-center gap-1 rounded-lg border transition-all cursor-pointer ${
        highlighted
          ? "border-blue-400 bg-blue-50 dark:bg-blue-950"
          : "border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
      }`}
      style={{ aspectRatio: "1", padding: 10 }}
      onClick={() => onSelect(icon)}
      title={icon.name}
    >
      <DynamicIcon icon={icon} />
      <span className={`text-[8px] font-semibold px-1 py-0.5 rounded-full leading-none ${badge?.className ?? "bg-gray-100 text-gray-500"}`}>
        {badge?.label ?? icon.set}
      </span>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
        {icon.name}
      </div>
    </div>
  );
});

export default IconCard;
