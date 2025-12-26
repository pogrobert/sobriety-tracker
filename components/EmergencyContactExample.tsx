/**
 * Example: How to integrate EmergencyContact with UrgeButton
 *
 * This example shows how to use the EmergencyContact component for settings
 * and pass the contact to the UrgeButton for one-tap calling.
 */

import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { EmergencyContact } from './EmergencyContact';
import { UrgeButton } from './UrgeButton';
import { getEmergencyContact, type EmergencyContact as EmergencyContactType } from '../utils/storage';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

export default function EmergencyContactExample() {
  const [contact, setContact] = useState<EmergencyContactType | null>(null);

  // Load emergency contact on mount
  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const savedContact = await getEmergencyContact();
      setContact(savedContact);
    } catch (error) {
      console.error('Error loading emergency contact:', error);
    }
  };

  const handleContactUpdated = (updatedContact: EmergencyContactType | null) => {
    setContact(updatedContact);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <EmergencyContact
            variant="card"
            onContactUpdated={handleContactUpdated}
          />
        </View>

        {/* Support Section with UrgeButton */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Need Support?</Text>
          <Text style={styles.sectionDescription}>
            If you're struggling, log your urge or reach out to your support person
          </Text>
          <UrgeButton
            emergencyContact={contact}
            onUrgeLogged={() => {
              console.log('Urge logged successfully');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    fontSize: Typography.sizes.md,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
});
