import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Info } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('tsmsmctg@gmail.com');
  const [password, setPassword] = useState('912550');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        if (email === 'tsmsmctg@gmail.com' && password === '912550') {
          try {
            setInfo('প্রথমবার ব্যবহারের জন্য অ্যাডমিন অ্যাকাউন্ট তৈরি করা হচ্ছে...');
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
            return;
          } catch (createErr: any) {
            setError('অ্যাকাউন্ট তৈরি করা যাচ্ছে না।');
          }
        } else {
          setError('ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে।');
        }
      } else {
        setError('লগইন করতে সমস্যা হচ্ছে। ইন্টারনেট সংযোগ চেক করুন।');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-emerald-700 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">তাহেরিয়া সাবেরিয়া মাদ্রাসা</h1>
          <p className="text-emerald-100 opacity-90">অ্যাডমিন প্যানেলে লগইন করুন</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">ইমেইল</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'প্রসেস হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;