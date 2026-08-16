'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Receipt, ShoppingCart, Package, Users, Truck, BarChart3, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. மொபைல் வியூவிற்கான டாப் ஹெட்டர் (Menu & Close Button) */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 w-full">
        <span className="font-bold text-lg">BuildMart ERP</span>
        <button 
          onClick={toggleMenu} 
          className="p-2 rounded-lg focus:outline-none hover:bg-slate-800 transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. சைடுபார் கண்டெய்னர் (Mobile Overlay & Desktop Sticky) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:min-h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* லோகோ மற்றும் டைட்டில் (டெஸ்க்டாப்பிற்கு மட்டும் அல்லது இரண்டும்) */}
        <div className="p-5 hidden md:block">
          <h1 className="font-bold text-xl">BuildMart ERP</h1>
        </div>

        {/* மெனு லிஸ்ட்கள் */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/transactions" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <Receipt size={18} /> All transactions
          </Link>
          <Link href="/billing" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <ShoppingCart size={18} /> Billing / Sales
          </Link>
          <Link href="/purchases" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <Package size={18} /> Purchases
          </Link>
          <Link href="/inventory" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <Truck size={18} /> Inventory
          </Link>
          <Link href="/customers" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <Users size={18} /> Customers
          </Link>
          <Link href="/suppliers" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <Users size={18} /> Suppliers
          </Link>
          <Link href="/reports" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <BarChart3 size={18} /> Reports
          </Link>
          <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800">
            <Settings size={18} /> Settings
          </Link>
        </nav>

        {/* யூசர் மற்றும் லாக் அவுட் பகுதி */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 text-slate-300">
          <div className="text-xs text-slate-400 mb-2">ADMIN · Administrator</div>
          <button className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-1.5 px-3 rounded font-medium text-sm hover:bg-slate-100 transition">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* மொபைலில் மெனு திறந்திருக்கும்போது பின்னாடி உள்ள ஸ்கிரீன் மங்கலாகத் தெரிய (Overlay) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}
    </>
  );
}