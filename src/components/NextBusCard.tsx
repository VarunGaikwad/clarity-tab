import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  parseSpaceSeparatedCSVWithMine,
  BusEntry,
} from "../utils/getNextBusFromCSV";
import busCSV from "../data/inbound.csv?raw";
import { useUserData } from "../hooks/useUserData";

export const NextBusCard = () => {
  const [nextBuses, setNextBuses] = useState<BusEntry[]>([]);
  const [leaveTime, setLeaveTime] = useState<Date | null>(null);
  const [nextLeaveTime, setNextLeaveTime] = useState<Date | null>(null);
  const { userData, setUserData } = useUserData();
  const [visible, setVisible] = useState(userData?.isBusSchedule || false);

  useEffect(() => {
    if (!setUserData) {
      console.error("setUserData is undefined");
      return;
    }
    setUserData((prev) => ({
      ...prev,
      isBusSchedule: visible,
    }));
  }, [setUserData, visible]);

  const now = Date.now();

  const refreshBusData = () => {
    const buses = parseSpaceSeparatedCSVWithMine(busCSV, 10);
    setNextBuses(buses);

    const upcoming = buses.filter(
      (bus) => bus.departure.getTime() - 600_000 > Date.now()
    );
    const [focusedBus, nextBus] = upcoming;

    setLeaveTime(
      focusedBus
        ? new Date(focusedBus.departure.getTime() - 15 * 60 * 1000)
        : null
    );

    setNextLeaveTime(
      nextBus ? new Date(nextBus.departure.getTime() - 15 * 60 * 1000) : null
    );
  };

  useEffect(() => {
    refreshBusData();
    const interval = setInterval(refreshBusData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut Ctrl+Shift+B to toggle visibility (silent)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyQ") {
        e.preventDefault();
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const formatTime = (date?: Date | null): string =>
    date
      ? `${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : "--:--";

  const fadingBus = nextBuses.find(
    (b) => b.departure.getTime() - 600_000 <= now
  );
  const upcomingBuses = nextBuses.filter(
    (b) => b.departure.getTime() - 600_000 > now
  );
  const focusedBus = upcomingBuses[0];
  const nextBus = upcomingBuses[1];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="next-bus-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-10 right-6 z-40 w-80 rounded-2xl px-5 py-4
                    bg-white/10 backdrop-blur-2xl border border-white/20
                    shadow-lg text-white font-sans overflow-hidden"
        >
          <h3 className="text-sm font-semibold tracking-wide uppercase mb-4 text-white/90 flex items-center gap-2">
            🚉 <span>かしのもり公園</span>
          </h3>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {fadingBus && (
                <motion.div
                  key={`fading-${fadingBus.departure.getTime()}`}
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between items-center px-3 py-2 rounded-lg
                             border border-white/10 text-white/60 text-sm bg-white/5"
                >
                  <span className="uppercase tracking-wide">JUST LEAVING</span>
                  <span className="font-semibold">
                    {formatTime(fadingBus.departure)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {focusedBus && (
              <>
                <motion.div
                  key={`focused-${focusedBus.departure.getTime()}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between items-center px-4 py-2.5 rounded-lg
                             border border-cyan-400 text-white bg-cyan-400/10"
                >
                  <span className="uppercase text-sm font-semibold tracking-wide">
                    NEXT TRAIN
                  </span>
                  <span className="text-xl font-bold">
                    {formatTime(focusedBus.departure)}
                  </span>
                </motion.div>

                <motion.div
                  layout
                  className="flex justify-between text-xs text-white/70 mt-1"
                >
                  <span>🕒 Leave Desk By</span>
                  <span>{formatTime(leaveTime)}</span>
                </motion.div>

                {focusedBus?.mineArrival && (
                  <motion.div
                    key={`arrives-${focusedBus.mineArrival.getTime()}`}
                    layout
                    className="flex justify-between text-xs text-green-300"
                  >
                    <span>📍 Arrives @ 峰</span>
                    <span>{formatTime(focusedBus.mineArrival)}</span>
                  </motion.div>
                )}
              </>
            )}

            {nextBus && (
              <>
                <motion.div
                  key={`next-${nextBus.departure.getTime()}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between items-center px-4 py-2 rounded-lg
                             border border-white/20 text-white/80 bg-white/5 text-sm"
                >
                  <span className="uppercase font-medium tracking-wide">
                    UPCOMING TRAIN
                  </span>
                  <span>{formatTime(nextBus.departure)}</span>
                </motion.div>

                {nextLeaveTime && (
                  <motion.div
                    layout
                    className="flex justify-between text-xs text-white/70"
                  >
                    <span>🕒 Leave Desk By (Next)</span>
                    <span>{formatTime(nextLeaveTime)}</span>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
