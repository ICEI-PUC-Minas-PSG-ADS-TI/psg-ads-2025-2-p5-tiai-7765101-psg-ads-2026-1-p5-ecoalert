import { Navigate, Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

import { isAuthenticated } from '@/utils/auth'
import { Header } from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'
import { useState } from 'react';

export default function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function openSidebar() {
    console.log("Opening sidebar");
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  if (!isAuthenticated()) {
    return <Navigate replace to="/login" />
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={closeSidebar}/>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Header
          onOpenSidebar={openSidebar}
        />

        <main style={{ flexGrow: 1, overflowY: "auto", padding: "24px" }}>
          <Outlet />
        </main>
      </Box>
    </Box>
  )
}
