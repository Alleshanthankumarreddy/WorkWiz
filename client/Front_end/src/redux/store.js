import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

/* ✅ IMPORTANT IMPORT */
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import bookingReducer from "./slices/bookingSlice";

/* ✅ Combine reducers */
const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer,
  bookings: bookingReducer,
});

/* ✅ Persist config */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "bookings"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ✅ FIX IS HERE */
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

/* ✅ Persistor */
export const persistor = persistStore(store);
