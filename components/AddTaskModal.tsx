import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, Clock, Flag, Folder, Lock, Unlock } from 'lucide-react-native';

interface Task {
  title: string;
  description?: string;
  estimatedTime: number;
  start?: string;
  end?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  fixed?: boolean;
}

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

export function AddTaskModal({ visible, onClose, onAddTask }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('25');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('PM');
  const [isFixed, setIsFixed] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Work');

  const priorities: Array<{ key: 'low' | 'medium' | 'high'; label: string; color: string }> = [
    { key: 'low', label: 'Low', color: '#10B981' },
    { key: 'medium', label: 'Medium', color: '#F59E0B' },
    { key: 'high', label: 'High', color: '#EF4444' },
  ];

  const categories = ['Work', 'Personal', 'Health', 'Learning', 'Creative', 'Other'];

  const formatTime = (hour: string, minute: string, period: 'AM' | 'PM') => {
    if (!hour || !minute) return '';
    return `${hour}:${minute.padStart(2, '0')} ${period}`;
  };

  const calculateEstimatedTime = (startH: string, startM: string, startP: 'AM' | 'PM', endH: string, endM: string, endP: 'AM' | 'PM') => {
    if (!startH || !startM || !endH || !endM) return 25; // Default fallback

    // Convert to 24-hour format
    let startHour24 = parseInt(startH);
    let endHour24 = parseInt(endH);

    if (startP === 'PM' && startHour24 !== 12) startHour24 += 12;
    if (startP === 'AM' && startHour24 === 12) startHour24 = 0;
    if (endP === 'PM' && endHour24 !== 12) endHour24 += 12;
    if (endP === 'AM' && endHour24 === 12) endHour24 = 0;

    // Calculate total minutes
    const startTotalMinutes = startHour24 * 60 + parseInt(startM);
    let endTotalMinutes = endHour24 * 60 + parseInt(endM);

    // Handle next day scenario
    if (endTotalMinutes <= startTotalMinutes) {
      endTotalMinutes += 24 * 60; // Add 24 hours
    }

    return endTotalMinutes - startTotalMinutes;
  };

  const handleSave = () => {
    if (!title.trim()) return;

    const startTimeFormatted = isFixed ? formatTime(startHour, startMinute, startPeriod) : undefined;
    const endTimeFormatted = isFixed ? formatTime(endHour, endMinute, endPeriod) : undefined;

    const finalEstimatedTime = isFixed
      ? calculateEstimatedTime(startHour, startMinute, startPeriod, endHour, endMinute, endPeriod)
      : parseInt(estimatedTime) || 25;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      estimatedTime: finalEstimatedTime,
      start: startTimeFormatted,
      end: endTimeFormatted,
      priority,
      category,
      fixed: isFixed,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setEstimatedTime('25');
    setStartHour('');
    setStartMinute('');
    setStartPeriod('AM');
    setEndHour('');
    setEndMinute('');
    setEndPeriod('PM');
    setIsFixed(false);
    setPriority('medium');
    setCategory('Work');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.title}>New Task</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, !title.trim() && styles.disabledButton]}
            disabled={!title.trim()}
          >
            <Text style={[styles.saveButtonText, !title.trim() && styles.disabledText]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.field}>
            <Text style={styles.label}>Task Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#9CA3AF"
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add description (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Task Type</Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.option,
                  !isFixed && styles.selectedOption
                ]}
                onPress={() => setIsFixed(false)}
              >
                <Unlock size={16} color={!isFixed ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.optionText,
                  !isFixed && styles.selectedOptionText
                ]}>
                  Flexible
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.option,
                  isFixed && styles.selectedOption
                ]}
                onPress={() => setIsFixed(true)}
              >
                <Lock size={16} color={isFixed ? '#FFFFFF' : '#6B7280'} />
                <Text style={[
                  styles.optionText,
                  isFixed && styles.selectedOptionText
                ]}>
                  Fixed Time
                </Text>
              </TouchableOpacity>
            </View>
            {isFixed && (
              <Text style={styles.helpText}>
                Fixed tasks will keep their exact time slots when AI generates schedules
              </Text>
            )}
          </View>

          {isFixed && (
            <>
              <View style={styles.field}>
                <Text style={styles.label}>Start Time</Text>
                <View style={styles.timePickerContainer}>
                  <View style={styles.timeBox}>
                    <TextInput
                      style={styles.timeInput}
                      value={startHour}
                      onChangeText={(text) => {
                        if (text === '' || (parseInt(text) >= 1 && parseInt(text) <= 12)) {
                          setStartHour(text);
                        }
                      }}
                      placeholder="12"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeBox}>
                    <TextInput
                      style={styles.timeInput}
                      value={startMinute}
                      onChangeText={(text) => {
                        if (text === '' || (parseInt(text) >= 0 && parseInt(text) <= 59)) {
                          setStartMinute(text);
                        }
                      }}
                      placeholder="00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.periodContainer}>
                    <TouchableOpacity
                      style={[styles.periodButton, startPeriod === 'AM' && styles.selectedPeriod]}
                      onPress={() => setStartPeriod('AM')}
                    >
                      <Text style={[styles.periodText, startPeriod === 'AM' && styles.selectedPeriodText]}>
                        AM
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.periodButton, startPeriod === 'PM' && styles.selectedPeriod]}
                      onPress={() => setStartPeriod('PM')}
                    >
                      <Text style={[styles.periodText, startPeriod === 'PM' && styles.selectedPeriodText]}>
                        PM
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>End Time</Text>
                <View style={styles.timePickerContainer}>
                  <View style={styles.timeBox}>
                    <TextInput
                      style={styles.timeInput}
                      value={endHour}
                      onChangeText={(text) => {
                        if (text === '' || (parseInt(text) >= 1 && parseInt(text) <= 12)) {
                          setEndHour(text);
                        }
                      }}
                      placeholder="12"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  <Text style={styles.timeSeparator}>:</Text>
                  <View style={styles.timeBox}>
                    <TextInput
                      style={styles.timeInput}
                      value={endMinute}
                      onChangeText={(text) => {
                        if (text === '' || (parseInt(text) >= 0 && parseInt(text) <= 59)) {
                          setEndMinute(text);
                        }
                      }}
                      placeholder="00"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                  <View style={styles.periodContainer}>
                    <TouchableOpacity
                      style={[styles.periodButton, endPeriod === 'AM' && styles.selectedPeriod]}
                      onPress={() => setEndPeriod('AM')}
                    >
                      <Text style={[styles.periodText, endPeriod === 'AM' && styles.selectedPeriodText]}>
                        AM
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.periodButton, endPeriod === 'PM' && styles.selectedPeriod]}
                      onPress={() => setEndPeriod('PM')}
                    >
                      <Text style={[styles.periodText, endPeriod === 'PM' && styles.selectedPeriodText]}>
                        PM
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}

          {!isFixed && (
            <View style={styles.field}>
              <Text style={styles.label}>Estimated Time (minutes)</Text>
              <TextInput
                style={styles.input}
                value={estimatedTime}
                onChangeText={setEstimatedTime}
                placeholder="25"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          )}

          {isFixed && startHour && startMinute && endHour && endMinute && (
            <View style={styles.field}>
              <Text style={styles.label}>Estimated Duration</Text>
              <View style={styles.durationDisplay}>
                <Text style={styles.durationText}>
                  {calculateEstimatedTime(startHour, startMinute, startPeriod, endHour, endMinute, endPeriod)} minutes
                </Text>
              </View>
            </View>
          )}



          <View style={styles.field}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.optionsRow}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p.key}
                  style={[
                    styles.option,
                    priority === p.key && { backgroundColor: p.color, borderColor: p.color }
                  ]}
                  onPress={() => setPriority(p.key)}
                >
                  <Flag size={16} color={priority === p.key ? '#FFFFFF' : p.color} />
                  <Text style={[
                    styles.optionText,
                    priority === p.key && styles.selectedOptionText
                  ]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.optionsRow}>
                {categories.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.option,
                      category === c && styles.selectedOption
                    ]}
                    onPress={() => setCategory(c)}
                  >
                    <Folder size={16} color={category === c ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.optionText,
                      category === c && styles.selectedOptionText
                    ]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBox: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    width: 60,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    width: '100%',
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 4,
  },
  periodContainer: {
    marginLeft: 8,
  },
  periodButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  selectedPeriod: {
    backgroundColor: '#6366F1',
  },
  periodText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedPeriodText: {
    color: '#FFFFFF',
  },
  durationDisplay: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
    textAlign: 'center',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
});