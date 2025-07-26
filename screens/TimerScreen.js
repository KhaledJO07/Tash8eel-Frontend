import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function TimerScreen() {
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setMilliseconds(prev => prev + 10);
            }, 10);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const handleStartPause = () => {
        setIsRunning(prev => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setMilliseconds(0);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const msPart = String(Math.floor((ms % 1000) / 10)).padStart(2, '0'); // show 2-digit ms
        return `${minutes}:${seconds}:${msPart}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Timer</Text>
            <Text style={styles.time}>{formatTime(milliseconds)}</Text>

            <TouchableOpacity onPress={handleStartPause} style={styles.buttonWrapper}>
                <LinearGradient
                    colors={['#22c55e', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleReset} style={styles.buttonWrapper}>
                <LinearGradient
                    colors={['#ef4444', '#f97316']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Reset</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    time: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '#111',
    },
    buttonWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    button: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
    },
});
