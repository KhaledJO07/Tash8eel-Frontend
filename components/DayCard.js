// // components/DayCard.js
// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet } from 'react-native';
// import LottieView from 'lottie-react-native';

// export default function DayCard({ day, workout, done, onPress }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={[
//       styles.card,
//       done ? styles.done : styles.pending
//     ]}>
//       <LottieView
//         source={{ uri: workout.animationUrl }}
//         autoPlay
//         loop
//         style={styles.anim}
//       />
//       <Text style={styles.day}>Day {day}</Text>
//       <Text numberOfLines={1} style={styles.title}>{workout.name}</Text>
//       {done && <Text style={styles.check}>✔️</Text>}
//     </TouchableOpacity>
//   );
// }
// const styles = StyleSheet.create({
//   card:    { width:100, padding:8, margin:4, borderRadius:8, borderWidth:1 },
//   done:    { borderColor:'#4ADE80', backgroundColor:'#ECFDF5' },
//   pending: { borderColor:'#DDD',   backgroundColor:'#FFF' },
//   anim:    { width:60, height:60, alignSelf:'center', marginBottom:4 },
//   day:     { fontSize:10, fontWeight:'bold' },
//   title:   { fontSize:12 },
//   check:   { position:'absolute', top:4, right:4 }
// });
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function DayCard({ day, done, onPress }) {
  return (
    <TouchableOpacity style={[styles.card, done && styles.done]} onPress={onPress}>
      <Text style={styles.day}>Day {day}</Text>
      {done && <Text style={styles.check}>✔️</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 72,
    height: 72,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  done: {
    borderColor: '#4ADE80',
    backgroundColor: '#ECFDF5',
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    fontSize: 12,
  },
});
