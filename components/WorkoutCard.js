import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2; // two cards per row + padding

export default function WorkoutCard({ workout, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LottieView
        source={{ uri: workout.animationUrl }}
        autoPlay
        loop
        style={styles.anim}
      />
      <Text numberOfLines={2} style={styles.title}>
        {workout.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    margin: 8,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  anim: {
    width: CARD_SIZE * 0.8,
    height: CARD_SIZE * 0.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
