
import React from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  startDate: string;
  endDate: string;
}

const PrintReport: React.FC<Props> = ({ transactions, startDate, endDate }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] shadow-none print:shadow-none print:p-0">
      {/* Header */}
      <div className="text-center border-b-2 border-emerald-800 pb-4 mb-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-1">তাহেরিয়া সাবেরিয়া মঞ্জুয়ারা সুন্নিয়া মাদ্রাসা</h1>
        <p className="text-sm text-gray-700 font-medium">উত্তর হালিশহর ফুল চৌধুরী পাড়া, সুন্নিয়া মাদ্রাসা রোড, ২৬নং ওয়ার্ড, হালিশহর, চট্টগ্রাম।</p>
        <div className="mt-4 inline-block bg-gray-100 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-200">
          আয়-ব্যয় রিপোর্ট
        </div>
        <p className="text-xs text-gray-500 mt-2">
          সময়সীমা: {new Date(startDate).toLocaleDateString('bn-BD')} হতে {new Date(endDate).toLocaleDateString('bn-BD')} পর্যন্ত
        </p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border p-4 rounded text-center">
          <p className="text-xs text-gray-500 uppercase font-bold">মোট আয়</p>
          <p className="text-xl font-bold text-green-700">৳ {totalIncome.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded text-center">
          <p className="text-xs text-gray-500 uppercase font-bold">মোট ব্যয়</p>
          <p className="text-xl font-bold text-red-700">৳ {totalExpense.toLocaleString()}</p>
        </div>
        <div className="border p-4 rounded text-center bg-gray-50">
          <p className="text-xs text-gray-500 uppercase font-bold">নীট ব্যালেন্স</p>
          <p className="text-xl font-bold text-emerald-800">৳ {(totalIncome - totalExpense).toLocaleString()}</p>
        </div>
      </div>

      {/* Details Table */}
      <table className="w-full text-sm border-collapse mb-12">
        <thead>
          <tr className="bg-emerald-800 text-white">
            <th className="border border-emerald-800 px-3 py-2 text-left">তারিখ</th>
            <th className="border border-emerald-800 px-3 py-2 text-left">বিবরণ (বিভাগ)</th>
            <th className="border border-emerald-800 px-3 py-2 text-right">আয় (৳)</th>
            <th className="border border-emerald-800 px-3 py-2 text-right">ব্যয় (৳)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, idx) => (
            <tr key={t.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border px-3 py-2">{new Date(t.date).toLocaleDateString('bn-BD')}</td>
              <td className="border px-3 py-2">
                <span className="font-bold">{t.description || 'N/A'}</span>
                <span className="text-[10px] block text-emerald-700 font-medium">[{t.category}]</span>
              </td>
              <td className="border px-3 py-2 text-right font-medium">
                {t.type === 'Income' ? t.amount.toLocaleString() : '-'}
              </td>
              <td className="border px-3 py-2 text-right font-medium">
                {t.type === 'Expense' ? t.amount.toLocaleString() : '-'}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-100">
            <td colSpan={2} className="border px-3 py-2 text-right">সর্বমোট:</td>
            <td className="border px-3 py-2 text-right text-green-700">{totalIncome.toLocaleString()}</td>
            <td className="border px-3 py-2 text-right text-red-700">{totalExpense.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      {/* Signature Section */}
      <div className="mt-20 flex justify-between px-10">
        <div className="text-center">
          <div className="w-40 border-t border-black mb-1"></div>
          <p className="text-sm font-bold">হিসাব রক্ষক</p>
        </div>
        <div className="text-center">
          <div className="w-40 border-t border-black mb-1"></div>
          <p className="text-sm font-bold">কর্তৃপক্ষের স্বাক্ষর</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-[10px] text-gray-400">
        রিপোর্ট তৈরির সময়: {new Date().toLocaleString('bn-BD')} | মাদ্রাসা অটোমেশন সিস্টেম
      </div>
    </div>
  );
};

export default PrintReport;
