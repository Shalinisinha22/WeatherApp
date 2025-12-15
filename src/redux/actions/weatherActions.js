import { fetchWeather, searchCity, fetchMultipleCurrent } from "../../api/weatherApi";

export const getWeather = (city) => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_START" });
    const combined = await fetchWeather(city);
    dispatch({ type: "FETCH_SUCCESS", payload: combined });
    // Track recent search using the current weather payload
    if (combined?.current) {
      dispatch({ type: "ADD_RECENT_CITY", payload: combined.current });
    }
  } catch (error) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    dispatch({ type: "FETCH_ERROR", payload: apiMessage });
  }
};

// Reserved for future typeahead suggestions – no longer mutates popular cities
export const getCitySuggestions = (_query) => async () => {};

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

