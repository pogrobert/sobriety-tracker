import { ColorScheme } from '@/constants/theme';

// Plant color palette that adjusts based on theme
export const getPlantColors = (colorScheme: ColorScheme) => {
  const isDark = colorScheme === 'dark';

  return {
    // Soil colors - slightly lighter in dark mode for better contrast
    soilLight: isDark ? '#E0B589' : '#D4A574',
    soilDark: isDark ? '#D4A574' : '#C19A6B',

    // Stem and trunk colors - slightly brighter in dark mode
    stem: isDark ? '#8FA897' : '#7C9885',
    trunk: isDark ? '#D4A574' : '#C19A6B',

    // Leaf colors - enhanced for dark mode visibility
    leafPrimary: isDark ? '#A8D4CC' : '#9BC4BC',
    leafSecondary: isDark ? '#B5D4B3' : '#A8C5A6',
    leafTertiary: isDark ? '#8FA897' : '#7C9885',

    // Seed and details
    seed: isDark ? '#D4A574' : '#C19A6B',
    seedHighlight: isDark ? '#F0E6D4' : '#E8DCC4',

    // Flowers - brighter petals in dark mode
    flowerPetal: isDark ? '#F0E6D4' : '#E8DCC4',
    flowerCenter: isDark ? '#E0B589' : '#D4A574',

    // Details and accents
    pebble: isDark ? '#D4A574' : '#C19A6B',
    grass: isDark ? '#A8D4CC' : '#9BC4BC',
    grassAlt: isDark ? '#B5D4B3' : '#A8C5A6',

    // Birds and other details
    bird: isDark ? '#8FA897' : '#7C9885',
    birdBody: isDark ? '#D4A574' : '#C19A6B',
  };
};
