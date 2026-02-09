
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
      await addDoc(collection(db, 'kitchen_inventory'), {
        name: newItemName,
        quantity: 0,
        unit: newItemUnit,
        lastUpdated: serverTimestamp()
      });
      setNewItemName('');
    } catch (error) {
      alert('পণ্য যুক্ত করা যায়নি');
    }
  };

  const updateQuantity = async (id: string, current: number, delta: number) => {
    const newVal = Math.max(0, current + delta);
    await updateDoc(doc(db, 'kitchen_inventory', id), {
      quantity: newVal,
      lastUpdated: serverTimestamp()
    });
  };

  const deleteItem = async (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে আপনি "${name}" তালিকা থেকে মুছে ফেলতে চান?`)) {
      try {
        await deleteDoc(doc(db, 'kitchen_inventory', id));
        alert('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে');
      } catch (error) {
        alert('মুছে ফেলতে সমস্যা হয়েছে');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">কিচেন ইনভেন্টরি</h2>
          <p className="text-gray-500">রান্নাঘরের মজুদ মালামালের তালিকা</p>
        </div>

        <form onSubmit={addItem} className="flex gap-2 w-full md:w-auto">
          <input 
            placeholder="নতুন পণ্য (যেমন: চাল)"
            className="px-3 py-2 border rounded-lg text-sm flex-1"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
          />
          <select 
            className="px-3 py-2 border rounded-lg text-sm"
            value={newItemUnit}
            onChange={e => setNewItemUnit(e.target.value)}
          >
            <option>কেজি</option>
            <option>লিটার</option>
            <option>পিস</option>
            <option>ব্যাগ</option>
          </select>
          <button type="submit" className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              </div>
              <button onClick={() => deleteItem(item.id!, item.name)} className="text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between mb-4">
              <button 
                onClick={() => updateQuantity(item.id!, item.quantity, -1)}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 text-red-500 transition-all shadow-sm active:scale-95"
              >
                {/* Fixed typo '偏Minus' to 'Minus' */}
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <span className="text-3xl font-bold text-emerald-700">{item.quantity}</span>
                <span className="text-xs font-medium text-gray-500 block uppercase tracking-wide">{item.unit}</span>
              </div>

              <button 
                onClick={() => updateQuantity(item.id!, item.quantity, 1)}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 text-emerald-600 transition-all shadow-sm active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-[10px] text-gray-400 text-right">
              আপডেট: {item.lastUpdated?.toDate().toLocaleString('bn-BD') || '-'}
            </p>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
            কোনো মালামাল পাওয়া যায়নি। নতুন পণ্য যুক্ত করুন।
          </div>
        )}
      </div>
    </div>
  );
};

export default Kitchen;
