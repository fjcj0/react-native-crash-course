import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Start", headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "SignUp", headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Tabs" }} />
    </Stack>
  );
}