import React, { useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { fetchChallengeDetail, completeDay } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header'; // Re-import the Header component
import WorkoutCard from '../components/WorkoutCard';

export default function DayDetailScreen({ route, navigation }) {
  const { challengeId, day } = route.params;
  const dispatch = useDispatch();

  const { detail, progress, status } = useSelector(s => s.challenges);
  const loading = status === 'loading';
  const userId = useSelector(s => s.user.profile?._id);

  // Fetch challenge details only if they are not already available
  useEffect(() => {
    if (userId && (!detail || detail._id !== challengeId)) {
      dispatch(fetchChallengeDetail({ id: challengeId, userId }));
    }
  }, [challengeId, detail, userId, dispatch]);

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
    //
  }

  // Filter workouts for the specific day
  const workoutsForDay = detail.workouts
    .filter(w => w.day === day)
    .map(w => w.workoutId);

  // Check if the current day has been completed
  const completed = progress?.completedDays.includes(day);

  return (
    <SafeAreaView style={styles.container}>
      {/* Restored: The original Header component */}
      <Header title={`Day ${day}`} onBackPress={() => navigation.goBack()} />
      <FlatList
        data={workoutsForDay}
        keyExtractor={w => w._id}
        numColumns={2}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => navigation.navigate('WorkoutDtl', { workout: item })}
          />
        )}
        columnWrapperStyle={styles.listRow}
        contentContainerStyle={styles.list}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => !completed && dispatch(completeDay({ id: challengeId, userId, day }))}
          disabled={completed}
          activeOpacity={0.9}
          style={styles.completeButtonWrapper}
        >
          {completed ? (
            <View style={styles.completeButtonDisabled}>
              <Text style={styles.completeText}>
                ✓ Day Complete
              </Text>
            </View>
          ) : (
            <LinearGradient
              colors={["#5856D6", "#8A56D6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completeButton}
            >
              <Text style={styles.completeText}>
                Mark Day Complete
              </Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16
  },
  listRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  completeButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  completeButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  completeButtonDisabled: {
    backgroundColor: colors.disabled,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  completeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
});
