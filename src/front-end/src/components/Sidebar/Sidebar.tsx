"use client";

import { List, ListItem, ListItemIcon, ListItemText, Box } from "@mui/material";
import type { IconName } from "lucide-react/dynamic";
import { Link, useLocation } from "react-router-dom";

import { Icon } from "@/components/Icon/Icon";

import {
  StyledDrawer,
  SectionTitle,
  StyledListItemButton,
} from "./style";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { pathname } = useLocation();

  const drawerContent = (
    <>
      <Box sx={{ overflowY: "auto", flex: 1, py: 2 }}>
        <SectionTitle>Principal</SectionTitle>
        <List disablePadding>
          <NavItem
            href="/home"
            iconName="layout-dashboard"
            label="Dashboard"
            currentPath={pathname}
            onClick={onClose}
          />
          <NavItem
            href="/regioes"
            iconName="map-pin"
            label="Regiões"
            currentPath={pathname}
            onClick={onClose}
          />
          <NavItem
            href="/alertas"
            iconName="bell"
            label="Alertas"
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

        <SectionTitle>Sistema</SectionTitle>
        <List disablePadding>
          <NavItem
            href="/settings"
            iconName="settings"
            label="Configurações"
            currentPath={pathname}
            onClick={onClose}
          />
        </List>
      </Box>
    </>
  );

  return (
    <Box component="nav">
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
