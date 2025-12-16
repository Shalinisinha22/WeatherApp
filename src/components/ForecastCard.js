import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// item: one entry from OpenWeatherMap "forecast.list"
export default function ForecastCard({ item, onPress }) {
  const dateTime = item.dt_txt;
  const icon = item.weather?.[0]?.icon;
  const main = item.weather?.[0]?.main;
  const description = item.weather?.[0]?.description;
  const [imageError, setImageError] = useState(false);

  // Get icon based on weather condition with fallback
  const getIconComponent = () => {
    if (!imageError && icon) return null; // Use image
    
    switch (main) {
      case "Clear":
        return <Ionicons name="sunny" size={32} color="#fbbf24" />;
      case "Clouds":
        return <Ionicons name="cloud" size={32} color="#cbd5e1" />;
      case "Rain":
      case "Drizzle":
        return <Ionicons name="rainy" size={32} color="#60a5fa" />;
      case "Thunderstorm":
        return <Ionicons name="thunderstorm" size={32} color="#818cf8" />;
      case "Snow":
        return <Ionicons name="snow" size={32} color="#f0f9ff" />;
      case "Mist":
      case "Smoke":
      case "Haze":
      case "Dust":
      case "Fog":
      case "Sand":
      case "Ash":
      case "Squall":
      case "Tornado":
        return <Ionicons name="water" size={32} color="#94a3b8" />;
      default:
        return <Ionicons name="cloud-circle" size={32} color="#9ca3af" />;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.date}>{dateTime}</Text>
        {!imageError && icon ? (
          <Image
            style={styles.icon}
            source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.iconFallback}>{getIconComponent()}</View>
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
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginLeft: 8,
  },
  iconFallback: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  text: {
    fontSize: 12,
    marginTop: 4,
    color: "#d1d5db",
    flex: 1,
  },
});

