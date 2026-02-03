import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

let user = null;
let role = null;

if (token) {
  try {
    const decoded = jwtDecode(token);
    user = {
      _id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
    role = decoded.role;
    
  } catch (error) {
    console.log("Invalid token");
    localStorage.removeItem("token");
  }
}

const initialState = {
  user,
  token,
  role,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
