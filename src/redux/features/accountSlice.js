import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: "account",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        }
    },
})

export default accountSlice.reducer;

export const { setUser, setToken } = accountSlice.actions;
