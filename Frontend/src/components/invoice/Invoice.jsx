import React, { forwardRef, useContext } from 'react';
import "./invoice.css";
import { StoreContext } from '../Context';
import logo from "../../assets/yourcartLogo.png"
import moment from 'moment';
const Invoice = forwardRef((props, ref) => {
   console.log(props);
   const {currency} = useContext(StoreContext)

    
    
    
  return (
    <div ref={ref} className="invoice-container">
        
      <div className="invoice-header">
      <img src={logo} alt="" />
        <img src="" alt="" />
        <div className="companyAdd">
            <p> <strong>Ship-from Address : </strong> New Mulund Link Road, Near Durian Company, Goregaon East. Mumbai - 400063.</p>
        </div>
      </div>
    <hr />
      <div className="invoice-details">
        <div>
        <p><strong>Order ID : </strong>{props.orderDetails.orderId}</p>
        <p><strong>Invoice Number : </strong>#{String(props.orderDetails.orderId).substring(0,5)}</p>
        <p><strong>Order Date : </strong> {moment(props.orderDetails.orderDate).format("DD-MM-YYYY")} </p>
        <p><strong>GSTIN : </strong>29AACCF656DDSF</p>
        </div>

        <div className="address">
                <div><strong>Bill To</strong></div>
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
                    <p><strong>Mobile : </strong> {props.address?.mobile}</p>
                </div>
        </div>

        <div className="address">
                <div><strong>Ship To</strong></div>
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
                    <p><strong>Mobile : </strong> {props.address?.mobile}</p>
                </div>
        </div>
      </div>
<hr />
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Amount</th> 
          </tr>
        </thead>
        <tbody>
{props.items.map((item,index)=>{
    return(
        <tr key={index}>
     <td>{item.name}</td>
     <td>{item.qty}</td>
     <td>{item.price}</td>
     <td>{(item.Mrp - item.price)*item.qty}</td>
     <td>{item.price * item.qty}</td>
   </tr>
    )
     
})
             
}

<tr>
     <td><strong>Delivery Charge</strong></td>
     <td>1</td>
     <td>50</td>
     <td>{props.totalAmt > 550 ? -50: 0}</td>
     <td>{props.totalAmt > 550 ? 0: 50}</td>
   </tr>

<tr>
     <td><strong>Total</strong></td>
     <td></td>
     <td></td>
     <td>-{props.totalMrp - props.totalSellingPrice}</td>
     <td>{props.totalSellingPrice}</td>
   </tr>
        </tbody>
      </table>

      <div className="invoice-total">
        <p>Grand Total : {currency}{props.totalAmt}</p>
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

      <div className="invoiceFooter">
        <p><strong>Returns Policy : </strong> At YourCart we try to deliver perfectly each and every time. But in the off-chance that you need to return the item, please do with the <strong>original Brand box/price</strong> </p>

        <p><strong>tag, original packing and invoice </strong> without which it will be really difficult for us to act on your request. Please help us helping you. Teams and conditions apply. </p>

        <div className='contactYourcart'><strong>Contact YourCart : raibrahmadev508@gmail.com </strong></div>
      </div>

      
    </div>
  );
});

export default Invoice;
