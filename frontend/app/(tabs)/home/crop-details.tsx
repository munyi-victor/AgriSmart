import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

const CropDetailsScreen = () => {
  const { crop } = useLocalSearchParams();
  const [procedure, setProcedure] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProcedure = async () => {
    try {
      const response: any = await axios.get(`http://192.168.54.165:3000/api/recommendation/plant-procedure/${crop}}`);
      console.log(response.data)
      // setProcedure(response);
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
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1B5E20" }}>{crop} Planting Guide</Text>
      {loading ? <ActivityIndicator size="large" color="#1B5E20" /> : <Text style={{ fontSize: 16 }}>{procedure}</Text>}
    </ScrollView>
  );
};

export default CropDetailsScreen;
