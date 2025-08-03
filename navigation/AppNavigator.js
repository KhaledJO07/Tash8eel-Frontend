import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../app/features/userSlice';
import { signOut } from '../app/features/authSlice';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// Screens
import WelcomeScreen from '../screens/welcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TimerScreen from '../screens/TimerScreen';
import FitnessProfileScreen from '../screens/FitnessProfileScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import WorkoutListScreen from '../screens/workoutListScreen';
import WorkoutDetailScreen from '../screens/workoutDetailScreen';
import WorkoutCategoriesScreen from '../screens/workoutCategoriesScreen';
import ChatBotScreen from '../screens/chatBotScreen'; 
import ChallengeDetailScreen from '../screens/ChallengeDetailScreen';
import WorkoutDtlScreen from '../screens/workoutDtlScreen';
import DayDetailScreen from '../screens/DayDetailScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator();
const ChallengeStack = createNativeStackNavigator();

// A separate stack for the Welcome, Login, and SignUp screens
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}

// A dedicated stack for all authenticated user screens
function AuthenticatedStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainAppLoading" component={MainAppLoadingScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="FitnessProfile" component={FitnessProfileScreen} />
            <Stack.Screen name="ChatBot" component={ChatBotScreen}/>
        </Stack.Navigator>
    );
}

function ChallengeStackNavigator() {
    return (
        <ChallengeStack.Navigator screenOptions={{ headerShown: false }}>
            <ChallengeStack.Screen
                name="ChallengeList"
                component={ChallengeScreen}
                options={{ title: 'Challenges' }}
            />
            <ChallengeStack.Screen
                name="ChallengeDetail"
                component={ChallengeDetailScreen}
                options={{ title: 'Challenge Details' }}
            />
            <ChallengeStack.Screen
                name="DayDetail"
                component={DayDetailScreen}
                options={({ route }) => ({ title: `Day ${route.params.day}` })}
            />
            <ChallengeStack.Screen
                name="WorkoutDtl"
                component={WorkoutDtlScreen}
                options={({ route }) => ({ title: route.params.workout.name })}
            />
        </ChallengeStack.Navigator>
    );
}


// This component will handle the initial data fetching and navigation
const MainAppLoadingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const userProfileStatus = useSelector(state => state.user.status);
    const userProfile = useSelector(state => state.user.profile);
    const userProfileError = useSelector(state => state.user.error);

    // Initial data fetch
    useEffect(() => {
        if (token && userProfileStatus === 'idle') {
            dispatch(fetchUserProfile(token));
        }
    }, [dispatch, token, userProfileStatus]);

    // Navigate once data is fetched
    useEffect(() => {
        if (userProfileStatus === 'succeeded') {
            // Check if user has completed the fitness profile
            if (userProfile && userProfile.height && userProfile.weight) {
                navigation.replace('MainTabs');
            } else {
                navigation.replace('FitnessProfile');
            }
        }
        if (userProfileStatus === 'failed') {
            console.error("Failed to fetch user profile:", userProfileError);
            dispatch(signOut());
        }
    }, [userProfileStatus, navigation, dispatch, userProfile, userProfileError]);

    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5856D6" />
            <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
    );
};

function WorkoutStackNavigator() {
    return (
        <WorkoutStack.Navigator screenOptions={{ headerShown: false }}>
            <WorkoutStack.Screen name="WorkoutCategories" component={WorkoutCategoriesScreen} />
            <WorkoutStack.Screen name="WorkoutList" component={WorkoutListScreen} />
            <WorkoutStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        </WorkoutStack.Navigator>
    );
}

function MainTabs() {
    const insets = useSafeAreaInsets();
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
                        // Removed the 'Create' case
                        case 'Workouts':
                            iconName = 'barbell-outline';
                            break;
                        case 'Leaderboard':
                            iconName = 'bar-chart-outline';
                            break;
                        case 'Timer':
                            iconName = 'timer-outline';
                            break;
                        case 'Profile':
                            iconName = 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse-outline';
                    }
                    return <Ionicons name={iconName} size={size + 2} color={color} />;
                },
                tabBarActiveTintColor: '#5856D6',
                tabBarInactiveTintColor: '#A0A0A0',
                tabBarStyle: {
                    backgroundColor: '#121212',
                    height: 60 + insets.bottom,
                    paddingBottom: 4 + insets.bottom,
                    paddingTop: 10,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 5,
                    fontWeight: '600',
                    textTransform: 'none',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Challenges" component={ChallengeStackNavigator} />
            {/* Removed the Tab.Screen for "Create" */}
            <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
            <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Tab.Screen name="Timer" component={TimerScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    const isSignedIn = useSelector(state => state.auth.isSignedIn);

    // The conditional rendering is now at the top level
    return (
        <NavigationContainer>
            {isSignedIn ? <AuthenticatedStack /> : <AuthStack />}
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
    },
    loadingText: {
        color: '#B0B0B0',
        marginTop: 10,
        fontSize: 16,
    },
});
