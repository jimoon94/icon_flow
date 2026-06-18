import Fuse, { IFuseOptions } from "fuse.js";
import { IconMeta } from "@/types/icon";

const fuseOptions: IFuseOptions<IconMeta> = {
  keys: [
    { name: "name", weight: 0.6 },
    { name: "tags", weight: 0.4 },
  ],
  threshold: 0.3,
  includeScore: true,
};

let fuseInstance: Fuse<IconMeta> | null = null;

export function createFuse(icons: IconMeta[]): Fuse<IconMeta> {
  fuseInstance = new Fuse(icons, fuseOptions);
  return fuseInstance;
}

export function searchIcons(query: string, icons: IconMeta[]): IconMeta[] {
  if (!query.trim()) return icons;

  if (!fuseInstance) {
    createFuse(icons);
  }

  const results = fuseInstance!.search(query);
  return results.map((r) => r.item);
}
