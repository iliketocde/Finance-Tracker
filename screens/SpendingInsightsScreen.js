import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Animated } from 'react-native';

const transactions = [
  { id: '1', category: 'Food', amount: 25 },
  { id: '2', category: 'Entertainment', amount: 40 },
  { id: '3', category: 'Food', amount: 15 },
  { id: '4', category: 'Transport', amount: 10 },
  { id: '5', category: 'Entertainment', amount: 20 },
];

const CategoryRow = React.memo(({ category, amount, percentage }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && { transform: [{ scale: 0.98 }], shadowOpacity: 0.15 },
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

function calculateSpendingByCategory(transactions) {
  const summary = {};
  transactions.forEach(({ category, amount }) => {
    summary[category] = (summary[category] || 0) + amount;
  });
  return summary;
}

export default function SpendingInsightsScreen() {
  const spendingByCategory = calculateSpendingByCategory(transactions);
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const renderItem = useCallback(({ item: [category, amount] }) => {
    const percentage = ((amount / totalSpent) * 100).toFixed(1);
    return (
      <CategoryRow
        category={category}
        amount={amount}
        percentage={percentage}
      />
    );
  }, [totalSpent]);

  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
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
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    padding: 16,
  },
  centeredContent: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 32,
    padding: 28,
    marginVertical: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    backdropFilter: 'blur(12px)', // frosted glass effect (web only)
  },
  header: {
    fontFamily: 'System',
    fontSize: 28,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  totalCard: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  totalLabel: {
    fontFamily: 'System',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontWeight: '500',
  },
  totalAmount: {
    fontFamily: 'System',
    fontSize: 36,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subheader: {
    fontFamily: 'System',
    fontSize: 20,
    color: '#374151',
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  row: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 18,
    borderRadius: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    transitionDuration: '150ms',
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: 'ease',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  category: {
    fontFamily: 'System',
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
  },
  percentage: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    transitionDuration: '300ms',
    transitionProperty: 'width',
    transitionTimingFunction: 'ease',
  },
  amount: {
    marginTop: 8,
    fontFamily: 'System',
    fontSize: 16,
    color: '#111827',
    textAlign: 'right',
    fontWeight: '500',
  },
});