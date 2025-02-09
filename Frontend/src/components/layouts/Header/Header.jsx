import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
// import logo from "../../../assets/react.svg"
import "./header.css"
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { assets } from "../../../assets/assets"
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import { StoreContext } from '../../Context'
import { toast, ToastContainer } from 'react-toastify'
import { FaMapLocationDot } from "react-icons/fa6";
import logo from "../../../assets/yourcartLogo.png"
import { FaHeart } from "react-icons/fa";


function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { cartCounts, cartItems, auth, logout, logoutMSg, searchBtn } = useContext(StoreContext)
  const [showprofileContent, setShowProfileContent] = useState(false)
  const menuRef = useRef(null)
  const mainMenuRef = useRef(null)

  const closeNav = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    // setAuth(null); // Clear auth context
    // localStorage.removeItem("AuthToken"); // Remove the token
    logout()

    setTimeout(() => {
      navigate("/"); // Reload after short delay
    }, 1000);
  };


  //
  useEffect(() => {
    const clickOutsideToCloseMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileContent(false);
      }
    };

    document.addEventListener("mousedown", clickOutsideToCloseMenu);
    return () => {
      document.removeEventListener("mousedown", clickOutsideToCloseMenu);
    };
  }, []);

  useEffect(() => {
    const clickOutsideToCloseMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileContent(false);
      }
    };

    document.addEventListener("mousedown", clickOutsideToCloseMenu);
    return () => {
      document.removeEventListener("mousedown", clickOutsideToCloseMenu);
    };
  }, []);

  useEffect(() => {
    const clickOutSideToCloseMainMenu = (e) => {
      if (mainMenuRef.current && !mainMenuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", clickOutSideToCloseMainMenu)
    return () => {
      document.removeEventListener("mousedown", clickOutSideToCloseMainMenu);
    }

  }, [])
console.log(isOpen);


  return (
    <div className='navbar'>
      <div className="nav-component">
        <div className="menu-btn" onClick={() => setIsOpen(!isOpen)} ref={mainMenuRef}>
          <span className={`icon ${isOpen ? "active" : ""}`}>
            <RxCross2 />
          </span>
          <span className={`icon ${!isOpen ? "active" : ""}`}>
            <FiMenu />
          </span>
        </div>

        <div className="nav-logo">
          <Link className='logo' to="/"> <img src={logo} alt="" /> </Link>
        </div>

        <div className={`navmenu ${isOpen ? "open" : ""}`} >
          <NavLink to="/" className={({ isActive }) => `${isActive ? "active-text" : "text"} navlink`} onClick={closeNav}>
            HOME
          </NavLink>

          <NavLink to="/collection" className={({ isActive }) => `${isActive ? "active-text" : "text"} navlink`} onClick={closeNav}>
            COLLECTION
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => `${isActive ? "active-text" : "text"} navlink`} onClick={closeNav}>
            ABOUT
          </NavLink>

          {
            auth ? (
              <NavLink to="/contact" className={({ isActive }) => `${isActive ? "active-text" : "text"} navlink`} onClick={closeNav}>
                CONTACT
              </NavLink>
            ) : (
              <NavLink to="/login" className={({ isActive }) => `${isActive ? "active-text" : "text"} navlink`} onClick={closeNav}>
                LOGIN
              </NavLink>
            )
          }
        </div>


        <div className="navItems">

          <div className="search" onClick={() => searchBtn()}>
            <img src={assets.search_icon} alt="" />
          </div>

          <div className="cart">
            <NavLink to={`${cartCounts > 0 ? "/cart" : "#"}`} onClick={(e) => {
              if (cartCounts === 0) {
                e.preventDefault()
              }
            }} className={`${cartCounts === 0 ? "disabled-link" : ""}`}>
              <img src={assets.cart_icon} alt="" />
              <p>{cartCounts}</p>
            </NavLink>
          </div>

          {auth &&
            (
              <div className="profile" ref={menuRef} >
                <img src={assets.profile_icon} alt="" onClick={() => setShowProfileContent(prev => !prev)} />
                <div className={`profileContent ${showprofileContent ? "showProfileContent" : ""}`}>
                  <div className='profileContents'>
                    {/* <FaCaretDown className='downBtn' /> */}
                    <NavLink onClick={() => setShowProfileContent(false)} to={"/user/profile"}><button><CgProfile />Profile</button></NavLink>
                    <NavLink onClick={() => setShowProfileContent(false)} to={"/myOrders"}><button><img id='order' src={assets.Orders} alt="" />Orders</button></NavLink>
                    <NavLink onClick={() => setShowProfileContent(false)} to={"/address"}><button>< FaMapLocationDot />Address</button></NavLink>
                    <NavLink onClick={() => setShowProfileContent(false)} to={"/wishlist"}><button>< FaHeart />Wishlists</button></NavLink>
                    <NavLink onClick={() => setShowProfileContent(false)}><button onClick={handleLogout}> <AiOutlineLogout /> Logout</button></NavLink>
                  </div>
                </div>
              </div>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default Header