import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
	name: "favorites",
	initialState: {
		words: [],
	},
	reducers: {
		setFavorites: (state, action) => {
			state.words = action.payload;
		},
		addFavorite: (state, action) => {
			state.words.push(action.payload);
		},
	},
});

export const { setFavorites, addFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
