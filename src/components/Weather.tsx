import { useEffect, useState } from "react";
import { WeatherResponse } from "../interface/common";
import { useUserData } from "../hooks/useUserData";
import { WEATHER_API_KEY } from "../../env";

export default function Weather() {
  const { userData, setUserData } = useUserData(),
    [weatherInfo, setWeatherInfo] = useState<WeatherResponse | null>(
      userData?.weather || null
    );

  useEffect(() => {
    if (!weatherInfo || !setUserData) return;

    setUserData((prev) => ({ ...prev, weather: weatherInfo }));
  }, [weatherInfo, setUserData]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      fetch("/weather?q=Tokyo&units=metric")
        .then((res) => res.json())
        .then(setWeatherInfo)
        .catch(console.error);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&lat=${latitude}&lon=${longitude}&units=metric`
      )
        .then((res) => res.json())
        .then(setWeatherInfo)
        .catch(console.error);
    });
  }, []);

  if (!weatherInfo) {
    return <p>Loading...</p>;
  }

  const {
    name = "Unknown Location",
    sys = {
      country: "Unknown Country",
    },
    weather = [
      {
        icon: "01n",
        description: "Clear Sky",
      },
    ],
    main = {
      temp: 0,
      humidity: 0,
    },
    wind = { speed: 0 },
  } = weatherInfo;

  const weatherItem = weather[0] ?? {
    icon: "01n",
    description: "Clear Sky",
  };

  return (
    <div className="flex flex-col items-center text-white text-sm font-medium gap-2 p-2 rounded-md w-full max-w-xs">
      <div className="text-center">
        <p className="text-base font-bold">
          {name}, {sys.country}
        </p>
        <p className="text-xs text-gray-300">
          {weatherItem.description.charAt(0).toUpperCase() +
            weatherItem.description.slice(1)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={`https://openweathermap.org/img/wn/${weatherItem.icon}@2x.png`}
          alt={weatherItem.description}
          className="w-14 h-14"
        />
        <p className="text-3xl font-bold">{Math.ceil(main.temp)}°C</p>
      </div>

      <div className="flex justify-between text-xs text-gray-100 w-full px-2">
        <p>💧 {main.humidity}%</p>
        <p>💨 {wind.speed} m/s</p>
      </div>
    </div>
  );
}
