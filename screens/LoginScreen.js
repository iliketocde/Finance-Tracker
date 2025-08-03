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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  message: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  successMessage: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10, borderRadius: 5 },
  link: { color: 'blue', marginTop: 15, textAlign: 'center' },
  continueBtn: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  continueText: {
    color: '#333',
  },
});
