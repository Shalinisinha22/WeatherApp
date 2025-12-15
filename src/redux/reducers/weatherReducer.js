const initialState = {
  loading: false,
  weather: null,
  error: null,
  suggestions: [], // default popular cities
  recent: [], // search history (array of current weather objects)
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
      return { ...state, suggestions: action.payload };
    case "ADD_RECENT_CITY": {
      const city = action.payload;
      // remove if already exists, then add to front, and cap at 6
      const filtered = state.recent.filter((c) => c.id !== city.id);
      const updated = [city, ...filtered].slice(0, 6);
      return { ...state, recent: updated };
    }
    default:
      return state;
  }
}

