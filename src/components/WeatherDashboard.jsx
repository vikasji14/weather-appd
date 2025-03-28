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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
        🌤 Weather Dashboard
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter city name"
          className="p-3 w-64 rounded-lg border-none outline-none shadow-md focus:ring-2 focus:ring-blue-300"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-gray-100 transition"
          onClick={fetchWeather}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-white text-lg">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {weather && (
        <div className="bg-white/20 backdrop-blur-lg shadow-lg p-6 rounded-xl text-center text-white w-80">
          <h2 className="text-3xl font-semibold mb-2">{weather.name}</h2>
          <p className="text-5xl font-bold">{weather.main.temp}°C</p>
          <p className="capitalize text-lg">{weather.weather[0].description}</p>
          <p className="flex items-center justify-center gap-2 mt-2 text-lg">
            <WiHumidity size={28} /> {weather.main.humidity}%
          </p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-3">5-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-lg p-4 shadow-md rounded-lg text-white text-center"
              >
                <p className="text-2xl">{day.main.temp}°C</p>
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
