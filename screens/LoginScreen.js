import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert, // Import Alert for better user feedback
} from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import { API_BASE_URL_JO } from '../config';

export default function LoginScreen({ navigation, ...others }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL_JO}/users/login`, {
        email,
        password,
      });

      const token = res.data.token;
      if (token) {
        others.setSignedIn(true);
        others.setToken(token);
        // IMPORTANT: Do not use alert() in production apps.
        // Use a custom modal or toast notification for user feedback.
        showCustomToast('Success', 'Login successful! Welcome back.');
      } else {
        showCustomToast('Login Failed', 'Token not received. Please try again.');
      }
    } catch (err) {
      // Improved error handling to show more specific messages if available
      const errorMessage = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      showCustomToast('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your fitness journey</Text>

      <View style={styles.formWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888" // Lighter placeholder for dark background
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888" // Lighter placeholder for dark background
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={styles.buttonWrapper} 
          activeOpacity={0.9} // Adjusted opacity
        >
          <LinearGradient
            colors={["#5856D6", "#8A56D6"]} // Consistent gradient colors from SignUpScreen
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button} // Changed to button for consistent styling
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={styles.switchText}>
        Don't have an account?{' '}
        <Text
          onPress={() => navigation.navigate('SignUp')}
          style={styles.linkText}
        >
          Sign up
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF', // White text for dark background
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0', // Lighter gray for readability on dark background
    textAlign: 'center',
    marginBottom: 30,
  },
  formWrapper: { // Added formWrapper to match SignUpScreen's card style
    backgroundColor: '#3A3A3C', // Darker background for the form card
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Increased shadow opacity for better depth on dark background
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20, // Add some space below the form card
  },
  input: {
    backgroundColor: '#2C2C2E', // Darker input background
    color: '#FFFFFF', // White text color for input
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 14, // Adjusted margin to match SignUpScreen
    borderWidth: 1,
    borderColor: '#555', // Darker border for dark theme
  },
  buttonWrapper: { // Renamed from loginButton for consistency
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: { // Renamed from loginButton for consistency
    paddingVertical: 16, // Adjusted padding to match SignUpScreen
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    color: '#B0B0B0', // Lighter gray for readability on dark background
    marginTop: 20,
    fontSize: 14,
  },
  linkText: {
    color: '#5856D6', // A vibrant blue/purple to match button accents
    fontWeight: '600',
  },
});
