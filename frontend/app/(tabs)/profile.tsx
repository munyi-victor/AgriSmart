import {StyleSheet, View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";

export default function ProfileTab(){
	const handleLogout = () => {
		try {
			axios.get("http://localhost:3000/api/users/logout");
			AsyncStorage.removeItem("userInfo");
			Alert.alert("Success", "Logged out successfully!");
			router.replace("/login");
		} catch (error) {
			Alert.alert("Error", "Something went wrong.")
		}
	}
	return (
		<View style={styles.container}>
			<View style={styles.profileHeader}>
				<Image source={require("../../assets/dp.png")} style={styles.dpStyle} />
				<Text>Munyi Victor</Text>
				<Text>munyivictor6@gmail.com</Text>
			</View>
			<View>
				<TouchableOpacity onPress={handleLogout} style={styles.button}>
					<ThemedText style={{color:"#000"}}>Logout</ThemedText>					
				</TouchableOpacity>
			</View>

			<StatusBar style="dark"/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems:"center",
		paddingVertical:15,
		justifyContent:"space-between",
	},
	profileHeader:{
		display:"flex",
		alignItems:"center",
		justifyContent:"center",
		flexDirection:"column",
		gap:8
	},
	dpStyle:{
		height:140,
		width:140
	},
	button:{
		backgroundColor:""
	}
})