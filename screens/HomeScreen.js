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
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Simple gradient component for React Native
const LinearGradient = ({ colors, style, children, start, end }) => {
  // For now, we'll use the first color as background
  // You can install react-native-linear-gradient for real gradients
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
};

// Simple icon component - replace with react-native-vector-icons when installed
const Icon = ({ name, size = 24, color = '#000' }) => {
  const icons = {
    'person-circle': '👤',
    'barbell': '🏋️',
    'resize': '📏',
    'fitness': '💪',
    'trophy': '🏆',
    'stopwatch': '⏱️',
    'restaurant': '🍽️',
    'trending-up': '📈',
    'bulb': '💡',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {icons[name] || '●'}
    </Text>
  );
};

const HomeScreen = ({ navigation, userProfile }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Sample user data - replace with actual API data
  const user = userProfile || {
    name: 'Alex',
    weight: 75,
    height: 180,
    bmi: 23.1,
    todaySteps: 8432,
    weeklyGoal: 10000,
    streakDays: 12,
  };

  const motivationalQuotes = [
    "Your body can do it. It's your mind you need to convince.",
    "The only bad workout is the one that didn't happen.",
    "Progress, not perfection.",
    "Champions train, losers complain.",
  ];

  const [currentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const calculateBMI = (weight, height) => {
    return (weight / ((height / 100) ** 2)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3498db' };
    if (bmi < 25) return { category: 'Normal', color: '#2ecc71' };
    if (bmi < 30) return { category: 'Overweight', color: '#f39c12' };
    return { category: 'Obese', color: '#e74c3c' };
  };

  const getProgressPercentage = () => {
    return Math.min((user.todaySteps / user.weeklyGoal) * 100, 100);
  };

  const StatCard = ({ title, value, unit, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
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

  const QuickActionButton = ({ title, icon, color, onPress }) => (
    <TouchableOpacity
      style={[styles.quickActionButton, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.quickActionContent}>
        <Icon name={icon} size={28} color="white" />
        <Text style={styles.quickActionText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Section */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Good Morning</Text>
                <Text style={styles.userName}>{user.name}! 👋</Text>
              </View>
              <TouchableOpacity style={styles.profileButton}>
                <Icon name="person-circle" size={40} color="white" />
              </TouchableOpacity>
            </View>

            {/* Progress Ring */}
            <View style={styles.progressSection}>
              <View style={styles.progressRing}>
                <Text style={styles.progressText}>
                  {user.todaySteps.toLocaleString()}
                </Text>
                <Text style={styles.progressLabel}>steps today</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressGoal}>
                  Goal: {user.weeklyGoal.toLocaleString()}
                </Text>
                <Text style={styles.streakText}>
                  🔥 {user.streakDays} day streak
                </Text>
              </View>
            </View>
          </View>
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
              color="#3498db"
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="Height"
              value={user.height}
              unit="cm"
              icon="resize"
              color="#2ecc71"
              onPress={() => navigation?.navigate('Profile')}
            />
            <StatCard
              title="BMI"
              value={calculateBMI(user.weight, user.height)}
              unit={getBMICategory(user.bmi).category}
              icon="fitness"
              color={getBMICategory(user.bmi).color}
              onPress={() => navigation?.navigate('BMICalculator')}
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
              color="#ff6b6b"
              onPress={() => navigation?.navigate('Challenges')}
            />
            <QuickActionButton
              title="Timer"
              icon="stopwatch"
              color="#4834d4"
              onPress={() => navigation?.navigate('Timer')}
            />
            <QuickActionButton
              title="Nutrition"
              icon="restaurant"
              color="#00d2d3"
              onPress={() => navigation?.navigate('Chatbot')}
            />
            <QuickActionButton
              title="Progress"
              icon="trending-up"
              color="#5f27cd"
              onPress={() => navigation?.navigate('Progress')}
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
            <Icon name="bulb" size={32} color="#d63031" />
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
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    backgroundColor: '#667eea',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    color: 'white',
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
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  progressInfo: {
    flex: 1,
    paddingLeft: 20,
  },
  progressGoal: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  streakText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: 'white',
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
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'center',
  },
  statValue: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statUnit: {
    fontSize: 10,
    color: '#95a5a6',
    marginTop: 2,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: (width - 60) / 2,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  quickActionContent: {
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
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  motivationCard: {
    backgroundColor: '#ffecd2',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
});

export default HomeScreen;