'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  AppBar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, Tooltip, Typography, useColorScheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logo } from './Logo';
import DarkMode from '@mui/icons-material/DarkModeOutlined';
import LightMode from '@mui/icons-material/LightModeOutlined';

export const NAV = [
  { href: '/calculator', label: 'Home value' },
  { href: '/v2', label: 'Home value B' },
  { href: '/sell', label: 'Sell my home' },
  { href: '/seller/bids', label: 'My bids' },
  { href: '/agent', label: 'Agent console' },
  { href: '/admin', label: 'Admin' },
];

function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const current = mode === 'system' ? systemMode : mode;
  if (!current) return <Box sx={{ width: 48 }} />;
  const next = current === 'dark' ? 'light' : 'dark';
  return (
    <Tooltip title={`Switch to ${next} theme`}>
      <IconButton aria-label={`Switch to ${next} theme`} onClick={() => setMode(next)}>
        {current === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => path.startsWith(href);
  // The home page is a full-bleed brand page with its own header and footer.
  if (path === '/') {
    return (
      <>
        <Box component="a" href="#main" sx={{ position: 'absolute', left: 8, top: -64, zIndex: 2000, p: 1.5, borderRadius: 1, bgcolor: 'primary.main', color: 'primary.contrastText', '&:focus': { top: 8 } }}>Skip to main content</Box>
        <Box component="main" id="main" tabIndex={-1} sx={{ outline: 'none' }}>{children}</Box>
      </>
    );
  }

  return (
    <>
      <Box
        component="a"
        href="#main"
        sx={{
          position: 'absolute', left: 8, top: -64, zIndex: 2000, p: 1.5, borderRadius: 1,
          bgcolor: 'primary.main', color: 'primary.contrastText', '&:focus': { top: 8 },
        }}
      >
        Skip to main content
      </Box>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1 }}>
          <IconButton aria-label="Open menu" onClick={() => setOpen(true)} sx={{ display: { md: 'none' }, ml: -1 }}>
            <MenuIcon />
          </IconButton>
          <Box component={Link} href="/" aria-label="Housa home" sx={{ display: 'flex', color: 'text.primary', mr: 2, py: 0.5 }}>
            <Logo height={52} />
          </Box>
          <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
            {NAV.map((n) => (
              <Button
                key={n.href}
                component={Link}
                href={n.href}
                aria-current={isActive(n.href) ? 'page' : undefined}
                color="inherit"
                sx={{
                  color: 'text.primary', borderRadius: 0, px: 2,
                  boxShadow: (t) => (isActive(n.href) ? `inset 0 -3px 0 ${t.vars?.palette.success.main}` : 'none'),
                  fontWeight: 800,
                }}
              >
                {n.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />
          <Typography variant="caption" sx={{ color: 'text.primary', display: { xs: 'none', sm: 'block' } }}>
            Prototype · dummy data
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { width: 300, borderRadius: 0, bgcolor: 'm3.surfaceContainerLow' } } }}>
        <Box component="nav" aria-label="Main" sx={{ p: 1.5 }}>
          <Box sx={{ px: 2, py: 2, color: 'text.primary' }}><Logo height={64} /></Box>
          <List>
            {NAV.map((n) => (
              <ListItemButton
                key={n.href}
                component={Link}
                href={n.href}
                selected={isActive(n.href)}
                aria-current={isActive(n.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
                sx={{ borderRadius: '7px', minHeight: 56, '&.Mui-selected': { bgcolor: 'm3.secondaryContainer' } }}
              >
                <ListItemText primary={n.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>Prototype · dummy data</Typography>
        </Box>
      </Drawer>
      <Box component="main" id="main" tabIndex={-1} sx={{ outline: 'none', pb: 8 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 3, bgcolor: 'm3.surfaceContainerLow' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            Housa Technologies Inc. is a software platform, not a real estate brokerage. Housa does not set agent fees or act as anyone’s agent. This prototype uses made-up data.
          </Typography>
        </Container>
      </Box>
    </>
  );
}
