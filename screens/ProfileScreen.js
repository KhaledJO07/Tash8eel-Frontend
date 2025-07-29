import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated, // Import Animated for toast animation
} from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { API_BASE_URL_JO } from '../config'; // Assuming this path is correct

// --- Toast Component (Reused from SignUpScreen for consistency) ---
const Toast = ({ message, isVisible, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000), // Show for 2 seconds
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide(); // Call onHide after the animation completes
      });
    }
  }, [isVisible, fadeAnim, onHide]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};
// --- End Toast Component ---


export default function ProfileScreen({ route }) {
  const { token } = route.params;

  // State for user profile data
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: '',
    avatarUrl: '', // URL to the current avatar image
    height: '',
    weight: '',
    goal: '',
    activityLevel: '',
  });

  // State for newly selected image URI (before upload)
  const [imageUri, setImageUri] = useState(null);

  // Loading states for data fetching and saving
  const [loading, setLoading] = useState(true); // Set true initially to load profile on mount
  const [saving, setSaving] = useState(false);

  // State for toast notifications
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Helper function to show custom toast messages
  const showCustomToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Callback to hide the toast
  const hideCustomToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  // Options for fitness goals dropdown
  const goalOptions = [
    { label: 'Select Goal', value: '' },
    { label: 'Lose Weight', value: 'lose_weight' },
    { label: 'Build Muscle', value: 'build_muscle' },
    { label: 'Maintain Weight', value: 'maintain_weight' },
    { label: 'Increase Endurance', value: 'increase_endurance' },
  ];

  // Options for activity level dropdown
  const activityLevelOptions = [
    { label: 'Select Activity Level', value: '' },
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
    { label: 'Extra Active', value: 'extra_active' },
  ];

  // Effect to fetch user profile data on component mount or token change
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL_JO}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Set profile state, ensuring numeric values are converted to strings for TextInputs
        setProfile({
          name: res.data.name || '',
          age: res.data.age ? String(res.data.age) : '',
          bio: res.data.bio || '',
          avatarUrl: res.data.avatarUrl || '',
          height: res.data.height ? String(res.data.height) : '',
          weight: res.data.weight ? String(res.data.weight) : '',
          goal: res.data.goal || '',
          activityLevel: res.data.activityLevel || '',
        });
      } catch (error) {
        console.error('Failed to load profile:', error.response?.data || error.message);
        showCustomToast('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]); // Re-fetch if token changes

  // Function to handle image selection from library
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorCode, response.errorMessage);
          if (response.errorCode === 'permission') {
            showCustomToast('Permission Denied: Please grant photo library access to change your avatar.');
          } else {
            showCustomToast(`Image picker error: ${response.errorMessage}`);
          }
        } else if (response.assets && response.assets.length > 0) {
          // Set the URI of the selected image
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  // Function to handle saving the profile
  const handleSave = async () => {
    // Input validation before sending to API
    const numericFields = ['age', 'height', 'weight'];
    for (const field of numericFields) {
      if (profile[field] && isNaN(Number(profile[field]))) {
        showCustomToast(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a valid number.`);
        return;
      }
    }

    setSaving(true); // Start saving indicator
    try {
      const formData = new FormData();

      // Append all profile fields to FormData, converting numeric strings back to numbers
      // Exclude 'name' from here as it's no longer an input, but still part of profile state
      Object.entries(profile).forEach(([key, val]) => {
        if (numericFields.includes(key) && val !== '') {
          formData.append(key, Number(val)); // Convert back to number for API
        } else if (key !== 'avatarUrl') { // Don't send avatarUrl directly, it's handled by profileImage
          formData.append(key, val || ''); // Ensure empty strings are sent for empty fields
        }
      });

      // Append the new profile image if selected
      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`; // Default to jpeg if type not found

        formData.append('profileImage', {
          uri: imageUri,
          name: filename,
          type,
        });
      }

      // Send PUT request to update profile
      const response = await axios.put(`${API_BASE_URL_JO}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      });

      // Update local profile state with the response data
      showCustomToast('Profile updated successfully!');
      setProfile({
        name: response.data.user.name || '',
        age: response.data.user.age ? String(response.data.user.age) : '',
        bio: response.data.user.bio || '',
        avatarUrl: response.data.user.avatarUrl || '',
        height: response.data.user.height ? String(response.data.user.height) : '',
        weight: response.data.user.weight ? String(response.data.user.weight) : '',
        goal: response.data.user.goal || '',
        activityLevel: response.data.user.activityLevel || '',
      });
      setImageUri(null); // Clear temporary image URI after successful upload
    } catch (error) {
      console.error('Failed to update profile:', error.response?.data || error.message);
      const errorMessage = error?.response?.data?.message || 'Failed to update profile. Please try again.';
      showCustomToast(errorMessage);
    } finally {
      setSaving(false); // End saving indicator
    }
  };

  // Determines the source for the profile image
  const getProfileImageSource = () => {
    if (imageUri) {
      return { uri: imageUri }; // Use newly picked image first
    }
    if (profile.avatarUrl) {
      // Append a timestamp to bust cache and ensure latest image is loaded from server
      return { uri: `${API_BASE_URL_JO}${profile.avatarUrl}?t=${Date.now()}` };
    }
    // Fallback to a local default image if no avatarUrl or new image is set
    // Ensure this path is correct relative to your project structure
    return require('../assets/images/default-user.png');
  };

  // Show a full-screen loading indicator while fetching initial profile data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5856D6" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // Prevents keyboard from dismissing on tap outside input
      >
        <Text style={styles.header}>Profile</Text>

        <View style={styles.profileHeaderSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper} activeOpacity={0.8}>
            <Image source={getProfileImageSource()} style={styles.avatar} />
            <View style={styles.cameraIconContainer}>
              <Text style={styles.cameraIcon}>📸</Text>
            </View>
          </TouchableOpacity>
          {/* Display Name as Text below the avatar */}
          <Text style={styles.profileName}>{profile.name || 'Your Name'}</Text>
        </View>


        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {/* Removed Name Input */}

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            placeholderTextColor="#888"
            value={profile.age}
            keyboardType="numeric"
            onChangeText={(val) => setProfile({ ...profile, age: val })}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself"
            placeholderTextColor="#888"
            value={profile.bio}
            multiline
            onChangeText={(val) => setProfile({ ...profile, bio: val })}
          />
        </View>

        {/* Fitness Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Details</Text>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 175"
            placeholderTextColor="#888"
            value={profile.height}
            keyboardType="numeric"
            onChangeText={(val) => setProfile({ ...profile, height: val })}
          />

          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 70"
            placeholderTextColor="#888"
            value={profile.weight}
            keyboardType="numeric"
            onChangeText={(val) => setProfile({ ...profile, weight: val })}
          />

          <Text style={styles.label}>Goal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={profile.goal}
              onValueChange={(val) => setProfile({ ...profile, goal: val })}
              style={styles.picker}
              itemStyle={styles.pickerItem} // Apply style for iOS picker items
              mode="dropdown" // Ensures consistency in dropdown appearance
            >
              {goalOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={profile.activityLevel}
              onValueChange={(val) => setProfile({ ...profile, activityLevel: val })}
              style={styles.picker}
              itemStyle={styles.pickerItem} // Apply style for iOS picker items
              mode="dropdown"
            >
              {activityLevelOptions.map((opt) => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={styles.buttonWrapper} disabled={saving}>
          <LinearGradient
            colors={["#5856D6", "#8A56D6"]} // Consistent vibrant gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Profile</Text>}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Render the Toast component */}
      <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
  },
  scrollContainer: {
    flexGrow: 1, // Allows content to grow and scroll
    padding: 24, // Consistent padding
    paddingBottom: 60, // Increased padding for bottom space, considering potential tab bar
  },
  header: {
    fontSize: 30, // Consistent header size
    fontWeight: '700', // Consistent header weight
    color: '#FFFFFF', // White text for dark background
    marginBottom: 30, // Consistent margin
    textAlign: 'center',
  },
  profileHeaderSection: {
    alignItems: 'center', // Center items horizontally
    marginBottom: 30,
  },
  imageWrapper: {
    marginBottom: 10, // Space between avatar and name
    position: 'relative', // For positioning the camera icon
  },
  avatar: {
    width: 120, // Slightly larger avatar
    height: 120,
    borderRadius: 60, // Half of width/height for perfect circle
    borderWidth: 3, // Slightly thicker border
    borderColor: '#5856D6', // Consistent accent color
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5856D6', // Accent color for the camera icon background
    borderRadius: 20, // Rounded background for the icon
    padding: 8,
    borderWidth: 2,
    borderColor: '#1C1C1E', // Border to separate from avatar
  },
  cameraIcon: {
    fontSize: 18,
    color: '#FFFFFF', // White icon
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF', // White text for name
    marginTop: 5, // Space between avatar and name
  },
  section: {
    backgroundColor: '#3A3A3C', // Darker background for sections/cards
    borderRadius: 16, // Consistent border radius
    padding: 20, // Consistent padding
    marginBottom: 20,
    shadowColor: '#000', // Add shadows for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4B4B4B', // Subtle separator
    paddingBottom: 10,
  },
  label: {
    color: '#B0B0B0', // Lighter gray for readability on dark background
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500', // Slightly bolder label
  },
  input: {
    backgroundColor: '#2C2C2E', // Darker input background
    color: '#FFFFFF', // White text color for input
    borderRadius: 12, // Consistent border radius
    padding: 14, // Consistent padding
    marginBottom: 14, // Consistent margin
    borderWidth: 1,
    borderColor: '#555', // Darker border for dark theme
    height: 50, // Consistent input height
  },
  textArea: {
    height: 100, // Slightly taller text area
    textAlignVertical: 'top',
  },
  pickerContainer: { // Wrapper for Picker to apply background and border radius
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginBottom: 14, // Consistent margin
    borderWidth: 1,
    borderColor: '#555',
    overflow: 'hidden', // Ensures borderRadius applies to content
  },
  picker: {
    color: '#FFFFFF', // White text for picker
    // backgroundColor is applied to pickerContainer
  },
  pickerItem: { // Style for Picker.Item (iOS only)
    color: '#FFFFFF',
    backgroundColor: '#2C2C2E', // Background for picker items on iOS
  },
  buttonWrapper: { // Consistent naming
    marginTop: 20, // Adjusted margin top
    borderRadius: 12, // Consistent border radius
    overflow: 'hidden',
  },
  button: { // Consistent naming
    paddingVertical: 16, // Consistent padding
    alignItems: 'center',
    borderRadius: 12, // Consistent border radius
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E', // Consistent dark background
  },
  loadingText: {
    color: '#B0B0B0',
    marginTop: 10,
    fontSize: 16,
  },
  // Styles for the Toast component (copied from SignUpScreen)
  toastContainer: {
    position: 'absolute',
    bottom: 50, // Position above the bottom of the screen
    left: 24,
    right: 24,
    backgroundColor: '#333', // Dark background for toast
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure it's above other content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});
