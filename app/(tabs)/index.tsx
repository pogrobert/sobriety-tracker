import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView, RefreshControl, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import PlantAnimation from '@/components/PlantAnimation';
import QuoteCard from '@/components/QuoteCard';
import MilestoneCelebration from '@/components/MilestoneCelebration';
import { getQuoteOfDay } from '@/utils/quotes';

const SOBRIETY_DATE_KEY = '@sobriety_start_date';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [sobrietyDate, setSobrietyDate] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Load sobriety date from AsyncStorage
  useEffect(() => {
    loadSobrietyDate();
  }, []);

  // Update counter every second
  useEffect(() => {
    if (!sobrietyDate) return;

    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - sobrietyDate.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeElapsed({ days, hours, minutes });
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [sobrietyDate]);

  const loadSobrietyDate = async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) {
        setIsRefreshing(true);
      }

      const dateString = await AsyncStorage.getItem(SOBRIETY_DATE_KEY);
      if (dateString) {
        setSobrietyDate(new Date(dateString));
      }

      // Fade in animation after loading
      if (!isRefresh) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    } catch (err) {
      console.error('Error loading sobriety date:', err);
      setError('Unable to load your data. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await loadSobrietyDate(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartJourney = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Haptic feedback on press
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const now = new Date();
      await AsyncStorage.setItem(SOBRIETY_DATE_KEY, now.toISOString());
      setSobrietyDate(now);

      // Success haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Fade in the main content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.error('Error saving sobriety date:', err);
      setError('Unable to start your journey. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Onboarding screen - shown when no sobriety date is set
  if (!sobrietyDate) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.centerContent}>
          <View style={styles.onboardingContent}>
            <Text style={[styles.onboardingEmoji]}>🌱</Text>

            <Text style={[styles.onboardingTitle, { color: colors.text, fontFamily: Typography.fonts.bold }]}>
              Ready to start{'\n'}your journey?
            </Text>

            <Text style={[styles.onboardingSubtitle, { color: colors.textSecondary, fontFamily: Typography.fonts.regular }]}>
              Every journey begins with a single step.{'\n'}Today can be that day.
            </Text>

            {error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
                <Text style={[styles.errorText, { color: colors.error, fontFamily: Typography.fonts.medium }]}>
                  {error}
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleStartJourney}
              disabled={isSaving}
              onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={({ pressed }) => [
                styles.beginButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isSaving ? 0.6 : pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  ...Platform.select({
                    ios: {
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                    },
                    android: {
                      elevation: 6,
                    },
                  }),
                },
              ]}
            >
              {isSaving ? (
                <ActivityIndicator color={colors.textOnPrimary} />
              ) : (
                <Text style={[styles.beginButtonText, { color: colors.textOnPrimary, fontFamily: Typography.fonts.semibold }]}>
                  Begin Today
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Get quote of the day
  const quoteOfDay = getQuoteOfDay();

  // Main counter screen
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
            <Text style={[styles.errorText, { color: colors.error, fontFamily: Typography.fonts.medium }]}>
              {error}
            </Text>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.counterContent}>
            <Text style={[styles.headerText, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
              Your Journey
            </Text>

          {/* Plant Animation */}
          <View style={styles.plantContainer}>
            <PlantAnimation daysClean={timeElapsed.days} />
          </View>

          <View style={styles.counterContainer}>
            {/* Days */}
            <View style={[
              styles.counterCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }
            ]}>
              <Text style={[styles.counterNumber, { color: colors.primary, fontFamily: Typography.fonts.bold }]}>
                {timeElapsed.days}
              </Text>
              <Text style={[styles.counterLabel, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
                {timeElapsed.days === 1 ? 'Day' : 'Days'}
              </Text>
            </View>

            {/* Hours */}
            <View style={[
              styles.counterCard,
              styles.smallerCard,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }
            ]}>
              <Text style={[styles.smallerNumber, { color: colors.text, fontFamily: Typography.fonts.bold }]}>
                {timeElapsed.hours}
              </Text>
              <Text style={[styles.smallerLabel, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
                {timeElapsed.hours === 1 ? 'Hour' : 'Hours'}
              </Text>
            </View>

            {/* Minutes */}
            <View style={[
              styles.counterCard,
              styles.smallerCard,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                ...Platform.select({
                  ios: {
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  },
                  android: {
                    elevation: 3,
                  },
                }),
              }
            ]}>
              <Text style={[styles.smallerNumber, { color: colors.text, fontFamily: Typography.fonts.bold }]}>
                {timeElapsed.minutes}
              </Text>
              <Text style={[styles.smallerLabel, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
                {timeElapsed.minutes === 1 ? 'Minute' : 'Minutes'}
              </Text>
            </View>
          </View>

          <View style={[
            styles.encouragementCard,
            {
              backgroundColor: colors.success,
              ...Platform.select({
                ios: {
                  shadowColor: colors.success,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 3,
                },
              }),
            }
          ]}>
            <Text style={[styles.encouragementText, { color: colors.textOnPrimary, fontFamily: Typography.fonts.medium }]}>
              {timeElapsed.days === 0 && timeElapsed.hours === 0
                ? "You've started! Every moment counts."
                : timeElapsed.days === 0
                ? "Hour by hour, you're doing it!"
                : timeElapsed.days === 1
                ? "One full day! You're amazing!"
                : `${timeElapsed.days} days strong! Keep going!`}
            </Text>
          </View>

          {/* Quote of the Day */}
          <View style={styles.quoteContainer}>
            <QuoteCard quote={quoteOfDay} />
          </View>
        </View>
      </ScrollView>

      {/* Milestone Celebration Modal */}
      <MilestoneCelebration daysClean={timeElapsed.days} />
    </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorBanner: {
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  errorContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    width: '100%',
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },

  // Onboarding styles
  onboardingContent: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  onboardingEmoji: {
    fontSize: 80,
    marginBottom: Spacing.xl,
  },
  onboardingTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 48,
  },
  onboardingSubtitle: {
    fontSize: Typography.sizes.lg,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 28,
  },
  beginButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    minWidth: 200,
  },
  beginButtonText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },

  // Counter styles
  counterContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  headerText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  plantContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  counterContainer: {
    width: '100%',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  counterCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  counterNumber: {
    fontSize: 72,
    fontWeight: Typography.weights.bold,
    lineHeight: 80,
  },
  counterLabel: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  smallerCard: {
    padding: Spacing.lg,
  },
  smallerNumber: {
    fontSize: 48,
    fontWeight: Typography.weights.bold,
    lineHeight: 56,
  },
  smallerLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  encouragementCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    width: '100%',
    marginTop: Spacing.lg,
  },
  encouragementText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
    lineHeight: 28,
  },
  quoteContainer: {
    width: '100%',
    marginTop: Spacing.xl,
  },
});
