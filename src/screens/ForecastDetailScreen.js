import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// data: one item from OpenWeatherMap forecast.list
export default function ForecastDetailScreen({ route }) {
  const { data } = route.params;

  const icon = data.weather?.[0]?.icon;
  const description = data.weather?.[0]?.description;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.date}>{data.dt_txt}</Text>
        {icon && (
          <Image
            style={styles.icon}
            source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
          />
        )}
        <Text style={styles.condition}>{description}</Text>
        <Text style={styles.text}>Temp now: {Math.round(data.main?.temp)}°C</Text>
        <Text style={styles.text}>
          Max: {Math.round(data.main?.temp_max)}°C • Min:{" "}
          {Math.round(data.main?.temp_min)}°C
        </Text>
        <Text style={styles.text}>Humidity: {data.main?.humidity}%</Text>
        <Text style={styles.text}>Feels like: {Math.round(data.main?.feels_like)}°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#0f172a",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9ca3af",
    marginBottom: 8,
  },
  icon: {
    width: 90,
    height: 90,
    marginVertical: 12,
    resizeMode: "contain",
  },
  condition: {
    fontSize: 20,
    marginBottom: 8,
    color: "#e5e7eb",
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
    color: "#d1d5db",
  },
});

