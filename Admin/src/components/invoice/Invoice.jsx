import React, { forwardRef, useContext } from 'react'
import { storeContext } from '../context/context'
import "./invoice.css"
import logo from "../../assets/yourcartLogo.png"
import moment from 'moment'
const Invoice = forwardRef((props, ref) => {
    const {currency} = useContext(storeContext)


    return (
        <div ref={ref} className="invoice-container">

            <div className="invoice-header">
                <img src={logo} alt="" />
                <div className="companyAdd">
                    <p> <strong className='bold'>Ship-from Address : </strong> New Mulund Link Road, Near Durian Company, Goregaon East. Mumbai - 400063.</p>
                </div>
            </div>

            <hr />

            <div className="invoice-details">
                <div>
                    <p><strong className='bold'>Order ID : </strong>{props.orderDetails.orderId}</p>
                    <p><strong className='bold'>Invoice Number : </strong>#{String(props.orderDetails.orderId).substring(0, 5)}</p>
                    <p><strong className='bold'>OrderDate : </strong> {moment(props.orderDetails?.orderDate).format("DD-MM-YYYY")}</p>
                </div>

                <div className="barcode">
                    <img src={props.qrcode} alt="" />
                </div>

            </div>
            <hr />

            <div className="invoiceAddress">
                <div className="address">
                    <div><strong className='bold'>Ship To</strong></div>
                    <div>
                        <strong>{props.address?.name}  {props.address.surname}
                        </strong>
                    </div>
                    <div>
                        {props.address?.address}
                    </div>
                    <div>
                        {props.address?.state} {props.address?.city} - {props.address?.pinCode}
                    </div>
                    <div>
                        <p><strong className='bold'>Mobile : </strong> {props.address?.mobile}</p>
                    </div>
                </div>
            </div>
            <hr />
            <div className="invoice-total">
                <p className='bold'>Grand Total : {currency}{props.totalAmt}</p>
            </div>
            <hr />
            <div className="disclaimer">
                <p>This is a computer generated invoice. No signature required.</p>
            </div>

            <div className="thanxLogo">
                <div>
                    <img src={logo} alt="" />
         
                    <h2 className='crimson-text-semibold'>Thank You!</h2>
                    <p>for shopping with us</p>
                </div>
            </div>

        </div>
    )
})

export default Invoice