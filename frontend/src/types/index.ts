// Định nghĩa các kiểu dữ liệu dùng chung cho cả App

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',
  MASKED = 'MASKED',
  PRIVATE = 'PRIVATE'
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  party: string;
  date: string;

  // Các trường phục vụ Social & AI
  privacyLevel: PrivacyLevel;
  isGroupPotential: boolean;
  confidence?: number;
}