import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {StatusBar} from "expo-status-bar";

export default function ProfileTab(){
	return (
		<View>
			<Text>Welcome to Profile</Text>
			<StatusBar style="dark"/>
		</View>
	);
}