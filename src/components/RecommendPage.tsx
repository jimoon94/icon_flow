"use client";

import { useState } from "react";
import { RECOMMEND_PACKS } from "@/data/packs";
import { ICONS } from "@/data/icons";
import { RecommendPack } from "@/types/icon";
import IconGrid from "./IconGrid";

export default function RecommendPage() {
  const [selectedPack, setSelectedPack] = useState<RecommendPack | null>(null);

  const packIcons = selectedPack
    ? ICONS.filter((icon) => selectedPack.iconIds.includes(icon.id))
    : [];

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {RECOMMEND_PACKS.map((pack) => (
          <button
            key={pack.id}
            onClick={() =>
              setSelectedPack(selectedPack?.id === pack.id ? null : pack)
            }
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedPack?.id === pack.id
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800">{pack.name}</p>
            <p className="text-xs text-gray-500 mt-1">{pack.description}</p>
            <p className="text-xs text-blue-500 mt-2">{pack.iconIds.length}개 아이콘</p>
          </button>
        ))}
      </div>

      {selectedPack && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            {selectedPack.name} — 포함 아이콘 ({packIcons.length}개)
          </h3>
          <IconGrid icons={packIcons} highlightedIds={selectedPack.iconIds} onSelect={() => {}} />
        </div>
      )}

      {!selectedPack && (
        <p className="text-sm text-gray-400 text-center py-12">
          위 아키텍처 팩을 선택하면 관련 아이콘이 표시됩니다
        </p>
      )}
    </div>
  );
}
