import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import ScoreRing from "../components/ScoreRing";
import { loadLastAnalysis, saveLastAnalysis } from "../utils/indexedDb";

const normalizeAnalysis = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }
  if (typeof payload === "object") return payload;
  return null;
};

const Analyze = () => {
  const location = useLocation();
  const { analyzeRes } = location.state || {};
  const [resolvedData, setResolvedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      const normalized = normalizeAnalysis(analyzeRes);
      if (normalized) {
        if (isActive) {
          setResolvedData(normalized);
          setLoading(false);
        }
        saveLastAnalysis(normalized);
        return;
      }

      const stored = await loadLastAnalysis();
      if (!isActive) return;
      setResolvedData(stored || null);
      setLoading(false);
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [analyzeRes]);

  if (loading) {
    return (
      <Layout>
        <section className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            Analysis
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Loading analysis...</h1>
        </section>
      </Layout>
    );
  }

  if (!resolvedData) {
    return (
      <Layout>
        <section className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            Analysis
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">No data found</h1>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
            Upload a resume and job description to generate your analysis dashboard.
          </p>
          <Link
            to="/upload"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
          >
            Go to upload
          </Link>
        </section>
      </Layout>
    );
  }

  const {
    score = {},
    semanticMatch = 0,
    skills = [],
    missingSkills = [],
    suggestions = [],
  } = resolvedData || {};

  const {
    score: overallScore = 0,
    details: { found_score: foundScore = 0, penalty = 0, semantic_score: semanticScore = 0 } = {},
  } = score || {};

  const normalizedScore = Math.min(100, Math.max(0, overallScore));
  const semanticPercent = Math.min(100, Math.max(0, Math.round(semanticMatch * 100)));

  const scoreTone = normalizedScore >= 70 ? "strong" : normalizedScore >= 40 ? "steady" : "warning";
  const scoreLabel = normalizedScore >= 70 ? "Strong" : normalizedScore >= 40 ? "Improving" : "Needs focus";

  const toneClassMap = {
    strong:
      "border-emerald-200/70 bg-emerald-200/60 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-200/20 dark:text-emerald-200",
    steady:
      "border-cyan-200/70 bg-cyan-200/60 text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-200/20 dark:text-cyan-200",
    warning:
      "border-amber-200/70 bg-amber-200/60 text-amber-900 dark:border-amber-300/20 dark:bg-amber-200/20 dark:text-amber-200",
  };

  const cardClass =
    "rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-white/5";

  return (
    <Layout>
      <section className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Analysis</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Resume intelligence dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Clear metrics for ATS compatibility, semantic relevance, and missing skills. Use this to refine
            your resume for the role.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${toneClassMap[scoreTone]}`}
          >
            {scoreLabel}
          </span>
          {/* <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            Live insights
          </span> */}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className={`${cardClass} flex flex-col gap-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">ATS Score</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">Combined score across keywords and penalties.</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClassMap[scoreTone]}`}>{scoreLabel}</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <ScoreRing value={normalizedScore} label="Score" sublabel="out of 100" />
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Found score</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{foundScore}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Penalty</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{penalty}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Semantic score</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{semanticScore}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardClass} flex flex-col gap-4`}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Semantic match</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            How closely your resume aligns with the job description.
          </p>
          <div className="h-3 w-full rounded-full bg-slate-200/70 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300"
              style={{ width: `${semanticPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span>{semanticPercent}% match</span>
            <span>Target 70%+</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className={cardClass}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Score breakdown</h3>
          <div className="mt-6 space-y-5">
            {[
              { label: "Found score (60)", value: foundScore,max:60 , tone: "primary" },
              { label: "Penalty (20)", value: penalty,max:20, tone: "danger" },
              { label: "Semantic score (40)", value: semanticScore,max:40, tone: "primary" },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <span>{item.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.value}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div
                    className={`h-full rounded-full ${
                      item.tone === "danger"
                        ? "bg-gradient-to-r from-rose-400 via-amber-300 to-amber-200"
                        : "bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, (item.value/item.max)*100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-5 text-slate-500 dark:text-slate-400">Formula : ATS = Found + Semantic - Penalty</p>
         </div>

        <div className={`${cardClass} space-y-5`}>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Skills coverage</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">What you have vs. what is missing.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Skills detected</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">No skills detected yet.</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Missing skills</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingSkills.length ? (
                missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-amber-200/70 bg-amber-200/60 px-3 py-1 text-xs font-semibold text-amber-900 dark:border-amber-300/20 dark:bg-amber-200/20 dark:text-amber-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">No missing skills.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Suggestions</h3>
        <div className="mt-5 grid gap-3">
          {suggestions.length ? (
            suggestions.map((suggestion, index) => (

              (suggestion.trim().length > 0) && 
               
              <div
                key={`${suggestion}-${index}`}
                className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                {suggestion}
              </div>
            ))
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">No suggestions yet.</span>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Analyze;
