import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import Exercise from "../components/Exercise";

export default function PracticeScreen(props) {
	const id = props.route.params.lessonId;
	const index = props.route.params.themeIndex;
	return (
		<KeyboardAvoidingView style={styles.container} behavior="padding">
			<View style={styles.header}>
				<Text style={styles.title}>Exercises</Text>
			</View>
			<View style={styles.content}>
				<Exercise id={id} index={index} />
			</View>
		</KeyboardAvoidingView>
	);
}
const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: "700",
		top: 80,
		textAlign: "center",
	},
});
