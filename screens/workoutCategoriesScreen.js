import React, { useEffect, useCallback, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
  StatusBar, SafeAreaView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkouts } from '../app/features/workoutsSlice';

export default function WorkoutCategoriesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Redux slice state (data = workouts array)
  const { data: workouts, status, error } = useSelector(state => state.workouts);

  // Extract unique categories
  const categories = [...new Set(workouts.map(w => w.category))];
    // Create onRefresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchWorkouts())
      .finally(() => setRefreshing(false));
  }, [dispatch]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWorkouts());
    }
  }, [status, dispatch]);

  const getCategoryColor = (category, index) => {
    const colors = [
      { bg: '#FED7D7', text: '#E53E3E' }, // Red
      { bg: '#C6F6D5', text: '#38A169' }, // Green
      { bg: '#BEE3F8', text: '#3182CE' }, // Blue
      { bg: '#FEEBC8', text: '#DD6B20' }, // Orange
      { bg: '#E9D8FD', text: '#805AD5' }, // Purple
      { bg: '#FED7E2', text: '#D53F8C' }, // Pink
      { bg: '#C6F7E9', text: '#319795' }, // Teal
      { bg: '#FAE5D3', text: '#C05621' }, // Brown
    ];
    return colors[index % colors.length];
  };

  const getWorkoutCountForCategory = (category) => {
    return workouts.filter(workout => workout.category === category).length;
  };

  const renderCategoryItem = ({ item, index }) => {
    const workoutCount = getWorkoutCountForCategory(item);
    const categoryColor = getCategoryColor(item, index);

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('WorkoutList', { category: item })}
      >
        <View style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <View style={[styles.categoryIcon, { backgroundColor: categoryColor.bg }]}>
              <Text style={[styles.categoryLetter, { color: categoryColor.text }]}>
                {item.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>{workoutCount}</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.categoryTitle}>{item}</Text>
            <Text style={styles.categorySubtitle}>
              {workoutCount} {workoutCount === 1 ? 'workout' : 'workouts'} available
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.actionText}>
              {workoutCount > 0 ? 'Start training →' : 'Coming soon →'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#2D3748" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#E53E3E" />
          </View>
          <Text style={styles.loadingText}>Loading your workouts...</Text>
          <View style={styles.loadingBar}>
            <View style={styles.loadingBarFill} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'failed') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2D3748" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Ready to</Text>
          <View style={styles.headerActions}>
            <View style={styles.notificationDot} />
          </View>
        </View>
        <Text style={styles.title}>Train Hard?</Text>
        <Text style={styles.subtitle}>Choose your workout category</Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{categories.length}</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>💪</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>🔥</Text>
            <Text style={styles.statLabel}>Let's Go</Text>
          </View>
        </View>
      </View>

      {/* Categories List */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderCategoryItem}
          refreshing={refreshing}         // <-- Add this
          onRefresh={onRefresh}           // <-- And this
          numColumns={1}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#2D3748',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#4A5568',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#E53E3E',
    borderRadius: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#2D3748', // Dark grey background
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 32,
    backgroundColor: '#2D3748',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#A0AEC0',
  },
  headerActions: {
    position: 'relative',
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E53E3E',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#A0AEC0',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#4A5568',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53E3E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#CBD5E0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoriesSection: {
    flex: 1,
    backgroundColor: '#718096', // Medium grey for contrast
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  separator: {
    height: 16,
  },
  categoryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
  },
  cardGradient: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    minHeight: 140,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLetter: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardBadge: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardContent: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    textTransform: 'capitalize',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  categorySubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E53E3E',
    textAlign: 'right',
  },
});
