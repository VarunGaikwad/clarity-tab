import { useEffect, useState, useCallback } from "react";
import { MdAddCircle, MdDelete } from "react-icons/md";
import Dialog from "./Dialog";
import { TimeZoneType } from "../interface/common";
import { useUserData } from "../hooks/useUserData";

const formatTime = (date: Date, offset: number) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + offset * 3600000);
  const hours = localTime.getHours();
  const minutes = localTime.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  const displayHours = hours % 12 || 12;
  return {
    time: `${displayHours}:${minutes}`,
    period: isPM ? "pm" : "am",
  };
};

const getOffsetDifference = (locationOffset: number) => {
  const localOffset = -new Date().getTimezoneOffset() / 60;
  const difference = locationOffset - localOffset;
  if (difference > 0) {
    return `+${difference} hours`;
  } else if (difference < 0) {
    return `${difference} hours`;
  } else {
    return `Same time`;
  }
};

export default function WorldClock() {
  const { userData, setUserData } = useUserData();
  const [time, setTime] = useState(new Date());
  const [inputValue, setInputValue] = useState({
    title: "",
    offset: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeZones, setTimeZones] = useState<TimeZoneType[]>(
    userData?.timeZones || []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!setUserData) return;
    setUserData((prev) => ({ ...prev, timeZones }));
  }, [timeZones, setUserData]);

  useEffect(() => {
    setInputValue({
      title: "",
      offset: 0,
    });
  }, [isDialogOpen]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputValue((prev) => ({
        ...prev,
        [name]: name === "offset" ? Number(value) : value,
      }));
    },
    []
  );

  const onTimeZoneSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.title.length <= 2) {
      alert("Title must be more than 2 characters.");
      return;
    }

    if (
      inputValue.offset < -14 ||
      inputValue.offset > 14 ||
      inputValue.offset % 0.5 !== 0
    ) {
      alert("Offset must be between -14 and 14 and in increments of 0.5.");
      return;
    }

    if (
      timeZones.some(
        (zone) =>
          zone.title === inputValue.title && zone.offset === inputValue.offset
      )
    ) {
      alert("Time zone already exists.");
      return;
    }

    setTimeZones((prev) => [...prev, inputValue]);
    setIsDialogOpen(false);
  };

  const onHandleDelete = (title: string, offset: number) => {
    const shouldDelete = confirm(
      "Are you sure you want to delete this time zone?"
    );
    if (!shouldDelete) return;
    setTimeZones((prev) =>
      prev.filter((zone) => zone.title !== title && zone.offset !== offset)
    );
  };

  return (
    <div className="hidden lg:flex gap-4 justify-center items-center h-fit">
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
            placeholder="TimeOffset"
            type="number"
            max={14}
            min={-14}
            step={0.5}
            name="offset"
            value={inputValue.offset}
            onChange={handleInputChange}
          />
          <input type="submit" className="hidden" />
        </form>
      </Dialog>
      {timeZones.length < 5 && (
        <span
          onClick={() => setIsDialogOpen(true)}
          className="flex gap-1 items-center text-xs cursor-pointer"
        >
          <MdAddCircle className="text-3xl" />
          Add Time Zone
        </span>
      )}
      {timeZones.map(({ title, offset }) => {
        const { time: formattedTime, period } = formatTime(time, offset);
        const offsetDifference = getOffsetDifference(offset);
        return (
          <div key={title} className="text-right cursor-pointer relative group">
            <p className="text-lg font-semibold space-x-1">
              <span className="tracking-widest">{formattedTime}</span>
              <span className="text-base">{period}</span>
            </p>
            <p className="text-xs">{title}</p>
            <p className="text-xs text-left">{offsetDifference}</p>
            <MdDelete
              onClick={() => onHandleDelete(title, offset)}
              className="absolute -top-2 right-0 text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
              size={12}
            />
          </div>
        );
      })}
    </div>
  );
}
