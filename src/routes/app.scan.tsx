import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Camera, Image as ImageIcon, X, Sparkles, Volume2, Share2, Save, Check,
  AlertTriangle, Leaf, Shield, Stethoscope, RotateCcw, ChevronRight,
} from "lucide-react";
import { DISEASES, saveScan, loadScans, type Scan } from "@/lib/agri-store";

export const Route = createFileRoute("/app/scan")({
  head: () => ({ meta: [{ title: "Crop Scan — AgriMitra AI" }] }),
  component: ScanPage,
});

type Stage = "home" | "processing" | "result";

function ScanPage() {
  const nav = useNavigate();
  const [stage, setStage] = useState<Stage>("home");
  const [images, setImages] = useState<string[]>([]);
  const [scan, setScan] = useState<Scan | null>(null);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const history = loadScans().slice(0, 4);

  const onFiles = (files: FileList | null) => {
    if (!files || !files.length) return;
    const readers = Array.from(files).slice(0, 4).map((f) =>
      new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(f);
      })
    );
    Promise.all(readers).then((urls) => {
      setImages(urls);
      runDiagnosis(urls);
    });
  };

  const runDiagnosis = (urls: string[]) => {
    setStage("processing");
    setTimeout(() => {
      const base = DISEASES[Math.floor(Math.random() * DISEASES.length)];
      const result: Scan = {
        id: crypto.randomUUID(),
        ts: Date.now(),
        imageDataUrl: urls[0],
        ...base,
      };
      setScan(result);
      setStage("result");
    }, 2200);
  };

  const reset = () => {
    setImages([]); setScan(null); setSaved(false); setStage("home");
  };

  const onSave = () => { if (scan) { saveScan(scan); setSaved(true); } };
  const onShare = async () => {
    if (!scan) return;
    const text = `🌾 AgriMitra Diagnosis\n\n${scan.disease}\nConfidence: ${Math.round(scan.confidence * 100)}%\nSeverity: ${scan.severity}\n\nTreatment:\n${scan.treatment.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;
    try { if (navigator.share) await navigator.share({ title: "AgriMitra Diagnosis", text }); else await navigator.clipboard.writeText(text); } catch { /* */ }
  };
  const speak = () => {
    if (!scan || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const text = `Diagnosis: ${scan.disease}. Severity ${scan.severity}. Treatment: ${scan.treatment.join(". ")}`;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN"; u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  // ===== HOME =====
  if (stage === "home") {
    return (
      <div className="animate-fade-up px-5 pt-6 pb-8">
        <header className="flex items-center justify-between">
          <button onClick={() => nav({ to: "/app" })} className="tap-target grid place-items-center rounded-full hover:bg-muted" aria-label="Back">
            <X className="size-5" />
          </button>
          <h1 className="text-base font-bold">Crop Scanner</h1>
          <Link to="/app/assistant" className="text-xs font-semibold text-primary">Skip</Link>
        </header>

        <div className="mt-5 rounded-3xl gradient-field p-5 text-primary-foreground shadow-float">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <p className="text-xs font-bold uppercase tracking-wider opacity-90">AI Vision</p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">Diagnose any crop disease</h2>
          <p className="mt-1 text-sm opacity-90">Take a clear photo of the affected leaf or fruit. Result in 2 seconds with treatment & prevention plan.</p>
        </div>

        {/* Capture actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => camRef.current?.click()}
            className="flex flex-col items-center gap-2 rounded-3xl bg-card p-5 shadow-soft transition hover:bg-primary-soft">
            <div className="grid size-14 place-items-center rounded-2xl gradient-harvest text-harvest-foreground"><Camera className="size-7" /></div>
            <p className="font-bold">Take Photo</p>
            <p className="text-[11px] text-muted-foreground">Use camera</p>
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-2 rounded-3xl bg-card p-5 shadow-soft transition hover:bg-primary-soft">
            <div className="grid size-14 place-items-center rounded-2xl bg-sky/20 text-sky"><ImageIcon className="size-7" /></div>
            <p className="font-bold">From Gallery</p>
            <p className="text-[11px] text-muted-foreground">Up to 4 photos</p>
          </button>
        </div>
        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={(e) => onFiles(e.target.files)} className="hidden" />
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => onFiles(e.target.files)} className="hidden" />

        {/* Tips */}
        <section className="mt-6 rounded-3xl bg-card p-4 shadow-soft">
          <h3 className="text-sm font-bold">📸 Tips for best result</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>• Take photo in natural daylight, not direct sun</li>
            <li>• Focus on the affected area — 1 leaf fills most of frame</li>
            <li>• Include a healthy leaf in the same shot if possible</li>
            <li>• Multiple angles increase accuracy</li>
          </ul>
        </section>

        {/* Recent scans */}
        {history.length > 0 && (
          <section className="mt-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-bold">Recent diagnoses</h3>
              <span className="text-xs text-muted-foreground">{loadScans().length} total</span>
            </div>
            <div className="mt-3 space-y-2">
              {history.map((s) => (
                <article key={s.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft">
                  {s.imageDataUrl ? (
                    <img src={s.imageDataUrl} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-muted"><Leaf className="size-5 text-muted-foreground" /></div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{s.disease}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(s.ts).toLocaleDateString("en-IN")} · {s.severity} severity</p>
                  </div>
                  <SeverityDot s={s.severity} />
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // ===== PROCESSING =====
  if (stage === "processing") {
    return (
      <div className="animate-fade-up grid min-h-[80dvh] place-items-center px-6">
        <div className="flex w-full max-w-sm flex-col items-center">
          <div className="relative grid size-44 place-items-center">
            {images[0] && <img src={images[0]} alt="" className="size-44 rounded-3xl object-cover" />}
            <div className="absolute inset-0 rounded-3xl border-4 border-primary/60 animate-voice-pulse" />
            <div className="absolute inset-x-0 top-0 h-1 animate-[scan_1.6s_ease-in-out_infinite] rounded-full bg-primary" style={{ boxShadow: "0 0 12px var(--primary)" }} />
          </div>
          <p className="mt-6 text-lg font-bold">Analyzing your crop…</p>
          <div className="mt-3 w-full space-y-1.5 text-left text-xs text-muted-foreground">
            <Step label="Image enhancement" delay={0} />
            <Step label="Detecting affected region" delay={500} />
            <Step label="Matching disease database" delay={1100} />
            <Step label="Generating treatment plan" delay={1700} />
          </div>
        </div>
        <style>{`@keyframes scan { 0% { transform: translateY(0); } 50% { transform: translateY(170px); } 100% { transform: translateY(0); } }`}</style>
      </div>
    );
  }

  // ===== RESULT =====
  if (!scan) return null;
  const sevTone = scan.severity === "High"
    ? { bg: "bg-destructive/15", text: "text-destructive" }
    : scan.severity === "Moderate"
    ? { bg: "bg-harvest/20", text: "text-harvest" }
    : { bg: "bg-success/15", text: "text-success" };


  return (
    <div className="animate-fade-up pb-8">
      {/* Hero */}
      <div className="relative">
        {scan.imageDataUrl && <img src={scan.imageDataUrl} alt="" className="h-56 w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background" />
        <button onClick={reset} className="tap-target absolute left-3 top-3 grid place-items-center rounded-full bg-background/90 shadow-soft" aria-label="New scan">
          <X className="size-5" />
        </button>
        <button onClick={onShare} className="tap-target absolute right-3 top-3 grid place-items-center rounded-full bg-background/90 shadow-soft" aria-label="Share">
          <Share2 className="size-5" />
        </button>
      </div>

      <div className="-mt-6 px-5">
        <div className="rounded-3xl bg-card p-5 shadow-float">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className={`inline-block rounded-full ${sevTone.bg} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sevTone.text}`}>
                {scan.severity} severity
              </span>
              <h1 className="mt-1.5 text-xl font-extrabold leading-tight">{scan.disease}</h1>
              <p className="mt-1 text-xs text-muted-foreground">AI Confidence · {Math.round(scan.confidence * 100)}%</p>
            </div>
            <div className="grid place-items-center">
              <ConfidenceRing pct={scan.confidence} />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={speak} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary-soft px-3 py-2 text-xs font-bold text-primary">
              <Volume2 className="size-4" /> Listen
            </button>
            <button onClick={onSave} disabled={saved}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold ${saved ? "bg-success/15 text-success" : "bg-primary text-primary-foreground"}`}>
              {saved ? <><Check className="size-4" /> Saved</> : <><Save className="size-4" /> Save report</>}
            </button>
          </div>
        </div>

        <Section icon={Stethoscope} title="Symptoms" tint="sky" items={scan.symptoms} />
        <Section icon={AlertTriangle} title="Causes" tint="harvest" items={scan.causes} />
        <Section icon={Leaf} title="Recommended treatment" tint="primary" items={scan.treatment} numbered />
        <Section icon={Shield} title="Prevention" tint="success" items={scan.prevention} />

        <Link to="/app/assistant" className="mt-5 flex items-center justify-between rounded-3xl bg-card p-4 shadow-soft">
          <div>
            <p className="text-sm font-bold">Ask AgriMitra about this</p>
            <p className="text-xs text-muted-foreground">Get personalised follow-up advice</p>
          </div>
          <ChevronRight className="size-5 text-primary" />
        </Link>

        <button onClick={reset} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-bold">
          <RotateCcw className="size-4" /> Scan another crop
        </button>
      </div>
    </div>
  );
}

const TINTS: Record<string, { bg: string; text: string; numBg: string; numText: string }> = {
  sky: { bg: "bg-sky/15", text: "text-sky", numBg: "bg-sky/15", numText: "text-sky" },
  harvest: { bg: "bg-harvest/20", text: "text-harvest", numBg: "bg-harvest/20", numText: "text-harvest" },
  primary: { bg: "bg-primary-soft", text: "text-primary", numBg: "bg-primary-soft", numText: "text-primary" },
  success: { bg: "bg-success/15", text: "text-success", numBg: "bg-success/15", numText: "text-success" },
};

function Step({ label, delay }: { label: string; delay: number }) {

  return (
    <div className="flex items-center gap-2 opacity-0" style={{ animation: `fade-up 0.4s ${delay}ms forwards` }}>
      <span className="size-1.5 rounded-full bg-primary" /> {label}
    </div>
  );
}

function SeverityDot({ s }: { s: "Low" | "Moderate" | "High" }) {
  const cls = s === "High" ? "bg-destructive" : s === "Moderate" ? "bg-harvest" : "bg-success";
  return <span className={`size-2.5 shrink-0 rounded-full ${cls}`} />;
}

function ConfidenceRing({ pct }: { pct: number }) {
  const r = 22, c = 2 * Math.PI * r, off = c * (1 - pct);
  return (
    <svg viewBox="0 0 56 56" className="size-14">
      <circle cx="28" cy="28" r={r} stroke="currentColor" strokeWidth="5" fill="none" className="text-muted" />
      <circle cx="28" cy="28" r={r} stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off} className="text-primary" transform="rotate(-90 28 28)" />
      <text x="28" y="32" textAnchor="middle" className="fill-foreground text-[12px] font-bold">{Math.round(pct * 100)}%</text>
    </svg>
  );
}

function Section({ icon: Icon, title, tint, items, numbered }: {
  icon: typeof Leaf; title: string; tint: keyof typeof TINTS; items: string[]; numbered?: boolean;
}) {
  const t = TINTS[tint];
  return (
    <section className="mt-4 rounded-3xl bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <div className={`grid size-8 place-items-center rounded-xl ${t.bg} ${t.text}`}>
          <Icon className="size-4" />
        </div>
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <ul className="mt-2.5 space-y-1.5 text-sm text-foreground/90">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className={`shrink-0 ${numbered ? `grid size-5 place-items-center rounded-full ${t.numBg} text-[10px] font-bold ${t.numText}` : "mt-2 size-1.5 rounded-full bg-foreground/40"}`}>
              {numbered ? i + 1 : null}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

