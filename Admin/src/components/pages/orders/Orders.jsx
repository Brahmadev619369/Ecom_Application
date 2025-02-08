
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { storeContext } from '../../context/context'
import "./orders.css"

function Orders() {
    // const token = localStorage.getItem("AuthToken")
    const [orders, setOrder] = useState([])
    const { currency } = useContext(storeContext)
    const navigate = useNavigate()
const token = localStorage.getItem("AuthToken")
    // fetch orders
    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/admin/orders`,{
              headers:{
                Authorization : `Bearer ${token}`
              }
            })
            console.log(res.data);
            
            setOrder(res.data)
        } catch (error) {
            console.log(error);

        }

    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const orderDetails = (orderId) =>{
        navigate(`/orders/${orderId}`)
      }

      console.log(orders);
  

    return (
<div className="OrdersContainer">
                <div className="heading">
            <div className="line1"></div>
            <h2 className='playfair-display-font'>Orders</h2>
            <div className="line1"></div>
          </div>

          {/* {
            orders.map((item,index)=>{
              return(
                <div>
                  <img src={item?.items?.[0].image?.[0]} alt="" />
                </div>
              )
            })
          } */}

          <div className="ordersCards">
            {
              orders.length>0 ? (
                  orders.map((item,index)=>{
                    return(
                      <div className="ordersCard" key={index} onClick={()=>orderDetails(item?.orderId)}>
                        <div className="img">
                          <img src={item?.items?.[0].image?.[0]} alt="" />
                          {
                            item?.items?.length>1 && (
                              <div className="overlayImg ">
                          +{(item?.items?.length) - 1} more
                        </div>
                            )
                          }
                        </div>

                          <div className="nameAndOther">
                          <div className="name">
                            <p>{item?.items?.[0].name}</p>
                          </div>

                          {
                            item?.items?.length > 1 &&(
                              <div className="overlayName ">
                          +{(item?.items?.length) - 1} more
                        </div>
                            )
                          }

                          </div>


                          <div className="price">
                          <p>{currency}{item?.totalAmount}</p>
                          </div>

                          <div className={`status ${item.orderStatus === "Delivered"? "orderDelivered":""}`}>
                    <p>{item?.orderStatus}</p>
                  </div>


                      </div>
                    )
                  })
              ):(
                <div className="hey">No Orders Found</div>
              )
            }
          </div>
          

    </div>
  )
}

export default Orders
