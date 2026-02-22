import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ScoreRing from "../components/ScoreRing";

const Home = () => {
  return (
    <Layout>
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            Crystal-clear resume intelligence
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Professional resume analysis, built for modern hiring.
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Upload your resume and job description to receive an ATS score, semantic match,
            and a crystal-clean dashboard of skill gaps and next steps.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
              to="/upload"
            >
              Start analysis
            </Link>
            <Link
              className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              to="/analyze"
            >
              View dashboard
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "ATS Score", value: "Instant, clear scoring" },
              { label: "Semantic Match", value: "Role-fit signal" },
              { label: "Skill Gaps", value: "Actionable next steps" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Snapshot</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Resume strength</h3>
              </div>
              <span className="rounded-full border border-amber-300/60 bg-amber-200/60 px-3 py-1 text-xs font-semibold text-amber-900 dark:border-amber-300/20 dark:bg-amber-200/20 dark:text-amber-200">
                Needs focus
              </span>
            </div>

            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
              <ScoreRing value={16} label="Score" sublabel="out of 100" />
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Semantic match</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">16%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Missing skills</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">7 gaps</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "python",
                "pandas",
                "sql",
                "+7 missing",
              ].map((skill) => (
                <span
                  key={skill}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    skill.includes("missing")
                      ? "border-amber-300/60 bg-amber-200/50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-200/20 dark:text-amber-200"
                      : "border-white/60 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Precision scoring",
            text: "Balanced scoring across ATS keywords, semantic alignment, and penalties for missing essentials.",
          },
          {
            title: "Skill intelligence",
            text: "Identify the exact technical skills recruiters expect, with clear recommendations.",
          },
          {
            title: "Clean dashboard",
            text: "A clean, modern dashboard designed for clarity, speed, and confident decision-making.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-slate-900/10 backdrop-blur transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{feature.text}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
};

export default Home;
