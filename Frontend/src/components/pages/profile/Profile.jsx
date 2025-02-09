import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { set, useForm } from "react-hook-form"
import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import "./profile.css"
import LoaderNew from '../../loader2/LoaderNew';

function Profile() {
    const token = localStorage.getItem("AuthToken")
    const [avatar, setAvatar] = useState(null)
    const [showCheckBtn, setShowCheckBtn] = useState(false)
    const [user, setUser] = useState({})
    const navigate = useNavigate()
    const [isloading,setIsloading] = useState(false)


    const {
        register,
        handleSubmit,
        reset, // Use reset to set default values
        formState: { errors, isSubmitting },
    } = useForm()

    useEffect(() => {
        if (!token) {
            navigate("/login")
        }
    }, [token, navigate])


    // fetch user details 
    const fetchUserDetails = async () => {
        setIsloading(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/profile-details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUser(res.data)
            setAvatar(res.data.profileURL)

            // set default value
            reset({
                userName: res.data.name,
                email: res.data.email
            })

        } catch (error) {
            console.log(error);

        }finally{
            setIsloading(false)
        }
    }


    useEffect(() => {
        fetchUserDetails()
    }, [])


    // handle to change avatar
    const handleToChangeAvatar = (e) => {
        setAvatar(e.target.files[0])
        setShowCheckBtn(true)
    }

    const handleToUpdatePicture = async (e) => {
        e.preventDefault();
        setShowCheckBtn(false);
        setIsloading(true)
        try {
            const ProfilePic = new FormData()
            ProfilePic.append("image", avatar)

            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/change-profile`, ProfilePic, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.status === 200 && res.data.data?.profileURL) {
                // setAvatar(res.data.data.profileURL);
                // setUser((prev) => ({
                //     ...prev,
                //     profileURL: res.data.data.profileURL
                // }));
                fetchUserDetails()
                toast.success(res.data.msg || "Profile picture updated successfully!");
            } else {
                throw new Error("Invalid response from server.");
            }



        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile picture. Please try again.");
         
        }finally {
            setShowCheckBtn(false);
            setIsloading(false)
        }
    }


    const handleToUpdateUserDetails = async (data) => {
        setIsloading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/edit-user`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response);

            // setUser(response.data);

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.error)
        }
        finally{
            setIsloading(false)
        }
    }

    console.log(avatar);


    return (
        <div className='profileContainer'>
            {
                isloading && <LoaderNew/>
            }
            <ToastContainer />
            <div className="profileDetails">
                <div className="profileAvatar">
                    <img src={avatar} alt="Avatar" />
                </div>

                <form onSubmit={handleToUpdatePicture}>
                    <input type="file"
                        hidden
                        name='avatar'
                        id='avatar'
                        accept='png, jpg, jpeg'
                        onChange={handleToChangeAvatar}
                    />

                    {showCheckBtn ? (
                        <button type='submit' className='edit-btn-ckeck' aria-label="Update avatar"><FaCheck /></button>
                    ) : (
                        <label htmlFor="avatar" className='editBtn'><FaUserEdit /></label>
                    )}
                </form>
            </div>

            <div className="userName crimson-text-semibold ">
                <h2>{user.name}</h2>
            </div>

            <div className="userDetailsContainer">
                <div className="userDetails">
                    <form onSubmit={handleSubmit(handleToUpdateUserDetails)} className='userDetails'>
                        <div className="userName">
                            <input type="text" {...register("userName")} placeholder="Enter FullName " />
                        </div>

                        <div className="email">
                            <input type="email" {...register("email")} placeholder="Enter email " />
                        </div>

                        <div className="password">
                            <input type="password" {...register("currentPassword")} placeholder="Enter Current Password " />
                        </div>

                        <div className="password">
                            <input type="password" {...register("newPassword")} placeholder="Enter New Password " />
                        </div>

                        <div className="password">
                            <input type="password" {...register("newConfirmPassword")} placeholder="Enter Confirm New Password " />
                        </div>

                        <input className='btn' disabled={isSubmitting} type="submit" />
                        {isSubmitting && <div className='loading'></div>}
                    </form>

                </div>
            </div>

        </div>
    )
}

export default Profile
