import { useContext } from "react";
import { UserData } from "../store/Model";

export const useUserData = () => useContext(UserData);
