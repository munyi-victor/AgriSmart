import {useState} from "react";
import {StyleSheet, TextInput, View, Text, TouchableOpacity, Button, Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";
import {Link, router} from "expo-router";
import {Picker} from '@react-native-picker/picker';
import axios from "axios";

const Item: any = Picker.Item;

export default function RegisterScreen(){
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [secure, setSecure] = useState(true);
	const [formErrors, setFormErros] = useState('');
	const [loading, setLoading] = useState(false);

	const handleRegister = async () => {
		setLoading(true);

		if (confirmPassword !== password) {
			setFormErros("Passwords do not match");
		}

		if (!name || !email || !role || !password || !confirmPassword) {
			setFormErros("All fields are required");
		}

		try {
			axios.post( 'http://localhost:3000/api/users/register', {
			    name,
			    email,
			    password,
			    role,
			  }
			);
			Alert.alert("Success", "Registration successful!");
			router.replace("/home");
			setName('');
			setEmail('');
			setRole('');
			setPassword('');
			setConfirmPassword('');
		} catch (error) {
			Alert.alert("Error:", error?.data?.message || error?.error);

		} finally {
			setLoading(false);
		}

	}

	return (
		<View style={styles.registerContainer}>
			<ThemedText type="title" style={styles.titleStyle}>Register</ThemedText>

			<View style={styles.formStyle}>
				<View style={styles.formInputStyle}>
					<Text>Name:</Text>
					<TextInput
					  keyboardType="default"
					  placeholder="Enter your name"
			          style={styles.input}
			          onChangeText={setName}
			          value={name}
			        />
				</View>
				<View style={styles.formInputStyle}>
					<Text>Email:</Text>
					<TextInput
					  inputMode="email"
					  keyboardType="email-address"
					  placeholder="Enter your email"
			          style={styles.input}
			          onChangeText={setEmail}
			          value={email}
			        />
				</View>
				<View style={styles.formInputStyle}>
					<Text>Your role:</Text>
					<View style={styles.pickerStyle}>
						<Picker
					      testID="basic-picker"
					      selectedValue={role}
					      onValueChange={(r) => setRole(r)}
					      accessibilityLabel="Basic Picker Accessibility Label"
					    >
					      <Item label="Farmer" value="key0" />
					      <Item label="Specialist" value="key1" />
					    </Picker>
					</View>
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
				<View style={styles.formInputStyle}>
					<Text>Confirm password:</Text>
					<View style={styles.passwordInput}>
						<TextInput
						  keyboardType="default"
						  secureTextEntry={secure}
						  placeholder="Enter your password"
				          style={styles.input}
				          onChangeText={setConfirmPassword}
				          value={confirmPassword}
				        />
				        <TouchableOpacity onPress={() => setSecure(!secure)}>
				          <Text style={styles.toggle}>{secure ? '👁️' : '🙈'}</Text>
				        </TouchableOpacity>
					</View>
				</View>
				<Text style={styles.formErrors}>{formErrors}</Text>

		        <Button title="Register" color="#1B5E20" onPress={handleRegister} />
		        {loading && <ActivityIndicator size="large" color="#1B5E20" />}
			</View>
			<ThemedText style={{color:"#000"}}>Already have an account? {" "}
				<Link href="/login">
					<ThemedText type="link">Login</ThemedText>
				</Link>
			</ThemedText>
			<StatusBar style="dark" />
		</View>
	);
}

const styles = StyleSheet.create({
	registerContainer:{
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
		display:"flex",
		alignItems:"center",
		backgroundColor:"#e43e69",
		borderRadius:5,
		padding:5,
	},
	btnText:{
		color:"#fff",
		fontSize:20
	},
	pickerStyle:{
		borderWidth: 1,
	    borderRadius:5,
	},
	formErrors:{
		color:"red",
		marginTop: -8
	}
})