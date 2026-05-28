import { Navigate, Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { useState } from 'react'

import { isAuthenticated } from '@/utils/auth'
import { Header } from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

export default function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  if (!isAuthenticated()) {
    return <Navigate replace to="/login" />
  }

  return (
    <Box sx={{ height: "100dvh", overflow: "hidden", backgroundColor: "background.default" }}>
      <Header onOpenSidebar={openSidebar} />
      <Box
        component="div"
        sx={{
          display: "flex",
          height: "calc(100dvh - 64px)",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Sidebar mobileOpen={sidebarOpen} onClose={closeSidebar}/>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="private-layout-content"
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
