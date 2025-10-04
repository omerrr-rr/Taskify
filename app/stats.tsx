import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Calendar, Clock, Target, TrendingUp, Award, Flame } from 'lucide-react-native';
import { StatsCard } from '@/components/StatsCard';
import { ProductivityChart } from '@/components/ProductivityChart';
import { WeeklyOverview } from '@/components/WeeklyOverview';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const weeklyData = [
    { day: 'Mon', sessions: 0, minutes: 0 },
    { day: 'Tue', sessions: 0, minutes: 0 },
    { day: 'Wed', sessions: 0, minutes: 0 },
    { day: 'Thu', sessions: 0, minutes: 0 },
    { day: 'Fri', sessions: 0, minutes: 0 },
    { day: 'Sat', sessions: 0, minutes: 0 },
    { day: 'Sun', sessions: 0, minutes: 0 },
  ];

  const stats = {
    totalSessions: 0,
    totalMinutes: 0,
    averageSession: 0,
    streak: 0,
    completionRate: 0,
    productivity: 0,
  };

  const achievements = [
    { id: 1, title: 'First Timer', description: 'Complete your first focus session', unlocked: false },
    { id: 2, title: 'Consistent', description: 'Complete 7 days in a row', unlocked: false },
    { id: 3, title: 'Marathon', description: 'Focus for 4+ hours in a day', unlocked: false },
    { id: 4, title: 'Century', description: 'Complete 100 focus sessions', unlocked: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <View style={styles.periodSelector}>
          {(['week', 'month', 'year'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatsCard
            icon={<Clock size={24} color="#6366F1" />}
            title="Total Time"
            value={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
            subtitle="This week"
            color="#6366F1"
          />
          <StatsCard
            icon={<Target size={24} color="#10B981" />}
            title="Sessions"
            value={stats.totalSessions.toString()}
            subtitle="Completed"
            color="#10B981"
          />
          <StatsCard
            icon={<Flame size={24} color="#F59E0B" />}
            title="Streak"
            value={`${stats.streak} days`}
            subtitle="Current"
            color="#F59E0B"
          />
          <StatsCard
            icon={<TrendingUp size={24} color="#8B5CF6" />}
            title="Productivity"
            value={`${stats.productivity}%`}
            subtitle="Above average"
            color="#8B5CF6"
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <WeeklyOverview data={weeklyData} />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Productivity Trend</Text>
          <ProductivityChart period={selectedPeriod} />
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.lockedAchievement
                ]}
              >
                <Award 
                  size={32} 
                  color={achievement.unlocked ? '#F59E0B' : '#D1D5DB'} 
                />
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.lockedText
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.lockedText
                ]}>
                  {achievement.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <TrendingUp size={20} color="#10B981" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Great Progress!</Text>
              <Text style={styles.insightText}>
                You've increased your focus time by 23% compared to last week. Keep it up!
              </Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <Clock size={20} color="#6366F1" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Performance</Text>
              <Text style={styles.insightText}>
                Your most productive time is between 9-11 AM. Schedule important tasks then.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activePeriodText: {
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  insightsSection: {
    marginBottom: 40,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightContent: {
    flex: 1,
    marginLeft: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});