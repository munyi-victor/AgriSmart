import { Stack } from "expo-router";

export default function CommunitiesStackLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Communities", headerShown: false }} />
            <Stack.Screen name="chat" options={{ title: "Community Chat", headerShown: true }} />
            <Stack.Screen name="details" options={{ title: "Community Details", headerShown: true }} />
        </Stack>
    );
}