import { PublicHeader } from '@/components/PublicHeader/PublicHeader'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <Box
      sx={{
        height: '100dvh',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
      }}
    >
      <PublicHeader />
      <Outlet />
    </Box>
  )
}
