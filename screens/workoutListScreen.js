import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { API_BASE_URL_JO } from '../config';

export default function WorkoutListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const category = route.params?.category;

  const { data: workouts } = useSelector(state => state.workouts);

  const filtered = workouts.filter(w => w.category === category);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Workouts</Text>
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent} // Changed to use a style object
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
            activeOpacity={0.85} // Added for consistent touch feedback
          >
            <LottieView
              source={{ uri: `${API_BASE_URL_JO}/animations/${item.animationFile}` }}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
    padding: 24, // Consistent padding
  },
  title: {
    fontSize: 28, // Consistent title size
    fontWeight: '700', // Consistent title weight
    color: '#FFFFFF', // White text for dark background
    marginBottom: 20,
    textAlign: 'center', // Center the title
  },
  listContent: {
    paddingBottom: 60, // Ensure enough space at the bottom (e.g., for tab bar)
  },
  card: {
    backgroundColor: '#3A3A3C', // Darker background for cards
    borderRadius: 16, // Consistent border radius
    padding: 12,
    marginBottom: 16, // Space between cards
    alignItems: 'center',
    shadowColor: '#000', // Consistent shadows
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  lottie: {
    width: 150, // Keep original size or adjust as needed for list view
    height: 150,
    marginBottom: 10, // Add space below Lottie animation
    // If you want a background/shadow directly on the Lottie, it's difficult without a wrapper View.
    // These properties would ideally be on a wrapper View for the Lottie.
  },
  name: {
    marginTop: 10, // Keep original margin or adjust
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // White text for dark background
    textAlign: 'center', // Center the workout name
  },
});
