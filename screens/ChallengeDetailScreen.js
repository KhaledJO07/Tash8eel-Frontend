// screens/ChallengeDetailScreen.js
import React,{useEffect} from 'react';
import{View,Text,FlatList,TouchableOpacity}from'react-native';
import{useDispatch,useSelector}from'react-redux';
import{
  fetchChallengeDetail,
  startChallenge,
  completeDay
}from'../app/features/challengesSlice';
import ProgressBar from'../components/ProgressBar';
import DayCard from'../components/DayCard';

export default function ChallengeDetailScreen({route}){
  const{id}=route.params;
  const dispatch=useDispatch();
  const{detail,progress}=useSelector(s=>s.challenges);
//   const userId=useSelector(s=>s.auth.user.profile._id);
const userId = useSelector(state => state.user.profile?._id)

  useEffect(()=>{
    if(userId)dispatch(fetchChallengeDetail({id,userId}));
  },[id,userId]);
  if(!detail)return<Text>Loading…</Text>;

  const doneCount=progress?.completedDays.length||0;
  const days=detail.workouts;
  return(
    <View style={{flex:1,padding:16}}>
      <Text style={{fontSize:24,fontWeight:'bold'}}>{detail.title}</Text>
      <Text style={{marginVertical:8}}>{detail.description}</Text>
      <ProgressBar progress={doneCount} total={detail.durationDays}/>

      {!progress&&(
        <TouchableOpacity
          onPress={()=>dispatch(startChallenge({id,userId}))}
          style={{margin:16,padding:12,backgroundColor:'#4ADE80',borderRadius:8}}>
          <Text style={{textAlign:'center',color:'#FFF'}}>Start Challenge</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={days}
        horizontal
        keyExtractor={item=>String(item.day)}
        contentContainerStyle={{paddingVertical:16}}
        renderItem={({item})=>(
          <DayCard
            day={item.day}
            workout={item.workoutId}
            done={progress?.completedDays.includes(item.day)}
            onPress={()=>dispatch(completeDay({id,userId,day:item.day}))}
          />
        )}
      />
    </View>
  );
}