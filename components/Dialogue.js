import React, { useState, useEffect } from "react";
import {
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Modal,
	Button,
	TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { BackendAdress } from "../utils/BackendAdress";
import { customStyles } from "../utils/CustomStyle";
import * as Speech from "expo-speech";
import Icon from "react-native-vector-icons/FontAwesome";
import { addFavorite } from "../reducers/favoritesreducer";

export default function Dialogue(props) {
	const [favorites, setFavorites] = useState([]);
	const [isFavorite, setIsFavorite] = useState(false);
	const [modalVisible, setModalVisible] = useState(true);
	const [lessons, setLessons] = useState([]);
	const [currentLessonId, setCurrentLessonId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [words, setWords] = useState();

	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
	const uri = BackendAdress.uri;
	let token = user.token;

	//BOUTON POUR AFFICHER LA MODALE POUR FAVORIS
	const handleLongPressWord = (word) => {
		fetch(`http://${uri}:3000/word/getWord/${word}`)
			.then((response) => response.json())
			.then((data) => {
				setFavorites([data]);
				setModalVisible(true);
			});
	};

	//MECHANISME POUR LE VOCAL DU MOT
	const speak = (text) => {
		Speech.speak(text, {
			language: "ja",
			pitch: 1.2,
			rate: 0.8,
		});
	};
	//BOUTON POUR AJOUTER EN BASE DE DONNÉES
	const handleFavoriteButton = (data) => {
		fetch(`http://${uri}:3000/favorites/createFavorite/${token}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				wordjp: data?.wanikaniLow.Kanji,
				worden: data?.wanikaniLow?.English[0],
				romanji: data?.romaji,
				grammar: data?.wanikaniLow.Grammar[0],
				isbook: true,
			}),
		})
			.then((response) => response.json())
			.then((data) => console.log(data, "vers Favoris"));
		setIsFavorite(!isFavorite);
	};

	const deleteFavoriteButton = (wordId) => {
		console.log(wordId);

		fetch(`http://${uri}:3000/favorites/deleteFavorite/${user.token}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: wordId,
			}),
		})
			.then((response) => response.json())
			.then((data) => console.log(data.result));
	};

	// const handleGoLesson = (id) => {};

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
	}, [uri, user.token]);
	const lessonToDisplay = lessons.find((lesson) => lesson._id === props.id);

	if (loading) {
		return <Text>Loading...</Text>;
	}
	if (!lessonToDisplay) {
		return <Text>No lesson found</Text>;
	}

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				{/* Affichage du thème et des dialogues associés à cette leçon */}
				{lessonToDisplay.themes.map((theme, themeIndex) => {
					// Afficher seulement le thème correspondant à props.index
					if (themeIndex === props.index) {
						return (
							<View key={themeIndex}>
								{/* Affiche le titre du thème */}
								<Text style={styles.themeTitle}>
									{theme.theme.replace(/\d$/, "").toUpperCase()}
								</Text>

								{/* Affiche les lignes de dialogues pour ce thème */}
								{theme.lines.map((line, lineIndex) => (
									<View
										key={lineIndex}
										style={[
											styles.dialogue,
											{
												alignSelf:
													line.speaker === "Person A"
														? "flex-end"
														: "flex-start", // Alignement
												backgroundColor:
													line.speaker === "Person A" ? "#FFE4E1" : "#FDEDED", // Couleur personnalisée
											},
										]}
									>
										<Text style={styles.speakerText}>{line.speaker}</Text>
										<View style={styles.separator} />

										<Text style={styles.japaneseText}>
											{line.japanese
												.match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu)
												?.map((segment, idx) => (
													<TouchableOpacity
														key={`${segment}-${idx}`}
														onPress={() => handleLongPressWord(segment)}
													>
														<Text style={styles.japaneseText}>{segment}</Text>
													</TouchableOpacity>
												))}
										</Text>

										<Text style={styles.romanjiText}>{line.romanji}</Text>
										<Text style={styles.englishText}>{line.english}</Text>
										<TouchableOpacity
											style={styles.icon}
											onPress={() => speak(line.japanese)}
										>
											<Text style={styles.speakerText}>🔉</Text>
										</TouchableOpacity>
									</View>
								))}
							</View>
						);
					}
					return;
				})}
			</View>

			{favorites.map((favorite, index) => {
				return (
					<Modal
						key={index}
						visible={modalVisible}
						transparent={true}
						animationType="slide"
						onRequestClose={() => setModalVisible(false)}
					>
						<View style={styles.modalContainer}>
							<View style={styles.modalContent}>
								<Text style={styles.modalText}>
									Selected word: {favorite.wanikaniLow.Kanji}
								</Text>
								<Text>Meaning: {favorite.wanikaniLow.English[0]}</Text>
								<Text>Romanji: {favorite.romaji}</Text>
								<Text>Grammar: {favorite.wanikaniLow.Grammar[0]}</Text>
								<TouchableOpacity onPress={() => speak(favorite.romaji)}>
									<Text style={styles.speakerButton}>🔊</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.favoriteButtonStyle}
									onPress={() => handleFavoriteButton(favorite)}
								>
									<Text>{!isFavorite ? "❤️" : "❌"}</Text>
								</TouchableOpacity>
								<Button
									style={styles.closeButton}
									title="Close"
									onPress={() => setModalVisible(false)}
								/>
							</View>
						</View>
					</Modal>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	content: {
		flex: 1,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		textAlign: "center",
	},
	lessonHeader: {
		marginTop: 20,
		paddingLeft: 20,
	},
	dialogueHeader: {
		marginTop: 20,
		paddingLeft: 20,
	},
	lessonContainer: {
		borderWidth: 2,
		borderColor: "black",
		padding: 15,
		marginVertical: 10,
		borderRadius: 5,
	},
	lessonTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 5,
	},
	themeTitle: {
		fontSize: 24,
		fontStyle: "italic",
		color: "#666",
		alignSelf: "center",
		marginBottom: 30,
	},
	button: {
		backgroundColor: customStyles.buttonBackgroundColor,
		borderRadius: customStyles.buttonRadius,
		width: customStyles.buttonWidth,
		height: customStyles.buttonHeight,
		display: customStyles.buttonDisplay,
		flexDirection: customStyles.buttonFlexDirection,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
	},
	buttonText: {
		color: customStyles.buttonTextColor,
		fontSize: customStyles.buttonTextFontSize,
		fontWeight: customStyles.buttonTextFontWeight,
	},
	dialogue: {
		marginBottom: 10,
		paddingHorizontal: 10,
	},
	dialogueChild: {
		borderWidth: 1,
		padding: 10,
		marginVertical: 5,
		borderRadius: 5,
		width: "80%",
	},
	dialogue1: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	icon: {
		marginHorizontal: 10,
		padding: 10,
		backgroundColor: "#EEC1C0",
		borderRadius: 25,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
		justifyContent: "center",
		alignItems: "center",
		width: 50,
		height: 50,
		textAlign: "center",
	},
	wordsContainer: {
		flexWrap: "wrap",
	},
	word: {
		fontSize: 16,
		marginHorizontal: 5,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
		alignItems: "center",
	},
	modalText: {
		fontSize: 18,
		marginBottom: 10,
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#EEC1C0",
	},
	dialogue: {
		borderWidth: 0,
		borderRadius: 20,
		padding: 20,
		marginBottom: 15,
		width: "auto",
		maxWidth: "75%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	speakerText: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#555",
		marginBottom: 5,
	},
	japaneseText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 5,
	},
	romanjiText: {
		fontSize: 14,
		fontStyle: "italic",
		color: "#666",
		marginBottom: 5,
	},
	englishText: {
		fontSize: 14,
		color: "#444",
	},
	separator: {
		height: 10,
	},
	favoriteButtonStyle: {
		width: 30,
		height: 30,
		borderRadius: 30,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
	},
});
