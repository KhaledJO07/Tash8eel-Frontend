// // screens/ChallengeDetailScreen.js
// import React,{useEffect} from 'react';
// import{View,Text,FlatList,TouchableOpacity}from'react-native';
// import{useDispatch,useSelector}from'react-redux';
// import{
//   fetchChallengeDetail,
//   startChallenge,
//   completeDay
// }from'../app/features/challengesSlice';
// import ProgressBar from'../components/ProgressBar';
// import DayCard from'../components/DayCard';

// export default function ChallengeDetailScreen({route}){
//   const{id}=route.params;
//   const dispatch=useDispatch();
//   const{detail,progress}=useSelector(s=>s.challenges);
// //   const userId=useSelector(s=>s.auth.user.profile._id);
// const userId = useSelector(state => state.user.profile?._id)

//   useEffect(()=>{
//     if(userId)dispatch(fetchChallengeDetail({id,userId}));
//   },[id,userId]);
//   if(!detail)return<Text>Loading…</Text>;

//   const doneCount=progress?.completedDays.length||0;
//   const days=detail.workouts;
//   return(
//     <View style={{flex:1,padding:16}}>
//       <Text style={{fontSize:24,fontWeight:'bold'}}>{detail.title}</Text>
//       <Text style={{marginVertical:8}}>{detail.description}</Text>
//       <ProgressBar progress={doneCount} total={detail.durationDays}/>

//       {!progress&&(
//         <TouchableOpacity
//           onPress={()=>dispatch(startChallenge({id,userId}))}
//           style={{margin:16,padding:12,backgroundColor:'#4ADE80',borderRadius:8}}>
//           <Text style={{textAlign:'center',color:'#FFF'}}>Start Challenge</Text>
//         </TouchableOpacity>
//       )}
//       <FlatList
//         data={days}
//         horizontal
//         keyExtractor={item=>String(item.day)}
//         contentContainerStyle={{paddingVertical:16}}
//         renderItem={({item})=>(
//           <DayCard
//             day={item.day}
//             workout={item.workoutId}
//             done={progress?.completedDays.includes(item.day)}
//             onPress={()=>dispatch(completeDay({id,userId,day:item.day}))}
//           />
//         )}
//       />
//     </View>
//   );
// }



// // screens/ChallengeDetailScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';

// import {
//   fetchChallengeDetail,
//   startChallenge
// } from '../app/features/challengesSlice';
// import ProgressBar from '../components/ProgressBar';
// import DayCard from '../components/DayCard';

// export default function ChallengeDetailScreen({ route, navigation }) {
//   const { id } = route.params;
//   const dispatch = useDispatch();
//   const { detail, progress } = useSelector(s => s.challenges);
//   const userId = useSelector(s => s.user.profile?._id);

//   useEffect(() => {
//     if (userId) dispatch(fetchChallengeDetail({ id, userId }));
//   }, [id, userId]);

//   if (!detail) return <Text>Loading…</Text>;

//   const doneCount = progress?.completedDays.length || 0;

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
//         {detail.title}
//       </Text>
//       <Text style={{ marginVertical: 8 }}>
//         {detail.description}
//       </Text>
//       <ProgressBar progress={doneCount} total={detail.durationDays} />

//       {!progress && (
//         <TouchableOpacity
//           onPress={() => dispatch(startChallenge({ id, userId }))}
//           style={{
//             margin: 16,
//             padding: 12,
//             backgroundColor: '#4ADE80',
//             borderRadius: 8
//           }}
//         >
//           <Text style={{ textAlign: 'center', color: '#FFF' }}>
//             Start Challenge
//           </Text>
//         </TouchableOpacity>
//       )}

//       <FlatList
//         data={detail.workouts}
//         horizontal
//         keyExtractor={item => String(item.day)}
//         contentContainerStyle={{ paddingVertical: 16 }}
//         renderItem={({ item }) => (
//           <DayCard
//             day={item.day}
//             workout={item.workoutId}
//             done={progress?.completedDays.includes(item.day)}
//             onPress={() =>
//               navigation.navigate('DayDetail', {
//                 challengeId: id,
//                 day: item.day
//               })
//             }
//           />
//         )}
//       />
//     </View>
//   );
// }




// import React, { useEffect, useMemo } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';

// import {
//   fetchChallengeDetail,
//   startChallenge
// } from '../app/features/challengesSlice';
// import ProgressBar from '../components/ProgressBar';
// import DayCard from '../components/DayCard';

// export default function ChallengeDetailScreen({ route, navigation }) {
//   const { id } = route.params;
//   const dispatch = useDispatch();
//   const { detail, progress, loading } = useSelector(s => ({
//     detail: s.challenges.detail,
//     progress: s.challenges.progress,
//     loading: s.challenges.status === 'loading'
//   }));
//   const userId = useSelector(s => s.user.profile?._id);

//   useEffect(() => {
//     if (userId) dispatch(fetchChallengeDetail({ id, userId }));
//   }, [id, userId]);

//   // derive unique days array
//   const days = useMemo(() => {
//     if (!detail?.workouts) return [];
//     const set = new Set(detail.workouts.map(w => w.day));
//     return Array.from(set).sort((a, b) => a - b);
//   }, [detail]);

//   if (loading || !detail) {
//     return (
//       <SafeAreaView style={styles.center}>
//         <ActivityIndicator size="large" color="#4ADE80" />
//       </SafeAreaView>
//     );
//   }

//   const doneCount = progress?.completedDays.length || 0;

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>{detail.title}</Text>
//       <Text style={styles.desc}>{detail.description}</Text>

//       <ProgressBar progress={doneCount} total={detail.durationDays} />

//       {!progress && (
//         <TouchableOpacity
//           style={styles.startBtn}
//           onPress={() => dispatch(startChallenge({ id, userId }))}
//         >
//           <Text style={styles.startText}>Start Challenge</Text>
//         </TouchableOpacity>
//       )}

//       <FlatList
//         data={days}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={d => String(d)}
//         contentContainerStyle={styles.daysList}
//         renderItem={({ item }) => (
//           <DayCard
//             day={item}
//             done={progress?.completedDays.includes(item)}
//             onPress={() =>
//               navigation.navigate('DayDetail', {
//                 challengeId: id,
//                 day: item
//               })
//             }
//           />
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
//   desc: { fontSize: 14, color: '#555', marginBottom: 12 },
//   startBtn: {
//     backgroundColor: '#4ADE80',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//     marginVertical: 16
//   },
//   startText: { color: '#FFF', fontWeight: '600' },
//   daysList: { paddingVertical: 12 }
// });


// screens/ChallengeDetailScreen.js
import React, { useEffect, useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChallengeDetail, startChallenge } from '../app/features/challengesSlice';
import { colors } from '../theme/colors';
import Header from '../components/Header';
import DayCard from '../components/DayCard';
import ProgressBar from '../components/ProgressBar';

export default function ChallengeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const dispatch = useDispatch();
  const { detail, progress, status } = useSelector(s => s.challenges);
  const loading = status === 'loading';
  const userId = useSelector(s => s.user.profile?._id);

  useEffect(() => {
    if (userId) dispatch(fetchChallengeDetail({ id, userId }));
  }, [id, userId]);

  const days = useMemo(() => {
    if (!detail?.workouts) return [];
    return [...new Set(detail.workouts.map(w => w.day))].sort((a,b) => a-b);
  }, [detail]);

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  const doneCount = progress?.completedDays.length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Challenge Detail" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.description}>{detail.description}</Text>
        <ProgressBar
          progress={doneCount / detail.durationDays}
          barColor={colors.primary}
        />
        {!progress && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => dispatch(startChallenge({ id, userId }))}
          >
            <Text style={styles.startText}>Start Challenge</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.sectionTitle}>Days</Text>
        {days.map(day => (
          <DayCard
            key={day}
            day={day}
            done={progress?.completedDays.includes(day)}
            onPress={() =>
              navigation.navigate('DayDetail', { challengeId: id, day })
            }
            theme="dark"
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8 },
  description: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16
  },
  startText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 12 }
});
