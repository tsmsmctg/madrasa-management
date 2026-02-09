
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction } from '../types';
import { Printer, Calendar, FileDown } from 'lucide-react';
import PrintReport from '../components/PrintReport';

const Reports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'transactions'),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc')
      );
      const snap = await getDocs(q);
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    } catch (err) {
      console.error(err);
      alert('রিপোর্ট তৈরিতে সমস্যা হয়েছে');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="no-print space-y-6">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">রিপোর্ট জেনারেটর</h2>
          <div className="flex gap-2">
            <button 
              onClick={fetchReports}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
            >
              <Calendar className="w-4 h-4 mr-2" /> লোড করুন
            </button>
            <button 
              onClick={handlePrint}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
            >
              <Printer className="w-4 h-4 mr-2" /> প্রিন্ট করুন
            </button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">শুরুর তারিখ</label>
            <input 
              type="date" 
              className="w-full border rounded-lg px-4 py-2" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-600">শেষের তারিখ</label>
            <input 
              type="date" 
              className="w-full border rounded-lg px-4 py-2" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Printable Area */}
      <div className="print-only-container">
        <PrintReport 
          transactions={transactions} 
          startDate={startDate} 
          endDate={endDate} 
        />
      </div>
    </div>
  );
};

export default Reports;
