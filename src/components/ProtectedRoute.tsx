import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_TOKEN_KEY, AUTH_TOKEN_VALUE } from '../utils/hash'

export const ProtectedRoute = () => {
    const isAuth = localStorage.getItem(AUTH_TOKEN_KEY) === AUTH_TOKEN_VALUE

    return isAuth ? <Outlet /> : <Navigate to="/auth" replace />
}
