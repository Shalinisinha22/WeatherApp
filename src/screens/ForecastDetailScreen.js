import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// data: one item from OpenWeatherMap forecast.list
export default function ForecastDetailScreen({ route, navigation }) {
  const { data } = route.params;
  const [imageError, setImageError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const icon = data.weather?.[0]?.icon;
  const description = data.weather?.[0]?.description;
  const main = data.weather?.[0]?.main;
  const temp = Math.round(data.main?.temp);
  const humidity = data.main?.humidity;
  const windSpeed = data.wind?.speed;
  const feelsLike = Math.round(data.main?.feels_like);
  const tempMax = Math.round(data.main?.temp_max);
  const tempMin = Math.round(data.main?.temp_min);
  const pressure = data.main?.pressure;
  const cloudiness = data.clouds?.all;

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
        return <Ionicons name="sunny" size={100} color="#fbbf24" />;
      case "Clouds":
        return <Ionicons name="cloud" size={100} color="#cbd5e1" />;
      case "Rain":
      case "Drizzle":
        return <Ionicons name="rainy" size={100} color="#60a5fa" />;
      case "Thunderstorm":
        return <Ionicons name="thunderstorm" size={100} color="#818cf8" />;
      case "Snow":
        return <Ionicons name="snow" size={100} color="#f0f9ff" />;
      case "Mist":
      case "Smoke":
      case "Haze":
        return <Ionicons name="water" size={100} color="#94a3b8" />;
      default:
        return <Ionicons name="cloud-circle" size={100} color="#9ca3af" />;
    }
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1e1b4b", "#020617"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Date and Main Weather */}
          <View style={styles.headerSection}>
            <Text style={styles.date}>{data.dt_txt}</Text>
            <Text style={[styles.condition, { marginTop: 8 }]}>
              {description?.charAt(0).toUpperCase() + description?.slice(1)}
            </Text>
          </View>

          {/* Main Card with Icon */}
          <View style={styles.mainCard}>
            <View style={styles.iconContainerWrapper}>
              <View style={styles.iconContainer}>
                {getWeatherIcon()}
              </View>
            </View>

            {/* Temperature Display */}
            <View style={styles.tempSection}>
              <Text style={styles.mainTemp}>{temp}°</Text>
              <Text style={styles.mainTempLabel}>{main}</Text>
              <View style={styles.feelsLikeContainer}>
                <Ionicons name="thermometer" size={16} color="#cbd5e1" />
                <Text style={styles.feelsLikeText}>Feels like {feelsLike}°</Text>
              </View>
            </View>
          </View>

          {/* Temperature Range Card */}
          <View style={styles.rangeCard}>
            <View style={styles.rangeItem}>
              <View style={[styles.rangeIconBox, { backgroundColor: "#dc262633" }]}>
                <Ionicons name="arrow-up" size={20} color="#f87171" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rangeLabel}>High</Text>
                <Text style={styles.rangeValue}>{tempMax}°C</Text>
              </View>
            </View>

            <View style={styles.rangeDivider} />

            <View style={styles.rangeItem}>
              <View style={[styles.rangeIconBox, { backgroundColor: "#3b82f633" }]}>
                <Ionicons name="arrow-down" size={20} color="#60a5fa" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rangeLabel}>Low</Text>
                <Text style={styles.rangeValue}>{tempMin}°C</Text>
              </View>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsSection}>
            <Text style={styles.detailsTitle}>Weather Details</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <View style={[styles.detailIconBox, { backgroundColor: "#60a5fa33" }]}>
                  <Ionicons name="water" size={24} color="#60a5fa" />
                </View>
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{humidity}%</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconBox, { backgroundColor: "#f97316​33" }]}>
                  <Ionicons name="wind" size={24} color="#f97316" />
                </View>
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>{windSpeed?.toFixed(1)} m/s</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconBox, { backgroundColor: "#06b6d433" }]}>
                  <Ionicons name="settings" size={24} color="#06b6d4" />
                </View>
                <Text style={styles.detailLabel}>Pressure</Text>
                <Text style={styles.detailValue}>{pressure} hPa</Text>
              </View>

              <View style={styles.detailCard}>
                <View style={[styles.detailIconBox, { backgroundColor: "#8b5cf633" }]}>
                  <Ionicons name="cloud" size={24} color="#a78bfa" />
                </View>
                <Text style={styles.detailLabel}>Cloudiness</Text>
                <Text style={styles.detailValue}>{cloudiness}%</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 80,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#1e293b80",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#475569",
  },
  headerSection: {
    marginBottom: 24,
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  condition: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e2e8f0",
    marginTop: 4,
  },

  // Main Card
  mainCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(71, 85, 105, 0.3)",
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainerWrapper: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(71, 85, 105, 0.4)",
  },
  icon: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },

  // Temperature Section
  tempSection: {
    alignItems: "center",
  },
  mainTemp: {
    fontSize: 64,
    fontWeight: "700",
    color: "#fbbf24",
    marginBottom: 8,
  },
  mainTempLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#cbd5e1",
    marginBottom: 12,
  },
  feelsLikeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(71, 85, 105, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  feelsLikeText: {
    fontSize: 14,
    color: "#cbd5e1",
    marginLeft: 6,
  },

  // Range Card
  rangeCard: {
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(71, 85, 105, 0.3)",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 24,
  },
  rangeItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  rangeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rangeLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rangeValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  rangeDivider: {
    width: 1,
    backgroundColor: "rgba(71, 85, 105, 0.3)",
    marginHorizontal: 12,
  },

  // Details Section
  detailsSection: {
    marginBottom: 32,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  detailCard: {
    width: "48%",
    backgroundColor: "rgba(30, 41, 59, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(71, 85, 105, 0.3)",
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  detailIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
  },
});

