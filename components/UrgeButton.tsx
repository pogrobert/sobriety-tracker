import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { saveUrgeLog, type EmergencyContact } from '../utils/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface UrgeButtonProps {
  /** Optional emergency contact */
  emergencyContact?: EmergencyContact | null;
  /** Callback when urge is successfully logged */
  onUrgeLogged?: () => void;
}

export const UrgeButton: React.FC<UrgeButtonProps> = ({
  emergencyContact,
  onUrgeLogged,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [modalVisible, setModalVisible] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleButtonPress = () => {
    // Haptic feedback on button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIntensity(5);
    setNotes('');
    setShowSuccess(false);
  };

  const handleLogUrge = async () => {
    try {
      setIsSaving(true);
      // Light haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Save the urge log
      await saveUrgeLog(intensity, notes.trim() || undefined);

      // Show success message
      setShowSuccess(true);

      // Call callback if provided
      onUrgeLogged?.();

      // Auto-close after 2.5 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 2500);
    } catch (error) {
      console.error('Error logging urge:', error);
      Alert.alert('Error', 'Failed to log urge. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCallEmergencyContact = async () => {
    // Strong haptic feedback for important action
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    if (!emergencyContact) {
      // Gentle, supportive message when no contact is set
      Alert.alert(
        'Add a Support Person',
        'Consider adding someone who supports your journey. Having a trusted person to reach out to can make all the difference.',
        [{ text: 'Maybe Later' }]
      );
      return;
    }

    const phoneNumber = emergencyContact.phone.replace(/[^0-9+]/g, '');
    const url = `tel:${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        // Close modal after initiating call
        handleCloseModal();
      } else {
        Alert.alert('Error', 'Unable to make phone call from this device');
      }
    } catch (error) {
      console.error('Error opening phone dialer:', error);
      Alert.alert('Error', 'Failed to open phone dialer');
    }
  };

  const getIntensityColor = (value: number): string => {
    // Warm gradient from light to intense terracotta
    const colors = [
      '#F5E6D3', // 1 - Very light warm
      '#F0DCC4', // 2
      '#EAD3B5', // 3
      '#E4C9A6', // 4
      '#DFC097', // 5
      '#DAB788', // 6
      '#D5AE79', // 7
      '#D4A574', // 8 - Terracotta accent
      '#CF9C6A', // 9
      '#CA9360', // 10 - Deeper terracotta
    ];
    return colors[value - 1] || colors[4];
  };

  return (
    <>
      {/* Main Urge Button */}
      <TouchableOpacity
        style={[styles.urgeButton, { backgroundColor: colors.accent }]}
        onPress={handleButtonPress}
        activeOpacity={0.8}
        accessibilityLabel="I'm struggling button"
        accessibilityHint="Opens dialog to log your struggle and get support"
        accessibilityRole="button"
      >
        <Text style={[styles.urgeButtonText, { color: colors.textOnAccent }]}>I'm Struggling 😔</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
              entering={SlideInDown.duration(300)}
            >
              {!showSuccess ? (
                <>
                  {/* Encouraging Header */}
                  <Text style={[styles.modalTitle, { color: colors.text }]}>You're Not Alone</Text>
                  <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                    It's okay to struggle. You're brave for acknowledging this.
                  </Text>

                  {/* Intensity Slider */}
                  <View style={styles.sliderSection}>
                    <Text style={[styles.sliderLabel, { color: colors.text }]}>
                      How intense is this feeling?
                    </Text>

                    {/* Slider Track */}
                    <View style={styles.sliderContainer}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <TouchableOpacity
                          key={value}
                          style={[
                            styles.sliderDot,
                            {
                              backgroundColor:
                                value <= intensity
                                  ? getIntensityColor(intensity)
                                  : colorScheme === 'dark' ? '#3A3A3A' : '#E8E8E8',
                            },
                            value === intensity && styles.sliderDotActive,
                          ]}
                          onPress={() => {
                            setIntensity(value);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                          accessibilityLabel={`Intensity level ${value}`}
                          accessibilityRole="button"
                        />
                      ))}
                    </View>

                    {/* Intensity Labels */}
                    <View style={styles.sliderLabels}>
                      <Text style={[styles.sliderLabelText, { color: colors.textSecondary }]}>Mild</Text>
                      <Text style={[styles.sliderLabelText, styles.intensityValue, { color: colors.accent }]}>
                        {intensity}
                      </Text>
                      <Text style={[styles.sliderLabelText, { color: colors.textSecondary }]}>Intense</Text>
                    </View>
                  </View>

                  {/* Optional Notes */}
                  <View style={styles.notesSection}>
                    <Text style={[styles.notesLabel, { color: colors.text }]}>
                      What's on your mind? (optional)
                    </Text>
                    <TextInput
                      style={[styles.notesInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                      placeholder="Describe what you're feeling..."
                      placeholderTextColor={colors.textTertiary}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      value={notes}
                      onChangeText={setNotes}
                      maxLength={500}
                    />
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                      onPress={handleLogUrge}
                      disabled={isSaving}
                      accessibilityLabel="Log and continue"
                      accessibilityRole="button"
                    >
                      <Text style={[styles.primaryButtonText, { color: colors.textOnPrimary }]}>
                        {isSaving ? 'Saving...' : 'Log & Continue'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.emergencyButton, { backgroundColor: colors.card, borderColor: colors.accent }]}
                      onPress={handleCallEmergencyContact}
                      accessibilityLabel={emergencyContact ? `Call ${emergencyContact.name}` : 'Add emergency contact'}
                      accessibilityRole="button"
                    >
                      <Text style={[styles.emergencyButtonText, { color: colors.accent }]}>
                        {emergencyContact
                          ? `📞 Call ${emergencyContact.name}`
                          : '🌿 Add Support Person'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Close Button */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseModal}
                    accessibilityLabel="Close dialog"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.closeButtonText, { color: colors.textSecondary }]}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                /* Success Message */
                <Animated.View
                  entering={FadeIn.duration(400)}
                  style={styles.successContainer}
                >
                  <Text style={styles.successEmoji}>💚</Text>
                  <Text style={[styles.successTitle, { color: colors.primary }]}>You Did It!</Text>
                  <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                    Logging your struggle is a sign of strength. Take it one moment
                    at a time. You're doing great.
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  urgeButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  urgeButtonText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    minHeight: 500,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  sliderSection: {
    marginBottom: 28,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  sliderDotActive: {
    transform: [{ scale: 1.3 }],
    shadowColor: '#D4A574',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabelText: {
    fontSize: 14,
  },
  intensityValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  notesSection: {
    marginBottom: 24,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  notesInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emergencyButton: {
    borderWidth: 2,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
});
