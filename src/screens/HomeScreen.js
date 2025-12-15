import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator, ScrollView, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getWeather, getCitySuggestions, loadInitialCities } from "../redux/actions/weatherActions";
import SearchBar from "../components/SearchBar";
import CurrentWeather from "../components/CurrentWeather";
import ForecastCard from "../components/ForecastCard";
import CitySuggestionCard from "../components/CitySuggestionCard";

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  // OpenWeatherMap: state.weather = { current, forecast }
  const weather = useSelector((state) => state.weather);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);
  const suggestions = useSelector((state) => state.suggestions);

  const forecastList = weather?.forecast?.list || [];

  useEffect(() => {
    // Load some default city cards on mount
    dispatch(loadInitialCities());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Weather App</Text>
      </View>

      <SearchBar onSearch={(city) => dispatch(getWeather(city))} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {suggestions?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Popular cities</Text>
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
                  onPress={() => dispatch(getWeather(item.name))}
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
    color: "red",
    fontSize: 16,
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
  forecastList: {
    paddingHorizontal: 8,
    paddingBottom: 32,
    paddingTop: 4,
  },
});


