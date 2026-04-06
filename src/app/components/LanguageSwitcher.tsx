import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Type } from "lucide-react";

// ── Telugu font catalogue ────────────────────────────────────────────────────
export const TELUGU_FONTS = [
  { label: "Noto Sans Telugu", value: "Noto Sans Telugu" },
  { label: "మండలి (Mandali)", value: "Mandali" },
  { label: "బాలూ తమ్ముడు 2 (Baloo Tammudu 2)", value: "Baloo Tammudu 2" },
  { label: "సురన్న (Suranna)", value: "Suranna" },
  { label: "గిడుగు (Gidugu)", value: "Gidugu" },
  { label: "అనేక్ తెలుగు (Anek Telugu)", value: "Anek Telugu" },
] as const;

type TeluguFont = (typeof TELUGU_FONTS)[number]["value"];
type Lang = "en" | "te";

// ── Helpers ──────────────────────────────────────────────────────────────────
const LS_LANG = "appLanguage";
const LS_FONT = "teluguFont";

/** Programmatically trigger the hidden Google Translate combo-select. */
function triggerGT(lang: Lang) {
  // Google Translate renders a <select class="goog-te-combo">
  const sel = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!sel) return false;
  sel.value = lang === "te" ? "te" : "";
  sel.dispatchEvent(new Event("change"));
  return true;
}

/** Apply/remove the chosen Telugu font on <body>. */
function applyFont(lang: Lang, font: TeluguFont) {
  if (lang === "te") {
    document.body.style.fontFamily = `'${font}', 'Noto Sans Telugu', sans-serif`;
  } else {
    document.body.style.fontFamily = "";
  }
}

// ── Component ────────────────────────────────────────────────────────────────
const LanguageSwitcher = () => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem(LS_LANG) as Lang) ?? "te";
  });
  const [font, setFont] = useState<TeluguFont>(() => {
    return (localStorage.getItem(LS_FONT) as TeluguFont) ?? "Noto Sans Telugu";
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [gtReady, setGtReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Wait for Google Translate to inject its combo-select ──────────────────
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      tries++;
      if (document.querySelector(".goog-te-combo")) {
        setGtReady(true);
        clearInterval(id);
      }
      if (tries > 40) clearInterval(id); // give up after ~20 s
    }, 500);
    return () => clearInterval(id);
  }, []);

  // ── Apply saved language once GT is ready ─────────────────────────────────
  useEffect(() => {
    if (!gtReady) return;
    // Small extra delay so GT finishes its own init
    const t = setTimeout(() => {
      triggerGT(lang);
      applyFont(lang, font);
    }, 300);
    return () => clearTimeout(t);
  }, [gtReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Close dropdown on outside click ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const switchLang = (next: Lang) => {
    setLang(next);
    localStorage.setItem(LS_LANG, next);
    triggerGT(next);
    applyFont(next, font);
    if (next === "en") setShowDropdown(false);
  };

  const switchFont = (f: TeluguFont) => {
    setFont(f);
    localStorage.setItem(LS_FONT, f);
    applyFont("te", f);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={dropdownRef} className="relative select-none">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setShowDropdown((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          showDropdown
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
        }`}
        aria-label="Switch language"
        aria-expanded={showDropdown}
      >
        {/* Globe icon as inline SVG (lightweight) */}
        <svg
          className="w-3.5 h-3.5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
        </svg>

        <span className="hidden sm:inline">
          {lang === "te" ? "తెలుగు" : "English"}
        </span>
        <span className="sm:hidden">{lang === "te" ? "తె" : "EN"}</span>

        <ChevronDown
          className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Language toggle row */}
          <div className="p-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Language
            </p>
            <div className="flex gap-2">
              {(
                [
                  { code: "te" as Lang, label: "తెలుగు", sub: "Telugu" },
                  { code: "en" as Lang, label: "English", sub: "English" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => switchLang(opt.code)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
                    lang === opt.code
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base leading-tight">{opt.label}</span>
                  <span className="text-[10px] font-normal text-gray-400">
                    {opt.sub}
                  </span>
                  {lang === opt.code && (
                    <Check className="w-3 h-3 text-blue-500 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Telugu font picker — visible only when Telugu is active */}
          {lang === "te" && (
            <div className="p-3">
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <Type className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Telugu Font
                </p>
              </div>
              <ul className="space-y-0.5">
                {TELUGU_FONTS.map((f) => (
                  <li key={f.value}>
                    <button
                      type="button"
                      onClick={() => switchFont(f.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        font === f.value
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {/* Preview text in the actual font */}
                      <span style={{ fontFamily: `'${f.value}', sans-serif` }}>
                        {f.label}
                      </span>
                      {font === f.value && (
                        <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* GT status indicator */}
          {!gtReady && (
            <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-gray-400">
                Translation service loading…
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
