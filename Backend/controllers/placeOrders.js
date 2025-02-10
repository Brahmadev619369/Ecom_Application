const OrderPlace = require("../models/placeOrders")
const User = require("../models/users")
const crypto = require("crypto")
const CryptoJS = require("crypto-js");
const QRCode = require('qrcode');
const mongoose = require("mongoose")
const axios = require('axios');
const uniqid = require("uniqid");
const PlaceOrders = require("../models/placeOrders");
const Cart = require("../models/cart")
const Products = require("../models/products")
const nodemailer = require("nodemailer")
const moment = require("moment")

const generateTranscId = () => {
    return "T" + Date.now()
}

const generateInvoiceNumber = async() =>{
    const totalOrders = await PlaceOrders.countDocuments()
    return `24-24/${totalOrders + 1}`
}

// nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const phonePeConfigs = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantKey: process.env.PHONEPE_MERCHANT_KEY,
    saltKey: process.env.PHONEPE_SALT_KEY,
    backEndUrl: process.env.BACKEND_URL,
    frontEndUrl: process.env.FRONTEND_URL,
    phonePeHostUrl: process.env.PHONEPE_HOST_URL,
    apiEndPoint: "pg/v1/pay",
    saltIndex: 1,
    merchantTransactionId: uniqid()
}

const placeOrdersAndMakePayment = (req, res) => {
    const { totalAmount, address, items } = req.body;
    const userId = req.user._id
    // console.log(items);

    try {
        this.address = address;
        this.totalAmount = totalAmount
        this.items = items
        this.userId = userId


        const data = {
            merchantId: phonePeConfigs.merchantId,
            merchantTransactionId: generateTranscId(),
            merchantUserId: 'MUID' + userId,
            amount: totalAmount * 100,
            redirectUrl: `${process.env.BACKEND_URL}/api/placeOrders/status/${generateTranscId()}`,
            redirectMode: "POST",
            paymentInstrument: {
                "type": "PAY_PAGE"
            }
        }

        // console.log(data);



        const payload = JSON.stringify(data)
        const payloadMain = Buffer.from(payload).toString("base64");

        const key = phonePeConfigs.saltKey
        const keyIndex = phonePeConfigs.saltIndex;
        const string = payloadMain + `/${phonePeConfigs.apiEndPoint}` + key;


        const sha256 = CryptoJS.SHA256(string).toString();
        const checkSum = sha256 + "###" + keyIndex

        const prod_URl = `${phonePeConfigs.phonePeHostUrl}/${phonePeConfigs.apiEndPoint}`


        const requestData = {
            method: "POST",
            url: prod_URl,
            headers: {
                accept: "application/json",
                "X-VERIFY": checkSum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(requestData).then(async function (response) {
            const phonePeResponse = response.data;
            const paymentStatus = phonePeResponse.code;
            // console.log(response);
            if (paymentStatus === "PAYMENT_INITIATED") {
                // Extract the payment redirection URL from the response
                const paymentUrl = phonePeResponse.data.instrumentResponse.redirectInfo.url;

                // send the payment URL back to frontend 
                res.status(200).json({
                    success: true,
                    message: "Payment_Initiated",
                    paymentUrl: paymentUrl
                })
            } else {
                res.status(400).json({
                    success: false,
                    msg: "Payment initiation failed",
                })
            }
        }).catch(function (error) {
            // console.error("Payment API Error:", error.message);
            res.status(500).json({ msg: "Payment Failed", status: "error", error: error.message });
        });
    } catch (e) {
        // console.error("Internal Server Error:", e.message);
        res.status(500).json({ msg: "Internal Server Error", status: "error", error: e.message });
    }
};

const checkStatus = async (req, res) => {
    try {
        const orderId = new mongoose.Types.ObjectId()
        const qrCode = await QRCode.toDataURL(orderId.toString())

        const merchantTransactionId = req.params.txnId;
        const merchantId = phonePeConfigs.merchantId;
        const key = phonePeConfigs.saltKey;
        const keyIndex = phonePeConfigs.saltIndex;

        const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
        const sha256 = CryptoJS.SHA256(string).toString();
        const checkSum = sha256 + "###" + keyIndex;

        const URL = `${phonePeConfigs.phonePeHostUrl}/pg/v1/status/${merchantId}/${merchantTransactionId}`

        const options = {
            method: "GET",
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checkSum,
                'X-MERCHANT-ID': merchantId,
            }
        };

        // console.log("Status API Request Options:", options);

        try {
            const response = await axios.request(options)
            // console.log("resposnse",response);

            // console.log(response.data.data);

            if (response.data.data.responseCode === "SUCCESS") {
                const newOrder = new PlaceOrders({
                    orderId: orderId,
                    qrcode: qrCode,
                    items: this.items,
                    address: this.address,
                    transactionId: merchantTransactionId,
                    paymentStatus: true,
                    totalAmount: this.totalAmount,
                    userId: this.userId,
                });

                await newOrder.save();
                const userID = this.userId
                // delete cart items after successfully payment
                await Cart.deleteOne({ userId: userID })

                // reduce the instock qty
                // 1st fetch the orders
                const recentPlacedOrd = await PlaceOrders.findOne({ transactionId: merchantTransactionId })
                if (!recentPlacedOrd) {
                    return res.status(400).json({ msg: "Order not found", status: "error" });
                }

                const updatedNewStock = recentPlacedOrd?.items?.map(item => {
                    const productId = item?._id;
                    const qtyToBuy = item?.qty;

                    console.log("qtyToBuy", qtyToBuy);
                    console.log("pid", productId);

                    return Products.findByIdAndUpdate(
                        productId,
                        { $inc: { inStock: -qtyToBuy } },
                        { new: true }
                    )
                })

                await Promise.all(updatedNewStock)


                // send order confirmation to user email 
                const orderSummaryHtml = `
  <div style="width: 100%; overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="background-color: #007bff; color: #ffffff;">
          <th style="padding: 10px; border: 1px solid #ddd;">Title</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Size</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Unit Price</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${this.items
                        .map(
                            (item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.size}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.qty}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">₹${item.price.toFixed(
                                2
                            )}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">₹${(
                                    item.price * item.qty
                                ).toFixed(2)}</td>
          </tr>
        `
                        )
                        .join("")}
      </tbody>
    </table>
  </div>
`;


                const deliveryAddressHtml = `
<div style="width: 100%; overflow-x: auto; border: 1px solid #ddd; border-radius: 10px; padding: 10px; max-width: 500px;" >
          <p style="margin:0; color: #000000;"><strong> ${this.address.name}</strong></p>
          <p style="margin:0; color: #000000;">${this.address.address} </p>
          <p style="margin:0; color: #000000;">${this.address.state} ${this.address.city} - ${this.address.pinCode}  </p>
          <p style="margin:0; color: #000000;"> <strong> Mobile :  </strong> ${this.address.mobile} </p>
</div>
`

                const mailOpt = {
                    from: `"YourCart" <${process.env.EMAIL_USER}>`,
                    to: this.address.email,
                    subject: "Your Order Confirmation",
                    html: ` 
                        <div style="max-width: 600px; color: #000000; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px;">
                            <h2 style="color: #007bff; text-align: center;">Thank You for Your Order!</h2>
                                <p>Hello <strong style = "color :  #ff7000">${this.address.name}</strong>,</p>
                                <p><strong>OrderID : </strong>${orderId}</p>
                                <p><strong>Order Date : </strong>${moment(Date.now()).format("DD-MM-YYYY")}</p>
                                <p style = "color: #000000;">We are processing your order and will notify you once it's shipped.</p>

                                <p style="margin: 5px 0;"> <strong>Expected Delivery on</strong> ${moment(Date.now()).add(5, "days").format("DD-MM-YYYY")} </p>

                               <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
                                    <p style = "color: #000000;"><strong >Order Summary:</strong></p>

                                    ${orderSummaryHtml}
                                            <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
                                <strong style = "color: #000000;">Total Amount : ₹${this.totalAmount}  </strong> 

                                 <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
                                    <p><strong style = "color: #000000;" >Delivery Address</strong></p>

                                    ${deliveryAddressHtml}
                                        <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />

                                        <p style="color: #555; margin: 0px; ">Best Regards,</p>
    <p style="font-size: 18px; margin: 5px 0px; font-weight: bold; color: #2980b9;">YourCart</p>

    <a href="${process.env.FRONTEND_URL}" style="
        display: inline-block;
        padding: 10px 20px;
        margin-top: 15px;
        color: white;
        background: #2980b9;
        text-decoration: none;
        font-size: 16px;
        border-radius: 5px;
    ">Visit YourCart</a>

                         </div>
                    `
                }

                await transporter.sendMail(mailOpt)

                // Redirect to success URL
                return res.redirect(`${phonePeConfigs.frontEndUrl}/payment/success`);
            } else {
                // Redirect to failure URL
                return res.redirect(`${phonePeConfigs.frontEndUrl}/payment/failure`);
            }
        } catch (error) {
            console.error("Status API Error:", error.message);
            console.error("Status API Error Response:", error.response.data);
            res.status(500).json({ msg: "Error checking payment status", status: "error", error: error.message });
        }
    } catch (error) {
        console.error("Internal Server Error:", error.message);
        res.status(500).json({ msg: "Internal Server Error", status: "error", error: error.message });
    }
};

module.exports = {
    placeOrdersAndMakePayment,
    checkStatus
}