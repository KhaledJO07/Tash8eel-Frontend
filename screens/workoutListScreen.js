import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { API_BASE_URL_JO } from '../config';

export default function WorkoutListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const category = route.params?.category;

  const { data: workouts } = useSelector(state => state.workouts);

  const filtered = workouts.filter(w => w.category === category);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} Workouts</Text>
      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('WorkoutDetail', { workout: item })}
          >
            <LottieView
              source={{ uri: `${API_BASE_URL_JO}/animations/${item.animationFile}` }}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9fb', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  lottie: { width: 150, height: 150 },
  name: { marginTop: 10, fontSize: 18, fontWeight: '600' },
});
