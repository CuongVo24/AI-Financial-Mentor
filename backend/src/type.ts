export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

// [THÊM MỚI] Enum cho quyền riêng tư
export enum PrivacyLevel {
  PUBLIC = 'PUBLIC',   // Hiện tất cả
  MASKED = 'MASKED',   // Che số tiền (??? đ)
  PRIVATE = 'PRIVATE'  // Chỉ mình tôi
}

export interface Transaction {
  id?: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  party: string;
  date?: string;
  rawContent?: string;
// [MỚI] Các trường phục vụ Social & Automation
  privacyLevel: PrivacyLevel;
  isGroupPotential: boolean;
  rawUiDump?: string; // Để debug Accessibility sau này
}

export interface ProcessedTransaction {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  note: string;
  party: string;
  confidence: number;
  isGroupPotential: boolean; //Cờ báo hiệu khả năng đi nhóm(Hiện Widget chia tiền)
}

export interface AnalyzeRequest {
  rawText: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string | object;
}
