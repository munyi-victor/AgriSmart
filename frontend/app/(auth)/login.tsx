import {useState} from "react";
import {StyleSheet, TextInput, View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";
import {Link} from "expo-router";

export default function LoginScreen(){
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [secure, setSecure] = useState(true);
	return (
		<View style={styles.loginContainer}>
			<ThemedText type="title" style={styles.titleStyle}>Login</ThemedText>

			<View style={styles.formStyle}>
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
				<Link href="/" style={styles.btnStyle}>
		          <ThemedText type="subtitle">Login</ThemedText>
		        </Link>
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
		color:"#000",
	},
	input:{
	    borderWidth: 1,
	    borderRadius:5,
	    padding: 10,
	    width:250,
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
		textAlign:"center"
	},
	btnText:{
		color:"#fff",
	}
})