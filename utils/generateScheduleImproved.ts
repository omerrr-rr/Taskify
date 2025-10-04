export default function generateSchedulePrompt(tasks: any[], fixedTasks: any[]) {
  // Get all fixed tasks (including user-created fixed tasks and AI schedule tasks)
  const allFixedTasks = tasks.filter(t => t.fixed && !t.completed && !t.missed);

  console.log("=== SCHEDULE PROMPT DEBUG ===");
  console.log("All tasks:", tasks);
  console.log("Fixed tasks passed:", fixedTasks);
  console.log("Filtered fixed tasks:", allFixedTasks);

  const fixed = allFixedTasks
    .map(t => `${t.title}: ${t.start ?? '??'} - ${t.end ?? '??'}`)
    .join('\n');

  const flex = tasks
    .filter(t => !t.completed && !t.fixed && !t.missed)
    .map(t => `${t.title} (${t.estimatedTime} mins, priority: ${t.priority})`)
    .join('\n');

  const missed = tasks
    .filter(t => t.missed)
    .map(t => `${t.title} (${t.estimatedTime} mins, priority: ${t.priority})`)
    .join('\n');

  console.log("Fixed tasks string:", fixed);
  console.log("Flexible tasks string:", flex);
  console.log("Missed tasks string:", missed);

  if (fixed) {
    console.log("✅ Fixed tasks found - AI should include these in output");
  } else {
    console.log("⚠️ No fixed tasks found - AI will only schedule flexible tasks");
  }

  return `
You are a personal AI scheduling assistant. You MUST follow these rules EXACTLY to prevent overlapping time slots.

🚨 CRITICAL SCHEDULING RULES - FOLLOW THESE EXACTLY:
1. **NEVER change Fixed Task times** - they are locked in place and CANNOT be moved
2. **NEVER move or reorder Fixed Tasks** - keep their exact times as shown below
3. **Work around Fixed Tasks** - schedule flexible tasks in available time slots ONLY
4. **NO OVERLAPPING TIME SLOTS** - Each task must have completely separate time periods
5. **EVERY task MUST have different start and end times** (e.g., 9:00 AM to 9:30 AM, NOT 9:00 AM to 9:00 AM)
6. **Use the estimated time** provided for each task to calculate proper end times
7. **Schedule tasks sequentially** - one task ends before the next begins
8. **Prioritize missed tasks first** when filling available time
9. **Respect priority levels**: High > Medium > Low
10. **Generate two varied schedule options** by shuffling flexible task order
11. If there's not enough time for a task today, push it to tomorrow
12. Do not add any tasks by yourself - only schedule the tasks provided

🔒 MANDATORY FIXED TASK RULES:
- Fixed tasks are IMMOVABLE appointments that you MUST work around
- Find time slots BEFORE, AFTER, or BETWEEN fixed tasks for flexible tasks
- NEVER schedule anything during fixed task time periods
- If a fixed task is 8:00 AM to 9:00 AM, you can schedule flexible tasks from 7:00-8:00 AM or 9:00 AM onwards
- **ALWAYS INCLUDE FIXED TASKS IN YOUR OUTPUT** - show the complete daily schedule including both fixed and flexible tasks

⚠️ OVERLAP PREVENTION RULES:
- If Task A ends at 10:00 AM, Task B cannot start until 10:00 AM or later
- Leave NO gaps between sequential tasks unless necessary
- Double-check that no two tasks share the same time period
- Example: Task A (9:00 AM to 10:00 AM), Task B (10:00 AM to 11:00 AM) ✅
- Example: Task A (9:00 AM to 10:00 AM), Task B (9:30 AM to 10:30 AM) ❌ OVERLAP!

🔒 FIXED TASK SCHEDULING RULES:
- NEVER schedule flexible tasks during fixed task time slots
- If there's a fixed task from 2:00 PM to 3:00 PM, schedule flexible tasks BEFORE 2:00 PM or AFTER 3:00 PM
- Find available time slots between, before, or after fixed tasks
- Example: Fixed task (2:00 PM to 3:00 PM) → Schedule flexible tasks at 1:00-2:00 PM or 3:00-4:00 PM

🔒 FIXED TASKS (DO NOT CHANGE THESE TIMES - SCHEDULE AROUND THEM):
${fixed || 'None - No fixed tasks to work around'}

${fixed ? '⚠️ IMPORTANT: The above fixed tasks are LOCKED and cannot be moved. You MUST schedule flexible tasks around these fixed time slots. Do NOT overlap with these times!' : ''}

📋 FLEXIBLE TASKS (Schedule around fixed tasks):
${flex || 'None'}

⚠️ MISSED TASKS (Prioritize rescheduling):
${missed || 'None'}

📤 REQUIRED OUTPUT FORMAT (strictly follow this EXACT format):

CRITICAL: You MUST include ALL fixed tasks in your output along with the flexible tasks to show the complete daily schedule. Do NOT omit fixed tasks from your response.

Schedule Option 1:
- Fixed Task Name - Original Fixed Time (keep exactly as provided above)
- Flexible Task Name - New Scheduled Time
- Another Flexible Task Name - New Scheduled Time

Schedule Option 2:
- Fixed Task Name - Original Fixed Time (keep exactly as provided above)
- Flexible Task Name - New Scheduled Time (different order)
- Another Flexible Task Name - New Scheduled Time

IMPORTANT: Use ONLY dashes (-) at the start of each line, NOT asterisks (*) or other symbols.

✅ EXAMPLES OF CORRECT FORMATTING (use dashes, not asterisks):
- Daily DSA - 9:00 AM to 10:00 AM
- Reading - 10:00 AM to 11:00 AM
- Workout - 11:00 AM to 12:00 PM

✅ EXAMPLE WITH FIXED TASKS (EXACTLY how your output should look):
If you have:
- Fixed Task: college - 8:00 AM to 4:00 PM
- Flexible Task: dsa (60 mins, medium priority)

Your output should be:

Schedule Option 1:
- dsa - 7:00 AM to 8:00 AM
- college - 8:00 AM to 4:00 PM
- (any other flexible tasks after 4:00 PM)

Schedule Option 2:
- college - 8:00 AM to 4:00 PM
- dsa - 4:00 PM to 5:00 PM

❌ EXAMPLES OF INCORRECT FORMATTING (DO NOT DO THIS):
- Reading - 10:00 AM to 10:00 AM (same start/end time)
- Workout - 9:30 AM to 10:30 AM (overlaps with Daily DSA above)
- Study - 10:00 AM to 10:00 AM (zero duration)
- Meeting - 8:30 AM to 9:30 AM (overlaps with fixed College Class)

BEFORE FINALIZING:
1. Double-check that no two tasks have overlapping time periods!
2. Make sure you included ALL fixed tasks in your output with their original times
3. Verify that flexible tasks are scheduled around (not during) fixed task times
4. Show the complete daily schedule including both fixed and flexible tasks
  `;
}
