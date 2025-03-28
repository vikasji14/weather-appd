
import { useState } from "react";
import { WiHumidity } from "react-icons/wi";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const WeatherDashboard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const API_KEY = "dd94f859a0e52d6e4767fddf735f04a7"; 

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found. Please try again.");
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

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const filteredHourly = forecast.filter(
      (hour) => dayjs(hour.dt_txt).format("MMM D") === date
    );

    const formattedHourly = [];
    for (let i = 0; i < 24; i++) {
      const hourStr = dayjs().hour(i).minute(0).format("h A");
      const hourData = filteredHourly.find((h) => dayjs(h.dt_txt).format("h A") === hourStr);
      formattedHourly.push({
        time: hourStr,
        main: hourData ? hourData.main : { temp: "-", humidity: "-" },
        weather: hourData ? hourData.weather : [{ description: "No Data" }],
      });
    }

    setHourly(formattedHourly);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700 p-6">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg flex items-center">🌤 Weather App</h1>

      <div className="flex gap-3 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          className="p-3 w-full rounded-lg border-none outline-none shadow-md focus:ring-2 focus:ring-blue-300"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-gray-100 transition flex items-center gap-2"
          onClick={fetchWeather}
          disabled={loading}
        >
          <FaSearch />
          Search
        </button>
      </div>

      {loading && <p className="text-white text-lg animate-pulse">Loading...</p>}
      {error && <p className="text-red-400 font-semibold">{error}</p>}

      {weather && (
        <motion.div
          className="bg-white/20 backdrop-blur-lg shadow-lg p-6 rounded-xl text-center text-white w-80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold mb-2">{weather.name}</h2>
          <p className="text-lg">{dayjs().format("MMM D, YYYY h:mm A")}</p>
          <p className="text-5xl font-bold">{weather.main.temp}°C</p>
          <p className="capitalize text-lg">{weather.weather[0].description}</p>
          <p className="flex items-center justify-center gap-2 mt-2 text-lg">
            <WiHumidity size={28} /> {weather.main.humidity}%
          </p>
        </motion.div>
      )}

      {forecast.length > 0 && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-white mb-3">5-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...new Set(forecast.map((day) => dayjs(day.dt_txt).format("MMM D")))].map((date, index) => {
              const dailyData = forecast.find((day) => dayjs(day.dt_txt).format("MMM D") === date);
              return (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-lg p-4 shadow-md rounded-lg text-white text-center cursor-pointer"
                  onClick={() => handleDayClick(date)}
                >
                  <p className="text-lg font-semibold">{date}</p>
                  <p className="text-2xl font-bold">{dailyData?.main?.temp}°C</p>
                  <p className="capitalize">{dailyData?.weather[0]?.description}</p>
                  <p className="flex items-center justify-center gap-2 mt-2 text-lg">
                    <WiHumidity size={20} /> {dailyData?.main?.humidity}%
                  </p>
                  
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hourly.length > 0 && (
        <motion.div className="mt-8 w-full max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-xl font-semibold text-white mb-3">Hourly Forecast for {selectedDate}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {hourly.map((hour, index) => (
              <motion.div key={index} className="bg-white/20 backdrop-blur-lg p-4 shadow-md rounded-lg text-white text-center" whileHover={{ scale: 1.05 }}>
                <p className="text-lg font-semibold">{hour.time}</p>
                <p className="text-2xl font-bold">{hour.main.temp}°C</p>
                <p className="capitalize">{hour.weather[0].description}</p>
                <p>Humidity: {hour.main.humidity}%</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherDashboard;