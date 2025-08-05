
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    color: '#64748b',
    features: [
      'Basic expense tracking',
      'Simple insights',
      'Manual data entry',
      'Limited history (30 days)',
    ],
    limitations: ['No automated insights', 'No subscription detection', 'Basic support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    color: '#6366f1',
    popular: true,
    features: [
      'Advanced expense tracking',
      'Automated subscription detection',
      'Spending insights & trends',
      'Unlimited history',
      'Budget planning tools',
      'Email support',
    ],
    limitations: [],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$19.99',
    period: '/month',
    color: '#8b5cf6',
    features: [
      'Everything in Pro',
      'AI-powered insights',
      'Custom spending categories',
      'Export financial reports',
      'Priority support',
      'Advanced gamification',
      'Investment tracking',
    ],
    limitations: [],
  },
];

export default function UpgradeScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [upgrading, setUpgrading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const auth = getAuth();

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

  const handleUpgrade = async (planId) => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'Please log in to upgrade your plan.');
      return;
    }

    setUpgrading(true);
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        plan: planId,
        planUpgradedAt: new Date().toISOString(),
      });

      setCurrentPlan(planId);
      Alert.alert(
        'Success!',
        `You've successfully upgraded to ${plans.find(p => p.id === planId)?.name}!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Upgrade failed:', error);
      Alert.alert('Error', 'Failed to upgrade your plan. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const PlanCard = ({ plan, index }) => {
    const isSelected = selectedPlan === plan.id;
    const isCurrent = currentPlan === plan.id;
    
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.planCard,
            { borderColor: plan.color },
            plan.popular && styles.popularCard,
            isSelected && styles.selectedCard,
            isCurrent && styles.currentCard,
            pressed && styles.cardPressed,
          ]}
          onPress={() => setSelectedPlan(plan.id)}
        >
          {plan.popular && (
            <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
              <Text style={styles.popularText}>Most Popular</Text>
            </View>
          )}

          <View style={styles.planHeader}>
            <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            {plan.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#10b981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            {plan.limitations.map((limitation, idx) => (
              <View key={idx} style={styles.featureRow}>
                <MaterialCommunityIcons name="close-circle" size={16} color="#ef4444" />
                <Text style={[styles.featureText, styles.limitationText]}>{limitation}</Text>
              </View>
            ))}
          </View>

          {isCurrent ? (
            <View style={[styles.upgradeButton, styles.currentButton]}>
              <Text style={styles.currentButtonText}>Current Plan</Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.upgradeButton,
                { backgroundColor: plan.color },
                pressed && styles.upgradeButtonPressed,
                upgrading && styles.upgradeButtonDisabled,
              ]}
              onPress={() => handleUpgrade(plan.id)}
              disabled={upgrading}
            >
              <Text style={styles.upgradeButtonText}>
                {upgrading ? 'Upgrading...' : `Choose ${plan.name}`}
              </Text>
            </Pressable>
          )}
        </Pressable>
      </Animated.View>
    );
  };

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
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>Unlock powerful features to manage your finances better</Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </View>

        {/* Features Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Why Upgrade?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="robot" size={24} color="#6366f1" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>AI-Powered Insights</Text>
                <Text style={styles.benefitText}>Get personalized recommendations and spending analysis</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="television" size={24} color="#8b5cf6" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Subscription Detection</Text>
                <Text style={styles.benefitText}>Automatically track and manage your recurring payments</Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <MaterialCommunityIcons name="chart-line" size={24} color="#10b981" />
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Advanced Analytics</Text>
                <Text style={styles.benefitText}>Detailed spending trends and budget forecasting</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Money Back Guarantee */}
        <View style={styles.guaranteeCard}>
          <MaterialCommunityIcons name="shield-check" size={32} color="#10b981" />
          <Text style={styles.guaranteeTitle}>30-Day Money Back Guarantee</Text>
          <Text style={styles.guaranteeText}>Not satisfied? Get a full refund within 30 days, no questions asked.</Text>
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
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  plansContainer: {
    gap: 20,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  popularCard: {
    borderWidth: 3,
    transform: [{ scale: 1.02 }],
  },
  selectedCard: {
    borderWidth: 3,
  },
  currentCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  planName: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 36,
    fontFamily: 'OpenSans-Bold',
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#0f172a',
    marginLeft: 12,
    flex: 1,
  },
  limitationText: {
    color: '#64748b',
  },
  upgradeButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  upgradeButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  upgradeButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
  currentButton: {
    backgroundColor: '#10b981',
  },
  currentButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
  comparisonCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  comparisonTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitContent: {
    marginLeft: 16,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    lineHeight: 20,
  },
  guaranteeCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  guaranteeTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#065f46',
    marginTop: 12,
    marginBottom: 8,
  },
  guaranteeText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#065f46',
    textAlign: 'center',
    lineHeight: 20,
  },
});
