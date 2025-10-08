import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "START", headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "LOGIN", headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: "SIGNUP", headerShown: false }} />
    </Stack>
  );
}