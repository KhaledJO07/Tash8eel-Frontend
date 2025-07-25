import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL_JO } from '../config';

export default function ProfileScreen({ token }) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    avatarUrl: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL_JO}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to load profile');
        setLoading(false);
      });
  }, [token]);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets[0];
        setImageUri(asset.uri);
      }
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('age', profile.age);
      formData.append('bio', profile.bio);

      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('profileImage', {
          uri: imageUri,
          name: filename,
          type,
        });
      }

      await axios.put(`${API_BASE_URL_JO}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getProfileImageSource = () => {
    if (imageUri) return { uri: imageUri };
    if (profile.avatarUrl) return { uri: `${API_BASE_URL_JO}${profile.avatarUrl}` };
    return require('../assets/images/default-user.png');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6f42c1" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Image source={getProfileImageSource()} style={styles.profileImage} />
      
      <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
        <LinearGradient
          colors={['#6f42c1', '#a16de6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Change Photo</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={profile.name}
        onChangeText={(val) => setProfile({ ...profile, name: val })}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={profile.age ? String(profile.age) : ''}
        onChangeText={(val) => setProfile({ ...profile, age: val })}
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Bio"
        placeholderTextColor="#888"
        multiline
        value={profile.bio}
        onChangeText={(val) => setProfile({ ...profile, bio: val })}
      />

      <TouchableOpacity
        onPress={handleSave}
        activeOpacity={0.8}
        style={{ borderRadius: 12, overflow: 'hidden', marginTop: 10, width: '100%' }}
      >
        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveButton}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Profile</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4b2e83', // purple
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 12,
    backgroundColor: '#eee',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 6,
    fontWeight: '600',
    color: '#4b2e83',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    color: '#000', // text color to avoid white on white
  },
  saveButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
});
