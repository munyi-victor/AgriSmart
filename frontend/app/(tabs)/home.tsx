import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";

export default function HomeTab(){
	return (
		<View>
			<Text>Welcome Home</Text>
			<StatusBar style="dark"/>
		</View>
	);
}