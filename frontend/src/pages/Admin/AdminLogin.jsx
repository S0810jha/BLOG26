import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx'
import axios from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify' // Import toast to match your Context behavior

const AdminLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Updated variable name to setAToken to match your AdminContextProvider
  const { setAToken, backendUrl } = useContext(AdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
      
      if (data.success) {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token); // Updated from setAtoken to setAToken
        toast.success("Login Successful")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      // Improved error logging
      toast.error(error.response?.data?.message || error.message)
      console.log(error.message)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 text-white overflow-hidden p-4">
      <style>
        {`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
            50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
          }
          .animate-slide {
            animation: slideInRight 0.8s ease-out forwards;
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] h-96 w-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md glass-card rounded-2xl p-8 md:p-10 animate-slide opacity-0">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            ADMIN <span className="text-indigo-500">ACCESS</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">Secure Entry Point</p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {/* Email */}
          <div className="animate-slide opacity-0 [animation-delay:200ms]">
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="admin@gmail.com"
            />
          </div>

          {/* Password */}
          <div className="animate-slide opacity-0 [animation-delay:400ms]">
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none flex items-center justify-center p-1"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-95 animate-slide opacity-0 [animation-delay:600ms] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin