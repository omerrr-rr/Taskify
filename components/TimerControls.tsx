import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface TimerControlsProps {
  onSetTimer: (minutes: number) => void;
  currentTime: number;
}

export function TimerControls({ onSetTimer, currentTime }: TimerControlsProps) {
  const presets = [
    { label: '15m', minutes: 15 },
    { label: '25m', minutes: 25 },
    { label: '45m', minutes: 45 },
    { label: '60m', minutes: 60 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Timer</Text>
      <View style={styles.presets}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.minutes}
            style={[
              styles.presetButton,
              currentTime === preset.minutes * 60 && styles.activePreset
            ]}
            onPress={() => onSetTimer(preset.minutes)}
          >
            <Text style={[
              styles.presetText,
              currentTime === preset.minutes * 60 && styles.activePresetText
            ]}>
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  activePreset: {
    backgroundColor: '#6366F1',
  },
  presetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activePresetText: {
    color: '#FFFFFF',
  },
});