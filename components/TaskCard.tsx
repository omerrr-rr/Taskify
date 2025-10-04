import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Clock, Play, Flag, Lock, X, Pause } from 'lucide-react-native';
import { useTimer } from '@/contexts/TimerContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number;
  timeSpent: number;
  completed: boolean;
  missed?: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  fixed?:boolean;
  start?: string;
  end?: string;
  scheduleOrder?: number;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onStartTimer: () => void;
  onMarkMissed: (taskId: string) => void;
}

export function TaskCard({ task, onToggleComplete, onStartTimer, onMarkMissed }: TaskCardProps) {
  const { activeTaskId, isRunning, getTaskProgress, pauseTimer } = useTimer();

  // Get timer progress for this task
  const taskProgress = getTaskProgress(task.id);
  const isActiveTimer = activeTaskId === task.id;
  const currentTimeSpent = Math.floor(taskProgress.timeSpent / 60); // Convert to minutes for display

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getProgressPercentage = () => {
    if (task.estimatedTime === 0) return 0;

    // Use timer context progress which handles both active and stored progress
    const contextProgress = getTaskProgress(task.id);
    const timeSpentMinutes = contextProgress.timeSpent / 60; // Convert seconds to minutes

    return Math.min((timeSpentMinutes / task.estimatedTime) * 100, 100);
  };

  return (
    <View style={[
      styles.container,
      task.completed && styles.completedContainer,
      task.missed && styles.missedContainer
    ]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.completed ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#D1D5DB" />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
  <View style={styles.titleRow}>
    <Text style={[styles.title, task.completed && styles.completedTitle]}>
      {task.title}
    </Text>
    {task.fixed && <Lock size={16} color="#6B7280" style={{ marginLeft: 6 }} />}
    {task.missed && (
      <View style={styles.missedBadge}>
        <Text style={styles.missedBadgeText}>MISSED</Text>
      </View>
    )}
  </View>
  {task.description && (
    <Text style={[styles.description, task.completed && styles.completedText]}>
      {task.description}
    </Text>
  )}
</View>


        {!task.completed && !task.missed && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.missedButton} onPress={() => onMarkMissed(task.id)}>
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playButton}
              onPress={isActiveTimer && isRunning ? pauseTimer : onStartTimer}
            >
              {isActiveTimer && isRunning ? (
                <Pause size={16} color="#6366F1" />
              ) : (
                <Play size={16} color="#6366F1" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.meta}>
          <View style={styles.priority}>
            <Flag size={12} color={getPriorityColor(task.priority)} />
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>

          <Text style={styles.category}>{task.category}</Text>

          <View style={styles.timeInfo}>
            <Clock size={12} color={isActiveTimer ? "#6366F1" : "#6B7280"} />
            <Text style={[styles.timeText, isActiveTimer && styles.activeTimeText]}>
              {currentTimeSpent}m / {task.estimatedTime}m
            </Text>
          </View>

          {(task.start || task.end) && (
            <View style={styles.scheduleInfo}>
              <Clock size={12} color="#6366F1" />
              <Text style={styles.scheduleText}>
                {task.start && task.end
                  ? `${task.start} - ${task.end}`
                  : task.start
                    ? `Start: ${task.start}`
                    : `End: ${task.end}`
                }
              </Text>
            </View>
          )}
        </View>

        {!task.completed && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {isActiveTimer && isRunning ? '⏱️ Running' : isActiveTimer ? '⏸️ Paused' : ''} {Math.round(getProgressPercentage())}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  completedContainer: {
    opacity: 0.7,
  },
  missedContainer: {
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  completedText: {
    color: '#9CA3AF',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeTimeText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 32,
    textAlign: 'right',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleText: {
    fontSize: 12,
    color: '#6366F1',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  missedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missedBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  missedBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },





});