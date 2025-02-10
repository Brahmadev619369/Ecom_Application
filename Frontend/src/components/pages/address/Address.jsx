import { useNavigate } from 'react-router-dom'
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import "./address.css"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { StoreContext } from '../../Context'
import { toast, ToastContainer } from 'react-toastify'
import { ImBin } from "react-icons/im";
import LoaderNew from '../../loader2/LoaderNew'

function Address() {
  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"});
}, []);


  const { cartItems } = useContext(StoreContext)
  const token = localStorage.getItem("AuthToken");
  const [saveAddress, setSaveAddress] = useState([])
  const [selectAddress, setSelectAddress] = useState(null)
  const [phoneNum, setPhoneNum] = useState("")
  const [isloading, setIsloading] = useState("")
  const [newAddress, setNewAddress] = useState({
    name: "",
    surname: "",
    email: "",
    mobile: "",
    address: "",
    state: "",
    city: "",
    pinCode: ""
  })

  useEffect(() => {
    setNewAddress((prevAdd) => ({
      ...prevAdd,
      mobile: phoneNum
    }))
  }, [phoneNum])

  const navigate = useNavigate()

  // fetch address 

  const fetchAddress = async () => {
    setIsloading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/address/getAddress`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSaveAddress(res.data);

    } catch (error) {
      console.log(error);

    } finally {
      setIsloading(false)
    }
  }

  useEffect(() => {
    fetchAddress()
  }, [])



  // for input change
  const handleToChangeInput = (e) => {
    e.preventDefault()
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }


  // handle to select existing address
  const handleToSelectAddress = (adres) => {
    setSelectAddress(adres)
    setNewAddress({
      name: "",
      surname: "",
      email: "",
      mobile: "",
      address: "",
      state: "",
      city: "",
      pinCode: ""
    })
  }

  // form submit 
  const handleToSubmit = async (e) => {
    setIsloading(true)
    e.preventDefault()
    if (!selectAddress) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/address/addAddress`, newAddress, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        fetchAddress()
        toast(res.data.message);
      } catch (error) {
        console.log(error);
      } finally {
        setNewAddress({
          name: "",
          surname: "",
          email: "",
          mobile: "",
          address: "",
          state: "",
          city: "",
          pinCode: ""
        })

        setIsloading(false)
      }
    }

    const addressToUse = selectAddress || newAddress
    if (!addressToUse.name || !addressToUse.surname
      || !addressToUse.address || !addressToUse.city ||
      !addressToUse.email || !addressToUse.pinCode || !addressToUse.state ||
      !addressToUse.mobile) {
      alert("Please complete the delivery info");
      return;
    }

    localStorage.setItem("useAddress",
      JSON.stringify(addressToUse))

    if (Object.keys(cartItems).length === 0) {
      return;
    }

    navigate("/place-orders")
  }

  console.log(cartItems);

  // delete add
  const handleToDeleteAddress = async (addressId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_EXPRESS_BASE_URL}/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        toast.success(res.data.msg)
      }
      fetchAddress()
    } catch (error) {
      // toast.error(error.respose.data.error)
      console.log(error);

    }
  }

  return (
    <div className="addressMainContainer">
      <h2>Delivery Information</h2>
      <hr />
      {
        isloading && <LoaderNew />
      }

      <ToastContainer />
      <div className={`addressContainer`}>
        {saveAddress.length > 0 && (
          <div className="rightContainer">
            <h3>Saved Addresses</h3>
            {saveAddress.map((addrs) => {
              return (
                <div key={addrs._id} className="addressCard">
                  <label className='addresscard'>
                    <input
                      type="radio"
                      name='addresses'
                      checked={selectAddress && selectAddress._id === addrs._id}
                      onChange={() => handleToSelectAddress(addrs)}
                    />
                    <div className='address'>
                      {addrs.name} {addrs.surname}
                      <br />
                      {addrs.email}
                      <br />
                      {addrs.mobile}
                      <br />
                      {addrs.address}, {addrs.state}, <br />
                      {addrs.city} : {addrs.pinCode}
                    </div>


                  </label>
                  <div className="addressDel">
                    <ImBin onClick={(e) => {
                      e.stopPropagation();
                      handleToDeleteAddress(addrs._id)
                    }} className='del-btn' />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="leftContainer">
          <h3>Add new Address</h3>

          <form className='formContainer' onSubmit={handleToSubmit} >
            <div className="multiInput">
              <input name='name' value={newAddress.name} placeholder='Name' onChange={handleToChangeInput} />
              <input type="text" name='surname' value={newAddress.surname} placeholder='Surname' onChange={handleToChangeInput} />
            </div>

            <div className="singleInput">
              <input type="email" name='email' value={newAddress.email} placeholder='Email' onChange={handleToChangeInput} />
            </div>

            <PhoneInput

              value={phoneNum}
              onChange={setPhoneNum}
              placeholder='Phone Number'
            />

            <div className=" singleInput">
              <input onChange={handleToChangeInput} name='address' value={newAddress.address} placeholder='Address' />
            </div>

            <div className="multiInput">
              <input onChange={handleToChangeInput} name='state' value={newAddress.state} placeholder='State' />
              <input onChange={handleToChangeInput} name='city' value={newAddress.city} placeholder='City' />
            </div>

            <div className="input">
              <input onChange={handleToChangeInput} name='pinCode' value={newAddress.pinCode} placeholder='PinCode' />
            </div>

            <div className='checkOut'>
              <button type='submit'>Proceed</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Address