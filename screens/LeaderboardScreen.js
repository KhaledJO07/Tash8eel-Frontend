// LeaderboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

// Define a dark theme color palette to match the image
const colors = {
  background: '#1C1C1E',
  card: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#D1D1D1',
  highlight: '#007AFF', // A blue for ranks and accents
};

// Helper function to calculate the longest consecutive streak from an array of days
const calculateStreak = completedDays => {
  if (!completedDays || completedDays.length === 0) {
    return 0;
  }
  const sortedDays = [...new Set(completedDays)].sort((a, b) => a - b);
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    if (sortedDays[i] === sortedDays[i - 1] + 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }
  return maxStreak;
};

// Mock data fetching function to simulate an API call
const mockFetchLeaderboardData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockUsers = [
        { userId: 'u1', name: 'Polly Strong', email: 'g@fitness.gy97', avatarUrl: 'https://placehold.co/40x40/5856d6/ffffff?text=PS', completedDays: [1, 2, 3, 4, 5, 6, 7, 10, 11] },
        { userId: 'u2', name: 'Sarah L.', email: 'sarah.l@email.com', avatarUrl: 'https://placehold.co/40x40/8a56d6/ffffff?text=SL', completedDays: [1, 2, 3, 4, 5] },
        { userId: 'u3', name: 'Joel G.', email: 'joelg@email.com', avatarUrl: 'https://placehold.co/40x40/ff6b6b/ffffff?text=JG', completedDays: [1, 3, 4, 5, 6, 7, 8, 9] },
        { userId: 'u4', name: 'Bob Williams', email: 'bob@example.com', avatarUrl: 'https://placehold.co/40x40/2ecc71/ffffff?text=BW', completedDays: [1, 2, 3] },
        { userId: 'u5', name: 'Eva Davis', email: 'eva@example.com', avatarUrl: 'https://placehold.co/40x40/f1c40f/ffffff?text=ED', completedDays: [10, 11, 12, 13] },
      ];
      resolve(mockUsers);
    }, 1500);
  });
};

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All time');

  useEffect(() => {
    setLoading(true);
    // Replace this with your actual API call that fetches user data
    // with a 'completedDays' array for streak calculation.
    mockFetchLeaderboardData()
      .then(data => {
        // Calculate streak for each user
        const usersWithStreaks = data.map(user => ({
          ...user,
          streak: calculateStreak(user.completedDays),
        }));

        // Sort the users by their streak in descending order
        const sortedLeaderboard = usersWithStreaks.sort((a, b) => b.streak - a.streak);

        setLeaderboard(sortedLeaderboard);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch leaderboard:", error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rankText}>#{index + 1}</Text>
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.name.substring(0, 1).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <Text style={styles.score}>{item.streak}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>

      {/* Tab bar for time filters */}
      <View style={styles.tabBar}>
        {['All time', 'Today', 'Week', 'Month'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.highlight} style={styles.loader} />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={item => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.highlight,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
    color: colors.highlight,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.card,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  loader: {
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 20,
  },
});
