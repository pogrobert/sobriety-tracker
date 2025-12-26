import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: colors.primary, dark: colors.primary }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <ThemedText style={styles.headerTitle}>Sobriety Tracker</ThemedText>
        </View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Your Journey</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ThemedText type="subtitle" style={{ color: colors.primary }}>
          Your Progress
        </ThemedText>
        <ThemedText style={styles.cardText}>
          Track your sobriety journey one day at a time
        </ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, { backgroundColor: colors.success, borderColor: colors.border }]}>
        <ThemedText type="subtitle" style={{ color: colors.textOnPrimary }}>
          Stay Strong
        </ThemedText>
        <ThemedText style={[styles.cardText, { color: colors.textOnPrimary }]}>
          Every day is a victory worth celebrating
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Getting Started</ThemedText>
        <ThemedText>
          This app is ready for you to build your sobriety tracking features.
          The theme uses calming, supportive colors to create a peaceful experience.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  titleContainer: {
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  cardText: {
    marginTop: Spacing.sm,
  },
  stepContainer: {
    gap: 8,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
});
