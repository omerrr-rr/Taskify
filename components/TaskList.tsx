import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Clock, Flag } from 'lucide-react-native';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate?: string;
}

interface TaskListProps {
  filter: string;
}

export function TaskList({ filter }: TaskListProps) {
  const tasks: Task[] = [
    {
      id: 1,
      title: 'Review project proposal',
      completed: true,
      priority: 'high',
      category: 'Work',
      dueDate: 'Today',
    },
    {
      id: 2,
      title: 'Prepare presentation slides',
      completed: false,
      priority: 'high',
      category: 'Work',
      dueDate: 'Tomorrow',
    },
    {
      id: 3,
      title: 'Call dentist for appointment',
      completed: false,
      priority: 'medium',
      category: 'Personal',
      dueDate: 'This week',
    },
    {
      id: 4,
      title: 'Update portfolio website',
      completed: false,
      priority: 'low',
      category: 'Personal',
      dueDate: 'Next week',
    },
    {
      id: 5,
      title: 'Team meeting notes',
      completed: true,
      priority: 'medium',
      category: 'Work',
    },
  ];

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'high':
        return task.priority === 'high';
      case 'today':
        return task.dueDate === 'Today';
      default:
        return true;
    }
  });

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

  return (
    <View style={styles.container}>
      {filteredTasks.map((task) => (
        <TouchableOpacity key={task.id} style={styles.taskItem}>
          <TouchableOpacity style={styles.checkbox}>
            {task.completed ? (
              <CheckCircle size={20} color="#10B981" />
            ) : (
              <Circle size={20} color="#D1D5DB" />
            )}
          </TouchableOpacity>
          
          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle,
              task.completed && styles.completedTask
            ]}>
              {task.title}
            </Text>
            
            <View style={styles.taskMeta}>
              <View style={styles.priority}>
                <Flag size={12} color={getPriorityColor(task.priority)} />
                <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                  {task.priority}
                </Text>
              </View>
              
              <Text style={styles.category}>{task.category}</Text>
              
              {task.dueDate && (
                <View style={styles.dueDate}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.dueDateText}>{task.dueDate}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskMeta: {
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
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
});