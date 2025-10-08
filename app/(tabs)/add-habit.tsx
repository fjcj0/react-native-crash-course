import { DATABASE_ID, databases, HABITS_TABLE } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ID } from 'react-native-appwrite';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
const FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;
type Frequency = (typeof FREQUENCIES)[number];
const AddHabit = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async () => {
        if (!user) return;
        try {
            await databases.createDocument(
                DATABASE_ID,
                HABITS_TABLE,
                ID.unique(),
                {
                    user_id: user.$id,
                    title,
                    description,
                    frequency,
                    streak_count: 0,
                    last_completed: new Date().toISOString(),
                }
            );
            router.back();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        }
    };
    return (
        <View style={styles.viewContainer}>
            <View style={styles.habitHeader}>
                <Text style={styles.textHeader}>Create Habit</Text>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/images/19199035.jpg')}
                    style={styles.image}
                />
            </View>
            <TextInput
                label="Title"
                mode="outlined"
                value={title}
                onChangeText={setTitle}
                style={styles.inputStyle}
            />
            <TextInput
                label="Description"
                mode="outlined"
                value={description}
                onChangeText={setDescription}
                style={styles.inputStyle}
                multiline
            />
            <SegmentedButtons
                value={frequency}
                onValueChange={(value) => setFrequency(value as Frequency)}
                style={styles.segmentStyle}
                buttons={FREQUENCIES.map((freq) => ({
                    value: freq,
                    label: freq.charAt(0).toUpperCase() + freq.slice(1),
                }))}
            />
            <Button
                mode="contained"
                style={styles.buttonStyle}
                onPress={handleSubmit}
                disabled={!title || !description || !frequency}
            >
                Create Habit
            </Button>

            {error && (
                <View style={styles.containerError}>
                    <Text style={styles.textError}>{error}</Text>
                </View>
            )}
        </View>
    );
};
export default AddHabit;
const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    inputStyle: {
        marginTop: 10,
    },
    segmentStyle: {
        marginTop: 10,
    },
    habitHeader: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textHeader: {
        fontSize: 30,
        fontWeight: '900',
        color: '#6200ee',
        textAlign: 'center',
    },
    buttonStyle: {
        marginTop: 10,
        width: 150,
        alignSelf: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        borderRadius: 100,
    },
    containerError: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    textError: {
        color: 'red',
    },
});