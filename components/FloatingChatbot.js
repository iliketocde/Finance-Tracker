
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Animated, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FloatingChatbot({ navigation }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your finance assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [slideAnim] = useState(new Animated.Value(0));

  const toggleChat = () => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    Keyboard.dismiss();

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I understand you're asking about " + message + ". Let me help you with that!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const openFullChat = () => {
    setIsOpen(false);
    navigation.navigate('Chatbot');
  };

  if (!isOpen) {
    return (
      <Pressable style={styles.floatingButton} onPress={toggleChat}>
        <MaterialCommunityIcons name="robot" size={28} color="white" />
      </Pressable>
    );
  }

  return (
    <Animated.View 
      style={[
        styles.chatContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Header */}
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderLeft}>
          <MaterialCommunityIcons name="robot" size={20} color="white" />
          <Text style={styles.chatHeaderTitle}>AI Assistant</Text>
        </View>
        <View style={styles.chatHeaderRight}>
          <Pressable style={styles.headerButton} onPress={openFullChat}>
            <MaterialCommunityIcons name="fullscreen" size={16} color="white" />
          </Pressable>
          <Pressable style={styles.headerButton} onPress={toggleChat}>
            <MaterialCommunityIcons name="close" size={16} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((msg) => (
          <View key={msg.id} style={[
            styles.messageRow,
            msg.sender === 'user' ? styles.userMessageRow : styles.botMessageRow
          ]}>
            <View style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.messageText,
                msg.sender === 'user' ? styles.userText : styles.botText
              ]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me anything..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable 
          style={[styles.sendButton, message.trim() === '' && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={message.trim() === ''}
        >
          <MaterialCommunityIcons name="send" size={20} color="white" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  chatHeader: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    marginLeft: 8,
  },
  chatHeaderRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  messagesContent: {
    gap: 8,
  },
  messageRow: {
    flexDirection: 'row',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#6366f1',
  },
  botBubble: {
    backgroundColor: '#f1f5f9',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    lineHeight: 18,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#0f172a',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});
