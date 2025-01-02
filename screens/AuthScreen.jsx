import { StatusBar } from "expo-status-bar";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { useFonts } from "expo-font";

import { StyleSheet, Text, View, Image } from "react-native";

export default function Authentification() {
	const [fontsLoaded] = useFonts({
		Satoshi: require("../assets/fonts/Satoshi-BlackKotf.otf"),
		NotoSansJP: require("../assets/fonts/NotoSansJP-Thin.ttf"),
	});

	if (!fontsLoaded) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.title}>
				<Text style={styles.title_text}>YO</Text>
				<FontAwesome5 name="torii-gate" size={60} color="black" />
				<Text style={styles.title_text}>IKATA</Text>
			</View>
			<Image
				source={require("../assets/FondJap.jpg")}
				style={styles.photoItem}
			/>
			<SignIn />
			<SignUp />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "rgba(228,224,207,1)",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: "100%",
	},
	title: {
		justifyContent: "center",
		alignItems: "center",
		height: 80,
		flexDirection: "row",
		bottom: 80,
	},
	title_text: {
		fontSize: 70,
		fontFamily: "Satoshi-Black",
		color: "black",
	},
	photoItem: {
		width: "90%",
		height: "30%",
	},
	buttonTitle: {
		fontWeight: "bold",
		color: "white",
	},
});
