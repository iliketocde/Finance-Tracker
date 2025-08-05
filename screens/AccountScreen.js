import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function AccountScreen({ navigation }) {
  const user = getAuth().currentUser;
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    try {
      await signOut(auth);
      // Navigation will be handled automatically by auth state change
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user logged in.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={[styles.label, { marginTop: 24 }]}>Balance:</Text>
      <TextInput
        style={styles.input}
        value={balance}
        keyboardType="numeric"
        onChangeText={setBalance}
        editable={!saving}
        placeholder="Enter your balance"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          saving && { backgroundColor: '#94a3b8' },
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Balance'}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0c4a6e',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Comic Sans MS',
  },
  label: {
    fontSize: 18,
    color: '#0369a1',
    marginBottom: 8,
    fontFamily: 'Comic Sans MS',
  },
  value: {
    fontSize: 20,
    color: '#1e40af',
    fontFamily: 'Comic Sans MS',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
    color: '#1e40af',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
  logoutButton: {
    marginTop: 40,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Comic Sans MS',
  },
});
