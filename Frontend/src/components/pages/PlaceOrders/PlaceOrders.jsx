import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../Context'
import "../Cart/cart.css"
import { useNavigate } from 'react-router-dom';
import "./placeOrders.css"
import axios from 'axios';

function PlaceOrders() {
    const { products,
      cartCounts, 
      cartItems,
      cartTotalAmt,
      totalMrp,
      deliveryAmt,
      percentagedis, 
      currency,
      totalAmount } = useContext(StoreContext)
const token = localStorage.getItem("AuthToken")
const jsonString = localStorage.getItem("useAddress")

const navigate = useNavigate()
if(Object.keys(cartItems).length === 0){
  navigate("/")
}

const address = JSON.parse(jsonString);

const [placeAddress,setPlaceAddress] = useState([])

useEffect(()=>{
  setPlaceAddress(address)
},[])
console.log("placeAddress",placeAddress);

  const [placeItems,setPlaceItems] = useState([])
    const [cartData, setCartData] = useState([])

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



useEffect(() => {
  if(cartData.length > 0){
    const updatedPlaceData = cartData.map((item)=>{
      let product = products.find((product)=>product._id === item._id)
      if(product){
        return{
          ...product,
          size:item.size,
          qty:item.quantity
        }
      }

      return null
    })
  
    setPlaceItems(updatedPlaceData)
  }
}, [cartData, products])
console.log("ccc",placeItems);

console.log("placeItems",placeItems);

// cartItems count 
const cartCountWithWord = ()=>{
  if(cartCounts === 1){
    return "1 item"
  }else{
    return `${cartCounts} items`
  }
}



// placeOrder and make payments
const handleToPayment = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/placeOrders/pay`, {
      totalAmount: totalAmount,
      address:placeAddress,
      items:placeItems
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data);

    window.location.href = response.data.paymentUrl;
  } catch (error) {
    console.error('Payment failed!', error);
  }
};


  return (
   <div className="cartMainContainer">
         <div className="cartContainer">
           <h2>ITEMS</h2>
           
           <div className="cartCards">
             <hr />
             {
               placeItems.map((item, index) => {
                 
                 return (
                   <div className="cartCard" key={index}>
                     <div className="imgName">
                       <div className="img">
                         <img src={item.image[0]} alt="" />
                       </div>
                       <div className="nameAndPrice" >
                         <div className="name">
                         {item.name}
                         </div>
                         <div className="size">
                           Size : {item.size}
                           <div>Qty : {item.qty}</div>
                         </div>
                         <div className="price">
                           <p>{currency}{item.Mrp * item.qty}</p>
                         <p>{currency}{item.price * item.qty}</p>
                         <p>{percentagedis(item.Mrp,item.price)}% off</p>
   
                         </div>
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

         <div className="placeOrderAddressContainer">
          <h2>DELIVERY ADDRESS</h2>
          <hr />
         <div className="placeOrderAddress">
<div className="name">
  {placeAddress?.name} {address.surname}
</div>
<div className="addrs1">
  {placeAddress?.address}
</div>
<div className="addrs1">
  {placeAddress.state} {placeAddress.city}-{placeAddress.pinCode}
</div>

<div className="contacts">
  <span>Mobile No. : </span>{placeAddress.mobile}
</div>
<div className="contacts">
<span>Email : </span>{placeAddress.email}
</div>
</div>
         </div>
         </div>
   
         <div className="paymentBtn">
           <button onClick={handleToPayment}>
             Payment
           </button>
         </div>
         </div>
       </div>
  )
}

export default PlaceOrders