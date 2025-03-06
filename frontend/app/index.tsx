import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from "react-native";
import {StatusBar} from "expo-status-bar";
import {Link, router} from "expo-router";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {View, TouchableOpacity, Image, Text} from 'react-native';

export default function HomeScreen(){
	const userInfo = AsyncStorage.getItem("userInfo");
	
	const handleContinue = () => {
		if (userInfo) {
			router.replace('/home');
		}

	}

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.homeScreenContainer}>
				<View style={styles.header}>
					<View>
						<Image source={require("../assets/dp.png")} style={styles.imgStyle} />
					</View>
					<ThemedText type="title" style={{color:"#fff"}}>Welcome to AgriSmart!</ThemedText>
					<TouchableOpacity style={styles.buttonStyle} onPress={handleContinue}>
						<ThemedText type="subtitle" style={styles.btnTextStyle}>Continue</ThemedText>
					</TouchableOpacity>
				</View>
				

				<View>
					<Text style={{color:"#fff"}}>v1.0.0</Text>
				</View>
			</SafeAreaView>
			<StatusBar style="light" />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	homeScreenContainer:{
		flex:1,
		display:"flex",
		alignItems: 'center',
	    justifyContent: 'space-between',
	    padding: 20,
	    backgroundColor:"#1B5E20",
	},
	header:{
		flex:1,
		display:"flex",
		alignItems: 'center',
	    justifyContent: 'center',
	    gap:10
	},
	buttonStyle:{
		display:"flex",
		textAlign:"center",
		outline:"none",
		border:"none",
		borderRadius:50,
		backgroundColor:"#fff",
		paddingHorizontal:50,
		paddingVertical:10,
		marginTop:30,
	},
	btnTextStyle:{
		color:"#1B5E20",
		fontSize:24,
	},
	imgStyle: {
		height: 120,
		width:120,
	}
})