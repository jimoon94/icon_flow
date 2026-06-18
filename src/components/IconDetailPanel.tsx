"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { saveAs } from "file-saver";
import { IconMeta } from "@/types/icon";
import { loadTabler, loadLucide, loadMaterial, getTablerIcon, getLucideIcon, getMaterialIcon } from "@/lib/iconLoader";

interface Props {
  icon: IconMeta;
  onClose: () => void;
}

function DynamicIconPreview({
  icon,
  size,
  strokeWidth,
  color,
  previewRef,
}: {
  icon: IconMeta;
  size: number;
  strokeWidth: number;
  color: string;
  previewRef: React.RefObject<HTMLDivElement | null>;
}) {
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
      <div ref={previewRef}>
        <img src={icon.svgUrl} alt={icon.name} style={{ width: size, height: size }} className="object-contain" />
      </div>
    );
  }

  if (!Component) {
    return <div style={{ width: size, height: size }} className="bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />;
  }

  return (
    <div ref={previewRef}>
      <span style={{ color }}>
        {icon.tablerName
          ? <Component size={size} stroke={strokeWidth} color={color} />
          : icon.lucideName
          ? <Component size={size} strokeWidth={strokeWidth} color={color} />
          : <Component sx={{ fontSize: size }} />
        }
      </span>
    </div>
  );
}

const SET_BADGE: Record<string, string> = {
  gcp: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  aws: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  azure: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  tabler: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  lucide: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export default function IconDetailPanel({ icon, onClose }: Props) {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState(() => resolvedTheme === "dark" ? "#ffffff" : "#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [size, setSize] = useState(48);
  const [copied, setCopied] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  const getSvgString = () => {
    const svg = previewRef.current?.querySelector("svg");
    return svg?.outerHTML ?? null;
  };

  const copyWithFeedback = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleCopySvg = () => {
    const svg = getSvgString();
    if (svg) copyWithFeedback(svg, "svg");
  };

  const handleCopyId = () => copyWithFeedback(icon.id, "id");

  const handleCopyImport = () => {
    let text = "";
    if (icon.tablerName) text = `import { ${icon.tablerName} } from '@tabler/icons-react';`;
    else if (icon.lucideName) text = `import { ${icon.lucideName} } from 'lucide-react';`;
    else text = icon.id;
    copyWithFeedback(text, "import");
  };

  const handleDownload = () => {
    const svg = getSvgString();
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      saveAs(blob, `${icon.id}.svg`);
    } else if (icon.svgUrl) {
      saveAs(icon.svgUrl, `${icon.id}.svg`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 배경 오버레이 — 클릭 시 닫기 */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40" onClick={onClose} />

      {/* 패널 */}
      <div
        className="relative w-72 h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{icon.name}</p>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${SET_BADGE[icon.set] ?? "bg-gray-100 text-gray-500"}`}>
              {icon.set}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg">✕</button>
        </div>

        {/* 미리보기 */}
        <div className="flex items-center justify-center py-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <DynamicIconPreview
            icon={icon}
            size={size}
            strokeWidth={strokeWidth}
            color={color}
            previewRef={previewRef}
          />
        </div>

        {/* 커스터마이저 */}
        <div className="flex-1 px-5 py-5 space-y-5 overflow-y-auto">
          {!icon.svgUrl && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500 dark:text-gray-400">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-gray-200 dark:border-gray-700"
                  />
                  <span className="text-xs text-gray-400 font-mono">{color}</span>
                </div>
              </div>
            </div>
          )}

          {!icon.svgUrl && !icon.materialName && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400">Stroke width</label>
                <span className="text-xs text-gray-400">{strokeWidth}px</span>
              </div>
              <input
                type="range" min="0.5" max="3" step="0.25"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-full accent-gray-800 dark:accent-gray-200"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-500 dark:text-gray-400">Size</label>
              <span className="text-xs text-gray-400">{size}px</span>
            </div>
            <input
              type="range" min="16" max="96" step="8"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-gray-800 dark:accent-gray-200"
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <button
            onClick={handleCopySvg}
            className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-lg hover:bg-black dark:hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {copied === "svg" ? "✓ Copied!" : "Copy SVG"}
          </button>
          <button
            onClick={handleCopyId}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {copied === "id" ? "✓ Copied!" : "Copy ID"}
          </button>
          {(icon.tablerName || icon.lucideName) && (
            <button
              onClick={handleCopyImport}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {copied === "import" ? "✓ Copied!" : "Copy import"}
            </button>
          )}
          <button
            onClick={handleDownload}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}
