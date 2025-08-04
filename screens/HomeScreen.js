import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [input, setInput] = useState('');

  const onSubmit = () => {
    if (input.trim() === '') return;
    Keyboard.dismiss();
    navigation.navigate('Chatbot', { initialMessage: input.trim() });
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Finance Tracker!</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask me anything..."
        value={input}
        onChangeText={setInput}
        onSubmitEditing={onSubmit}
        returnKeyType="send"
        placeholderTextColor="#7a8fa6"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          input.trim() === '' && styles.buttonDisabled,
        ]}
        onPress={onSubmit}
        disabled={input.trim() === ''}
      >
        <Text style={styles.buttonText}>Ask</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 36,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: '#6366f1',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    fontSize: 18,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: '#3b82f6',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
});
