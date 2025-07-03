import { useEffect, useState, useCallback } from "react";
import { MdAddCircle, MdDelete } from "react-icons/md";
import Dialog from "./Dialog";
import { TimeZoneType } from "../interface/common";
import { useUserData } from "../hooks/useUserData";
import { FaEdit } from "react-icons/fa";

const getTimeInZone = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  });

  const parts = formatter.formatToParts(date);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const period = parts.find((p) => p.type === "dayPeriod")?.value ?? "";

  return {
    time: `${hour}:${minute}`,
    period: period.toLowerCase(),
  };
};

const TIMEZONE_LIST = (typeof Intl.supportedValuesOf === "function"
  ? Intl.supportedValuesOf("timeZone")
  : null) || [
  "UTC",
  "Asia/Tokyo",
  "Europe/London",
  "America/New_York",
  "Asia/Kolkata",
  "Australia/Sydney",
];

export default function WorldClock() {
  const { userData, setUserData } = useUserData();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [time, setTime] = useState(new Date());
  const [inputValue, setInputValue] = useState({
    title: "",
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeZones, setTimeZones] = useState<TimeZoneType[]>(
    userData?.timeZones || []
  );

  const onTimeZoneSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { title, zone } = inputValue;

    if (title.length <= 2) {
      alert("Title must be more than 2 characters.");
      return;
    }

    const isDuplicate = timeZones.some(
      (tz, i) => i !== editIndex && tz.title === title && tz.zone === zone
    );

    if (isDuplicate) {
      alert("Time zone already exists.");
      return;
    }

    if (editIndex !== null) {
      const updated = [...timeZones];
      updated[editIndex] = { title, zone };
      setTimeZones(updated);
    } else {
      setTimeZones((prev) => [...prev, { title, zone }]);
    }

    setIsDialogOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!setUserData) return;
    setUserData((prev) => ({ ...prev, timeZones }));
  }, [timeZones, setUserData]);

  useEffect(() => {
    if (!isDialogOpen) {
      setInputValue({
        title: "",
        zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setEditIndex(null);
    }
  }, [isDialogOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setInputValue((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const onHandleDelete = (title: string, zone: string) => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this time zone?"
    );
    if (!shouldDelete) return;
    setTimeZones((prev) =>
      prev.filter((tz) => !(tz.title === title && tz.zone === zone))
    );
  };

  return (
    <div className="hidden lg:flex gap-4 justify-center items-center h-fit py-2">
      <Dialog
        title="Add Time Zone"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      >
        <form onSubmit={onTimeZoneSubmit} className="flex gap-2 flex-col">
          <input
            className="w-full bg-white bg-opacity-5 p-2 outline-none rounded-md"
            placeholder="Title"
            name="title"
            value={inputValue.title}
            onChange={handleInputChange}
          />
          <input
            className="w-full bg-white bg-opacity-5 p-2 outline-none rounded-md"
            list="timezones"
            name="zone"
            value={inputValue.zone}
            onChange={handleInputChange}
          />
          <datalist id="timezones">
            {TIMEZONE_LIST.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </datalist>
          <input type="submit" className="hidden" />
        </form>
      </Dialog>

      {timeZones.length < 5 && (
        <span
          onClick={() => setIsDialogOpen(true)}
          className="flex gap-1 items-center text-xs w-32 cursor-pointer"
        >
          <MdAddCircle className="text-3xl" />
          Add Time Zone
        </span>
      )}

      <div className="flex items-center gap-4">
        {timeZones.map(({ title, zone }, index) => {
          const { time: formattedTime, period } = getTimeInZone(time, zone);
          return (
            <div
              key={`${title}-${zone}`}
              className="relative flex items-center"
            >
              <div
                className="text-right cursor-pointer group pr-4"
                title={zone}
              >
                <p className="text-lg font-semibold space-x-1">
                  <span className="tracking-widest">{formattedTime}</span>
                  <span className="text-base lowercase">{period}</span>
                </p>
                <p className="text-xs">{title}</p>
                <MdDelete
                  onClick={() => onHandleDelete(title, zone)}
                  className="absolute -top-2 right-0 text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                  size={12}
                />
                <FaEdit
                  onClick={() => {
                    setInputValue({ title, zone });
                    setEditIndex(index);
                    setIsDialogOpen(true);
                  }}
                  className="absolute -top-2 right-5 text-blue-400 opacity-0 group-hover:opacity-100 cursor-pointer text-xs"
                  size={12}
                />
              </div>
              {index < timeZones.length - 1 && (
                <div className="h-8 w-px bg-white/20 mx-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
