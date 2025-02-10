import React, { useContext, useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import "./status.css";
import { storeContext } from "../../context/context";
import OrdersDetails from "../orders/OrdersDetails";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../loader/Loader";

function Status() {
    const [otp, setOtp] = useState("");
    const [orderId, setOrderId] = useState("");
    const [orderDetails, setOrderDetails] = useState({});
    const [status, setStatus] = useState(orderDetails?.orderStatus || "Order Placed");
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [items, setItems] = useState([]);
    const { currency } = useContext(storeContext);
    const token = localStorage.getItem("AuthToken");
    const [isLoading, setIsLoading] = useState(false);
    const [lastFetchedOrderId, setLastFetchedOrderId] = useState(null);

    // Set up QR scanner
    useEffect(() => {
        const config = { qrbox: { width: 400, height: 400 }, fps: 5 };
        const scanner = new Html5QrcodeScanner("scanner", config);

        scanner.render(
            (result) => {
                scanner.clear();
                if (orderId !== result) {
                    setOrderId(result);
                }
            },
            (err) => {
                console.error("QR Scan Error:", err);
            }
        );
    }, []);

    console.log("Scanned Order ID:", orderId);

    // Fetch Order Details
    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId || orderId === lastFetchedOrderId) return;
            setIsLoading(true);

            try {
                const response = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.length > 0) {
                    setOrderDetails(response.data[0]);
                    setStatus(response.data[0]?.orderStatus || "Order Placed");
                    setItems(response.data[0]?.items || []);
                    setLastFetchedOrderId(orderId);
                } else {
                    toast.error("Order not found!");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error("Failed to fetch order details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // Update Order Status
    const handleToUpdateStatus = async () => {
        if (!orderId) return toast.error("No order selected.");

        setIsLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/update-status`, { orderId, status });

            if (status === "Delivered") {
                setShowOtpInput(true);
            } else {
                setShowOtpInput(false);
            }

            toast.success(res.data?.message);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status.");
        } finally {
            setIsLoading(false);
        }
    };

    // OTP Submission
    const handleToSubmitOtp = async (e) => {
        e.preventDefault();
        if (!otp) return toast.error("Please enter OTP.");

        setIsLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/verify-status`, { orderId, otp });

            toast.success(res.data?.message || "Order Verified Successfully");
            setShowOtpInput(false);

            // Refresh order details after OTP verification
            setOrderId(""); // Reset orderId to trigger refetch
        } catch (error) {
            console.error("OTP Verification Error:", error);
            toast.error(error.response?.data?.error || "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="statusMainContainer">
            {isLoading && <Loader />}
            <ToastContainer />

            <div className="heading">
                <div className="line1"></div>
                <h2 className="playfair-display-font">Product Status</h2>
                <div className="line1"></div>
            </div>

            <div className="scannerContainer">
                <h3>QR Code</h3>
                <div className="scanner" id="scanner"></div>
            </div>

            {orderDetails && orderId && (
                <div className="order-details">
                    <h3>Order Information</h3>
                    <div className="headDetails">
                        <div className="someInfo">
                            <span>Name: </span>
                            <p>{orderDetails.address?.name} {orderDetails.address?.surname}</p>
                        </div>
                        <div className="someInfo">
                            <span>Order Status: </span>
                            <p>{orderDetails.orderStatus}</p>
                        </div>
                        <div className="someInfo">
                            <span>Payment Status: </span>
                            <p>{orderDetails.paymentStatus ? "Paid" : "Not Paid"}</p>
                        </div>
                    </div>

                    <div className="detailsContainer">
                        <h4>Products</h4>
                        <div className="details">
                            {items.map((item, index) => (
                                <div className="detailsCard" key={index}>
                                    <div className="img">
                                        <img src={item.image[0]} alt={item.name} />
                                    </div>
                                    <div className="name">
                                        <p>{item.name}</p>
                                    </div>
                                    <div className="sizeQty">
                                        <p>Qty: {item.qty}</p>
                                        <p>Size: {item.size}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {orderDetails && orderId && (
                <div className="order-update">
                    <h3>Update Order Status</h3>
                    <div className="selectStatus">
                        <select onChange={(e) => setStatus(e.target.value)} disabled={orderDetails?.status==="Delivered"} value={status}>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Order Confirmed">Order Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <button onClick={handleToUpdateStatus}>Update Status</button>
                    </div>

                    {showOtpInput && (
                        <div className="otpContainers">
                            <form onSubmit={handleToSubmitOtp} className="otpContainer">
                                <input type="text" onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter OTP" />
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Status;
