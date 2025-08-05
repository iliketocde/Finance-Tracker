
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: 'food', color: '#ef4444' },
  { id: 'transport', name: 'Transportation', icon: 'car', color: '#06b6d4' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping', color: '#ec4899' },
  { id: 'entertainment', name: 'Entertainment', icon: 'movie', color: '#8b5cf6' },
  { id: 'healthcare', name: 'Healthcare', icon: 'medical-bag', color: '#10b981' },
  { id: 'utilities', name: 'Utilities', icon: 'home', color: '#f59e0b' },
  { id: 'groceries', name: 'Groceries', icon: 'cart', color: '#059669' },
  { id: 'gas', name: 'Gas', icon: 'gas-station', color: '#dc2626' },
  { id: 'coffee', name: 'Coffee', icon: 'coffee', color: '#92400e' },
  { id: 'other', name: 'Other', icon: 'tag', color: '#64748b' },
];

export default function ExpenseForm({ visible, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleSubmit = async () => {
    if (!amount || !selectedCategory || !auth.currentUser) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'expenses'), {
        userId: auth.currentUser.uid,
        amount: parseFloat(amount),
        category: selectedCategory.name,
        description: description.trim(),
        timestamp: new Date(),
        isSubscription: false, // Can be detected later
      });

      Alert.alert('Success', 'Expense added successfully!');
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setSelectedCategory(null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#64748b" />
          </Pressable>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={setDescription}
              placeholder="What did you spend on?"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory?.id === category.id && styles.selectedCategory,
                    { borderColor: category.color },
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                    <MaterialCommunityIcons name={category.icon} size={20} color={category.color} />
                  </View>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory?.id === category.id && styles.selectedCategoryText,
                  ]}>
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitButton,
              (!amount || !selectedCategory || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!amount || !selectedCategory || loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
    marginBottom: 8,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#6366f1',
    paddingLeft: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#0f172a',
    padding: 16,
    paddingLeft: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: '45%',
  },
  selectedCategory: {
    borderWidth: 2,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: '#64748b',
    flex: 1,
  },
  selectedCategoryText: {
    fontFamily: 'OpenSans-SemiBold',
    color: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
});
