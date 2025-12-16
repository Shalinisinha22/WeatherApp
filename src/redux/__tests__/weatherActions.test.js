import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as weatherApi from "../../api/weatherApi";
import * as weatherActions from "../actions/weatherActions";

// Mock the API module
jest.mock("../../api/weatherApi");

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("Weather Actions (Thunks)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getWeather", () => {
    it("should dispatch FETCH_START and FETCH_SUCCESS on successful fetch", async () => {
      const mockWeatherData = {
        current: {
          id: "London-51.5-0.1",
          name: "London",
          sys: { country: "UK" },
          main: { temp: 15, temp_max: 18, temp_min: 12, humidity: 70, feels_like: 14 },
          weather: [{ icon: "http://...", description: "Partly cloudy", main: "Partly" }],
        },
        forecast: { list: [] },
      };

      weatherApi.fetchWeather.mockResolvedValue(mockWeatherData);

      const expectedActions = [
        { type: "FETCH_START" },
        { type: "FETCH_SUCCESS", payload: mockWeatherData },
        { type: "ADD_RECENT_CITY", payload: mockWeatherData.current },
      ];

      const store = mockStore({});
      return store.dispatch(weatherActions.getWeather("London", 3)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should dispatch FETCH_ERROR on API error", async () => {
      const error = new Error("Network error");
      error.response = { data: { message: "City not found" } };
      weatherApi.fetchWeather.mockRejectedValue(error);

      const expectedActions = [
        { type: "FETCH_START" },
        { type: "FETCH_ERROR", payload: "City not found" },
      ];

      const store = mockStore({});
      return store.dispatch(weatherActions.getWeather("InvalidCity", 3)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it("should call fetchWeather with correct params", async () => {
      weatherApi.fetchWeather.mockResolvedValue({
        current: {},
        forecast: { list: [] },
      });

      const store = mockStore({});
      await store.dispatch(weatherActions.getWeather("Paris", 7));

      expect(weatherApi.fetchWeather).toHaveBeenCalledWith("Paris", 7);
    });
  });

  describe("getCitySuggestions", () => {
    it("should dispatch SET_SUGGESTIONS on successful search", async () => {
      const mockSuggestions = [
        { id: "city-1", name: "London", temp: 15 },
        { id: "city-2", name: "London Bridge", temp: 14 },
      ];

      weatherApi.searchCity.mockResolvedValue([
        { name: "London", region: "England", country: "UK", lat: 51.5, lon: -0.1 },
        { name: "London Bridge", region: "England", country: "UK", lat: 51.5, lon: -0.1 },
      ]);

      weatherApi.fetchMultipleCurrent.mockResolvedValue(mockSuggestions);

      const expectedActions = [
        { type: "SUGGESTIONS_LOADING" },
        { type: "SET_SUGGESTIONS", payload: mockSuggestions },
      ];

      const store = mockStore({});
      return store.dispatch(weatherActions.getCitySuggestions("Lon")).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(weatherApi.searchCity).toHaveBeenCalledWith("Lon");
      });
    });

    it("should clear suggestions for queries shorter than 2 chars", async () => {
      const expectedActions = [{ type: "SET_SUGGESTIONS", payload: [] }];

      const store = mockStore({});
      return store.dispatch(weatherActions.getCitySuggestions("L")).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(weatherApi.searchCity).not.toHaveBeenCalled();
      });
    });

    it("should dispatch SUGGESTIONS_ERROR and clear suggestions on API error", async () => {
      weatherApi.searchCity.mockRejectedValue(new Error("API error"));

      const expectedActions = [
        { type: "SUGGESTIONS_LOADING" },
        { type: "SUGGESTIONS_ERROR" },
        { type: "SET_SUGGESTIONS", payload: [] },
      ];

      const store = mockStore({});
      return store.dispatch(weatherActions.getCitySuggestions("London")).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe("setForecastDays", () => {
    it("should dispatch SET_FORECAST_DAYS with clamped value", () => {
      const expectedActions = [{ type: "SET_FORECAST_DAYS", payload: 7 }];

      const store = mockStore({});
      store.dispatch(weatherActions.setForecastDays(7));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it("should clamp days between 3 and 10", () => {
      const store1 = mockStore({});
      store1.dispatch(weatherActions.setForecastDays(1)); // should become 3
      expect(store1.getActions()).toEqual([{ type: "SET_FORECAST_DAYS", payload: 3 }]);

      const store2 = mockStore({});
      store2.dispatch(weatherActions.setForecastDays(15)); // should become 10
      expect(store2.getActions()).toEqual([{ type: "SET_FORECAST_DAYS", payload: 10 }]);
    });
  });

  describe("loadInitialCities", () => {
    it("should dispatch SET_SUGGESTIONS with popular cities", async () => {
      const mockCities = [
        { id: "london", name: "London", temp: 15 },
        { id: "tokyo", name: "Tokyo", temp: 22 },
      ];

      weatherApi.fetchMultipleCurrent.mockResolvedValue(mockCities);

      const expectedActions = [{ type: "SET_SUGGESTIONS", payload: mockCities }];

      const store = mockStore({});
      return store.dispatch(weatherActions.loadInitialCities()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
        expect(weatherApi.fetchMultipleCurrent).toHaveBeenCalledWith([
          "London",
          "New York",
          "Tokyo",
          "Delhi",
          "Sydney",
          "Paris",
        ]);
      });
    });

    it("should silently ignore errors on initial load", async () => {
      weatherApi.fetchMultipleCurrent.mockRejectedValue(new Error("Network error"));

      const expectedActions = []; // no dispatch on error

      const store = mockStore({});
      return store.dispatch(weatherActions.loadInitialCities()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
