const User = require("../models/users")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { error } = require("console");
const { default: axios } = require("axios");
const { uploadOnCloudinary, deleteProfileOnCloudinary } = require("../utils/cloudinary");

const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;


    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters long.`;
    }

    if (!hasNumber.test(password)) {
        return "Password must contain at least one number.";
    }

    if (!hasUpperCase.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }

    if (!hasLowerCase.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }

    if (!hasSpecialChar.test(password)) {
        return "Password must contain at least one special character.";
    }
    return null;
}


// register users
const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);


    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send({
            error: "All fields are required"
        })
    }

    if (password != confirmPassword) {
        return res.status(400).send({ error: "Password not match" });
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
        return res.status(400).send({
            error: passwordError
        })
    }

    try {
        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail })
        const activationToken = crypto.randomBytes(32).toString("hex")

        if (emailExists) {
            return res.status(400).send({ error: "Email already exists." })
        }

        const salt = await bcrypt.genSalt(15)
        const hashPass = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashPass,
            activationToken,
            activationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
        })
        console.log(newUser);

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOption = {
            from: '"YourCart.." <raibrahmadev508@gmail.com>',
            to: newEmail,
            subject: "Account Activation",
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
                <h2 style="color: #2c3e50;">🚀 Activate Your Account</h2>
                <p style="color: #555; font-size: 16px;">Dear <strong>${name}</strong>,</p>
                <p style="color: #555; font-size: 16px;">Please activate your account by clicking the button below:</p>
                
                <a href="${process.env.FRONTEND}/users/register/activation/${activationToken}" style="
                    display: inline-block;
                    padding: 12px 20px;
                    margin: 20px 0;
                    color: white;
                    background: #2980b9;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    transition: 0.3s;
                ">Activate Account</a>
                
                <p style="color: #777; font-size: 14px;">If you didn’t register for this, please ignore this email.</p>
                
                <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
                
                <p style="color: #555;">Best Regards,</p>
                <p style="font-size: 18px; font-weight: bold; color: #2980b9;">YourCart Team</p>
            </div>
        `
        };

        transporter.sendMail(mailOption, async (err, info) => {
            if (err) {
                await User.deleteOne({ _id: newUser._id })
                return res.status(500).send({ error: "Failed to send activation email. Please try again." });
            }

            res.status(200).send({ message: "Activation link sent to your email." });
        })
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.error("Error in registration:", error);
    }

}


// login
const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({ error: "All fields are required" });
    }
console.log(email, password);

    try {
        const newEmail = email.toLowerCase()
        const user = await User.findOne({ email: newEmail })

        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials..." });
        }

        const comparePass = await bcrypt.compare(password, user.password)

        if (!comparePass) {
            return res.status(400).send({ error: "Invalid Credentials..." });
        }

        if (user.isActivated == false) {
            return res.status(400).send({ error: "Please Activate your account." });
        }

        const { _id: id, name, profileURL,role } = user;

        const token = JWT.sign({ _id: id, name, profileURL,role },
            process.env.SECRETKEY)

        res.status(200).json({ token, id, name, profileURL,role });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}



// account activation
const accountActivation = async (req, res) => {
    const activateToken = req.params.activateToken;
    console.log(activateToken);


    try {
        const user = await User.findOne({
            activationToken: activateToken,
            activationTokenExpiry: { $gt: Date.now() }
        })
        console.log(user);

        if (!user) {
            const expiredUserToken = await User.findOne({ activationToken: activateToken })
            console.log(expiredUserToken);

            if (expiredUserToken) {
                await User.deleteOne({ _id: expiredUserToken._id })
                return res.status(400).send("Token expired. User has been deleted.");
            }
            // If no user is found, return an error
            return res.status(404).send("Invalid activation token.");
        }

        user.isActivated = true;
        user.activationToken = null;
        user.activationTokenExpiry = null;
        await user.save()

        res.status(200).send({ message: "Your account has been successfully activated." })
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}


// forgotPassword
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ error: "Email is required." });
    }

    try {
        const newEmail = email.toLowerCase()
        const user = await User.findOne({ email: newEmail })

        if (!user) {
            return res.status(400).send({ error: "user not found." })
        }

        // gen token
        const resetToken = crypto.randomBytes(32).toString("hex")
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000 // 1hr
        await user.save()

        //setup mail transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOption = {
            from: '"YourCart.." <raibrahmadev508@gmail.com>',
            to: email,
            subject: "Password Reset",
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
            <h2 style="color: #e74c3c;">🔒 Password Reset Request</h2>
            <p style="color: #555; font-size: 16px;">Dear <strong>${user.name}</strong>,</p>
            <p style="color: #555; font-size: 16px;">
                You requested a password reset. Click the button below to reset your password:
            </p>
            
            <a href="${process.env.FRONTEND}/users/reset-password/${resetToken}" style="
                display: inline-block;
                padding: 12px 20px;
                margin: 20px 0;
                color: white;
                background: #e74c3c;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                border-radius: 5px;
                transition: 0.3s;
            ">Reset Password</a>

            <p style="color: #777; font-size: 14px;">
                If you didn’t request this, please ignore this email. Your account remains secure.
            </p>
            
            <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
            
            <p style="color: #555;">Best Regards,</p>
            <p style="font-size: 18px; font-weight: bold; color: #2980b9;">YourCart Team</p>
        </div>
    `
        }

        transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                return res.status(500).send("Error to sending email.")
            }
            res.status(200).send("Password reset link sent to your email.")
        })


    } catch (error) {
        res.status(500).send({ error: error.message });

    }
}


// reset password
const resetPassword = async (req, res) => {
    const resetToken = req.params.resetToken
    console.log(resetToken);

    const { password, confirmPassword } = req.body


    if (!password || !confirmPassword) {
        return res.status(400).send("Password and confirm password are required.");
    }
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");

    }

    // passwordValidation
    const passwordError = validatePassword(password)
    if (passwordError) {
        return res.status(400).send({ error: passwordError })
    }

    try {
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiry: { $gt: Date.now() }
        })

        console.log(user);

        if (!user) {
            return res.status(400).send({ error: "Invalid or expired token." })
        }

        // hash the password
        const salt = await bcrypt.genSalt(15)
        const hashPassword = await bcrypt.hash(password, salt)

        // update password 
        user.password = hashPassword
        user.resetToken = null;
        user.resetTokenExpiry = undefined;

        await user.save()

        res.status(200).send("Password reset successful.");

    } catch (error) {
        res.status(500).send({ error: error.message });

    }
}


const userDetails = async (req, res) => {
    const userId = req.user._id

    try {
        const data = await User.findById(userId)
        return res.status(200).send(data)
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

// change profile pic
const changeProfilePicture = async (req, res) => {
    const image = req.file?.path
    const userId = req.user._id
    try {
        const user = await User.findOne({userId})
        const imgDetails = await uploadOnCloudinary(image)
        // console.log(imgDetails);

        response = await User.findByIdAndUpdate(userId, { profileURL: imgDetails?.url }).select("-password")

        // after update delete old 
        // await deleteProfileOnCloudinary(user.profile_public_id)

        return res.status(200).send({
            data: response,
            msg: "Profile Picture Updated."
        })

    } catch (error) {
        return res.status(500).send({ error: error })
    }

}


// update user details 
// const updateUserDetails = async (req, res) => {
//     const userId = req.user._id;
//     const { userName, email, currentPassword, newPassword, newConfirmPassword } = req.body;
//     console.log(userName);

//     try {
//         const user = await User.findById(userId)
//         const lowerEmail = email.toLowerCase()
//         const existEmail = await User.findOne({ email: lowerEmail })
//         // console.log(existEmail);

//         if (existEmail && existEmail._id != userId) {
//             return res.status(400).send({ error: "Email already exists." })
//         }

//         // check current password is current or not 
//         const validatePassword = await bcrypt.compare(currentPassword, user.password)
//         if (!validatePassword) {
//             return res.status(400).send({ error: "Invalid current password" })
//         }

//         // updated data 
//         let updateData = {
//             email: lowerEmail,
//             name: userName
//         }

//         // if password also want to update
//         if (newPassword && newConfirmPassword) {
//             if (newPassword != newConfirmPassword) {
//                 return res.status(400).send({ error: "Passwords do not match" })
//             }

//             // new password validation
//             const passwordError = validatePassword(newPassword)
//             if (passwordError) {
//                 return res.status(400).send({ error: passwordError })
//             }

//             const salt = await bcrypt.genSalt(32)
//             const newPassHash = await bcrypt.hash(newPassword, salt)
//             updateData.password = newPassHash

//         }
//         // console.log(updateData);

//         const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password")
//         if (!updatedUser) {
//             return res.status(400).send({ error: "User not updated. Please try again." });
//         }
//         // console.log(updatedUser);
//         // if email also updated then verify the email
//         if (updatedUser.email != existEmail) {
//             const activationToken = crypto.randomBytes(32).toString("hex")
//             // again update the some details
//             updatedUser.isActivated = false
//             updatedUser.activationToken = activationToken
//             await updatedUser.save()

//             const transporter = nodemailer.createTransport({
//                 service: "Gmail",
//                 auth: {
//                     user: process.env.EMAIL_USER,
//                     pass: process.env.EMAIL_PASS
//                 }
//             })

//             const mailOption = {
//                 from: '"YourCart.." <raibrahmadev508@gmail.com>',
//                 to: email,
//                 subject: "Account Verification",
//                 html: `
//                 <b>Dear ${userName},</b> <br> 
//             <p>Please verify your account by clicking the following link:
//             <a href="${process.env.FRONTEND}/users/register/activation/${activationToken}">Activate Account</a>.</p> 
//             <br> 
//             <p>If you didn't register this, please ignore this email.</p>`
//             }

//             transporter.sendMail(mailOption, async (err, info) => {
//                 if (err) {
//                     await User.deleteOne({ _id: newUser._id })
//                     return res.status(500).send({ error: "Failed to send activation email. Please try again." });
//                 }

//                 res.status(200).send({ message: "Verification link sent to your email." });
//             })

//         }

//         return res.status(200).send({
//             data: updatedUser,
//             updatedMsg: "Profile Details Updated"
//         })
//     } catch (error) {
//         return res.status(500).send({ error: error })
//     }
// }

const updateUserDetails = async (req, res) => {
    const userId = req.user._id;
    const { userName, email, currentPassword, newPassword, newConfirmPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        const lowerEmail = email.toLowerCase();

        // Check if the new email already exists for another user
        const existingEmailUser = await User.findOne({ email: lowerEmail });
        if (existingEmailUser && existingEmailUser._id.toString() !== userId.toString()) {
            return res.status(400).send({ error: "Email already exists." });
        }

        // Validate the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: "Invalid current password." });
        }

        // Prepare update data
        let updateData = {
            email: lowerEmail,
            name: userName,
        };

        // Handle password update
        if (newPassword && newConfirmPassword) {
            if (newPassword !== newConfirmPassword) {
                return res.status(400).send({ error: "Passwords do not match." });
            }

            // Custom password validation function
            const passwordValidationError = validateNewPassword(newPassword);
            if (passwordValidationError) {
                return res.status(400).send({ error: passwordValidationError });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            updateData.password = hashedPassword;
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(500).send({ error: "Failed to update user details. Please try again." });
        }

        // Check if the email was updated and require re-verification
        if (lowerEmail !== updatedUser.email) {
            const activationToken = crypto.randomBytes(32).toString("hex");
            updatedUser.isActivated = false;
            updatedUser.activationToken = activationToken;
            await updatedUser.save();

            // Send activation email
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOption = {
                from: `"YourCart Support" <${process.env.EMAIL_USER}>`,
                to: lowerEmail,
                subject: "Account Verification",
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
                    <h2 style="color: #27ae60;">✅ Verify Your Account</h2>
                    <p style="color: #555; font-size: 16px;">Dear <strong>${userName}</strong>,</p>
                    <p style="color: #555; font-size: 16px;">
                        Please verify your account by clicking the button below:
                    </p>
                    
                    <a href="${process.env.FRONTEND}/users/register/activation/${activationToken}" style="
                        display: inline-block;
                        padding: 12px 20px;
                        margin: 20px 0;
                        color: white;
                        background: #27ae60;
                        text-decoration: none;
                        font-size: 16px;
                        font-weight: bold;
                        border-radius: 5px;
                        transition: 0.3s;
                    ">Activate Account</a>
        
                    <p style="color: #777; font-size: 14px;">
                        If you did not request this change, please contact support.
                    </p>
                    
                    <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
                    
                    <p style="color: #555;">Best Regards,</p>
                    <p style="font-size: 18px; font-weight: bold; color: #2980b9;">YourCart Team</p>
                </div>
            `
            };

            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    console.error("Error sending activation email:", err);
                    return res.status(500).send({ error: "Failed to send activation email. Please try again." });
                }

                return res.status(200).send({
                    message: "Verification email sent. Please check your inbox.",
                });
            });

            return; // Prevent further response since the email flow ends here
        }

        // Successful update response
        return res.status(200).send({
            data: updatedUser,
            message: "Profile details updated successfully.",
        });
    } catch (error) {
        console.error("Error updating user details:", error);
        return res.status(500).send({ error: "Internal server error." });
    }
};

// register users
const adminRegister = async (req, res) => {
    const { name, email, password, confirmPassword,role } = req.body;
    console.log(name, email, password, confirmPassword);
    const image = req.file?.path


    if (!name || !email || !password || !confirmPassword || !role) {
        return res.status(400).send({
            error: "All fields are required"
        })
    }

    if (password != confirmPassword) {
        return res.status(400).send({ error: "Password not match" });
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
        return res.status(400).send({
            error: passwordError
        })
    }

    try {
        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail })
        const activationToken = crypto.randomBytes(32).toString("hex")

        if (emailExists) {
            return res.status(400).send({ error: "Email already exists." })
        }

        const salt = await bcrypt.genSalt(15)
        const hashPass = await bcrypt.hash(password, salt)

        const imgDetails =await uploadOnCloudinary(image)
        console.log(imgDetails);
        
        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashPass,
            role,
            profileURL:imgDetails?.url,
            activationToken,
            activationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
        })
        console.log(newUser);

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOption = {
            from: '"YourCart.." <raibrahmadev508@gmail.com>',
            to: email,
            subject: "Account Activation",
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
                <h2 style="color: #27ae60;">✅ Verify Your Account</h2>
                <p style="color: #555; font-size: 16px;">Dear <strong>${name}</strong>,</p>
                <p style="color: #555; font-size: 16px;">
                    Please verify your account by clicking the button below:
                </p>
                
                <a href="${process.env.FRONTEND}/users/register/activation/${activationToken}" style="
                    display: inline-block;
                    padding: 12px 20px;
                    margin: 20px 0;
                    color: white;
                    background: #27ae60;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    transition: 0.3s;
                ">Activate Account</a>
    
                <p style="color: #777; font-size: 14px;">
                    If you did not request this change, please contact support.
                </p>
                
                <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;" />
                
                <p style="color: #555;">Best Regards,</p>
                <p style="font-size: 18px; font-weight: bold; color: #2980b9;">YourCart Team</p>
            </div>
        `
        }

        transporter.sendMail(mailOption, async (err, info) => {
            if (err) {
                await User.deleteOne({ _id: newUser._id })
                return res.status(500).send({ error: "Failed to send activation email. Please try again." });
            }

            res.status(200).send({ message: "Activation link sent to your email." });
        })
    } catch (error) {
        res.status(500).send({ error: error.message });
        console.error("Error in registration:", error);
    }

}


const getUsers = async(req,res) =>{
    console.log("user")
    try {
        const user = await User.find()
        
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({
            error:error
        })
    }
}



module.exports = {
    registerUser,
    loginUser,
    accountActivation,
    forgotPassword,
    resetPassword,
    userDetails,
    changeProfilePicture,
    updateUserDetails,
    adminRegister,
    getUsers

}
