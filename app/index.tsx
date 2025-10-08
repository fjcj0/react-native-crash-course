import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/images/19199035.jpg')} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Habit Tracker</Text>
        </View>
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            Building good habits is the key to personal growth and success. Our Habit Tracker helps you stay consistent by letting you set daily goals
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Link href="/signup" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageContainer: { marginBottom: 20 },
  image: { width: 200, height: 200, resizeMode: "contain", borderRadius: 100 },
  textContainer: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  paragraphContainer: { paddingHorizontal: 20, marginBottom: 20 },
  paragraph: { textAlign: 'center', fontWeight: '200' },
  buttonContainer: { justifyContent: 'center', alignItems: 'center' },
  button: { backgroundColor: 'coral', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});