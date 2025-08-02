import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;

    const userMsg = { id: Date.now().toString(), text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: `You said: "${input}". Great question! 💡`,
        isUser: false,
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.isUser ? styles.userMsg : styles.botMsg]}>
      <Text style={styles.msgText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f2f2f2',
  },
  chatContainer: {
    padding: 10,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMsg: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#E3E3E3',
    alignSelf: 'flex-start',
  },
  msgText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
