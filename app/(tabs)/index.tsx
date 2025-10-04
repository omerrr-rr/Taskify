import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Clock, CircleCheck as CheckCircle, Circle, Play, Lock, Bell, BellOff } from 'lucide-react-native';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import   generateSchedulePrompt  from '../../utils/generateScheduleImproved';
import {callTogether} from '../../utils/callTogether';
import {callGemini} from '../../utils/callGemini';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { useTimer } from '@/contexts/TimerContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { scheduleTestNotification, scheduleTestTaskNotification } from '../../utils/testNotifications';





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
  fixed?: boolean;
  start?: string;
  end?: string;
  scheduleOrder?: number;
}

export default function TasksScreen() {
  const { startTimer, getTaskProgress } = useTimer();
  const { scheduleNotifications, requestPermissions, permissionGranted, getScheduled } = useNotifications();
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([

  ]);
  const fixedTasks = tasks.filter(task => task.fixed);

  // Separate AI schedule tasks and regular tasks, then sort AI tasks by schedule order
  const aiScheduleTasks = tasks
    .filter(task => task.category === 'AI Schedule' && !task.completed && !task.missed)
    .sort((a, b) => (a.scheduleOrder || 0) - (b.scheduleOrder || 0));

  const regularActiveTasks = tasks
    .filter(task => task.category !== 'AI Schedule' && !task.completed && !task.missed);

  // Combine AI schedule tasks first (in order), then regular tasks
  const activeTasks = [...aiScheduleTasks, ...regularActiveTasks];

  const missedTasks = tasks.filter(task => task.missed && !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Schedule notifications when tasks change
  useEffect(() => {
    const scheduleTaskNotifications = async () => {
      if (!permissionGranted) {
        console.log('Requesting notification permissions...');
        await requestPermissions();
      }

      // Schedule notifications for tasks with start times
      const tasksWithTimes = tasks.filter(task => task.start && !task.completed && !task.missed);
      if (tasksWithTimes.length > 0) {
        console.log(`Scheduling notifications for ${tasksWithTimes.length} tasks`);
        await scheduleNotifications(tasksWithTimes);
      }
    };

    scheduleTaskNotifications();
  }, [tasks, permissionGranted]);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        // Get current progress from timer context and save it to the task
        const progress = getTaskProgress(taskId);
        const timeSpentMinutes = Math.floor(progress.timeSpent / 60);

        return {
          ...task,
          completed: !task.completed,
          timeSpent: timeSpentMinutes // Save the current progress
        };
      }
      return task;
    }));
  };

  const markTaskMissed = async (taskId: string) => {
    // Mark task as missed
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, missed: true } : task
    ));

    // Automatically trigger AI schedule generation
    try {
      console.log("Task marked as missed, generating AI schedule...");

      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, missed: true } : task
      );

      const prompt = generateSchedulePrompt(updatedTasks, fixedTasks);
      console.log("Generated prompt with missed task:\n", prompt);

      const result = await callTogether(prompt);
      console.log("AI full response:\n", result);

      // Split result into 2 options
      const options = result.split(/Option\s*2\s*:/i);
      if (options.length < 2) {
        alert("AI didn't return two schedule options.");
        return;
      }

      const option1 = options[0].replace(/Option\s*1\s*:/i, '').trim();
      const option2 = options[1].trim();

      router.push({
        pathname: '../ai-schedule',
        params: {
          option1: encodeURIComponent(option1),
          option2: encodeURIComponent(option2),
        },
      });
    } catch (e) {
      console.error("Error from AI model:", e);
      alert("Error: Could not generate schedule");
    }
  };

  const addTask = (newTask: Omit<Task, 'id' | 'timeSpent' | 'completed' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      timeSpent: 0,
      completed: false,
      createdAt: new Date(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const getTotalStats = () => {
    const totalEstimated = tasks.reduce((sum, task) => sum + task.estimatedTime, 0);
    const totalSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    
    return { totalEstimated, totalSpent, completionRate };
  };



  const stats = getTotalStats();
  const params = useLocalSearchParams();

const selectedSchedule = params.selectedSchedule
  ? decodeURIComponent(params.selectedSchedule as string)
  : null;
const router = useRouter();

useEffect(() => {
  console.log("=== INDEX PAGE PARAMS DEBUG ===");
  console.log("All params received:", params);
  console.log("params.selectedSchedule raw:", params.selectedSchedule);

  const selectedSchedule = params.selectedSchedule
    ? decodeURIComponent(params.selectedSchedule as string)
    : null;

  console.log("Decoded selectedSchedule:", selectedSchedule);

  if (!selectedSchedule) {
    console.log("No selectedSchedule found, exiting useEffect");
    return;
  }

  console.log("Raw selectedSchedule:", selectedSchedule);

  // Validate that the schedule contains proper task entries
  if (!selectedSchedule.includes('-') || selectedSchedule.trim().length < 10) {
    console.log("Invalid schedule format detected, skipping parsing");
    alert("Invalid schedule format received. Please try generating the schedule again.");
    return;
  }

  const lines = selectedSchedule.split('\n').filter(Boolean);
  console.log("Filtered lines:", lines);

  const parsedTasks: Task[] = lines
    .map((line, index): Task | null => {
      console.log("Processing line:", line);

      // Skip empty lines and headers
      if (!line.trim() || line.includes('Schedule Option') || line.includes('Rescheduled')) {
        console.log("Skipping header/empty line:", line);
        return null;
      }

      // Check if this is a fixed task that the AI included in the output
      const isFixedTaskInOutput = line.includes('(FIXED)') || line.includes('FIXED');
      if (isFixedTaskInOutput) {
        console.log("Found fixed task in AI output:", line);
        // We'll still parse it but mark it appropriately
      }

      // More flexible regex patterns to try (support both - and * formats)
      const patterns = [
        /^[-*]\s*(.+?)\s*-\s*(.+?)\s+to\s+(.+?)$/,  // - Task - 9:00 AM to 10:00 AM or * Task - 9:00 AM to 10:00 AM
        /^[-*]\s*(.+?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s+to\s+(\d{1,2}:\d{2}\s*(?:AM|PM)?)$/i,  // - Task - 9:00 AM to 10:00 AM
        /^[-*]\s*(.+?)\s*:\s*(.+?)\s+to\s+(.+?)$/,  // - Task: 9:00 AM to 10:00 AM or * Task: 9:00 AM to 10:00 AM
        /^[-*]\s*(.+?)\s*-\s*(.+?)$/,  // - Task - time range (fallback)
        /^[-*]\s*(.+?)\s*-\s*(.+?)\s*to\s*(.+?)$/i,  // More flexible spacing
        /^[-*•]\s*(.+?)\s*-\s*(.+?)\s*to\s*(.+?)$/i,  // Support bullet points too
      ];

      let match = null;
      for (const pattern of patterns) {
        match = line.match(pattern);
        if (match) break;
      }

      console.log("Regex match result:", match);
      if (!match) {
        console.log("❌ No regex match for line:", line);
        console.log("Line starts with:", line.charAt(0), "Line length:", line.length);

        // Try a more lenient approach for lines that contain "to"
        if (line.includes(' to ')) {
          console.log("Attempting lenient parsing for line with 'to':", line);
          const parts = line.split(' to ');
          if (parts.length === 2) {
            const beforeTo = parts[0].trim();
            const afterTo = parts[1].trim();

            // Try to extract task name and start time from the first part
            const taskMatch = beforeTo.match(/^[-*•]\s*(.+?)\s*-\s*(.+?)$/);
            if (taskMatch) {
              const [, taskName, startTime] = taskMatch;
              console.log("✅ Lenient parsing successful:", { taskName, startTime, endTime: afterTo });
              // Set the match variable so the normal parsing continues
              match = [line, taskName.trim(), startTime.trim(), afterTo.trim()];
            }
          }
        }

        if (!match) {
          return null;
        }
      }

      console.log("✅ Successfully matched line:", line);

      const [, title, start, end] = match;

      // Validate that start and end times are different
      if (start && end && start.trim() === end.trim()) {
        console.log(`Invalid time slot detected for "${title}": ${start} to ${end} (same start/end time)`);
        return null;
      }

      const estimatedTime = (() => {
        try {
          // If we don't have proper start/end times, default to 60 minutes
          if (!start || !end || start === end) {
            console.log("No proper time range found, defaulting to 60 minutes");
            return 60;
          }

          // Extract just the time part (remove AM/PM if present)
          const startTime = start.trim().split(' ')[0];
          const endTime = end.trim().split(' ')[0];

          const [sh, sm] = startTime.split(':').map(Number);
          const [eh, em] = endTime.split(':').map(Number);

          // Check if parsing was successful
          if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
            console.log("Failed to parse time numbers, defaulting to 60 minutes");
            return 60;
          }

          let startMinutes = sh * 60 + (sm || 0);
          let endMinutes = eh * 60 + (em || 0);

          // Handle AM/PM conversion if present
          if (start.includes('PM') && sh !== 12) startMinutes += 12 * 60;
          if (start.includes('AM') && sh === 12) startMinutes -= 12 * 60;
          if (end.includes('PM') && eh !== 12) endMinutes += 12 * 60;
          if (end.includes('AM') && eh === 12) endMinutes -= 12 * 60;

          // Handle next day scenario
          if (endMinutes <= startMinutes) endMinutes += 24 * 60;

          const duration = endMinutes - startMinutes;
          console.log(`Calculated duration: ${duration} minutes (${start} to ${end})`);
          return duration > 0 ? duration : 60;
        } catch (error) {
          console.log("Error parsing time:", error);
          return 60; // Default to 1 hour
        }
      })();

      // Check if this is a fixed task that already exists in the system
      const existingFixedTask = tasks.find(t =>
        t.fixed &&
        t.title.toLowerCase() === title.trim().toLowerCase() &&
        !t.completed &&
        !t.missed
      );

      if (existingFixedTask && isFixedTaskInOutput) {
        console.log("Skipping duplicate fixed task:", title);
        return null; // Don't create duplicate of existing fixed task
      }

      const task = {
        id: `ai-schedule-${Date.now()}-${index}`,
        title: title.trim(),
        description: isFixedTaskInOutput ? 'Fixed task included in schedule' : 'Generated by AI Schedule',
        estimatedTime,
        timeSpent: 0,
        completed: false,
        missed: false,
        priority: 'medium' as const,
        category: 'AI Schedule',
        createdAt: new Date(),
        start: start?.trim() || undefined,
        end: end?.trim() || undefined,
        fixed: isFixedTaskInOutput, // Mark as fixed if AI indicated it's a fixed task
        scheduleOrder: index, // Add order property to maintain sequence
      };

      console.log("Created task:", task);
      return task;
    })
    .filter((t): t is Task => t !== null);

  console.log("Final parsedTasks:", parsedTasks);
  console.log("parsedTasks length:", parsedTasks.length);

  // Helper function to convert time string to minutes since midnight
  const timeToMinutes = (timeStr: string): number => {
    try {
      const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
      const match = timeStr.match(timeRegex);
      if (!match) return -1;

      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3]?.toUpperCase();

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      return hours * 60 + minutes;
    } catch {
      return -1;
    }
  };

  // Validate for overlapping or invalid time slots
  const validTasks = parsedTasks.filter(task => {
    if (!task.start || !task.end) return true; // Allow tasks without times

    const taskStartMinutes = timeToMinutes(task.start);
    const taskEndMinutes = timeToMinutes(task.end);

    // Check for invalid time parsing or same start/end time
    if (taskStartMinutes === -1 || taskEndMinutes === -1 || taskStartMinutes >= taskEndMinutes) {
      console.log(`Removing task "${task.title}" due to invalid time: ${task.start} - ${task.end}`);
      return false;
    }

    // Check if any other task has overlapping time
    const hasOverlap = parsedTasks.some(otherTask => {
      if (otherTask.id === task.id || !otherTask.start || !otherTask.end) return false;

      const otherStartMinutes = timeToMinutes(otherTask.start);
      const otherEndMinutes = timeToMinutes(otherTask.end);

      if (otherStartMinutes === -1 || otherEndMinutes === -1) return false;

      // Check for actual time overlap
      return (taskStartMinutes < otherEndMinutes && taskEndMinutes > otherStartMinutes);
    });

    if (hasOverlap) {
      console.log(`Removing task "${task.title}" due to time overlap: ${task.start} - ${task.end}`);
      return false;
    }

    return true;
  });

  console.log("Valid tasks after overlap check:", validTasks);

  // Alert user if some tasks were filtered out due to invalid times
  if (parsedTasks.length > validTasks.length) {
    const invalidCount = parsedTasks.length - validTasks.length;
    alert(`Warning: ${invalidCount} task(s) had invalid or overlapping time slots and were excluded. Please regenerate the schedule for better results.`);
  }

  if (validTasks.length > 0) {
    console.log("Adding tasks to state...");
    setTasks(prev => {
      console.log("Previous tasks:", prev);

      // Remove any existing AI schedule tasks to avoid duplicates
      const nonAITasks = prev.filter(task => task.category !== 'AI Schedule');
      console.log("Non-AI tasks:", nonAITasks);

      // Add new AI schedule tasks at the beginning to maintain order
      const newTasks = [...validTasks, ...nonAITasks];
      console.log("New tasks array with AI schedule first:", newTasks);
      return newTasks;
    });

    // Show success message
    alert(`Successfully added ${validTasks.length} scheduled tasks!`);

    // Optional: Remove the param so it doesn’t run again
    router.setParams({ selectedSchedule: undefined });
  } else {
    console.log("No tasks parsed - check the format!");
    alert("No valid tasks could be parsed from the schedule. Please try generating again.");
  }
}, [params.selectedSchedule]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={async () => {
              if (!permissionGranted) {
                await requestPermissions();
              } else {
                // Debug: Show scheduled notifications
                const scheduled = await getScheduled();
                console.log('📅 Currently scheduled notifications:', scheduled.length);
                alert(`📅 ${scheduled.length} notifications scheduled`);
              }
            }}
            onLongPress={async () => {
              if (permissionGranted) {
                console.log('🧪 Scheduling test notifications...');
                await scheduleTestNotification();
                await scheduleTestTaskNotification();
                alert('🧪 Test notifications scheduled!\n• Immediate: 5 seconds\n• Task warning: Now\n• Task start: 10 minutes');
              }
            }}
          >
            {permissionGranted ? (
              <Bell size={20} color="#6366F1" />
            ) : (
              <BellOff size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Clock size={20} color="#6366F1" />
          <Text style={styles.statValue}>{Math.round(stats.totalSpent)}m</Text>
          <Text style={styles.statLabel}>Time Spent</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.statValue}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Circle size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{Math.round(stats.completionRate)}%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>

      



      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {aiScheduleTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 AI Generated Schedule ({aiScheduleTasks.length})</Text>
            {aiScheduleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onStartTimer={() => {
                  startTimer(task.id, task.estimatedTime);
                  router.push({
                    pathname: '/(tabs)/timer',
                    params: {
                      taskId: task.id,
                      taskTitle: task.title,
                      taskEstimatedTime: task.estimatedTime.toString(),
                    },
                  });
                }}
                onMarkMissed={markTaskMissed}
              />
            ))}
          </View>
        )}

        {regularActiveTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Other Active Tasks ({regularActiveTasks.length})</Text>
            {regularActiveTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onStartTimer={() => {
                  startTimer(task.id, task.estimatedTime);
                  router.push({
                    pathname: '/(tabs)/timer',
                    params: {
                      taskId: task.id,
                      taskTitle: task.title,
                      taskEstimatedTime: task.estimatedTime.toString(),
                    },
                  });
                }}
                onMarkMissed={markTaskMissed}
              />
            ))}
          </View>
        )}

        {missedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Missed Tasks ({missedTasks.length})</Text>
            {missedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onStartTimer={() => {
                  startTimer(task.id, task.estimatedTime);
                  router.push({
                    pathname: '/(tabs)/timer',
                    params: {
                      taskId: task.id,
                      taskTitle: task.title,
                      taskEstimatedTime: task.estimatedTime.toString(),
                    },
                  });
                }}
                onMarkMissed={markTaskMissed}
              />
            ))}
          </View>
        )}

        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed ({completedTasks.length})</Text>
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskComplete}
                onStartTimer={() => {
                  startTimer(task.id, task.estimatedTime);
                  router.push({
                    pathname: '/(tabs)/timer',
                    params: {
                      taskId: task.id,
                      taskTitle: task.title,
                      taskEstimatedTime: task.estimatedTime.toString(),
                    },
                  });
                }}
                onMarkMissed={markTaskMissed}
              />
            ))}
          </View>
        )}

        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <CheckCircle size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptyDescription}>
              Add your first task to start tracking your productivity
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <AddTaskModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddTask={addTask}
      />
      <TouchableOpacity
  style={styles.fab}
 onPress={async () => {
  try {
    console.log("Clicked AI Schedule button");
    console.log("Current tasks:", tasks);
    console.log("Fixed tasks:", fixedTasks);

    const prompt = generateSchedulePrompt(tasks, fixedTasks);
    console.log("Generated prompt:\n", prompt);

    const result = await callTogether(prompt);
    console.log("=== AI GENERATION DEBUG ===");
    console.log("AI full response:\n", result);

    // Split result into 2 options
    const options = result.split(/Option\s*2\s*:/i);
    console.log("Split options array:", options);
    console.log("Options length:", options.length);

    if (options.length < 2) {
      alert("AI didn't return two schedule options.");
      return;
    }

    const option1 = options[0].replace(/Option\s*1\s*:/i, '').trim();
    const option2 = options[1].trim();

    console.log("Processed option1:", option1);
    console.log("Processed option2:", option2);
    const router = useRouter();

    router.push({
      pathname: '../ai-schedule',
      params: {
        option1: encodeURIComponent(option1),
        option2: encodeURIComponent(option2),
      },
    });
  } catch (e) {
    console.error("Error from AI model:", e);
    alert("Error: Could not generate schedule");
  }
}}

>
  <Text style={{ color: '#fff', fontWeight: 'bold' }}>AI Schedule</Text>
</TouchableOpacity>

</View>
  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
  position: 'absolute',
  bottom: 30,
  right: 20,
  backgroundColor: '#6366F1',
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 50,
  elevation: 8,
},
selectedScheduleBox: {
  backgroundColor: '#E0E7FF',
  margin: 16,
  padding: 16,
  borderRadius: 12,
  borderLeftWidth: 4,
  borderLeftColor: '#6366F1',
},
selectedScheduleTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#1F2937',
},
selectedScheduleText: {
  fontSize: 16,
  color: '#374151',
},

});