import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const settingsOptions = [
  { id: '1', title: 'Notifications', description: 'Manage your notification preferences' },
  { id: '2', title: 'Privacy', description: 'Control your privacy settings' },
  { id: '3', title: 'Security', description: 'Manage security options' },
  { id: '4', title: 'Data Export', description: 'Export your financial data' },
  { id: '5', title: 'Help & Support', description: 'Get help and contact support' },
  { id: '6', title: 'About', description: 'App version and information' },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your app preferences</Text>
      </View>

      {settingsOptions.map((option) => (
        <Pressable
          key={option.id}
          style={({ pressed }) => [
            styles.settingItem,
            pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
          ]}
        >
          <View>
            <Text style={styles.settingTitle}>{option.title}</Text>
            <Text style={styles.settingDescription}>{option.description}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 32,
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
});