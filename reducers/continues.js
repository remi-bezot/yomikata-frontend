import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	value: { lesson_id: null },
};

export const continueSlice = createSlice({
	name: "continues",
	initialState,
	reducers: {
		getContinue: (state, action) => {
			state.value.lesson_id = action.payload.lesson_id;

			// Sauvegarde dans AsyncStorage
			AsyncStorage.setItem("lesson_id", action.payload.lesson_id)
				.then(() => console.log("Lesson ID saved to AsyncStorage"))
				.catch((err) => console.error("Error saving lesson ID:", err));
		},
		loadContinue: (state, action) => {
			// Charge la valeur depuis AsyncStorage
			state.value.lesson_id = action.payload.lesson_id;
		},
	},
});

// Actions exportées
export const { getContinue, loadContinue } = continueSlice.actions;
export default continueSlice.reducer;
