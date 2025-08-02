import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const transactions = [
  { id: '1', category: 'Food', amount: 25 },
  { id: '2', category: 'Entertainment', amount: 40 },
  { id: '3', category: 'Food', amount: 15 },
  { id: '4', category: 'Transport', amount: 10 },
  { id: '5', category: 'Entertainment', amount: 20 },
];

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Insights</Text>
      <Text style={styles.total}>Total Spent: ${totalSpent}</Text>

      <Text style={styles.subheader}>Spending by Category:</Text>
      <FlatList
        data={Object.entries(spendingByCategory)}
        keyExtractor={([category]) => category}
        renderItem={({ item: [category, amount] }) => (
          <View style={styles.row}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.amount}>${amount}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  total: { fontSize: 22, marginBottom: 20 },
  subheader: { fontSize: 20, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  category: { fontSize: 18 },
  amount: { fontSize: 18, fontWeight: 'bold' },
});
