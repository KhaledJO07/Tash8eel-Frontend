import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TimerScreen from '../screens/TimerScreen';
import FitnessProfileScreen from '../screens/FitnessProfileScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import CreateChallengeScreen from '../screens/CreateChallengeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ token }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home-outline';
                            break;
                        case 'Challenges':
                            iconName = 'trophy-outline';
                            break;
                        case 'Create':
                            iconName = 'add-circle-outline';
                            break;
                        case 'Leaderboard':
                            iconName = 'bar-chart-outline';
                            break;
                        case 'Profile':
                            iconName = 'person-outline';
                            break;
                        case 'Timer':
                            iconName = 'timer-outline';
                            break;

                        default:
                            iconName = 'ellipse-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 4,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Challenges" component={ChallengeScreen} />
            <Tab.Screen name="Create" component={CreateChallengeScreen} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ token }} // ✅ pass token here
            />
            <Tab.Screen name="Timer" component={TimerScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const [isSignedIn, setSignedIn] = useState(false);
    const [token, setToken] = useState(null);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isSignedIn ? (
                    <Stack.Screen name="MainTabs">
                        {props => <MainTabs {...props} token={token} />}
                    </Stack.Screen>
                ) : (
                    <>
                        <Stack.Screen name="Login">
                            {props => (
                                <LoginScreen
                                    {...props}
                                    setSignedIn={setSignedIn}
                                    setToken={setToken}
                                />
                            )}
                        </Stack.Screen>
                        <Stack.Screen name="SignUp">
                            {props => (
                                <SignUpScreen
                                    {...props}
                                    setSignedIn={setSignedIn}
                                    setToken={setToken}
                                />
                            )}
                        </Stack.Screen>

                        <Stack.Screen name="FitnessProfile">
                            {props => (
                                <FitnessProfileScreen
                                    {...props}
                                    setSignedIn={setSignedIn}
                                    setToken={setToken}
                                />
                            )}
                        </Stack.Screen>


                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
