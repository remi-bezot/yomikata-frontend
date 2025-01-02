import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { BackendAdress } from "../utils/BackendAdress";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const uri = BackendAdress.uri;

export default function FavoriteScreen() {
	const user = useSelector((state) => state.user.value);
	const token = user.token;
	const [selectedCardId, setSelectedCardId] = useState(null);
	const [words, setWords] = useState([]);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(true);

	const [fontsLoaded] = useFonts({
		Satoshi: require("../assets/fonts/Satoshi-BlackKotf.otf"),
		NotoSansJP: require("../assets/fonts/NotoSansJP-Thin.ttf"),
	});

	// Récupération des favoris lors du chargement de la page

	useFocusEffect(
		React.useCallback(() => {
			setLoading(true);
			fetch(`http://${uri}:3000/favorites/showFavorites/${token}`)
				.then((response) => response.json())
				.then((data) => {
					if (data.result) {
						setWords(data.result); // Met à jour les données
					} else {
						console.error("No favorites found.");
					}
				})
				.catch((error) =>
					console.error("Erreur lors de la récupération des favoris :", error)
				)
				.finally(() => setLoading(false), setRefresh(!refresh)); // Fin du chargement
		}, [handleClick, token])
	);

	if (loading) {
		return <Text>Loading favorites...</Text>;
	}

	if (words.length === 0) {
		return <Text>No favorites found.</Text>;
	}

	const handleClick = (wordId) => {
		fetch(`http://${uri}:3000/favorites/deleteFavorite/${user.token}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: wordId,
			}),
		});
	};

	const handleCard = (wordId) => {
		setSelectedCardId((e) => (e === wordId ? null : wordId));
	};

	const speak = (text) => {
		Speech.speak(text, {
			language: "ja",
			pitch: 1,
			rate: 0.5,
		});
	};
	console.log(words.length);

	const favoriteswords =
		words.length > 0 &&
		words.map((data, i) => {
			if (selectedCardId === data._id) {
				return (
					<View style={styles.card} key={i}>
						<View>
							<View style={styles.deleteIcon}>
								<FontAwesome
									name="close"
									size={15}
									color="#000000"
									onPress={() => handleClick(data._id)}
								/>
							</View>
						</View>
						<Text style={styles.wordjp} onPress={() => handleCard(data._id)}>
							{data.Word_JP}
						</Text>
						<View style={styles.traduction}>
							<Text style={styles.word}>{data.Word_EN}</Text>
							<Text style={styles.word}>{data.Romanji}</Text>
							<Text style={styles.word}>{data.Grammar}</Text>
						</View>
						<TouchableOpacity
							style={styles.speakerbutton}
							onPress={() => speak(data.Word_JP)}
						>
							<Text style={styles.speaker}>🔉</Text>
						</TouchableOpacity>
					</View>
				);
			} else {
				return (
					<View style={styles.cardOpen} key={i}>
						<View>
							<View style={styles.deleteIcon}>
								<FontAwesome
									name="close"
									size={15}
									color="#000000"
									onPress={() => handleClick(data._id)}
								/>
							</View>
						</View>
						<Text style={styles.wordjp} onPress={() => handleCard(data._id)}>
							{data.Word_JP}
						</Text>
					</View>
				);
			}
		});

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.titlecontainer}>
				<Text style={styles.title}> Favorites ({words.length})</Text>
			</View>
			<ScrollView>
				<View style={styles.cardsList}>{favoriteswords}</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: "100%",
	},
	title: {
		fontSize: 25,
		fontFamily: "Satoshi-Black",
		color: "#CC4646",
	},
	titlecontainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: 100,
	},
	card: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		width: 200,
		height: 200,
		margin: 10,
		borderRadius: 25,
		backgroundColor: "#EEC1C0",
	},
	cardOpen: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		width: 100,
		height: 100,
		margin: 10,
		borderRadius: 25,
		backgroundColor: "#EEC1C0",
	},
	cardsList: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		flexWrap: "wrap",
	},
	word: {
		margin: 5,
		fontSize: 15,
	},
	wordjp: {
		fontSize: 20,
		fontWeight: "bold",
		margin: 10,
		backgroundColor: "EEC1C0",
	},
	deleteIcon: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		width: "80%",
	},
	speakerbutton: {
		width: 30,
		height: 30,
		borderRadius: 30,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		margin: 5,
	},
	traduction: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	speaker: {
		fontSize: 23,
	},
});
