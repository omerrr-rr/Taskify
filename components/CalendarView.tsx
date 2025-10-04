import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewMode: string;
}

const { width } = Dimensions.get('window');

export function CalendarView({ selectedDate, onDateSelect, viewMode }: CalendarViewProps) {
  if (viewMode === 'month') {
    return <MonthView selectedDate={selectedDate} onDateSelect={onDateSelect} />;
  } else if (viewMode === 'week') {
    return <WeekView selectedDate={selectedDate} onDateSelect={onDateSelect} />;
  } else if (viewMode === 'day') {
    return <DayView selectedDate={selectedDate} onDateSelect={onDateSelect} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view coming soon
      </Text>
    </View>
  );
}

function MonthView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Get first day of the month
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
  // Get starting day of week
  const startingDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the month starts
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === selectedDate.getMonth() &&
           today.getFullYear() === selectedDate.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day;
  };

  const hasEvent = (day: number) => {
    // No events by default - can be connected to real event data later
    return false;
  };

  return (
    <View style={styles.container}>
      {/* Days of week header */}
      <View style={styles.weekHeader}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              day && isToday(day) && styles.todayCell,
              day && isSelected(day) && styles.selectedCell,
            ]}
            onPress={() => {
              if (day) {
                const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                onDateSelect(newDate);
              }
            }}
            disabled={!day}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayText,
                  isToday(day) && styles.todayText,
                  isSelected(day) && styles.selectedText,
                ]}>
                  {day}
                </Text>
                {hasEvent(day) && <View style={styles.eventDot} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function WeekView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  // Get the start of the week (Sunday)
  const startOfWeek = new Date(selectedDate);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  // Generate 7 days for the week
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    weekDays.push(day);
  }

  const isToday = (date: Date) => {
    return today.toDateString() === date.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate.toDateString() === date.toDateString();
  };

  const hasEvent = (date: Date) => {
    // No events by default - can be connected to real event data later
    return false;
  };

  return (
    <View style={styles.container}>
      {/* Week header */}
      <View style={styles.weekHeader}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* Week days */}
      <View style={styles.weekRow}>
        {weekDays.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.weekDayCell,
              isToday(date) && styles.todayCell,
              isSelected(date) && styles.selectedCell,
            ]}
            onPress={() => onDateSelect(date)}
          >
            <Text style={[
              styles.weekDayNumber,
              isToday(date) && styles.todayText,
              isSelected(date) && styles.selectedText,
            ]}>
              {date.getDate()}
            </Text>
            {hasEvent(date) && <View style={styles.eventDot} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Time slots for the week */}
      <View style={styles.timeSlots}>
        {Array.from({ length: 12 }, (_, i) => {
          const hour = i + 8; // Start from 8 AM
          const timeLabel = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;

          return (
            <View key={i} style={styles.timeSlot}>
              <Text style={styles.timeLabel}>{timeLabel}</Text>
              <View style={styles.timeSlotLine} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

function DayView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const today = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const isToday = selectedDate.toDateString() === today.toDateString();

  const formatHour = (hour: number) => {
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };

  const hasEvent = (hour: number) => {
    // No events by default - can be connected to real event data later
    return false;
  };

  const getEventTitle = (hour: number) => {
    // No event titles by default
    return '';
  };

  return (
    <View style={styles.container}>
      {/* Day header */}
      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
        {isToday && <Text style={styles.todayBadge}>Today</Text>}
      </View>

      {/* Hour slots */}
      <View style={styles.hourSlots}>
        {hours.map((hour) => (
          <View key={hour} style={styles.hourSlot}>
            <Text style={styles.hourLabel}>{formatHour(hour)}</Text>
            <View style={styles.hourContent}>
              {hasEvent(hour) && (
                <View style={styles.eventBlock}>
                  <Text style={styles.eventTitle}>{getEventTitle(hour)}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  placeholder: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    padding: 40,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: width / 7 - 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 8,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#FEF3C7',
  },
  selectedCell: {
    backgroundColor: '#3B82F6',
  },
  dayText: {
    fontSize: 16,
    color: '#1F2937',
  },
  todayText: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
  // Week View Styles
  weekRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  weekDayCell: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  weekDayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  timeSlots: {
    marginTop: 10,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeLabel: {
    width: 80,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeSlotLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 10,
  },
  // Day View Styles
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  todayBadge: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  hourSlots: {
    flex: 1,
  },
  hourSlot: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  hourLabel: {
    width: 80,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    paddingTop: 4,
  },
  hourContent: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 4,
  },
  eventBlock: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    marginVertical: 2,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});