"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { saveAs } from "file-saver";
import { IconMeta } from "@/types/icon";
import { loadTabler, loadLucide, loadMaterial, getTablerIcon, getLucideIcon, getMaterialIcon } from "@/lib/iconLoader";
import { CATEGORY_LABEL_MAP } from "@/lib/categories";

interface Props {
  icon: IconMeta;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
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

  useEffect(() => {
    if (!icon.materialName || !previewRef.current) return;
    const svg = previewRef.current.querySelector("svg");
    if (!svg) return;
    svg.style.fill = color;
    svg.querySelectorAll<SVGElement>("path, circle, rect, polygon, ellipse").forEach((el) => {
      if (el.getAttribute("fill") !== "none") el.style.fill = color;
    });
  }, [icon.materialName, color, previewRef]);

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
          ? <Component size={size} {...(!icon.tablerName.endsWith("Filled") && { stroke: strokeWidth })} color={color} />
          : icon.lucideName
          ? <Component size={size} strokeWidth={strokeWidth} color={color} />
          : <Component style={{ fontSize: `${size}px`, color }} />
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

export default function IconDetailPanel({ icon, isFavorite = false, onToggleFavorite, onClose }: Props) {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState(() => {
    if (typeof window === "undefined") return "#000000";
    return localStorage.getItem("pickon:color") ?? "#000000";
  });
  const [strokeWidth, setStrokeWidth] = useState(() => {
    if (typeof window === "undefined") return 2;
    const saved = localStorage.getItem("pickon:strokeWidth");
    return saved ? Number(saved) : 2;
  });
  const [size, setSize] = useState(() => {
    if (typeof window === "undefined") return 48;
    const saved = localStorage.getItem("pickon:size");
    return saved ? Number(saved) : 48;
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [copyTab, setCopyTab] = useState<"svg" | "id" | "import" | "component">("svg");
  const [svgContent, setSvgContent] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasLibrary = !!(icon.tablerName || icon.lucideName || icon.materialName);
  const copyTabs = ["svg", "id", ...(hasLibrary ? ["import", "component"] : [])] as ("svg" | "id" | "import" | "component")[];
  const activeCopyTab: "svg" | "id" | "import" | "component" = copyTabs.includes(copyTab) ? copyTab : "svg";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!localStorage.getItem("pickon:color")) {
      setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
    }
  }, [resolvedTheme]);

  useEffect(() => { localStorage.setItem("pickon:color", color); }, [color]);
  useEffect(() => { localStorage.setItem("pickon:strokeWidth", String(strokeWidth)); }, [strokeWidth]);
  useEffect(() => { localStorage.setItem("pickon:size", String(size)); }, [size]);

  useEffect(() => {
    if (activeCopyTab !== "svg") { setSvgContent(""); return; }
    if (icon.svgUrl) {
      fetch(icon.svgUrl).then((r) => r.text()).then((text) => setSvgContent(applySizeToSvgText(text)));
    } else {
      requestAnimationFrame(() => {
        const s = getSvgString();
        setSvgContent(s ?? "");
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCopyTab, icon.id, size, color, strokeWidth]);

  const getSvgString = () => {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return null;
    const viewBox = svg.getAttribute("viewBox") ?? "0 0 24 24";
    const fill = svg.getAttribute("fill") ?? "none";
    const strokeAttr = svg.getAttribute("stroke");
    const strokeWidthAttr = svg.getAttribute("stroke-width");
    const strokeLinecap = svg.getAttribute("stroke-linecap");
    const strokeLinejoin = svg.getAttribute("stroke-linejoin");

    const resolvedFill = fill === "currentColor" ? color : fill;
    const innerHtml = svg.innerHTML.replace(/currentColor/g, color);

    const parts = [
      `xmlns="http://www.w3.org/2000/svg"`,
      `width="${size}"`,
      `height="${size}"`,
      `viewBox="${viewBox}"`,
      `fill="${resolvedFill}"`,
    ];
    if (strokeAttr && strokeAttr !== "none") {
      parts.push(`stroke="${strokeAttr}"`);
      if (strokeWidthAttr) parts.push(`stroke-width="${strokeWidthAttr}"`);
      if (strokeLinecap) parts.push(`stroke-linecap="${strokeLinecap}"`);
      if (strokeLinejoin) parts.push(`stroke-linejoin="${strokeLinejoin}"`);
    }

    return `<svg ${parts.join(" ")}>${innerHtml}</svg>`;
  };

  const copyWithFeedback = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const applySizeToSvgText = (text: string) => {
    return text.replace(/<svg([^>]*)>/, (_, attrs) => {
      const cleaned = attrs.replace(/\s*width="[^"]*"/, "").replace(/\s*height="[^"]*"/, "");
      return `<svg${cleaned} width="${size}" height="${size}">`;
    });
  };

  const handleCopySvg = async () => {
    if (icon.svgUrl) {
      const res = await fetch(icon.svgUrl);
      const text = await res.text();
      copyWithFeedback(applySizeToSvgText(text), "svg");
      return;
    }
    const svg = getSvgString();
    if (svg) copyWithFeedback(svg, "svg");
  };

  const getTabContent = () => {
    const isFilled = icon.tablerName?.endsWith("Filled");
    switch (activeCopyTab) {
      case "svg": return svgContent;
      case "id": return icon.id;
      case "import":
        if (icon.tablerName) return `import { ${icon.tablerName} } from '@tabler/icons-react';`;
        if (icon.lucideName) return `import { ${icon.lucideName} } from 'lucide-react';`;
        if (icon.materialName) return `import { ${icon.materialName} } from '@mui/icons-material';`;
        return "";
      case "component":
        if (icon.tablerName) {
          const props = isFilled ? `size={${size}} color="${color}"` : `size={${size}} color="${color}" strokeWidth={${strokeWidth}}`;
          return `import { ${icon.tablerName} } from '@tabler/icons-react';\n\n<${icon.tablerName} ${props} />`;
        }
        if (icon.lucideName)
          return `import { ${icon.lucideName} } from 'lucide-react';\n\n<${icon.lucideName} size={${size}} color="${color}" strokeWidth={${strokeWidth}} />`;
        if (icon.materialName)
          return `import { ${icon.materialName} } from '@mui/icons-material';\n\n<${icon.materialName} style={{ fontSize: ${size}, color: "${color}" }} />`;
        return "";
    }
  };

  const handleCopyActiveTab = async () => {
    if (activeCopyTab === "svg") { await handleCopySvg(); return; }
    const content = getTabContent();
    if (content) copyWithFeedback(content, activeCopyTab);
  };

  const handleDownload = async () => {
    if (icon.svgUrl) {
      const res = await fetch(icon.svgUrl);
      const text = await res.text();
      const blob = new Blob([applySizeToSvgText(text)], { type: "image/svg+xml" });
      saveAs(blob, `${icon.id}.svg`);
      return;
    }
    const svg = getSvgString();
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      saveAs(blob, `${icon.id}.svg`);
    }
  };

  return (
    <div ref={panelRef} className="fixed right-0 top-0 z-50 w-90 h-screen bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in-right border-l border-gray-100 dark:border-gray-800">
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{icon.name}</p>
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              {onToggleFavorite && (
                <button
                  onClick={() => onToggleFavorite(icon.id)}
                  className={`cursor-pointer transition-colors ${isFavorite ? "text-red-400" : "text-gray-300 dark:text-gray-600 hover:text-red-400"}`}
                  title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              )}
              <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg">✕</button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${SET_BADGE[icon.set] ?? "bg-gray-100 text-gray-500"}`}>
              {icon.set}
            </span>
          </div>
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

        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 px-2 py-2">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">Category</p>
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{CATEGORY_LABEL_MAP[icon.category] ?? icon.category}</p>
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

          {!icon.svgUrl && !icon.materialName && !icon.tablerName?.endsWith("Filled") && (
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

        {/* 액션 */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
          {/* Copy 탭 */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Copy</p>
            <div className="flex gap-0.5 p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
              {copyTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCopyTab(tab)}
                  className={`flex-1 py-1 rounded-md text-xs transition-colors cursor-pointer capitalize ${
                    activeCopyTab === tab
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-medium"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg px-3 py-2.5 mb-2 max-h-28 overflow-y-auto">
              <pre className="text-[10px] font-mono text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-all leading-relaxed">
                {getTabContent() || "—"}
              </pre>
            </div>
            <button
              onClick={handleCopyActiveTab}
              className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-lg hover:bg-black dark:hover:bg-gray-100 transition-colors cursor-pointer font-medium"
            >
              {copied === activeCopyTab ? "✓ Copied!" : `Copy ${activeCopyTab.charAt(0).toUpperCase() + activeCopyTab.slice(1)}`}
            </button>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="w-full py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Download SVG
          </button>
        </div>
    </div>
  );
}
