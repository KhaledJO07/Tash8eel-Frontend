import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
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
            <Text style={styles.title}>Timer</Text>
            <Text style={styles.time}>{formatTime(milliseconds)}</Text>

            <View style={styles.buttonsRow}>
                <TouchableOpacity
                    onPress={handleStartPause}
                    style={[styles.buttonWrapper, isRunning && styles.runningButton]}
                    disabled={false}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={isRunning ? ['#ef4444', '#f97316'] : ['#22c55e', '#3b82f6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleLap}
                    style={[styles.buttonWrapper, !isRunning && styles.disabledButton]}
                    disabled={!isRunning}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#6b7280', '#9ca3af']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Lap</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleReset}
                    style={[styles.buttonWrapper, styles.resetButtonWrapper]}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#9ca3af', '#6b7280']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Reset</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {laps.length > 0 && (
                <View style={styles.lapsContainer}>
                    <Text style={styles.lapsTitle}>Laps</Text>
                    <FlatList
                        data={laps}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.lapRow}>
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
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    time: {
        fontSize: 56,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        color: '#111',
        letterSpacing: 2,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 6,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
    },
    runningButton: {
        elevation: 6,
        shadowOpacity: 0.25,
    },
    disabledButton: {
        opacity: 0.6,
    },
    resetButtonWrapper: {
        flex: 1.2,
        marginHorizontal: 6,
    },
    button: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 0.6,
    },
    lapsContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    lapsTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        color: '#444',
    },
    lapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    lapLabel: {
        fontSize: 16,
        color: '#555',
    },
    lapTime: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
});
