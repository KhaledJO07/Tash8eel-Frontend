import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import useSafeAreaInsets
import WelcomeScreen from '../screens/welcomeScreen';
// Screens
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TimerScreen from '../screens/TimerScreen';
import FitnessProfileScreen from '../screens/FitnessProfileScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import CreateChallengeScreen from '../screens/CreateChallengeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import WorkoutListScreen from '../screens/workoutListScreen';
import WorkoutDetailScreen from '../screens/workoutDetailScreen';
import WorkoutCategoriesScreen from '../screens/workoutCategoriesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator();

function WorkoutStackNavigator() {
    return (
        <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkoutStack.Screen name="WorkoutCategories" component={WorkoutCategoriesScreen} />
            <WorkoutStack.Screen name="WorkoutList" component={WorkoutListScreen} />
            <WorkoutStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        </WorkoutStack.Navigator>
    );
}

function MainTabs({ token }) {
    const insets = useSafeAreaInsets(); // Get safe area insets

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
                        case 'Workouts':
                            iconName = 'barbell-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }

                    // Adjust icon size slightly if needed, or keep default 'size'
                    return <Ionicons name={iconName} size={size + 2} color={color} />; // Increased size slightly for better visibility
                },
                // --- Updated Tab Bar Styling ---
                tabBarActiveTintColor: '#5856D6', // Consistent vibrant accent color
                tabBarInactiveTintColor: '#A0A0A0', // Lighter gray for inactive icons/labels
                tabBarStyle: {
                    backgroundColor: '#121212', // Dark background for the tab bar
                    height: 60 + insets.bottom, // Adjust height to include bottom safe area inset
                    paddingBottom: 4 + insets.bottom, // Adjust paddingBottom to include bottom safe area inset
                    paddingTop: 10, // Padding for content above the bottom edge
                    elevation: 10, // Shadow for Android
                    // iOS specific shadows for depth
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 }, // Shadow pointing upwards
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5, // Small margin below label for spacing
                    fontWeight: '600', // Make labels slightly bolder
                    textTransform: 'none', // Prevent uppercase transformation
                },
                // --- End Updated Tab Bar Styling ---
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Challenges" component={ChallengeScreen} />
            <Tab.Screen name="Create" component={CreateChallengeScreen} />
            <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen name="Timer" component={TimerScreen} />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                initialParams={{ token }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const [isSignedIn, setSignedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [showWelcome, setShowWelcome] = useState(true);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isSignedIn ? (
                    <Stack.Screen name="MainTabs">
                        {props => <MainTabs {...props} token={token} />}
                    </Stack.Screen>
                ) : (
                    <>
                        {showWelcome && (
                            <Stack.Screen name="Welcome">
                                {props => (
                                    <WelcomeScreen
                                        {...props}
                                        setShowWelcome={setShowWelcome}
                                    />
                                )}
                            </Stack.Screen>
                        )}
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

