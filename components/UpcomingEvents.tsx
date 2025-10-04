import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';

export function UpcomingEvents() {
  const events = [
    {
      id: 1,
      title: 'Team Standup',
      time: '10:00 AM',
      location: 'Conference Room A',
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Client Presentation',
      time: '2:00 PM',
      location: 'Virtual',
      color: '#8B5CF6',
    },
    {
      id: 3,
      title: 'Gym Session',
      time: '6:00 PM',
      location: 'Local Gym',
      color: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      {events.map((event) => (
        <View key={event.id} style={styles.eventItem}>
          <View style={[styles.colorIndicator, { backgroundColor: event.color }]} />
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventDetails}>
              <View style={styles.detailItem}>
                <Clock size={12} color="#6B7280" />
                <Text style={styles.detailText}>{event.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <MapPin size={12} color="#6B7280" />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>
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
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
});