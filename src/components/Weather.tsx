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

  return (
    <div className="text-right font-semibold text-sm">
      <p>
        {name}, {sys.country}
      </p>
      <div className="flex items-center space-x-2 justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
          alt={weather[0].description}
          className="size-16"
        />
        <div>
          <p>{Math.ceil(main.temp)}°C</p>
          <p className="capitalize">{weather[0].description || "N/A"}</p>
        </div>
      </div>
      <p>
        Humidity: {main.humidity || "--"}% | Wind: {wind.speed || "--"} m/s
      </p>
    </div>
  );
}
