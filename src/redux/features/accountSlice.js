import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: "account",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
        deleteUserModal: false,
        selectedUser: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        setDeleteUserModal: (state, action) => {
            state.deleteUserModal = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    },
})

export default accountSlice.reducer;

export const { setUser, setToken, setDeleteUserModal, setSelectedUser } = accountSlice.actions;
