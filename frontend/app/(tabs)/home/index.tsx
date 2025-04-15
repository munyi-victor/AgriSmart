import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ActivityIndicator, FlatList, Button, Image } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Location from "expo-location";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ForecastData, SeasonalForecastData, Day } from "@/types";

export default function HomeTab() {
	const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);
	const [location, setLocation] = useState<any>(null);
	const [weather, setWeather] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [profileLoading, setProfileLoading] = useState<boolean>(true);
	const [recommendations, setRecommendations] = useState<string[]>([]);

	const [seasonData, setSeasonData] = useState<SeasonalForecastData | null>(null)
	const [averageTemp, setAverageTemp] = useState<number | null>(null)
	const [averageRainfall, setAverageRainfall] = useState<number | null>(null)
	const [averageHumidity, setAverageHumidity] = useState<number | null>(null)
	const [forecast, setForecast] = useState<ForecastData[]>([]);

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
				setProfileLoading(false);
			}
		};

		getUserData();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				// Request user's location
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					alert('Permission to access location was denied');
					return;
				}

				let loc = await Location.getCurrentPositionAsync({});
				setLocation(loc.coords);

				// // Fetch weather data
				const { latitude, longitude } = loc.coords;

				const weatherResponse: any = await axios.get(`https://api.weatherapi.com/v1/current.json?key=8359cb7a49c04746a89131000250403&q=${latitude},${longitude}`);
				setWeather(weatherResponse.data);

				// weather forecast
				const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=HFAPKAUCANU9TCDYLTFNZXDFB&unitGroup=metric`
				const weatherForecastResponse = await axios.get(weatherUrl);
				const weatherData = weatherForecastResponse.data;
				console.log(weatherData.length)

				calculateAvarage(weatherData.days)
				console.log(averageHumidity, averageTemp, averageRainfall)

			} catch (error: any) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	// const determineSeasonType = (data: any): string => {
	// 	if (data.precipitation_sum.some((rain: number) => rain > 80)) {
	// 		return "Long Rains";
	// 	} else if (data.precipitation_sum.some((rain: number) => rain >= 50 && rain <= 80)) {
	// 		return "Short Rains";
	// 	} else {
	// 		return "Dry season";
	// 	}
	// };

	const calculateAvarage = (days: Day[]) => {
		if (days.length === 0) {
			console.log("The 'days' array is empty.");
			return;
		}

		// 
		let totalTemp = 0;
		let totalHumidity = 0;
		let totalRainfall = 0;

		for (const day of days) {
			totalTemp += day.temp
			totalHumidity += day.humidity;
			totalRainfall += day.precip;
		}

		const avgTemp = totalTemp / days.length;;
		const avgHumidity = totalHumidity / days.length;
		const avgRainfall = totalRainfall * 14;

		setAverageTemp(avgTemp);
		setAverageHumidity(avgHumidity);
		setAverageRainfall(avgRainfall);
	}

	const getCropRecommendations = async () => {
		if (!weather) {
			alert('Weather data not available');
			return;
		}

		try {
			const temp = weather.current.temp_c;
			const humid = weather.current.humidity;
			const rain = weather.current.precip_mm;

			// Send weather data to Node.js backend
			const response: any = await axios.post('http://192.168.28.165:3000/api/recommendation/recommend', {
				temperature: averageTemp,
				humidity: averageHumidity,
				rainfall: averageRainfall,
			});

			setRecommendations(response.data);
		} catch (error) {
			console.error(error);
			alert('Failed to fetch crop recommendations');
		}
	};

	if (profileLoading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	if (loading) {
		return <ActivityIndicator size="large" color="green" />;
	}

	return (
		<ScrollView style={styles.homeContainer}>
			<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					{/*<Image source={require("../../assets/dp.png")} style={{width:50, height:50, borderRadius:25}} />)}*/}
					{user ? (<Text style={{ fontSize: 20, fontWeight: "bold" }}>Hello, {user.name}</Text>) : (<Text>Hello, </Text>)}
				</View>
				<TouchableOpacity onPress={() => router.push("/profile")}>
					<Text style={{ fontSize: 16, color: "#1B5E20" }}>Profile</Text>
				</TouchableOpacity>
			</View>
			{weather && (
				<View>
					<Text>Location</Text>
					<Text>{weather.location.name}</Text>
				</View>
			)}

			{weather && (
				<View style={{ backgroundColor: "#1B5E20", borderRadius: 10, padding: 15, marginTop: 20 }}>
					<Text style={{ fontSize: 18, color: "#fff" }}>🌤️ Current Weather in {weather.location.name}</Text>
					<Text style={{ fontSize: 14, color: "#fff" }}>Temp: {weather.current.temp_c}°C | Humidity: {weather.current.humidity}%</Text>
					{/*<Text style={{ fontSize: 14, color: "#fff" }}>Forecast: {weather.forecast.forecastday[0].day.condition.text}</Text>*/}
				</View>
			)}

			<View style={{ marginTop: 20 }}>
				<Text>Weather Forecast</Text>
			</View>

			{seasonData && (
				<View>
					<Text>Seasonal Forecast</Text>
					<Text>Seasonal Type: {seasonData.seasonType}</Text>
					<Text>Seasonal Start: {seasonData.seasonStart}</Text>
					<Text>Seasonal End: {seasonData.seasonEnd}</Text>
					<Text>Average Rainfall: {seasonData.averageRainfall.toFixed(2)} mm</Text>
					<Text>Average Temperature: {seasonData.averageTemperature.toFixed(2)}oC</Text>
				</View>
			)}

			<View>
				<Text>30-Day Weather Forecast</Text>
				<Text>Average Temperature: {averageTemp?.toFixed(2)}°C</Text>
				<Text>Average Rainfall: {averageRainfall?.toFixed(2)} mm</Text>
				<Text>Average Humidity: {averageHumidity?.toFixed(2)}%</Text>
			</View>

			<Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>🌱 Recommended Crops</Text>
			{recommendations.length > 0 ? (
				recommendations.map((crop, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => router.push(`/home/crop-details?crop=${crop}`)}
						style={{ backgroundColor: "#E8F5E9", padding: 12, marginVertical: 6, borderRadius: 8 }}
					>

						<Text style={{ fontSize: 16 }}>{crop}</Text>
					</TouchableOpacity>
				))
			) : (
				<View style={{ flexDirection: "column", gap: 10 }}>
					<Text style={{ fontSize: 14, color: "gray", marginTop: 10 }}>No recommendations available.</Text>
					<TouchableOpacity
						onPress={getCropRecommendations}
						style={{
							backgroundColor: "#1B5E20",
							borderRadius: 10,
							padding: 12,
							marginTop: 10,
							display: "flex",
							alignItems: "center"
						}}
					>
						<Text style={{ color: "#fff", fontSize: 15 }}>Get recommendations</Text>
					</TouchableOpacity>
				</View>
			)}
			<StatusBar style="dark" />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	homeContainer: {
		flex: 1,
		backgroundColor: "#eee",
		paddingVertical: 16,
		paddingHorizontal: 12
	},
	subtitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 10,
	},
	cropItem: {
		marginBottom: 15,
		padding: 10,
		backgroundColor: '#e0e0e0',
		borderRadius: 5,
	},
	cropName: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	aiResponse: {
		marginTop: 5,
		fontStyle: 'italic',
	},
})