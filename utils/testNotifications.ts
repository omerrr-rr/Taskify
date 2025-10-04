import * as Notifications from 'expo-notifications';

// Test notification that fires in 5 seconds
export async function scheduleTestNotification() {
  try {
    const now = new Date();
    const testTime = new Date(now.getTime() + 5000); // 5 seconds from now
    
    await Notifications.scheduleNotificationAsync({
      identifier: 'test-notification',
      content: {
        title: '🧪 Test Notification',
        body: 'If you see this, notifications are working!',
        data: { test: true },
        sound: 'default',
      },
      trigger: {
        date: testTime,
      },
    });
    
    console.log('✅ Test notification scheduled for 5 seconds from now');
    return true;
  } catch (error) {
    console.error('❌ Error scheduling test notification:', error);
    return false;
  }
}

// Test notification for 10 minutes from now (to test the 10-minute warning)
export async function scheduleTestTaskNotification() {
  try {
    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
    const twentyMinutesFromNow = new Date(now.getTime() + 20 * 60 * 1000);
    
    // Schedule 10-minute warning (fires immediately since task is 10 min away)
    await Notifications.scheduleNotificationAsync({
      identifier: 'test-warning',
      content: {
        title: '⏰ Test Task Starting Soon',
        body: 'Test task starts in 10 minutes',
        data: { taskId: 'test', type: 'warning' },
        sound: 'default',
      },
      trigger: {
        date: now, // Fire immediately
      },
    });
    
    // Schedule exact time notification (fires in 10 minutes)
    await Notifications.scheduleNotificationAsync({
      identifier: 'test-start',
      content: {
        title: '🚀 Test Task Starting Now',
        body: 'Time to start your test task!',
        data: { taskId: 'test', type: 'start' },
        sound: 'default',
      },
      trigger: {
        date: tenMinutesFromNow,
      },
    });
    
    console.log('✅ Test task notifications scheduled');
    console.log('📱 Warning notification: Immediate');
    console.log('📱 Start notification:', tenMinutesFromNow.toLocaleTimeString());
    return true;
  } catch (error) {
    console.error('❌ Error scheduling test task notifications:', error);
    return false;
  }
}
