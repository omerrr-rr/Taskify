import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, CircleCheck as CheckCircle, Calendar } from 'lucide-react-native';

export function QuickStats() {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Clock size={16} color="#3B82F6" />
        <Text style={styles.statText}>2h 30m</Text>
        <Text style={styles.statLabel}>Focus Time</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.stat}>
        <CheckCircle size={16} color="#10B981" />
        <Text style={styles.statText}>8/12</Text>
        <Text style={styles.statLabel}>Tasks Done</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.stat}>
        <Calendar size={16} color="#8B5CF6" />
        <Text style={styles.statText}>3</Text>
        <Text style={styles.statLabel}>Events Today</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
});