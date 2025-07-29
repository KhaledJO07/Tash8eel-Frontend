import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { API_BASE_URL_JO } from '../config';

export default function WorkoutDetailScreen({ route }) {
  const { workout } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <LottieView
        source={{ uri: `${API_BASE_URL_JO}/animations/${workout.animationFile}` }}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.label}>Description</Text>
      <Text style={styles.text}>{workout.description}</Text>

      <Text style={styles.label}>Tips</Text>
      <Text style={styles.text}>{workout.tips}</Text>

      <Text style={styles.label}>Target Muscles</Text>
      <Text style={styles.text}>{workout.targetMuscles.join(', ')}</Text>

      <Text style={styles.label}>Duration</Text>
      <Text style={styles.text}>{workout.duration}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  animation: { width: 300, height: 300 },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    alignSelf: 'stretch',
    marginTop: 4,
  },
});
