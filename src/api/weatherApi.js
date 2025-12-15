import axios from "axios";

// OpenWeatherMap configuration
// Example key from your email: c233563c3eae28a222928e8100d43c9b
// You can keep it here or move to an .env file later.
const API_KEY = "c233563c3eae28a222928e8100d43c9b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Fetch current weather + 5-day/3-hour forecast for a city
export const fetchWeather = (city) =>
  axios
    .all([
      axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }),
      axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }),
    ])
    .then(
      axios.spread((currentRes, forecastRes) => ({
        current: currentRes.data,
        forecast: forecastRes.data,
      }))
    );

// Fetch only current weather for a list of cities (for suggestions)
export const fetchMultipleCurrent = async (cities) => {
  const requests = cities.map((city) =>
    axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    })
  );

  const responses = await Promise.all(requests);
  return responses.map((res) => res.data);
};

// Simple city "search" using the same weather endpoint and returning an array
export const searchCity = async (query) => {
  if (!query) return [];
  const res = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: query,
      appid: API_KEY,
      units: "metric",
    },
  });

  // Normalize to an array of objects similar to WeatherAPI search
  return [
    {
      id: res.data.id,
      name: res.data.name,
      country: res.data.sys?.country,
    },
  ];
};

