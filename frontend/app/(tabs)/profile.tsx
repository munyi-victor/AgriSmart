import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from '@/components/ThemedText';
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from '@/components/ui/IconSymbol';
import { router } from "expo-router";

export default function ProfileTab() {
	const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const userInfo = await AsyncStorage.getItem("userInfo");
				if (userInfo) {
					setUser(JSON.parse(userInfo));
				}
			} catch (error) {
				console.error("Failed to load user data:", error);
			} finally {
				setLoading(false);
			}
		};

		getUserData();
	}, []);

	if (loading) {
		return <ActivityIndicator size="large" color="green" />;
	}
	const handleLogout = async () => {
		try {
			await axios.get("http://192.168.54.165:3000/api/users/logout");
			await AsyncStorage.removeItem("userInfo");
			Alert.alert("Success", "Logged out successfully!");
			router.replace("/login");
		} catch (error) {
			Alert.alert("Error", "Something went wrong.")
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.profileHeader}>
				<Image source={require("../../assets/dp.png")} style={styles.dpStyle} />
				{user && (
					<>
						<Text style={{ fontWeight: "bold" }}>{user.name}</Text>
						<Text>{user.email}</Text>
					</>
				)}
			</View>
			<View>
				<TouchableOpacity onPress={handleLogout} style={styles.button}>
					<ThemedText style={{ color: "#000", fontSize: 18 }}>Logout</ThemedText>
					<IconSymbol size={22} name="out.fill" />
				</TouchableOpacity>
			</View>

			<StatusBar style="dark" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#eee",
		alignItems: "center",
		paddingVertical: 15,
		justifyContent: "space-between",
	},
	profileHeader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		gap: 8,
		marginTop: 18
	},
	dpStyle: {
		height: 140,
		width: 140
	},
	button: {
		backgroundColor: "",
		display: "flex",
		flexDirection: "row",
		gap: 2
	}
})