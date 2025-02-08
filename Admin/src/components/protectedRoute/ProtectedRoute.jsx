import React, { useContext } from 'react'
import { storeContext } from '../context/context'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children}) {
    const {isAuthenticated} = useContext(storeContext)

    if(!isAuthenticated){
        return <Navigate to={"/login"}/>
    }
  return children
}

export default ProtectedRoute