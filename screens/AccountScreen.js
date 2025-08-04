import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

export default function AccountScreen() {
  const user = getAuth().currentUser;
  const db = getFirestore(getApp());
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const animatedBalance = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (!user) return;

    const fetchBalance = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        const newBalance = data.balance ?? 0;
        setBalance(newBalance);
        Animated.timing(animatedBalance, {
          toValue: newBalance,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user data found.</Text>
      </View>
    );
  }

  const initials = user.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Balance:</Text>
        <Animated.Text style={styles.balance}>
          ${animatedBalance.interpolate({
            inputRange: [0, balance],
            outputRange: [0, balance],
            extrapolate: 'clamp',
          }).__getValue().toFixed(2)}
        </Animated.Text>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // dark background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 30,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    backdropFilter: Platform.OS === 'web' ? 'blur(20px)' : undefined,
  },
  avatar: {
    backgroundColor: '#6366f1',
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#d1d5db',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  balance: {
    fontSize: 32,
    color: '#10b981',
    fontWeight: '700',
    marginVertical: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 20,
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
