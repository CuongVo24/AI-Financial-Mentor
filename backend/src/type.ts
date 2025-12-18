export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
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
}

export interface ProcessedTransaction {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  note: string;
  party: string;
  confidence: number;
}

export interface AnalyzeRequest {
  rawText: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string | object;
}
