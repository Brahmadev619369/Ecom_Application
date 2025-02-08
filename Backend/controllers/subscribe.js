const Subscribe = require("../models/subscribe")
const nodemailer = require("nodemailer")
const {uploadOnCloudinary,deleteProfileOnCloudinary} = require("../utils/cloudinary")

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

// getting subscription
const getSubscribeEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ error: "Email are require." })
    }

    try {
        const lowerEmail = email.toLowerCase()
        // check email already there or not 
        const subscriber = await Subscribe.findOne({ email: lowerEmail })
        if (subscriber) {
            return res.status(400).send({ error: "Email already subscribed!" })
        }

        // save email
        const newSubscriber = new Subscribe({ email: lowerEmail })
        newSubscriber.save()

        // send subcription email 
        const mailOpt = {
            from: "YourCart",
            to: lowerEmail,
            subject: "Subscription Confirmed",
            html: `
           <div style="
    font-family: Arial, sans-serif;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
">
    <h2 style="color: #2c3e50;">🎉 Thank You for Subscribing! 🎉</h2>
    <p style="color: #555; font-size: 16px;">You're now part of the <strong>YourCart</strong> family.</p>
    <p style="color: #777; font-size: 14px;">Stay tuned for the latest deals, discounts, and updates.</p>
    
    <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
    
    <p style="color: #555;">Best Regards,</p>
    <p style="font-size: 18px; font-weight: bold; color: #2980b9;">YourCart</p>

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
        res.status(200).json({ message: 'Subscription successful!' });

    } catch (error) {
        res.status(500).json({ message: 'Subscription failed. Please try again later.' });

    }
}



//send msg to all subscribers
const sendMsgToSubscriber = async (req, res) => {
    const { message, subject, festival } = req.body;
    console.log(message);
    
    const image = req.file?.path
    
if(!message || !subject || !festival){
    return res.status(400).send({error:"All text field are require."})
}
    const imageDetails = await uploadOnCloudinary(image)
    
    
    try {
        // fetch all email 
        const subcribers = await Subscribe.find({})

        // send mail to all subscriber 

        for (const subcriber of subcribers) {

            const mailOtp = {
                from: "YourCart",
                to: subcriber.email,
                subject: subject,
                html: `
                <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
    ">  
    
     <h2 style="color: #2c3e50;">🥳 ${festival} OFFER! 🥳</h2>
        
    

    <p style="color: #555; font-size: 16px;">${message}</p>
    
    <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
        
        <p style="color: #555;">Best Regards,</p>
        <p style="font-size: 18px; font-weight: bold; color: #2980b9;">YourCart</p>
    
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
    
    </div>`
            }


            await transporter.sendMail(mailOtp)

        }

        res.status(200).json({ message: 'Messages sent successfully!' });
    } catch (error) {

    }
}

module.exports = {
    getSubscribeEmail,
    sendMsgToSubscriber
}