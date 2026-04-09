import { 
  Drawer, 
  ListItemButton, 
  Box, 
  Typography, 
  ListItemButtonProps
} from '@mui/material';

import { styled } from '@mui/material/styles';

interface StyledNavButtonProps extends ListItemButtonProps {
  $active?: boolean;
  component?: React.ElementType;
  to?: string;
}

const DRAWER_WIDTH = 260;

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper, 
    borderRight: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
  },

    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
}));

export const StyledListItemButton = styled(ListItemButton)<StyledNavButtonProps>(({ theme, $active }) => ({
  borderRadius: 8,
  margin: '0 16px 4px',
  padding: '8px 16px',
  
  backgroundColor: $active ? theme.palette.action.selected : 'transparent',
  color: $active ? theme.palette.text.primary : 'inherit',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },

  '& .MuiListItemIcon-root': {
    color: 'inherit',
    minWidth: 36,
  },
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  color: theme.palette.text.primary,
  fontWeight: 600,
  fontSize: '1.125rem',
  gap: 12,
  borderBottom: '1px solid transparent',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  padding: '16px 24px 8px',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  letterSpacing: '0.05em',
}));

export const Logo = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
}))
