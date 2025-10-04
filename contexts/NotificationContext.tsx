import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { 
  requestNotificationPermissions, 
  scheduleTaskNotifications, 
  cancelTaskNotifications,
  getScheduledNotifications 
} from '@/utils/notifications';

interface Task {
  id: string;
  title: string;
  start?: string;
  end?: string;
  estimatedTime: number;
  completed?: boolean;
  missed?: boolean;
}

interface NotificationContextType {
  permissionGranted: boolean;
  requestPermissions: () => Promise<boolean>;
  scheduleNotifications: (tasks: Task[]) => Promise<void>;
  cancelNotifications: (taskId: string) => Promise<void>;
  getScheduled: () => Promise<any[]>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Check initial permission status
    checkPermissions();
    
    // Set up notification response listener
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { taskId, type } = response.notification.request.content.data;
      console.log('Notification tapped:', { taskId, type });
      
      // You can add navigation logic here if needed
      // For example, navigate to the task or timer screen
    });

    return () => subscription.remove();
  }, []);

  const checkPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionGranted(status === 'granted');
    } catch (error) {
      console.error('Error checking notification permissions:', error);
    }
  };

  const requestPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setPermissionGranted(granted);
    return granted;
  };

  const scheduleNotifications = async (tasks: Task[]) => {
    if (!permissionGranted) {
      console.log('Notification permissions not granted, requesting...');
      const granted = await requestPermissions();
      if (!granted) {
        console.log('Cannot schedule notifications without permission');
        return;
      }
    }
    
    await scheduleTaskNotifications(tasks);
  };

  const cancelNotifications = async (taskId: string) => {
    await cancelTaskNotifications(taskId);
  };

  const getScheduled = async () => {
    return await getScheduledNotifications();
  };

  return (
    <NotificationContext.Provider value={{
      permissionGranted,
      requestPermissions,
      scheduleNotifications,
      cancelNotifications,
      getScheduled
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
