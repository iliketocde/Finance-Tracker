
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mock Spending Data
const transactions = [
  { id: '1', category: 'Food & Dining', amount: 350, icon: 'food', color: '#ef4444' },
  { id: '2', category: 'Entertainment', amount: 275, icon: 'movie', color: '#8b5cf6' },
  { id: '3', category: 'Transportation', amount: 120, icon: 'car', color: '#06b6d4' },
  { id: '4', category: 'Shopping', amount: 520, icon: 'shopping', color: '#ec4899' },
  { id: '5', category: 'Healthcare', amount: 180, icon: 'medical-bag', color: '#10b981' },
  { id: '6', category: 'Utilities', amount: 250, icon: 'home', color: '#f59e0b' },
  { id: '7', category: 'Subscriptions', amount: 89, icon: 'television', color: '#6366f1' },
];

// Calculate spending by category helper
function calculateSpendingByCategory(transactions) {
  const summary = {};
  transactions.forEach(({ category, amount, icon, color }) => {
    summary[category] = { amount: (summary[category]?.amount || 0) + amount, icon, color };
  });
  return summary;
}

// Spending category row
const CategoryRow = React.memo(({ category, data, percentage, index }) => {
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
            <Text style={styles.categoryAmount}>${data.amount.toLocaleString()}</Text>
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

export default function SpendingInsightsScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  // Spending data
  const spendingByCategory = calculateSpendingByCategory(transactions);
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const avgDaily = totalSpent / 30;

  useEffect(() => {
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
  }, []);

  const renderSpendingItem = useCallback(
    ({ item: [category, data], index }) => {
      const percentage = ((data.amount / totalSpent) * 100).toFixed(1);
      return (
        <CategoryRow 
          category={category} 
          data={data} 
          percentage={percentage} 
          index={index}
        />
      );
    },
    [totalSpent]
  );

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

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons name="currency-usd" size={24} color="#6366f1" />
            </View>
            <Text style={styles.statAmount}>${totalSpent.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statSubtext}>This month</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <MaterialCommunityIcons name="calendar-today" size={24} color="#10b981" />
            </View>
            <Text style={styles.statAmount}>${avgDaily.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Daily Average</Text>
            <Text style={styles.statSubtext}>Per day</Text>
          </View>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Spending Trend</Text>
            <Pressable style={styles.chartToggle}>
              <Text style={styles.chartToggleText}>7D</Text>
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

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons name="lightbulb" size={24} color="#f59e0b" />
            <Text style={styles.tipsTitle}>Smart Tip</Text>
          </View>
          <Text style={styles.tipsText}>
            You spent 23% more on dining this month. Consider meal planning to save up to $150!
          </Text>
          <Pressable style={styles.tipsButton}>
            <Text style={styles.tipsButtonText}>Learn More</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color="#6366f1" />
          </Pressable>
        </View>
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
  tipsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
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
    color: '#92400e',
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#92400e',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipsButtonText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#6366f1',
  },
});
