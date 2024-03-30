import { createSlice } from "@reduxjs/toolkit";

export const projectSlice = createSlice({
    name: 'project',
    initialState: {
        project: {},
        projectsList: [],
        createProjectModal: false
    },
    reducers: {
        setProject: (state, action) => {
            state.project = action.payload;
        },
        setProjectsList: (state, action) => {
            state.projectsList = action.payload;
        },
        toggleCreateProjectModal: (state, action) => {
            state.createProjectModal = action.payload
        },
    }
});

export default projectSlice.reducer;

export const { setProject, setProjectsList, toggleCreateProjectModal } = projectSlice.actions;
