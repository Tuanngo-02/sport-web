import React from 'react'
import { Link, Outlet } from 'react-router'
import { IoHomeOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryPlus } from "react-icons/tb";
import { BsCart3 } from "react-icons/bs";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-brand-bg font-sans">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white border-r border-brand-gray-border flex flex-col shadow-xs">
        <div className="p-5 border-b border-brand-gray-border flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.svg" alt="GearUp Logo" className="h-8 w-auto object-contain" />
          </Link>
          <span className="text-[10px] font-bold bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 text-sm font-semibold">
          <Link 
            to='/admin' 
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition duration-200 text-brand-primary hover:bg-brand-gray-light hover:text-brand-accent border-l-2 border-transparent hover:border-brand-accent"
          >
            <IoHomeOutline size={16} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to='/admin/member' 
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition duration-200 text-brand-primary hover:bg-brand-gray-light hover:text-brand-accent border-l-2 border-transparent hover:border-brand-accent"
          >
            <CiUser size={16} />
            <span>Thành viên</span>
          </Link>
          
          <Link 
            to='/admin/product' 
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition duration-200 text-brand-primary hover:bg-brand-gray-light hover:text-brand-accent border-l-2 border-transparent hover:border-brand-accent"
          >
            <AiOutlineProduct size={16} />
            <span>Sản phẩm</span>
          </Link>
          
          <Link 
            to='/admin/category' 
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition duration-200 text-brand-primary hover:bg-brand-gray-light hover:text-brand-accent border-l-2 border-transparent hover:border-brand-accent"
          >
            <TbCategoryPlus size={16} />
            <span>Danh mục</span>
          </Link>
          
          <Link 
            to='/admin/order' 
            className="flex items-center gap-3 py-2.5 px-4 rounded-xl transition duration-200 text-brand-primary hover:bg-brand-gray-light hover:text-brand-accent border-l-2 border-transparent hover:border-brand-accent"
          >
            <BsCart3 size={16} />
            <span>Đơn hàng</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-brand-gray-border text-center text-xs font-bold text-brand-gray-text tracking-widest uppercase">
          GearUp Dashboard © 2026
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 w-full flex flex-col min-h-screen">
        {/* Header */}
        <div className="h-16 bg-white border-b border-brand-gray-border px-8 flex justify-between items-center">
          <h1 className="text-sm font-bold font-display text-brand-primary uppercase tracking-wider">
            Hệ thống quản lý Admin
          </h1>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold">
              A
            </span>
            <span className="text-brand-primary">Administrator</span>
          </div>
        </div>

        {/* Dynamic content page container */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white border border-brand-gray-border rounded-3xl p-6 shadow-xs min-h-[calc(100vh-10rem)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
