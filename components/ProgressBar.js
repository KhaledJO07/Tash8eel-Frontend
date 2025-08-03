// // components/ProgressBar.js
// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// export default function ProgressBar({ progress, total }) {
//   return (
//     <View style={styles.outer}>
//       <View style={[styles.inner, { flex: progress / total }]} />
//       <View style={[styles.innerEmpty, { flex: 1 - (progress / total) }]} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   outer: { flexDirection: 'row', height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
//   inner: { backgroundColor: '#4ADE80' },
//   innerEmpty: { backgroundColor: '#ddd' }
// });
// components/ProgressBar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress, total }) {
  return (
    <View style={styles.outer}>
      <View style={[styles.inner, { flex: progress/total }]} />
      <View style={[styles.placeholder, { flex: 1 - progress/total }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  outer: { flexDirection:'row', height:8, backgroundColor:'#eee', borderRadius:4, overflow:'hidden' },
  inner:      { backgroundColor:'#4ADE80' },
  placeholder:{ backgroundColor:'#ddd' }
});