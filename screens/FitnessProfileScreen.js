import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert, // Ensure Alert is imported
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator, // Added for loading state on button
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_BASE_URL_JO } from '../config';

export default function FitnessProfileScreen({ navigation, route, setSignedIn, setToken }) {
    const { token } = route.params;

    const [form, setForm] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        goal: '',
        activityLevel: '',
    });
    const [saving, setSaving] = useState(false); // State for save button loading

    const goalOptions = [
        { label: 'Select Goal', value: '' }, // Added default empty option
        { label: 'Lose Weight', value: 'lose_weight' },
        { label: 'Build Muscle', value: 'build_muscle' },
        { label: 'Maintain Weight', value: 'maintain_weight' },
        { label: 'Increase Endurance', value: 'increase_endurance' },
    ];

    const activityLevelOptions = [
        { label: 'Select Activity Level', value: '' }, // Added default empty option
        { label: 'Sedentary', value: 'sedentary' },
        { label: 'Lightly Active', value: 'lightly_active' },
        { label: 'Moderately Active', value: 'moderately_active' },
        { label: 'Very Active', value: 'very_active' },
        { label: 'Extra Active', value: 'extra_active' },
    ];

    const handleSubmit = async () => {
        // Basic validation for required fields
        if (!form.height || !form.weight || !form.goal || !form.activityLevel) {
            return showCustomToast('Missing Information', 'Please fill out all required fields (Height, Weight, Goal, Activity Level).');
        }

        // Validate numeric fields
        const numericFields = ['age', 'height', 'weight'];
        for (const field of numericFields) {
            if (form[field] && isNaN(Number(form[field]))) {
                showCustomToast('Validation Error', `${field.charAt(0).toUpperCase() + field.slice(1)} must be a number.`);
                return;
            }
        }

        setSaving(true); // Start loading
        try {
            await axios.put(
                `${API_BASE_URL_JO}/users/profile`,
                {
                    name: form.name || '', // Ensure name is sent even if empty
                    age: form.age ? Number(form.age) : undefined, // Send as number or undefined if empty
                    height: Number(form.height),
                    weight: Number(form.weight),
                    goal: form.goal,
                    activityLevel: form.activityLevel,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showCustomToast('Success', 'Fitness profile completed and saved!');
            setSignedIn(true); // Mark user as signed in
            setToken(token); // Set the token (though it's already in route.params)
            // Optionally navigate to Home or another screen after completion
            // navigation.navigate('MainTabs');
        } catch (err) {
            console.error('Failed to save fitness profile:', err);
            const errorMessage = err?.response?.data?.message || 'Failed to save profile. Please try again.';
            showCustomToast('Error', errorMessage);
        } finally {
            setSaving(false); // End loading
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.rootContainer} // Changed to rootContainer for overall styling
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Complete Your Fitness Profile</Text>

                <View style={styles.card}>
                    {[
                        { label: 'Name', key: 'name', placeholder: 'Enter your name', keyboardType: 'default' },
                        { label: 'Age', key: 'age', placeholder: 'Enter your age', keyboardType: 'numeric' },
                        { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 175', keyboardType: 'numeric' },
                        { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 70', keyboardType: 'numeric' },
                    ].map(({ label, key, placeholder, keyboardType }) => (
                        <View key={key} style={styles.fieldContainer}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={placeholder}
                                value={form[key]}
                                keyboardType={keyboardType || 'default'}
                                onChangeText={(val) => setForm({ ...form, [key]: val })}
                                placeholderTextColor="#888" // Lighter placeholder for dark background
                            />
                        </View>
                    ))}

                    <Text style={styles.label}>Goal</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.goal}
                            onValueChange={(val) => setForm({ ...form, goal: val })}
                            dropdownIconColor="#B0B0B0" // Lighter icon color for dark background
                            style={styles.picker}
                            itemStyle={styles.pickerItem} // Style for iOS picker items
                        >
                            {goalOptions.map(option => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Activity Level</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={form.activityLevel}
                            onValueChange={(val) => setForm({ ...form, activityLevel: val })}
                            dropdownIconColor="#B0B0B0" // Lighter icon color for dark background
                            style={styles.picker}
                            itemStyle={styles.pickerItem} // Style for iOS picker items
                        >
                            {activityLevelOptions.map(option => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                        </Picker>
                    </View>

                    <TouchableOpacity onPress={handleSubmit} activeOpacity={0.9} disabled={saving}>
                        <LinearGradient
                            colors={['#5856D6', '#8A56D6']} // Consistent vibrant gradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }} // Changed end direction for a softer gradient
                            style={styles.button}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Save Profile</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    rootContainer: { // Renamed from 'container' to avoid conflict with scrollContainer
        flex: 1,
        backgroundColor: '#1C1C1E', // Dark background to match the app theme
    },
    scrollContainer: {
        flexGrow: 1, // Allows content to grow and scroll
        justifyContent: 'center', // Center content vertically if it doesn't fill screen
        padding: 24, // Consistent padding
        paddingBottom: 40, // Ensure space for keyboard/bottom navigation
    },
    header: {
        fontSize: 30, // Consistent header size
        fontWeight: '700', // Consistent header weight
        color: '#FFFFFF', // White text for dark background
        marginBottom: 30, // Consistent margin
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#3A3A3C', // Darker background for the form card
        borderRadius: 16, // Consistent border radius
        padding: 20, // Consistent padding
        shadowColor: '#000', // Add shadows for depth
        shadowOpacity: 0.3, // Increased shadow opacity for better depth on dark background
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    fieldContainer: {
        marginBottom: 14, // Consistent margin
    },
    label: {
        fontSize: 14,
        fontWeight: '500', // Consistent label weight
        color: '#B0B0B0', // Lighter gray for readability on dark background
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#2C2C2E', // Darker input background
        borderRadius: 12, // Consistent border radius
        paddingHorizontal: 14, // Consistent padding
        paddingVertical: 12,
        fontSize: 16,
        color: '#FFFFFF', // White text color for input
        height: 50, // Consistent input height
        borderWidth: 1, // Add border
        borderColor: '#555', // Darker border for dark theme
    },
    pickerContainer: {
        backgroundColor: '#2C2C2E', // Darker picker background
        borderRadius: 12, // Consistent border radius
        marginBottom: 14, // Consistent margin
        overflow: 'hidden', // Ensures borderRadius applies
        borderWidth: 1, // Add border
        borderColor: '#555', // Darker border for dark theme
    },
    picker: {
        height: 50,
        color: '#FFFFFF', // White text for picker
    },
    pickerItem: { // Style for Picker.Item (iOS only)
        color: '#FFFFFF',
        backgroundColor: '#2C2C2E', // Background for picker items on iOS
    },
    button: {
        marginTop: 20, // Adjusted margin top for consistency
        paddingVertical: 16, // Consistent padding
        borderRadius: 12, // Consistent border radius
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
