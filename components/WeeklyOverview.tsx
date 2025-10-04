import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface WeeklyData {
  day: string;
  sessions: number;
  minutes: number;
}

interface WeeklyOverviewProps {
  data: WeeklyData[];
}

export function WeeklyOverview({ data }: WeeklyOverviewProps) {
  const maxSessions = Math.max(...data.map(d => d.sessions));
  const maxMinutes = Math.max(...data.map(d => d.minutes));

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const sessionHeight = maxSessions > 0 ? (item.sessions / maxSessions) * 120 : 0;
          const minuteHeight = maxMinutes > 0 ? (item.minutes / maxMinutes) * 120 : 0;
          
          return (
            <View key={index} style={styles.dayContainer}>
              <View style={styles.bars}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      styles.sessionBar,
                      { height: sessionHeight }
                    ]} 
                  />
                </View>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      styles.minuteBar,
                      { height: minuteHeight }
                    ]} 
                  />
                </View>
              </View>
              <Text style={styles.dayLabel}>{item.day}</Text>
              <Text style={styles.sessionCount}>{item.sessions}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.sessionColor]} />
          <Text style={styles.legendText}>Sessions</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.minuteColor]} />
          <Text style={styles.legendText}>Minutes</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    marginBottom: 16,
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
    gap: 2,
  },
  barContainer: {
    width: 8,
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 2,
  },
  sessionBar: {
    backgroundColor: '#6366F1',
  },
  minuteBar: {
    backgroundColor: '#10B981',
  },
  dayLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  sessionCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionColor: {
    backgroundColor: '#6366F1',
  },
  minuteColor: {
    backgroundColor: '#10B981',
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});