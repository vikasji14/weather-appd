import { useState } from "react";
import { WiHumidity } from "react-icons/wi";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "dd94f859a0e52d6e4767fddf735f04a7"; // Replace with your OpenWeatherMap API Key

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&cnt=5&appid=${API_KEY}`
      );

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found");
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData.list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Weather Dashboard</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city name"
          className="p-2 rounded-md border"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white shadow-md p-4 rounded-md w-80 text-center">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <p className="text-xl">{weather.main.temp}°C</p>
          <p className="capitalize">{weather.weather[0].description}</p>
          <p className="flex items-center justify-center gap-1">
            <WiHumidity size={24} /> {weather.main.humidity}%
          </p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">5-Day Forecast</h2>
          <div className="grid grid-cols-2 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="bg-white p-2 shadow-md rounded-md">
                <p className="text-lg">{day.main.temp}°C</p>
                <p className="capitalize">{day.weather[0].description}</p>
                <p>Humidity: {day.main.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
