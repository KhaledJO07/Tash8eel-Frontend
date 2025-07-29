import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

const { width, height } = Dimensions.get('window'); // Keeping Dimensions for image sizing as in original code

const WelcomeScreen = ({ navigation, setShowWelcome }) => {
  const handleGetStarted = () => {
    setShowWelcome(false);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>FitTracker</Text>
          <Text style={styles.subtitle}>Your Fitness Journey Starts Here</Text>
        </View>

        
        <View style={styles.imageSection}>
          <Image
            source={{
              // Replaced with a more neutral placeholder image for better dark theme integration
              uri: 'https://as2.ftcdn.net/v2/jpg/00/99/82/15/1000_F_99821575_nVEHTBXzUnTcLIKN6yOymAWAnFwEybGb.jpg',
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Transform your body, mind, and lifestyle with personalized workouts and nutrition tracking.
          </Text>
        </View>

        
        <View style={styles.buttonSection}>
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.8}
            style={styles.getStartedButtonWrapper} // Wrapper for LinearGradient
          >
            <LinearGradient
              colors={['#5856D6', '#8A56D6']} // Consistent vibrant gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.getStartedButton} // Apply button styles here
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24, // Consistent padding
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5856D6', // Primary accent color for title
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0', // Lighter gray for secondary text
    textAlign: 'center',
    // opacity removed as color directly provides desired lightness
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: width * 0.85, // Slightly larger image
    height: height * 0.35, // Adjusted height
    borderRadius: 20,
    // Consistent shadows for the image
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4, // Increased shadow opacity
    shadowRadius: 15, // Adjusted shadow radius
    elevation: 10,
  },
  descriptionSection: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0', // Lighter gray for description
    textAlign: 'center',
    lineHeight: 24,
    // opacity removed
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonWrapper: { // Wrapper for LinearGradient to handle shadow/overflow
    borderRadius: 30,
    width: '90%', // Use percentage width for responsiveness
    overflow: 'hidden', // Ensures gradient respects border radius
    shadowColor: '#000', // Consistent shadows for the button
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  getStartedButton: { // Styles applied directly to LinearGradient
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: 'center',
    // borderRadius handled by wrapper
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default WelcomeScreen;
