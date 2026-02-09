
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase,
  Wallet, 
  ChefHat, 
  FileText, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const navItems = [
    { name: 'ড্যাশবোর্ড', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'ছাত্র তালিকা', path: '/students', icon: <Users className="w-5 h-5" /> },
    { name: 'শিক্ষক-কর্মচারী', path: '/staff', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'হিসাব রক্ষণ', path: '/accounting', icon: <Wallet className="w-5 h-5" /> },
    { name: 'কিচেন ইনভেন্টরি', path: '/kitchen', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'রিপোর্ট', path: '/reports', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-emerald-600 text-white rounded-md no-print"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-emerald-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 no-print
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-emerald-700">
            <h1 className="text-xl font-bold leading-tight">তাহেরিয়া সাবেরিয়া মাদ্রাসা</h1>
            <p className="text-xs text-emerald-300 mt-1 uppercase tracking-widest">Management System</p>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center px-6 py-3 text-sm font-medium transition-colors
                  ${isActive ? 'bg-emerald-700 text-white border-r-4 border-white' : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-emerald-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-red-600 hover:text-white rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              লগ আউট
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
