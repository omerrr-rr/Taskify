import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Plus, TrendingUp } from 'lucide-react-native';
import { GoalCard } from '@/components/GoalCard';
import { GoalProgress } from '@/components/GoalProgress';
import { AddGoalModal } from '@/components/AddGoalModal';

export default function Goals() {
  const [showAddModal, setShowAddModal] = useState(false);

  const goals = [
    {
      id: 1,
      title: 'Read 24 Books This Year',
      progress: 16,
      target: 24,
      category: 'Personal',
      deadline: '2024-12-31',
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Learn React Native',
      progress: 75,
      target: 100,
      category: 'Career',
      deadline: '2024-06-30',
      color: '#8B5CF6',
    },
    {
      id: 3,
      title: 'Exercise 150 Days',
      progress: 89,
      target: 150,
      category: 'Health',
      deadline: '2024-12-31',
      color: '#10B981',
    },
    {
      id: 4,
      title: 'Save $10,000',
      progress: 6500,
      target: 10000,
      category: 'Finance',
      deadline: '2024-12-31',
      color: '#F59E0B',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.overallProgress}>
          <View style={styles.progressHeader}>
            <TrendingUp size={24} color="#3B82F6" />
            <Text style={styles.progressTitle}>Overall Progress</Text>
          </View>
          <GoalProgress 
            completed={3}
            total={goals.length}
            percentage={75}
          />
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </View>
      </ScrollView>

      <AddGoalModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overallProgress: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  goalsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
});