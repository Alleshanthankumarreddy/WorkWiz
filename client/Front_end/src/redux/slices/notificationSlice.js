import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    fcmToken: null,
  },
  reducers: {
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
      localStorage.setItem("fcmToken",state.fcmToken);
    },
    clearFcmToken: (state) => {
      state.fcmToken = null;
      localStorage.removeItem("fcmToken");
    },
  },
});

export const { setFcmToken, clearFcmToken } = notificationSlice.actions;
export default notificationSlice.reducer;
