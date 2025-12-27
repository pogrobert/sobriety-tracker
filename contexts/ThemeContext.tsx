import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useColorScheme as useSystemColorScheme, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme } from '@/constants/theme';

const STORAGE_KEY = '@sobriety_tracker:dark_mode_preference';
const TRANSITION_DURATION = 300; // ms

type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  isLoading: boolean;
  transitionProgress: Animated.Value;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme() ?? 'light';
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);
  const transitionProgress = useRef(new Animated.Value(0)).current;
  const previousColorScheme = useRef<ColorScheme>('light');

  // Determine the actual color scheme based on preference
  const colorScheme: ColorScheme =
    themePreference === 'system' ? systemColorScheme : themePreference;

  // Animate theme transitions
  useEffect(() => {
    if (previousColorScheme.current !== colorScheme && !isLoading) {
      Animated.timing(transitionProgress, {
        toValue: 1,
        duration: TRANSITION_DURATION,
        useNativeDriver: false,
      }).start(() => {
        transitionProgress.setValue(0);
      });
    }
    previousColorScheme.current = colorScheme;
  }, [colorScheme, isLoading]);

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        setThemePreferenceState(saved);
      } else {
        setThemePreferenceState('system');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemePreference = async (preference: ThemePreference) => {
    try {
      setThemePreferenceState(preference);
      await AsyncStorage.setItem(STORAGE_KEY, preference);
    } catch (error) {
      console.error('Error saving theme preference:', error);
      throw error;
    }
  };

  const value: ThemeContextType = {
    colorScheme,
    themePreference,
    setThemePreference,
    isLoading,
    transitionProgress,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to get just the color scheme (for backwards compatibility)
export function useColorScheme(): ColorScheme {
  const { colorScheme } = useTheme();
  return colorScheme;
}
