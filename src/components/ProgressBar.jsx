import { useState, useEffect } from "react";

const ProgressBar = ({ loading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev));
      }, 300);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500); 
    }
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="w-full bg-gray-200 rounded mt-4">
      <div
        className="bg-green-500 text-xs leading-none py-1 text-center text-white rounded"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;