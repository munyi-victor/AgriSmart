import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import io from "socket.io-client";
import axios from "axios";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";

const socket = io("http://192.168.54.165:3000");

const CommunityChatScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string; }>();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [community, setCommunity] = useState<{ _id: string; name: string; description: string; members: { _id: string; name: string; }[] } | null>({ name: "Community", id });
  const [user, setUser] = useState<{ _id: string; name: string; email: string } | null>(null);

  const flasListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flasListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(`http://192.168.54.165:3000/api/communities/${id}`);
        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        console.error("Error fetching community details:", error);
      }
    }

    fetchCommunity();
  }, [id])

  useEffect(() => {
    navigation.setOptions({
      title: community.name,
      headerTitle: () => (
        <TouchableOpacity onPress={() => router.push(`/communities/details?id=${id}`)}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1B5E20' }}>{community.name}</Text>
        </TouchableOpacity>
      )
    })
  }, [navigation, community, id]);

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

  // Fetch previous messages when component mounts
  useEffect(() => {
    axios.get(`http://192.168.54.165:3000/api/communities/messages/${id}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  }, [id]);

  // Connect to socket and listen for new messages
  useEffect(() => {
    socket.emit("joinCommunity", id);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.emit("leaveCommunity", id);
    };
  }, [id]);

  // Send message function
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      sender: user._id,
      community: id,
      content: message,
    };

    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
          <FlatList
            ref={flasListRef}
            data={messages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  backgroundColor: item.sender._id === user._id ? "#DCF8C6" : "#ECECEC",
                  alignSelf: item.sender._id === user._id ? "flex-end" : "flex-start",
                  marginVertical: 5,
                  borderRadius: 8,
                  maxWidth: "80%",
                }}
              >
                <Text style={{ fontWeight: "bold", borderBottomWidth: 1 }}>{item.sender?.name || "Unknown"}</Text>
                <Text>{item.content}</Text>
                <Text style={{ fontWeight: "bold", fontSize: 10, marginTop: 4, alignSelf: "flex-end" }}>{format(new Date(item.createdAt), "MM/d, h:mm a")}</Text>
              </View>
            )}
          />

          <View style={{ flexDirection: "row", padding: 5 }}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message..."
              placeholderTextColor="#fff"
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
                // borderWidth: 1,
                borderRadius: 25,
                color: "#fff",
                fontSize: 18,
                backgroundColor: "#444"
              }}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: 4,
                padding: 10,
                backgroundColor: "#1B5E20",
                borderRadius: 25,
              }}>
              <Text style={{ color: "#fff" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default CommunityChatScreen;
