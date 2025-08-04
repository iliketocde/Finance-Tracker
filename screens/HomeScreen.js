import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.centeredContent}>
        <View style={styles.card}>
          <Text style={styles.header}>Welcome to Finance Tracker!</Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Text style={styles.buttonText}>Go to Chatbot</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    padding: 16,
  },
  centeredContent: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 32,
    padding: 28,
    marginVertical: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
    backdropFilter: 'blur(12px)', // frosted glass effect (web only)
    alignItems: 'center',
  },
  header: {
    fontFamily: 'System',
    fontSize: 28,
    color: '#111827',
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    transitionDuration: '150ms',
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: 'ease',
  },
  buttonPressed: {
    backgroundColor: '#3b82f6',
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: 0.1,
  },
});
