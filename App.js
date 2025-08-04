// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import HomeScreen from './screens/HomeScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import SpendingInsightsScreen from './screens/SpendingInsightsScreen';
import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createNativeStackNavigator();
const auth = getAuth();

function HeaderButtons({ navigation, isLoggedIn }) {
  return (
    <View style={styles.navRightButtons}>
      <Pressable
        style={styles.navButton}
        onPress={() => navigation.navigate('SpendingInsights')}
      >
        <Text style={styles.navButtonText}>Insights</Text>
      </Pressable>
      {isLoggedIn && (
        <Pressable
          style={styles.navButton}
          onPress={() => navigation.navigate('Account')}
        >
          <Text style={styles.navButtonText}>Account</Text>
        </Pressable>
      )}
      <Pressable
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.navButtonText}>{isLoggedIn ? 'Logout' : 'Login/Signup'}</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) return <Text>Loading...</Text>;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: 'OpenSans-Bold' },
          headerRight: () => <HeaderButtons navigation={navigation} isLoggedIn={isLoggedIn} />, 
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Finance Tracker' }} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="SpendingInsights" component={SpendingInsightsScreen} options={{ title: 'Spending Insights' }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'My Account' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  navRightButtons: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 8,
  },
  navButton: {
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
   container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  homeContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  homeHeading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  chatInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 32,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
});

 

  


 
