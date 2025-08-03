import React, { useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  fetchChallengeDetail,
  startChallenge,
} from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import DayCard from '../components/DayCard';
import ProgressBar from '../components/ProgressBar';

export default function ChallengeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const dispatch = useDispatch();

  // Optimized single selector to prevent unnecessary re-renders.
  const { detail, progress, status, userId } = useSelector(state => ({
    detail: state.challenges.detail,
    progress: state.challenges.progress,
    status: state.challenges.status,
    userId: state.user.profile?._id,
  }));
  const loading = status === 'loading' || status === 'idle';

  useEffect(() => {
    if (userId) {
      dispatch(fetchChallengeDetail({ id, userId }));
    }
  }, [id, userId, dispatch]);

  const days = useMemo(() => {
    if (!detail?.workouts) {
      return [];
    }
    return [...new Set(detail.workouts.map(w => w.day))].sort((a, b) => a - b);
  }, [detail]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading challenge details...</Text>
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Could not load challenge details.</Text>
      </SafeAreaView>
    );
  }

  const doneCount = progress?.completedDays.length || 0;
  const progressValue = detail.durationDays > 0 ? doneCount / detail.durationDays : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Challenge Detail" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Challenge title and description */}
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.description}>{detail.description}</Text>

        {/* Challenge progress bar */}
        <ProgressBar
          progress={progressValue}
          barColor={colors.primary}
          style={styles.progressBar}
        />

        {/* Start button, only shown if the challenge has not been started */}
        {!progress && (
          <TouchableOpacity
            onPress={() => dispatch(startChallenge({ id, userId }))}
            activeOpacity={0.9}
            style={styles.startButtonWrapper}
          >
            <LinearGradient
              colors={["#5856D6", "#8A56D6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButton}
            >
              <Text style={styles.startText}>Start Challenge</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Days section */}
        <Text style={styles.sectionTitle}>Days</Text>
        <View style={styles.daysList}>
          {days.length > 0 ? (
            days.map(day => (
              <DayCard
                key={day}
                day={day}
                done={progress?.completedDays.includes(day)}
                onPress={() =>
                  navigation.navigate('DayDetail', { challengeId: id, day })
                }
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No days found for this challenge.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  progressBar: {
    marginBottom: 16,
  },
  startButtonWrapper: {
    marginVertical: 16,
    borderRadius: 12, // Updated to match LoginScreen button
    overflow: 'hidden',
  },
  startButton: {
    paddingVertical: 16, // Updated to match LoginScreen button
    alignItems: 'center',
  },
  startText: {
    color: '#fff', // Updated to match LoginScreen button
    fontWeight: '600',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  daysList: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
