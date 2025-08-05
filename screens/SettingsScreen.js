
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const SettingItem = ({ icon, title, subtitle, rightComponent, onPress, style }) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        pressed && styles.settingItemPressed,
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <MaterialCommunityIcons name={icon} size={20} color="#6366f1" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </Pressable>
  );

  const SettingSection = ({ title, children, style }) => (
    <View style={[styles.section, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.settingGroup}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Animated.View 
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>

        {/* Preferences */}
        <SettingSection title="Preferences">
          <SettingItem
            icon="bell"
            title="Notifications"
            subtitle="Get notified about spending alerts"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#e2e8f0', true: '#a5b4fc' }}
                thumbColor={notifications ? '#6366f1' : '#f1f5f9'}
                ios_backgroundColor="#e2e8f0"
              />
            }
          />
          
          <SettingItem
            icon="weather-night"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#e2e8f0', true: '#a5b4fc' }}
                thumbColor={darkMode ? '#6366f1' : '#f1f5f9'}
                ios_backgroundColor="#e2e8f0"
              />
            }
          />

          <SettingItem
            icon="fingerprint"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            rightComponent={
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: '#e2e8f0', true: '#a5b4fc' }}
                thumbColor={biometric ? '#6366f1' : '#f1f5f9'}
                ios_backgroundColor="#e2e8f0"
              />
            }
          />

          <SettingItem
            icon="backup-restore"
            title="Auto Backup"
            subtitle="Automatically backup your data"
            rightComponent={
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
                trackColor={{ false: '#e2e8f0', true: '#a5b4fc' }}
                thumbColor={autoBackup ? '#6366f1' : '#f1f5f9'}
                ios_backgroundColor="#e2e8f0"
              />
            }
            style={{ borderBottomWidth: 0 }}
          />
        </SettingSection>

        {/* Account */}
        <SettingSection title="Account">
          <SettingItem
            icon="account-edit"
            title="Edit Profile"
            subtitle="Update your personal information"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
          />

          <SettingItem
            icon="shield-check"
            title="Privacy & Security"
            subtitle="Manage your privacy settings"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
          />

          <SettingItem
            icon="credit-card"
            title="Payment Methods"
            subtitle="Manage cards and accounts"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
            style={{ borderBottomWidth: 0 }}
          />
        </SettingSection>

        {/* Data & Storage */}
        <SettingSection title="Data & Storage">
          <SettingItem
            icon="download"
            title="Export Data"
            subtitle="Download your financial data"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
          />

          <SettingItem
            icon="delete"
            title="Clear Cache"
            subtitle="Free up storage space"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
            style={{ borderBottomWidth: 0 }}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingItem
            icon="help-circle"
            title="Help Center"
            subtitle="Get answers to common questions"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
          />

          <SettingItem
            icon="message"
            title="Contact Support"
            subtitle="Get in touch with our team"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
          />

          <SettingItem
            icon="star"
            title="Rate App"
            subtitle="Help us improve the app"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
          />

          <SettingItem
            icon="information"
            title="About"
            subtitle="App version and legal info"
            rightComponent={
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9ca3af" />
            }
            style={{ borderBottomWidth: 0 }}
          />
        </SettingSection>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Finance Tracker v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Finance Tracker. All rights reserved.</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  animatedContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingGroup: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingItemPressed: {
    backgroundColor: '#f8fafc',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    padding: 20,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    color: '#6366f1',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: '#9ca3af',
    textAlign: 'center',
  },
});
