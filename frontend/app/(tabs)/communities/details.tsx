import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";

const CommunityDetails = () => {
  const { id } = useLocalSearchParams();
  const [community, setCommunity] = useState<{ _id: string; name: string; description: string; members: { _id: string; name: string; }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://192.168.28.165:3000/api/communities/${id}`);
        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        console.error("Error fetching community details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [id]);

  if (!community) return <ActivityIndicator size="large" color="#1B5E20" />

  return (
    <SafeAreaView style={styles.infoContainer}>
      {loading && <ActivityIndicator size="large" color="#1B5E20" />}
      <View>
        <View style={styles.profileHeader}>
          <Image source={require("../../../assets/dp.png")} style={styles.dpStyle} />

          <Text style={{ fontSize: 22, fontWeight: "bold" }}>{community.name}</Text>
          <Text>{community.description}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>Members:</Text>
          <FlatList
            data={community.members}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Text>{item.name}</Text>}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CommunityDetails;

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginTop: 18
  },
  dpStyle: {
    height: 140,
    width: 140
  },
})