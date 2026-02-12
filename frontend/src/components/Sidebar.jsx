import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  List, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight 
} from 'lucide-react';
import { AdminContext } from '../context/AdminContext.jsx';
import Avatar from '../assets/avatar.svg?react'

const Sidebar = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { setAToken } = useContext(AdminContext);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Blog', path: '/add-blog', icon: <FilePlus size={20} /> },
    { name: 'Blog List', path: '/blog-list', icon: <List size={20} /> },
  ];

  const logout = () => {
    setAToken('');
    localStorage.removeItem('aToken');
    navigate('/');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
         
          <span className="text-lg font-black tracking-tighter uppercase">
            Admin<span className="text-indigo-600">Panel</span>
          </span>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-xl bg-zinc-100 text-zinc-600 active:scale-90 transition-all"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR ASIDE --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        lg:sticky top-0 h-screen
        w-72 lg:w-64 bg-white border-r border-zinc-200
        flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-zinc-200 px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-black tracking-tighter uppercase">
            Admin<span className="text-indigo-600">Panel</span>
          </span>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-zinc-100 text-zinc-600 active:scale-90 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Header Section */}
        <div className="p-8 hidden lg:block">
          <div className="flex items-center gap-3">
            
            <span className="text-xl font-black tracking-tighter uppercase">
              Admin<span className="text-indigo-600">Panel</span>
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 mt-10 lg:mt-0 space-y-2">
          <p className="px-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  group flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-indigo-600'} transition-colors`}>
                    {item.icon}
                  </span>
                  {item.name}
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Section */}
        <div className="p-4 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white overflow-hidden">
                <Avatar className="w-10" />
               
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">System Admin</p>
              <p className="text-[10px] text-zinc-500 font-medium">Full Access</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;