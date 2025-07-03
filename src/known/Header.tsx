import EnhancedWeather from "../components/EnhancedWeather";
import ImportantLinks from "../components/ImportantLinks";
import WorldClock from "../components/WorldClock";

export default function Header() {
  return (
    <header className="flex justify-between gap-4 p-1 flex-wrap">
      {/* Left: Links */}
      <div className="flex-1 max-w-[60%] min-w-[300px]">
        <ImportantLinks />
      </div>

      {/* Right: Clock + Weather */}
      <div className="flex flex-col lg:flex-row items-start justify-end gap-2 max-w-full">
        <WorldClock />
        <EnhancedWeather />
      </div>
    </header>
  );
}
