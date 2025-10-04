import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TimerContextType {
  activeTaskId: string | null;
  timeSpent: number;
  totalTime: number;
  isRunning: boolean;
  progress: number;
  startTimer: (taskId: string, estimatedTime: number) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  getTaskProgress: (taskId: string) => { timeSpent: number; progress: number };
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [taskProgress, setTaskProgress] = useState<Record<string, number>>({});
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && activeTaskId) {
      intervalRef.current = setInterval(() => {
        setTimeSpent(prev => {
          const newTimeSpent = prev + 1;
          
          // Update task progress
          setTaskProgress(prevProgress => ({
            ...prevProgress,
            [activeTaskId]: newTimeSpent
          }));
          
          return newTimeSpent;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, activeTaskId]);

  const startTimer = (taskId: string, estimatedTime: number) => {
    console.log('TimerContext: startTimer called', { taskId, estimatedTime });
    setActiveTaskId(taskId);
    setTotalTime(estimatedTime * 60); // Convert minutes to seconds
    setTimeSpent(taskProgress[taskId] || 0); // Resume from previous progress
    setIsRunning(true);
    console.log('TimerContext: Timer started');
  };

  const pauseTimer = () => {
    console.log('TimerContext: pauseTimer called');
    setIsRunning(false);
    // Progress is automatically saved through the useEffect that updates taskProgress
  };

  const stopTimer = () => {
    console.log('TimerContext: stopTimer called');
    setIsRunning(false);
    setActiveTaskId(null);
    setTimeSpent(0);
    setTotalTime(0);
  };

  const resetTimer = () => {
    console.log('TimerContext: resetTimer called');
    setIsRunning(false);
    setTimeSpent(taskProgress[activeTaskId || ''] || 0); // Reset to last saved progress
  };

  const getTaskProgress = (taskId: string) => {
    const spent = taskProgress[taskId] || 0;

    // If this is the active task, use current timeSpent, otherwise use saved progress
    const currentTimeSpent = taskId === activeTaskId ? timeSpent : spent;

    // Calculate progress based on estimated time (assuming 60 minutes default if no totalTime)
    const estimatedTimeInSeconds = totalTime > 0 && taskId === activeTaskId ? totalTime : 60 * 60; // 60 minutes default
    const progress = Math.min((currentTimeSpent / estimatedTimeInSeconds) * 100, 100);

    return {
      timeSpent: currentTimeSpent,
      progress
    };
  };

  const progress = totalTime > 0 ? Math.min((timeSpent / totalTime) * 100, 100) : 0;

  return (
    <TimerContext.Provider value={{
      activeTaskId,
      timeSpent,
      totalTime,
      isRunning,
      progress,
      startTimer,
      pauseTimer,
      stopTimer,
      resetTimer,
      getTaskProgress
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
