import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Markdown from "react-native-markdown-display";

const CropDetailsScreen = () => {
  const { crop } = useLocalSearchParams();
  const [procedure, setProcedure] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProcedure = async () => {
    try {
      const response: any = await axios.get(`http://192.168.28.165:3000/api/recommendation/plant-procedure/${crop}}`);
      // console.log(response.data)
      setProcedure(response.data);
    } catch (error: any) {
      console.error(`Error fetching AI response for ${crop}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedure();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16, paddingBottom: 30 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1B5E20" }}>{crop} Planting Guide</Text>
      {loading ? <ActivityIndicator size="large" color="#1B5E20" /> : <Markdown>{procedure}</Markdown>}
      {/* style={{ fontSize: 16 }}*/}
    </ScrollView>
  );
};

export default CropDetailsScreen;
