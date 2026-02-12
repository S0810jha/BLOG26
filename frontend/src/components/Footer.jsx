import React from 'react';
import { Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 px-6 py-10 text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Social Icons using Lucide */}
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-emerald-500 transition-all duration-300 hover:-translate-y-1">
            <Linkedin size={20} strokeWidth={1.5} />
          </a>
          <a href="#" className="hover:text-emerald-500 transition-all duration-300 hover:-translate-y-1">
            <Github size={20} strokeWidth={1.5} />
          </a>
          <a href="#" className="hover:text-emerald-500 transition-all duration-300 hover:-translate-y-1">
            <Instagram size={20} strokeWidth={1.5} />
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-bold uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>

        {/* Copyright */}
        <div className="text-[10px] text-zinc-300 uppercase tracking-[0.3em] font-medium opacity-50">
          © 2026 BLOG26
        </div>

      </div>
    </footer>
  );
};

export default Footer;