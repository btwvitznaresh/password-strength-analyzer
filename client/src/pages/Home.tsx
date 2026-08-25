/* Editorial Security Lab: warm paper, ink-black type, signal lime, asymmetric research-notebook layout, restrained motion, and DM Serif Display + Plus Jakarta Sans + IBM Plex Mono. */

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clipboard,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  TriangleAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";

type CheckStatus = "pass" | "warn" | "fail" | "idle";
type BreachStatus = "idle" | "checking" | "not-found" | "found" | "error";

type CheckItem = {
  label: string;
  detail: string;
  status: CheckStatus;
};

type Analysis = {
  score: number;
  label: string;
  description: string;
  length: number;
  unique: number;
  entropy: number;
  crackTime: string;
  checks: CheckItem[];
  flags: string[];
};

const COMMON_PATTERNS = [
  "password",
  "qwerty",
  "123456",
  "letmein",
  "welcome",
  "admin",
  "monkey",
  "football",
  "iloveyou",
  "abc123",
  "passw0rd",
  "changeme",
];

const WORD_BANK = [
  "amber",
  "cedar",
  "comet",
  "copper",
  "dawn",
  "ember",
  "fig",
  "fjord",
  "harbor",
  "linen",
  "maple",
  "moss",
  "orbit",
  "pebble",
  "pine",
  "raven",
  "sable",
  "signal",
  "spruce",
  "thistle",
  "violet",
  "willow",
];

function randomInt(max: number) {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function createSuggestion() {
  const words = Array.from({ length: 3 }, () => WORD_BANK[randomInt(WORD_BANK.length)]);
  const number = String(10 + randomInt(90));
  const symbol = ["!", "#", "$", "%", "&", "*"][randomInt(6)];
  return `${words[0]}-${words[1]}-${words[2]}${symbol}${number}`;
}

function getAnalysis(value: string): Analysis {
  const length = value.length;
  const lower = /[a-z]/.test(value);
  const upper = /[A-Z]/.test(value);
  const number = /\d/.test(value);
  const symbol = /[^A-Za-z0-9]/.test(value);
  const unique = new Set(value).size;
  const uniqueRatio = length ? unique / length : 0;
  const normalized = value.toLowerCase();
  const isCommon = COMMON_PATTERNS.some((pattern) => normalized.includes(pattern));
  const hasTripleRepeat = /(.)\1\1/.test(value);
  const hasSequence = /(012|123|234|345|456|567|678|789|abc|bcd|cde|qwe|wer|ert)/i.test(value);
  const charsetSize = (lower ? 26 : 0) + (upper ? 26 : 0) + (number ? 10 : 0) + (symbol ? 33 : 0);

  if (!value) {
    return {
      score: 0,
      label: "Not checked",
      description: "Enter a password to see how it holds up against the essentials.",
      length: 0,
      unique: 0,
      entropy: 0,
      crackTime: "—",
      flags: [],
      checks: [
        { label: "Length", detail: "Aim for 14+ characters", status: "idle" },
        { label: "Character variety", detail: "Uppercase, lowercase, number, symbol", status: "idle" },
        { label: "Uniqueness", detail: "Avoid repeats and familiar patterns", status: "idle" },
      ],
    };
  }

  let score = 0;
  if (length >= 14) score += 36;
  else if (length >= 12) score += 28;
  else if (length >= 8) score += 17;
  else score += 5;
  score += [lower, upper, number, symbol].filter(Boolean).length * 10;
  score += Math.round(Math.min(18, uniqueRatio * 18));
  if (isCommon) score -= 30;
  if (hasTripleRepeat) score -= 10;
  if (hasSequence) score -= 8;
  score = Math.max(2, Math.min(100, score));

  const label = score >= 90 ? "Excellent" : score >= 74 ? "Strong" : score >= 50 ? "Fair" : score >= 28 ? "Needs work" : "Too short";
  const description =
    score >= 90
      ? "This password has strong structural variety and enough room to resist guessing."
      : score >= 74
        ? "A solid foundation. One more layer of length or randomness would make it even better."
        : score >= 50
          ? "You are partway there. More length will help more than stacking extra symbols."
          : "This one is easy to narrow down. Start with a longer, less predictable phrase.";
  const entropy = Math.max(0, Math.round(length * Math.log2(Math.max(2, charsetSize)) - (isCommon ? 18 : 0) - (hasSequence ? 8 : 0)));
  const crackTime = score >= 90 ? "Centuries*" : score >= 74 ? "Years to centuries*" : score >= 50 ? "Days to months*" : "Seconds to hours*";

  const checks: CheckItem[] = [
    {
      label: "Length",
      detail: length >= 14 ? `${length} characters — right on target` : `${length} characters — add ${Math.max(1, 14 - length)} more`,
      status: length >= 14 ? "pass" : length >= 10 ? "warn" : "fail",
    },
    {
      label: "Character variety",
      detail: `${[lower, upper, number, symbol].filter(Boolean).length}/4 character groups found`,
      status: [lower, upper, number, symbol].every(Boolean) ? "pass" : [lower, upper, number, symbol].filter(Boolean).length >= 2 ? "warn" : "fail",
    },
    {
      label: "Uniqueness",
      detail: uniqueRatio >= 0.72 ? `${unique} distinct characters — nicely varied` : `${unique} distinct characters — reduce repeats`,
      status: uniqueRatio >= 0.72 ? "pass" : uniqueRatio >= 0.48 ? "warn" : "fail",
    },
    {
      label: "Familiar patterns",
      detail: isCommon ? "Contains a commonly guessed word or sequence" : hasSequence ? "Contains a predictable sequence" : "No obvious common patterns found",
      status: isCommon || hasSequence ? "warn" : "pass",
    },
  ];

  const flags = [
    ...(isCommon ? ["A familiar word or pattern is doing too much work."] : []),
    ...(hasTripleRepeat ? ["Repeated characters reduce the number of useful guesses."] : []),
    ...(hasSequence ? ["Sequences such as abc or 123 are tested early by attackers."] : []),
    ...(length < 14 ? ["Length is the highest-leverage improvement available here."] : []),
  ];

  return { score, label, description, length, unique, entropy, crackTime, checks, flags };
}

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === "pass") return <Check size={14} strokeWidth={2.8} />;
  if (status === "fail") return <X size={14} strokeWidth={2.8} />;
  if (status === "warn") return <TriangleAlert size={14} strokeWidth={2.4} />;
  return <span className="status-dot" />;
}

function formatScore(value: number) {
  return String(value).padStart(2, "0");
}

async function sha1Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [breachStatus, setBreachStatus] = useState<BreachStatus>("idle");
  const [breachCount, setBreachCount] = useState(0);
  const breachRequest = useRef(0);
  const analysis = useMemo(() => getAnalysis(password), [password]);

  async function handleBreachCheck() {
    if (!password) {
      toast.error("Enter a password before checking");
      return;
    }
    const requestId = breachRequest.current + 1;
    breachRequest.current = requestId;
    setBreachStatus("checking");
    setBreachCount(0);
    try {
      const hash = await sha1Hex(password);
      const response = await fetch(`https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`, {
        headers: { "Add-Padding": "true" },
      });
      if (!response.ok) throw new Error(`Breach lookup failed with ${response.status}`);
      const matches = (await response.text()).split("\\n");
      const match = matches.find((line) => line.trim().startsWith(hash.slice(5)));
      if (requestId !== breachRequest.current) return;
      if (match) {
        const count = Number(match.split(":")[1]?.trim() ?? 0);
        setBreachCount(Number.isFinite(count) ? count : 0);
        setBreachStatus("found");
      } else {
        setBreachStatus("not-found");
      }
    } catch {
      if (requestId === breachRequest.current) setBreachStatus("error");
    }
  }

  function handleGenerate() {
    setSuggestions(Array.from({ length: 3 }, createSuggestion));
    toast.success("Three local alternatives generated", {
      description: "They were made in your browser and were not sent anywhere.",
    });
  }

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1600);
      toast.success("Alternative copied");
    } catch {
      toast.error("Copy was blocked by your browser");
    }
  }

  return (
    <div className="app-shell">
      <aside className="identity-rail">
        <div className="rail-topline">
          <div className="brand-lockup">
            <span className="brand-mark brand-mark-css" aria-hidden="true"><span className="mark-shaft" /><span className="mark-notch" /></span>
            <span>passmark</span>
          </div>
          <span className="rail-index">01 / 01</span>
        </div>

        <div className="rail-hero">
          <div className="rail-hero-art" aria-hidden="true" />
          <div className="rail-copy">
            <p className="eyebrow">PASSWORD FIELD NOTE</p>
            <h1>Make the<br /><em>guessing</em><br />harder.</h1>
            <p className="rail-description">A clear read on password strength, without sending your password to a server.</p>
          </div>
        </div>

        <div className="rail-bottom">
          <div className="privacy-stamp"><ShieldCheck size={15} /><span>LOCAL ONLY</span></div>
          <p>Your input stays in this tab. No account. No database. No password leaves your device.</p>
          <div className="rail-meta"><span>PASSMARK / 2026</span><span>FIELD NOTE 001</span></div>
        </div>
      </aside>

      <main className="analysis-stage">
        <header className="stage-header">
          <div>
            <p className="eyebrow">STRENGTH ANALYZER <span>•</span> CLIENT-SIDE</p>
            <p className="header-context">A small diagnostic for a better secret.</p>
          </div>
          <div className="header-status"><span className="status-pulse" /> ANALYSIS READY</div>
        </header>

        <section className="intro-row">
          <div className="intro-copy">
            <p className="section-kicker">01 / ENTER A PASSWORD</p>
            <h2>See the weak link.<br /><span>Fix the right thing.</span></h2>
            <p className="intro-note">Length beats decoration. We check what matters, explain the result, and offer a few stronger directions.</p>
          </div>
          <div className="method-note">
            <Terminal size={16} />
            <div><span className="mono-label">METHOD</span><p>Length · variety · uniqueness · patterns</p></div>
          </div>
        </section>

        <section className="workspace-grid">
          <div className="input-column">
            <div className="input-card">
              <div className="card-topline"><span className="mono-label">INPUT / PRIVATE</span><LockKeyhole size={16} /></div>
              <label htmlFor="password-input">Your password</label>
              <div className="password-field-wrap">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => { setPassword(event.target.value); setBreachStatus("idle"); setBreachCount(0); }}
                  placeholder="Type something worth protecting"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button className="icon-button" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="input-footer"><span>{password.length} characters</span><span><Fingerprint size={14} /> never stored</span></div>
            </div>

            <div className="checklist-card">
              <div className="card-topline"><span className="mono-label">DIAGNOSTIC CHECKS</span><span className="check-count">{analysis.checks.filter((item) => item.status === "pass").length}/{analysis.checks.length} CLEAR</span></div>
              <div className="checklist">
                {analysis.checks.map((item) => (
                  <div className={`check-row ${item.status}`} key={item.label}>
                    <div className="check-icon"><StatusIcon status={item.status} /></div>
                    <div><strong>{item.label}</strong><span>{item.detail}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="privacy-card">
              <div className="privacy-card-icon"><ShieldCheck size={18} /></div>
              <div><strong>Private by design.</strong><p>Analysis happens in your browser. For real accounts, use a password manager and never reuse a password across sites.</p></div>
            </div>

            <div className={`breach-card breach-${breachStatus}`}>
              <div className="card-topline"><span className="mono-label">BREACH DATABASE</span><Fingerprint size={16} /></div>
              <div className="breach-card-copy"><strong>{breachStatus === "found" ? "This password has been exposed." : breachStatus === "not-found" ? "No exposure found." : breachStatus === "checking" ? "Checking known breaches…" : breachStatus === "error" ? "The lookup is unavailable." : "Check for known exposure."}</strong><p>{breachStatus === "found" ? `Seen ${breachCount.toLocaleString()} times in known breach data. Do not use it.` : breachStatus === "not-found" ? "No match was returned from the current dataset. Keep it unique anyway." : breachStatus === "checking" ? "Hashing locally, then sending only five hash characters." : breachStatus === "error" ? "Your local strength result is still available. Try again in a moment." : "Use a k-anonymity lookup to check whether this exact password has appeared before."}</p></div>
              <button className="breach-action" type="button" onClick={handleBreachCheck} disabled={breachStatus === "checking" || !password}><span className={breachStatus === "checking" ? "spin" : ""}><RefreshCw size={14} /></span>{breachStatus === "checking" ? "Checking…" : "Check securely"}<ArrowUpRight size={14} /></button>
              <span className="breach-privacy">Only the first 5 characters of a local SHA-1 hash are sent.</span>
            </div>
          </div>

          <div className="result-column">
            <div className={`score-card score-${analysis.label.toLowerCase().replace(" ", "-")}`}>
              <div className="score-card-head"><span className="mono-label">LIVE READOUT</span><span className="score-time">NOW</span></div>
              <div className="score-main">
                <div className="gauge-wrap" aria-label={`Strength score ${analysis.score} out of 100`}>
                  <div className="gauge-scale"><span>100</span><span>75</span><span>50</span><span>25</span><span>00</span></div>
                  <div className="signal-gauge" style={{ "--gauge-height": `${Math.max(4, analysis.score)}%` } as React.CSSProperties}>
                    <div className="gauge-fill" />
                    <div className="gauge-notch" />
                  </div>
                </div>
                <div className="score-summary"><div className="score-number-row"><span className="score-number">{formatScore(analysis.score)}</span><span className="score-unit">/ 100</span></div><p className="eyebrow">CURRENT SIGNAL</p><h3>{analysis.label}</h3><p>{analysis.description}</p></div>
              </div>
              <div className="score-stats">
                <div><span className="mono-label">EST. ENTROPY</span><strong>{analysis.entropy ? `${analysis.entropy} bits` : "—"}</strong></div>
                <div><span className="mono-label">OFFLINE GUESSING</span><strong>{analysis.crackTime}</strong></div>
                <div><span className="mono-label">UNIQUE CHARS</span><strong>{analysis.length ? `${analysis.unique} / ${analysis.length}` : "—"}</strong></div>
              </div>
              <p className="score-footnote">* Directional estimate only. Attack speed, hashing, and breach data vary by system.</p>
            </div>

            <div className="signal-card">
              <div className="signal-head"><div><p className="section-kicker">02 / NEXT MOVE</p><h3>One useful change</h3></div><Sparkles size={20} /></div>
              {analysis.flags.length ? <ul className="signal-list">{analysis.flags.slice(0, 3).map((flag) => <li key={flag}><span className="signal-marker" />{flag}</li>)}</ul> : <p className="empty-signal">Start typing to surface the highest-leverage improvements.</p>}
              <button className="primary-action" type="button" onClick={handleGenerate}><RefreshCw size={16} /> Generate stronger alternatives <ArrowUpRight size={16} /></button>
            </div>
          </div>
        </section>

        <section className="alternatives-section">
          <div className="alternatives-heading"><div><p className="section-kicker">03 / ALTERNATIVES</p><h3>Longer ideas, less guessable.</h3></div><p>These are generated locally from a word bank. Treat them as starting points—never reuse an example unchanged for a critical account.</p></div>
          {suggestions.length ? <div className="suggestion-grid">{suggestions.map((suggestion, index) => <div className="suggestion-card" key={suggestion}><span className="suggestion-index">0{index + 1}</span><code>{suggestion}</code><button className="copy-button" type="button" onClick={() => handleCopy(suggestion)} aria-label={`Copy suggestion ${index + 1}`}>{copied === suggestion ? <Check size={16} /> : <Clipboard size={16} />}</button></div>)}</div> : <div className="suggestion-empty"><KeyRound size={18} /><span>Generate a few alternatives when you are ready to compare.</span><span className="mono-label">NO INPUT LEAVES THIS TAB</span></div>}
        </section>

        <footer className="learning-footer">
          <div className="footer-art" aria-hidden="true" />
          <div><p className="section-kicker">A NOTE ON REUSE</p><h3>Keep the secret unique to you.</h3><p>Password reuse is the quiet failure mode: one breach can unlock several accounts. A password manager can create and remember a different long password for every site.</p></div>
          <div className="footer-callout"><span className="mono-label">NEXT PRACTICE</span><strong>Turn on multi-factor authentication.</strong><ArrowUpRight size={17} /></div>
        </footer>
      </main>
    </div>
  );
}
