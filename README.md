# Sobriety Tracker

A React Native Expo app built with TypeScript for tracking sobriety milestones. This app features a calming, supportive design with a carefully chosen color palette to create a peaceful and encouraging user experience.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

```
sobriety-tracker/
├── app/              # App screens and routing
│   ├── (tabs)/       # Tab-based navigation screens
│   └── _layout.tsx   # Root layout with theme provider
├── components/       # Reusable UI components
├── constants/        # Theme configuration and constants
│   └── theme.ts      # Color palette and styling constants
├── utils/            # Utility functions and helpers
├── assets/           # Images, fonts, and other static assets
└── hooks/            # Custom React hooks
```

## Color Palette

The app uses a calming, supportive color scheme:

- **Primary**: `#7C9885` (sage green) - Main brand color
- **Secondary**: `#E8DCC4` (warm beige) - Supporting color
- **Accent**: `#D4A574` (soft terracotta) - Highlights and CTAs
- **Text**: `#3A3A3A` (soft black) - Primary text
- **Background**: `#F5F3EE` (off-white cream) - App background
- **Success**: `#9BC4BC` (soft teal) - Achievements and milestones

All colors are defined in `constants/theme.ts` with both light and dark mode support.

## Key Dependencies

- **expo-router**: File-based routing and navigation
- **react-native-reanimated**: Smooth animations
- **react-native-svg**: SVG support for custom graphics
- **@react-native-async-storage/async-storage**: Local data persistence
- **expo-haptics**: Tactile feedback

## Theme Usage

Import and use theme constants in your components:

```typescript
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function MyComponent() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={{
      backgroundColor: colors.background,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg
    }}>
      <Text style={{ color: colors.text }}>Hello!</Text>
    </View>
  );
}
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
