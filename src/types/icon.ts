export type IconSet = "gcp" | "aws" | "tabler" | "lucide" | "material";

export type Category =
  | "compute"
  | "storage-database"
  | "networking"
  | "security-identity"
  | "messaging-queue"
  | "monitoring-logging"
  | "ai-ml"
  | "data-pipeline"
  | "api-integration"
  | "devops-cicd"
  | "frontend-client"
  | "media"
  | "navigation"
  | "people-social"
  | "maps-location"
  | "finance"
  | "editor"
  | "brand"
  | "general-ui"
  | "diagram-primitives";

export interface IconMeta {
  id: string;
  name: string;
  set: IconSet;
  category: Category;
  tags: string[];
  svgUrl?: string;
  tablerName?: string;
  lucideName?: string;
  materialName?: string;
}

export interface RecommendPack {
  id: string;
  name: string;
  description: string;
  iconIds: string[];
}
