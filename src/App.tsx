import { useUserData } from "./hooks/useUserData";
import Known from "./known/Known";
import Unknown from "./unknown/Unknown";

export default function App() {
  const { userData } = useUserData();
  if (!userData || !userData.isAuth) return <Unknown />;

  return <Known />;
}
