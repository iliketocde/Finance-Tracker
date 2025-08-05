
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import DashboardScreen from './screens/DashboardScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import SpendingInsightsScreen from './screens/SpendingInsightsScreen';
import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import SettingsScreen from './screens/SettingsScreen';
import SavingGoalsScreen from './screens/SavingGoalsScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import LoadingScreen from './components/LoadingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'chart-line' : 'chart-line';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'target' : 'target';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#e2e8f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'OpenSans-SemiBold',
          fontSize: 12,
        },
        headerStyle: { backgroundColor: '#6366f1' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: 'OpenSans-Bold' },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Finance Tracker' }}
      />
      <Tab.Screen 
        name="Insights" 
        component={SpendingInsightsScreen} 
        options={{ title: 'Spending Insights' }}
      />
      <Tab.Screen 
        name="Goals" 
        component={SavingGoalsScreen} 
        options={{ title: 'Saving Goals' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={AccountScreen} 
        options={{ title: 'My Account' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: 'OpenSans-Bold' },
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Upgrade" 
              component={UpgradeScreen} 
              options={{ title: 'Upgrade Plan' }}
            />
            <Stack.Screen 
              name="Chatbot" 
              component={ChatbotScreen}
              options={{ title: 'AI Assistant' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Signup" 
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSans-SemiBold': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    'OpenSans-Bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
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
});
