// app/ai-schedule.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function AIScheduleScreen() {
  const router = useRouter();
  const { option1, option2, fixedTasksInfo } = useLocalSearchParams();

  const handleSelect = (option: string) => {
    console.log("=== AI SCHEDULE SELECTION DEBUG ===");
    console.log("Raw option selected:", option);
    console.log("Encoded option:", encodeURIComponent(option));

    router.push({
      pathname: '/',
      params: {
        selectedSchedule: encodeURIComponent(option),
      },
    });

    console.log("Navigation triggered to index with selectedSchedule param");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI-Generated Schedules</Text>

      <View style={styles.scheduleCard}>
        <Text style={styles.optionTitle}>Option 1</Text>
        <Text style={styles.scheduleText}>{decodeURIComponent(option1 as string)}</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => handleSelect(option1 as string)}>
          <Text style={styles.buttonText}>Select This Schedule</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleCard}>
        <Text style={styles.optionTitle}>Option 2</Text>
        <Text style={styles.scheduleText}>{decodeURIComponent(option2 as string)}</Text>
        <TouchableOpacity style={styles.selectButton} onPress={() => handleSelect(option2 as string)}>
          <Text style={styles.buttonText}>Select This Schedule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 30,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  scheduleText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  selectButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
