import { NextBusCard } from "../components/NextBusCard";
import quotes from "../data/quotes.json";
import { useUserData } from "../hooks/useUserData";
import { useMemo } from "react";
export default function Footer() {
  const { userData } = useUserData(),
    selectedImage = userData?.unsplashImage || {
      user: { name: "", portfolio_url: "", instagram_username: "" },
    },
    { quote } = useMemo(
      () => quotes[Math.ceil(Math.random() * quotes.length)],
      []
    );

  return (
    <footer className="flex justify-between items-center text-xs m-1 p-2 px-5">
      <NextBusCard />
      <div>
        Background Photo by{" "}
        <a
          href={
            selectedImage?.user.portfolio_url ||
            `https://instagram.com/${selectedImage?.user.instagram_username}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-indigo-500"
        >
          {selectedImage?.user.name}
        </a>
      </div>
      <div className="flex-1 text-center text-base">
        <q>{quote}</q>
      </div>
      <div className="text-right">
        Created by{" "}
        <a
          href="https://instagram.com/preapexis"
          target="_blank"
          rel="noopener noreferrer"
        >
          Varun Gaikwad
        </a>
      </div>
    </footer>
  );
}
