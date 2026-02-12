import React from "react";
import { NavLink } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 text-white overflow-hidden">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes expandLine {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
            50% { transform: translateY(-20px) scale(1.1); opacity: 0.3; }
          }
          .animate-welcome {
            animation: fadeInUp 1s ease-out forwards;
          }
          .animate-line {
            animation: expandLine 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          /* Hover effect for buttons */
          .btn-hover {
            transition: all 0.3s ease;
          }
          .btn-hover:hover {
            background-color: #6366f1;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
            transform: translateY(-2px);
          }
        `}
      </style>

      <div className="relative flex flex-col items-center z-10">
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter animate-welcome opacity-0">
          HELLO<span className="text-indigo-500">.</span>
        </h1>

        <div className="mt-2 h-[2px] w-0 bg-indigo-500 animate-line [animation-delay:200ms]"></div>

        <p className="mt-6 text-zinc-400 text-lg md:text-xl font-light tracking-widest uppercase animate-welcome opacity-0 [animation-delay:800ms]">
          BLOG 2026
        </p>

        <div className="flex flex-col md:flex-row gap-6 mt-10 justify-center items-center">
          <NavLink to={'admin-login'} className="btn-hover px-8 py-2 border-2 border-indigo-500 rounded-full font-bold tracking-widest animate-welcome opacity-0 [animation-delay:1.2s]">
            ADMIN
          </NavLink>
          <NavLink to={'user-login'} className="btn-hover px-8 py-2 border-2 border-indigo-500 rounded-full font-bold tracking-widest animate-welcome opacity-0 [animation-delay:1.4s]">
            USER
          </NavLink>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
        <div className="h-[400px] w-[400px] bg-indigo-600/20 blur-[120px] rounded-full animate-float"></div>
      </div>
      
      <div className="absolute inset-0 -z-20 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
      </div>
    </div>
  )
}

export default Welcome