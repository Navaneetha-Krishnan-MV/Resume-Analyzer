const ScoreRing = ({ value = 0, size = 140, stroke = 10, label, sublabel }) => {
  const safeValue = Math.min(100, Math.max(0, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="text-slate-200/80 dark:text-white/10"
          fill="transparent"
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="text-cyan-500 dark:text-cyan-300"
          fill="transparent"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-2xl font-semibold tracking-tight">{Math.round(safeValue)}</span>
        {label ? <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{label}</span> : null}
        {sublabel ? <span className="text-xs text-slate-500 dark:text-slate-400">{sublabel}</span> : null}
      </div>
    </div>
  );
};

export default ScoreRing;
