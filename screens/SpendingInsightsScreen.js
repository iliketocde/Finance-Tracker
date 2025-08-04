import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Pressable, Platform } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';

export default function SpendingInsightsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const animatedSpent = useState(new Animated.Value(0))[0];

  const user = getAuth().currentUser;
  const db = getFirestore(getApp());

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'transactions'),
          where('uid', '==', user.uid)
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());

        const total = data.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        setTransactions(data);
        setTotalSpent(total);

        Animated.timing(animatedSpent, {
          toValue: total,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };

    fetchTransactions();
  }, [user]);

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.transactionCard,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Text style={styles.category}>{item.category || 'Unknown'}</Text>
      <Text style={styles.amount}>-${item.amount?.toFixed(2) || '0.00'}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Spending Insights</Text>

        <Text style={styles.label}>Total Spent:</Text>
        <Animated.Text style={styles.total}>
          ${animatedSpent.interpolate({
            inputRange: [0, totalSpent],
            outputRange: [0, totalSpent],
            extrapolate: 'clamp',
          }).__getValue().toFixed(2)}
        </Animated.Text>

        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // dark navy background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#d1d5db',
    marginTop: 10,
  },
  total: {
    fontSize: 32,
    color: '#f87171',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    marginTop: 12,
    gap: 12,
  },
  transactionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  category: {
    fontSize: 16,
    color: '#f3f4f6',
  },
  amount: {
    fontSize: 16,
    color: '#f87171',
    fontWeight: '500',
  },
});
