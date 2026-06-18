"use client";

import { useState } from "react";
import { ICONS } from "@/data/icons";
import { IconMeta } from "@/types/icon";
import IconCard from "./IconCard";

export default function ComparePage() {
  const [selected, setSelected] = useState<IconMeta[]>([]);

  const toggleSelect = (icon: IconMeta) => {
    setSelected((prev) => {
      const exists = prev.find((i) => i.id === icon.id);
      if (exists) return prev.filter((i) => i.id !== icon.id);
      if (prev.length >= 4) return prev;
      return [...prev, icon];
    });
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        비교할 아이콘을 최대 4개 선택하세요
      </p>

      {selected.length > 0 && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              선택된 아이콘 ({selected.length}/4)
            </h3>
            <button
              onClick={() => setSelected([])}
              className="text-xs text-red-500 hover:text-red-700"
            >
              전체 해제
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {selected.map((icon) => (
              <div key={icon.id} className="space-y-2">
                <IconCard icon={icon} highlighted onSelect={() => {}} />
                <p className="text-xs text-gray-500 text-center truncate">{icon.id}</p>
                <p className="text-xs text-gray-400 text-center">
                  {icon.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {ICONS.map((icon) => {
          const isSelected = selected.some((i) => i.id === icon.id);
          return (
            <div
              key={icon.id}
              onClick={() => toggleSelect(icon)}
              className={`cursor-pointer rounded-xl border transition-all ${
                isSelected
                  ? "ring-2 ring-blue-400"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <IconCard icon={icon} highlighted={isSelected} onSelect={toggleSelect} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
