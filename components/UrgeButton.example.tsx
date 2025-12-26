/**
 * Example usage of the UrgeButton component
 *
 * This file demonstrates how to integrate the UrgeButton into your app.
 */

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { UrgeButton } from './UrgeButton';

export default function UrgeButtonExample() {
  const handleUrgeLogged = () => {
    console.log('Urge logged successfully!');
    // You can add custom logic here, such as:
    // - Updating statistics
    // - Triggering notifications
    // - Updating UI state
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Urge Button Example</Text>
        <Text style={styles.description}>
          The button below allows users to log when they're struggling.
          It provides a safe, supportive interface for tracking urges.
        </Text>

        {/* Basic usage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Usage:</Text>
          <UrgeButton />
        </View>

        {/* With emergency contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>With Emergency Contact:</Text>
          <UrgeButton
            emergencyContact="+1-555-123-4567"
            onUrgeLogged={handleUrgeLogged}
          />
        </View>

        {/* Usage notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Implementation Notes:</Text>
          <Text style={styles.note}>
            • The button provides haptic feedback on press
          </Text>
          <Text style={styles.note}>
            • Urge logs are saved to AsyncStorage automatically
          </Text>
          <Text style={styles.note}>
            • The intensity slider ranges from 1 (mild) to 10 (intense)
          </Text>
          <Text style={styles.note}>
            • Notes are optional and limited to 500 characters
          </Text>
          <Text style={styles.note}>
            • Emergency contact button only appears if a phone number is provided
          </Text>
          <Text style={styles.note}>
            • Success message auto-dismisses after 2.5 seconds
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3EE',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3A3A3A',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6B6B6B',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 16,
  },
  notesSection: {
    backgroundColor: '#E8DCC4',
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 12,
  },
  note: {
    fontSize: 14,
    color: '#3A3A3A',
    lineHeight: 22,
    marginBottom: 8,
  },
});
