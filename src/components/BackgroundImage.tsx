import { useUserData } from "../hooks/useUserData";
import unsplashImage from "../data/unsplashImage.json";
import { useEffect, useState } from "react";

const complementaryColor = (hex: string) => {
  if (hex[0] === "#") {
    hex = hex.slice(1);
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  return brightness < 127.5 ? "#000000" : "#FFFFFF";
};

export default function BackgroundImage({
  children,
  className = "",
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { userData, setUserData } = useUserData(),
    { lastDate } = userData || {},
    [currentImage, setCurrentImage] = useState<string>(
      userData?.unsplashImage.urls.small_s3 || ""
    );

  useEffect(() => {
    if (!userData) {
      return;
    }

    setTimeout(() => {
      fetch(userData?.unsplashImage.urls.full || "").then((res) =>
        setCurrentImage(res.url)
      );
    }, 1000);
  }, [userData]);

  useEffect(() => {
    if (!setUserData) {
      console.error("setUserData is undefined");
      return;
    }
    if (lastDate === undefined || lastDate !== new Date().toDateString()) {
      setUserData((prev) => ({
        ...prev,
        lastDate: new Date().toDateString(),
        unsplashImage:
          unsplashImage[Math.floor(Math.random() * unsplashImage.length)],
      }));
    }
  }, [setUserData, lastDate]);

  return (
    <main
      className={`h-screen w-full ${className}`}
      style={{
        color: complementaryColor(userData?.unsplashImage?.color || "#000000"),
      }}
    >
      <div
        className="absolute top-0 -z-10 left-0 w-full h-full bg-black"
        style={{
          opacity: 0.5,
        }}
      />
      <div
        className={`absolute top-0 -z-20 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out`}
        style={{
          backgroundImage: `url('${currentImage}')`,
        }}
      />
      {children}
    </main>
  );
}
