"use client";

import { List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import type { IconName } from "lucide-react/dynamic";
import { Link, useLocation } from "react-router-dom";

import { Icon } from "@/components/Icon/Icon";

import {
  StyledDrawer,
  StyledListItemButton,
} from "./style";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { pathname } = useLocation();

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ overflowY: "auto", flex: 1, py: 2 }}>
        <List disablePadding>
          <NavItem
            href="/home"
            iconName="layout-dashboard"
            label="Dashboard"
            currentPath={pathname}
            onClick={onClose}
          />
          <NavItem
            href="/relatorio-ia"
            iconName="sparkles"
            label="Relatorio IA"
            currentPath={pathname}
            onClick={onClose}
          />
          <NavItem
            href="/sensores"
            iconName="radio"
            label="Sensores"
            currentPath={pathname}
            onClick={onClose}
          />
        </List>

        <List disablePadding sx={{ mt: 1 }}>
          <NavItem
            href="/conta"
            iconName="user"
            label="Minha Conta"
            currentPath={pathname}
            onClick={onClose}
          />
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ height: "100%", flexShrink: 0 }}>
      <StyledDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {drawerContent}
      </StyledDrawer>

      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          height: "100%",
          "& .MuiDrawer-paper": {
            position: "relative",
            height: "100%",
            minHeight: 0,
          },
        }}
      >
        {drawerContent}
      </StyledDrawer>
    </Box>
  );
}

function NavItem({
  href,
  iconName,
  label,
  currentPath,
  onClick,
}: {
  href: string;
  iconName: IconName;
  label: string;
  currentPath: string;
  onClick: () => void;
}) {
  const isActive = currentPath === href;

  return (
    <ListItem disablePadding>
      <StyledListItemButton
        component={Link}
        to={href}
        $active={isActive}
        onClick={onClick}
      >
        <ListItemIcon>
          <Icon name={iconName} size={20} />
        </ListItemIcon>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500 }}
        />
      </StyledListItemButton>
    </ListItem>
  );
}
