import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, RotateCcw, Plus } from 'lucide-react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { TimerControls } from '@/components/TimerControls';
import { TaskSelector } from '@/components/TaskSelector';
import { SessionComplete } from '@/components/SessionComplete';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTimer } from '@/contexts/TimerContext';

const { width, height } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  estimatedTime: number;
  completed: boolean;
}

export default function TimerScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { startTimer, pauseTimer, stopTimer, resetTimer, isRunning, timeSpent, totalTime, activeTaskId } = useTimer();

  // Get task info from params if available
  const taskFromParams = params.taskId ? {
    id: params.taskId as string,
    title: params.taskTitle as string,
    estimatedTime: parseInt(params.taskEstimatedTime as string) || 25,
    completed: false,
  } : null;

  // Set initial time based on task estimated time or default to 25 minutes
  const defaultTime = taskFromParams ? taskFromParams.estimatedTime * 60 : 25 * 60;

  const [selectedTask, setSelectedTask] = useState<Task | null>(taskFromParams);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const tasks: Task[] = [];

  // Auto-start timer when task is selected from task card
  useEffect(() => {
    if (taskFromParams && activeTaskId !== taskFromParams.id) {
      console.log("Auto-starting timer for task:", taskFromParams.title);
      startTimer(taskFromParams.id, taskFromParams.estimatedTime);

      // Clear the URL parameters to prevent re-triggering
      router.setParams({
        taskId: undefined,
        taskTitle: undefined,
        taskEstimatedTime: undefined,
      });
    }
  }, [taskFromParams, activeTaskId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    console.log('handlePlayPause called', { isRunning, activeTaskId, selectedTask });

    if (isRunning) {
      console.log('Pausing timer');
      pauseTimer();
    } else if (selectedTask) {
      console.log('Starting timer for selected task:', selectedTask.title);
      startTimer(selectedTask.id, selectedTask.estimatedTime);
    } else {
      console.log('No task selected, starting default focus session');
      // Create a default focus session
      const defaultTask = {
        id: 'focus-session-' + Date.now(),
        title: 'Focus Session',
        estimatedTime: 25
      };
      setSelectedTask(defaultTask);
      startTimer(defaultTask.id, defaultTask.estimatedTime);
    }
  };

  const handleStop = () => {
    console.log('handleStop called');
    stopTimer();
  };

  const handleReset = () => {
    console.log('handleReset called');
    resetTimer();
  };

  const setTimer = (minutes: number) => {
    if (activeTaskId) {
      startTimer(activeTaskId, minutes);
    } else if (selectedTask) {
      startTimer(selectedTask.id, minutes);
    }
  };

  const progress = (totalTime || 1500) > 0 ? timeSpent / (totalTime || 1500) : 0;

  const handleSessionComplete = () => {
    setShowSessionComplete(false);
    
    // Switch between work and break sessions
    if (sessionType === 'work') {
      setSessionType('break');
      setTimer(5); // 5 minute break
    } else {
      setSessionType('work');
      setTimer(25); // 25 minute work session
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={sessionType === 'work' ? ['#6366F1', '#8B5CF6'] : ['#10B981', '#059669']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.sessionType}>
            {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
          </Text>
          <Text style={styles.sessionCount}>
            Session {completedSessions + 1}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <CircularProgress
            size={280}
            strokeWidth={8}
            progress={progress}
            color="#FFFFFF"
            backgroundColor="rgba(255, 255, 255, 0.2)"
          >
            <View style={styles.timerContent}>
              <Text style={styles.timeDisplay}>
                {formatTime(Math.max(0, (totalTime || 1500) - timeSpent))}
              </Text>
              {selectedTask ? (
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {selectedTask.title}
                </Text>
              ) : (
                <Text style={styles.taskTitle} numberOfLines={2}>
                  Focus Session
                </Text>
              )}
            </View>
          </CircularProgress>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleReset}
          >
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={handlePlayPause}
          >
            {isRunning ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleStop}
          >
            <Square size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {!selectedTask && sessionType === 'work' && (
          <TouchableOpacity
            style={styles.selectTaskButton}
            onPress={() => setShowTaskSelector(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.selectTaskText}>Select a task to focus on</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <TimerControls onSetTimer={setTimer} currentTime={totalTime} />

      <TaskSelector
        visible={showTaskSelector}
        tasks={tasks}
        onSelectTask={(task) => {
          setSelectedTask(task);
          setShowTaskSelector(false);
        }}
        onClose={() => setShowTaskSelector(false)}
      />

      <SessionComplete
        visible={showSessionComplete}
        sessionType={sessionType}
        onContinue={handleSessionComplete}
        onClose={() => setShowSessionComplete(false)}
        task={selectedTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sessionType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  timerContent: {
    alignItems: 'center',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 200,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 40,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  selectTaskText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});