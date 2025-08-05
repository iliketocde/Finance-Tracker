
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const DAILY_CHALLENGES = [
  {
    id: 'no_coffee',
    title: 'Skip the Coffee Shop',
    description: 'Avoid spending on coffee today',
    icon: 'coffee-off',
    reward: 'Caffeine Saver Badge',
    points: 10,
    type: 'daily'
  },
  {
    id: 'under_budget',
    title: 'Stay Under $20',
    description: 'Keep daily spending under $20',
    icon: 'cash-multiple',
    reward: 'Budget Master Badge',
    points: 15,
    type: 'daily'
  },
  {
    id: 'no_subscriptions',
    title: 'No New Subscriptions',
    description: 'Resist signing up for new services',
    icon: 'television-off',
    reward: 'Subscription Stopper Badge',
    points: 20,
    type: 'daily'
  }
];

const WEEKLY_CHALLENGES = [
  {
    id: 'meal_prep',
    title: 'Meal Prep Week',
    description: 'Cook at home 5 days this week',
    icon: 'chef-hat',
    reward: 'Master Chef Badge',
    points: 50,
    type: 'weekly'
  },
  {
    id: 'transportation',
    title: 'Eco Commuter',
    description: 'Use public transport or walk for 3 days',
    icon: 'bus',
    reward: 'Green Commuter Badge',
    points: 30,
    type: 'weekly'
  }
];

export default function ChallengesSection() {
  const [challenges, setChallenges] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [streaks, setStreaks] = useState({ daily: 0, weekly: 0 });
  const [fadeAnim] = useState(new Animated.Value(0));
  const auth = getAuth();

  useEffect(() => {
    loadUserChallenges();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadUserChallenges = async () => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProgress(data.challengeProgress || {});
        setStreaks(data.streaks || { daily: 0, weekly: 0 });
      }

      // Set today's challenges
      const today = new Date().toDateString();
      const todayChallenges = DAILY_CHALLENGES.map(challenge => ({
        ...challenge,
        date: today,
        completed: userProgress[`${challenge.id}_${today}`]?.completed || false
      }));

      setChallenges([...todayChallenges, ...WEEKLY_CHALLENGES]);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const completeChallenge = async (challenge) => {
    if (!auth.currentUser) return;

    const challengeKey = `${challenge.id}_${challenge.date || 'weekly'}`;
    const newProgress = {
      ...userProgress,
      [challengeKey]: {
        completed: true,
        completedAt: new Date().toISOString(),
        points: challenge.points
      }
    };

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        challengeProgress: newProgress,
        totalPoints: (userProgress.totalPoints || 0) + challenge.points
      });

      setUserProgress(newProgress);
      
      // Show reward popup
      Alert.alert(
        '🎉 Challenge Complete!',
        `You earned ${challenge.points} points and the "${challenge.reward}"!`,
        [{ text: 'Awesome!', style: 'default' }]
      );

      // Check for streaks
      checkStreaks(newProgress);
    } catch (error) {
      console.error('Error completing challenge:', error);
      Alert.alert('Error', 'Failed to complete challenge. Please try again.');
    }
  };

  const checkStreaks = (progress) => {
    // Count consecutive daily challenges
    const today = new Date();
    let dailyStreak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const dayCompleted = DAILY_CHALLENGES.some(challenge => 
        progress[`${challenge.id}_${dateString}`]?.completed
      );
      
      if (dayCompleted) {
        dailyStreak++;
      } else {
        break;
      }
    }

    if (dailyStreak > streaks.daily) {
      setStreaks(prev => ({ ...prev, daily: dailyStreak }));
      
      if (dailyStreak === 3 || dailyStreak === 7 || dailyStreak === 30) {
        Alert.alert(
          '🔥 Streak Milestone!',
          `Amazing! You've completed challenges for ${dailyStreak} days in a row!`,
          [{ text: 'Keep it up!', style: 'default' }]
        );
      }
    }
  };

  const ChallengeCard = ({ challenge, index }) => {
    const isCompleted = userProgress[`${challenge.id}_${challenge.date || 'weekly'}`]?.completed;
    
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.challengeCard, isCompleted && styles.completedCard]}>
          <View style={styles.challengeHeader}>
            <View style={[styles.challengeIcon, { backgroundColor: isCompleted ? '#10b981' : '#6366f1' }]}>
              <MaterialCommunityIcons 
                name={isCompleted ? 'check' : challenge.icon} 
                size={24} 
                color="white" 
              />
            </View>
            <View style={styles.challengeInfo}>
              <Text style={[styles.challengeTitle, isCompleted && styles.completedText]}>
                {challenge.title}
              </Text>
              <Text style={styles.challengeDescription}>{challenge.description}</Text>
            </View>
            <View style={styles.challengePoints}>
              <Text style={styles.pointsText}>{challenge.points}pts</Text>
            </View>
          </View>
          
          <View style={styles.challengeFooter}>
            <View style={styles.rewardContainer}>
              <MaterialCommunityIcons name="trophy" size={16} color="#f59e0b" />
              <Text style={styles.rewardText}>{challenge.reward}</Text>
            </View>
            
            {!isCompleted && (
              <Pressable
                style={({ pressed }) => [
                  styles.completeButton,
                  pressed && styles.completeButtonPressed,
                ]}
                onPress={() => completeChallenge(challenge)}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  const totalPoints = Object.values(userProgress).reduce((sum, progress) => sum + (progress.points || 0), 0);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Daily Challenges</Text>
        <View style={styles.streakContainer}>
          <MaterialCommunityIcons name="fire" size={20} color="#ef4444" />
          <Text style={styles.streakText}>{streaks.daily} day streak</Text>
        </View>
      </View>

      {/* Points Display */}
      <View style={styles.pointsCard}>
        <MaterialCommunityIcons name="star" size={24} color="#f59e0b" />
        <Text style={styles.totalPointsText}>{totalPoints} Total Points</Text>
      </View>

      {/* Challenges List */}
      <View style={styles.challengesList}>
        {challenges.map((challenge, index) => (
          <ChallengeCard key={`${challenge.id}_${challenge.date || 'weekly'}`} challenge={challenge} index={index} />
        ))}
      </View>

      {/* Streak Rewards */}
      {streaks.daily >= 3 && (
        <View style={styles.streakReward}>
          <MaterialCommunityIcons name="trophy-award" size={32} color="#f59e0b" />
          <Text style={styles.streakRewardTitle}>Streak Bonus!</Text>
          <Text style={styles.streakRewardText}>
            Keep up your {streaks.daily}-day streak to unlock exclusive rewards!
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
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
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#dc2626',
    marginLeft: 4,
  },
  pointsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  totalPointsText: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#92400e',
    marginLeft: 8,
  },
  challengesList: {
    gap: 12,
  },
  challengeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#10b981',
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  challengePoints: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pointsText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Bold',
    color: '#6366f1',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#92400e',
    marginLeft: 4,
  },
  completeButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  completeButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
  },
  streakReward: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  streakRewardTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#92400e',
    marginTop: 8,
    marginBottom: 4,
  },
  streakRewardText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
  },
});
