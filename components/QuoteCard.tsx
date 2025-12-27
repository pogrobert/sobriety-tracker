import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Typography } from '@/constants/theme';
import type { Quote } from '../utils/quotes';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.secondary,
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 3,
            },
          }),
        },
      ]}
      entering={FadeIn.duration(1000).easing(Easing.inOut(Easing.ease))}
    >
      {/* Decorative opening quotation mark */}
      <Text style={[styles.quotationMarkOpen, { color: colors.border }]}>
        "
      </Text>

      {/* Quote text */}
      <Text style={[styles.quoteText, { color: colors.text }]}>
        {quote.text}
      </Text>

      {/* Decorative closing quotation mark */}
      <Text style={[styles.quotationMarkClose, { color: colors.border }]}>
        "
      </Text>

      {/* Author (if present) */}
      {quote.author && (
        <Text style={[styles.author, { color: colors.textSecondary }]}>
          — {quote.author}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: 20,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    position: 'relative',
  },
  quotationMarkOpen: {
    position: 'absolute',
    top: 8,
    left: 16,
    fontSize: 48,
    fontWeight: Typography.weights.bold,
    opacity: 0.4,
    lineHeight: 48,
  },
  quotationMarkClose: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    fontSize: 48,
    fontWeight: Typography.weights.bold,
    opacity: 0.4,
    lineHeight: 48,
  },
  quoteText: {
    fontSize: Typography.sizes.md,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontWeight: Typography.weights.regular,
  },
  author: {
    fontSize: Typography.sizes.sm,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    fontWeight: '300',
  },
});
