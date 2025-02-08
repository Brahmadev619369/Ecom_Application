import React, { useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { DiReact } from "react-icons/di";
import "./navbar.css"
import { useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { IoMdLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { storeContext } from '../context/context';
import logo from "../../assets/yourcartLogo.png"

function Navbar() {

    const [dropDown, setDropDown] = useState(false)
    const dropdownRef = useRef(null)
    const { handleToLogout,auth } = useContext(storeContext)
    const navigate = useNavigate()


    useEffect(() => {
        const handleToClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropDown(false)
            }
        }

        document.addEventListener("mousedown", handleToClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleToClickOutside);
        }
    }, [])

    const Logout = () => {
        handleToLogout()
        navigate("/login")
    }





    return (
        <div className="nav-container">

            <div className="navBar">
                <div className="logo">
                    <img src={logo} alt="" />
                </div>
                {auth && auth.profile && (
                    <div className="profile" ref={dropdownRef} onClick={() => setDropDown(!dropDown)}>
                        <img src={auth.profile} alt="Profile" width="300" />
                        <div className={`dropdown-menu ${dropDown ? "show" : ""}`}>

                            <div className="drpMenu">
                                <p>{auth.name}</p>
                                <span><CgProfile /></span>
                            </div>

                            <div className="drpMenu" onClick={Logout}>
                                <p>Logout</p>
                                <span><IoMdLogOut /></span>
                            </div>

                        </div>
                    </div>
                )}
               
            </div>


        </div>
    )
}

export default Navbar