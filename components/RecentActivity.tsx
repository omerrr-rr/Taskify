import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, Calendar, Target } from 'lucide-react-native';

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'task',
      title: 'Completed "Review project proposal"',
      time: '2 hours ago',
      icon: <CheckCircle size={16} color="#10B981" />,
    },
    {
      id: 2,
      type: 'event',
      title: 'Attended team meeting',
      time: '4 hours ago',
      icon: <Calendar size={16} color="#3B82F6" />,
    },
    {
      id: 3,
      type: 'goal',
      title: 'Progress on "Learn React Native"',
      time: '6 hours ago',
      icon: <Target size={16} color="#8B5CF6" />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      {activities.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={styles.iconContainer}>
            {activity.icon}
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});