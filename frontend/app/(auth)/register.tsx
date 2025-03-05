import {useState} from "react";
import {StyleSheet, TextInput, View, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";
import {Link} from "expo-router";

export default function RegisterScreen(){
	const [text, onChangeText] = useState('');
	return (
		<View style={styles.registerContainer}>
			<ThemedText type="title" style={styles.titleStyle}>Register</ThemedText>

			<View style={styles.formStyle}>
				<View style={styles.formInputStyle}>
					<Text>Email:</Text>
					<TextInput
					  inputMode="email"
					  keyboardType="email-address"
					  placeholder="Enter your email"
			          style={styles.input}
			          onChangeText={onChangeText}
			          value={text}
			        />
				</View>
			</View>
			<ThemedText style={{color:"#000"}}>Already have an account? {" "}
				<Link href="/login">
					<ThemedText type="link">Login</ThemedText>
				</Link>
			</ThemedText>
			<Text>{text}</Text>
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
		color:"#000",
	},
	input:{
	    borderWidth: 1,
	    borderRadius:5,
	    padding: 10,
	    width:250,
	    backgroundColor:"#fff",
	},
	formStyle:{
		marginVertical:20
	},
	formInputStyle:{
		display:"flex",
		flexDirection:"column",
		gap:2,
	},
})