const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const twilio = require('twilio');
const PlaceOrders = require('../models/placeOrders');
const moment = require("moment")

// generate otp
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString()
}

// function for sending otp on mail 
const sendOtpToEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOption = {
        from: "YourCart",
        to: email,
        subject: 'Your Items Out For Delivery',
        html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
                    <h2 style="color: #333;">Order Delivery OTP</h2>
                    <p>Dear Customer,</p>
                    <p>Your OTP for order delivery is:</p>
                    <h2 style="background-color: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px; color: #333;">${otp}</h2>
                    <p>Please provide this OTP to the delivery person.</p>
                    <hr />
                    <p style="color: #555;">Best Regards,</p>
                    <p><strong>YourCart</strong></p>
                </div>
            `
    };

    await transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            return res.status(400).send({ error: "Getting error to sending otp. Try again later." })
        }

        return res.status(200).send("OTP DELIVERED.")
    })
}

// orderstatus update on gmail


const sendStatusToEmail = async (email, status, orderId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Update on Your Order #${orderId}`,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: auto;">
                <h2 style="color: #333;">Order Status Update</h2>
                <p>Hi Customer,</p>
                <p>Your order with <strong>ID: ${orderId}</strong> is now <strong style="color: green;">${status}</strong>.</p>
                <p>Thank you for shopping with us!</p>
                <hr />
                <p style="color: #555;">Best Regards,</p>
                <p><strong>YourCart</strong></p>
            </div>
        `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Order status email sent to ${email} successfully.`);
        return { success: true, message: "Order status email sent successfully." };
    } catch (error) {
        console.error("Error sending order status email:", error);
        return { success: false, error: "Error sending order status email. Try again later." };
    }
};

// fun for sending otp on number
const accountSid = process.env.SID;
const authToken = process.env.TOKEN
const twilioPhoneNumber = process.env.NUMBER


const client = require('twilio')(accountSid, authToken);

const sendSMS = async(phone,otp)=>{
    let msgOpt = {
        from: twilioPhoneNumber,
        to: phone,
        body: `Your Items Out For Delivery!. Your OTP for order delivery is ${otp}. Please provide this OTP to the delivery person.`
    }

    try {
        const message = await client.messages.create(msgOpt)
        console.log(message);
        
    } catch (error) {
        console.log(error);
        
    }
}


const updateOrderStatus = async (req, res, io) => {
    const { orderId, status } = req.body;

    try {
        const order = await PlaceOrders.findOne({ orderId: orderId })
        if (!order) {
            return res.status(400).send({error:"Order not found."})
        }
        const statusAllowed = ['Order Placed', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered']

        if (!statusAllowed.includes(status)) {
            return res.status(400).send("Invalid status trying to update.")
        }

        if (status === "Out for Delivery") {
            const OTP = generateOtp()
            order.otp = OTP
            await sendOtpToEmail(order.address?.email, OTP)
            // await sendSMS(order.address?.mobile, OTP)
            await order.save()
        }

        if (status != "Delivered") {
            order.orderStatus = status
            order.updatedAt = new Date();
            await order.save()
            await sendStatusToEmail(order.address?.email,status,orderId)
            return res.status(200).send({ message: `Order status updated to ${status}`, order });
        }

        // Emit the updated status to all connected clients
        io.emit("orderStatusUpdate", { orderId, status })
        return res.status(200).send({ message: `Otp sent to customer.` });

    } catch (error) {
        return res.status(500).send({error:error})
    }
}


// verify order status 
// const verifyStatus = async(req,res) =>{
//     const {orderId,otp} = req.body;
//     if(!otp){
//         return res.status(400).send({error:"Otp Required"})
//     }

//     try {
//         const order = await PlaceOrders.findOne({orderId:orderId})
//     if(!order){
//         return res.status(400).send({error:"Order not found."})
//     }

//     if (order.otp === otp) {
//         order.orderStatus = "Delivered"
//         order.otp = null;
//         await order.save()

//         // Notify clients that the order is delivered
//         io.emit('orderStatusUpdate', { orderId, status: 'Delivered' });
//         await sendStatusToEmail(order.address?.email, "Delivered",orderId)
//         return res.json({ message: 'Order delivered successfully' });
        
//     } else {
//         res.status(400).send({ error: 'Invalid OTP' })
//     }

//     } catch (error) {
//         return res.status(500).send({
//             error:error
//         })
//     }
// }

const verifyStatus = async (req, res) => {
    const { orderId, otp } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required" });
    }

    if (!otp) {
        return res.status(400).json({ error: "OTP is required" });
    }

    try {
        const order = await PlaceOrders.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        if (order.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Update order status and clear OTP
        order.orderStatus = "Delivered";
        order.otp = null;
        await order.save();

        // Notify clients that the order is delivered
        // io.emit("orderStatusUpdate", { orderId, status: "Delivered" });

        // Send email notification
        await sendStatusToEmail(order.address?.email, "Delivered", orderId);

        return res.json({ message: "Order delivered successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    updateOrderStatus,
    verifyStatus
}