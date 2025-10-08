import { useAuth } from '@/lib/auth-context';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
const HomeScreen = () => {
    const { signOut } = useAuth();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Home</Text>
                <Button
                    mode="outlined"
                    onPress={signOut}
                    icon="logout"
                >
                    Sign Out
                </Button>
            </View>
        </SafeAreaView>
    );
};
export default HomeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});