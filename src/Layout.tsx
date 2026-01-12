import React from 'react'
import App from './App'
import PromoSection from './components/PromoSection'
import { Route, Routes } from 'react-router'
import HomePage from './pages/user/HomePage'
import ProductUserPage from './pages/user/ProductUserPage'
import CartPage from './pages/user/CartPage'
import ProductDetail from './pages/user/ProductDetail'
import Dashboard from './pages/admin/Dashboard'
import Menber from './pages/admin/Member'
import Member from './pages/admin/Member'
import { ToastContainer } from 'react-toastify'

import Login from './pages/auth/Login'
import OrderPage from './pages/admin/OrderPage'
import CategoryPage from './pages/admin/CategoryPage'
import ProductPage from './pages/admin/ProductPage'
import ReviewPage from './pages/user/ReviewPage'
import CartDetail from './pages/user/CartDetail'
import CheckoutPage from './pages/user/CheckoutPage'
import Register from './pages/auth/Register'

const Layout = () => {
  return (
    <>
        <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/" element={<App />} >
                <Route index element={<HomePage />} />
                <Route path="product" element={<ProductUserPage />} />
                <Route path="cart" element={<CartDetail  />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout/:id" element={<CheckoutPage />} />
                {/* <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart/:id" element={<CartList />} />
                <Route path="/checkout/:id" element={<CheckOutPage />} />
                <Route path="user" element={<User />} />
                <Route path="product" element={<ProductPage />} /> 
                
                */}
                
            </Route>
            <Route path="admin" element={<Dashboard />}>
                <Route path="member" element={<Member />}/> 
                <Route path="product" element={<ProductPage />}/> 
                <Route path="order" element={<OrderPage />}/> 
                <Route path="category" element={<CategoryPage />}/> 
            </Route>
            {/* <Route path="admin" element={<Admin />}>    
                <Route index element={<HomeAdmin />} />
                <Route path="member" element={<Member />}/> 
                <Route path="member/edit" element={<MemberEdit />}/> 
                <Route path="product" element={<Product />}/> 
                <Route path="product/edit" element={<ProductEdit />}/> 
                <Route path="order" element={<Order />}/> 
            </Route>
            <Route path="*" element={<NotFound />}></Route> */}
        </Routes>
        <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
        />
    </>
  )
}

export default Layout
