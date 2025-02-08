import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../Context'
import "./wishlist.css"
import { useNavigate } from 'react-router-dom'

function Wishlist() {
    const token = localStorage.getItem("AuthToken")
    const { getWishlist, removeToWishlist ,currency} = useContext(StoreContext)
    const [wishlist, setWishlist] = useState([])
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate()


    const handleOverlay = (e) =>{
        e.stopPropagation();
        setShowDetails(!showDetails)
    }
    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`); 
      };

    useEffect(() => {
        getWishlist(token).then((data) => {
            setWishlist(data?.products || [])
        })

    }, [token])

    const discountPer = (mrp, price) => {
        return (((mrp - price) / mrp) * 100).toFixed(2)
    }

    return (
        <div className='wishlistMainContainer'>
                        <div className="heading">
                <div className="line1"></div>
                <h2 className='playfair-display-font'>Wishlist </h2>
                <div className="line1"></div>
            </div>
            <div className="wishlisContainer">
                <div className="wishlist">
                    {
                        wishlist && wishlist.length > 0 ? (
                            wishlist.map((item, index) => {
                                return (
                                    <div className={'wishlist-card'} onClick={()=>handleCardClick(item._id)}>
                                        <div className="img">
                                            <img src={item?.image?.[0]} alt="" />
                                        </div>
                                        <div className="title" onClick={handleOverlay}>
                                            <p>{item.name}</p>
                                        </div>
                                        <div className="overlay" >
                                            <div className="prices">

<div className='flex-row'>
<div>
                                                    {currency}{item.price}
                                                </div>

                                                <div className='linethrough'>
                                                    {currency}{item.Mrp}
                                                </div>

</div>

                                                <div className='dics'>

                                                    <p>{
                                                        discountPer(item.Mrp, item.price)
                                                    }% off</p>                             </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })

                        ) : (
                            <div>No Wishlist Found</div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Wishlist


