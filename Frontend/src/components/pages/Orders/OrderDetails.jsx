import axios from 'axios'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { StoreContext } from '../../Context'
import "./orderDetails.css"
import { FaFileInvoice } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Invoice from '../../invoice/Invoice'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment'
import LoaderNew from "../../loader2/LoaderNew"

function OrderDetails() {
    const { orderId } = useParams()
    const { currency } = useContext(StoreContext)
    const [orderDetails, setOrderDetails] = useState([])
    const token = localStorage.getItem("AuthToken")
    const [items, setItems] = useState([])
    const [totalAmt, setTotalAmt] = useState(0)
    const [deliveryFee, setDeliveryFee] = useState(null)
    const [address, setAddress] = useState({})
    const [totalMrp, setTotalMrp] = useState(0)
    const [sellingPrice, setSellingPrice] = useState(0)
    const [status, setStatus] = useState("")
    const [isgenerating, setIsgenerating] = useState(false)
    const [isloading, setIsloading] = useState(false)

    const fetchOrderDetails = async () => {
        setIsloading(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setOrderDetails(res.data[0])
            console.log(orderDetails);


        } catch (error) {
            console.log(error);

        } finally {
            setIsloading(false)
        }
    }

    useEffect(() => {
        fetchOrderDetails()
    }, [])

    console.log();

    useEffect(() => {
        if (orderDetails && Object.keys(orderDetails).length > 0) {
            setItems(orderDetails.items || []);
            setAddress(orderDetails.address || {});
            setTotalAmt(orderDetails.totalAmount || 0);
            setStatus(orderDetails.orderStatus)


            const fee = orderDetails.totalAmount < 550 ? `${currency}50` : "Free";
            setDeliveryFee(fee);
        }
    }, [orderDetails, orderId]);


    // CAL TOTAL MRP
    const calculateTotalMrp = (items) => {
        let totalMrp = 0;
        for (const item of items) {
            totalMrp += item.Mrp * item.qty || 0;
        }
        return totalMrp;
    };

    const calculateTotalSellingPrice = (items) => {
        let totalPrice = 0
        for (const item of items) {
            totalPrice += item.price * item.qty || 0
        }
        return totalPrice
    }

    useEffect(() => {
        setTotalMrp(calculateTotalMrp(items));
        setSellingPrice(calculateTotalSellingPrice(items))
    }, [items]);


    // logic to download invoice
    const invoiceRef = useRef(null);

    const generatePDF = async () => {
        setIsgenerating(true)

        try {
            const input = invoiceRef.current;
            if (!input) {
                console.error("Invoice reference not found!");
                return;
            }
            // Capture the HTML element as an image
            const canvas = await html2canvas(input, { scale: 2 })
            const imgData = canvas.toDataURL("image/png")

            // Create a PDF
            const pdf = new jsPDF()
            const width = pdf.internal.pageSize.getWidth();
            const height = (canvas.height * width) / canvas.width;

            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 0, width, height)
            pdf.save(`invoice-${orderId}`)

        } catch (error) {
            console.error('Error generating PDF:', error);

        } finally {
            setIsgenerating(false)
        }
    };




    return (
        <div className="order-Details-MainContainer">
            {
                isloading && <LoaderNew />
            }
            <div className="heading">
                <div className="line1"></div>
                <h2 className='playfair-display-font'>Order Details</h2>
                <div className="line1"></div>
            </div>

            <div className='invoice-hide'>
                <Invoice ref={invoiceRef}
                    items={items}
                    address={address}
                    totalAmt={totalAmt}
                    deliveryFee={deliveryFee}
                    orderDetails={orderDetails}
                    totalMrp={totalMrp}
                    totalSellingPrice={sellingPrice} />
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
                                            <div className="price">
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
                            On
                            {
                                status === "Order Placed" ? (
                                    <span> {moment(orderDetails.orderDate).format("lll")}</span>
                                ) : (<span> {moment(orderDetails.updatedAt).format("lll")}</span>)
                            }

                        </div>
                    </div>
                </div>

                <div className="right-Container">
                    <div className="invoiceContainer">
                        <div className={`invoiceBtn ${status !== "Delivered" ? "disableInvoiceBtn" : ""}`}>
                            <p className='invoce' onClick={generatePDF}><FaFileInvoice className='invcIcon' />
                                {
                                    isgenerating ? " Generating Invoice.." : " Download Invoice"
                                }
                            </p>
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

export default OrderDetails
