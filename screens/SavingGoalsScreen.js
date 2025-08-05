
import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

const mockGoals = [
  { id: '1', title: 'Vacation Fund', target: 2000, current: 1200, progress: 0.6 },
  { id: '2', title: 'New Laptop', target: 1500, current: 450, progress: 0.3 },
  { id: '3', title: 'Emergency Savings', target: 5000, current: 4000, progress: 0.8 },
  { id: '4', title: 'Car Down Payment', target: 8000, current: 2400, progress: 0.3 },
  { id: '5', title: 'Home Renovation', target: 10000, current: 3500, progress: 0.35 },
];

const SavingGoalRow = React.memo(({ title, target, current, progress }) => {
  const progressPercent = Math.min(100, progress * 100).toFixed(1);

  return (
    <View style={styles.goalRow}>
      <Text style={styles.goalTitle}>{title}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>
      <Text style={styles.amountText}>
        ${current.toFixed(2)} / ${target.toFixed(2)}
      </Text>
      <Text style={styles.percentText}>{progressPercent}% complete</Text>
    </View>
  );
});

export default function SavingGoalsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saving Goals</Text>
        <Text style={styles.headerSubtitle}>Track your progress towards financial goals</Text>
      </View>

      <FlatList
        data={mockGoals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SavingGoalRow 
            title={item.title} 
            target={item.target} 
            current={item.current} 
            progress={item.progress} 
          />
        )}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 32,
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalRow: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  goalTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  barBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 6,
  },
  amountText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  percentText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#6366f1',
  },
});
