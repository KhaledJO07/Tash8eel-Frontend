import React, { useEffect } from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchChallenges } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';

export default function ChallengesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const challenges = useSelector(s => s.challenges.list);

  useEffect(() => {
    dispatch(fetchChallenges());
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ChallengeDetail', { id: item._id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={styles.cardMetaText}>{item.durationDays} days</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Challenges" />
      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={i => i._id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text
  },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  cardMetaText: { marginLeft: 6, color: colors.textSecondary }
});