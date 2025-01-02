import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableHighlight,
	Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { BackendAdress } from "../utils/BackendAdress";
import { getContinue } from "../reducers/continues";

//--------------------------------------------------------debut de la page---------------------------------------------------
const ExerciseComponent = (props) => {
	const [lessons, setLessons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isGood, setIsGood] = useState(false);
	const [isBad, setIsBad] = useState(false);

	const dispatch = useDispatch();
	const uri = BackendAdress.uri;
	const user = useSelector((state) => state.user.value);
	const navigation = useNavigation();

	const speak = (text) => {
		Speech.speak(text, {
			language: "ja",
			pitch: 1.2,
			rate: 0.8,
		});
	};

	const handleOptionSelect = (exerciseIndex, isCorrect) => {
		if (selectedAnswers[exerciseIndex] === undefined) {
			setSelectedAnswers((prevAnswers) => ({
				...prevAnswers,
				[exerciseIndex]: isCorrect,
			}));
			setAnsweredCount((prevCount) => prevCount + 1);
		}
	};

	const Validate = () => {
		dispatch(getContinue({ lesson_id: props.id }));
		navigation.navigate("dashboard");
	};

	useEffect(() => {
		fetch(`http://${uri}:3000/lessons/showAllLessons/${user.token}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.result) {
					setLessons(data.data);
				} else {
					console.error("No data found.");
				}
			})
			.catch((error) => console.error("Erreur with lessons :", error))
			.finally(() => setLoading(false));
	}, [uri]);

	const exerciseToDisplay = lessons.find((lesson) => lesson._id === props.id);

	console.log(props.id, "id a verifier");

	if (loading) {
		return <Text>Loading...</Text>;
	}

	if (!exerciseToDisplay) {
		return <Text>No exercise found</Text>;
	}

	const exercises = exerciseToDisplay.themes
		.map((theme) => theme.exo[props.index])
		.filter((exercise) => exercise !== undefined);

	const singleExercise = exercises[0];
	if (!singleExercise) {
		return <Text>No exercise found</Text>;
	}

	const words = [
		singleExercise.good_answer,
		singleExercise.wrong_answer_a,
		singleExercise.wrong_answer_b,
		singleExercise.wrong_answer_c,
	];

	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1)); // Génère un index aléatoire
			[array[i], array[j]] = [array[j], array[i]]; // Échange les éléments
		}
	};

	shuffleArray(words);

	return (
		<View style={styles.container}>
			<View style={styles.wordCard}>
				<Text style={styles.word}>{singleExercise.word_jp}</Text>
				<TouchableOpacity
					style={styles.icon}
					onPress={() => speak(singleExercise.word_jp)}
				>
					<Text style={styles.speakerText}>🔉</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.gridContainer}>
				{/* Utilisation de `words` pour rendre les réponses mélangées */}
				{words.map((word, index) => (
					<TouchableOpacity
						key={index}
						style={[
							styles.button,
							isGood &&
								word === singleExercise.good_answer &&
								styles.goodAnswerButton,
							isBad &&
								word !== singleExercise.good_answer &&
								styles.badAnswerButton,
						]}
						onPress={() => {
							if (word === singleExercise.good_answer) {
								setIsGood(true);
							} else {
								setIsBad(true);
							}
						}}
					>
						<Text style={styles.answerText}>{word}</Text>
					</TouchableOpacity>
				))}
			</View>

			{isGood && (
				<TouchableHighlight
					onPress={() => Validate()}
					style={styles.answer}
					key1={singleExercise.good_answer}
				>
					<Text style={styles.answerText}>Next</Text>
				</TouchableHighlight>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		color: "black",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 50,
		top: 240,
	},
	wordCard: {
		backgroundColor: "#D56565",
		paddingVertical: 40,
		paddingHorizontal: 50,
		borderRadius: 15,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 5 },
		shadowRadius: 10,
		elevation: 8,
		marginBottom: 30,
		width: "90%",
	},
	word: {
		fontSize: 48,
		fontWeight: "bold",
		color: "black",
		textAlign: "center",
		letterSpacing: 1,
	},

	speakerText: {
		fontSize: 40,
		textAlign: "center",
	},
	gridContainer: {
		marginTop: 20,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-evenly",
		width: "100%",
	},
	button: {
		backgroundColor: "#EEC1C0",
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderRadius: 10,
		width: "45%",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 5,
		elevation: 5,
	},
	goodAnswerButton: {
		backgroundColor: "green",
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderRadius: 10,
		width: "45%",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 5,
		elevation: 5,
	},
	badAnswerButton: {
		backgroundColor: "red",
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderRadius: 10,
		width: "45%",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 5,
		elevation: 5,
	},
	answer: {
		backgroundColor: "#EEC1C0",
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderRadius: 10,
		width: "45%",
		marginBottom: 20,
		shadowColor: "#000",
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 5,
		elevation: 5,
		justifyContent: "center",
		alignItems: "center",
	},

	answerText: {
		fontSize: 28,
		color: "Black",
		textAlign: "center",
		fontWeight: "600",
	},
});

export default ExerciseComponent;
