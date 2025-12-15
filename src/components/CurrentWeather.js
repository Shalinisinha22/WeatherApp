import React, { useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// data: OpenWeatherMap "weather" response
export default function CurrentWeather({ data }) {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

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
      {main === "Clear" ? (
        <View style={styles.iconWrapper}>
          <Ionicons name="sunny" size={64} color="#fbbf24" />
        </View>
      ) : (
        icon && (
          <View style={styles.iconWrapper}>
            <Image
              style={styles.icon}
              source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
            />
          </View>
        )
      )}
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

