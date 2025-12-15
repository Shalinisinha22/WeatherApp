import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import weatherReducer from "./reducers/weatherReducer";

export const store = createStore(weatherReducer, applyMiddleware(thunk));



