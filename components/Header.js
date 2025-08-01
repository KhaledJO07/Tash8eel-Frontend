import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { colors } from '../theme/colors';

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text
  }
});
