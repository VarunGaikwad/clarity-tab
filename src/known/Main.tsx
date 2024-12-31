import { useState, useEffect } from "react";
import words from "../data/japaneseWords.json";
import { useUserData } from "../hooks/useUserData";

export default function Main() {
  const { userData } = useUserData(),
    [currentTime, setCurrentTime] = useState(new Date()),
    [word] = useState(words[Math.floor(Math.random() * words.length)]),
    startTime = userData?.startTime || "09:30",
    endTime = userData?.endTime || "18:30",
    [startHour, startMinute] = startTime.split(":").map(Number),
    [endHour, endMinute] = endTime.split(":").map(Number),
    totalStartMinutes = startHour * 60 + startMinute,
    totalEndMinutes = endHour * 60 + endMinute,
    totalDuration = totalEndMinutes - totalStartMinutes;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentHour = currentTime.getHours(),
    currentMinute = currentTime.getMinutes(),
    currentTotalMinutes = currentHour * 60 + currentMinute,
    elapsedTime = currentTotalMinutes - totalStartMinutes,
    percentageElapsed =
      totalDuration > 0 ? Math.floor((elapsedTime / totalDuration) * 100) : 0;

  let greeting = "";

  if (currentHour === 13 || (currentHour === 14 && currentMinute === 0)) {
    greeting = "お昼ご飯の時間です！🍱";
  } else if (currentHour === 17 && currentMinute >= 0 && currentMinute < 30) {
    greeting = "おやつの時間です！🍪";
  } else if (currentHour >= 5 && currentHour < 12) {
    greeting = "おはようございます！🌅";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "こんにちは！☀️";
  } else {
    greeting = "こんばんは！🌙";
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <p className="flex items-center gap-2 text-7xl font-bold">
        {percentageElapsed > 100 ? 100 - percentageElapsed : percentageElapsed}
        <span className="text-2xl">%</span>
      </p>
      <p className="font-semibold text-3xl">
        {greeting} {userData?.displayName}
      </p>
      <div className="mt-4 text-center space-y-2">
        <div className="relative group">
          <p
            className="text-3xl font-bold cursor-pointer"
            style={{ position: "relative" }}
          >
            {word.japanese}
          </p>
          <div
            className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 invisible group-hover:visible bg-gray-700 text-white text-sm rounded px-2 py-1 shadow-lg"
            style={{ whiteSpace: "nowrap" }}
          >
            {word.romanji}
          </div>
        </div>
        <p className="text-md">{word.translation}</p>
      </div>
    </div>
  );
}
