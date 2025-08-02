import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig';

const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Success', 'Logged in!');
        navigation.navigate('Chatbot'); // Replace with your main screen
      })
      .catch(error => {
        Alert.alert('Login Failed', error.message);
      });
  };

  const continueWithoutLogin = () => {
    navigation.navigate('Chatbot'); // Replace with your main screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
