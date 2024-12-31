import { useEffect, useState, useRef } from "react";
import BackgroundImage from "../components/BackgroundImage";
import { MdNavigateNext } from "react-icons/md";
import { useUserData } from "../hooks/useUserData";

export default function Unknown() {
  const { userData, setUserData } = useUserData(),
    [name, setName] = useState<string>(userData?.displayName || "Varun"),
    inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!setUserData) {
      console.error("setUserData is undefined");
      return;
    }
    setUserData((prev) => ({ ...prev, displayName: name }));
  }, [name, setUserData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!setUserData) {
      console.error("setUserData is undefined");
      return;
    }
    if (!name) {
      alert("Please enter your name");
      return;
    }

    setUserData((prev) => ({ ...prev, isAuth: true }));
  };

  return (
    <BackgroundImage className="flex items-center justify-center h-screen text-white font-semibold">
      <div className="text-center flex flex-col gap-6 px-4">
        <p className="text-xl md:text-2xl lg:text-4xl leading-tight capitalize">
          Hello! What's your name?
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl md:text-2xl lg:text-4xl font-semibold border-b-2 border-white outline-none text-center bg-transparent"
              spellCheck={true}
              autoComplete="off"
              style={{
                width: `${Math.min(name.length, 50)}ch`,
                minWidth: "12ch",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            />
          </div>
          <p>Please enter your name</p>
          <button
            type="submit"
            className="flex items-center border border-white py-2 px-8 rounded-full text-white font-medium transition-all duration-300 ease-in-out transform hover:bg-white hover:text-black hover:scale-105 active:scale-100"
          >
            Continue <MdNavigateNext className="size-6" />
          </button>
        </form>
      </div>
    </BackgroundImage>
  );
}
