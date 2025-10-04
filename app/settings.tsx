import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Bell, Volume2, Palette, Clock, Shield, CircleHelp as HelpCircle, Star, ChevronRight } from 'lucide-react-native';
import { SettingsItem } from '@/components/SettingsItem';
import { TimerSettingsModal } from '@/components/TimerSettingsModal';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [showTimerSettings, setShowTimerSettings] = useState(false);

  const timerSettings = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer</Text>
          <SettingsItem
            icon={<Clock size={20} color="#6366F1" />}
            title="Timer Settings"
            subtitle="Customize work and break durations"
            onPress={() => setShowTimerSettings(true)}
            showArrow
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingsItem
            icon={<Bell size={20} color="#10B981" />}
            title="Push Notifications"
            subtitle="Get notified when sessions end"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsItem
            icon={<Volume2 size={20} color="#F59E0B" />}
            title="Sound Effects"
            subtitle="Play sounds for timer events"
            rightComponent={
              <Switch
                value={sounds}
                onValueChange={setSounds}
                trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingsItem
            icon={<Palette size={20} color="#8B5CF6" />}
            title="Theme"
            subtitle="Light theme"
            onPress={() => {}}
            showArrow
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <SettingsItem
            icon={<Shield size={20} color="#EF4444" />}
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            onPress={() => {}}
            showArrow
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingsItem
            icon={<HelpCircle size={20} color="#6B7280" />}
            title="Help & FAQ"
            subtitle="Get help and find answers"
            onPress={() => {}}
            showArrow
          />
          <SettingsItem
            icon={<Star size={20} color="#F59E0B" />}
            title="Rate the App"
            subtitle="Share your feedback"
            onPress={() => {}}
            showArrow
          />
        </View>

        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.1</Text>
        </View>
      </ScrollView>

      <TimerSettingsModal
        visible={showTimerSettings}
        settings={timerSettings}
        onClose={() => setShowTimerSettings(false)}
        onSave={(newSettings) => {
          // Save settings logic here
          setShowTimerSettings(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  buildText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});