import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig';

const auth = getAuth(app);

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const signup = () => {
    if (!email || !password) {
      setMessage('Please enter email and password');
      setIsError(true);
      return;
    }

    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address');
      setIsError(true);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setIsError(true);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage('Account created successfully!');
        setIsError(false);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      })
      .catch(error => {
        console.log('Signup error:', error);
        setMessage(error.message);
        setIsError(true);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
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
        <Button title="Sign Up" onPress={signup} />
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account? Log In
        </Text>
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
});
