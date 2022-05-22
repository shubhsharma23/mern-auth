import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Protected = () => {
    const auth = localStorage.getItem('auth')
    return (
      auth ? <Outlet /> : <Navigate to="/register" />
    )
}

export default Protected;

