import { applyMiddleware, createStore } from "redux";
import weatherReducer from "./reducers/weatherReducer";

// Custom thunk-like middleware for handling async actions
const asyncMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Apply custom async middleware
export const store = createStore(weatherReducer, applyMiddleware(asyncMiddleware));



