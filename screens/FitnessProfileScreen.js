// screens/FitnessProfileScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    TouchableOpacity,
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


    const handleSubmit = async () => {
        if (!form.height || !form.weight || !form.goal || !form.activityLevel) {
            return Alert.alert('Missing Info', 'Please fill out all fields.');
        }

        try {
            await axios.put(
                `${API_BASE_URL_JO}/users/profile`,
                {
                    name: form.name,
                    age: Number(form.age),
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


            Alert.alert('Success', 'Profile completed!');
            setSignedIn(true);     // ✅ fix
            setToken(token);       // ✅ fix
        } catch (err) {
            Alert.alert('Error', 'Failed to save profile');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Complete Fitness Profile</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(val) => setForm({ ...form, name: val })}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
                style={styles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={form.age}
                onChangeText={(val) => setForm({ ...form, age: val })}
            />

            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.height}
                onChangeText={(val) => setForm({ ...form, height: val })}
            />

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={form.weight}
                onChangeText={(val) => setForm({ ...form, weight: val })}
            />

            <Text style={styles.label}>Goal</Text>
            <Picker
                selectedValue={form.goal}
                style={styles.input}
                onValueChange={(val) => setForm({ ...form, goal: val })}
            >
                <Picker.Item label="Select goal" value="" />
                <Picker.Item label="Lose Weight" value="Lose weight" />
                <Picker.Item label="Gain Muscle" value="Gain muscle" />
                <Picker.Item label="Maintain Fitness" value="Maintain fitness" />
            </Picker>

            <Text style={styles.label}>Activity Level</Text>
            <Picker
                selectedValue={form.activityLevel}
                style={styles.input}
                onValueChange={(val) => setForm({ ...form, activityLevel: val })}
            >
                <Picker.Item label="Select level" value="" />
                <Picker.Item label="Sedentary" value="Sedentary" />
                <Picker.Item label="Lightly Active" value="Lightly Active" />
                <Picker.Item label="Moderately Active" value="Moderately Active" />
                <Picker.Item label="Very Active" value="Very Active" />
            </Picker>

            <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} style={styles.buttonWrapper}>
                <LinearGradient
                    colors={['#6f42c1', '#a16de6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Save Profile</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#f0f4f8',
        flex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4b2e83',
        alignSelf: 'center',
    },
    label: {
        fontWeight: '600',
        color: '#4b2e83',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },
    buttonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 24,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
