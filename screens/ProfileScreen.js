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
import { Picker } from '@react-native-picker/picker';
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
        <ActivityIndicator size="large" color="#5a3eb9" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>My Profile</Text>

        <TouchableOpacity onPress={pickImage} activeOpacity={0.7} style={styles.imageWrapper}>
          <Image source={getProfileImageSource()} style={styles.avatar} />
          <View style={styles.cameraIconWrapper}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={profile.name}
            onChangeText={val => setProfile(prev => ({ ...prev, name: val }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={profile.age ? String(profile.age) : ''}
            onChangeText={val => setProfile(prev => ({ ...prev, age: val }))}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio (optional)"
            placeholderTextColor="#999"
            multiline
            value={profile.bio}
            onChangeText={val => setProfile(prev => ({ ...prev, bio: val }))}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Details</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Height (cm)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={profile.height ? String(profile.height) : ''}
              onChangeText={val => setProfile(prev => ({ ...prev, height: val }))}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Weight (kg)"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={profile.weight ? String(profile.weight) : ''}
              onChangeText={val => setProfile(prev => ({ ...prev, weight: val }))}
            />
          </View>

          <Text style={styles.label}>Goal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={profile.goal}
              onValueChange={val => setProfile(prev => ({ ...prev, goal: val }))}
              mode="dropdown"
              dropdownIconColor="#5a3eb9"
              style={styles.picker}
            >
              <Picker.Item label="Select Goal" value="" />
              {goalOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Activity Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={profile.activityLevel}
              onValueChange={val => setProfile(prev => ({ ...prev, activityLevel: val }))}
              mode="dropdown"
              dropdownIconColor="#5a3eb9"
              style={styles.picker}
            >
              <Picker.Item label="Select Activity Level" value="" />
              {activityLevelOptions.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          disabled={saving}
          style={styles.saveButtonWrapper}
        >
          <LinearGradient
            colors={['#5a3eb9', '#8257e5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Profile</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3c1361',
    marginBottom: 30,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 30,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#8257e5',
    backgroundColor: '#ddd',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5a3eb9',
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraIcon: {
    color: '#fff',
    fontSize: 18,
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4a2373',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b559f',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    marginTop: 6,
    height: 50,           // match the picker height
    justifyContent: 'center',  // vertically center the picker inside container
  },

  picker: {
    height: 55,           // increase height (default was 44)
    color: '#4a2373',
    paddingVertical: 8,   // add vertical padding for better text spacing
    textAlignVertical: 'center', // center text vertically on Android
  },

  saveButtonWrapper: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8257e5',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  saveButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
