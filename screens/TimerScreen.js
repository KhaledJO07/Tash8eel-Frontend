import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert, // <--- Add Alert here
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function TimerScreen() {
    const [milliseconds, setMilliseconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setMilliseconds((prev) => prev + 10);
            }, 10);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const handleStartPause = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        Alert.alert(
            'Reset Timer',
            'Are you sure you want to reset the timer? This will clear all laps.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        setIsRunning(false);
                        setMilliseconds(0);
                        setLaps([]);
                    },
                },
            ]
        );
    };

    const handleLap = () => {
        if (!isRunning) return;
        setLaps((prevLaps) => [milliseconds, ...prevLaps]);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const msPart = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
        return `${minutes}:${seconds}.${msPart}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Workout Timer</Text>

            <View style={styles.timerBox}>
                <Text style={styles.timeText}>{formatTime(milliseconds)}</Text>
            </View>

            <View style={styles.buttonsRow}>
                <TouchableOpacity onPress={handleStartPause} activeOpacity={0.9}>
                    <LinearGradient
                        // Adjusted colors for dark theme consistency
                        colors={isRunning ? ['#FF6B6B', '#FF8E53'] : ['#5856D6', '#8A56D6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLap}
                    disabled={!isRunning}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        // Consistent accent colors for Lap button
                        colors={['#5856D6', '#8A56D6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.gradientButton, !isRunning && styles.disabled]}
                    >
                        <Text style={styles.buttonText}>Lap</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleReset} activeOpacity={0.9}>
                    <LinearGradient
                        // Darker, neutral colors for Reset button
                        colors={['#6B7280', '#4B5563']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Reset</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {laps.length > 0 && (
                <View style={styles.lapsSection}>
                    <Text style={styles.lapsTitle}>Laps</Text>
                    <FlatList
                        data={laps}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.lapItem}>
                                <Text style={styles.lapLabel}>Lap {laps.length - index}</Text>
                                <Text style={styles.lapTime}>{formatTime(item)}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#1C1C1E', // Dark background to match the app theme
    },
    header: {
        fontSize: 30, // Consistent header size
        fontWeight: '700', // Consistent header weight
        textAlign: 'center',
        marginBottom: 30, // Consistent margin
        color: '#FFFFFF', // White text for dark background
    },
    timerBox: {
        backgroundColor: '#3A3A3C', // Darker background for the timer box
        borderRadius: 16, // Consistent border radius
        paddingVertical: 40,
        marginHorizontal: 0, // Removed horizontal margin to use screen padding
        marginBottom: 30,
        alignItems: 'center',
        shadowColor: '#000', // Add shadows for depth
        shadowOpacity: 0.3, // Increased shadow opacity
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12, // Consistent shadow radius
        elevation: 8,
    },
    timeText: {
        fontSize: 52,
        fontWeight: '600',
        color: '#FFFFFF', // White text for dark background
        letterSpacing: 2,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    gradientButton: {
        borderRadius: 12, // Consistent border radius for buttons
        paddingVertical: 16, // Consistent padding for buttons
        paddingHorizontal: 24,
        marginHorizontal: 5,
        minWidth: 90,
        alignItems: 'center',
        shadowColor: '#000', // Add shadows for depth
        shadowOpacity: 0.3, // Increased shadow opacity
        shadowRadius: 8, // Consistent shadow radius
        shadowOffset: { width: 0, height: 4 },
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.5,
    },
    lapsSection: {
        flex: 1,
        marginTop: 10,
    },
    lapsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
        color: '#B0B0B0', // Lighter gray for readability on dark background
    },
    lapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#3A3A3C', // Darker background for lap items
        padding: 14,
        marginBottom: 8,
        borderRadius: 12, // Consistent border radius
        shadowColor: '#000', // Add shadows for depth
        shadowOpacity: 0.15, // Adjusted shadow opacity
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    lapLabel: {
        fontSize: 16,
        color: '#B0B0B0', // Lighter gray for readability on dark background
    },
    lapTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF', // White text for dark background
    },
});
