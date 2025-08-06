// screens/DayDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChallengeDetail, completeDay } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import WorkoutCard from '../components/WorkoutCard';
import CompletionModal from '../components/CompletionModal';
import moment from 'moment';

export default function DayDetailScreen({ route, navigation }) {
  const { challengeId, day } = route.params;
  const dispatch = useDispatch();

  const { detail, progress, status } = useSelector(s => s.challenges);
  const loading = status === 'loading';
  const userId = useSelector(s => s.user.profile?._id);

  const [modalVisible, setModalVisible] = useState(false);

  // Fetch (or re-fetch) the challenge detail
  useEffect(() => {
    if (!detail || detail._id !== challengeId) {
      dispatch(fetchChallengeDetail({ id: challengeId, userId }));
    }
  }, [challengeId, detail, userId, dispatch]);

  // When all days are complete, vibrate + show modal
  useEffect(() => {
    if (
      detail &&
      progress &&
      progress.completedDays.length === detail.durationDays
    ) {
      // Vibration.vibrate(100);
      setModalVisible(true);
    }
  }, [detail, progress]);

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  const workoutsForDay = detail.workouts
    .filter(w => w.day === day)
    .map(w => w.workoutId);
  const completed = progress?.completedDays.includes(day);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`Day ${day}`} />

      <FlatList
        data={workoutsForDay}
        keyExtractor={w => w._id}
        numColumns={2}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() =>
              navigation.navigate('WorkoutDtl', { workout: item })
            }
            theme="dark"
          />
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={[
          styles.completeButton,
          completed && styles.completeButtonDone,
        ]}
        onPress={() =>
          !completed &&
          dispatch(completeDay({ id: challengeId, userId, day }))
        }
        disabled={completed}
      >
        <Text style={styles.completeText}>
          {completed ? '✓ Day Complete' : 'Mark Day Complete'}
        </Text>
      </TouchableOpacity>

      <CompletionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        challengeTitle={detail.title}
        completionDate={moment().format('MMMM D, YYYY')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  list: { paddingHorizontal: 16, paddingTop: 16 },
  completeButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  completeButtonDone: { backgroundColor: colors.border },
  completeText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});

