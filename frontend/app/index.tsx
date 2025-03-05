import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from "react-native";
import {Link} from "expo-router";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen(){
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.homeScreenContainer}>
				<ThemedText type="title">Welcome to <ThemedText type="title" style={styles.nameStyle}>AgriSmart!</ThemedText></ThemedText>

				<ThemedView style={styles.buttonStyle}>
					<Link href="/login">
						<ThemedText type="link" style={styles.btnTextStyle}>Continue</ThemedText>
					</Link>
				</ThemedView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	homeScreenContainer:{
		flex:1,
		alignItems: 'center',
	    justifyContent: 'center',
	    padding: 20,
	},
	nameStyle:{
		color:"#e43e69",
	},
	buttonStyle:{
		outline:"none",
		border:"none",
		borderRadius:10,
		backgroundColor:"#e43e69",
		paddingHorizontal:24,
		paddingVertical:10,
		marginTop:12,
	},
	btnTextStyle:{
		color:"#fff",
		fontSize:18,
	}
})