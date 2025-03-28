import React, { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import SearchBar from '../../searchBar/SearchBar'
import { ToastContainer } from 'react-toastify';
import { StoreContext } from '../../Context'
import Chatbot from '../../chatbot/Chatbot'
import Tawl from '../../tawkIO/Tawl'
function Layout() {
  const {showSearchBtn} = useContext(StoreContext)
  
useEffect(()=>{
  window.scrollTo({ top: 0, behavior: "smooth" });
},[])
  
  return (
    <>
    <Header/>
    <div className="MainContentContainer">
    {/* <Chatbot/> */}
    <ToastContainer/>
    <Outlet/>
    </div>
    <Footer/>

    <Tawl/>
    </>
  )
}

export default Layout