import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Coffee, Play, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Task {
  id: string;
  title: string;
  estimatedTime: number;
  completed: boolean;
}

interface SessionCompleteProps {
  visible: boolean;
  sessionType: 'work' | 'break';
  onContinue: () => void;
  onClose: () => void;
  task?: Task | null;
}

export function SessionComplete({ 
  visible, 
  sessionType, 
  onContinue, 
  onClose, 
  task 
}: SessionCompleteProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={sessionType === 'work' ? ['#10B981', '#059669'] : ['#6366F1', '#8B5CF6']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.content}>
              <View style={styles.iconContainer}>
                {sessionType === 'work' ? (
                  <CheckCircle size={64} color="#FFFFFF" />
                ) : (
                  <Coffee size={64} color="#FFFFFF" />
                )}
              </View>

              <Text style={styles.title}>
                {sessionType === 'work' ? 'Great Work!' : 'Break Complete!'}
              </Text>

              <Text style={styles.subtitle}>
                {sessionType === 'work' 
                  ? 'You completed a focus session' 
                  : 'Time to get back to work'
                }
              </Text>

              {task && sessionType === 'work' && (
                <View style={styles.taskInfo}>
                  <Text style={styles.taskLabel}>Task worked on:</Text>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                </View>
              )}

              <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
                <Play size={20} color="#FFFFFF" />
                <Text style={styles.continueText}>
                  {sessionType === 'work' ? 'Start Break' : 'Start Focus'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    padding: 32,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
    textAlign: 'center',
  },
  taskInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  taskLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});