const nodemailer = require("nodemailer");


const contactUs = async (req, res) => {
    const { name, email, number, message } = req.body;

    if (!name || !email || !number || !message) {
        return res.status(400).send({ error: "All fields are required." });
    }

    
    try {

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })


        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.EMAIL_USER,
            subject: "New Contact Us Message",
            html: `
                <h3>Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.status(400).send({ error: "Failed to send your message. Please try again." })
            }

            res.status(200).send({ message: "Message sent to YourCart." });
        })


    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}



module.exports = {contactUs}