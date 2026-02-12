import React, { useState, useEffect } from "react"
import { UserContext } from "../../context/UserContext.jsx"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {Eye, EyeOff} from 'lucide-react'
import { toast } from "react-toastify"

const UserLogin = () => {

  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {token, setToken, backendUrl} = useContext(UserContext)

  const navigate = useNavigate()

  const onSubmitHandler = async(e)=>{
    e.preventDefault()

    try {
      if(isSignUp){
        const {data} = await axios.post(backendUrl+'/api/user/register', {
          name,
          email,
          password
        })

        if(data.success){
          localStorage.setItem("token", data.token)
          toast.success(data.message)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
          console.log(data.message)
        }
      }

      else{
        const {data} = await axios.post(backendUrl+'/api/user/login', {
          email,
          password
        })

        if(data.success){
          localStorage.setItem('token', data.token)
          toast.success(data.message)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
          console.log(data.message)
        }
      
      }
      
    } catch (error) {
        console.log(error.message)
        toast.error(error.response?.data?.message || error.message)
    }

  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  }, [token])


  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-zinc-950 text-white overflow-hidden p-4">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes flipIn {
            from { opacity: 0; transform: rotateY(-10deg) scale(0.95); }
            to { opacity: 1; transform: rotateY(0) scale(1); }
          }
          .animate-fade {
            animation: fadeInUp 0.6s ease-out forwards;
          }
          .animate-card-change {
            animation: flipIn 0.5s ease-out forwards;
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] h-96 w-96 bg-emerald-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] h-96 w-96 bg-cyan-600/10 blur-[120px] rounded-full"></div>
      </div>


      {/* Register / Login */}
      <div key={isSignUp ? "signup" : "signin"} className="relative w-full max-w-md glass-card rounded-3xl p-8 md:p-10 animate-card-change z-10">
        
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black tracking-tighter">
            {isSignUp ? "JOIN" : "HELLO"}
            <span className="text-emerald-500">.</span>
          </h2>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-[0.2em]">
            {isSignUp ? "Create your reader account" : "Welcome back to the blog"}
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmitHandler}>
          {isSignUp && (
            <div className="animate-fade">
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Full Name</label>
              <input 
                type="text" 
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="animate-fade [animation-delay:100ms]">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">Email Address</label>
            <input 
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="user@example.com"
            />
          </div>

          <div className="animate-fade [animation-delay:200ms]">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1 ml-1">
              Password
            </label>
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all pr-12"
                placeholder="••••••••"
              />
              <button
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={20} strokeWidth={2} /> : <EyeOff size={20} strokeWidth={2} /> }
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl mt-4 transition-all active:scale-[0.98] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-zinc-400 text-xs hover:text-emerald-400 transition-colors uppercase tracking-widest font-medium"
          >
            {isSignUp ? "Already have an account? Sign In" : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserLogin