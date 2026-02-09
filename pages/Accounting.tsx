import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, TransactionCategory, Student, Staff } from '../types';
import { Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Receipt } from 'lucide-react';

const Accounting: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: 'Income', category: TransactionCategory.STUDENT_FEES, amount: 0,
    date: new Date().toISOString().split('T')[0], description: '', studentId: '', staffId: ''
  });

  useEffect(() => {
    const unsubTx = onSnapshot(query(collection(db, 'transactions'), orderBy('date', 'desc'), limit(100)), (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student))));
    const unsubStaff = onSnapshot(collection(db, 'staff'), (snap) => setStaffList(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff))));
    return () => { unsubTx(); unsubStudents(); unsubStaff(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return alert('সঠিক টাকা লিখুন');
    try {
      await addDoc(collection(db, 'transactions'), { ...formData, amount: Number(formData.amount) });
      setIsFormOpen(false);
      setFormData({ type: 'Income', category: TransactionCategory.STUDENT_FEES, amount: 0, date: new Date().toISOString().split('T')[0], description: '', studentId: '', staffId: '' });
    } catch (err) { alert('ত্রুটি ঘটেছে'); }
  };

  const inputClass = "w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">হিসাব রক্ষণ</h2>
        <button onClick={() => setIsFormOpen(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"><Plus className="w-5 h-5 mr-2" /> নতুন এন্ট্রি</button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">লেনদেন যুক্ত করুন</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, type: 'Income'})} className={`py-2 rounded-lg border font-bold flex items-center justify-center ${formData.type === 'Income' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 text-gray-500'}`}><ArrowUpCircle className="w-4 h-4 mr-1" /> আয়</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'Expense'})} className={`py-2 rounded-lg border font-bold flex items-center justify-center ${formData.type === 'Expense' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-gray-50 text-gray-500'}`}><ArrowDownCircle className="w-4 h-4 mr-1" /> ব্যয়</button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">বিভাগ</label>
                <select className={inputClass} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, studentId: '', staffId: ''})}>
                  {Object.values(TransactionCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {formData.category === TransactionCategory.STUDENT_FEES && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">ছাত্র নির্বাচন করুন</label>
                  <select required className={inputClass} value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}>
                    <option value="">ছাত্র সিলেক্ট করুন</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.uid})</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">টাকার পরিমাণ (৳)</label>
                <input type="number" required className={inputClass} value={formData.amount || ''} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">তারিখ</label>
                <input type="date" required className={inputClass} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">বিবরণ</label>
                <textarea className={inputClass} rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg">সংরক্ষণ করুন</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <h4 className="font-bold text-gray-700 flex items-center"><Receipt className="w-5 h-5 mr-2 text-emerald-600" /> সাম্প্রতিক লেনদেন সমূহ</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-bold text-gray-600">তারিখ</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">বিভাগ ও বিবরণ</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">পরিমাণ</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-900">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('bn-BD')}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{tx.category}</p>
                    <p className="text-xs text-gray-400">{tx.description || '-'}</p>
                  </td>
                  <td className={`px-6 py-4 font-bold ${tx.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>৳ {tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await deleteDoc(doc(db, 'transactions', tx.id!)); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Accounting;