import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

// item: one entry from OpenWeatherMap "forecast.list"
export default function ForecastCard({ item, onPress }) {
  const dateTime = item.dt_txt;
  const icon = item.weather?.[0]?.icon;
  const description = item.weather?.[0]?.description;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.date}>{dateTime}</Text>
        {icon && (
          <Image
            style={styles.icon}
            source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
          />
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>
          {Math.round(item.main?.temp_max)}°C / {Math.round(item.main?.temp_min)}°C
        </Text>
        <Text style={styles.text}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e5e7eb",
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
  text: {
    fontSize: 12,
    marginTop: 4,
    color: "#d1d5db",
  },
});

