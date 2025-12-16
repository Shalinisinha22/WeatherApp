import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CitySuggestionCard from "../components/CitySuggestionCard";
import CurrentWeather from "../components/CurrentWeather";
import ForecastCard from "../components/ForecastCard";
import SearchBar from "../components/SearchBar";
import { getCitySuggestions, getWeather, loadInitialCities, setForecastDays } from "../redux/actions/weatherActions";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  // OpenWeatherMap: state.weather = { current, forecast }
  const weather = useSelector((state) => state.weather);
  const loading = useSelector((state) => state.loading);
  const loadingSuggestions = useSelector((state) => state.loadingSuggestions);
  const error = useSelector((state) => state.error);
  const suggestions = useSelector((state) => state.suggestions);
  const forecastDays = useSelector((state) => state.forecastDays);

  const forecastList = weather?.forecast?.list || [];

  useEffect(() => {
    // Load some default city cards on mount
    dispatch(loadInitialCities());
  }, [dispatch]);

  // Debounce for the typeahead suggestions
  const typeTimer = useRef(null);
  const handleType = useCallback(
    (text) => {
      if (typeTimer.current) clearTimeout(typeTimer.current);
      if (!text || text.trim().length < 2) {
        // clear suggestions for very short queries
        dispatch({ type: "SET_SUGGESTIONS", payload: [] });
        return;
      }
      typeTimer.current = setTimeout(() => {
        dispatch(getCitySuggestions(text.trim()));
      }, 400);
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      if (typeTimer.current) clearTimeout(typeTimer.current);
    };
  }, []);

  // Re-fetch weather when forecast days change (if a city is already selected)
  const lastCityRef = useRef(null);
  useEffect(() => {
    if (weather?.current?.name) {
      lastCityRef.current = weather.current.name;
    }
  }, [weather]);

  const handleForecastDaysChange = (days) => {
    dispatch(setForecastDays(days));
    if (lastCityRef.current) {
      // re-fetch the current city with new day count
      dispatch(getWeather(lastCityRef.current, days));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Weather App</Text>
      </View>

      <SearchBar onSearch={(city) => dispatch(getWeather(city, forecastDays))} onType={handleType} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {suggestions?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Popular cities</Text>
            {loadingSuggestions && <ActivityIndicator size="small" style={{ marginVertical: 8 }} />}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsRow}
            >
              {suggestions.map((item, index) => (
                <CitySuggestionCard
                  key={`popular-${item.id || index}`}
                  item={item}
                  index={index}
                  onPress={() => dispatch(getWeather(item.name, forecastDays))}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {error && !loading && (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {weather?.current && (
          <View>
            <CurrentWeather data={weather.current} />

            {/* Forecast days selector */}
            <View style={styles.daysContainer}>
              <Text style={styles.sectionTitle}>Forecast days</Text>
              <View style={styles.buttonRow}>
                {[3, 5, 7, 10].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayButton, forecastDays === d && styles.dayButtonActive]}
                    onPress={() => handleForecastDaysChange(d)}
                  >
                    <Text style={[styles.dayButtonText, forecastDays === d && styles.dayButtonTextActive]}>
                      {d}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Forecast</Text>
            <FlatList
              data={forecastList}
              keyExtractor={(item) => String(item.dt)}
              contentContainerStyle={styles.forecastList}
              renderItem={({ item }) => (
                <ForecastCard
                  item={item}
                  onPress={() => navigation.navigate("Details", { data: item })}
                />
              )}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingTop: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  sectionTitle: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  suggestionsRow: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  daysContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  dayButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#475569",
  },
  dayButtonActive: {
    backgroundColor: "#f97316",
    borderColor: "#f97316",
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cbd5e1",
  },
  dayButtonTextActive: {
    color: "#fff",
  },
  forecastList: {
    paddingHorizontal: 8,
    paddingBottom: 32,
    paddingTop: 4,
  },
});
