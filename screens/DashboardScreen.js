
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Pressable, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ChallengesSection from '../components/ChallengesSection';
import FloatingChatbot from '../components/FloatingChatbot';
import ExpenseForm from '../components/ExpenseForm';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchUserData(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

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

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLineSmall} />
        </View>
        <View style={styles.skeletonBalance} />
        <View style={styles.skeletonActions}>
          <View style={styles.skeletonActionCard} />
          <View style={styles.skeletonActionCard} />
        </View>
      </View>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

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
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{displayName}!</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Balance Card */}
        <Pressable 
          style={({ pressed }) => [
            styles.balanceCard,
            pressed && styles.cardPressed,
          ]}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <MaterialCommunityIcons name="wallet" size={24} color="rgba(255, 255, 255, 0.8)" />
          </View>
          <Text style={styles.balanceAmount}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceChange}>
              <MaterialCommunityIcons name="trending-up" size={16} color="#10b981" />
              <Text style={styles.changeText}>+2.5% from last month</Text>
            </View>
          </View>
        </Pressable>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Pressable 
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => setShowExpenseForm(true)}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="plus-circle" size={32} color="#6366f1" />
              </View>
              <Text style={styles.actionTitle}>Add Expense</Text>
              <Text style={styles.actionDescription}>Track your spending</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate('Goals')}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="target" size={32} color="#10b981" />
              </View>
              <Text style={styles.actionTitle}>Set Goal</Text>
              <Text style={styles.actionDescription}>Save for something</Text>
            </Pressable>
          </View>

          <View style={styles.actionGrid}>
            <Pressable 
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate('Insights')}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="chart-line" size={32} color="#f59e0b" />
              </View>
              <Text style={styles.actionTitle}>View Insights</Text>
              <Text style={styles.actionDescription}>Analyze spending</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => navigation.navigate('Chatbot')}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="robot" size={32} color="#8b5cf6" />
              </View>
              <Text style={styles.actionTitle}>AI Assistant</Text>
              <Text style={styles.actionDescription}>Get help & advice</Text>
            </Pressable>
          </View>
        </View>

        {/* Challenges Section */}
        <ChallengesSection />

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable>
              <Text style={styles.seeAllText}>See All</Text>
            </Pressable>
          </View>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MaterialCommunityIcons name="coffee" size={20} color="#6366f1" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Coffee Shop</Text>
                <Text style={styles.activityDate}>Today, 9:30 AM</Text>
              </View>
              <Text style={styles.activityAmount}>-$4.50</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MaterialCommunityIcons name="gas-station" size={20} color="#10b981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Gas Station</Text>
                <Text style={styles.activityDate}>Yesterday, 6:15 PM</Text>
              </View>
              <Text style={styles.activityAmount}>-$45.20</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityEmpty}>
              <MaterialCommunityIcons name="history" size={24} color="#9ca3af" />
              <Text style={styles.activityEmptyText}>More transactions coming soon</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Floating Chatbot */}
      <FloatingChatbot navigation={navigation} />

      {/* Expense Form Modal */}
      <ExpenseForm
        visible={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onSuccess={() => {
          // Refresh user data to show updated balance/spending
          if (user) {
            fetchUserData(user.uid);
          }
        }}
      />
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
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  skeletonCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  skeletonHeader: {
    height: 24,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 12,
    width: '60%',
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 8,
    width: '80%',
  },
  skeletonLineSmall: {
    height: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    width: '40%',
  },
  skeletonBalance: {
    height: 120,
    backgroundColor: '#6366f1',
    borderRadius: 20,
    marginBottom: 20,
  },
  skeletonActions: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonActionCard: {
    flex: 1,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 16,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    color: '#64748b',
    fontFamily: 'OpenSans-Regular',
  },
  nameText: {
    fontSize: 36,
    color: '#0f172a',
    fontFamily: 'OpenSans-Bold',
    marginTop: 4,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'OpenSans-Regular',
  },
  balanceCard: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    padding: 28,
    marginBottom: 32,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.15,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
  },
  balanceAmount: {
    color: 'white',
    fontSize: 42,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 16,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 16,
    color: '#6366f1',
    fontFamily: 'OpenSans-SemiBold',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  activityAmount: {
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
    color: '#ef4444',
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  activityEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  activityEmptyText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#9ca3af',
    marginTop: 8,
  },
});
