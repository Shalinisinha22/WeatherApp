import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";

// item: OpenWeatherMap current weather object
export default function CitySuggestionCard({ item, index, onPress }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, scale]);

  const icon = item.weather?.[0]?.icon;
  const description = item.weather?.[0]?.description;

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.city}>{item.name}</Text>
            <Text style={styles.country}>{item.sys?.country}</Text>
            <Text style={styles.temp}>{Math.round(item.main?.temp)}°C</Text>
            <Text style={styles.desc}>{description}</Text>
          </View>
          {icon && (
            <Image
              style={styles.icon}
              source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#1e293b",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  city: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f9fafb",
  },
  country: {
    fontSize: 12,
    color: "#cbd5f5",
    marginBottom: 4,
  },
  temp: {
    fontSize: 22,
    fontWeight: "600",
    color: "#f97316",
  },
  desc: {
    fontSize: 12,
    color: "#e5e7eb",
  },
  icon: {
    width: 60,
    height: 60,
  },
});


