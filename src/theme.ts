// src/theme.ts
// Centralized design tokens — every component imports from here.
// No hardcoded colors, spacing, or radii anywhere else.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 100,
} as const;

export const colors = {
  brand: {
    primary: '#3F3FD5',
    accent: '#FF4500',
  },
  background: {
    main: '#F5F5F5',
    card: '#FFFFFF',
    darkRail: '#1B2845',
    darkRailAccent: '#243B5E',
    greenRail: '#1B6B3E',
    greenRailAccent: '#248F53',
    creamRail: '#FFF8F0',
    creamRailAccent: '#FFE8CC',
    glass: 'rgba(255, 255, 255, 0.15)',
    listIcon: '#E3F2FD',
    unknown: '#FFF8E1',
    inactiveTab: '#FFFFFF',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#666666',
    white: '#FFFFFF',
    placeholder: '#999999',
    unknownPrimary: '#5D4037',
    unknownSecondary: '#E65100',
    tabInactive: '#9B9B9B',
  },
  border: {
    light: '#EEEEEE',
    glass: 'rgba(255, 255, 255, 0.2)',
    tabTop: '#E0E0E0',
    cream: '#F0D9A8',
  },
  status: {
    info: '#1565C0',
    success: '#2E7D32',
    warning: '#FF8F00',
    error: '#E65100',
  },
} as const;
