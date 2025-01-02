import React, { useState } from "react";
import {
	KeyboardAvoidingView,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Modal,
	Image,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../reducers/users";
import { useNavigation } from "@react-navigation/native";
const uri = BackendAdress.uri;

// authentification
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { customStyles } from "../utils/CustomStyle";
import { BackendAdress } from "../utils/BackendAdress";

export default function SignUp() {
	const dispatch = useDispatch();

	const EMAIL_REGEX =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const navigation = useNavigation();
	const [signInEmail, setSignInEmail] = useState("");
	const [signInPassword, setSignInPassword] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [formError, setFormError] = useState(false);
	const [isValid, setIsValid] = useState(true);
	const [signInModalVisible, setSignInModalVisible] = useState(false);
	const [words, setWords] = useState([]);
	const [isShuffled, setIsShuffled] = useState(false);

	const checkForm = () => {
		console.log("step 1:checkform");

		if (!signInEmail || !EMAIL_REGEX.test(signInEmail)) {
			setEmailError(true);
			console.log(emailError, "step 2:ERROR");
		} else {
			fetch(`http://${uri}:3000/users/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: signInEmail,
					password: signInPassword,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("step 3:fetch done");

					if (data.result === false) {
						console.log("step 4:check result account");

						setIsValid(false);
						console.log("wrong password");
					} else {
						dispatch(login({ username: data.username, token: data.token }));
						console.log(data.username);
						setSignInEmail("");
						setSignInPassword("");
						setSignInModalVisible(false);
						navigation.replace("TabNavigator", { screen: "Dashboard" });
					}
				});
		}
	};

	// authentification modale

	const [fontsLoaded] = useFonts({
		Satoshi: require("../assets/fonts/Satoshi-BlackKotf.otf"),
		NotoSansJP: require("../assets/fonts/NotoSansJP-Thin.ttf"),
	});

	if (!fontsLoaded) {
		return null;
	}

	const showSignInModal = () => {
		setSignInModalVisible(!signInModalVisible);
	};

	return (
		<View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={signInModalVisible}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContentSignin}>
						<View style={styles.deleteIcon}>
							<FontAwesome
								name="close"
								size={20}
								color="#000000"
								onPress={() => setSignInModalVisible(false)}
							/>
						</View>

						<KeyboardAvoidingView style={styles.container}>
							<Text style={styles.headerText}>Access your account</Text>
							{formError && <Text style={styles.error}>Invalid Form</Text>}
							<TextInput
								style={styles.inputStyles}
								onChangeText={(value) => {
									setSignInEmail(value);
									if (EMAIL_REGEX.test(value)) {
										setEmailError(false);
									}
								}}
								value={signInEmail}
								placeholder="email"
								placeholderTextColor="grey"
								autoCapitalize="none"
								keyboardType="email-address"
								autoCorrect={false}
							/>
							{emailError && (
								<Text style={styles.error}>Invalid email address</Text>
							)}
							<TextInput
								style={[styles.inputStyles, !isValid && { borderColor: "red" }]}
								onChangeText={(value) => setSignInPassword(value)}
								value={signInPassword}
								placeholder="password"
								placeholderTextColor="grey"
								secureTextEntry={true}
								keyboardType="default"
								autoCapitalize="none"
							/>
							{!isValid && <Text style={{ color: "red" }}>Wrong password</Text>}
							<TouchableOpacity style={styles.button} onPress={checkForm}>
								<Text>Sign in</Text>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					</View>
				</View>
			</Modal>

			<TouchableOpacity
				onPress={() => showSignInModal(true)}
				style={styles.login}
			>
				<Text style={styles.buttonTitle}>Already have an account ?</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		height: "100%",
	},
	inputStyles: {
		height: 40,
		width: customStyles.buttonWidth,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
	inputTitle: {
		fontFamily: "noto sans jp",
		fontSize: 15,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		fontFamily: customStyles.defaultFontFamily,
	},
	text: {
		fontFamily: customStyles.defaultFontFamily,
	},
	button: {
		backgroundColor: customStyles.buttonBackgroundColor,
		borderRadius: customStyles.buttonRadius,
		width: customStyles.buttonWidth,
		height: customStyles.buttonHeight,
		display: customStyles.buttonDisplay,
		flexDirection: customStyles.buttonFlexDirection,
		alignItems: customStyles.buttonAlignItems,
		justifyContent: customStyles.buttonJustifyContent,
		bottom: -20,
	},
	error: {
		color: "red",
	},
	//authentification modale
	login: {
		backgroundColor: "#ee2537",
		borderRadius: customStyles.buttonRadius,
		width: 250,
		height: customStyles.buttonHeight,
		display: customStyles.buttonDisplay,
		flexDirection: customStyles.buttonFlexDirection,
		alignItems: customStyles.buttonAlignItems,
		justifyContent: customStyles.buttonJustifyContent,
		margin: 10,
		top: 120,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		justifyContent: "center",
		alignItems: "center",
		height: "80",
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
	closeButton: {
		marginTop: 20,
		backgroundColor: "#2196F3",
		padding: 10,
		borderRadius: 5,
	},
	closeButtonText: {
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center",
	},
	deleteIcon: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
		width: "100%",
	},
	modalContentSignin: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
		width: "80%",
		height: "35%",
	},
	modalContentSignup: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
		width: "80%",
		height: "55%",
	},
	buttonTitle: {
		fontWeight: "bold",
		color: "white",
	},
	headerText: {
		top: -20,
		fontSize: 20,
		fontFamily: "noto sans jp",
	},
});
