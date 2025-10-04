import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface Task {
  id: string;
  title: string;
  start?: string;
  end?: string;
  estimatedTime: number;
}

// Request notification permissions
export async function requestNotificationPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }
    
    // For Android, set up notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('task-reminders', {
        name: 'Task Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
        sound: 'default',
      });
    }
    
    console.log('Notification permissions granted');
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

// Parse time string to Date object
function parseTimeToDate(timeString: string, baseDate: Date = new Date()): Date {
  if (!timeString) return new Date();
  
  try {
    // Handle formats like "2:00 PM", "14:00", etc.
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
    const match = timeString.match(timeRegex);
    
    if (!match) return new Date();
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3]?.toUpperCase();
    
    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (date < new Date()) {
      date.setDate(date.getDate() + 1);
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing time:', error);
    return new Date();
  }
}

// Schedule notification for a specific task
export async function scheduleTaskNotification(task: Task) {
  try {
    if (!task.start) {
      console.log('Task has no start time, skipping notification');
      return;
    }
    
    const startTime = parseTimeToDate(task.start);
    const now = new Date();
    
    // Don't schedule notifications for past times
    if (startTime <= now) {
      console.log('Task start time is in the past, skipping notification');
      return;
    }
    
    // Schedule 10-minute warning notification
    const tenMinutesBefore = new Date(startTime.getTime() - 10 * 60 * 1000);
    if (tenMinutesBefore > now) {
      await Notifications.scheduleNotificationAsync({
        identifier: `${task.id}-warning`,
        content: {
          title: '⏰ Task Starting Soon',
          body: `"${task.title}" starts in 10 minutes at ${task.start}`,
          data: { taskId: task.id, type: 'warning' },
          sound: 'default',
        },
        trigger: {
          date: tenMinutesBefore,
          channelId: 'task-reminders',
        },
      });
      
      console.log(`Scheduled 10-minute warning for "${task.title}" at ${tenMinutesBefore.toLocaleTimeString()}`);
    }
    
    // Schedule exact time notification
    await Notifications.scheduleNotificationAsync({
      identifier: `${task.id}-start`,
      content: {
        title: '🚀 Task Starting Now',
        body: `Time to start "${task.title}"`,
        data: { taskId: task.id, type: 'start' },
        sound: 'default',
      },
      trigger: {
        date: startTime,
        channelId: 'task-reminders',
      },
    });
    
    console.log(`Scheduled start notification for "${task.title}" at ${startTime.toLocaleTimeString()}`);
    
  } catch (error) {
    console.error('Error scheduling task notification:', error);
  }
}

// Schedule notifications for multiple tasks
export async function scheduleTaskNotifications(tasks: Task[]) {
  try {
    // Cancel all existing task notifications first
    await cancelAllTaskNotifications();
    
    // Schedule notifications for tasks with start times
    const tasksWithTimes = tasks.filter(task => task.start && !task.completed);
    
    for (const task of tasksWithTimes) {
      await scheduleTaskNotification(task);
    }
    
    console.log(`Scheduled notifications for ${tasksWithTimes.length} tasks`);
  } catch (error) {
    console.error('Error scheduling task notifications:', error);
  }
}

// Cancel all task-related notifications
export async function cancelAllTaskNotifications() {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.identifier.includes('-warning') || notification.identifier.includes('-start')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    console.log('Cancelled all existing task notifications');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

// Cancel notifications for a specific task
export async function cancelTaskNotifications(taskId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(`${taskId}-warning`);
    await Notifications.cancelScheduledNotificationAsync(`${taskId}-start`);
    console.log(`Cancelled notifications for task ${taskId}`);
  } catch (error) {
    console.error('Error cancelling task notifications:', error);
  }
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications.map(n => ({
      id: n.identifier,
      title: n.content.title,
      trigger: n.trigger
    })));
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}
