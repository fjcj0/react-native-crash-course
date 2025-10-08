import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ImageStyle, KeyboardAvoidingView, Platform, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

const Signup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const { signUp } = useAuth();

    const handleSignUp = async () => {
        if (!email || !password) {
            setError('All fields are required!!');
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            const error = await signUp(email, password);
            if (error) {
                setError(error);
                return;
            }
            router.replace('/(tabs)');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.imageContainer}>
                <Image source={require('../assets/images/19199035.jpg')} style={styles.image} />
            </View>
            <View style={styles.form}>
                <Text style={styles.title}>Create Account</Text>
                <TextInput
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    label="Password"
                    autoCapitalize="none"
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                />
                <Button
                    mode="contained"
                    disabled={isLoading}
                    onPress={handleSignUp}
                    style={[styles.button, { opacity: isLoading ? 0.5 : 1 }]}
                >
                    {isLoading ? '...' : 'Sign Up'}
                </Button>
                <Button mode="text" onPress={() => router.push('/login')}>
                    Already have an account? Sign In
                </Button>
            </View>
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.textError}>{error}</Text>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create<{
    container: ViewStyle;
    form: ViewStyle;
    title: TextStyle;
    input: ViewStyle;
    button: ViewStyle;
    image: ImageStyle;
    imageContainer: ViewStyle;
    errorContainer: ViewStyle;
    textError: TextStyle;
}>({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    form: { gap: 12 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    input: { marginBottom: 12 },
    button: { marginVertical: 8, paddingVertical: 6 },
    image: { width: 200, height: 200, resizeMode: 'contain', borderRadius: 100 },
    imageContainer: { marginBottom: 20, alignItems: 'center', justifyContent: 'center' },
    errorContainer: { marginVertical: 20, justifyContent: 'flex-start', alignItems: 'flex-start' },
    textError: { color: 'red' },
});
export default Signup;