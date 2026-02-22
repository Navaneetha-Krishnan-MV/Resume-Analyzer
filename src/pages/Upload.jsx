import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Layout from "../components/Layout";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const domain = formData.get("domain");
    const jd = formData.get("jd");
    const file = formData.get("resume");

    if (!(file instanceof File) || file.size === 0) {
      console.log("Please select a PDF resume.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "pdf") {
      console.log("Upload the resume only in pdf format");
      return;
    }

    const apiBase = import.meta.env.VITE_API_GATEWAY_URL;
    if (!apiBase) {
      console.log("Missing VITE_API_GATEWAY_URL in .env");
      return;
    }

    try {
      setUploading(true);
      const presignRes = await fetch(`${apiBase}/getS3Url`).then((res) => res.json());

      const { uploadUrl, fileKey } = presignRes;
      if (!uploadUrl || !fileKey) {
        throw new Error("getS3Url response missing uploadUrl or fileKey");
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`S3 upload failed (${uploadRes.status}): ${text.slice(0, 200)}`);
      }

      const analyzeRes = await fetch(`${apiBase}/analyze`, {
        method: "POST",
        body: JSON.stringify({ fileKey, domain, jd }),
        headers: { "Content-Type": "application/json" },
      });
      if (!analyzeRes.ok) {
        const text = await analyzeRes.text();
        throw new Error(`analyze failed (${analyzeRes.status}): ${text.slice(0, 200)}`);
      }
      const analyzeType = analyzeRes.headers.get("content-type") || "";
      const analysisResult = analyzeType.includes("application/json")
        ? await analyzeRes.json()
        : await analyzeRes.text();
      navigate("/analyze", {
        state: {
          analyzeRes: analysisResult,
        },
      });
    } catch (error) {
      console.error(error);
      console.log(error?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const cardClass =
    "rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-white/5";

  return (
    <Layout>
      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/90 p-6 text-center shadow-2xl dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Uploading and analyzing</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This usually takes less than a minute.</p>
            <ProgressBar loading={uploading} />
          </div>
        </div>
      )}

      <section className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Upload</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Send your resume for a precision scan.
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Provide your target domain, paste the job description, and upload your PDF. We will return a
            professional dashboard with scores, skill gaps, and suggestions.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            "PDF only",
            "Secure upload",
            "Fast turnaround",
          ].map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={cardClass}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How it works</h3>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-slate-600 dark:text-slate-300">
            <li>Pick your domain and paste the job description.</li>
            <li>Upload a single PDF resume.</li>
            <li>Review ATS score, semantic match, and skills.</li>
          </ul>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">What you get</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Score, gaps, and suggestions</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Turnaround</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Under 60 seconds</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className={`${cardClass} space-y-5`}>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="domain">
              Select your interested domain
            </label>
            <select
              name="domain"
              id="domain"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-white/40 dark:focus:ring-white/10"
              required
            >
              <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" value="Machine Learning">
                Machine Learning
              </option>
              <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" value="Full Stack">
                Full Stack
              </option>
              <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" value="Cloud/DevOps">
                Cloud / Devops
              </option>
              <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100" value="Cybersecurity">
                Cyber Security
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="jd">
              Paste your job description
            </label>
            <textarea
              name="jd"
              id="jd"
              required
              rows={6}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:focus:border-white/40 dark:focus:ring-white/10"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="resume">
              Upload your resume (PDF)
            </label>
            <input
              type="file"
              name="resume"
              id="resume"
              accept=".pdf,application/pdf"
              required
              className="mt-2 w-full rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:file:bg-white dark:file:text-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-900"
            >
              Submit for analysis
            </button>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              We never store resumes after analysis.
            </span>
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default Upload;
