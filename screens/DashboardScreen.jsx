import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { loadContinue } from "../reducers/continues";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native"; // Assure-toi d'importer useFocusEffect

import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	TouchableHighlight,
} from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { BackendAdress } from "../utils/BackendAdress";
import Dialogue from "./DialogueScreen";
const uri = BackendAdress.uri;

export default function DashboardScreen() {
	const data = [
		{
			value: 25,
			frontColor: "red",
			gradientColor: "red",
			spacing: 6,
			label: "Mon",
		},
		{ value: 24, frontColor: "black", gradientColor: "white" },

		{
			value: 35,
			frontColor: "red",
			gradientColor: "#009FFF",
			spacing: 6,
			label: "Tue",
		},
		{ value: 30, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

		{
			value: 45,
			frontColor: "red",
			gradientColor: "#009FFF",
			spacing: 6,
			label: "Wed",
		},
		{ value: 40, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

		{
			value: 52,
			frontColor: "red",
			gradientColor: "#009FFF",
			spacing: 6,
			label: "Thur",
		},
		{ value: 49, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

		{
			value: 70,
			frontColor: "red",
			gradientColor: "#009FFF",
			spacing: 6,
			label: "Fri",
		},
		{ value: 80, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },
		{
			value: 52,
			frontColor: "red",
			gradientColor: "#009FFF",
			spacing: 6,
			label: "Sat",
		},
		{ value: 49, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },
		{
			value: 52,
			frontColor: "red",
			gradientColor: "#009FFF",
			spacing: 6,
			label: "Sun",
		},
		{ value: 49, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },
	];

	const pieData = [
		{
			value: 47,
			color: "#009FFF",
			gradientCenterColor: "#006DFF",
			focused: true,
		},
		{ value: 40, color: "#93FCF8", gradientCenterColor: "#3BE9DE" },
		{ value: 16, color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
		{ value: 3, color: "#FFA5BA", gradientCenterColor: "#FF7F97" },
	];

	const renderDot = (color) => {
		return (
			<View
				style={{
					height: 10,
					width: 10,
					borderRadius: 5,
					backgroundColor: color,
					marginRight: 10,
				}}
			/>
		);
	};

	const renderLegendComponent = () => {
		return (
			<>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						marginBottom: 10,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							width: 120,
							marginRight: 20,
						}}
					>
						{renderDot("#006DFF")}
						<Text style={{ color: "white" }}>Excellent: 47%</Text>
					</View>
					<View
						style={{ flexDirection: "row", alignItems: "center", width: 120 }}
					>
						{renderDot("#8F80F3")}
						<Text style={{ color: "white" }}>Okay: 16%</Text>
					</View>
				</View>
				<View style={{ flexDirection: "row", justifyContent: "center" }}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							width: 120,
							marginRight: 20,
						}}
					>
						{renderDot("#3BE9DE")}
						<Text style={{ color: "white" }}>Good: 40%</Text>
					</View>
					<View
						style={{ flexDirection: "row", alignItems: "center", width: 120 }}
					>
						{renderDot("#FF7F97")}
						<Text style={{ color: "white" }}>Poor: 3%</Text>
					</View>
				</View>
			</>
		);
	};
	const centerLabelComponent = () => {
		return (
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 22, color: "white", fontWeight: "bold" }}>
					47%
				</Text>
				<Text style={{ fontSize: 14, color: "white" }}>Excellent</Text>
			</View>
		);
	};
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
	const [lessons, setLessons] = useState([]);
	const [word, setWord] = useState([]);
	const [meaning, setMeaning] = useState([]);
	const [loading, setLoading] = useState(false);
	const progress = useSelector((state) => state.continues.value);
	const lessonId = useSelector((state) => state.continues.value.lesson_id);
	console.log(lessonId, 'IIIIIIDDDDD')
	const [done, setDone] = useState([]);

	const navigation = useNavigation();

	const goDialogue = (lessonId, themeIndex) => {
		navigation.navigate("Dialogue", {
			lessonId: lessonId,
			themeIndex: themeIndex,
		});
	};
	const goExercise = (lessonId, themeIndex) => {
		navigation.navigate("Exercise", {
			lessonId: lessonId,
			themeIndex: themeIndex,
		});
	};

	useEffect(() => {
		// Récupère lesson_id depuis AsyncStorage
		AsyncStorage.getItem("lesson_id")
			.then((storedLessonId) => {
				if (storedLessonId) {
					// Si la valeur est trouvée, on la charge dans le store Redux
					dispatch(loadContinue({ lesson_id: storedLessonId }));
				}
			})

			.catch((err) =>
				console.error("Error loading lesson_id from AsyncStorage:", err)
			);
	}, [dispatch]); // Le tableau de dépendances s'assure que ça se fait seulement une fois au montage du composant

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

	useFocusEffect(
		React.useCallback(() => {
			setLoading(true);
			fetch(`http://${uri}:3000/lessons/showOne/${lessonId}/${user.token}/`)
				.then((res) => res.json())
				.then((data) => {
					if (data) {
						console.warn(data, "holaaaaaaaaa");
						setDone([data]);
					} else {
						console.error("No new word found.");
					}
				})
				.catch((error) => console.error("Erreur with lessons :", error))
				.finally(() => setLoading(false));
		}, [uri, lessonId,  user.token]) // Ajoute ici les dépendances
	);

	useEffect(() => {
		fetch(`http://${uri}:3000/word/random/`)
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					setWord(data.word);
					setMeaning(data.word.meaning.slice(0, 10));
				} else {
					console.error("No new word found.");
				}
			})
			.catch((error) => console.error("Erreur with lessons :", error))
			.finally(() => setLoading(false));
	}, [uri, user.token]);

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

	console.log(user.token, "okokokokokokokok");

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Image
					source={{
						uri: "https://media.istockphoto.com/id/1492364557/fr/vectoriel/samoura%C3%AF-japonais-%C3%A0-l%C3%A9p%C3%A9e.jpg?s=612x612&w=0&k=20&c=qLHUBNq9hS2AZLQQjkg-d-rerGUzlDRSYTMsqnpd3kg=",
					}}
					style={styles.avatar}
				/>
				<Text style={styles.headerText}>
					おはようございます{"\n"}
					{user.username}!
				</Text>
				<TouchableOpacity style={styles.settings}>
					<FontAwesome6 name="gear" size={24} color="#000" />
				</TouchableOpacity>
			</View>
			<View style={styles.BubbleContainer}>
				<View style={styles.BubbleTopContainer}>
					<View
						style={[styles.ThemeBubbleTop, { minHeight: 149, maxHeight: 150 }]}
					>
						<Text style={styles.BubbleHeaderOne}>Today Word </Text>
						<Text style={styles.text}>{word.word}</Text>
						<Text style={styles.text}>{word.furigana}</Text>
						<Text style={styles.text}>{word.romaji}</Text>
						<Text style={styles.text}>{meaning}</Text>
					</View>

					<View
						style={[styles.ThemeBubbleTop, { minHeight: 149, maxHeight: 150 }]}
					>
						<Text style={styles.BubbleHeaderTwo}>Continue ?</Text>

						{done &&
							Array.isArray(done) &&
							done.length > 0 &&
							done[0].data &&
							Array.isArray(done[0].data.themes) &&
							done[0].data.themes.length > 0 && (
								<View key={0}>
									<View>
										<Text style={styles.text}>
											Theme : {done[0].data.themes[0].theme} is done
										</Text>

										<SimpleLineIcons
											style={styles.Arrow}
											name="check"
											size={24}
											color="black"
										/>
									</View>
								</View>
							)}
					</View>
				</View>
				<View style={styles.BubbleBottomContainer}>
					<Text style={styles.title}>Dialogues</Text>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						style={styles.scrollView}
					>
						{lessons.map((lesson, lessonIndex) => (
							<View key={lessonIndex} style={styles.lessonContainer}>
								{lesson.themes.map((theme, themeIndex) => (
									<TouchableHighlight
										onPress={() => goDialogue(lesson._id, themeIndex)} //envoi du props dans la fonction pour l'enfant
										key={themeIndex}
										style={styles.ThemeBubbleUp}
										underlayColor="#CC4646"
									>
										<View>
											<Text style={styles.text}>Touch to start</Text>
											<Text style={styles.text}>
												your {theme.speaker_number}-person dialogue
											</Text>
											<Text style={styles.text}>at the {theme.theme}</Text>
											<SimpleLineIcons
												style={styles.Arrow}
												name="bubbles"
												size={24}
												color="black"
											/>
										</View>
									</TouchableHighlight>
								))}
							</View>
						))}
					</ScrollView>
					<Text style={styles.title}>Practice</Text>
					<ScrollView
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						style={styles.scrollView}
					>
						{lessons.map((lesson, lessonIndex) => (
							<View key={lessonIndex} style={styles.lessonContainer}>
								{lesson.themes.map((theme, themeIndex) => (
									<View key={themeIndex} style={styles.themeBubbleDown}>
										<TouchableHighlight
											onPress={() => goExercise(lesson._id, themeIndex)}
											key={themeIndex}
											style={styles.ThemeBubbleUp}
											underlayColor="#CC4646"
										>
											<View>
												<Text style={styles.text}>Start the Word </Text>
												<Text style={styles.text}>Flash Card - </Text>
												<Text style={styles.text}>
													Theme:
													{theme.theme.replace(/\d$/, "")}
												</Text>

												<Text></Text>
												<SimpleLineIcons
													style={styles.Arrow2}
													name="note"
													size={24}
													color="black"
												/>
											</View>
										</TouchableHighlight>
									</View>
								))}
							</View>
						))}
					</ScrollView>
				</View>
			</View>
			<View
				style={{
					margin: 10,
					padding: 16,
					borderRadius: 20,
					backgroundColor: "#D15C5C",
				}}
			>
				<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
					Overview
				</Text>
				<View style={{ padding: 20, alignItems: "center" }}>
					<BarChart
						data={data}
						width={250}
						barWidth={16}
						initialSpacing={10}
						spacing={14}
						barBorderRadius={4}
						showGradient
						yAxisThickness={0}
						xAxisType={"dashed"}
						xAxisLength={200}
						xAxisColor={"lightgray"}
						yAxisTextStyle={{ color: "lightgray" }}
						stepValue={20}
						maxValue={100}
						noOfSections={6}
						yAxisLabelTexts={["0"]}
						labelWidth={40}
						xAxisLabelTextStyle={{ color: "lightgray", textAlign: "center" }}
						showLine
						lineConfig={{
							color: "#F29C6E",
							thickness: 3,
							curved: true,
							hideDataPoints: true,
							shiftY: 20,
							initialSpacing: -30,
						}}
					/>
				</View>

				<View
					style={{
						paddingBottom: 100,
						flex: 1,
					}}
				>
					<View
						style={{
							margin: 20,
							padding: 16,
							borderRadius: 20,
							backgroundColor: "#D15C5C",
						}}
					>
						<Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
							Performance
						</Text>
						<View style={{ padding: 20, alignItems: "center" }}>
							<PieChart
								data={pieData}
								donut
								showGradient
								sectionAutoFocus
								radius={90}
								innerRadius={60}
								innerCircleColor={"#D15C5C"}
								centerLabelComponent={() => {
									return (
										<View
											style={{ justifyContent: "center", alignItems: "center" }}
										>
											<Text
												style={{
													fontSize: 22,
													color: "white",
													fontWeight: "bold",
												}}
											>
												47%
											</Text>
											<Text style={{ fontSize: 14, color: "white" }}>
												Excellent
											</Text>
										</View>
									);
								}}
							/>
						</View>
						{renderLegendComponent()}
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		padding: 20,
		backgroundColor: "#EEC1C0",
	},
	diagonalLine: {
		position: "absolute",
		width: "118%",
		top: 82,
		right: 0,
		left: 4,
		bottom: 1,
		borderBottomWidth: 2,
		borderColor: "#090909",
		transform: [{ rotate: "146deg" }],
		zIndex: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 30,
	},
	headerText: {
		fontSize: 20,
		fontWeight: 400,
		textAlign: "center",
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: "rgba(193, 46, 46, 1)",
	},
	scrollView: {
		flex: 1,
		right: 13,
	},
	lessonContainer: {
		flexDirection: "row",
		marginHorizontal: 10,
	},
	BubbleContainer: {
		marginTop: 30,
	},
	BubbleBottomContainer: {
		marginRight: -25,
	},
	ThemeBubbleTop: {
		width: 172,
		height: 150,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		marginTop: 30,
		backgroundColor: "#CC4646",
		borderRadius: 15,
		elevation: 10,
		borderWidth: 0.5,
		borderColor: "#090909",
		right: 4,
	},
	BubbleHeaderOne: {
		position: "relative",
		padding: 4,
		backgroundColor: "#EEC1C0",
		textAlign: "center",
		justifyContent: "center",
		fontSize: 20,
		color: "black",
		fontWeight: "bold",
		top: -14,
		width: "172",
		borderColor: "#090909",
		borderWidth: 1,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	BubbleHeaderTwo: {
		position: "relative",
		padding: 4,
		backgroundColor: "#EEC1C0",
		textAlign: "center",
		justifyContent: "center",
		fontSize: 20,
		color: "black",
		fontWeight: "bold",
		top: -35,
		width: "172",
		borderColor: "#090909",
		borderWidth: 1,
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	Arrow: {
		position: "relative",
		bottom: -5,

		left: 65,
	},
	Arrow2: {
		position: "relative",
		bottom: 5,
		right: -60,
	},
	ThemeBubbleUp: {
		width: 180,
		height: 120,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		marginVertical: 30,
		backgroundColor: "#D56565",
		borderRadius: 15,
		elevation: 10,
		borderWidth: 0.5,
		borderColor: "#090909",
	},
	themeBubbleDown: {
		width: 180,
		height: 120,
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		marginVertical: 30,
		backgroundColor: "#D56565",
		borderRadius: 20,
		elevation: 10,
		borderWidth: 0.5,
		borderColor: "#090909",
	},
	BubbleTopContainer: {
		flexDirection: "row",
		alignSelf: "center",
	},
	text: {
		fontSize: 15,
		fontFamily: "noto sans jp",
		fontWeight: 400,
		color: "#090909",
		textAlign: "center",
		textShadowColor: "#CC4646",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	title: {
		fontSize: 15,
		fontFamily: "noto sans jp",
		color: "#090909",
		textAlign: "center",
		textShadowColor: "#CC4646",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
		right: 8,
	},
	italicText: {
		fontStyle: "italic",
		color: "blue",
	},
	button: {
		backgroundColor: "#EEC1C0",
		width: "90%",
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		marginBlock: 10,
	},
	buttonText: {
		fontSize: 20,
		color: "#070000",
		textAlign: "center",
		fontFamily: "Noto Sans JP",
	},
	horizontalSeparator: {
		height: 1,
		width: "100%",
		backgroundColor: "#070000",
		marginVertical: 10,
	},
});
