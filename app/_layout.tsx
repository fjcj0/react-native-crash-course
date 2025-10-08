import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";
;
function MainLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted || loading) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/(tabs)");
    }
  }, [user, loading, mounted]);
  if (!mounted || loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        >
          <Stack.Screen
            name="index"
            options={{ title: "Auth", headerShown: false }}
          />
          <Stack.Screen
            name="login"
            options={{ title: "Login", headerShown: false }}
          />
          <Stack.Screen
            name="signup"
            options={{ title: "SignUp", headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Tabs" }}
          />
        </Stack>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}