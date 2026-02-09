import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Staff } from '../types';
import { Plus, Search, Trash2, Edit, X, Phone, Briefcase } from 'lucide-react';

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Staff, 'id' | 'createdAt'>>({ name: '', designation: '', mobile: '', salary: 0 });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'staff'), (snap) => setStaff(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff))));
    return unsub;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) { await updateDoc(doc(db, 'staff', editingId), { ...formData }); alert('তথ্য সফলভাবে আপডেট করা হয়েছে'); }
      else { await addDoc(collection(db, 'staff'), { ...formData, createdAt: serverTimestamp() }); alert('সফলভাবে যুক্ত করা হয়েছে'); }
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ name: '', designation: '', mobile: '', salary: 0 });
    } catch (error) { alert('ত্রুটি ঘটেছে'); }
  };

  const inputClass = "w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-gray-900">
        <div><h2 className="text-2xl font-bold">শিক্ষক ও কর্মচারী</h2><p className="text-gray-500">মোট জনবল: {staff.length} জন</p></div>
        <button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ name: '', designation: '', mobile: '', salary: 0 }); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"><Plus className="w-5 h-5 mr-2" /> নতুন জনবল</button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input type="text" placeholder="নাম বা পদবী দিয়ে খুঁজুন..." className="flex-1 bg-transparent outline-none text-gray-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-gray-800">{editingId ? 'তথ্য সংশোধন' : 'নতুন শিক্ষক/কর্মচারী'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1"><label className="text-sm font-semibold text-gray-700">নাম *</label><input required className={inputClass} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-sm font-semibold text-gray-700">পদবী *</label><input required className={inputClass} value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-sm font-semibold text-gray-700">মোবাইল নম্বর *</label><input required className={inputClass} value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-sm font-semibold text-gray-700">বেতন (৳)</label><input type="number" className={inputClass} value={formData.salary || ''} onChange={e => setFormData({...formData, salary: Number(e.target.value)})} /></div>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700">সংরক্ষণ করুন</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-900">
        {staff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Briefcase className="w-6 h-6" /></div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(item.id!); setFormData({ name: item.name, designation: item.designation, mobile: item.mobile, salary: item.salary }); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button onClick={async () => { if(window.confirm('মুছে ফেলবেন?')) await deleteDoc(doc(db, 'staff', item.id!)); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
            <p className="text-emerald-600 font-medium text-sm">{item.designation}</p>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-xs text-gray-400 flex items-center"><Phone className="w-3 h-3 mr-1 text-emerald-500" /> {item.mobile}</span>
              <span className="font-bold text-gray-700">৳ {item.salary.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffPage;