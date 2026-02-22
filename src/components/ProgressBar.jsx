import { useEffect, useState } from "react";

const ProgressBar = ({ loading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 3 : prev));
      }, 300);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div
      className="mt-4 h-3 w-full rounded-full bg-slate-200/70 dark:bg-white/10"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 pr-2 text-[10px] font-semibold text-slate-900 transition-all"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
