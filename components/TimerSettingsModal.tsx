import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { X, Clock, Coffee, Pause } from 'lucide-react-native';

interface TimerSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

interface TimerSettingsModalProps {
  visible: boolean;
  settings: TimerSettings;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
}

export function TimerSettingsModal({ visible, settings, onClose, onSave }: TimerSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<TimerSettings>(settings);

  const durations = [5, 10, 15, 20, 25, 30, 45, 60, 90];

  const updateSetting = (key: keyof TimerSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Timer Settings</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#6366F1" />
              <Text style={styles.sectionTitle}>Work Duration</Text>
            </View>
            <View style={styles.durationGrid}>
              {durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    localSettings.workDuration === duration && styles.selectedDuration
                  ]}
                  onPress={() => updateSetting('workDuration', duration)}
                >
                  <Text style={[
                    styles.durationText,
                    localSettings.workDuration === duration && styles.selectedDurationText
                  ]}>
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Coffee size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Short Break</Text>
            </View>
            <View style={styles.durationGrid}>
              {[3, 5, 10, 15].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    localSettings.shortBreak === duration && styles.selectedDuration
                  ]}
                  onPress={() => updateSetting('shortBreak', duration)}
                >
                  <Text style={[
                    styles.durationText,
                    localSettings.shortBreak === duration && styles.selectedDurationText
                  ]}>
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Pause size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Long Break</Text>
            </View>
            <View style={styles.durationGrid}>
              {[15, 20, 30, 45].map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    localSettings.longBreak === duration && styles.selectedDuration
                  ]}
                  onPress={() => updateSetting('longBreak', duration)}
                >
                  <Text style={[
                    styles.durationText,
                    localSettings.longBreak === duration && styles.selectedDurationText
                  ]}>
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Long Break Interval</Text>
            <Text style={styles.sectionDescription}>
              Take a long break after every {localSettings.longBreakInterval} work sessions
            </Text>
            <View style={styles.durationGrid}>
              {[2, 3, 4, 5].map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.durationButton,
                    localSettings.longBreakInterval === interval && styles.selectedDuration
                  ]}
                  onPress={() => updateSetting('longBreakInterval', interval)}
                >
                  <Text style={[
                    styles.durationText,
                    localSettings.longBreakInterval === interval && styles.selectedDurationText
                  ]}>
                    {interval}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Auto Start</Text>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Auto start breaks</Text>
              <Switch
                value={localSettings.autoStartBreaks}
                onValueChange={(value) => updateSetting('autoStartBreaks', value)}
                trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Auto start work sessions</Text>
              <Switch
                value={localSettings.autoStartPomodoros}
                onValueChange={(value) => updateSetting('autoStartPomodoros', value)}
                trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 60,
    alignItems: 'center',
  },
  selectedDuration: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedDurationText: {
    color: '#FFFFFF',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
});