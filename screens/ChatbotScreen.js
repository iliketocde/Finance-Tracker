import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable, Image } from 'react-native';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);

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
    <View style={[styles.messageRow, item.isUser ? styles.userRow : styles.botRow]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <Image source={require('../assets/icon.png')} style={styles.avatar} />
        </View>
      )}
      <View style={[styles.message, item.isUser ? styles.userMsg : styles.botMsg]}>
        <Text style={styles.msgText}>{item.text}</Text>
      </View>
      {item.isUser && (
        <View style={styles.avatarContainer}>
          <Image source={require('../assets/favicon.png')} style={styles.avatar} />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}>
        <Text style={styles.title}>Finance Tracker</Text>
      </Pressable>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
    backgroundColor: '#f9fafb',
    paddingTop: 40,
  },
  title: {
    fontFamily: 'System',
    fontSize: 24,
    color: '#6366f1',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.2,
    textDecorationLine: 'underline',
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 6,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  message: {
    padding: 10,
    borderRadius: 16,
    maxWidth: '70%',
    minWidth: 40,
  },
  userMsg: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#E3E3E3',
    alignSelf: 'flex-start',
  },
  msgText: {
    fontSize: 16,
    color: '#111827',
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
