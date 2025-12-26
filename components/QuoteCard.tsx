import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, Easing } from 'react-native-reanimated';
import type { Quote } from '../utils/quotes';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(1000).easing(Easing.inOut(Easing.ease))}
    >
      {/* Decorative opening quotation mark */}
      <Text style={styles.quotationMarkOpen}>"</Text>

      {/* Quote text */}
      <Text style={styles.quoteText}>{quote.text}</Text>

      {/* Decorative closing quotation mark */}
      <Text style={styles.quotationMarkClose}>"</Text>

      {/* Author (if present) */}
      {quote.author && (
        <Text style={styles.author}>— {quote.author}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8DCC4',
    borderRadius: 16,
    padding: 20,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  quotationMarkOpen: {
    position: 'absolute',
    top: 8,
    left: 16,
    fontSize: 48,
    fontWeight: '700',
    color: '#D4C4A8',
    opacity: 0.4,
    lineHeight: 48,
  },
  quotationMarkClose: {
    position: 'absolute',
    bottom: 8,
    right: 16,
    fontSize: 48,
    fontWeight: '700',
    color: '#D4C4A8',
    opacity: 0.4,
    lineHeight: 48,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3A3A3A',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontWeight: '400',
  },
  author: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B6B6B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
    fontWeight: '300',
  },
});
