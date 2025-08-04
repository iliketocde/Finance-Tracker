import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Expo vector icons
import { queryOpenRouter } from '../aiApi'; // <-- Adjust path as needed

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;

    setLoading(true);

    const userMsg = { id: Date.now().toString(), text: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const aiResponse = await queryOpenRouter(input);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: aiResponse || "Sorry, I couldn't get a response right now.",
        isUser: false,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, something went wrong.",
        isUser: false,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageRow, item.isUser ? styles.userRow : styles.botRow]}>
      {!item.isUser && (
        <View style={styles.avatarContainer}>
          <Image source={require('../assets/icon.png')} style={styles.avatar} />
        </View>
      )}
      <View style={[styles.message, item.isUser ? styles.userMsg : styles.botMsg]}>
        <Text style={[styles.msgText, item.isUser && { color: '#fff' }]}>{item.text}</Text>
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
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          style={styles.input}
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          placeholderTextColor="#7a8fa6"
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
            loading && { opacity: 0.5 },
          ]}
          onPress={sendMessage}
          disabled={loading}
          android_ripple={{ color: '#4f83cc' }}
        >
          <MaterialCommunityIcons
            name="send-circle"
            size={36}
            color={loading ? '#a0bce6' : '#3b82f6'}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },
  title: {
    fontSize: 24,
    color: '#0284c7', // Sky blue
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Comic Sans MS',
      android: 'Comic Sans MS', // fallback for android, may not be exact
      default: 'System',
    }),
    textTransform: 'uppercase',
  },
  chatContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
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
    marginHorizontal: 8,
    backgroundColor: '#cce4ff', // light sky blue background for avatar
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  message: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 50, // large to make oval shape
    maxWidth: '72%',
    minWidth: 60,
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  userMsg: {
    backgroundColor: '#3b82f6', // Blue
    alignSelf: 'flex-end',
  },
  botMsg: {
    backgroundColor: '#bae6fd', // Sky blue light bubble
    alignSelf: 'flex-start',
  },
  msgText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Comic Sans MS',
      android: 'Comic Sans MS',
      default: 'System',
    }),
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 14,
    backgroundColor: '#e0f2fe', // very light sky blue background
    borderTopWidth: 1,
    borderTopColor: '#bae6fd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#7dd3fc',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Comic Sans MS',
      android: 'Comic Sans MS',
      default: 'System',
    }),
    color: '#0c4a6e', // dark blue text
    backgroundColor: '#ffffff',
  },
  sendButton: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
