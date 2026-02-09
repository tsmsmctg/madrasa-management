import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { InventoryItem } from '../types';
import { Plus, Minus, Package, Trash2 } from 'lucide-react';

const Kitchen: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('কেজি');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'kitchen_inventory'), (snap) => {
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem)));
    });
    return unsub;
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;
    try {
      await addDoc(collection(db, 'kitchen_inventory'), { name: newItemName, quantity: 0, unit: newItemUnit, lastUpdated: serverTimestamp() });
      setNewItemName('');
    } catch (error) { alert('পণ্য যুক্ত করা যায়নি'); }
  };

  const inputClass = "px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">কিচেন ইনভেন্টরি</h2>
          <p className="text-gray-500">মজুদ মালামালের তালিকা</p>
        </div>

        <form onSubmit={addItem} className="flex gap-2 w-full md:w-auto">
          <input 
            placeholder="নতুন পণ্য (যেমন: চাল)"
            className={`${inputClass} flex-1`}
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
          />
          <select className={inputClass} value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)}>
            <option>কেজি</option>
            <option>লিটার</option>
            <option>পিস</option>
          </select>
          <button type="submit" className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 shadow-md">
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-900">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-2 rounded-lg mr-3"><Package className="w-5 h-5 text-emerald-600" /></div>
                <h3 className="font-bold text-lg">{item.name}</h3>
              </div>
              <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await deleteDoc(doc(db, 'kitchen_inventory', item.id!)); }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-4">
              <button onClick={() => updateDoc(doc(db, 'kitchen_inventory', item.id!), { quantity: Math.max(0, item.quantity - 1), lastUpdated: serverTimestamp() })} className="w-10 h-10 bg-white border rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 shadow-sm"><Minus className="w-5 h-5" /></button>
              <div className="text-center"><span className="text-3xl font-bold text-emerald-700">{item.quantity}</span><span className="text-xs text-gray-500 block uppercase">{item.unit}</span></div>
              <button onClick={() => updateDoc(doc(db, 'kitchen_inventory', item.id!), { quantity: item.quantity + 1, lastUpdated: serverTimestamp() })} className="w-10 h-10 bg-white border rounded-full flex items-center justify-center hover:bg-emerald-50 text-emerald-600 shadow-sm"><Plus className="w-5 h-5" /></button>
            </div>
            <p className="text-[10px] text-gray-400 text-right">আপডেট: {item.lastUpdated?.toDate().toLocaleString('bn-BD') || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kitchen;