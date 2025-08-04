import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth';

export default function AccountScreen() {
  const user = getAuth().currentUser;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      {/* Add more user info here if needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 8,
  },
});
