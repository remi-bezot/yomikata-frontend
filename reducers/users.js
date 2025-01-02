import { createSlice } from "@reduxjs/toolkit";


const initialState = {
	value: { token: null, username: null, formModal: false},
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		login: (state, action) => {
			state.value.token = action.payload.token;
			state.value.username = action.payload.username;
		},
		logout: (state) => {
			state.value.token = null;
			state.value.username = null;
		},
		showModal: (state, action) => {
			state.value.formModal = action.payload
		}
	},
});

export const { login, logout, showModal } = userSlice.actions;
export default userSlice.reducer;
