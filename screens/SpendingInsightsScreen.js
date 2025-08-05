

import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ScrollView, Animated, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Subscription keywords for detection
const SUBSCRIPTION_KEYWORDS = [
  'netflix', 'spotify', 'apple', 'amazon', 'hulu', 'disney', 'youtube', 'microsoft',
  'adobe', 'dropbox', 'google', 'icloud', 'subscription', 'monthly', 'annual'
];

// Time filter options
const TIME_FILTERS = [
  { id: 'daily', label: 'Daily', days: 1 },
  { id: 'weekly', label: 'Weekly', days: 7 },
  { id: 'monthly', label: 'Monthly', days: 30 },
  { id: 'all', label: 'All Time', days: null },
];

// Calculate spending by category helper
function calculateSpendingByCategory(transactions) {
  const summary = {};
  transactions.forEach(({ category, amount, isSubscription }) => {
    const key = isSubscription ? 'Subscriptions' : category;
    if (!summary[key]) {
      summary[key] = { 
        amount: 0, 
        icon: isSubscription ? 'television' : getCategoryIcon(category),
        color: isSubscription ? '#8b5cf6' : getCategoryColor(category),
        isSubscription 
      };
    }
    summary[key].amount += amount;
  });
  return summary;
}

function getCategoryIcon(category) {
  const icons = {
    'Food & Dining': 'food',
    'Entertainment': 'movie',
    'Transportation': 'car',
    'Shopping': 'shopping',
    'Healthcare': 'medical-bag',
    'Utilities': 'home',
    'Groceries': 'cart',
    'Gas': 'gas-station',
    'Coffee': 'coffee',
    'Default': 'tag'
  };
  return icons[category] || icons.Default;
}

function getCategoryColor(category) {
  const colors = {
    'Food & Dining': '#ef4444',
    'Entertainment': '#8b5cf6',
    'Transportation': '#06b6d4',
    'Shopping': '#ec4899',
    'Healthcare': '#10b981',
    'Utilities': '#f59e0b',
    'Groceries': '#059669',
    'Gas': '#dc2626',
    'Coffee': '#92400e',
    'Default': '#64748b'
  };
  return colors[category] || colors.Default;
}

function detectSubscription(description) {
  return SUBSCRIPTION_KEYWORDS.some(keyword => 
    description.toLowerCase().includes(keyword.toLowerCase())
  );
}

// Spending category row
const CategoryRow = React.memo(({ category, data, percentage, index, onPress }) => {
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.categoryRow,
          pressed && styles.categoryRowPressed,
        ]}
        onPress={onPress}
      >
        <View style={styles.categoryHeader}>
          <View style={styles.categoryLeft}>
            <View style={[styles.categoryIcon, { backgroundColor: `${data.color}20` }]}>
              <MaterialCommunityIcons name={data.icon} size={24} color={data.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryPercentage}>{percentage}% of spending</Text>
            </View>
          </View>
          <View style={styles.categoryRight}>
            <Text style={styles.categoryAmount}>${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${percentage}%`,
                  backgroundColor: data.color,
                }
              ]} 
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default function SpendingInsightsScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('monthly');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const auth = getAuth();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const filter = TIME_FILTERS.find(f => f.id === selectedFilter);
    let expensesQuery = query(
      collection(db, 'expenses'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    if (filter.days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - filter.days);
      expensesQuery = query(
        collection(db, 'expenses'),
        where('userId', '==', auth.currentUser.uid),
        where('timestamp', '>=', startDate),
        orderBy('timestamp', 'desc')
      );
    }

    const unsubscribe = onSnapshot(expensesQuery, (snapshot) => {
      const expenseData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          isSubscription: data.isSubscription || detectSubscription(data.description || ''),
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      });
      setExpenses(expenseData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth.currentUser, selectedFilter]);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  // Process data
  const spendingByCategory = calculateSpendingByCategory(expenses);
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const subscriptions = expenses.filter(expense => expense.isSubscription);
  const totalSubscriptions = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const avgDaily = totalSpent / (TIME_FILTERS.find(f => f.id === selectedFilter)?.days || 30);

  const renderSpendingItem = useCallback(
    ({ item: [category, data], index }) => {
      const percentage = ((data.amount / totalSpent) * 100).toFixed(1);
      return (
        <CategoryRow 
          category={category} 
          data={data} 
          percentage={percentage} 
          index={index}
          onPress={() => {
            if (data.isSubscription) {
              Alert.alert(
                'Subscriptions',
                `Total subscription spending: $${data.amount.toFixed(2)}\nManage your subscriptions to save money!`
              );
            }
          }}
        />
      );
    },
    [totalSpent]
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your spending insights...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Spending Insights</Text>
          <Text style={styles.headerSubtitle}>Track where your money goes</Text>
        </View>

        {/* Time Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {TIME_FILTERS.map((filter) => (
              <Pressable
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.id && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}>
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons name="currency-usd" size={24} color="#6366f1" />
            </View>
            <Text style={styles.statAmount}>${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statSubtext}>{TIME_FILTERS.find(f => f.id === selectedFilter)?.label}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons name="television" size={24} color="#8b5cf6" />
            </View>
            <Text style={styles.statAmount}>${totalSubscriptions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            <Text style={styles.statLabel}>Subscriptions</Text>
            <Text style={styles.statSubtext}>{subscriptions.length} active</Text>
          </View>
        </View>

        {expenses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chart-line" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No Expenses Yet</Text>
            <Text style={styles.emptyText}>Start tracking your expenses to see insights here!</Text>
          </View>
        ) : (
          <>
            {/* Chart Placeholder */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Spending Trend</Text>
                <Pressable style={styles.chartToggle}>
                  <Text style={styles.chartToggleText}>{selectedFilter.toUpperCase()}</Text>
                </Pressable>
              </View>
              <View style={styles.chartPlaceholder}>
                <MaterialCommunityIcons name="chart-line" size={48} color="#9ca3af" />
                <Text style={styles.chartPlaceholderText}>Chart visualization coming soon</Text>
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Spending by Category</Text>
                <Text style={styles.sectionSubtitle}>{Object.keys(spendingByCategory).length} categories</Text>
              </View>
              
              <FlatList
                data={Object.entries(spendingByCategory).sort(([,a], [,b]) => b.amount - a.amount)}
                keyExtractor={([category]) => category}
                renderItem={renderSpendingItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
            </View>

            {/* Subscription Alert */}
            {totalSubscriptions > 0 && (
              <View style={styles.subscriptionAlert}>
                <View style={styles.alertHeader}>
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#f59e0b" />
                  <Text style={styles.alertTitle}>Subscription Alert</Text>
                </View>
                <Text style={styles.alertText}>
                  You're spending ${totalSubscriptions.toFixed(2)} on subscriptions. 
                  Review them regularly to avoid unnecessary charges!
                </Text>
                <Pressable style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Manage Subscriptions</Text>
                  <MaterialCommunityIcons name="arrow-right" size={16} color="#6366f1" />
                </Pressable>
              </View>
            )}

            {/* Tips Card */}
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <MaterialCommunityIcons name="lightbulb" size={24} color="#f59e0b" />
                <Text style={styles.tipsTitle}>Smart Tip</Text>
              </View>
              <Text style={styles.tipsText}>
                {totalSubscriptions > totalSpent * 0.3 
                  ? "Your subscriptions make up a large portion of your spending. Consider canceling unused services."
                  : "Great job managing your subscription spending! Keep tracking to stay on budget."
                }
              </Text>
            </View>
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#64748b',
  },
  filterTextActive: {
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statAmount: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#64748b',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  chartToggle: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  chartToggleText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  chartPlaceholderText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#9ca3af',
    marginTop: 8,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  categoriesList: {
    gap: 12,
  },
  categoryRow: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryRowPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.03,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryAmount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  subscriptionAlert: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#92400e',
  },
  alertText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#92400e',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertButtonText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#6366f1',
  },
  tipsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#1e40af',
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#1e40af',
    lineHeight: 20,
  },
});

