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
    backgroundColor: '#fff', // Changed to white background
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    color: '#6366f1', // Changed to indigo for good contrast on white
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  botRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginHorizontal: 6,
    backgroundColor: '#e5e7eb', // lighter background for avatars on white
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  message: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '72%',
    minWidth: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(0,0,0,0.05)', // subtle light glass effect for messages
  },
  userMsg: {
    backgroundColor: '#6366f1', // Indigo solid for user messages
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: 'rgba(243,244,246,0.8)', // light grey glass effect for bot messages
    alignSelf: 'flex-start',
  },
  msgText: {
    fontSize: 16,
    color: '#111827', // dark text on light backgrounds
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f3f4f6', // light grey background for input container
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#111827',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});


