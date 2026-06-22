// Lightweight client-side store for AgriMitra onboarding state.
// Persisted to localStorage; no backend yet.

export type FarmerProfile = {
  name?: string;
  mobile?: string;
  language?: string;
  state?: string;
  district?: string;
  village?: string;
  landSize?: string;
  landUnit?: "acre" | "hectare" | "bigha";
  crops?: string[];
  irrigation?: string;
  onboarded?: boolean;
};

const KEY = "agrimitra:profile";

export function loadProfile(): FarmerProfile {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveProfile(patch: Partial<FarmerProfile>) {
  const cur = loadProfile();
  const next = { ...cur, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearProfile() {
  localStorage.removeItem(KEY);
}

export const LANGUAGES = [
  { code: "hi", name: "हिन्दी", english: "Hindi" },
  { code: "en", name: "English", english: "English" },
  { code: "mr", name: "मराठी", english: "Marathi" },
  { code: "ta", name: "தமிழ்", english: "Tamil" },
  { code: "te", name: "తెలుగు", english: "Telugu" },
  { code: "kn", name: "ಕನ್ನಡ", english: "Kannada" },
  { code: "bn", name: "বাংলা", english: "Bengali" },
  { code: "gu", name: "ગુજરાતી", english: "Gujarati" },
  { code: "pa", name: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { code: "ml", name: "മലയാളം", english: "Malayalam" },
  { code: "or", name: "ଓଡ଼ିଆ", english: "Odia" },
  { code: "as", name: "অসমীয়া", english: "Assamese" },
];

export const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat",
  "Haryana", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const CROPS = [
  { id: "wheat", name: "Wheat", emoji: "🌾" },
  { id: "rice", name: "Rice", emoji: "🍚" },
  { id: "maize", name: "Maize", emoji: "🌽" },
  { id: "cotton", name: "Cotton", emoji: "🧶" },
  { id: "sugarcane", name: "Sugarcane", emoji: "🎋" },
  { id: "soybean", name: "Soybean", emoji: "🫘" },
  { id: "groundnut", name: "Groundnut", emoji: "🥜" },
  { id: "mustard", name: "Mustard", emoji: "🌼" },
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "onion", name: "Onion", emoji: "🧅" },
  { id: "potato", name: "Potato", emoji: "🥔" },
  { id: "chilli", name: "Chilli", emoji: "🌶️" },
  { id: "banana", name: "Banana", emoji: "🍌" },
  { id: "mango", name: "Mango", emoji: "🥭" },
  { id: "pulses", name: "Pulses", emoji: "🫛" },
  { id: "tea", name: "Tea", emoji: "🍵" },
];

export const IRRIGATION = [
  { id: "rainfed", name: "Rain-fed", desc: "Depends on monsoon", emoji: "🌧️" },
  { id: "canal", name: "Canal", desc: "Canal irrigation", emoji: "💧" },
  { id: "borewell", name: "Borewell", desc: "Tube well / borewell", emoji: "🕳️" },
  { id: "drip", name: "Drip", desc: "Drip irrigation", emoji: "💦" },
  { id: "sprinkler", name: "Sprinkler", desc: "Sprinkler system", emoji: "🚿" },
  { id: "tank", name: "Tank / Pond", desc: "Village tank or pond", emoji: "🪣" },
];

// === Conversation history ===
export type ChatMsg = { id: string; role: "user" | "ai"; text: string; ts: number; intent?: string; favorite?: boolean };
export type ChatThread = { id: string; title: string; updatedAt: number; messages: ChatMsg[] };

const CHATS_KEY = "agrimitra:chats";
const SCANS_KEY = "agrimitra:scans";

export function loadChats(): ChatThread[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(CHATS_KEY) || "[]"); } catch { return []; }
}
export function saveChats(threads: ChatThread[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHATS_KEY, JSON.stringify(threads.slice(0, 50)));
}
export function upsertThread(thread: ChatThread) {
  const all = loadChats().filter((t) => t.id !== thread.id);
  saveChats([thread, ...all]);
}
export function deleteThread(id: string) {
  saveChats(loadChats().filter((t) => t.id !== id));
}
export function getFavorites(): ChatMsg[] {
  return loadChats().flatMap((t) => t.messages).filter((m) => m.favorite);
}

// === Disease scans ===
export type Scan = {
  id: string;
  ts: number;
  crop?: string;
  imageDataUrl?: string;
  disease: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  causes: string[];
  symptoms: string[];
  treatment: string[];
  prevention: string[];
};

export function loadScans(): Scan[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(SCANS_KEY) || "[]"); } catch { return []; }
}
export function saveScan(scan: Scan) {
  if (typeof window === "undefined") return;
  const all = [scan, ...loadScans()].slice(0, 30);
  localStorage.setItem(SCANS_KEY, JSON.stringify(all));
}
export function deleteScan(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SCANS_KEY, JSON.stringify(loadScans().filter((s) => s.id !== id)));
}

// === Mock disease library ===
export const DISEASES = [
  {
    disease: "Yellow Rust (Puccinia striiformis)",
    confidence: 0.92,
    severity: "Moderate" as const,
    causes: ["Cool humid weather (10–20°C)", "Dense canopy with poor airflow", "Susceptible variety"],
    symptoms: ["Yellow stripes on upper leaf surface", "Powdery yellow-orange spores", "Premature leaf drying"],
    treatment: [
      "Spray Propiconazole 25 EC @ 1 ml/litre water",
      "Apply early morning, avoid windy hours",
      "Repeat after 12–15 days if needed",
    ],
    prevention: [
      "Use rust-resistant varieties (HD-3086, PBW-725)",
      "Avoid excess nitrogen fertiliser",
      "Maintain field sanitation and crop rotation",
    ],
  },
  {
    disease: "Tomato Early Blight (Alternaria solani)",
    confidence: 0.88,
    severity: "High" as const,
    causes: ["Warm wet weather", "Overhead irrigation", "Old infected debris in soil"],
    symptoms: ["Concentric brown rings on older leaves", "Yellow halo around lesions", "Defoliation from bottom up"],
    treatment: [
      "Remove and burn infected leaves immediately",
      "Spray Mancozeb 75% WP @ 2.5 g/litre water",
      "Repeat every 10 days, alternate with Copper Oxychloride",
    ],
    prevention: [
      "Drip irrigation instead of overhead",
      "3-year crop rotation with non-solanaceous crops",
      "Mulch to prevent soil splash",
    ],
  },
  {
    disease: "Rice Blast (Magnaporthe oryzae)",
    confidence: 0.85,
    severity: "High" as const,
    causes: ["High humidity (>90%)", "Excess nitrogen", "Night temperature 22–28°C"],
    symptoms: ["Diamond-shaped lesions on leaves", "Grey centre with brown border", "Neck rot at panicle base"],
    treatment: [
      "Tricyclazole 75 WP @ 0.6 g/litre water",
      "Spray at tillering and booting stage",
      "Drain field briefly to reduce humidity",
    ],
    prevention: [
      "Resistant varieties (IR-64, Swarna Sub-1)",
      "Balanced NPK; split nitrogen doses",
      "Avoid dense planting",
    ],
  },
];

