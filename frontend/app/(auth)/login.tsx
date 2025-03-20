import {useState} from "react";
import {StyleSheet, TextInput, View, Text, TouchableOpacity, Alert, Button, ActivityIndicator} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";
import {Link, router} from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen(){
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secure, setSecure] = useState(true);
	const [formErrors, setFormErros] = useState('');
	const [loading, setLoading] = useState(false);

	const API_URL = "http://192.168.19.165:3000/api/users/login"

	const handleLogin = async () => {
	  try {
	    setLoading(true);
	    const response = await axios.post(API_URL, { email, password });

	    if (response) {
	      await AsyncStorage.setItem("userInfo", JSON.stringify(response.data));
	      Alert.alert("Success", "Login successful!");
	      router.replace("/home");
	    }
	  } catch (error) {
	    Alert.alert("Login failed", error?.response?.data?.message || "Something went wrong");
	  } finally {
	    setLoading(false);
	  }
	};

	return (
		<View style={styles.loginContainer}>
			<ThemedText type="title" style={styles.titleStyle}>Login</ThemedText>

			<View style={styles.formStyle}>
				<View style={styles.formInputStyle}>
					<Text>Email:</Text>
					<TextInput
					  inputMode="email"
					  keyboardType="email-address"
					  autoCapitalize="none"
					  placeholder="Enter your email"
			          style={styles.input}
			          onChangeText={setEmail}
			          value={email}
			        />
				</View>
				<View style={styles.formInputStyle}>
					<Text>Password:</Text>
					<View style={styles.passwordInput}>
						<TextInput
						  keyboardType="default"
						  secureTextEntry={secure}
						  placeholder="Enter your password"
				          style={styles.input}
				          onChangeText={setPassword}
				          value={password}
				        />
				        <TouchableOpacity onPress={() => setSecure(!secure)}>
				          <Text style={styles.toggle}>{secure ? '👁️' : '🙈'}</Text>
				        </TouchableOpacity>
					</View>
				</View>
				<Text style={styles.formErrors}>{formErrors}</Text>
		        <Button title="Login" color="#1B5E20" onPress={handleLogin} />
		        {loading && <ActivityIndicator size="large" color="#1B5E20" />}
			</View>
			<ThemedText style={{color:"#000"}}>Dont have an account? {" "}
				<Link href="/register">
					<ThemedText type="link">Register</ThemedText>
				</Link>
			</ThemedText>
			<StatusBar style="dark" />
		</View>
	);
}

const styles = StyleSheet.create({
	loginContainer:{
		flex:1,
		alignItems: 'center',
	    justifyContent: 'center',
	    padding: 10,
	    backgroundColor:"#fff",
	},
	titleStyle:{
		color:"#1B5E20",
	},
	input:{
	    borderWidth: 1,
	    borderRadius:5,
	    padding: 10,
	    width:300,
	    backgroundColor:"#fff",
	},
	passwordInput:{
		flexDirection: 'row',
	},
	formStyle:{
		marginVertical:20,
		display:"flex",
		flexDirection:"column",
		gap:10
	},
	formInputStyle:{
		display:"flex",
		flexDirection:"column",
		gap:2,
	},
	toggle: {
	    fontSize: 18,
	    padding: 5,
	    position:"absolute",
	    left:-36,
	    top:4
	},
	btnStyle:{
		backgroundColor:"#e43e69",
		borderRadius:5,
		padding:5,
		display:"flex",
		alignItems:"center"
	},
	btnText:{
		color:"#fff",
		fontSize: 20
	},
	formErrors:{
		color:"red"
	}
})