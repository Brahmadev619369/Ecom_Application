import { createContext, useState, useEffect, useRef } from "react";
// import { products } from "../assets/assets";
// import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { round } from "lodash";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';
export const StoreContext = createContext()

const StoreContextProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState({});
    const [cartCounts, setCartCounts] = useState(0)
    const [cartData, setCartData] = useState([])
    const [cartTotalAmt, setCartTotalAmt] = useState(0)
    const [totalMrp, setTotalMrp] = useState(0)
    const [deliveryAmt, setDeliveryAmt] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [auth, setAuth] = useState(null)
    const [logoutMSg, setLogoutMsg] = useState("")
    const [search, setSearch] = useState("")
    const [showSearchBtn, setShowSearchBtn] = useState(false)
    const [products, setProducts] = useState([])
    const [productsLoader, setProductsLoader] = useState(false)
    const [wishlistLoader, setWishlistLoader] = useState(false)

    // logic to fetch products 
    const fetchProducts = async () => {
        setProductsLoader(true)
        try {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/products/get-products`)
            console.log("data", res.data);
            setProducts(res.data)
        } catch (error) {
            console.log(error)
            // toast.error("Error to fetching products.")
        } finally {
            setProductsLoader(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])








    const addToCart = async (productId, size) => {
        const token = localStorage.getItem("AuthToken");

        if (!size) {
            toast.dismiss();
            toast.error("Please select a size");
            return;
        }

        // if (!token) {
        //     toast.error("You need to log in first to save cart products!");
        // }

        if (token) {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_EXPRESS_BASE_URL}/cart/add-to-cart`,
                    {
                        productId,
                        size,
                        quantity: 1
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setCartItems(res.data.cart);

                toast.success("Added to cart! 🎉", {
                    style: {
                        border: "1px solid #713200",
                        padding: "16px",
                        color: "#713200"
                    },
                    iconTheme: {
                        primary: "#713200",
                        secondary: "#FFFAEE"
                    }
                });

            } catch (error) {
                toast.error(error.response?.data?.message || "Error adding item to cart");
            }
        } else {
            // Handle Local Storage Cart
            let localCart = JSON.parse(localStorage.getItem("cart")) || {};

            if (!localCart[productId]) {
                localCart[productId] = {};
            }

            localCart[productId][size] = (localCart[productId][size] || 0) + 1;

            localStorage.setItem("cart", JSON.stringify(localCart));
            setCartItems(localCart);

            toast.success("Added to cart! 🎉");
        }
    };


    // removeToCart
    const removeToCart = async (productId, size) => {
        setCartItems((prev) => {
            let cartData = structuredClone(prev)

            if (cartData[productId][size] && cartData[productId]) {
                cartData[productId][size] -= 1
            }

            if (cartData[productId][size] <= 0) {
                delete cartData[productId][size];
            }

            if (Object.keys(cartData[productId]).length === 0) {
                delete cartData[productId]
            }

            return cartData;
        })



        // write backend code

        try {
            const token = localStorage.getItem("AuthToken")
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/cart/remove-to-cart`, {
                productId,
                size,
                quantity: 1
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.status === 200) {
                console.log("Backend Response:", res.data.message);
            }
            toast.success("Items removed from cart")

        } catch (error) {
            toast.error("Error removing item from cart");
        }
    }



    // get cart items from backend 
    useEffect(() => {
        const token = localStorage.getItem("AuthToken");
        const getCartItems = async () => {
            const res = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/cart/get-cart-items`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data?.[0].items);

            setCartItems(res.data?.[0].items)
        }

        getCartItems()

    }, [])

    // cart items counts
    useEffect(() => {
        const getCartItemCount = (cartItems) => {
            let cartCount = 0;

            for (const productId in cartItems) {
                const sizes = cartItems[productId]

                for (const size in sizes) {
                    cartCount += sizes[size]
                }
            }

            return cartCount
        }

        const counts = getCartItemCount(cartItems)
        setCartCounts(counts)
    }, [cartItems])


    // const getCartItemCount = (cartItems) =>{
    //     let cartCount = 0;

    //     for(const productId in cartItems){
    //         const sizes = cartItems[productId]

    //         for(const size in sizes){
    //             cartCount += sizes[size]
    //         }
    //     }

    //     return cartCount
    // }

    // console.log(getCartItemCount(cartItems));

    useEffect(() => {
        const itemsList = [];

        for (const productId in cartItems) {
            const sizes = cartItems[productId]
            console.log(sizes);

            for (const size in sizes) {

                itemsList.push({
                    _id: productId,
                    size,
                    quantity: sizes[size],
                })
            }
        }

        setCartData(itemsList)
    }, [cartItems])

    // get total cart amt
    useEffect(() => {
        const getCartAmt = () => {
            let cartAmt = 0;

            cartData.map((item, index) => {
                const productsData = products.find((product) => product._id === item._id)
                console.log(productsData);

                const totalAmt = productsData?.price * item?.quantity

                cartAmt += totalAmt

            })

            return cartAmt


        }
        setCartTotalAmt(getCartAmt)
    }, [cartData])


    console.log(cartTotalAmt);

    // discount total amt
    useEffect(() => {
        const getTotalMrpAmt = (cartTotalAmt) => {
            let mrpAmt = 0;

            cartData.map((item, index) => {
                const productsData = products.find((product) => product._id === item._id)
                console.log("MRP", productsData);

                const totalAmt = productsData?.Mrp * item?.quantity

                mrpAmt += totalAmt
            })
            return mrpAmt
        }

        setTotalMrp(getTotalMrpAmt(cartTotalAmt))

    }, [cartData])

    console.log("dis", totalMrp);


    // save token and set Auth
    const loginHandler = (token) => {
        if (!token) return;

        localStorage.setItem("AuthToken", token)

        try {
            const decodedToken = jwtDecode(token)
            setAuth(decodedToken)

        } catch (error) {
            console.error("Invalid token:", error);
        }
    }


    // set Auth
    useEffect(() => {
        const token = localStorage.getItem("AuthToken")
        if (token) {
            const decodedToken = jwtDecode(token)

            console.log("decodedToken", decodedToken);

            setAuth({
                id: decodedToken._id,
                name: decodedToken.name,
                profileUrl: decodedToken.profileURL
            })
        }
    }, [])



    // logout logic
    const logout = () => {
        setAuth(null)
        localStorage.removeItem("AuthToken")
        setLogoutMsg("You have been logged out.")
        setTimeout(() => {
            setLogoutMsg('');
        }, 2000);
    }

    // delivery fee
    useEffect(() => {
        const calculateDeliveryCharge = (totalAmt) => {
            return totalAmt > 500 ? "Free" : 50;
        };

        setDeliveryAmt(calculateDeliveryCharge(cartTotalAmt));
    }, [cartTotalAmt]);


    // % off
    const percentagedis = (mrp, price) => {
        const off = round(((mrp - price) / mrp) * 100, 2)

        return off

    }

    // cart Total amount with delivery fee

    useEffect(() => {
        const totalAmountwithDelivery = () => {
            let amount;
            if (deliveryAmt === "Free") {
                amount = cartTotalAmt
            } else {
                amount = (cartTotalAmt + deliveryAmt)
            }

            setTotalAmount(amount)
        }

        totalAmountwithDelivery()
    }, [deliveryAmt, cartTotalAmt])


    // delete cart items
    const deleteCartItems = async (productId, size) => {
        setCartItems((prev) => {
            const updatedCartData = { ...prev }; // Shallow copy for immutability

            if (updatedCartData[productId] && updatedCartData[productId][size]) {
                delete updatedCartData[productId][size]; // Remove the specific size

                // If no sizes remain for the product, remove the product entirely
                if (Object.keys(updatedCartData[productId]).length === 0) {
                    delete updatedCartData[productId];
                }
            }

            return updatedCartData;
        })

        try {
            const Token = localStorage.getItem("AuthToken")
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/cart/delete-to-cart`, {
                productId, size
            }, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            })

            console.log(res);

        } catch (error) {
            console.log(error);

        }
    }

    const searchBtn = () => {
        setShowSearchBtn(!showSearchBtn)
    }


    const token = localStorage.getItem("AuthToken")
    const addToWishlist = async (productId, token) => {
        try {
            const wishlist = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/wishlist/add-wishlist`, { productId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(wishlist.data);

            return wishlist.data
        } catch (error) {
            toast.error(error.response.data.error || error.response.data.message);
            console.log(error);

        }
    }

    const removeToWishlist = async (productId, token) => {
        try {
            const wishlist = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/wishlist/remove-wishlist`, { productId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return wishlist.data
        } catch (error) {
            console.log(error);

            toast.error(error.response.data.error || error.response.data.message);

        }
    }

    const getWishlist = async (token) => {
        setWishlistLoader(true)
        try {
            const wishlist = await axios.get(`${import.meta.env.VITE_EXPRESS_BASE_URL}/wishlist/get-wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(wishlist);

            return wishlist.data
        } catch (error) {
            console.log(error);

            toast.error(error.response.data.error || error.response.data.message);

        } finally {
            setWishlistLoader(false)
        }
    }

    const currency = "₹"
    const contextValue = {
        currency, products, addToCart, wishlistLoader,
        removeToCart, cartCounts, cartItems, loginHandler,
        cartTotalAmt, totalMrp, deliveryAmt, percentagedis,
        totalAmount, deleteCartItems, logout, auth, logoutMSg,
        searchBtn, showSearchBtn, setShowSearchBtn, setSearch,
        search, addToWishlist, getWishlist, removeToWishlist, productsLoader, productsLoader
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
