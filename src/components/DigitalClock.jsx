import { useEffect, useState } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="fixed bottom-10 right-4 z-50">
      <div className="text-4xl md:text-2xl font-mono font-bold bg-black/40 px-6 py-3 rounded-xl text-blue-400 tracking-widest border border-blue-500/50 shadow-lg shadow-blue-400/50">
        {formattedTime}
      </div>
    </div>
  );
}
