import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
    const isAuth = localStorage.getItem('girlfriend_verified') === 'true'

    return isAuth ? <Outlet /> : <Navigate to="/auth" replace />
}
