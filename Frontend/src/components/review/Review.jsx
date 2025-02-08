import React, { useContext, useEffect, useState } from 'react'
import "./review.css"
import { FaStar } from 'react-icons/fa';
import dummyImg from "../../assets/hero_img.png"
import axios from 'axios';
import { FaCheck } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { StoreContext } from '../Context';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmMessage from '../confirm_loader/ConfirmMessage';
import moment from 'moment';

function Review({ productId }) {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")
    const [image, setImage] = useState(null)
    const [hover, setHover] = useState(0)
    const [popUpImg, setPopUpImg] = useState(null)
    const [allReview, setAllReview] = useState([])
    const [editingReview, setEditingReview] = useState(null)
    const { auth } = useContext(StoreContext)
    const [reviewId, setReviewId] = useState(null)
    const token = localStorage.getItem("AuthToken")
    const [showConfirmComponent,setShowConfirmComponent] = useState(false)
    console.log(auth);

    // pop up img
    const openImg = (imgSrc) => {
        setPopUpImg(imgSrc)
    }

    const closeImg = () => {
        setPopUpImg(null)
    }

    const handleImageUpload = (e) => {
        const img = e.target.files[0]
        setImage(img)
    }

    // new review 
    const handleToSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || review === "") {
            alert("Please provide a rating and review."); // change this in notify
            return;
        }

        const formData = new FormData()
        formData.append("review", review)
        formData.append("rating", rating)
        if (image) formData.append("image", image)

        const reviewData = {
            review,
            rating,
            productId,
            image: image
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/review`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })
            fetchReview();
            toast.success(response.data.msg)


        }
        catch (error) {
            console.log(error);

        }
        finally {
            // after done clear all the thing
            setRating(0);
            setReview("");
            setImage(null);

        }
    }


    // fetch the review
    const fetchReview = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/get-review/${productId}`)
            setAllReview(res.data)

        } catch (error) {

        }
    }

    useEffect(() => {
        fetchReview()
    }, [productId])

    console.log(allReview);


    // handle to edit 
    const handleToEdit = (review) => {
        setEditingReview(review)
        setReview(review.review)
        setImage(review.reviewImg)
        setRating(review.rating)
        setReviewId(review._id)
    }


    const handleToUpdate = async (e) => {
        e.preventDefault()
        const reviewData = {
            review,
            rating,
            image: image
        }

        console.log("update");


        try {
            const res = await axios.put(`${import.meta.env.VITE_EXPRESS_BASE_URL}/review/${reviewId}`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })

            fetchReview();
            toast.success(res.data.msg)

        } catch (error) {
            console.log(error);

        }
        finally {
            // after done clear all the thing
            setRating(0);
            setReview("");
            setImage(null);

        }

    }



// delete the review
const handleToDetele = async(reviewId) =>{
    try {
        const res = await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/review/${reviewId}`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })

        toast.success(res.data.msg);
        fetchReview()
    } catch (error) {
        console.log(error);
    }
}



    // confirm the delete 
    const showConfirmMsg = (reviewid) =>{
        setReviewId(reviewid)
        setShowConfirmComponent(true)
    }

    const cancelToDelete = () =>{
        setShowConfirmComponent(false)
        setReviewId(null)
    }

    const confirmToDelete = () =>{
        handleToDetele(reviewId)
        setShowConfirmComponent(false)
        setReviewId(null)
    }
    return (
        <div className="reviewContainer">
            <ToastContainer />
            {
                showConfirmComponent &&             <ConfirmMessage message={"Are You Sure To Delete This Review?"}
                onConfirm={confirmToDelete}
                onCancel={cancelToDelete}/>
            }

            <div className="postReview crimson-text-regular">
                <p className='main crimson-text-semibold'>Leave a Review...</p>

                <form className='reviewForm' onSubmit={editingReview ? handleToUpdate : handleToSubmit}>
                    <div className="rating">
                        {
                            Array.from({ length: 5 }).map((_, index) => {
                                const starValue = index + 1
                                return (
                                    <label key={starValue}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={starValue}
                                            onClick={() => setRating(starValue)

                                            }
                                        />

                                        <FaStar
                                            size={15}
                                            color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={() => setHover(starValue)}
                                            onMouseLeave={() => setHover(0)}
                                            className="star"
                                        />
                                    </label>
                                )
                            })
                        }
                    </div>

                    <div className="reviewInput">
                        <textarea
                            placeholder="Write your review here..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />


                    </div>

                    <button type="submit">{editingReview ? "Update" : "Submit"}</button>
                </form>
            </div>

            <div className="displayReviewContainer">
                <div className="displayReviews crimson-text-regular">
                    <p className='main crimson-text-semibold'>What our customers felt:</p>
                    <div className="reviewScroll">
                        {
                            allReview.length > 0 && (
                                allReview.map((review, index) => {
                                    return (
                                        <div className="displayReview" key={index}>

                                            <div className="rateAndReview">
                                                <div className={`rating ${review.rating > 2 ? "green" : "red"}`}>
                                                    <p className='rate'>{review.rating}</p>
                                                    <p><FaStar /></p>
                                                </div>
                                                <p className='review'>{review.review}</p>
                                            </div>

                                            <div className={`${review.reviewImg ? "img" : "noImg"}`}>
                                                <img src={review?.reviewImg} onClick={() => openImg(review.reviewImg)} />
                                            </div>

                                            <div className="reviewFooter">
                                                <div className='nameAndDate'>
                                                    <p className='crimson-text-semibold'>{review?.userId?.name}</p>
                                                    <p>{moment(review?.createdAt).fromNow()}</p>
                                                </div>
                                                {
                                                    review?.userId?._id === auth?.id &&

                                                    <div className="Btn">
                                                        <div className="edit-Btn" onClick={() => handleToEdit(review)}>
                                                            <FaUserEdit />
                                                        </div>
                                                        <div className="delete-Btn" onClick={()=>showConfirmMsg(review._id)}>
                                                            <ImBin />
                                                        </div>
                                                    </div>

                                                }


                                            </div>
                                            <hr />

                                        </div>
                                    )
                                })
                            )
                        }
                    </div>
                </div>
            </div>

            {popUpImg && (
                <div className="modal" onClick={closeImg}>
                    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                        <span className="closeModal" onClick={closeImg}>
                            &times;
                        </span>
                        <img src={popUpImg} alt="Enlarged" className="modalImage" />
                    </div>
                </div>
            )}


        </div>
    )
}

export default Review