import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../Context'
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { ImBin } from "react-icons/im";
import "./cart.css"
import { useNavigate } from 'react-router-dom';
import { AiFillSafetyCertificate } from "react-icons/ai";

function Cart() {
  const { products,
    cartCounts, 
    cartItems,
    cartTotalAmt,
    totalMrp,
    deliveryAmt,
    percentagedis, 
    addToCart, 
    removeToCart, 
    currency,
    totalAmount,
    deleteCartItems } = useContext(StoreContext)

  const [cartData, setCartData] = useState([])
  const navigate = useNavigate(); 
const token = localStorage.getItem("AuthToken")
if(Object.keys(cartItems).length === 0){
  navigate("/")
}
  useEffect(() => {
    const itemsList = [];

    for (const productId in cartItems) {
      const sizes = cartItems[productId]
      console.log(sizes);

      for (const size in sizes) {

        itemsList.push({
          _id: productId,
          size,
          quantity: sizes[size],
        })
      }
    }

    setCartData(itemsList)
  }, [cartItems])
  console.log("cart", cartData);

// cartItems count 
const cartCountWithWord = ()=>{
  if(cartCounts === 1){
    return "1 item"
  }else{
    return `${cartCounts} items`
  }
}

// nevigate to product details page

  const productDetails = (id) => {
    navigate(`/product/${id}`);
  };


const selectAddress = () =>{
  navigate("/address")
}

// if cart items is 0 then nevigate to home page 
if(!cartData){
  navigate("/")
}


  return (
    <div className="cartMainContainer">
      <div className="cartContainer">
        <h2>CART ITEMS</h2>
        
        <div className="cartCards">
          <hr />
          {
            cartData.map((item, index) => {
              const productsData = products.find((product) => product._id === item._id)
              return (
                <div className="cartCard" key={index}>
                  <div className="imgName">
                    <div className="img" onClick={()=>productDetails(productsData._id)}>
                      <img src={productsData.image[0]} alt="" />
                    </div>
                    <div className="nameAndPrice" >
                      <div className="name" onClick={()=>productDetails(productsData._id)}>
                      {productsData.name}
                      </div>
                      <div className="size">
                        Size : {item.size}
                      </div>
                      <div className="price">
                        <p>{currency}{productsData.Mrp * item.quantity}</p>
                      <p>{currency}{productsData.price * item.quantity}</p>
                      <p>{percentagedis(productsData.Mrp,productsData.price)}% off</p>

                      </div>
                    </div>
                  </div>
                  <div className="updateAndDelete">
                    <div className="updateCart">
                      <button onClick={()=>removeToCart(item._id,item.size)}><FaMinus /></button>
                      <div>{item.quantity}</div>
                      <button onClick={()=>addToCart(item._id,item.size)}><FaPlus /></button>
                    </div>

                    <div className="deleteCart" onClick={()=>deleteCartItems(item._id,item.size)}>

                      <ImBin />
                    </div>
                  </div>
                </div>

              )
            })
          }
        </div>
      </div>
<div className="cartRightContainer">

<div className='rightCart'>



      <div className="cartAmountContainer">
      <h2>PRICE DETAILS</h2>
      <hr />
        <div className="cartAmount">
          <div>
          <div className="Amt">
            <div className="price">Price ({cartCountWithWord()})</div>
            <div className="price">{currency}{cartTotalAmt}</div>
          </div>

          <div className="discount">
            <div className="dis1">Discount</div>
            <div className="dis2">- {currency}{totalMrp - cartTotalAmt}</div>
          </div>

          <div className="delivery">
            <div className="deli1">Delivery Charges</div>
            <div className={`${deliveryAmt === "Free"?"free":"deliveryCharge"}`}>{deliveryAmt}</div>
          </div>
          <hr />
          <div className="total-amt">
            <div className="total">Total Amount</div>
            <div className="total">{currency}{totalAmount}</div>
          </div>
          </div>

        </div>


      </div>

<div>
<p><span><AiFillSafetyCertificate className='icon'/></span>Safe and Secure Payments.Easy returns.100% Authentic products.</p>
</div>


      </div>
      {      token && (
  <div className="placeOrderBtn">
        <button onClick={()=>selectAddress()}>
          Place Order
        </button>
      </div>)}

      </div>
    </div>
  )
}

export default Cart