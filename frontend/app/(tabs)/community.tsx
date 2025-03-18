import { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Text, FlatList, Button, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

export default function CommunityTab() {
	const [communities, setCommunities] = useState<any[]>([]);
	const [newCommunityName, setNewCommunityName] = useState('');
	const [newCommunityDescription, setNewCommunityDescription] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);

	useEffect(() => {
	  const getUserData = async () => {
		try {
		  const userInfo = await AsyncStorage.getItem("userInfo");
		  if (userInfo) {
			setUser(JSON.parse(userInfo)); // Convert string to object
		  }
		} catch (error) {
		  console.error("Failed to load user data:", error);
		}
	  };

	  getUserData();
	}, []);

	// Fetch all communities from the backend
	const fetchCommunities = async () => {
		try {
			const response = await axios.get('http://localhost:3000/api/community');
			setCommunities(response.data);
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to fetch communities');
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

			await axios.post('http://localhost:3000/api/community/create', {
				name: newCommunityName,
				description: newCommunityDescription,
				userId: user ? user._id : '',
			});

			Alert.alert('Success', 'Community created successfully');
			setNewCommunityName('');
			setNewCommunityDescription('');
			setIsModalVisible(false); // Close the modal after creation
			fetchCommunities(); // Refresh the list of communities
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to create community');
		}
	};

	// Join an existing community
	const joinCommunity = async (communityId: string) => {
		try {
			await axios.post('http://localhost:3000/api/community/join', {
				communityId,
				userId: user?._id,
			});

			Alert.alert('Success', 'Joined community successfully');
			fetchCommunities();
		} catch (error) {
			console.error(error);
			Alert.alert('Error', 'Failed to join community');
		}
	};
	return (
		<SafeAreaView style={styles.communityContainer}>
			<View style={styles.container}>
				<Text style={styles.title}>Communities</Text>

				{/* Button to Open Modal */}
				<Button title="Create New Community" onPress={() => setIsModalVisible(true)} />

				{/* List of Communities */}
				<FlatList
					data={communities}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => (
						<View style={styles.communityItem}>
							<Text style={styles.communityName}>{item.name}</Text>
							<Text style={styles.communityDescription}>{item.description}</Text>
							<Button title="Join" onPress={() => joinCommunity(item._id)} />
						</View>
					)}
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
								<Button title="Cancel" onPress={() => setIsModalVisible(false)} />
								<Button title="Create" onPress={createCommunity} />
							</View>
						</View>
					</View>
				</Modal>
			</View>
			<StatusBar style="dark" />
		</SafeAreaView>
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
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		marginBottom: 10,
	},
	communityItem: {
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
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
	},
	modalContent: {
		width: '80%',
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
		elevation: 5, // For Android shadow
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