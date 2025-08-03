import React, { useEffect } from 'react';
import {
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchChallenges } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header'; // Assuming this is your custom Header component

export default function ChallengesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const challenges = useSelector(s => s.challenges.list);
  const status = useSelector(s => s.challenges.status);
  const error = useSelector(s => s.challenges.error);

  useEffect(() => {
    // Only fetch challenges if the status is not 'loading' or 'succeeded'
    if (status === 'idle') {
      dispatch(fetchChallenges());
    }
  }, [dispatch, status]);

  // Render a loading state while fetching data
  if (status === 'loading') {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Loading challenges...</Text>
      </SafeAreaView>
    );
  }

  // Render an error state if fetching fails
  if (status === 'failed') {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load challenges: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchChallenges())}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ChallengeDetail', { id: item._id })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
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
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardMetaText: {
    marginLeft: 6,
    color: colors.textSecondary,
    fontSize: 14,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
