import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import io from "socket.io-client";
import axios from "axios";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const socket = io("http://192.168.19.165:3000"); 

const CommunityChatScreen = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<{ _id:string; name: string; email: string } | null>(null);

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
    axios.get(`http://192.168.19.165:3000/api/communities/messages/${id}`)
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
    <View style={{ flex: 1}}>
      <View
        style={{
          padding: 15,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height:80,
          elevation:5,
        }}
      >
        {/* Clickable Community Name */}
        <TouchableOpacity onPress={() => router.push(`/communities/details/${id}`)}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "black", marginTop:20 }}>
            {name}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: 16 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                backgroundColor: item.sender._id === user._id ? "#DCF8C6" : "#ECECEC",
                alignSelf: item.sender._id === user._id ? "flex-end" : "flex-start",
                marginVertical: 4,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: "bold", borderBottomWidth:1 }}>{item.sender?.name || "Unknown"}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
        />

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={{
            height: 50,
            borderColor: "#ccc",
            borderWidth: 1,
            paddingHorizontal: 10,
            marginBottom: 10,
          }}
        />
        <Button title="Send" color="#1B5E20" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default CommunityChatScreen;
