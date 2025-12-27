/**
 * Color palette and theme configuration for the Sobriety Tracker app
 *
 * Color Palette:
 * - Primary: #7C9885 (sage green) - Main brand color
 * - Secondary: #E8DCC4 (warm beige) - Supporting color
 * - Accent: #D4A574 (soft terracotta) - Highlights and CTAs
 * - Text: #3A3A3A (soft black) - Primary text
 * - Background: #F5F3EE (off-white cream) - App background
 * - Success: #9BC4BC (soft teal) - Achievements and milestones
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#7C9885',      // sage green
    secondary: '#E8DCC4',    // warm beige
    accent: '#D4A574',       // soft terracotta
    text: '#3A3A3A',         // soft black
    background: '#F5F3EE',   // off-white cream
    success: '#9BC4BC',      // soft teal

    // UI colors
    tint: '#7C9885',
    icon: '#6B6B6B',
    tabIconDefault: '#6B6B6B',
    tabIconSelected: '#7C9885',
    card: '#FFFFFF',
    border: '#E8DCC4',
    notification: '#D4A574',
    error: '#D4756E',

    // Text variations
    textSecondary: '#6B6B6B',
    textTertiary: '#9A9A9A',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
  },
  dark: {
    primary: '#9BC4BC',      // adjusted for dark - soft teal
    secondary: '#3A3632',    // dark warm tone
    accent: '#D4A574',       // soft terracotta
    text: '#E8E8E8',         // light gray
    background: '#1A1A1A',   // dark background
    success: '#9BC4BC',      // soft teal

    // UI colors
    tint: '#9BC4BC',
    icon: '#B0B0B0',
    tabIconDefault: '#B0B0B0',
    tabIconSelected: '#9BC4BC',
    card: '#2A2A2A',         // surface color
    border: '#3A3A3A',
    notification: '#D4A574',
    error: '#E67E73',

    // Text variations
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    textOnPrimary: '#1A1A1A',
    textOnAccent: '#1A1A1A',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light;
