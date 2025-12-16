import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

// data: OpenWeatherMap "weather" response
export default function CurrentWeather({ data }) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!data) return;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data, opacity, translateY]);

  if (!data) return null;

  const icon = data.weather?.[0]?.icon;
  const main = data.weather?.[0]?.main;
  const description = data.weather?.[0]?.description;

  // Get icon component based on weather condition
  const getWeatherIcon = () => {
    if (!imageError && icon) {
      return (
        <Image
          style={styles.icon}
          source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
          onError={() => setImageError(true)}
        />
      );
    }

    switch (main) {
      case "Clear":
        return <Ionicons name="sunny" size={80} color="#fbbf24" />;
      case "Clouds":
        return <Ionicons name="cloud" size={80} color="#cbd5e1" />;
      case "Rain":
      case "Drizzle":
        return <Ionicons name="rainy" size={80} color="#60a5fa" />;
      case "Thunderstorm":
        return <Ionicons name="thunderstorm" size={80} color="#818cf8" />;
      case "Snow":
        return <Ionicons name="snow" size={80} color="#f0f9ff" />;
      case "Mist":
      case "Smoke":
      case "Haze":
        return <Ionicons name="water" size={80} color="#94a3b8" />;
      default:
        return <Ionicons name="cloud-circle" size={80} color="#9ca3af" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.city}>{data.name}</Text>
      <Text style={styles.region}>{data.sys?.country}</Text>
      <View style={styles.iconWrapper}>
        {getWeatherIcon()}
      </View>
      <Text style={styles.temp}>{Math.round(data.main?.temp)}°C</Text>
      <Text style={styles.condition}>{description}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#0f172a",
  },
  city: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#f9fafb",
  },
  region: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 8,
  },
  icon: {
    width: 72,
    height: 72,
    resizeMode: "contain",
  },
  iconWrapper: {
    marginVertical: 10,
    padding: 16,
    borderRadius: 999,
    backgroundColor: "#020617",
  },
  temp: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fbbf24",
  },
  condition: {
    fontSize: 16,
    marginTop: 4,
    color: "#e5e7eb",
  },
});

