// import React, { useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LoginScreen from '../screens/LoginScreen';
// import SignUpScreen from '../screens/SignUpScreen';
// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import TimerScreen from '../screens/TimerScreen';
// import FitnessProfileScreen from '../screens/FitnessProfileScreen';
// import ChallengeScreen from '../screens/ChallengeScreen';
// import CreateChallengeScreen from '../screens/CreateChallengeScreen';
// import LeaderboardScreen from '../screens/LeaderboardScreen';
// import workoutListScreen from './screens/workoutListScreen';
// import WorkoutDetailScreen from './screens/WorkoutDetailScreen';


// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function MainTabs({ token }) {
//     return (
//         <Tab.Navigator
//             screenOptions={({ route }) => ({
//                 headerShown: false,
//                 tabBarIcon: ({ color, size }) => {
//                     let iconName;

//                     switch (route.name) {
//                         case 'Home':
//                             iconName = 'home-outline';
//                             break;
//                         case 'Challenges':
//                             iconName = 'trophy-outline';
//                             break;
//                         case 'Create':
//                             iconName = 'add-circle-outline';
//                             break;
//                         case 'Workouts':
//                             iconName = 'barbell-outline';
//                             break;
//                         case 'Leaderboard':
//                             iconName = 'bar-chart-outline';
//                             break;
//                         case 'Profile':
//                             iconName = 'person-outline';
//                             break;
//                         case 'Timer':
//                             iconName = 'timer-outline';
//                             break;

//                         default:
//                             iconName = 'ellipse-outline';
//                     }

//                     return <Ionicons name={iconName} size={size} color={color} />;
//                 },
//                 tabBarActiveTintColor: '#3b82f6',
//                 tabBarInactiveTintColor: 'gray',
//                 tabBarStyle: {
//                     paddingBottom: 4,
//                     height: 60,
//                 },
//                 tabBarLabelStyle: {
//                     fontSize: 12,
//                 },
//             })}
//         >
//             <Tab.Screen name="Home" component={HomeScreen} />
//             <Tab.Screen name="Challenges" component={ChallengeScreen} />
//             <Tab.Screen name="Create" component={CreateChallengeScreen} />
//             <Tab.Screen name="Workout" component={workoutListScreen} />
//             <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
//             <Tab.Screen
//                 name="Profile"
//                 component={ProfileScreen}
//                 initialParams={{ token }} // ✅ pass token here
//             />
//             <Tab.Screen name="Timer" component={TimerScreen} />
//         </Tab.Navigator>
//     );
// }

// export default function AppNavigator() {
//     const [isSignedIn, setSignedIn] = useState(false);
//     const [token, setToken] = useState(null);

//     return (
//         <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//                 {isSignedIn ? (
//                     <Stack.Screen name="MainTabs">
//                         {props => <MainTabs {...props} token={token} />}
//                     </Stack.Screen>
//                 ) : (
//                     <>
//                         <Stack.Screen name="Login">
//                             {props => (
//                                 <LoginScreen
//                                     {...props}
//                                     setSignedIn={setSignedIn}
//                                     setToken={setToken}
//                                 />
//                             )}
//                         </Stack.Screen>
//                         <Stack.Screen name="SignUp">
//                             {props => (
//                                 <SignUpScreen
//                                     {...props}
//                                     setSignedIn={setSignedIn}
//                                     setToken={setToken}
//                                 />
//                             )}
//                         </Stack.Screen>

//                         <Stack.Screen name="FitnessProfile">
//                             {props => (
//                                 <FitnessProfileScreen
//                                     {...props}
//                                     setSignedIn={setSignedIn}
//                                     setToken={setToken}
//                                 />
//                             )}
//                         </Stack.Screen>


//                     </>
//                 )}
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
<<<<<<< HEAD
import WelcomeScreen from '../screens/welcomeScreen';
=======

// Screens
>>>>>>> 4c2e1eee7a46c0cc9cea54b2f0f727fa78ffede1
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
            <Stack.Screen name="WorkoutCategories" component={WorkoutCategoriesScreen} />
            <WorkoutStack.Screen name="WorkoutList" component={WorkoutListScreen} />
            <WorkoutStack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        </WorkoutStack.Navigator>
    );
}

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
                        case 'Workouts':
                            iconName = 'barbell-outline';
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
<<<<<<< HEAD
}
=======
}

>>>>>>> 4c2e1eee7a46c0cc9cea54b2f0f727fa78ffede1
