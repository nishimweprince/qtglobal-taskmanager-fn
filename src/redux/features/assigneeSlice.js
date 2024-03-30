import { createSlice } from "@reduxjs/toolkit";

export const assigneeSlice = createSlice({
    name: 'assignee',
    initialState: {
        assignee: {},
        assigneesList: [],
        createAssigneeModal: false
    },
    reducers: {
        setAssignee: (state, action) => {
            state.assignee = action.payload;
        },
        setAssigneesList: (state, action) => {
            state.assigneesList = action.payload;
        },
        toggleCreateAssigneeModal: (state, action) => {
            state.createAssigneeModal = action.payload
        },
    }
});

export default assigneeSlice.reducer;

export const { setAssignee, setAssigneesList, toggleCreateAssigneeModal } = assigneeSlice.actions;
