// Test script to verify the schedule prompt generation
const generateSchedulePrompt = require('./utils/generateScheduleImproved.ts').default;

// Sample tasks for testing
const testTasks = [
  // Fixed task
  {
    id: 'test-fixed-1',
    title: 'College Class',
    description: 'Fixed college class time',
    estimatedTime: 60,
    timeSpent: 0,
    completed: false,
    missed: false,
    priority: 'high',
    category: 'Education',
    createdAt: new Date(),
    fixed: true,
    start: '8:00 AM',
    end: '9:00 AM'
  },
  // Flexible tasks
  {
    id: 'flex-1',
    title: 'Study Session',
    estimatedTime: 45,
    timeSpent: 0,
    completed: false,
    missed: false,
    priority: 'high',
    category: 'Education',
    createdAt: new Date(),
    fixed: false
  },
  {
    id: 'flex-2',
    title: 'Exercise',
    estimatedTime: 30,
    timeSpent: 0,
    completed: false,
    missed: false,
    priority: 'medium',
    category: 'Health',
    createdAt: new Date(),
    fixed: false
  }
];

const fixedTasks = testTasks.filter(task => task.fixed);

console.log("=== TESTING SCHEDULE PROMPT ===");
console.log("Test tasks:", testTasks);
console.log("Fixed tasks:", fixedTasks);

const prompt = generateSchedulePrompt(testTasks, fixedTasks);
console.log("\n=== GENERATED PROMPT ===");
console.log(prompt);
