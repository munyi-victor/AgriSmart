import { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, Button, StyleSheet, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { router } from 'expo-router';

export default function CommunityTab() {
	const [communities, setCommunities] = useState<any[]>([]);
	const [newCommunityName, setNewCommunityName] = useState('');
	const [newCommunityDescription, setNewCommunityDescription] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const getUserData = async () => {
			try {
				const userInfo = await AsyncStorage.getItem("userInfo");
				if (userInfo) {
					setUser(JSON.parse(userInfo));
				}
			} catch (error) {
				console.error("Failed to load user data:", error);
			}
		};

		getUserData();
	}, []);

	// Fetch all communities from the backend
	const fetchCommunities = async () => {
		setLoading(true)
		try {
			const response = await axios.get('http://192.168.19.165:3000/api/communities');
			setCommunities(response.data);
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to fetch communities');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCommunities();
	}, []);

	// Create a new community
	const createCommunity = async () => {
		try {
			if (!newCommunityName || !newCommunityDescription) {
				Alert.alert('Error', 'Please provide both name and description');
				return;
			}

			await axios.post('http://192.168.19.165:3000/api/communities/create', {
				name: newCommunityName,
				description: newCommunityDescription,
			});

			Alert.alert('Success', 'Community created successfully');
			setNewCommunityName('');
			setNewCommunityDescription('');
			setIsModalVisible(false);
			fetchCommunities();
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to create community');
		}
	};

	// Join an existing community
	const joinCommunity = async (communityId: string) => {
		try {
			await axios.post('http://192.168.19.165:3000/api/communities/join', {
				communityId,
			});

			Alert.alert('Success', 'Joined community successfully');
			// router.push(`/communities/${communityId}` as any);
			fetchCommunities();
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to join community');
		}
	};
	return (
		<View style={styles.container}>
			{/* Button to Open Modal */}
			<View style={{ marginBottom: 20 }}>
				<Button title="Create New Community" color={"#1B5E20"} onPress={() => setIsModalVisible(true)} />
			</View>

			{/* List of Communities */}
			{loading && <ActivityIndicator size="large" color="#1B5E20" />}
			<FlatList
				data={communities}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => {
					const isMember = item.members.includes(user?._id)

					return (
						<View style={styles.communityItem}>
							<View>
								<Text style={styles.communityName}>{item.name}</Text>
								<Text style={styles.membersCount}>{item.members.length} {item.members.length > 1 ? "members" : "member"}</Text>
							</View>

							<View>
								{isMember ? (
									<Button title="View community" color={"#1B5E20"} onPress={() => router.push(`/communities/${item._id}?name=${item.name}` as any)} />
								) : (
									<Button title="Join" color={"#1B5E20"} onPress={() => joinCommunity(item._id)} />
								)}
							</View>
						</View>
					)
				}}
			/>

			{/* Modal for Creating a Community */}
			<Modal visible={isModalVisible} animationType="slide" transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Create New Community</Text>

						<TextInput
							placeholder="Community Name"
							value={newCommunityName}
							onChangeText={setNewCommunityName}
							style={styles.input}
						/>
						<TextInput
							placeholder="Description"
							value={newCommunityDescription}
							onChangeText={setNewCommunityDescription}
							style={styles.input}
						/>

						<View style={styles.modalButtons}>
							<Button title="Cancel" color={"#E43E69"} onPress={() => setIsModalVisible(false)} />
							<Button title="Create" color={"#1B5E20"} onPress={createCommunity} />
						</View>
					</View>
				</View>
			</Modal>
			<StatusBar style="dark" />
		</View>
	);
}

const styles = StyleSheet.create({
	communityContainer: {
		flex: 1,
		paddingTop: 20,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
	},
	communityItem: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
	},
	communityName: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	communityDescription: {
		fontSize: 14,
		color: '#555',
	},
	membersCount: {
		fontSize: 14,
		color: '#555',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '80%',
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},
});