import { useEffect, useState } from "react";
import { NextBusCard } from "./NextBusCard";
import { useUserData } from "../hooks/useUserData";

export const NextBusWrapper = () => {
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

  return (
    <>
      {/* Transparent Toggle Switch */}
      <div
        className={`fixed ${
          !visible ? "bottom-10" : "bottom-80"
        } right-10 z-[200] flex items-center gap-2 text-white text-sm font-medium transition-all duration-500`}
      >
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={visible}
            onChange={() => setVisible(!visible)}
          />
          <div className="w-10 h-5 bg-gray-500 rounded-full peer-checked:bg-cyan-400 transition-colors"></div>
          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>

      {visible && <NextBusCard />}
    </>
  );
};
