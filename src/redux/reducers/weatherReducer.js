const initialState = {
  loading: false,
  loadingSuggestions: false,
  weather: null,
  error: null,
  suggestions: [], // default popular cities
  recent: [], // search history (array of current weather objects)
  forecastDays: 3, // configurable forecast days (3-10)
};

export default function weatherReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, weather: action.payload, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_SUGGESTIONS":
      return { ...state, suggestions: action.payload, loadingSuggestions: false };
    case "SUGGESTIONS_LOADING":
      return { ...state, loadingSuggestions: true };
    case "SUGGESTIONS_ERROR":
      return { ...state, loadingSuggestions: false };
    case "ADD_RECENT_CITY": {
      const city = action.payload;
      // remove if already exists, then add to front, and cap at 6
      const filtered = state.recent.filter((c) => c.id !== city.id);
      const updated = [city, ...filtered].slice(0, 6);
      return { ...state, recent: updated };
    }
    case "SET_FORECAST_DAYS":
      return { ...state, forecastDays: action.payload };
    default:
      return state;
  }
}

