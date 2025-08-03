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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  },
  link: {
    color: 'blue',
    marginTop: 15,
    textAlign: 'center'
  }
});
