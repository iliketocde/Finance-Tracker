
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { db } from '../firebaseConfig';

export default function AccountScreen({ navigation }) {
  const { user, userProfile, logout } = useAuth();
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (!user) return;

    const fetchBalance = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBalance(data.balance?.toString() || '0');
        } else {
          setBalance('0');
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        Alert.alert('Error', 'Failed to load your balance.');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

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

  const handleSave = async () => {
    const numericBalance = parseFloat(balance);
    if (isNaN(numericBalance)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for balance.');
      return;
    }
    setSaving(true);

    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { balance: numericBalance }, { merge: true });
      Alert.alert('Success', 'Balance updated successfully.');
    } catch (error) {
      console.error('Failed to save balance:', error);
      Alert.alert('Error', 'Failed to update your balance.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Logout Failed', error.message);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <MaterialCommunityIcons name="account-off" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>No User Found</Text>
          <Text style={styles.errorText}>Please log in to view your account.</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading your account...</Text>
        </View>
      </View>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'User';

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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <MaterialCommunityIcons name="check" size={16} color="white" />
            </View>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          {/* Balance Card */}
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons name="wallet" size={20} color="#6366f1" />
              </View>
              <Text style={styles.settingTitle}>Current Balance</Text>
            </View>
            <TextInput
              style={styles.balanceInput}
              value={balance}
              keyboardType="numeric"
              onChangeText={setBalance}
              editable={!saving}
              placeholder="Enter your balance"
              placeholderTextColor="#9ca3af"
            />
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                saving && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialCommunityIcons name="content-save" size={18} color="white" />
              )}
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Balance'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsList}>
            <Pressable 
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
              onPress={() => navigation.navigate('Upgrade')}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="crown" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.actionText}>Upgrade Plan</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="cog" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="shield-check" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>Privacy & Security</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="help-circle" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>Help & Support</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            </Pressable>

            <Pressable 
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="information" size={20} color="#64748b" />
              </View>
              <Text style={styles.actionText}>About</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            </Pressable>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
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
  errorCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  loadingCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    marginTop: 16,
  },
  profileHeader: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'OpenSans-Bold',
    color: 'white',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  displayName: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
  },
  balanceInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
    color: '#0f172a',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.1,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
  },
  actionsList: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionItemPressed: {
    backgroundColor: '#f8fafc',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#0f172a',
  },
  logoutSection: {
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#ef4444',
  },
});
