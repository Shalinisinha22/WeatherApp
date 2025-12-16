import { fetchMultipleCurrent, fetchWeather, searchCity } from "../../api/weatherApi";

export const getWeather = (city, days = 3) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_START" });
    const combined = await fetchWeather(city, days);
    dispatch({ type: "FETCH_SUCCESS", payload: combined });
    // Track recent search using the current weather payload
    if (combined?.current) {
      dispatch({ type: "ADD_RECENT_CITY", payload: combined.current });
    }
  } catch (error) {
    const apiMessage =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    dispatch({ type: "FETCH_ERROR", payload: apiMessage });
  }
};

// Use WeatherAPI search endpoint and then fetch current weather for the top
// results so the UI can render suggestion cards in the same shape.
export const getCitySuggestions = (query) => async (dispatch) => {
  if (!query || String(query).trim().length < 2) {
    // clear suggestions on short queries
    dispatch({ type: "SET_SUGGESTIONS", payload: [] });
    return;
  }

  try {
    dispatch({ type: "SUGGESTIONS_LOADING" });
    const results = await searchCity(query);
    if (!Array.isArray(results) || results.length === 0) {
      dispatch({ type: "SET_SUGGESTIONS", payload: [] });
      return;
    }

    // take up to 6 results; build q strings (name + region + country) for clarity
    const top = results.slice(0, 6).map((r) => {
      const parts = [r.name, r.region, r.country].filter(Boolean);
      return parts.join(", ");
    });

    const payload = await fetchMultipleCurrent(top);
    dispatch({ type: "SET_SUGGESTIONS", payload });
  } catch (error) {
    // non-fatal for suggestions; clear or leave existing suggestions
    dispatch({ type: "SUGGESTIONS_ERROR" });
    dispatch({ type: "SET_SUGGESTIONS", payload: [] });
  }
};

// Load some popular cities on startup for initial suggestions
export const loadInitialCities = () => async (dispatch) => {
  try {
    const cities = ["London", "New York", "Tokyo", "Delhi", "Sydney", "Paris"];
    const data = await fetchMultipleCurrent(cities);
    dispatch({ type: "SET_SUGGESTIONS", payload: data });
  } catch (error) {
    // Ignore initial suggestions errors
  }
};

// Action to set the number of forecast days (3-10)
export const setForecastDays = (days) => (dispatch) => {
  const clamped = Math.max(3, Math.min(10, days));
  dispatch({ type: "SET_FORECAST_DAYS", payload: clamped });
};


