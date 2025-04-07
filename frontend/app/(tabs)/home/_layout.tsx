import { Stack } from "expo-router";

export default function CommunitiesStackLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
            <Stack.Screen name="crop-details" options={{ title: "Crop Details", headerShown: false }} />
        </Stack>
    );
}