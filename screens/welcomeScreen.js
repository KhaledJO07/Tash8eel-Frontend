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

const { width, height } = Dimensions.get('window');

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

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={{
              uri: 'https://as2.ftcdn.net/v2/jpg/00/99/82/15/1000_F_99821575_nVEHTBXzUnTcLIKN6yOymAWAnFwEybGb.jpg'
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.description}>
            Transform your body, mind, and lifestyle with personalized workouts and nutrition tracking.
          </Text>
        </View>

        {/* Button Section */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  descriptionSection: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
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