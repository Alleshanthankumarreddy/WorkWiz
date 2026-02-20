import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null,     // { _id, role }
  token: null,
  role: null,
  isAuthenticated: false,
};

// 🔹 Decode helper
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);

    return {
      user: {
        _id: decoded.userId,
        role: decoded.role,
      },
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;

      const decodedData = decodeToken(token);
      if (!decodedData) return;

      state.token = token;
      state.user = decodedData.user;
      state.role = decodedData.role;
      state.isAuthenticated = true;

      // ✅ Persist everything needed
      localStorage.setItem("token", token);
      localStorage.setItem("userId", decodedData.user._id);
      localStorage.setItem("role", decodedData.role);
    },

    restoreSession: (state) => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decodedData = decodeToken(token);
      if (!decodedData) {
        localStorage.clear();
        return;
      }

      state.token = token;
      state.user = decodedData.user;
      state.role = decodedData.role;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("fcmToken");
    },
  },
});

export const { setCredentials, restoreSession, logout } =
  authSlice.actions;

export default authSlice.reducer;
