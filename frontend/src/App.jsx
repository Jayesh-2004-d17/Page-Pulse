import { useState } from "react";

const TONE_COLOR = {
  good: "#34D399",
  warn: "#FBBF24",
  bad: "#F87171",
  idle: "#475569",
};

function statusTone(code) {
  if (!code) return "bad";
  if (code >= 200 && code < 300) return "good";
  if (code >= 300 && code < 400) return "warn";
  return "bad";
}

function responseTimeTone(rt) {
  const ms = parseInt(rt, 10);
  if (Number.isNaN(ms)) return "warn";
  if (ms < 800) return "good";
  if (ms < 2000) return "warn";
  return "bad";
}

function textTone(value, emptyLabel) {
  if (!value || value === emptyLabel) return "bad";
  return "good";
}

function h1Tone(count) {
  if (count === 1) return "good";
  if (count === 0) return "bad";
  return "warn";
}

function altTone(count) {
  if (count === 0) return "good";
  if (count <= 5) return "warn";
  return "bad";
}

function wordCountTone(count) {
  if (count >= 300) return "good";
  if (count >= 100) return "warn";
  return "bad";
}

function computeScore(result) {
  let score = 100;

  const st = statusTone(result.status);
  score -= st === "bad" ? 30 : st === "warn" ? 10 : 0;

  const rt = responseTimeTone(result.responseTime);
  score -= rt === "bad" ? 15 : rt === "warn" ? 5 : 0;

  score -= textTone(result.title) === "bad" ? 10 : 0;
  score -= textTone(result.metaDescription, "No Description") === "bad" ? 10 : 0;

  const h1 = h1Tone(result.h1Count);
  score -= h1 === "bad" ? 10 : h1 === "warn" ? 5 : 0;

  const alt = altTone(result.missingAltImages);
  score -= alt === "bad" ? 15 : alt === "warn" ? 7 : 0;

  const wc = wordCountTone(result.wordCount);
  score -= wc === "bad" ? 10 : wc === "warn" ? 5 : 0;

  return Math.max(0, Math.min(100, score));
}

function scoreStatus(score) {
  if (score >= 85) return { label: "Healthy", tone: "good" };
  if (score >= 60) return { label: "Needs Attention", tone: "warn" };
  return { label: "Critical", tone: "bad" };
}

// One 140-unit ECG segment, repeated to fill and loop seamlessly.
function EcgLine({ color, duration }) {
  const offsets = [0, 140, 280, 420, 560, 700, 840, 980, 1120, 1260];
  return (
    <div className="relative h-9 overflow-hidden">
      <svg
        className="ecg-line absolute top-0 left-0 h-full"
        style={{ animationDuration: `${duration}s` }}
        width="1400"
        height="36"
        viewBox="0 0 1400 36"
        preserveAspectRatio="none"
      >
        <defs>
          <polyline
            id="ecgSeg"
            points="0,18 15,18 22,9 29,27 36,15 43,18 70,18 90,18 97,8 104,28 111,16 118,18 140,18"
            fill="none"
          />
        </defs>
        {offsets.map((x) => (
          <use
            key={x}
            href="#ecgSeg"
            x={x}
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}

function StatusDot({ tone, animate }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${animate ? "status-dot" : ""}`}
      style={{ backgroundColor: TONE_COLOR[tone], boxShadow: `0 0 8px ${TONE_COLOR[tone]}` }}
    />
  );
}

function MetricCard({ label, value, tone }) {
  return (
    <div className="bg-[#0B1120]/60 border border-[#1E293B] rounded-xl p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </h3>
        <StatusDot tone={tone} />
      </div>
      <p className="text-lg text-slate-100 font-medium break-words">
        {value === "" || value === undefined || value === null ? "—" : String(value)}
      </p>
    </div>
  );
}

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedAt, setScannedAt] = useState(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("https://page-pulse-backend-0ygk.onrender.com/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
        setScannedAt(new Date());
      }
    } catch (err) {
      setError("Cannot connect to backend.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAnalyze();
  };

  const score = result ? computeScore(result) : null;
  const health = result ? scoreStatus(score) : null;

  const ecgColor = loading
    ? TONE_COLOR.good
    : result
    ? TONE_COLOR[health.tone]
    : TONE_COLOR.idle;
  const ecgDuration = loading ? 1 : result ? 2.2 : 4.5;

  return (
    <div className="console-grid min-h-screen bg-[#0B1120] flex items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-[0_0_80px_-20px_rgba(52,211,153,0.18)] p-8 md:p-14">
        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#34D399] mb-3">
            Website Diagnostics
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-slate-100"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Page Pulse
          </h1>
          <p className="text-slate-500 mt-3 text-sm">
            Run a live vitals check on any webpage
          </p>
        </div>

        {/* Signature ECG divider */}
        <div className="my-8 md:my-10">
          <EcgLine color={ecgColor} duration={ecgDuration} />
        </div>

        {/* Terminal-style input */}
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 bg-[#0B1120] border border-[#1E293B] rounded-lg px-4 focus-within:ring-2 focus-within:ring-[#34D399]/60 focus-within:border-[#34D399]/60">
            <span className="text-[#34D399] select-none">$</span>
            <input
              className="flex-1 bg-transparent py-3 outline-none text-slate-100 placeholder:text-slate-600 text-sm"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="bg-[#34D399] hover:bg-[#2fc389] disabled:opacity-40 disabled:cursor-not-allowed text-[#0B1120] font-bold px-6 rounded-lg text-sm uppercase tracking-wide transition-colors cursor-pointer"
          >
            {loading ? "Scanning…" : "Analyze"}
          </button>
        </div>

        {error && (
          <div className="bg-[#F87171]/10 border border-[#F87171]/40 text-[#F87171] mt-8 p-5 rounded-lg text-sm">
            <span className="font-semibold uppercase tracking-widest text-xs block mb-1">
              Error
            </span>
            {error}
          </div>
        )}

        {result && (
          <div className="mt-10 space-y-6">
            {/* Overall pulse score */}
            <div className="bg-[#0B1120]/60 border border-[#1E293B] rounded-xl p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
                    Overall Pulse
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: TONE_COLOR[health.tone], fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {score}
                    </span>
                    <span className="text-slate-500 text-sm">/ 100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot tone={health.tone} animate />
                  <span className="text-sm font-semibold" style={{ color: TONE_COLOR[health.tone] }}>
                    {health.label}
                  </span>
                </div>
              </div>
              {scannedAt && (
                <div className="mt-4 pt-4 border-t border-[#1E293B]">
                  <span className="text-xs text-slate-600">
                    Scanned {scannedAt.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <MetricCard label="HTTP Status" value={result.status} tone={statusTone(result.status)} />
              <MetricCard
                label="Response Time"
                value={result.responseTime}
                tone={responseTimeTone(result.responseTime)}
              />
              <MetricCard label="Title" value={result.title} tone={textTone(result.title)} />
              <MetricCard
                label="Meta Description"
                value={result.metaDescription}
                tone={textTone(result.metaDescription, "No Description")}
              />
              <MetricCard label="H1 Count" value={result.h1Count} tone={h1Tone(result.h1Count)} />
              <MetricCard
                label="Missing ALT Images"
                value={result.missingAltImages}
                tone={altTone(result.missingAltImages)}
              />
              <div className="md:col-span-2">
                <MetricCard
                  label="Word Count"
                  value={result.wordCount}
                  tone={wordCountTone(result.wordCount)}
                />
              </div>
            </div>
          </div>
        )}

        <footer className="text-center text-slate-600 mt-12 pt-6 border-t border-[#1E293B] text-xs">
          Built for{" "}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noreferrer"
            className="text-[#34D399] underline underline-offset-2"
          >
            Digital Heroes Training Task
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;