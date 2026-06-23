import { Category } from "@/types/icon";

export const CATEGORY_LABELS: { value: Category; label: string }[] = [
  { value: "general-ui", label: "General UI" },
  { value: "compute", label: "Compute" },
  { value: "storage-database", label: "Storage & Database" },
  { value: "networking", label: "Networking" },
  { value: "security-identity", label: "Security & Identity" },
  { value: "messaging-queue", label: "Messaging & Queue" },
  { value: "monitoring-logging", label: "Monitoring & Logging" },
  { value: "ai-ml", label: "AI & ML" },
  { value: "data-pipeline", label: "Data Pipeline" },
  { value: "api-integration", label: "API & Integration" },
  { value: "devops-cicd", label: "DevOps & CI/CD" },
  { value: "frontend-client", label: "Frontend & Client" },
  { value: "media", label: "Media" },
  { value: "navigation", label: "Navigation" },
  { value: "people-social", label: "People & Social" },
  { value: "maps-location", label: "Maps & Location" },
  { value: "finance", label: "Finance" },
  { value: "editor", label: "Editor" },
  { value: "brand", label: "Brand" },
  { value: "diagram-primitives", label: "Diagram Primitives" },
];

export const CATEGORY_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CATEGORY_LABELS.map(({ value, label }) => [value, label])
);
