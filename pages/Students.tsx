
import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Student } from '../types';
import { Plus, Search, Trash2, Edit, X, Phone } from 'lucide-react';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt'>>({
    uid: '',
    name: '',
    roll: '',
    class: '',
    type: 'Non-Residential',
    fatherName: '',
    motherName: '',
    mobile: ''
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'students'), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const generateUID = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `TSMS-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'students', editingId), { ...formData });
        alert('তথ্য সফলভাবে আপডেট করা হয়েছে');
      } else {
        const finalData = {
          ...formData,
          uid: formData.uid || generateUID(),
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'students'), finalData);
        alert('নতুন ছাত্র সফলভাবে যুক্ত করা হয়েছে');
      }
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ uid: '', name: '', roll: '', class: '', type: 'Non-Residential', fatherName: '', motherName: '', mobile: '' });
    } catch (error) {
      alert('একটি ত্রুটি ঘটেছে');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id!);
    setFormData({
      uid: student.uid || '',
      name: student.name,
      roll: student.roll,
      class: student.class,
      type: student.type,
      fatherName: student.fatherName,
      motherName: student.motherName,
      mobile: student.mobile
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে আপনি ছাত্র "${name}" এর সকল তথ্য মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।`)) {
      try {
        await deleteDoc(doc(db, 'students', id));
        alert('সফলভাবে মুছে ফেলা হয়েছে');
      } catch (error) {
        alert('মুছে ফেলতে সমস্যা হয়েছে');
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.roll.includes(searchTerm) ||
    s.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">ছাত্র ব্যবস্থাপনা</h2>
          <p className="text-gray-500">মোট ছাত্র: {students.length} জন</p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingId(null);
            setFormData({ uid: '', name: '', roll: '', class: '', type: 'Non-Residential', fatherName: '', motherName: '', mobile: '' });
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          নতুন ছাত্র যুক্ত করুন
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="নাম, রোল, UID বা শ্রেণী দিয়ে খুঁজুন..."
          className="flex-1 outline-none text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-emerald-800">
                {editingId ? 'ছাত্রের তথ্য আপডেট করুন' : 'নতুন ছাত্রের তথ্য প্রদান করুন'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">ছাত্রের নাম *</label>
                <input required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">রোল নম্বর *</label>
                <input required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.roll} onChange={e => setFormData({...formData, roll: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">শ্রেণী *</label>
                <input required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">ধরণ</label>
                <select className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="Non-Residential">অনাবাসিক</option>
                  <option value="Residential">আবাসিক</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">পিতার নাম</label>
                <input className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">মাতার নাম</label>
                <input className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.motherName} onChange={e => setFormData({...formData, motherName: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">মোবাইল নম্বর *</label>
                <input required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all">
                  {editingId ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-emerald-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-bold text-emerald-800">UID ও রোল</th>
              <th className="px-6 py-4 text-sm font-bold text-emerald-800">নাম ও শ্রেণী</th>
              <th className="px-6 py-4 text-sm font-bold text-emerald-800">ধরণ</th>
              <th className="px-6 py-4 text-sm font-bold text-emerald-800">অভিভাবক</th>
              <th className="px-6 py-4 text-sm font-bold text-emerald-800">মোবাইল</th>
              <th className="px-6 py-4 text-sm font-bold text-emerald-800 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-emerald-700 text-xs">{student.uid || 'N/A'}</p>
                  <p className="text-gray-500 text-sm">রোল: {student.roll}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-400 uppercase">{student.class}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.type === 'Residential' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {student.type === 'Residential' ? 'আবাসিক' : 'অনাবাসিক'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <p>{student.fatherName || '-'}</p>
                  <p className="text-xs opacity-75">{student.motherName}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-emerald-500" />
                    {student.mobile}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center space-x-2">
                    <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(student.id!, student.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
