import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withRepeat,
	Text,
	withSequence,
} from "react-native-reanimated";

export function SpeakerWave() {
	const translationY = useSharedValue(0); // Valeur partagée pour la translation verticale

	// Animation de vibration (mouvement haut-bas)
	const handlePressIn = () => {
		translationY.value = withRepeat(
			withSequence(
				withTiming(5, { duration: 200 }),
				withTiming(0, { duration: 200 })
			),
			6, // Run the animation 4 times
			false // Pas de retour automatique à 0
		);
	};

	// Appliquer l'animation de vibration
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translationY.value }],
	}));

	return (
		<Animated.View
			style={[styles.container, animatedStyle]}
			onTouchStart={handlePressIn} // Déclencher l'animation au touché
		>
			<Text style={styles.text}>🔉</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 2,
	},
	text: {
		fontSize: 23,
	},
});
