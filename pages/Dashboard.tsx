
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Banknote,
  CalendarDays
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    currentCash: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
      setStats(prev => ({ ...prev, totalStudents: snap.size }));
    });

    const unsubTransactions = onSnapshot(collection(db, 'transactions'), (snap) => {
      let income = 0;
      let expense = 0;
      let totalIncomeAllTime = 0;
      let totalExpenseAllTime = 0;

      const monthlyDataMap: { [key: string]: { income: number; expense: number } } = {};

      snap.docs.forEach(doc => {
        const data = doc.data();
        const amount = Number(data.amount);
        const date = new Date(data.date);
        const monthYear = date.toLocaleString('bn-BD', { month: 'short' });

        if (!monthlyDataMap[monthYear]) {
          monthlyDataMap[monthYear] = { income: 0, expense: 0 };
        }

        if (data.type === 'Income') {
          totalIncomeAllTime += amount;
          if (data.date >= startOfMonth) income += amount;
          monthlyDataMap[monthYear].income += amount;
        } else {
          totalExpenseAllTime += amount;
          if (data.date >= startOfMonth) expense += amount;
          monthlyDataMap[monthYear].expense += amount;
        }
      });

      setStats(prev => ({
        ...prev,
        monthlyIncome: income,
        monthlyExpense: expense,
        currentCash: totalIncomeAllTime - totalExpenseAllTime
      }));

      const formattedChartData = Object.entries(monthlyDataMap).map(([name, vals]) => ({
        name,
        ...vals
      })).slice(-6);
      
      setChartData(formattedChartData);
      
      // Layout স্থির হওয়ার জন্য ১০০ মিলি-সেকেন্ড অপেক্ষা করে চার্ট রেন্ডার করা হবে
      setTimeout(() => setIsReady(true), 150);
    });

    return () => {
      unsubStudents();
      unsubTransactions();
    };
  }, []);

  const cards = [
    { title: 'মোট ছাত্র', value: stats.totalStudents, icon: <Users className="w-8 h-8 text-blue-500" />, color: 'bg-blue-50' },
    { title: 'চলতি মাসের আয়', value: `৳ ${stats.monthlyIncome.toLocaleString()}`, icon: <TrendingUp className="w-8 h-8 text-green-500" />, color: 'bg-green-50' },
    { title: 'চলতি মাসের ব্যয়', value: `৳ ${stats.monthlyExpense.toLocaleString()}`, icon: <TrendingDown className="w-8 h-8 text-red-500" />, color: 'bg-red-50' },
    { title: 'বর্তমান ক্যাশ', value: `৳ ${stats.currentCash.toLocaleString()}`, icon: <Banknote className="w-8 h-8 text-emerald-500" />, color: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">আস-সালামু আলাইকুম</h2>
          <p className="text-gray-500">আজকের মাদ্রাসা রিপোর্ট একনজরে</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-600">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <span className="font-medium">{new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`${card.color} p-6 rounded-2xl border border-white shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]`}>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{card.value}</h3>
            </div>
            <div className="bg-white p-3 rounded-xl shadow-inner">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[450px]">
          <h4 className="text-lg font-bold mb-6 text-gray-800">আয় ও ব্যয়ের গ্রাফ</h4>
          <div className="w-full h-[350px]" style={{ minHeight: '350px' }}>
            {isReady && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="income" name="আয়" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="expense" name="ব্যয়" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                {isReady ? 'গ্রাফ দেখানোর জন্য পর্যাপ্ত ডাটা নেই...' : 'লোড হচ্ছে...'}
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h4 className="text-2xl font-bold mb-4 italic">"জ্ঞানের সন্ধানে যে বের হয়, সে ফিরে আসা পর্যন্ত আল্লাহর পথে থাকে।"</h4>
            <p className="text-emerald-200">— আল হাদিস</p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-700/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-600/50 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
