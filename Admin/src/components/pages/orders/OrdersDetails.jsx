import axios from 'axios'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { storeContext } from '../../context/context'
import "./ordersDetails.css"
import { FaFileInvoice } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Invoice from '../../invoice/Invoice'
import moment from 'moment'
import { Navigate } from 'react-router-dom'

function OrdersDetails() {
    const { orderId } = useParams()
    const [orderDetails, setOrderDetails] = useState({})
    const { currency,auth } = useContext(storeContext)
    const [items, setItems] = useState([])
    const [totalAmt, setTotalAmt] = useState(0)
    const [deliveryFee, setDeliveryFee] = useState(null)
    const [address, setAddress] = useState({})
    const [totalMrp, setTotalMrp] = useState(0)
    const [sellingPrice, setSellingPrice] = useState(0)
    const [status, setStatus] = useState("")
    const token = localStorage.getItem("AuthToken")
    const invoiceRef = useRef(null)
    const [isgenerating,setIsgenerating] = useState(false)
    const [qrCode,setQrcode] = useState(null)


    if (auth?.role === "Worker") {
        return <Navigate to="/login" />
    }

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setOrderDetails(response.data[0]);

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [orderId])


    // setAll the info 
    useEffect(() => {
        if (orderDetails && Object.keys(orderDetails).length > 0) {
            setAddress(orderDetails.address || {})
            setItems(orderDetails.items || [])
            setTotalAmt(orderDetails.totalAmount || 0)
            setStatus(orderDetails.orderStatus)
            setQrcode(orderDetails.qrcode)
            const fee = orderDetails.totalAmount < 550 ? `${currency}50` : "Free"
            setDeliveryFee(fee)

        }
    }, [orderId, orderDetails])

    // cal total mrp
    const calTotalMrp = (items) => {
        let totalMrp = 0;
        for (const item of items) {
            totalMrp += item.Mrp * item.qty || 0
        }
        return totalMrp
    }

    const calTotalSellingPrice = (items) => {
        let totalSellingPrice = 0;
        for (const item of items) {
            totalSellingPrice += item.price * item.qty || 0
        }
        return totalSellingPrice
    }

    useEffect(() => {
        setTotalMrp(calTotalMrp(items))
        setSellingPrice(calTotalSellingPrice(items))
    }, [items])


    // generating barcode invoice
    const generateInvoice = async() =>{
        setIsgenerating(true)
       try {
        const input = invoiceRef.current;

        if(!input){
            console.error("Invoice reference not found!");
            return;
        }

        // Capture the HTML element as an image
        const canvas = await html2canvas(input, {scale:2})
        const imgData = canvas.toDataURL("image/png")

        // create pdf
        const pdf = new jsPDF('p', 'mm', 'junior-legal');
        const width = pdf.internal.pageSize.getWidth()
        const height = (canvas.height * width) / canvas.width

        // add img to pdf
        pdf.addImage(imgData,"PNG",0,0,width,height)
        pdf.save(`invoice-${orderId}`)

       } catch (error) {
        console.error('Error generating PDF:', error);
       }
       finally{
        setIsgenerating(false)
    }

    }

    return (
        <div className="order-Details-MainContainer">
            <div className="heading">
                <div className="line1"></div>
                <h2 className='playfair-display-font'>Order Details</h2>
                <div className="line1"></div>
            </div>

            <div className='invoice-hide'>
                <Invoice ref={invoiceRef} 
                    address={address}
                    totalAmt={totalAmt}
                    orderDetails = {orderDetails}
                    qrcode = {qrCode} />
                    
            </div>

            <div className="left-right-container">


                <div className="left-Container">
                    <div className="ordersDetails">
                        {
                            items.map((item, index) => {
                                return (
                                    <div className="itemCard" key={index}>
                                        <div className="img">
                                            <img src={item.image[0]} alt="" />
                                        </div>

                                        <div className="nameAndOthers">
                                            <div className="name">
                                                <p>{item.name}</p>
                                            </div>
                                            <div className="size gray-color">
                                                <p>Size : {item.size}</p>
                                            </div>
                                            <div className="qty gray-color">
                                                <p>Qty : {item.qty}</p>
                                            </div>
                                            <div className="sellingPrice">
                                                <p>{currency}{item.price * item.qty}</p>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="otherDetails">
                        <div className={`deliveryStatus ${status === "Delivered" ? "Green" : ""}`}>
                            {status}
                        </div>
                        <div className="statusDate">
                            On {
                            status === "Order Placed" ? (
                                <span> {moment(orderDetails.orderDate).format("lll")}</span>
                            ) :(<span> {moment(orderDetails.updatedAt).format("lll")}</span>)
                        }
                        </div>
                    </div>
                </div>

                <div className="right-Container">
                    <div className="invoiceContainer">
                        <div className="invoiceBtn" onClick={()=>generateInvoice()}>
                            <p className='invoce'><FaFileInvoice className='invcIcon' />{
                                isgenerating ? "Generating Invoice.." :"Download Invoice"
                            }</p>
                        </div>
                    </div>
                    <div className="addAndPriceContainer">
                        <div className="shippingAddContainer">
                            <div className="adressContainer">

                                <p>Shipping Details</p>
                                <hr />

                                {address && (
                                    <div className="shippingAddress">
                                        <div className="name">
                                            {address.name} {address.surname}
                                        </div>
                                        <div className="address">
                                            {address.address}
                                        </div>
                                        <div className="address">
                                            {address.state} {address.city} - {address.pinCode}
                                        </div>
                                        <div className="email">
                                            <span>Email : </span>{address.email}
                                        </div>
                                        <div className="phone">
                                            <span>Phone No. : </span>{address.mobile}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="OrderPriceDetailsContainer">
                            <h6>Price Details</h6>
                            <hr />
                            <div className="priceDetails">
                                <div className="listPrice">
                                    <p>List Price</p>
                                    <p>{currency}{totalMrp}</p>
                                </div>
                                <div className="selling">
                                    <p>Selling price</p>
                                    <p>{currency}{sellingPrice}</p>
                                </div>

                                <div className="dis">
                                    <p>Discount</p>
                                    <p>-{currency}{totalMrp - sellingPrice}</p>
                                </div>

                                <div className={`deliveryFee ${deliveryFee === "Free" ? "green" : ""}`}>
                                    <p>Delivery Charge</p>
                                    <p>{deliveryFee}</p>
                                </div>
                                <hr />
                                <div className="totalAmount">
                                    <p>Total Amount</p>
                                    <p>{currency}{totalAmt}</p>
                                </div>
                            </div>


                        </div>
                    </div>




                </div>


            </div>
        </div>
    )
}

export default OrdersDetails