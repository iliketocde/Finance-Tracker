// Mock database.js for development/demo purposes
export async function fetchTransactions() {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));
  // Return mock data
  return [
    { amount: 120, category: 'Groceries' },
    { amount: 80, category: 'Dining' },
    { amount: 60, category: 'Transport' },
    { amount: 40, category: 'Entertainment' },
    { amount: 30, category: 'Groceries' },
  ];
}
