import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Animated, // Import Animated for toast animation
} from 'react-native';
import { Formik } from 'formik'; // Corrected import: 'Formik' should be destructured from 'formik'
import * as Yup from 'yup';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { API_BASE_URL_JO } from '../config';

// Simple Toast component
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
        // Only call onHide if the toast is meant to hide after its animation sequence
        // This prevents immediate re-triggering if isVisible changes while animating
        onHide();
      });
    }
  }, [isVisible, fadeAnim, onHide]); // Dependencies for useEffect

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

export default function SignUpScreen({ navigation }) {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Function to show toast message
  const showCustomToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Callback for when toast hides
  const hideCustomToast = () => {
    setShowToast(false);
    setToastMessage('');
  };

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${API_BASE_URL_JO}/users/signup`, {
        email: values.email,
        password: values.password,
      });

      if (res.status === 201) {
        const loginRes = await axios.post(`${API_BASE_URL_JO}/users/login`, {
          email: values.email,
          password: values.password,
        });
        const token = loginRes.data.token;

        if (token) {
          showCustomToast('Signup successful! Redirecting to Fitness Profile.');
          // Delay navigation slightly to allow toast to be seen
          setTimeout(() => {
            navigation.navigate('FitnessProfile', { token });
          }, 2500); // 2.5 seconds (toast duration + a bit)
        } else {
          showCustomToast('Signup Error: Login failed after signup (no token).');
        }
      } else {
        showCustomToast('Signup Failed: An unexpected error occurred.');
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Signup failed. Please try again.';
      showCustomToast(`Signup Error: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Create Your Account</Text>

      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.formWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#888" // Lighter placeholder for dark background
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#888" // Lighter placeholder for dark background
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              placeholderTextColor="#888" // Lighter placeholder for dark background
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={styles.buttonWrapper}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#5856D6", "#8A56D6"]} // Consistent vibrant gradient colors
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <Text style={styles.switchText}>
        Already have an account?
        <Text onPress={() => navigation.goBack()} style={styles.linkText}> Login</Text>
      </Text>

      {/* Render the Toast component */}
      <Toast message={toastMessage} isVisible={showToast} onHide={hideCustomToast} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1C1C1E', // Dark background to match the app theme
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#FFFFFF', // White text for dark background
  },
  formWrapper: {
    backgroundColor: '#3A3A3C', // Darker background for the form card
    borderRadius: 16, // Consistent border radius
    padding: 20, // Consistent padding
    shadowColor: '#000', // Add shadows for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Increased shadow opacity for better depth on dark background
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    height: 50,
    borderColor: '#555', // Darker border for dark theme
    borderWidth: 1,
    borderRadius: 12, // Consistent border radius
    paddingHorizontal: 14,
    marginBottom: 14, // Consistent margin
    backgroundColor: '#2C2C2E', // Darker input background
    color: '#FFFFFF', // White text color for input
  },
  error: {
    color: '#FF6B6B', // A slightly softer red for errors on dark background
    fontSize: 13,
    marginBottom: 10,
  },
  buttonWrapper: {
    marginTop: 10,
    borderRadius: 12, // Consistent border radius
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16, // Consistent padding
    alignItems: 'center',
    borderRadius: 12, // Consistent border radius
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#B0B0B0', // Lighter gray for readability on dark background
  },
  linkText: {
    color: '#5856D6', // A vibrant blue/purple to match button accents
    fontWeight: '600',
  },
  // Styles for the Toast component
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
