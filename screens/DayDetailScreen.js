// // screens/DayDetailScreen.js
// import React, { useEffect } from 'react';
// import {
//   View, Text, FlatList, TouchableOpacity, StyleSheet
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';

// import { fetchChallengeDetail } from '../app/features/challengesSlice';

// export default function DayDetailScreen({ route, navigation }) {
//   const { challengeId, day } = route.params;
//   const dispatch = useDispatch();
//   const { detail } = useSelector(s => s.challenges);
//   const userId = useSelector(s => s.user.profile?._id);

//   useEffect(() => {
//     if (!detail || detail._id !== challengeId) {
//       dispatch(fetchChallengeDetail({ id: challengeId, userId }));
//     }
//   }, [challengeId, detail, userId]);

//   if (!detail) return <Text>Loading…</Text>;

//   const workoutsForDay = detail.workouts
//     .filter(w => w.day === day)
//     .map(w => w.workoutId);

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={styles.header}>
//         Workouts for Day {day}
//       </Text>
//       <FlatList
//         data={workoutsForDay}
//         keyExtractor={item => item._id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.row}
//             onPress={() =>
//               navigation.navigate('WorkoutDtl', {
//                 challengeId,
//                 day,
//                 workout: item
//               })
//             }
//           >
//             <Text style={styles.title}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
//   row: { padding: 12, borderBottomWidth: 1, borderColor: '#EEE' },
//   title: { fontSize: 16 }
// // });
// import React, { useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';

// import { fetchChallengeDetail } from '../app/features/challengesSlice';
// import WorkoutCard from '../components/WorkoutCard';

// export default function DayDetailScreen({ route, navigation }) {
//   const { challengeId, day } = route.params;
//   const dispatch = useDispatch();
//   const { detail, progress, loading } = useSelector(s => ({
//     detail: s.challenges.detail,
//     progress: s.challenges.progress,
//     loading: s.challenges.status === 'loading'
//   }));
//   const userId = useSelector(s => s.user.profile?._id);

//   useEffect(() => {
//     if (!detail || detail._id !== challengeId) {
//       dispatch(fetchChallengeDetail({ id: challengeId, userId }));
//     }
//   }, [challengeId, detail, userId]);

//   if (loading || !detail) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" color="#4ADE80" />
//       </SafeAreaView>
//     );
//   }

//   const workoutsForDay = detail.workouts
//     .filter(w => w.day === day)
//     .map(w => w.workoutId);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Day {day} Workouts</Text>
//       <FlatList
//         data={workoutsForDay}
//         keyExtractor={w => w._id}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <WorkoutCard
//             workout={item}
//             onPress={() =>
//               navigation.navigate('WorkoutDtl', {
//                 challengeId,
//                 day,
//                 workout: item
//               })
//             }
//           />
//         )}
//         contentContainerStyle={styles.list}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
//   list: { paddingBottom: 24 }
// });





// // screens/DayDetailScreen.js
// import React, { useEffect } from 'react';
// import {
//   SafeAreaView,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';

// import {
//   fetchChallengeDetail,
//   completeDay
// } from '../app/features/challengesSlice';
// import WorkoutCard from '../components/WorkoutCard';

// export default function DayDetailScreen({ route, navigation }) {
//   const { challengeId, day } = route.params;
//   const dispatch = useDispatch();

//   const { detail, progress, loading } = useSelector(s => ({
//     detail:   s.challenges.detail,
//     progress: s.challenges.progress,
//     loading:  s.challenges.status === 'loading'
//   }));
//   const userId = useSelector(s => s.user.profile?._id);

//   useEffect(() => {
//     if (!detail || detail._id !== challengeId) {
//       dispatch(fetchChallengeDetail({ id: challengeId, userId }));
//     }
//   }, [challengeId, detail, userId]);

//   if (loading || !detail) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" color="#4ADE80" />
//       </SafeAreaView>
//     );
//   }

//   const workoutsForDay = detail.workouts
//     .filter(w => w.day === day)
//     .map(w => w.workoutId);

//   const completed = progress?.completedDays.includes(day);

//   const onDayComplete = () => {
//     if (!completed) {
//       dispatch(completeDay({ id: challengeId, userId, day }));
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Day {day} Workouts</Text>

//       <FlatList
//         data={workoutsForDay}
//         keyExtractor={w => w._id}
//         numColumns={2}
//         renderItem={({ item }) => (
//           <WorkoutCard
//             workout={item}
//             onPress={() =>
//               navigation.navigate('WorkoutDtl', {
//                 challengeId,
//                 day,
//                 workout: item
//               })
//             }
//           />
//         )}
//         contentContainerStyle={styles.list}
//       />

//       <TouchableOpacity
//         style={[
//           styles.completeBtn,
//           completed && styles.completeBtnDone
//         ]}
//         onPress={onDayComplete}
//         disabled={completed}
//       >
//         <Text style={styles.completeText}>
//           {completed ? '✓ Day Complete' : 'Mark Day Complete'}
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container:      { flex: 1, padding: 16 },
//   center:         { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header:         { fontSize: 20, fontWeight: '700', marginBottom: 12 },
//   list:           { paddingBottom: 24 },
//   completeBtn:    {
//     backgroundColor: '#4ADE80',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 12
//   },
//   completeBtnDone:{ backgroundColor: '#AAA' },
//   completeText:   { color: '#FFF', fontWeight: '600' }
// });
import React, { useEffect } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChallengeDetail, completeDay } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import WorkoutCard from '../components/WorkoutCard';

export default function DayDetailScreen({ route, navigation }) {
  const { challengeId, day } = route.params;
  const dispatch = useDispatch();
  const { detail, progress, status } = useSelector(s => s.challenges);
  const loading = status === 'loading';
  const userId = useSelector(s => s.user.profile?._id);

  useEffect(() => {
    if (!detail || detail._id !== challengeId) {
      dispatch(fetchChallengeDetail({ id: challengeId, userId }));
    }
  }, [challengeId, detail, userId]);

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
            onPress={() => navigation.navigate('WorkoutDtl', { workout: item })}
            theme="dark"
          />
        )}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={[styles.completeButton, completed && styles.completeButtonDone]}
        onPress={() => !completed && dispatch(completeDay({ id: challengeId, userId, day }))}
        disabled={completed}
      >
        <Text style={styles.completeText}>
          {completed ? '✓ Day Complete' : 'Mark Day Complete'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  list: { paddingHorizontal: 16, paddingTop: 16 },
  completeButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16
  },
  completeButtonDone: { backgroundColor: colors.border },
  completeText: { color: '#FFF', fontWeight: '600', fontSize: 16 }
});