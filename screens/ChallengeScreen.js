// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// export default function HomeScreen() {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Challenges</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     title: { fontSize: 28, fontWeight: 'bold' },
// });

// screens/ChallengeScreen.js
import React,{useEffect} from 'react';
import{FlatList,TouchableOpacity,Text}from'react-native';
import{useDispatch,useSelector}from'react-redux';
import{fetchChallenges}from'../app/features/challengesSlice';

export default function ChallengesListScreen({navigation}){
  const dispatch=useDispatch();
  const list=useSelector(s=>s.challenges.list);
  useEffect(()=>{dispatch(fetchChallenges());},[]);
  return(
    <FlatList
      data={list}
      keyExtractor={i=>i._id}
      contentContainerStyle={{padding:16}}
      renderItem={({item})=>(
        <TouchableOpacity
          onPress={()=>navigation.navigate('ChallengeDetail',{id:item._id})}
          style={{padding:16,borderBottomWidth:1,borderColor:'#EEE'}}>
          <Text style={{fontSize:18,fontWeight:'bold'}}>{item.title}</Text>
          <Text style={{color:'#666'}}>{item.durationDays} days</Text>
        </TouchableOpacity>
      )}
    />
  );
}