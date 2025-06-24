import { useEffect, useState } from "react";
import {
  parseSpaceSeparatedCSVWithMine,
  BusEntry,
} from "../utils/getNextBusFromCSV";
import busCSV from "../data/inbound.csv?raw";

export const NextBusCard = () => {
  const [nextBuses, setNextBuses] = useState<BusEntry[]>([]);
  const [leaveTime, setLeaveTime] = useState<Date | null>(null);

  const refreshBusData = () => {
    const results = parseSpaceSeparatedCSVWithMine(busCSV, 10);
    setNextBuses(results);

    if (results.length > 0) {
      const first = results[0].departure;
      setLeaveTime(new Date(first.getTime() - 10 * 60 * 1000));
    } else {
      setLeaveTime(null);
    }
  };

  useEffect(() => {
    refreshBusData();
    const interval = setInterval(refreshBusData, 15_000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date?: Date | null) => {
    if (!date) return "--:--";
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-12 right-6 z-50 w-80 rounded-lg p-6 bg-[#0a0a0a] shadow-lg border border-cyan-600 text-cyan-400 font-mono select-none animate-neonFlicker group">
      <h3 className="text-xl font-bold mb-4 tracking-widest uppercase text-cyan-400 flex items-center gap-2">
        🚊 <span>かしのもり公園</span>
      </h3>

      {nextBuses.length === 0 ? (
        <p className="text-sm text-gray-600 uppercase">NO UPCOMING TRAINS</p>
      ) : (
        <>
          <div className="mb-6 space-y-3">
            {/* Next train block */}
            <div className="flex justify-between items-center bg-cyan-900 rounded-md p-3 border border-cyan-500 shadow-[0_0_10px_cyan] animate-neonFlicker">
              <span className="text-lg uppercase tracking-widest">
                NEXT TRAIN
              </span>
              <span className="text-2xl font-extrabold text-white">
                {formatTime(nextBuses[0].departure)}
              </span>
            </div>

            {/* LEAVE DESK BY blurred by default, clear on hover */}
            <div className="flex justify-between text-sm uppercase tracking-wide filter blur-sm group-hover:blur-0 transition-all duration-300">
              <span>🕒 LEAVE DESK BY</span>
              <span className="text-cyan-300 font-semibold">
                {formatTime(leaveTime)}
              </span>
            </div>

            {/* Arrives at mine */}
            <div className="flex justify-between text-sm uppercase tracking-wide">
              <span>📍 ARRIVES @ 峰</span>
              <span className="text-green-400 font-semibold">
                {formatTime(nextBuses[0].mineArrival)}
              </span>
            </div>
          </div>

          {/* Upcoming buses list remains the same */}
        </>
      )}
    </div>
  );
};
