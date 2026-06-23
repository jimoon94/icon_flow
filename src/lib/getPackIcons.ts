import { ICONS } from "@/data/icons";
import { IconMeta, RecommendPack } from "@/types/icon";

export function getPackIcons(pack: RecommendPack): IconMeta[] {
  let result: IconMeta[];

  if (pack.keywords && pack.keywords.length > 0) {
    const kwSet = new Set(pack.keywords);
    result = ICONS.filter((icon) => icon.tags.some((tag) => kwSet.has(tag)));
  } else {
    result = ICONS.filter((icon) => {
      const matchSet = !pack.sets || pack.sets.includes(icon.set);
      const matchCategory = !pack.categories || pack.categories.includes(icon.category);
      return matchSet && matchCategory;
    });
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}
