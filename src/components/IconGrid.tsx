"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { IconMeta } from "@/types/icon";
import IconCard from "./IconCard";

const CARD_SIZE = 72;
const GAP = 4;

interface IconGridProps {
  icons: IconMeta[];
  highlightedIds?: string[];
  onSelect: (icon: IconMeta) => void;
}

export default function IconGrid({ icons, highlightedIds = [], onSelect }: IconGridProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(10);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setCols(Math.max(2, Math.floor(width / (CARD_SIZE + GAP))));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    const result: IconMeta[][] = [];
    for (let i = 0; i < icons.length; i += cols) {
      result.push(icons.slice(i, i + cols));
    }
    return result;
  }, [icons, cols]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => CARD_SIZE + GAP,
    overscan: 5,
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

  return (
    <div ref={listRef}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowIcons = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: virtualRow.start - virtualizer.options.scrollMargin,
                left: 0,
                right: 0,
                height: CARD_SIZE,
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${CARD_SIZE}px)`,
                gap: GAP,
              }}
            >
              {rowIcons.map((icon) => (
                <IconCard
                  key={icon.id}
                  icon={icon}
                  highlighted={highlightedIds.includes(icon.id)}
                  onSelect={onSelect}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
