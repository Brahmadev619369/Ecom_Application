import { useState ,useContext} from 'react'
import { createBrowserRouter,createRoutesFromChildren,Route,RouterProvider } from 'react-router-dom'
import Layout from './components/layouts/Layout/Layout'
import Home from './components/pages/Home/Home'
import Orders from './components/pages/Orders/Orders'
import Login from "./components/pages/Login/Login"
import About from "./components/pages/About/About"
import Cart from "./components/pages/Cart/Cart"
import PlaceOrders from "./components/pages/PlaceOrders/PlaceOrders"
import Product from "./components/pages/Product/Product"
import Error from "./components/pages/Error/Error"
import Contact from "./components/pages/Contact/Contact"
import Collection from "./components/pages/Collection/Collection"
import SearchBar from './components/searchBar/SearchBar'
import Loader from './components/loader/Loader'
import Activation from './components/pages/Activation/Activation'
import ForgotPassword from './components/pages/ForgotPassword/ForgotPassword'
import ResetPassword from './components/pages/ForgotPassword/ResetPassword'
import Address from './components/pages/address/Address'
import Success from './components/pages/paymentStatus/Success'
import Failure from './components/pages/paymentStatus/Failure'
import OrderDetails from './components/pages/Orders/OrderDetails'
import Profile from './components/pages/profile/Profile'
import Invoice from './components/invoice/Invoice'
import Tc from './components/pages/T&C/Tc'
import Wishlist from './components/pages/wishlist/Wishlist'





function App() {
  
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path='/' element = {<Layout/>} errorElement = {<Error/>}>
        <Route index element = {<Home/>}/>
        <Route path='/about' element = {<About/>}/>
        <Route path='/collection' element = {<Collection/>}/>
        <Route path='/contact' element = {<Contact/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/product/:productId' element = {<Product/>}/>
        <Route path='/cart' element = {<Cart/>}/>
        <Route path='/users/register/activation/:activationToken' element = {<Activation/>}/>
        <Route path='/forgot-password' element = {<ForgotPassword/>}/>
        <Route path='/users/reset-password/:resetToken' element = {<ResetPassword/>}/>
        <Route path='/address' element = {<Address/>}/>
        <Route path='/place-orders' element = {<PlaceOrders/>}/>
        <Route path='/payment/success' element = {<Success/>}/>
        <Route path='/payment/failure' element = {<Failure/>}/>
        <Route path='/myOrders' element = {<Orders/>}/>
        <Route path='/myOrders/:orderId' element = {<OrderDetails/>}/>
        <Route path='/user/profile' element = {<Profile/>}/>
        <Route path='/invoice' element = {<Invoice/>}/>
        <Route path='/terms-and-conditions' element = {<Tc/>}/>
        <Route path='/wishlist' element = {<Wishlist/>}/>
        
      </Route>
    )
  )

  return (
    <>
      <RouterProvider router = {router}/>
    </>
  )
}

export default App
