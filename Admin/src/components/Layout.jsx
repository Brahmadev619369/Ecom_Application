import React, { useContext ,useEffect} from 'react'
import Navbar from './navbar/Navbar'
import Footer from './footer/Footer'
import { Navigate, Outlet } from 'react-router-dom';
import SideBar from './sidebar/SideBar';
import { storeContext } from './context/context';
function Layout() {

    const {isAuthenticated,loading,auth } = useContext(storeContext)
    const token = localStorage.getItem("AuthToken")
  //   if (loading) {
  //     return <div>Loading...</div>; 
  // }

    if(!token){
        return <Navigate to = "/login"/>
    }

    useEffect(()=>{
      window.scrollTo({ top: 0, behavior: "smooth" });
    },[])
  

  return (
    <div className='layoutContainer'>
    <Navbar/>
    <div className={`outlet`}>
    <SideBar/>
   
    
    <div className="main-content">
    <Outlet />
    </div>

    </div>
  
    <Footer/>
    </div >
  )
}

export default Layout