import { client, DATABASE_ID, databases, HABITS_TABLE } from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit, realtimeResponse } from '@/types/database.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Query } from 'react-native-appwrite';
import { Swipeable } from 'react-native-gesture-handler';
import { Button, Surface, Text } from 'react-native-paper';
const HomeScreen = () => {
    const { signOut, user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const fetchHabits = async () => {
        if (!user) return;
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                HABITS_TABLE,
                [Query.equal('user_id', user.$id)]
            );
            const habitsData: Habit[] = response.documents.map((doc) => ({
                $id: doc.$id,
                $createdAt: doc.$createdAt,
                $updatedAt: doc.$updatedAt,
                $collectionId: doc.$collectionId,
                $databaseId: doc.$databaseId,
                $permissions: doc.$permissions,
                $sequence: doc.$sequence,
                user_id: (doc as any).user_id,
                title: (doc as any).title,
                description: (doc as any).description,
                frequency: (doc as any).frequency,
                streak_count: (doc as any).streak_count,
                last_completed: (doc as any).last_completed,
            }));
            setHabits(habitsData);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
            else alert(String(error));
        }
    };
    useEffect(() => {
        fetchHabits();
        const unsubscribe = client.subscribe(
            `databases.${DATABASE_ID}.collections.${HABITS_TABLE}.documents`,
            (response: realtimeResponse) => {
                if (
                    response.events.includes('databases.*.collections.*.documents.*.create') ||
                    response.events.includes('databases.*.collections.*.documents.*.update') ||
                    response.events.includes('databases.*.collections.*.documents.*.delete')
                ) {
                    fetchHabits();
                }
            }
        );
        return () => {
            unsubscribe();
        };
    }, [user]);
    const handleDeleteHabit = async (habitId: string) => {
        if (!user) return;
        try {
            await databases.deleteDocument(DATABASE_ID, HABITS_TABLE, habitId);
            setHabits((prev) => prev.filter((habit) => habit.$id !== habitId));
        } catch (error) {
            if (error instanceof Error) alert(error.message);
            else alert(String(error));
        }
    };
    const renderRightActions = () => (
        <View style={styles.swipeRightACtion}>
            <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
        </View>
    );
    const renderLeftActions = () => (
        <View style={styles.swipeLeftAction}>
            <MaterialCommunityIcons name="check-circle-outline" size={32} color="#4caf50" />
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>
                    {"Today's habits"}
                </Text>
                <Button mode="outlined" onPress={signOut} icon="logout">
                    Sign Out
                </Button>
            </View>
            {habits.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No habits yet, create your first habit :(
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {habits.map((habit) => (
                        <Swipeable
                            key={habit.$id}
                            renderRightActions={renderRightActions}
                            renderLeftActions={renderLeftActions}
                            containerStyle={{ width: '100%' }}
                            onSwipeableOpen={(direction) => {
                                if (direction === 'right') {
                                    handleDeleteHabit(habit.$id);
                                }
                                if (direction === 'left') {

                                }
                            }}
                        >
                            <Surface style={styles.card} elevation={2}>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{habit.title}</Text>
                                    <Text style={styles.cardDescription}>{habit.description}</Text>
                                    <View style={styles.cardFooter}>
                                        <View style={styles.streakBadge}>
                                            <MaterialCommunityIcons
                                                name="fire"
                                                size={20}
                                                color="#ff9800"
                                            />
                                            <Text style={styles.streakText}>
                                                {`${habit.streak_count ?? 0} day streak`}
                                            </Text>
                                        </View>
                                        <View style={styles.frequencyBadge}>
                                            <Text style={styles.frequencyText}>
                                                {String(habit.frequency ?? '')
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    String(habit.frequency ?? '').slice(1)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Surface>
                        </Swipeable>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
export default HomeScreen;
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 16, paddingTop: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 16 },
    title: { fontWeight: 'bold' },
    scrollView: { flex: 1, width: '100%' },
    scrollContainer: { paddingBottom: 20, alignItems: 'center', width: '100%' },
    card: { width: '100%', marginBottom: 18, borderRadius: 17, backgroundColor: '#f7f2fa', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, elevation: 4 },
    cardContent: { padding: 20 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 4, color: '#22223b' },
    cardDescription: { fontSize: 15, fontWeight: '500', marginBottom: 16, color: '#6c6c80' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3e0', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    streakText: { marginLeft: 6, color: '#ff9800', fontWeight: 'bold', fontSize: 14 },
    frequencyBadge: { backgroundColor: '#e0f7fa', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
    frequencyText: { fontWeight: 'bold', color: '#00796b', fontSize: 14, width: 75, textAlign: 'center', textTransform: 'uppercase' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyStateText: { color: '#666666', textAlign: 'center' },
    swipeRightACtion: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        backgroundColor: '#e53935',
        borderRadius: 15,
        marginBottom: 18,
        marginTop: 2,
        paddingRight: 16,
    },
    swipeLeftAction: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        backgroundColor: 'green',
        borderRadius: 15,
        marginBottom: 18,
        marginTop: 2,
        paddingLeft: 16,
    },
});