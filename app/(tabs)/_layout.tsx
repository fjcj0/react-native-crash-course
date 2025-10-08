import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#6200ee",
                tabBarInactiveTintColor: "#666666",
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Todays hapit's",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="calendar-today" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="streaks"
                options={{
                    title: "Streaks",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="chart-line" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="add-habit"
                options={{
                    title: "Add Habit",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="plus-circle" size={24} color={color} />
                    ),
                }}
            />

        </Tabs>
    );
};

export default TabsLayout;
