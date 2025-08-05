import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ScrollView } from 'react-native';

// Mock Spending Data
const transactions = [
  { id: '1', category: 'Food', amount: 50 },
  { id: '2', category: 'Entertainment', amount: 75 },
  { id: '3', category: 'Transport', amount: 20 },
  { id: '4', category: 'Subscriptions', amount: 40 },
  { id: '5', category: 'Food', amount: 25 },
  { id: '6', category: 'Shopping', amount: 120 },
  { id: '7', category: 'Healthcare', amount: 80 },
  { id: '8', category: 'Utilities', amount: 150 },
];

// Calculate spending by category helper
function calculateSpendingByCategory(transactions) {
  const summary = {};
  transactions.forEach(({ category, amount }) => {
    summary[category] = (summary[category] || 0) + amount;
  });
  return summary;
}

// Spending category row
const CategoryRow = React.memo(({ category, amount, percentage }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={styles.labelContainer}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.amount}>${amount.toFixed(2)}</Text>
    </Pressable>
  );
});

export default function SpendingInsightsScreen() {
  // Spending data
  const spendingByCategory = calculateSpendingByCategory(transactions);
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const renderSpendingItem = useCallback(
    ({ item: [category, amount] }) => {
      const percentage = ((amount / totalSpent) * 100).toFixed(1);
      return (
        <CategoryRow category={category} amount={amount} percentage={percentage} />
      );
    },
    [totalSpent]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.header}>Spending Insights</Text>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>${totalSpent.toFixed(2)}</Text>
        </View>

        <Text style={styles.subheader}>Spending by Category</Text>
        <FlatList
          data={Object.entries(spendingByCategory)}
          keyExtractor={([category]) => category}
          renderItem={renderSpendingItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 32,
    padding: 28,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  header: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 28,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  totalLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  totalAmount: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 40,
    color: '#fff',
  },
  subheader: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 20,
    color: '#374151',
    marginBottom: 16,
  },
  row: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 18,
    borderRadius: 40,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  category: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  percentage: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  barBackground: {
    height: 14,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
  },
  amount: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: '#111827',
    textAlign: 'right',
  },
});