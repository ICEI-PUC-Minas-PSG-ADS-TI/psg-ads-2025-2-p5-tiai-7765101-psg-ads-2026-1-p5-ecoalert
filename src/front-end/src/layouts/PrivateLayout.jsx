import { Navigate, Outlet } from 'react-router-dom'

import { isAuthenticated } from '@/utils/auth'

export default function PrivateLayout() {
  if (!isAuthenticated()) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
