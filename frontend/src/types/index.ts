// From backend/src/type.ts

export enum TransactionType { 
  INCOME = 'INCOME', 
  EXPENSE = 'EXPENSE' 
}

export enum PrivacyLevel { 
  PUBLIC = 'PUBLIC',   // Show Amount + Note
  MASKED = 'MASKED',   // Hide Amount (??? đ) + Show Note
  PRIVATE = 'PRIVATE'  // Hide everything
}

export interface Transaction {
  id?: string;
  amount: number;      // e.g., 50000
  type: TransactionType;
  category: string;    // e.g., "Food & Drink"
  note: string;        // e.g., "Highlands Coffee"
  party: string;       // e.g., "Highlands"
  date?: string;       // ISO String
  
  // Critical for Social Logic
  privacyLevel: PrivacyLevel;
  isGroupPotential: boolean; // If true -> Show "Split Bill" widget
}