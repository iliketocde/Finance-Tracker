import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Finance Tracker!</Text>
      <Button title="Go to Chatbot" onPress={() => navigation.navigate('Chatbot')} />
    </View>
  );
}
