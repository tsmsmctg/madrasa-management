
export interface Student {
  id?: string;
  uid: string; // অটোমেটিক ইউনিক আইডি
  name: string;
  roll: string;
  class: string;
  type: 'Residential' | 'Non-Residential';
  fatherName: string;
  motherName: string;
  mobile: string;
  createdAt: any;
}

export interface Staff {
  id?: string;
  name: string;
  designation: string;
  mobile: string;
  salary: number;
  createdAt: any;
}

export interface Transaction {
  id?: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  studentId?: string; // নির্দিষ্ট ছাত্রের সাথে যুক্ত
  staffId?: string;   // নির্দিষ্ট শিক্ষকের সাথে যুক্ত
}

export interface InventoryItem {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: any;
}

export enum TransactionCategory {
  STUDENT_FEES = 'ছাত্র বেতন',
  DONATION_GENERAL = 'অনুদান (সাধারণ)',
  DONATION_LILLAH = 'অনুদান (লিল্লাহ)',
  KITCHEN_MARKET = 'কিচেন বাজার',
  TEACHER_SALARY = 'শিক্ষক বেতন',
  STAFF_SALARY = 'কর্মচারী বেতন',
  OTHERS = 'অন্যান্য'
}
