import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig';

const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const login = () => {
    if (!email || !password) {
      setMessage('Please enter email and password');
      setIsError(true);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage('Login successful!');
        setIsError(false);
        setTimeout(() => {
          navigation.navigate('Chatbot');
        }, 1500); // Show success message for 1.5 seconds before navigating
      })
      .catch(error => {
        setMessage(error.message);
        setIsError(true);
      });
  };

  const continueWithoutLogin = () => {
    navigation.navigate('Chatbot'); // Replace with your main screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        {message ? (
          <Text style={[
            styles.message,
            isError ? styles.errorMessage : styles.successMessage
          ]}>
            {message}
          </Text>
        ) : null}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <Button title="Login" onPress={login} />
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Signup')}
        >
          Don't have an account? Sign Up
        </Text>
        <TouchableOpacity onPress={continueWithoutLogin} style={styles.continueBtn}>
          <Text style={styles.continueText}>Continue without logging in</Text>
        </TouchableOpacity>
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
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(255,255,255,0.85)',
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
  title: {
    fontFamily: 'System',
    fontSize: 28,
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  message: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'System',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    fontFamily: 'System',
  },
  link: {
    color: '#6366f1',
    marginTop: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '500',
  },
  continueBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  continueText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
});
