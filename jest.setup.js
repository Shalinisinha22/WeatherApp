// jest.setup.js

jest.mock("expo-constants", () => ({
  Constants: {
    expoConfig: {
      extra: {},
    },
  },
}));

// Mock AsyncStorage if needed
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));
