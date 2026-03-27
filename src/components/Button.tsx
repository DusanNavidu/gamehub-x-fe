import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: LucideIcon;
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', icon: Icon, children, className = '', ...props }: ButtonProps) {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 font-bold uppercase tracking-widest transition-all duration-300 rounded";
  
  const variants = {
    primary: "bg-green-500 text-black hover:bg-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.6)]",
    secondary: "bg-[#111] text-white border border-gray-700 hover:border-green-500 hover:text-green-500",
    outline: "bg-transparent text-green-500 border border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}