import { createContext, useEffect, useState } from "react";
import { UserContextType, UserDataType } from "../interface/common";
import unsplashImage from "../data/unsplashImage.json";
const UserData = createContext<UserContextType>({});

export default function Model({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserDataType>(() => {
    const storedData = localStorage.getItem("userData");
    return storedData
      ? JSON.parse(storedData)
      : {
          displayName: "",
          links: [],
          isAuth: false,
          unsplashImage:
            unsplashImage[Math.floor(Math.random() * unsplashImage.length)],
        };
  });

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  return (
    <UserData.Provider value={{ userData, setUserData }}>
      {children}
    </UserData.Provider>
  );
}

export { UserData };
