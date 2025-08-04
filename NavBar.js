import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function NavBar({ navigation, isLoggedIn }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.navigate('Home')}>
        <Text style={styles.title}>Finance Tracker</Text>
      </Pressable>

      <View style={styles.rightButtons}>
        <Pressable
          onPress={() => navigation.navigate('SpendingInsights')}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>Spending Insights</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate(isLoggedIn ? 'Account' : 'Login')}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>{isLoggedIn ? 'Account' : 'Login / Signup'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6', // blue
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  rightButtons: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
