import React, { useContext, useEffect, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import "./sidebar.css"
import { BsDatabaseFillAdd } from "react-icons/bs";
import { IoIosListBox } from "react-icons/io";
import orderIcon from "../../assets/booking.png"
import { FaUserPlus } from "react-icons/fa6";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { storeContext } from '../context/context';
import { MdSubscriptions } from "react-icons/md";
import { MdDashboard } from "react-icons/md";

function SideBar() {
    const {auth} = useContext(storeContext)
const [isadmin,setIsadmin] = useState(false)
const [isuser,setIsuser] = useState(false)

useEffect(()=>{
    if(auth?.role==="Admin"){
        setIsadmin(true)
    }else{
        setIsadmin(false)
    }
})

useEffect(()=>{
    if(auth?.role==="User"){
        setIsuser(true)
    }else{
        setIsuser(false)
    }
})

    return (
        <div className={`sidebarcontainer`}>
            <div className={`sidebar`}>

                <div className="menu">
                <Link className="menu-items" to={"/"}>
        <MdDashboard className="icon" />
        <span className="text">
            DASHBOARD
        </span>

    </Link>
{
    isadmin && (
        <Link className="menu-items" to={"/additems"}>
        <BsDatabaseFillAdd className="icon" />
        <span className="text">
            ADD ITEMS
        </span>

    </Link>
    )
}

{
    isadmin && (
        <Link className="menu-items" to={"/itemslist"}>
        <IoIosListBox className="icon" />
        <span className="text">
            ITEMS LIST
        </span>

    </Link>
    )
}

{
    isadmin &&(
        
    <Link className="menu-items" to={"/orders"}>
    <img src={orderIcon} className='icon' alt="" />
    <span className="text">
            ORDERS
    </span>

</Link>

    )
}

{
    isadmin && (
        <Link className="menu-items" to={"/users/register"}>
<FaUserPlus className="icon" />
    <span className="text">
            REGISTRATION
    </span>

</Link>
    )
}
{
    !isuser &&(
        <Link className="menu-items" to={"/orders/status"}>
        <MdOutlineQrCodeScanner className="icon" />
        <span className="text">
            STATUS UPDATE
        </span>

    </Link>

    )
}

{
    isadmin &&(
        
        <Link className="menu-items" to={"/subscrib-message"}>
<MdSubscriptions className="icon" />
    <span className="text">
            SUBSCRIBE-MSG
    </span>

</Link>

    )
}



                </div>
            </div>

      
        </div>
    )
}

export default SideBar