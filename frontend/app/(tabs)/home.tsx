import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";

export default function HomeTab(){
	return (
		<SafeAreaView style={styles.homeContainer}>
			<ScrollView>
				<View>
					<Text>Welcome Home</Text>
					<StatusBar style="dark"/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	homeContainer: {
		flex:1, 
		backgroundColor:"#eee", 
		paddingVertical:16,
		paddingHorizontal: 12
	}
})