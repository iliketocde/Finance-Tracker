import React from 'react';
import { View, Text, StyleSheet, FlatList, ProgressBarAndroid, Platform, ProgressViewIOS } from 'react-native';

const mockGoals = [
  { id: '1', title: 'Vacation Fund', progress: 0.6 },
  { id: '2', title: 'New Laptop', progress: 0.3 },
  { id: '3', title: 'Emergency Savings', progress: 0.8 },
];

// Cross-platform progress bar
const ProgressBar = ({ progress }) => {
  if (Platform.OS === 'android') {
    return <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} color="#3b82f6" />;
  }
  return <ProgressViewIOS progress={progress} progressTintColor="#3b82f6" />;
};

export default function SavingGoalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saving Goals</Text>
      <FlatList
        data={mockGoals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.goalRow}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <ProgressBar progress={item.progress} />
            <Text style={styles.percentText}>{Math.round(item.progress * 100)}%</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 28,
    marginBottom: 24,
    color: '#111827',
    textAlign: 'center',
  },
  goalRow: {
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  goalTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    marginBottom: 8,
    color: '#1e293b',
  },
  percentText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    marginTop: 6,
    color: '#3b82f6',
    textAlign: 'right',
  },
});
