import React, { useContext, useEffect, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import "./status.css"
import { storeContext } from '../../context/context';
import OrdersDetails from '../orders/OrdersDetails';
import { ToastContainer, toast } from 'react-toastify';
import Loader from "../../loader/Loader"

function Status() {
    const [otp, setOtp] = useState("")
    const [orderId, setOrderId] = useState("")
    const [orderDetails, setOrderDetails] = useState({})
    const [status, setStatus] = useState(OrdersDetails.orderStatus || "Order Placed")
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [items,setItems] = useState([])
    const { currency } = useContext(storeContext)
    const token = localStorage.getItem("AuthToken")
    const [isloading,setIsloading] = useState(false)

    // set scanner configs
    useEffect(() => {
        const config = {
            qrbox: {
                width: 400,
                height: 400
            },
            fps: 5
        }

        const scanner = new Html5QrcodeScanner("scanner", config)

        scanner.render(success, error)

        function success(result) {
            scanner.clear()
            setOrderId(result)
        }

        function error(err) {
            alert(err)
        }
    }, [])
    console.log("orderId", orderId);


    // fetch order details 
    useEffect(() => {
        const fetchOrder = async () => {
          if (!orderId) return;
          setIsloading(true)
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/${orderId}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
              });
            setOrderDetails(response.data[0]);
          } catch (error) {
            console.error(error);
          }finally{
            setIsloading(false)
          }
        };
        fetchOrder();
      }, [orderId]);

    useEffect(()=>{
        setItems(orderDetails.items)
    },[orderDetails])

    console.log(items);


    // update status
    const handleToUpdateStatus = async() =>{
        setIsloading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/update-status`,{orderId,status})
            
            if(status === "Delivered"){
                setShowOtpInput(true)
            }else{
                setShowOtpInput(false)
            }
            toast.success(res.data?.message);
            
            
        } catch (error) {
            console.log(error);
            
        }finally{
            setIsloading(false)
        }
    }
    
    // otp submit
    const handleToSubmitOtp = async() =>{
        setIsloading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/verify-status`,{orderId,otp})
            toast.success(res.data.message);
            setShowOtpInput(false)
            
        } catch (error) {
            console.log(error);
        }finally{
            setIsloading(false)
        }
    }


    return (
        <div className="statusMainContainer">
            {
                isloading && <Loader/>
            }
            <ToastContainer/>
            <div className="heading">
                <div className="line1"></div>
                <h2 className='playfair-display-font'>Product Status</h2>
                <div className="line1"></div>
            </div>
            <div className="scannerContainer">
                <h3>QR Code</h3>
                <div className='scanner' id='scanner'></div>
            </div>
{
orderDetails && orderId &&(
    <div className="order-details">
    <h3>Order Information</h3>
    <div className="headDetails">
        <div className='someInfo'>
        <span>Name : </span>
        <p>{orderDetails.address?.name} {orderDetails.address?.surname}</p>
        </div>
       <div className="someInfo">
       <span>Order Status : </span>
       <p>{orderDetails.orderStatus}</p>
       </div>

       <div className="someInfo">
       <span>Payment Status : </span>
       <p>{orderDetails.paymentStatus ? "Paid":"Not Paid"}</p>
        </div>
        
        
    </div>

    <div className="detailsContainer">
        <h4>Products</h4>
        <div className="details">
            {items &&
                items.map((item, index) =>{
                    return(
                        <div className="detailsCard" key={index}>
                            <div className='img'>
                            <img src={item.image[0]} alt="" />
                            </div>
                            <div className='name'>
                                <p>{item.name}</p>
                            </div>

                            <div className='sizeQty'>
                            <p>Qty : {item.qty}</p>
                            <p>Size : {item.size}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
</div>
)
}


{
    orderDetails && orderId && (
        <div className="order-update">
        <h3>Update Order Status</h3>
                <div className="selectStatus" >
                    <select onChange={(e)=>setStatus(e.target.value)} 
                    disabled={OrdersDetails.orderStatus === "Delivered"} 
                    value={status}>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                    </select>

                    <button onClick={handleToUpdateStatus}>Update Status</button>
                </div>

            {
                showOtpInput && 
                <div className="otpContainers">
                    <form onSubmit={handleToSubmitOtp} className='otpContainer'>
                        <input type="text" onChange={(e)=>setOtp(e.target.value)} value={otp} placeholder='Enter Otp' />
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            }

    </div>
    )
}
        </div>


    )
}

export default Status