import { useUserData } from "../hooks/useUserData";
import unsplashImage from "../data/unsplashImage.json";
import { useEffect } from "react";

export default function BackgroundImage({
  children,
  className = "",
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { userData, setUserData } = useUserData(),
    { lastDate } = userData || {},
    currentImage = userData?.unsplashImage.urls.full || "";

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
        color: "#fff",
      }}
    >
      <div
        className="absolute top-0 -z-10 left-0 w-full h-full bg-black"
        style={{
          opacity: 0.25,
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
