import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Platform, // Import Platform for OS-specific adjustments
  Easing, // <--- IMPORT Easing EXPLICITLY HERE
} from 'react-native';

const { width, height } = Dimensions.get('window'); // Keeping Dimensions for responsive sizing

// Simple gradient component for React Native (assuming this is a placeholder for a library)
const LinearGradient = ({ colors, style, children, start, end }) => {
  // In a real app, you'd use 'react-native-linear-gradient' here.
  // For now, we'll use the first color as a solid background for visual representation.
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

// Simple icon component - replace with react-native-vector-icons when installed
const Icon = ({ name, size = 24, color = '#000' }) => {
  const icons = {
    'person-circle': '👤', // Unicode emoji for person icon
    'barbell': '🏋️',     // Unicode emoji for barbell
    'resize': '📏',      // Unicode emoji for ruler
    'fitness': '💪',     // Unicode emoji for muscle
    'trophy': '🏆',      // Unicode emoji for trophy
    'stopwatch': '⏱️',   // Unicode emoji for stopwatch
    'restaurant': '🍽️',  // Unicode emoji for restaurant
    'trending-up': '📈', // Unicode emoji for graph
    'bulb': '💡',        // Unicode emoji for lightbulb
    'plus-circle': '➕', // Unicode emoji for plus circle (for 'Create')
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {icons[name] || '●'} {/* Fallback to a dot if icon not found */}
    </Text>
  );
};

export default HomeScreen = ({ navigation, userProfile }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // For opacity animation
  const [slideAnim] = useState(new Animated.Value(50)); // For translateY animation

  // Sample user data - replace with actual API data or Redux state
  const user = userProfile || {
    name: 'Alex',
    weight: 75,
    height: 180,
    bmi: 23.1,
    todaySteps: 8432,
    weeklyGoal: 10000,
    streakDays: 12,
  };

  // Motivational quotes for dynamic display
  const motivationalQuotes = [
    "Your body can do it. It's your mind you need to convince.",
    "The only bad workout is the one that didn't happen.",
    "Progress, not perfection.",
    "Champions train, losers complain.",
    "Believe you can and you're halfway there.",
    "Strength does not come from physical capacity. It comes from an indomitable will.",
  ];

  // Randomly select a motivational quote on component mount
  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  // Entrance animations for header and sections
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Fade in over 1 second
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800, // Slide up over 0.8 seconds
        easing: Easing.out(Easing.ease), // <--- Use Easing directly here
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // Run once on component mount

  // Helper function to calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height || height === 0) return 'N/A';
    return (weight / ((height / 100) ** 2)).toFixed(1);
  };

  // Helper function to determine BMI category and associated color
  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi); // Ensure BMI is a number
    if (isNaN(bmiValue)) return { category: 'N/A', color: '#B0B0B0' }; // Default color for N/A

    if (bmiValue < 18.5) return { category: 'Underweight', color: '#3B82F6' }; // Blue
    if (bmiValue < 25) return { category: 'Normal', color: '#4ADE80' }; // Green
    if (bmiValue < 30) return { category: 'Overweight', color: '#FBBF24' }; // Yellow/Orange
    return { category: 'Obese', color: '#FF6B6B' }; // Red
  };

  // Helper function to get progress percentage for steps goal
  const getProgressPercentage = () => {
    if (!user.weeklyGoal || user.weeklyGoal === 0) return 0;
    return Math.min((user.todaySteps / user.weeklyGoal) * 100, 100);
  };

  // Reusable Stat Card Component
  const StatCard = ({ title, value, unit, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]} // Dynamic border color
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.statCardContent}>
        <View style={styles.statHeader}>
          <Icon name={icon} size={24} color={color} />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <View style={styles.statValue}>
          <Text style={styles.statNumber}>{value}</Text>
          <Text style={styles.statUnit}>{unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Reusable Quick Action Button Component
  const QuickActionButton = ({ title, icon, color, onPress }) => (
    <TouchableOpacity
      style={styles.quickActionButtonWrapper} // Wrapper for shadow
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[color, color]} // Using a solid color for simplicity, could be a gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionButton}
      >
        <View style={styles.quickActionContent}>
          <Icon name={icon} size={28} color="white" />
          <Text style={styles.quickActionText}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1E" /> 

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false} // Prevent excessive bouncing for a cleaner feel
        contentContainerStyle={styles.scrollViewContent} // Added for bottom padding
      >
        
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['#3A3A3C', '#2C2C2E']} // Dark gradient for header background
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.userName}>{user.name}! 👋</Text>
              </View>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation?.navigate('Profile')}>
                <Icon name="person-circle" size={40} color="white" />
              </TouchableOpacity>
            </View>

            
            <View style={styles.progressSection}>
              <View style={styles.progressRing}>
                <Text style={styles.progressText}>
                  {user.todaySteps.toLocaleString()}
                </Text>
                <Text style={styles.progressLabel}>steps today</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressGoal}>
                  Goal: {user.weeklyGoal.toLocaleString()} steps
                </Text>
                <Text style={styles.streakText}>
                  🔥 {user.streakDays} day streak
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Weight"
              value={user.weight}
              unit="kg"
              icon="barbell"
              color={getBMICategory(user.bmi).color} // Use BMI category color for consistency
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="Height"
              value={user.height}
              unit="cm"
              icon="resize"
              color={getBMICategory(user.bmi).color} // Use BMI category color for consistency
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="BMI"
              value={calculateBMI(user.weight, user.height)}
              unit={getBMICategory(user.bmi).category}
              icon="fitness"
              color={getBMICategory(user.bmi).color}
              onPress={() => navigation?.navigate('FitnessProfile')} 
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionButton
              title="Challenges"
              icon="trophy"
              color="#FF6B6B" // Red
              onPress={() => navigation?.navigate('Challenges')}
            />
            <QuickActionButton
              title="Timer"
              icon="stopwatch"
              color="#5856D6" // Primary accent color
              onPress={() => navigation?.navigate('Timer')}
            />
            <QuickActionButton
              title="Workouts" // Changed from Nutrition
              icon="barbell" // Changed icon
              color="#4ADE80" // Green
              onPress={() => navigation?.navigate('Workouts')} 
            />
            <QuickActionButton
              title="Create" // Changed from Progress
              icon="plus-circle" // Changed icon
              color="#FBBF24" // Yellow
              onPress={() => navigation?.navigate('Create')} 
            />
          </View>
        </Animated.View>

        {/* Motivation Section */}
        <Animated.View
          style={[
            styles.motivationSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.motivationCard}>
            <Icon name="bulb" size={32} color="#5856D6" /> 
            <Text style={styles.motivationText}>{currentQuote}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Extra padding at the bottom for tab bar and scroll comfort
  },
  header: {
    marginBottom: 20, // Space below the header card
    // No direct background here, LinearGradient handles it
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 20 : 30, // Adjust padding for status bar/notch
    paddingBottom: 30,
    paddingHorizontal: 24, // Consistent horizontal padding
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // Shadows for the header card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#B0B0B0', // Lighter gray for readability
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20, // Space from header content
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle transparent white
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Slightly more opaque border
  },
  progressText: {
    fontSize: 20, // Slightly larger
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  progressLabel: {
    fontSize: 12,
    color: '#B0B0B0', // Lighter gray
    marginTop: 2,
  },
  progressInfo: {
    flex: 1,
    paddingLeft: 20,
  },
  progressGoal: {
    fontSize: 16,
    color: '#FFFFFF', // White text
    fontWeight: '600',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 16,
    color: '#FFFFFF', // White text
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 24, // Consistent horizontal padding
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF', // White text
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginHorizontal: -6, // Counteract statCard margin
  },
  statCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: (width - 60) / 3,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#B0B0B0', // Lighter gray
    marginTop: 4,
    textAlign: 'center',
  },
  statValue: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  statUnit: {
    fontSize: 10,
    color: '#B0B0B0', // Lighter gray
    marginTop: 2,
  },
  quickActionsSection: {
    paddingHorizontal: 24, // Consistent horizontal padding
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -6, // Counteract quickActionButtonWrapper margin
  },
  quickActionButtonWrapper: { // Wrapper for LinearGradient to apply shadow and consistent sizing
    width: (width - 24 * 2 - 12) / 2, // (screen width - 2*padding - 2*margin between buttons) / 2 buttons
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 6, // Space between buttons
  },
  quickActionButton: { // Styles applied directly to LinearGradient
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  quickActionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  motivationSection: {
    paddingHorizontal: 24, // Consistent horizontal padding
    marginBottom: 30,
  },
  motivationCard: {
    backgroundColor: '#3A3A3C', // Consistent card background
    borderRadius: 16, // Consistent border radius
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000', // Consistent shadows
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
});
