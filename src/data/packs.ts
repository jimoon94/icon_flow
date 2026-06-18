import { RecommendPack } from "@/types/icon";

export const RECOMMEND_PACKS: RecommendPack[] = [
  {
    id: "three-tier-web",
    name: "3-tier 웹앱",
    description: "프론트 / 앱서버 / DB 기본 구성",
    iconIds: [
      "aws-cloudfront",
      "aws-alb",
      "aws-ec2",
      "aws-rds",
      "gcp-cloud-run",
      "gcp-cloud-sql",
    ],
  },
  {
    id: "k8s-onprem",
    name: "K8s On-prem",
    description: "k3s/RKE 기반 온프레미스 스택",
    iconIds: ["gcp-gke", "aws-eks", "gcp-cloud-storage", "aws-s3"],
  },
  {
    id: "mlops-pipeline",
    name: "MLOps 파이프라인",
    description: "데이터 수집 → 학습 → 서빙",
    iconIds: [
      "gcp-vertex-ai",
      "aws-sagemaker",
      "gcp-pubsub",
      "aws-sqs",
      "gcp-bigquery",
    ],
  },
  {
    id: "data-lake",
    name: "데이터 레이크",
    description: "GCS/S3 기반 레이크하우스",
    iconIds: [
      "gcp-cloud-storage",
      "aws-s3",
      "gcp-bigquery",
      "gcp-dataflow",
      "aws-glue",
    ],
  },
  {
    id: "serverless",
    name: "서버리스 앱",
    description: "Lambda/Cloud Run + API GW",
    iconIds: [
      "aws-lambda",
      "gcp-cloud-run",
      "aws-api-gateway",
      "gcp-cloud-endpoints",
    ],
  },
];
