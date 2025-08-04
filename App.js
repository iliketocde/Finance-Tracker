
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import AccountScreen from './screens/AccountScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Chatbot"
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 22 },
          headerTitleAlign: 'left',
        }}
      >
        <Stack.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <Text style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 22 }}>Finance Tracker</Text>
            ),
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SpendingInsights')}
                  style={{ marginRight: 10, padding: 6, borderRadius: 6, backgroundColor: '#007AFF' }}
                >
                  <Text style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 16 }}>Spending Insights</Text>
                </TouchableOpacity>
                {user ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Account')}
                    style={{ marginRight: 10, padding: 6, borderRadius: 6, backgroundColor: '#6366f1' }}
                  >
                    <Text style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 16 }}>Account</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    style={{ marginRight: 10, padding: 6, borderRadius: 6, backgroundColor: '#34A853' }}
                  >
                    <Text style={{ color: '#fff', fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 16 }}>Login/Signup</Text>
                  </TouchableOpacity>
                )}
              </View>
            ),
            headerLeft: () => null,
          })}
        />
        <Stack.Screen name="SpendingInsights" component={require('./screens/SpendingInsightsScreen').default} options={{
          headerTitle: 'Spending Insights',
          headerTitleStyle: { fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: 22 },
        }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
