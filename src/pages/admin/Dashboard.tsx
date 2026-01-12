import React from 'react'
import { Link, Outlet } from 'react-router'
import { IoHomeOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryPlus } from "react-icons/tb";
import { BsCart3 } from "react-icons/bs";
const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100/40">
      <div className="fixed w-64 h-full bg-white text-black flex flex-col shadow-lg">
    <div className="p-4">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
      </svg>
    </div>
    <nav className="flex-1 px-2 text-lg">
      <Link to='/admin' className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300/50 active:bg-indigo-900 hover:border-l-4 border-red-600">
      <span className='inline-block pr-2'><IoHomeOutline /></span>Dashboard</Link>
      <Link to='/admin/member' className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300/50 hover:border-l-4 border-red-600">
      <span className='inline-block pr-2'><CiUser /></span>Member</Link>
      <Link to='/admin/product' className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300/50 hover:border-l-4 border-red-600">
      <span className='inline-block pr-2'><AiOutlineProduct /></span>Product</Link>
      <Link to='/admin/category' className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300/50 hover:border-l-4 border-red-600">
      <span className='inline-block pr-2'><TbCategoryPlus /></span>Category</Link>
      <Link to='/admin/order' className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-300/50 hover:border-l-4 border-red-600">
      <span className='inline-block pr-2'><BsCart3 /></span>Order</Link>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Projects</a>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Calendar</a>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Documents</a>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Reports</a>
      <div className="border-t border-gray-700 my-4"></div>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Your teams</a>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Heroicons</a>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Tailwind Labs</a>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Workcation</a>
      <div className="border-t border-gray-700 my-4"></div>
      <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">Settings</a>
    </nav>
  </div>

  {/* <!-- Main Content --> */}
  <div className="ml-64 w-full p-6">
    <div className="flex justify-between items-center mb-6">
      <input type="text" placeholder="Search" className="p-2 rounded border"/>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
        <div className="flex items-center space-x-2">
          <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full"/>
          <span>Tom Cook</span>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-md shadow-lg">
      <div className="w-full p-4">
        <Outlet/>
      </div>
    </div>
  </div>
    </div>
  )
}

export default Dashboard
