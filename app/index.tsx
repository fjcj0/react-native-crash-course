import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello welcome to home page</Text>
      <Link href="/login" style={{
        marginTop: 10,
      }} asChild>
        <TouchableOpacity
          style={{
            width: 200,
            height: 50,
            backgroundColor: "coral",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Login Page</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/signup" style={{
        marginTop: 10,
      }} asChild>
        <TouchableOpacity
          style={{
            width: 200,
            height: 50,
            backgroundColor: "coral",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Signup Page</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}