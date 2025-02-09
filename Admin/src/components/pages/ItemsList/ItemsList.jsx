import React, { useContext, useEffect, useState } from 'react'
import "./itemList.css"
import axios from 'axios'
import { FaEdit } from "react-icons/fa";
import { storeContext } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import { ImBin } from "react-icons/im";
import ConfirmMessage from '../../confirm_loader/ConfirmMessage';
import { ToastContainer,toast } from 'react-toastify';
import { Navigate } from 'react-router-dom'

function ItemsList() {
    const { currency,auth } = useContext(storeContext)
    const [products, setproducts] = useState([])
    const navigate = useNavigate()
    const [showConfirmPopUp,setShowConfirmPopUp] = useState(false)
    const [productId,setProductId] = useState(null)

    if (auth?.role === "Worker") {
        return <Navigate to="/login" />
    }

    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/products/get-products`)
            setproducts(res.data);

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    console.log(products);

const handleToClick = (productId) =>{
    navigate(`/products/${productId}`)
}   

const handleToShowDelete = (id) =>{
    setProductId(id)
    setShowConfirmPopUp(true)
}

const handleToConfirm = async() =>{
    try {
        const res = await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/products/${productId}`)
        toast.success(res.data.msg);
        setShowConfirmPopUp(false)
        fetchData()
    } catch (error) {
        toast.error(error.response.data.error);
        
    }
}

const handleToCancel = () =>{
    setShowConfirmPopUp(false)
}

    return (
        <div className="productListContainer">
            <ToastContainer/>
{
    showConfirmPopUp &&             <ConfirmMessage message={"Are you sure to delete the product."} 
    onConfirm={handleToConfirm}
    onCancel={handleToCancel}/>
}
                            <div className="heading">
            <div className="line1"></div>
            <h2 className='playfair-display-font'>Products</h2>
            <div className="line1"></div>
          </div>
            <div className="productList">
                {
                    products.map((item, index) => {
                        return (
                            <div className="productCard" key={index} onClick={()=>handleToClick(item._id)}>
                                <div className="img">
                                    <img src={item.image[0]} alt="" />
                                </div>

                                <div className="name">
                                    <p>{item.name}</p>
                    
                                </div>
                                <hr />

                                <div className="price-del">
                                    <p>{currency}{item.price}</p>
                                    <span onClick={(e)=>{
                                        e.stopPropagation();
                                        handleToShowDelete(item._id)
                                    }}><ImBin/></span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default ItemsList