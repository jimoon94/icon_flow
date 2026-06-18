type AnyComponent = React.ComponentType<Record<string, unknown>>;

// 모듈을 한 번만 로드하고 공유
let tablerMod: Record<string, AnyComponent> | null = null;
let lucideMod: Record<string, AnyComponent> | null = null;
let materialMod: Record<string, AnyComponent> | null = null;
let tablerLoading: Promise<void> | null = null;
let lucideLoading: Promise<void> | null = null;
let materialLoading: Promise<void> | null = null;

export function loadTabler(): Promise<void> {
  if (tablerMod) return Promise.resolve();
  if (tablerLoading) return tablerLoading;
  tablerLoading = import("@tabler/icons-react").then((mod) => {
    tablerMod = mod as unknown as Record<string, AnyComponent>;
  });
  return tablerLoading;
}

export function loadLucide(): Promise<void> {
  if (lucideMod) return Promise.resolve();
  if (lucideLoading) return lucideLoading;
  lucideLoading = import("lucide-react").then((mod) => {
    lucideMod = mod as unknown as Record<string, AnyComponent>;
  });
  return lucideLoading;
}

export function getTablerIcon(name: string): AnyComponent | null {
  return tablerMod?.[name] ?? null;
}

export function getLucideIcon(name: string): AnyComponent | null {
  return lucideMod?.[name] ?? null;
}

export function loadMaterial(): Promise<void> {
  if (materialMod) return Promise.resolve();
  if (materialLoading) return materialLoading;
  materialLoading = import("@/lib/muiIconsProxy").then((mod) => {
    materialMod = mod as unknown as Record<string, AnyComponent>;
  });
  return materialLoading;
}

export function getMaterialIcon(name: string): AnyComponent | null {
  return materialMod?.[name] ?? null;
}
