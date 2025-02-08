import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import SearchBar from '../../searchBar/SearchBar'
import { ToastContainer } from 'react-toastify';
import { StoreContext } from '../../Context'

function Layout() {
  const {showSearchBtn} = useContext(StoreContext)

  
  return (
    <>
    <Header/>
    <div className="MainContentContainer">
    <ToastContainer/>
    <Outlet/>
    </div>
    <Footer/>
    </>
  )
}

export default Layout