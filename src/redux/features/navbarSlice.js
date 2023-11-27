import { createSlice } from "@reduxjs/toolkit";

export const navbarSlice = createSlice({
    name: "navbar",
    initialState: {
        dropdownOpen: false,
    },
    reducers: {
        toggleDropdown: (state) => {
            state.dropdownOpen = !state.dropdownOpen;
        },
    }
});

export default navbarSlice.reducer;

export const { toggleDropdown } = navbarSlice.actions;
