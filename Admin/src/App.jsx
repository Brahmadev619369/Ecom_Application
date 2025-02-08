import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Error from './components/error/Error'
import AddItems from './components/pages/addItems/AddItems'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute'
import Login from './components/pages/login/Login'
import ItemsList from './components/pages/ItemsList/ItemsList'
import ItemDetails from './components/pages/ItemsList/itemDetails'
import Orders from './components/pages/orders/Orders'
import OrdersDetails from './components/pages/orders/ordersDetails'
import Status from './components/pages/status/Status'
import Registration from './components/pages/userRegistration/Registration'
import Subscribe from './components/pages/subscribe/Subscribe'
import Admin from './components/pages/Admin/Admin'
function App() {

  // const router = createBrowserRouter(
  //   createRoutesFromChildren(
  //     <Route path='/' element ={<Layout/>} errorElement ={<Error/>}>
  //       <Route path='/additems' element={<AddItems/>} />
  //     </Route>
  //   )
  // )


  const router = createBrowserRouter([
    {
      path: "/login",  
      element: <Login />,
    },
    {
      path: "/",
      element: <Layout />,
      errorElement : <Error/>,
      children: [
        {
          path: "/",
          element: (
              <Admin />
          ),
        },
        {
          path: "/additems",
          element: (
              <AddItems />
          ),
        },

        {
          path: "/itemslist",
          element: (

              <ItemsList />
          ),
        },

        
        {
          path: "/products/:productId",
          element: (

              < ItemDetails/>
          ),
        },
        {
          path: "/orders",
          element: (

              < Orders/>

          ),
        },
        {
          path: "/orders/:orderId",
          element: (

              < OrdersDetails/>

          ),
        },
        {
          path: "/orders/status",
          element: (

              < Status/>

          ),
        },{
          path: "/users/register",
          element: (

              < Registration/>
          ),
        },
        {
          path: "/subscrib-message",
          element: (

              < Subscribe/>
          ),
        },
        // Add more protected routes here as needed
      ],
    },
  ]);
  
  return (
    <>
<RouterProvider router={router}/>
    </>
  )
}

export default App
