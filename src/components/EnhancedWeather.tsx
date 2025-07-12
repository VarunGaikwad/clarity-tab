import { useEffect, useState } from "react";
import { WeatherResponse } from "../interface/common";
import { useUserData } from "../hooks/useUserData";
import { WEATHER_API_KEY } from "../../env";

export default function EnhancedWeather() {
  const { userData, setUserData } = useUserData();
  const [weatherInfo, setWeatherInfo] = useState<WeatherResponse | null>(
    userData?.weather || null
  );

  useEffect(() => {
    if (!weatherInfo || !setUserData) return;
    setUserData((prev) => ({ ...prev, weather: weatherInfo }));
  }, [weatherInfo, setUserData]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchWeather = async () => {
      try {
        if (!navigator.geolocation) throw new Error("No geolocation");

        const { coords } = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
        );

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&lat=${coords.latitude}&lon=${coords.longitude}&units=metric`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setWeatherInfo(data);
      } catch (err) {
        console.error("Falling back to Tokyo", err);
        fetch(`/weather?q=Tokyo&units=metric`)
          .then((res) => res.json())
          .then(setWeatherInfo)
          .catch(console.error);
      }
    };

    fetchWeather();
    return () => controller.abort();
  }, []);

  if (!weatherInfo) return <p className="text-white text-sm">Loading...</p>;

  const { name, sys, main, wind, weather, clouds } = weatherInfo;

  const weatherItem = weather?.[0] ?? {
    icon: "01n",
    description: "Clear Sky",
  };

  const formatTime = (unix: number) =>
    new Date(unix * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="text-white text-sm font-medium w-full max-w-sm rounded-lg space-y-1">
      {/* Location & description */}
      <div className="text-center space-y-1">
        <p className="text-base font-bold">
          {name || "Unknown Location"}, {sys?.country || "??"}
        </p>
        <p className="capitalize text-gray-300">{weatherItem.description}</p>
      </div>

      {/* Icon & temperature */}
      <div className="flex items-center justify-center gap-1">
        <img
          src={`https://openweathermap.org/img/wn/${weatherItem.icon}@2x.png`}
          alt={weatherItem.description}
          className="w-16 h-16"
        />
        <div className="text-left">
          <p className="text-3xl font-bold">{Math.round(main.temp)}°C</p>
          <p className="text-xs text-gray-300">
            Feels like: {Math.round(main.feels_like)}°C
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-200">
        <p>💧 Humidity: {main.humidity}%</p>
        <p>💨 Wind: {wind.speed} m/s</p>
        <p>📈 Pressure: {main.pressure} hPa</p>
        <p>☁️ Cloud Cover: {clouds?.all ?? "--"}%</p>
        <p>🌅 Sunrise: {formatTime(sys.sunrise)}</p>
        <p>🌇 Sunset: {formatTime(sys.sunset)}</p>
      </div>
    </div>
  );
}
