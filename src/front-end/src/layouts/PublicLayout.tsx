import { PublicHeader } from '@/components/PublicHeader/PublicHeader'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <Outlet />
    </>
  )
}
