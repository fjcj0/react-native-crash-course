import {
    client,
    COMPLETION_TABLE,
    DATABASE_ID,
    databases,
    HABITS_TABLE,
} from '@/lib/appwrite';
import { useAuth } from '@/lib/auth-context';
import { Habit, HabitCompletion } from '@/types/database.type';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ID, Query } from 'react-native-appwrite';
import { Swipeable } from 'react-native-gesture-handler';
import { Button, Surface, Text } from 'react-native-paper';
const HomeScreen = () => {
    const { signOut, user } = useAuth();
    const isFocused = useIsFocused();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    const fetchHabits = async () => {
        if (!user) return;
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                HABITS_TABLE,
                [Query.equal('user_id', user.$id)]
            );
            setHabits(response.documents as Habit[]);
        } catch (error) {
            console.error('Error fetching habits:', error);
            alert(error instanceof Error ? error.message : String(error));
        }
    };
    const fetchTodayCompletions = async () => {
        if (!user) return;
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const response = await databases.listDocuments(
                DATABASE_ID,
                COMPLETION_TABLE,
                [
                    Query.equal('user_id', user.$id),
                    Query.greaterThanEqual('completed_at', today.toISOString()),
                ]
            );
            const completions = response.documents as HabitCompletion[];
            setCompletedHabits(completions.map((c) => c.habit_id));
        } catch (error) {
            console.error('Error fetching completions:', error);
        }
    };
    useEffect(() => {
        if (!user) return;
        fetchHabits();
        fetchTodayCompletions();
        const unsubscribeHabits = client.subscribe(
            `databases.${DATABASE_ID}.collections.${HABITS_TABLE}.documents`,
            (response) => {
                const doc = response.payload as Habit;
                if (doc?.user_id === user.$id) {
                    fetchHabits();
                }
            }
        );
        const unsubscribeCompletions = client.subscribe(
            `databases.${DATABASE_ID}.collections.${COMPLETION_TABLE}.documents`,
            (response) => {
                const doc = response.payload as HabitCompletion;
                if (doc?.user_id === user.$id) {
                    fetchTodayCompletions();
                }
            }
        );
        return () => {
            unsubscribeHabits();
            unsubscribeCompletions();
        };
    }, [user]);
    useEffect(() => {
        if (isFocused && user) {
            fetchHabits();
            fetchTodayCompletions();
        }
    }, [isFocused, user]);
    const handleDeleteHabit = async (habitId: string) => {
        if (!user) return;
        try {
            await databases.deleteDocument(DATABASE_ID, HABITS_TABLE, habitId);
            setHabits((prev) => prev.filter((habit) => habit.$id !== habitId));
        } catch (error) {
            console.error('Error deleting habit:', error);
            alert(error instanceof Error ? error.message : String(error));
        }
    };
    const handleCompleteHabit = async (habitId: string) => {
        if (!user || completedHabits.includes(habitId)) return;
        try {
            await databases.createDocument(
                DATABASE_ID,
                COMPLETION_TABLE,
                ID.unique(),
                {
                    habit_id: habitId,
                    user_id: user.$id,
                    completed_at: new Date().toISOString(),
                }
            );
            const habit = habits.find((h) => h.$id === habitId);
            if (!habit) return;
            await databases.updateDocument(
                DATABASE_ID,
                HABITS_TABLE,
                habitId,
                {
                    streak_count: (habit.streak_count ?? 0) + 1,
                    last_completed: new Date().toISOString(),
                }
            );
            setCompletedHabits((prev) => [...prev, habitId]);
            setHabits((prev) =>
                prev.map((h) =>
                    h.$id === habitId
                        ? { ...h, streak_count: (h.streak_count ?? 0) + 1 }
                        : h
                )
            );
        } catch (error) {
            console.error('Error completing habit:', error);
            alert(error instanceof Error ? error.message : String(error));
        }
    };
    const renderRightActions = () => (
        <View style={styles.swipeRightAction}>
            <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
        </View>
    );
    const renderLeftActions = () => (
        <View style={styles.swipeLeftAction}>
            <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff" />
        </View>
    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall" style={styles.title}>
                    {"Today's Habits"}
                </Text>
                <Button mode="outlined" onPress={signOut} icon="logout">
                    Sign Out
                </Button>
            </View>
            {habits.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        No habits yet — create your first one!
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {habits.map((habit) => {
                        const isCompleted = completedHabits.includes(habit.$id);
                        return (
                            <Swipeable
                                key={habit.$id}
                                renderRightActions={renderRightActions}
                                renderLeftActions={renderLeftActions}
                                containerStyle={{ width: '100%' }}
                                onSwipeableOpen={(direction) => {
                                    if (direction === 'right') {
                                        handleDeleteHabit(habit.$id);
                                    } else if (direction === 'left') {
                                        handleCompleteHabit(habit.$id);
                                    }
                                }}
                            >
                                <Surface
                                    style={[
                                        styles.card,
                                        isCompleted && styles.completedCard,
                                    ]}
                                    elevation={2}
                                >
                                    <View style={styles.cardContent}>
                                        <Text style={styles.cardTitle}>{habit.title}</Text>
                                        <Text style={styles.cardDescription}>
                                            {habit.description}
                                        </Text>

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
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );
};
export default HomeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContainer: {
        paddingBottom: 20,
        alignItems: 'center',
        width: '100%',
    },
    card: {
        width: '100%',
        marginBottom: 18,
        borderRadius: 17,
        backgroundColor: '#f7f2fa',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        elevation: 4,
    },
    completedCard: {
        opacity: 0.6,
    },
    cardContent: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#22223b',
    },
    cardDescription: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 16,
        color: '#6c6c80',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff3e0',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    streakText: {
        marginLeft: 6,
        color: '#ff9800',
        fontWeight: 'bold',
        fontSize: 14,
    },
    frequencyBadge: {
        backgroundColor: '#e0f7fa',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    frequencyText: {
        fontWeight: 'bold',
        color: '#00796b',
        fontSize: 14,
        width: 75,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#666666',
        textAlign: 'center',
    },
    swipeRightAction: {
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
        backgroundColor: '#4caf50',
        borderRadius: 15,
        marginBottom: 18,
        marginTop: 2,
        paddingLeft: 16,
    },
});