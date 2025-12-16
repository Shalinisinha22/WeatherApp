import axios from "axios";

// OpenWeatherMap API Configuration
// API Key from OpenWeatherMap (free tier)
const API_KEY = "c233563c3eae28a222928e8100d43c9b";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const makeIconUrl = (icon) => {
  if (!icon) return null;
  // OpenWeatherMap icon URL
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};


// Transform OpenWeatherMap current weather response to app format
const transformCurrent = (resp) => {
  return {
    id: resp.id,
    name: resp.name,
    sys: { country: resp.sys?.country },
    dt: resp.dt,
    main: {
      temp: resp.main?.temp,
      temp_max: resp.main?.temp_max,
      temp_min: resp.main?.temp_min,
      humidity: resp.main?.humidity,
      feels_like: resp.main?.feels_like,
    },
    weather: [
      {
        icon: makeIconUrl(resp.weather?.[0]?.icon),
        description: resp.weather?.[0]?.description,
        main: resp.weather?.[0]?.main,
      },
    ],
    raw: resp,
  };
};

// Transform OpenWeatherMap forecast response to app format
const transformForecast = (resp, days = 3) => {
  const allItems = resp.list?.map((item) => ({
    dt_txt: new Date(item.dt * 1000).toISOString().split("T")[0],
    dt: item.dt,
    main: {
      temp: item.main?.temp,
      temp_max: item.main?.temp_max,
      temp_min: item.main?.temp_min,
      humidity: item.main?.humidity,
      feels_like: item.main?.feels_like,
    },
    weather: [
      {
        icon: makeIconUrl(item.weather?.[0]?.icon),
        description: item.weather?.[0]?.description,
        main: item.weather?.[0]?.main,
      },
    ],
    raw: item,
  })) || [];

  // Group by date and take one entry per day (the first one for that day)
  const seenDates = new Set();
  const filteredList = [];
  
  for (const item of allItems) {
    if (!seenDates.has(item.dt_txt) && filteredList.length < days) {
      seenDates.add(item.dt_txt);
      filteredList.push(item);
    }
  }
  
  return { list: filteredList };
};

// Fetch weather and forecast for a city
export const fetchWeather = async (city, days = 3) => {
  try {
    const res = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });
    
    // Fetch 5-day forecast (OpenWeatherMap free tier)
    const forecastRes = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        cnt: 40, // Always fetch max available (5 days)
      },
    });

    const combined = {
      current: transformCurrent(res.data),
      forecast: transformForecast(forecastRes.data, days), // Pass days to filter
      raw: { current: res.data, forecast: forecastRes.data },
    };
    return combined;
  } catch (error) {
    console.log("API Error:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      message: error?.response?.data?.message || error?.message,
      url: error?.response?.config?.url,
    });
    throw error;
  }
};

// Fetch current weather for a city
export const fetchCurrent = async (city) => {
  try {
    const res = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });
    return transformCurrent(res.data);
  } catch (error) {
    console.log("FetchCurrent Error:", error?.response?.data?.message || error?.message);
    throw error;
  }
};

export const fetchMultipleCurrent = async (cities = []) => {
  // returns array of transformed current weather objects
  const calls = cities.map((c) => fetchCurrent(c).catch((e) => null));
  const results = await Promise.all(calls);
  return results.filter(Boolean);
};

// Search for cities by name
export const searchCity = async (query) => {
  try {
    // OpenWeatherMap doesn't have a dedicated search API in the free tier
    // So we'll use a mock search with common cities
    const commonCities = [
      { name: "London", region: "England", country: "GB", lat: 51.5085, lon: -0.1257 },
      { name: "New York", region: "New York", country: "US", lat: 40.7128, lon: -74.006 },
      { name: "Tokyo", region: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
      { name: "Paris", region: "Île-de-France", country: "FR", lat: 48.8566, lon: 2.3522 },
      { name: "Berlin", region: "Berlin", country: "DE", lat: 52.52, lon: 13.405 },
      { name: "Madrid", region: "Madrid", country: "ES", lat: 40.4168, lon: -3.7038 },
      { name: "Rome", region: "Lazio", country: "IT", lat: 41.9028, lon: 12.4964 },
      { name: "Amsterdam", region: "North Holland", country: "NL", lat: 52.374, lon: 4.8897 },
      { name: "Singapore", region: "Singapore", country: "SG", lat: 1.3521, lon: 103.8198 },
      { name: "Sydney", region: "New South Wales", country: "AU", lat: -33.8688, lon: 151.2093 },
      { name: "Dubai", region: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
      { name: "Bangkok", region: "Bangkok", country: "TH", lat: 13.7563, lon: 100.5018 },
      { name: "Mumbai", region: "Maharashtra", country: "IN", lat: 19.076, lon: 72.8777 },
      { name: "Delhi", region: "Delhi", country: "IN", lat: 28.7041, lon: 77.1025 },
      { name: "Toronto", region: "Ontario", country: "CA", lat: 43.6532, lon: -79.3832 },
    ];

    const q = query.toLowerCase();
    const results = commonCities.filter(
      (city) =>
        city.name.toLowerCase().includes(q) ||
        city.country.toLowerCase().includes(q)
    );

    return results.slice(0, 6); // Return top 6 matches
  } catch (error) {
    console.log("SearchCity Error:", error?.message);
    return [];
  }
};



