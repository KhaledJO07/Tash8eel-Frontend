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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker'; // <-- import picker here
import { API_BASE_URL_JO } from '../config';

export default function ProfileScreen({ token }) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    avatarUrl: '',
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
  });
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Sample options for Goal and Activity Level
  const goalOptions = [
    { label: 'Lose Weight', value: 'lose_weight' },
    { label: 'Build Muscle', value: 'build_muscle' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
    { label: 'Increase Endurance', value: 'increase_endurance' },
  ];

  const activityLevelOptions = [
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
    { label: 'Extra Active', value: 'extra_active' },
  ];

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL_JO}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setProfile(res.data);
      })
      .catch(() => Alert.alert('Error', 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [token]);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.7,
      },
      response => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets[0];
        setImageUri(asset.uri);
      }
    );
  };

  const handleSave = async () => {
    if (
      (profile.age && isNaN(Number(profile.age))) ||
      (profile.height && isNaN(Number(profile.height))) ||
      (profile.weight && isNaN(Number(profile.weight)))
    ) {
      Alert.alert('Validation Error', 'Age, Height, and Weight must be numeric');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name || '');
      formData.append('age', profile.age || '');
      formData.append('bio', profile.bio || '');
      formData.append('height', profile.height || '');
      formData.append('weight', profile.weight || '');
      formData.append('goal', profile.goal || '');
      formData.append('activityLevel', profile.activityLevel || '');

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
      setImageUri(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f4f8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

        {/* Basic inputs */}
        {['name', 'age', 'bio', 'height', 'weight'].map(key => (
          <View key={key} style={{ width: '100%' }}>
            <Text style={styles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}{key === 'bio' ? ' (optional)' : ''}
            </Text>
            <TextInput
              style={[
                styles.input,
                key === 'bio' && { height: 100 },
              ]}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              placeholderTextColor="#888"
              value={profile[key] ? String(profile[key]) : ''}
              onChangeText={(val) => setProfile(prev => ({ ...prev, [key]: val }))}
              keyboardType={
                ['age', 'height', 'weight'].includes(key) ? 'numeric' : 'default'
              }
              multiline={key === 'bio'}
              textAlignVertical={key === 'bio' ? 'top' : 'auto'}
            />
          </View>
        ))}

        {/* Goal picker */}
        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={styles.label}>Goal</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={profile.goal}
              onValueChange={(itemValue) =>
                setProfile(prev => ({ ...prev, goal: itemValue }))
              }
              mode="dropdown"
            >
              <Picker.Item label="Select Goal..." value="" />
              {goalOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Activity Level picker */}
        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={profile.activityLevel}
              onValueChange={(itemValue) =>
                setProfile(prev => ({ ...prev, activityLevel: itemValue }))
              }
              mode="dropdown"
            >
              <Picker.Item label="Select Activity Level..." value="" />
              {activityLevelOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          style={{ borderRadius: 16, overflow: 'hidden', marginTop: 8, width: '100%' }}
          disabled={saving}
        >
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Profile</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#4b2e83',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    backgroundColor: '#eee',
    shadowColor: '#4b2e83',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginBottom: 24,
    shadowColor: '#6f42c1',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    fontWeight: '700',
    color: '#4b2e83',
    fontSize: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 7,
  },
});
