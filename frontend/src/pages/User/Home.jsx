import React from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'


const Home = () => {

  return (
    <div className='flex flex-col items-center justify-center min-h-[70vh] px-6 w-full max-w-7xl mx-auto'>
        
        <div className="text-center w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 mb-6 leading-none">
                LATEST <span className="text-emerald-600">STORIES</span>
            </h1>
            
            <p className="text-zinc-500 text-xs md:text-sm font-bold max-w-lg mx-auto uppercase tracking-[0.3em] leading-relaxed">
                Exploring the intersection of technology, <br className="hidden md:block" /> 
                design, and future trends.
            </p>
            
            {/* Decorative element with a glow for extra pop */}
            <div className="relative mt-10">
                <div className="w-16 md:w-24 h-2 bg-emerald-600 mx-auto rounded-full shadow-[0_0_20px_rgba(5,150,105,0.4)]"></div>
            </div>
        </div>

        <NavLink to={'blogs'} className="group flex items-center gap-3 bg-zinc-900 text-white mt-6 px-8 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-zinc-200">
            Explore Blogs
            <ArrowRight 
                size={18} 
                className="group-hover:translate-x-1 transition-transform" 
            />
        </NavLink>

    </div>
  )
}

export default Home