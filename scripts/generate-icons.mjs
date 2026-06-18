import { createRequire } from "module";
import { writeFileSync } from "fs";

const require = createRequire(import.meta.url);

const RULES = [
  // Brand (접두사 기반 확실한 분류)
  { cat: "brand", re: /^Brand/ },

  // 미디어
  { cat: "media", re: /^(Play|Pause|Stop|Record|Rewind|FastForward|Mute|Unmute|Volume|Audio|Video|Camera|Photo|Image|Picture|Movie|Film|Music|Song|Album|Playlist|Podcast|Radio|Headphone|Speaker|Microphone|Mic|Tv|Television|Screen|Projector|Slideshow|Theater|Cinema|Lens|Aperture|Shutter|Flash|Focus|Zoom|Panorama|Portrait|Gallery|Gif|Waveform|Artboard|Palette|Svg|Png|Jpg|Broadcast|Stream|Subtitle|Caption|Equalizer|Vinyl|Disc|Cd|Dvd|Reel|Antenna|Animation|Hdr)/ },

  // 내비게이션
  { cat: "navigation", re: /^(Home|Menu|Hamburger|Arrow|Chevron|Caret|Nav|Breadcrumb|Sidebar|Drawer|Expand|Collapse|Minimize|Maximize|Close|Cancel|Exit|Enter|Return|Next|Previous|First|Last|Skip|Goto|Jump|Scroll|Swipe|Drag|Cursor|Pointer|Click|Select|Focus|Anchor|Compass|Direction|Move|Rotate|Flip|Shrink|Stretch|Pan|Orbit|Turn)/ },

  // 사람/소셜
  { cat: "people-social", re: /^(Person|People|User|Users|Group|Team|Friend|Follow|Like|Heart|Love|Share|Comment|Post|Feed|Profile|Avatar|Account|Contact|Member|Community|Social|Thumbs|Star|Favorite|Bookmark|Rate|Review|Badge|Trophy|Award|Medal|Certificate|Crown|Winner|Champion|Man|Woman|Child|Baby|Family|Couple|Crowd|Audience|Emoji|Sports|Spa|Pool|FitnessCenter|Hiking|Surfing|Kayaking|Skiing|Snowboarding|Sledding|Paragliding|Skateboarding|Sailing|Rowing|Scuba|Golf)/ },

  // 지도/위치
  { cat: "maps-location", re: /^(Map|Location|Place|Pin|Marker|Gps|Route|Path|Address|Geolocation|Territory|Country|City|Street|Landmark|Destination|Journey|Trip|Travel|Flight|Plane|Airport|Train|Bus|Car|Taxi|Bike|Walk|Pedestrian|Hike|Boat|Ship|Harbor|Mountain|Beach|Forest|Park|Building|Office|House|Apartment|Hospital|School|Church|Museum|Stadium|Bridge|Road|Highway|Hotel|Tent|Globe|World|Earth|Flag|Local)/ },

  // 금융
  { cat: "finance", re: /^(Money|Cash|Pay|Payment|Price|Cost|Dollar|Euro|Pound|Yen|Won|Coin|Wallet|Bank|Credit|Debit|Card|Receipt|Invoice|Bill|Budget|Tax|Discount|Percent|Sale|Shop|Store|Cart|Basket|Checkout|Purchase|Order|Transaction|Currency|Savings|Profit|Revenue|Expense|Refund|Subscription|Atm|Redeem|PriceChange|PriceCheck|Sell|Shopping)/ },

  // 에디터
  { cat: "editor", re: /^(Edit|Write|Format|Bold|Italic|Underline|Strikethrough|Font|Align|Indent|Outdent|OrderedList|Table|Insert|Crop|Rotate|Flip|Cut|Copy|Paste|Undo|Redo|Spell|Highlight|Brush|Draw|Pen|Pencil|Eraser|Layer|Canvas|Frame|Grid|Ruler|Geometry|Merge|Split|Sort|Filter|Find|Replace|Paragraph|Heading|Quote|Subscript|Superscript|Signature|Stamp|Shapes|Vector|Transform|Scale|Resize|Wand|Magic|Text|Note|Article|Assignment|Attachment|Attach|Border)/ },

  // 다이어그램/도형
  { cat: "diagram-primitives", re: /^(Circle|Square|Triangle|Rectangle|Diamond|Hexagon|Pentagon|Octagon|Oval|Polygon|Line|Crosshair|Ring|Arc|Sector|Cylinder|Cube|Cone|Sphere|Container|Bracket|Brace|Parenthesis|Slash|Backslash|Pipe|Dash|Ellipsis|Infinity)/ },

  // 컴퓨트/디바이스
  { cat: "compute", re: /^(Cloud|Server|Serverless|Computer|Laptop|Desktop|Cpu|Memory|Ram|Processor|Microchip|Chip|Gpu|Instance|Virtual|Vm|Workstation|Mainframe|Supercomputer|Cluster|Pod|Battery|DeveloperBoard|DeveloperMode)/ },

  // 스토리지/DB
  { cat: "storage-database", re: /^(Storage|Database|Db|Backup|Archive|Folder|File|Save|Disk|HardDisk|Ssd|Usb|Drive|Dataset|Bucket|Vault|Repository|Registry|Cache|Index|Schema|Migration)/ },

  // 네트워킹
  { cat: "networking", re: /^(Network|Router|Switch|Wifi|Wireless|Bluetooth|Cell|Cellular|Lan|Wan|Cable|Fiber|Hub|Gateway|Proxy|Dns|Vpn|Loadbalancer|Cdn|Bandwidth|Latency|Packet|Protocol|Topology|Mesh|Peer|Relay|Signal)/ },

  // 보안
  { cat: "security-identity", re: /^(Lock|Unlock|Security|Shield|Key|Password|Fingerprint|FaceId|Verified|Privacy|Auth|Permission|Access|Audit|Compliance|Policy|Threat|Vulnerability|Malware|Antivirus|Encryption|Certificate|Token|Oauth|Saml|Captcha|AdminPanel|VerifiedUser|Policy|GppBad|GppGood)/ },

  // 모니터링
  { cat: "monitoring-logging", re: /^(Monitor|Analytics|Chart|Graph|BarChart|LineChart|PieChart|Timeline|Insights|Metric|Gauge|Dial|Speedometer|Progress|Trend|Statistics|Log|Dashboard|Report|Visualization|Heatmap|Histogram|Scatter|Funnel|Counter|Number|Assessment|Timer|Alarm)/ },

  // AI/ML
  { cat: "ai-ml", re: /^(Ai|Ml|Smart|Brain|Neural|Neuron|Robot|Bot|Automate|Automation|Recommend|Predict|Learn|Learning|Inference|Model|Training|Dataset|Vector|Embedding|Llm|Gpt|Generative|Vision|Ocr|Nlp|Translate|Speech|Sentiment|Classify|Detect|Recognize|Auto|BatchPrediction|Psychology)/ },

  // 메시징
  { cat: "messaging-queue", re: /^(Mail|Email|Envelope|Message|Chat|Sms|Notification|Bell|Inbox|Outbox|Forum|Send|Receive|Reply|Announce|Broadcast|Alert|Remind|Subscribe|Unsubscribe|Newsletter|Rss|Webhook|Queue|Topic|Publish|Call|Calendar)/ },

  // API/통합
  { cat: "api-integration", re: /^(Api|Rest|Graphql|Grpc|Websocket|Webhook|Terminal|Http|Https|Endpoint|Request|Response|Connect|Integration|Plugin|Extension|Addon|Import|Export|Sync|Transfer|Exchange|Interface|Sdk)/ },

  // DevOps
  { cat: "devops-cicd", re: /^(Build|Deploy|Deployment|Pipeline|Workflow|Ci|Cd|Git|Version|Branch|Merge|Commit|Pull|Push|Fork|Tag|Release|Rollback|Debug|Test|Lint|Scan|Package|Bundle|Artifact|Registry|Helm|Terraform|Ansible)/ },

  // 프론트엔드
  { cat: "frontend-client", re: /^(Browser|Chrome|Firefox|Safari|Web|Website|App|Application|Mobile|Phone|Smartphone|Tablet|Watch|Wearable|Window|Interface|Layout|Column|Row|Section|Panel|Modal|Popup|Toast|Tooltip|Dropdown|Input|Button|Toggle|Checkbox|Radio|Slider|Switch|Form|Responsive|Viewport|View|Settings|Devices|Add|Brightness|DarkMode|LightMode|Contrast)/ },
];

function getCategory(name) {
  for (const rule of RULES) {
    if (rule.re.test(name)) return rule.cat;
  }
  return "general-ui";
}

function splitCamel(str) {
  return str.replace(/([A-Z])/g, " $1").trim().toLowerCase().split(" ").filter(Boolean);
}

const EXTRA_TAGS = [
  [/^(Move|Arrow|Chevron|Caret)(Up|Down|Left|Right|UpLeft|UpRight|DownLeft|DownRight|Diagonal|Horizontal|Vertical|3d|3D)?$/, ["arrow", "direction"]],
  [/(Up|Down|Left|Right)(Arrow)?$/, ["arrow", "direction"]],
  [/^(Rotate|Flip|Shrink|Expand|Stretch|Pan|Orbit|Turn)/, ["arrow", "direction"]],
  [/^(Lock|Unlock|Shield|Key|Password|Fingerprint)/, ["security"]],
  [/^(Refresh|Reload|Sync|Autorenew)/, ["refresh", "reload"]],
  [/^(Upload|Download|CloudUpload|CloudDownload)/, ["transfer", "arrow"]],
];

// --- Material ---
const muiMod = require("/Users/ac01-jsmoon/Desktop/my-app/icon-may/iconflow/node_modules/@mui/icons-material");
const muiNames = Object.keys(muiMod).filter(
  (k) =>
    /^[A-Z]/.test(k) &&
    !k.endsWith("Outlined") &&
    !k.endsWith("Rounded") &&
    !k.endsWith("Sharp") &&
    !k.endsWith("TwoTone") &&
    k !== "default"
);

function getExtraTags(name) {
  const extra = new Set();
  for (const [re, tags] of EXTRA_TAGS) {
    if (re.test(name)) tags.forEach((t) => extra.add(t));
  }
  return [...extra];
}

const muiIcons = [...new Map(
  muiNames.map((name) => {
    const baseTags = splitCamel(name);
    const tags = [...new Set([...baseTags, ...getExtraTags(name)])];
    const id = "material-" + baseTags.join("-");
    const displayName = name.replace(/([A-Z])/g, " $1").trim();
    return [id, { id, name: displayName, set: "material", category: getCategory(name), tags, materialName: name }];
  })
).values()];

writeFileSync(
  "/Users/ac01-jsmoon/Desktop/my-app/icon-may/iconflow/src/data/material-icons.ts",
  `import { IconMeta } from "@/types/icon";\n\nexport const MATERIAL_ICONS: IconMeta[] = ${JSON.stringify(muiIcons, null, 2)};\n`
);
const mc = {};
muiIcons.forEach((i) => (mc[i.category] = (mc[i.category] || 0) + 1));
console.log("Material total:", muiIcons.length);
console.log("Material categories:", JSON.stringify(mc, null, 2));

// --- Tabler ---
const tablerMod = require("/Users/ac01-jsmoon/Desktop/my-app/icon-may/iconflow/node_modules/@tabler/icons-react");
const tablerNames = Object.keys(tablerMod).filter((k) => /^Icon[A-Z]/.test(k));

const tablerIcons = [...new Map(
  tablerNames.map((tablerName) => {
    const raw = tablerName.replace(/^Icon/, "");
    const baseTags = splitCamel(raw);
    const tags = [...new Set([...baseTags, ...getExtraTags(raw)])];
    const id = "tabler-" + baseTags.join("-");
    const displayName = raw.replace(/([A-Z])/g, " $1").trim();
    return [id, { id, name: displayName, set: "tabler", category: getCategory(raw), tags, tablerName }];
  })
).values()];

writeFileSync(
  "/Users/ac01-jsmoon/Desktop/my-app/icon-may/iconflow/src/data/tabler-icons.ts",
  `import { IconMeta } from "@/types/icon";\n\nexport const TABLER_ICONS: IconMeta[] = ${JSON.stringify(tablerIcons, null, 2)};\n`
);
const tc = {};
tablerIcons.forEach((i) => (tc[i.category] = (tc[i.category] || 0) + 1));
console.log("\nTabler total:", tablerIcons.length);
console.log("Tabler categories:", JSON.stringify(tc, null, 2));

// --- Lucide ---
const lucideMod = require("/Users/ac01-jsmoon/Desktop/my-app/icon-may/iconflow/node_modules/lucide-react");
const lucideNames = Object.keys(lucideMod).filter(
  (k) =>
    /^[A-Z]/.test(k) &&
    !k.endsWith("Icon") &&
    !k.startsWith("Lucide") &&
    k !== "LucideProvider"
);

const lucideIcons = [...new Map(
  lucideNames.map((name) => {
    const baseTags = splitCamel(name);
    const tags = [...new Set([...baseTags, ...getExtraTags(name)])];
    const id = "lucide-" + baseTags.join("-");
    const displayName = name.replace(/([A-Z])/g, " $1").trim();
    return [id, { id, name: displayName, set: "lucide", category: getCategory(name), tags, lucideName: name }];
  })
).values()];

writeFileSync(
  "/Users/ac01-jsmoon/Desktop/my-app/icon-may/iconflow/src/data/lucide-icons.ts",
  `import { IconMeta } from "@/types/icon";\n\nexport const LUCIDE_ICONS: IconMeta[] = ${JSON.stringify(lucideIcons, null, 2)};\n`
);
const lc = {};
lucideIcons.forEach((i) => (lc[i.category] = (lc[i.category] || 0) + 1));
console.log("\nLucide total:", lucideIcons.length);
console.log("Lucide categories:", JSON.stringify(lc, null, 2));
