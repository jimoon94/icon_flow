import Fuse, { IFuseOptions } from "fuse.js";
import { IconMeta } from "@/types/icon";

const QUERY_MAP: Record<string, string> = {
  // 영어 alias (단일 단어로 여러 관련 아이콘 묶기)
  "weather": "sun moon cloud rain snow storm wind thunder lightning temperature fog",
  "arrow": "arrow chevron caret move direction",
  "social": "share like heart comment user people",
  "sns": "facebook instagram twitter youtube tiktok linkedin github discord slack reddit whatsapp telegram snapchat pinterest share like follow",
  "auth": "lock shield key password fingerprint",
  "chart": "chart graph bar line pie analytics",

  // 한국어 카테고리
  "보안": "security lock shield",
  "클라우드": "cloud server",
  "네트워크": "network wifi router",
  "스토리지": "storage database folder",
  "데이터베이스": "database storage",
  "데이터": "data chart graph",
  "모니터링": "monitoring chart analytics dashboard",
  "메시징": "message chat notification",
  "알림": "notification bell alert",
  "배포": "deploy pipeline workflow",
  "개발": "code terminal git developer",
  "인공지능": "ai brain neural robot",
  "머신러닝": "ml model training",
  "브랜드": "brand logo",

  // 액션
  "검색": "search find",
  "다운로드": "download arrow",
  "업로드": "upload arrow",
  "편집": "edit pen pencil",
  "삭제": "delete trash remove",
  "추가": "add plus",
  "복사": "copy duplicate",
  "공유": "share",
  "저장": "save disk",
  "새로고침": "refresh reload",
  "설정": "settings configuration",
  "잠금": "lock key password",
  "잠금해제": "unlock open",
  "필터": "filter sort",
  "정렬": "sort filter",
  "닫기": "close cancel x",

  // UI 요소
  "버튼": "button click",
  "메뉴": "menu hamburger",
  "체크박스": "checkbox check",
  "토글": "toggle switch",
  "슬라이더": "slider range",
  "드롭다운": "dropdown select",
  "탭": "tab navigation",
  "사이드바": "sidebar panel",
  "모달": "modal popup dialog",
  "툴팁": "tooltip",

  // 파일/문서
  "파일": "file document",
  "폴더": "folder directory",
  "문서": "document file article",
  "이미지": "image photo picture",
  "동영상": "video movie film",
  "음악": "music audio sound",
  "사진": "photo camera image",
  "링크": "link anchor",
  "코드": "code terminal",

  // 사람/소셜
  "사용자": "user person account",
  "팀": "team group people",
  "프로필": "profile avatar user",
  "친구": "friend follow social",
  "좋아요": "like heart thumbs",
  "댓글": "comment chat message",
  "공유하기": "share social",
  "즐겨찾기": "favorite star bookmark",
  "북마크": "bookmark save star",

  // 위치/지도
  "위치": "location pin marker map",
  "지도": "map navigation",
  "집": "home house",
  "빌딩": "building office",
  "병원": "hospital medical",
  "학교": "school education",
  "비행기": "plane flight airport",
  "자동차": "car vehicle transport",
  "기차": "train railway",
  "자전거": "bike bicycle",

  // 미디어
  "재생": "play video",
  "일시정지": "pause stop",
  "정지": "stop media",
  "카메라": "camera photo",
  "마이크": "microphone mic audio",
  "스피커": "speaker volume audio",
  "헤드폰": "headphone audio music",
  "볼륨": "volume speaker",

  // 금융
  "결제": "payment money credit",
  "지갑": "wallet money",
  "쇼핑": "shopping cart store",
  "장바구니": "cart basket shopping",
  "영수증": "receipt invoice bill",
  "할인": "discount percent sale",
  "은행": "bank finance",
  "코인": "coin money currency",

  // 시스템/인프라
  "서버": "server compute cloud",
  "컴퓨터": "computer laptop desktop",
  "노트북": "laptop computer",
  "컨테이너": "container docker pod",
  "배터리": "battery power",
  "전원": "power battery",
  "시계": "clock watch timer alarm",
  "달력": "calendar date",
  "날짜": "calendar date time",
  "시간": "time clock timer",
  "메모리": "memory ram chip",

  // 날씨/자연
  "날씨": "sun moon cloud rain snow storm wind thunder lightning temperature fog",
  "해": "sun light",
  "달": "moon dark night",
  "별": "star favorite",
  "눈": "snow weather",
  "비": "rain weather cloud",
  "구름": "cloud weather",
  "바람": "wind weather",
  "천둥": "thunder storm lightning",
  "번개": "lightning thunder bolt",
  "안개": "fog mist weather",
  "온도": "temperature thermometer",
  "기온": "temperature thermometer",
  "불": "fire alert warning",
  "물": "water drop",

  // 방향/화살표
  "위": "up arrow",
  "아래": "down arrow",
  "왼쪽": "left arrow",
  "오른쪽": "right arrow",
  "화살표": "arrow direction",
};

function normalizeQuery(q: string): string {
  const trimmed = q.trim();
  if (!trimmed) return trimmed;

  const lower = trimmed.toLowerCase();
  if (QUERY_MAP[lower]) return QUERY_MAP[lower];
  if (QUERY_MAP[trimmed]) return QUERY_MAP[trimmed];

  // 공백으로 분리된 토큰별 매핑 (한영 혼용 지원)
  return trimmed
    .split(/\s+/)
    .map((token) => QUERY_MAP[token.toLowerCase()] ?? QUERY_MAP[token] ?? token)
    .join(" ");
}

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

  const normalized = normalizeQuery(query);
  const terms = normalized.trim().split(/\s+/);

  if (terms.length === 1) {
    return fuseInstance!.search(terms[0]).map((r) => r.item);
  }

  // 번역된 여러 키워드를 각각 검색 후 합산 (중복 제거)
  const seen = new Set<string>();
  const combined: IconMeta[] = [];
  for (const term of terms) {
    for (const r of fuseInstance!.search(term)) {
      if (!seen.has(r.item.id)) {
        seen.add(r.item.id);
        combined.push(r.item);
      }
    }
  }
  return combined;
}
