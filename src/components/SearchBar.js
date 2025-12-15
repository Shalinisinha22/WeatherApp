import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

export default function SearchBar({ onSearch, onType }) {
  const [value, setValue] = useState("");

  const handleChange = (text) => {
    setValue(text);
    if (onType) {
      onType(text);
    }
  };

  const handleSubmit = () => {
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <Searchbar
      placeholder="Search city (e.g. London)"
      value={value}
      onChangeText={handleChange}
      onIconPress={handleSubmit}
      onSubmitEditing={handleSubmit}
      style={styles.search}
      inputStyle={styles.input}
      iconColor="#9ca3af"
      placeholderTextColor="#6b7280"
    />
  );
}

const styles = StyleSheet.create({
  search: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 999,
    elevation: 4,
    backgroundColor: "#0f172a",
  },
  input: {
    color: "#e5e7eb",
  },
});

