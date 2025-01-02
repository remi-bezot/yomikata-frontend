import {
	KeyboardAvoidingView,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	View,
	Modal,
	Image,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, showModal } from "../reducers/users";
import { BackendAdress } from "../utils/BackendAdress";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { customStyles } from "../utils/CustomStyle";
import { useNavigation } from "@react-navigation/native";

const uri = BackendAdress.uri;

export default function SignUp() {
	const EMAIL_REGEX =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const navigation = useNavigation();

	const [signUpUsername, setSignUpUsername] = useState("");
	const [signUpPassword, setSignUpPassword] = useState("");
	const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
	const [signUpName, setsignUpName] = useState("");
	const [signUpEmail, setsignUpEmail] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [signUpModalVisible, setSignUpModalVisible] = useState(false);
	const [isSucceed, setIsSucceed] = useState(false);

	const [fontsLoaded] = useFonts({
		Satoshi: require("../assets/fonts/Satoshi-BlackKotf.otf"),
		NotoSansJP: require("../assets/fonts/NotoSansJP-Thin.ttf"),
	});
	if (!fontsLoaded) {
		return null;
	}
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);
	console.log(uri);

	const checkForm = () => {
		setErrorPassword(false);
		if (EMAIL_REGEX.test(signUpEmail)) {
			setEmailError(false);
			if (
				signUpPassword !== signUpConfirmPassword ||
				!signUpPassword ||
				!signUpConfirmPassword
			) {
				setErrorPassword(true);
			} else {
				setErrorPassword(false);
				fetch(`http://${uri}:3000/users/signup`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: signUpName,
						username: signUpUsername,
						email: signUpEmail,
						password: signUpPassword,
					}),
				})
					.then((response) => response.json())
					.then((data) => {

						console.log(data); 
						if (data.result === true) {
							dispatch(login({ username: signUpUsername, token: data.data.token }));
							setSignUpUsername("");
							setSignUpPassword("");
							setSignUpConfirmPassword("");
							setsignUpName("");
							setsignUpEmail("");
							setSignUpModalVisible(false);
							setIsSucceed(true);
							navigation.replace("TabNavigator", { screen: "Dashboard" });
						}
						if (data.error) {
							setEmailError(false);
							setErrorMessage(true);
						}
					});
			}
		} else {
			setEmailError(true); // Si l'email est invalide, mettre errorEmail à true
		}
	};

	
	

	const showSignUpModal = () => {
		setSignUpModalVisible(!signUpModalVisible);
		dispatch(showModal(!signUpModalVisible));
	};

	return (
		<View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={signUpModalVisible}
				onRequestClose={setSignUpModalVisible}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContentSignup}>
						<View style={styles.deleteIcon}>
							<FontAwesome
								name="close"
								size={20}
								color="#000000"
								onPress={() => {
									setSignUpModalVisible(false);
								}}
							/>
						</View>
						<KeyboardAvoidingView style={styles.container}>
							<Text style={styles.headerText}>Create your account</Text>

							<TextInput
								onChangeText={(value) => setsignUpName(value)}
								value={signUpName}
								style={styles.inputStyles}
								placeholderTextColor="grey"
								placeholder="name"
							></TextInput>

							<TextInput
								style={styles.inputStyles}
								onChangeText={(value) => setSignUpUsername(value)}
								value={signUpUsername}
								placeholderTextColor="grey"
								placeholder="username"
							></TextInput>

							<TextInput
								onChangeText={(value) => setsignUpEmail(value)}
								value={signUpEmail}
								style={styles.inputStyles}
								placeholder="email"
								autoCapitalize="none"
								keyboardType="email-address"
								placeholderTextColor="grey"
								autoCorrect={false}
							></TextInput>

							{emailError && (
								<Text style={styles.error}>Invalid email address</Text>
							)}
							{errorMessage && (
								<Text style={styles.error}>Email already exists</Text>
							)}

							<TextInput
								style={styles.inputStyles}
								onChangeText={(value) => setSignUpPassword(value)}
								value={signUpPassword}
								placeholder="password"
								placeholderTextColor="grey"
								secureTextEntry={true}
								keyboardType="default"
								autoCapitalize="none"
							></TextInput>

							<TextInput
								style={styles.inputStyles}
								onChangeText={(value) => setSignUpConfirmPassword(value)}
								value={signUpConfirmPassword}
								placeholder="confirm password"
								placeholderTextColor="grey"
								secureTextEntry={true}
								keyboardType="default"
								autoCapitalize="none"
							></TextInput>
							{errorPassword && (
								<Text style={styles.error}>confirm your password</Text>
							)}
							<TouchableOpacity style={styles.button} onPress={checkForm}>
								<Text>Sign up</Text>
							</TouchableOpacity>
						</KeyboardAvoidingView>
					</View>
				</View>
			</Modal>
			<TouchableOpacity
				onPress={() => showSignUpModal(true)}
				style={styles.login}
			>
				<Text style={styles.buttonTitle}>New here? Create an account!</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		flex: 1,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
	},
	inputStyles: {
		height: 40,
		margin: 12,
		borderWidth: 1,
		padding: 10,
		width: 200,
	},
	headerText: {
		top: -20,
		fontSize: 20,
		fontFamily: "noto sans jp",
	},
	inputTitle: {
		fontFamily: "noto sans jp",
		fontSize: 15,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		fontFamily: "noto sans jp",
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
		top: 20,
	},
	error: {
		color: "red",
	},
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
		color: "#fff",
	},
});
