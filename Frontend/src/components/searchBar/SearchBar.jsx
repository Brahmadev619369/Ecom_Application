import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { RxCross2 } from "react-icons/rx";
import "./searchBar.css"
import { StoreContext } from '../Context';
import { useLocation } from 'react-router-dom';
function SearchBar() {
  const {setShowSearchBtn,setSearch} = useContext(StoreContext)
  const location = useLocation()


  useEffect(()=>{
    console.log(location.pathname);
    
  })
  return (
    <div className="searchBarMainContainer">
    <div className="searchContainer">
        <div className="searchBtn">
            <div className="searchDiv">
            <input type="text" onChange={(e)=>setSearch(e.target.value)}/>
            </div>
            <img src={assets.search_icon} alt="" />
        </div>

        <div className='searchCloseBtn' onClick={()=>setShowSearchBtn(false)}>
            <RxCross2/>
        </div>
            
        </div>
    </div>
  )
}

export default SearchBar