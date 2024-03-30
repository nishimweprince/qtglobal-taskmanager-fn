import { createSlice } from "@reduxjs/toolkit";

export const taskSlice = createSlice({
    name: 'task',
    initialState: {
        task: {},
        tasksList: [],
        selectedAssignees: [],
        selectedProjects: [],
        listProjectsModal: false,
        listUsersModal: false,
        updateTaskStatusModal: false,
    },
    reducers: {
        setSelectedAssignees: (state, action) => {
            state.selectedAssignees = [...state.selectedAssignees, action.payload]
        },
        setSelectedProjects: (state, action) => {
            state.selectedProjects = [...state.selectedProjects, action?.payload]
        },
        setTask: (state, action) => {
            state.task = action.payload;
        },
        setTasksList: (state, action) => {
            state.tasksList = action.payload;
        },
        toggleListProjectsModal: (state, action) => {
            state.listProjectsModal = action.payload
        },
        toggleListUsersModal: (state, action) => {
            state.listUsersModal = action.payload
        },
        removeSelectedAssignee: (state, action) => {
            state.selectedAssignees = action.payload
        },
        removeSelectedProject: (state, action) => {
            state.selectedProjects = action.payload
        },
        setUpdateTaskStatusModal: (state, action) => {
            state.updateTaskStatusModal = action.payload
        }
    }
});

export default taskSlice.reducer;

export const { setSelectedAssignees, setSelectedProjects, setTask, setTasksList, toggleListProjectsModal, toggleListUsersModal, removeSelectedAssignee, removeSelectedProject, setUpdateTaskStatusModal } = taskSlice.actions;
