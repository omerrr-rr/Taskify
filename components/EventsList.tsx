import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, MapPin, Users } from 'lucide-react-native';

interface EventsListProps {
  selectedDate: Date;
}

export function EventsList({ selectedDate }: EventsListProps) {
  // No events by default - can be connected to real event data later
  const events: any[] = [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events for {formatDate(selectedDate)}</Text>
      
      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={[styles.colorBar, { backgroundColor: event.color }]} />
              
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                
                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{event.time}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{event.attendees} attendees</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noEvents}>
            <Text style={styles.noEventsText}>No events scheduled for this day</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  noEvents: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});