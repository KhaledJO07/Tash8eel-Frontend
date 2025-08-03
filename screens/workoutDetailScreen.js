import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Animated,
  SafeAreaView
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

// --- Toast Component (Reused for consistency across screens) ---
const Toast = ({ message, isVisible, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [isVisible, fadeAnim, onHide]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};
// --- End Toast Component ---

export default function WorkoutDetailScreen({ route }) {
  const { workout } = route.params;
  const navigation = useNavigation();

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showCustomToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const hideCustomToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  useEffect(() => {
    if (!workout) {
      showCustomToast('Workout details not found. Please go back and select a workout.');
    }
  }, [workout]);

  const animationSource = workout.animationFile
    ? { uri: `${API_BASE_URL_JO}/animations/${workout.animationFile}` }
    : null;

  return (
    <SafeAreaView style={styles.rootContainer}>
      {/* Replaced the title with the Header component */}
      <Header title={workout?.name || 'Workout Details'} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>

        {/* Lottie Animation or Placeholder */}
        <View style={styles.animationContainer}>
          {animationSource ? (
            <LottieView
              source={animationSource}
              autoPlay
              loop
              style={styles.animation}
              onError={(error) => showCustomToast(`Failed to load animation: ${error.message}`)}
            />
          ) : (
            <View style={styles.noAnimationPlaceholder}>
              <Text style={styles.noAnimationText}>No animation available</Text>
              <Text style={styles.noAnimationEmoji}>🚫</Text>
            </View>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>{workout.description || 'No description available.'}</Text>

          <Text style={styles.label}>Tips</Text>
          <Text style={styles.text}>{workout.tips || 'No specific tips for this workout.'}</Text>

          <Text style={styles.label}>Target Muscles</Text>
          <Text style={styles.text}>{workout.targetMuscles ? workout.targetMuscles.join(', ') : 'N/A'}</Text>

          <Text style={styles.label}>Duration</Text>
          <Text style={styles.text}>{workout.duration || 'N/A'}</Text>
        </View>
      </ScrollView>

      <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24, // Adjusted padding to work with the new header
    alignItems: 'center',
    paddingBottom: 60,
  },
  // The 'title' style is now removed as it's handled by the Header component.
  animationContainer: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 270,
  },
  animation: {
    width: 250,
    height: 250,
  },
  noAnimationPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
  },
  noAnimationText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 10,
  },
  noAnimationEmoji: {
    fontSize: 40,
  },
  detailsCard: {
    backgroundColor: '#3A3A3C',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#B0B0B0',
    alignSelf: 'flex-start',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'left',
    alignSelf: 'stretch',
    marginTop: 4,
    lineHeight: 24,
    marginBottom: 10,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
