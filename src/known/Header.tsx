import ImportantLinks from "../components/ImportantLinks";
import Weather from "../components/Weather";
import WorldClock from "../components/WorldClock";

export default function Header() {
  return (
    <header className="flex justify-between p-2">
      <ImportantLinks />
      <div />
      <div className="flex gap-4">
        <WorldClock />
        <Weather />
      </div>
    </header>
  );
}
