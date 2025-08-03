import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

// A reusable component for a single day's card in a challenge.
const DayCard = ({ day, done, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, done && styles.cardDone]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={[styles.dayText, done && styles.dayTextDone]}>Day {day}</Text>
        {done && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={colors.textOnPrimary}
            style={styles.checkIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20, // Increased padding for a cleaner look
    width: '100%', // Takes up the full width of its container
    marginBottom: 12, // Space between each card
    alignItems: 'center', // Centering content horizontally within the card
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardDone: {
    backgroundColor: colors.primary, // A different, vibrant color for completed days
  },
  content: {
    // Flex is not needed here, as the text is now centered directly in the card
    // The checkmark is positioned absolutely
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center', // Ensures text is centered within its own space
  },
  dayTextDone: {
    color: colors.textOnPrimary,
  },
  checkIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default DayCard;
