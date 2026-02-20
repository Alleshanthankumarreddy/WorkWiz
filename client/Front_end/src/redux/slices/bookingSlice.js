import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    bookings : []
}

const bookingSlice = createSlice({
    name: "bookings",
    initialState,
    reducers : {
        addBooking: (state, action) => {
            const exists = state.bookings.some(
                b => b.bookingId === action.payload.bookingId
            );

            if (!exists) {
                state.bookings.unshift(action.payload);
            }
        },

       setBookings: (state, action) => {
            const map = new Map();

            action.payload.forEach(booking => {
                map.set(booking.bookingId, booking);
            });

            state.bookings = Array.from(map.values());
        },

         removeBooking: (state, action) => {
            state.bookings = state.bookings.filter(
                booking => booking._id !== action.payload
            );
        }
    }
});

export const { addBooking, setBookings, removeBooking } = bookingSlice.actions;

export default bookingSlice.reducer;