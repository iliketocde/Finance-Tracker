
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const SettingItem = ({ icon, title, subtitle, onPress, showSwitch, switchValue, onSwitchChange }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed
      ]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons name={icon} size={24} color="#6366f1" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
          thumbColor={switchValue ? '#6366f1' : '#f3f4f6'}
        />
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#9ca3af" />
      )}
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="bell-outline"
          title="Notifications"
          subtitle="Get alerts for spending and goals"
          showSwitch={true}
          switchValue={notifications}
          onSwitchChange={setNotifications}
        />
        <SettingItem
          icon="weather-night"
          title="Dark Mode"
          subtitle="Switch to dark theme"
          showSwitch={true}
          switchValue={darkMode}
          onSwitchChange={setDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <SettingItem
          icon="export"
          title="Export Data"
          subtitle="Download your financial data"
          onPress={() => {}}
        />
        <SettingItem
          icon="shield-check-outline"
          title="Privacy Settings"
          subtitle="Manage your privacy preferences"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help with the app"
          onPress={() => {}}
        />
        <SettingItem
          icon="information-outline"
          title="About"
          subtitle="App version and info"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontFamily: 'OpenSans-Bold',
    color: '#111827',
    marginBottom: 30,
    marginTop: 10,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-SemiBold',
    color: '#374151',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItemPressed: {
    backgroundColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
});
