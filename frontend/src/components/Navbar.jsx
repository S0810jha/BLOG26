import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { setToken, userData } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo Side */}
        <div className="flex-1 flex justify-start items-center">
          <div className="group cursor-pointer">
            <span onClick={()=> navigate('/')} className="text-lg font-black tracking-tighter text-white uppercase">
              BLOG<span className="text-emerald-500">26</span>
            </span>
          </div>
        </div>

        
        <div className="flex-1 flex justify-center items-center">
          {userData ? (
              <>
                <span className='text-white font-semibold'>
                  {userData.name.split(' ')[0]} 
                </span>
                <span className="text-emerald-500 ml-2 font-semibold">
                  {userData.name.split(' ').length > 1 ? userData.name.split(' ')[1] : ''}
                </span>
              </>
            ) : "SHUBHAM JHAN"}
        </div>

        {/* Action Side */}
        <div className="flex-1 flex justify-end items-center">
          <button 
            onClick={logout} 
            className="text-[10px] md:text-xs font-black tracking-widest uppercase bg-zinc-800/50 border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 text-zinc-300 px-4 py-2 md:px-6 md:py-2.5 rounded-full transition-all active:scale-95 shadow-sm"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;