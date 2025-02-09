import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../Context'
import "./orders.css"
import { useNavigate } from 'react-router-dom'
import LoaderNew from "../../loader2/LoaderNew"
import toast from 'react-hot-toast'
import moment from "moment"

function Orders() {
  const token = localStorage.getItem("AuthToken")
  const [myOrders, setMyOrder] = useState([])
  const { currency } = useContext(StoreContext)
  const [isloading , setIsloading] = useState(false)

  const fetchMyorders = async () => {
    setIsloading(true)

    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/myOrders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      setMyOrder(res.data)
    } catch (error) {
      toast.error(error.response.data.error || "Something went wrong!")
    }finally{
      setIsloading(false)
    }
  }

  const navigate = useNavigate()

  const orderDetails = (orderId) =>{
    navigate(`/myOrders/${orderId}`)
  }

  useEffect(() => {
    fetchMyorders()
  }, [])
  console.log("myorders", myOrders);

  return (
    <div className="OrdersContainer">
      {
        isloading && <LoaderNew/>
      }
                <div className="heading">
            <div className="line1"></div>
            <h2 className='playfair-display-font'>Orders</h2>
            <div className="line1"></div>
          </div>
      <div className="ordersCards">
        {
          myOrders ? (
            myOrders.map((item, index) => {
              return (
                <div className="ordersCard" key={index} onClick={()=>orderDetails(item.orderId)}>
                  <div className="img">
                    <img src={item.items[0]?.image[0]} alt="" />
                    {
                      item.items.length > 1 && (
                        <div className="overlayImg ">
                          +{(item.items.length) - 1} more
                        </div>
                      )
                    }
                  </div>

                  <div className="nameAndOther">
<div className="names">
<p>{item.items[0]?.name}</p>

{
  item.items.length > 1 && (
    <div className="overlayName">
      +{(item.items.length) - 1} more
    </div>
  )
}
</div>

                  </div>
                  <div className="price">
                    <p>{currency}{item.totalAmount}</p>
                  </div>

                  <div className={`status ${item.orderStatus === "Delivered"? "orderDelivered":""}`}>
                    <p>{item.orderStatus}</p>
                    <span> {moment(item?.updatedAt).format("lll")}</span>
                  </div>

                </div>
              )
            })

          ) : (
            <div className="hey">No Orders Found.</div>
          )
        }
      </div>
    </div>
  )
}

export default Orders