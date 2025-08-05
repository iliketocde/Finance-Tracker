
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SavingGoalsScreen() {
  const [goals, setGoals] = useState([
    { id: 1, title: 'Emergency Fund', target: 5000, current: 2150, color: '#ef4444' },
    { id: 2, title: 'Vacation', target: 3000, current: 750, color: '#10b981' },
    { id: 3, title: 'New Car', target: 15000, current: 4500, color: '#6366f1' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: '0' });
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

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

  const totalTargets = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = totalTargets > 0 ? (totalSaved / totalTargets) * 100 : 0;

  const addGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal = {
        id: Date.now(),
        title: newGoal.title,
        target: parseFloat(newGoal.target),
        current: parseFloat(newGoal.current) || 0,
        color: ['#ef4444', '#10b981', '#6366f1', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', target: '', current: '0' });
      setModalVisible(false);
    }
  };

  const GoalCard = ({ goal, index }) => {
    const progress = (goal.current / goal.target) * 100;
    const [cardAnim] = useState(new Animated.Value(0.8));
    const [cardFade] = useState(new Animated.Value(0));

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
        }),
        Animated.spring(cardAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: index * 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          {
            opacity: cardFade,
            transform: [{ scale: cardAnim }],
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.goalCard,
            pressed && styles.goalCardPressed,
          ]}
        >
          <View style={styles.goalHeader}>
            <View style={styles.goalLeft}>
              <View style={[styles.goalIcon, { backgroundColor: `${goal.color}20` }]}>
                <MaterialCommunityIcons name="target" size={24} color={goal.color} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalProgress}>
                  ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.goalRight}>
              <Text style={styles.goalPercentage}>{progress.toFixed(0)}%</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: goal.color,
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.goalFooter}>
            <Text style={styles.remainingText}>
              ${(goal.target - goal.current).toLocaleString()} remaining
            </Text>
            <Pressable style={styles.addButton}>
              <MaterialCommunityIcons name="plus" size={16} color="#6366f1" />
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
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
          <Text style={styles.headerTitle}>Saving Goals</Text>
          <Text style={styles.headerSubtitle}>Track your financial milestones</Text>
        </View>

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Total Progress</Text>
            <Text style={styles.overviewPercentage}>{overallProgress.toFixed(1)}%</Text>
          </View>
          
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>${totalSaved.toLocaleString()}</Text>
              <Text style={styles.overviewStatLabel}>Total Saved</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewStatValue}>${totalTargets.toLocaleString()}</Text>
              <Text style={styles.overviewStatLabel}>Total Target</Text>
            </View>
          </View>
          
          <View style={styles.overviewProgressContainer}>
            <View style={styles.overviewProgressBackground}>
              <View 
                style={[
                  styles.overviewProgressFill,
                  { width: `${Math.min(overallProgress, 100)}%` }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Goals List */}
        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            <Pressable 
              style={styles.addGoalButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialCommunityIcons name="plus" size={20} color="white" />
              <Text style={styles.addGoalButtonText}>Add Goal</Text>
            </Pressable>
          </View>
          
          {goals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <MaterialCommunityIcons name="lightbulb" size={24} color="#f59e0b" />
            <Text style={styles.tipsTitle}>Saving Tip</Text>
          </View>
          <Text style={styles.tipsText}>
            Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment.
          </Text>
        </View>
      </Animated.View>

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Goal name (e.g., Emergency Fund)"
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({...newGoal, title: text})}
              placeholderTextColor="#9ca3af"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Target amount"
              value={newGoal.target}
              onChangeText={(text) => setNewGoal({...newGoal, target: text})}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Current amount (optional)"
              value={newGoal.current}
              onChangeText={(text) => setNewGoal({...newGoal, current: text})}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={styles.modalAddButton}
                onPress={addGoal}
              >
                <Text style={styles.modalAddText}>Add Goal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  overviewCard: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  overviewPercentage: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: 'white',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: 'white',
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  overviewProgressContainer: {
    marginTop: 8,
  },
  overviewProgressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overviewProgressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  goalsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  addGoalButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addGoalButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
  },
  goalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  goalCardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.04,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  goalRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalPercentage: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#6366f1',
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#0f172a',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#64748b',
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalAddText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: 'white',
  },
});
