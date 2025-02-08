import React, { useEffect, useState } from 'react'
import "./admin.css";
import { FiShoppingCart, FiUsers, FiDollarSign } from "react-icons/fi";
import axios from 'axios';
function Admin() {
const [totalOrders,setTotalOrders] = useState(0)
const [totalUsers,setTotalUsers] = useState(0)
const [totalRevenue,setTotalRevenue] = useState(0)
const token = localStorage.getItem("AuthToken")

   
    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/admin/orders`,{
              headers:{
                Authorization : `Bearer ${token}`
              }
            })
            // console.log(res.data);
            const totalAmt = res.data.reduce((sum, item) => 
                sum + (item.totalAmount || 0), 0);
            setTotalRevenue(totalAmt)
            setTotalOrders(res.data.length)
        } catch (error) {
            console.log(error);

        }

    }


    const fetchUsers = async() =>{
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/get-users`,{
              headers:{
                Authorization : `Bearer ${token}`
              }
            })
            setTotalUsers(res.data.length);
        } catch (error) {
            console.log(error);

        }

    }

 useEffect(()=>{
    fetchOrders()
    fetchUsers()
 })




  return (
    <div>

<main className="main-content">
        {/* Top Navbar */}
        <nav className="top-nav">
          <h3>Welcome, Brahmadev </h3>
        </nav>

        {/* Dashboard Cards */}
        <div className="dashboard">
          <div className="card">
            <FiShoppingCart className="ic" />
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>

          <div className="card">
            <FiUsers className="ic" />
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>

          <div className="card">
            <FiDollarSign className="ic" />
            <h3>Total Revenue</h3>
            <p>₹{totalRevenue}</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Admin