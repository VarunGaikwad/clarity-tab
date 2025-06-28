import { useEffect, useState } from "react";
import {
  parseSpaceSeparatedCSVWithMine,
  BusEntry,
} from "../utils/getNextBusFromCSV";
import busCSV from "../data/inbound.csv?raw";
import { motion, AnimatePresence } from "framer-motion";

export const NextBusCard = () => {
  const [nextBuses, setNextBuses] = useState<BusEntry[]>([]);
  const [leaveTime, setLeaveTime] = useState<Date | null>(null);

  const refreshBusData = () => {
    const results = parseSpaceSeparatedCSVWithMine(busCSV, 10);
    setNextBuses(results);

    const nextCatchable = results.find(
      (b) => b.departure.getTime() - 600000 > Date.now()
    );
    if (nextCatchable) {
      setLeaveTime(
        new Date(nextCatchable.departure.getTime() - 10 * 60 * 1000)
      );
    } else {
      setLeaveTime(null);
    }
  };

  useEffect(() => {
    refreshBusData();
    const interval = setInterval(refreshBusData, 5_000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date?: Date | null) =>
    date
      ? `${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "--:--";

  const now = Date.now();
  const fadingBus = nextBuses.find(
    (b) => b.departure.getTime() - 600000 <= now
  );
  const upcoming = nextBuses.filter(
    (b) => b.departure.getTime() - 600000 > now
  );
  const focusedBus = upcoming[0];

  const nextUpcomingBus = upcoming[1];

  return (
    <div className="fixed bottom-10 right-6 z-50 w-80 rounded-xl px-5 py-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-black font-sans">
      <h3 className="text-sm font-semibold tracking-wide uppercase mb-4 text-black/90 flex items-center gap-2">
        🚊 <span>かしのもり公園</span>
      </h3>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {fadingBus && (
            <motion.div
              key={`fading-${fadingBus.departure.getTime()}`}
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between items-center px-3 py-2 rounded-lg border border-white/20 text-black/50 text-sm"
            >
              <span className="uppercase tracking-wide">Just Leaving</span>
              <span className="font-semibold">
                {formatTime(fadingBus.departure)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {focusedBus && (
            <motion.div
              key={`focused-${focusedBus.departure.getTime()}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between items-center px-4 py-2.5 rounded-lg border border-cyan-400 text-black bg-white/5"
            >
              <span className="uppercase text-sm font-medium tracking-wide">
                Next Train
              </span>
              <span className="text-xl font-semibold">
                {formatTime(focusedBus.departure)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Leave Desk */}
        <motion.div
          layout
          className="flex justify-between text-xs text-black/70 mt-2"
        >
          <span>🕒 Leave Desk By</span>
          <span>{formatTime(leaveTime)}</span>
        </motion.div>

        {/* Arrives at 峰 */}
        {focusedBus && (
          <motion.div
            key={`arrives-${focusedBus?.mineArrival?.getTime()}`}
            layout
            className="flex justify-between text-xs text-green-300"
          >
            <span>📍 Arrives @ 峰</span>
            <span>{formatTime(focusedBus.mineArrival)}</span>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {nextUpcomingBus && (
            <motion.div
              key={`next-${nextUpcomingBus.departure.getTime()}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex justify-between items-center px-4 py-2 rounded-lg border border-white/30 text-black/80 bg-white/2 mt-2 text-sm"
            >
              <span className="uppercase font-medium tracking-wide">
                Upcoming Train
              </span>
              <span>{formatTime(nextUpcomingBus.departure)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
