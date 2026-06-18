# IconFlow

GCP · AWS · Tabler · Lucide · Material 아이콘을 한 곳에서 탐색하고 커스터마이징할 수 있는 아이콘 익스플로러입니다.

## 주요 기능

- **11,000+ 아이콘** — GCP(252), AWS(776), Tabler(6,203), Lucide(1,981), Material(2,131)
- **가상 스크롤** — 10,000개 이상의 아이콘을 부드럽게 렌더링
- **퍼지 검색** — 아이콘 이름 및 태그 기반 실시간 검색 (한국어 / 영어 alias 지원)
- **세트 / 카테고리 필터** — 19개 카테고리 (Compute, Media, Navigation, Finance 등)
- **아이콘 커스터마이저** — Color, Stroke width, Size 실시간 조절
- **SVG 내보내기** — Copy SVG, Copy import 구문, Download SVG
- **다크 / 라이트 테마** — next-themes 기반 토글

## 스택

| 항목 | 버전 |
|---|---|
| Next.js | 16 (Turbopack) |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| @tanstack/react-virtual | 3 |
| fuse.js | 7 |
| next-themes | 0.4 |
| @tabler/icons-react | 3 |
| lucide-react | 1 |
| @mui/icons-material | 5 |

## 시작하기

```bash
pnpm install
pnpm dev
```

http://localhost:3000 에서 확인합니다.

## 빌드

```bash
pnpm build
pnpm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx            # 메인 레이아웃 (탭, 검색, 필터)
│   └── globals.css
├── components/
│   ├── IconGrid.tsx         # 가상 스크롤 그리드
│   ├── IconCard.tsx         # 개별 아이콘 카드
│   ├── IconDetailPanel.tsx  # 우측 상세 패널
│   ├── Sidebar.tsx          # 세트 / 카테고리 필터
│   └── SearchBar.tsx
├── data/
│   ├── icons.ts             # 전체 아이콘 집합
│   ├── aws-icons.ts         # AWS 776개
│   ├── gcp-icons.ts         # GCP 252개
│   ├── tabler-icons.ts      # Tabler 6,203개
│   ├── lucide-icons.ts      # Lucide 1,981개
│   └── material-icons.ts    # Material 2,131개
├── lib/
│   ├── iconLoader.ts        # 동적 임포트 + 모듈 캐싱
│   ├── search.ts            # fuse.js 퍼지 검색 + 한국어/alias 매핑
│   └── muiIconsProxy.ts
└── types/
    └── icon.ts
```

## 검색

퍼지 검색(fuse.js)을 사용하며, 한국어 키워드와 영어 alias를 사전 매핑하여 확장 검색을 지원합니다.

| 입력 예시 | 검색 결과 |
|---|---|
| `보안` | security, lock, shield 관련 아이콘 |
| `날씨` / `weather` | sun, cloud, rain, snow 등 날씨 관련 아이콘 |
| `SNS` | facebook, instagram, twitter 등 소셜 브랜드 아이콘 |
| `화살표` | arrow, chevron, move 계열 아이콘 |
| `설정` | settings, configuration 관련 아이콘 |

`src/lib/search.ts`의 `QUERY_MAP`에 키워드를 추가해 확장할 수 있습니다.

## 아이콘 소스

| 세트 | 출처 |
|---|---|
| GCP | Google Cloud Icons (https://cloud.google.com/icons) |
| AWS | AWS Architecture Icons (https://aws.amazon.com/architecture/icons/) |
| Tabler | @tabler/icons-react (https://tabler.io/icons) |
| Lucide | lucide-react (https://lucide.dev) |
| Material | @mui/icons-material (https://mui.com/material-ui/material-icons/) |
