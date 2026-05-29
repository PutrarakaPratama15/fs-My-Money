// File: types/budget.ts

export interface RawBudgetStatus {
  budget_category: string;
  allocated_amount: string; 
  total_spent: string;
  remaining_balance: string;
}

export interface CleanBudgetStatus {
  budgetCategory: string;
  allocatedAmount: number;
  totalSpent: number;
  remainingBalance: number;
}