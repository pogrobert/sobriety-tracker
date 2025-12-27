import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Modal,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme, useTheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import {
  getEmergencyContact,
  saveEmergencyContact,
  clearEmergencyContact,
  resetSobrietyDate,
  resetShownMilestones,
  type EmergencyContact,
} from '@/utils/storage';

const STORAGE_KEYS = {
  NOTIFICATIONS: '@sobriety_tracker:notifications_enabled',
};

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { themePreference, setThemePreference } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null);

  // Modal states
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [keepData, setKeepData] = useState(true);

  const colors = Colors[colorScheme];

  useEffect(() => {
    loadSettings();
    loadEmergencyContact();
  }, []);

  const loadSettings = async () => {
    try {
      const notifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      setNotificationsEnabled(notifications === 'true');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadEmergencyContact = async () => {
    try {
      const contact = await getEmergencyContact();
      setEmergencyContact(contact);
      if (contact) {
        setContactName(contact.name);
        setContactPhone(contact.phone);
      }
    } catch (error) {
      console.error('Error loading emergency contact:', error);
    }
  };

  const handleDarkModeToggle = async (value: boolean) => {
    try {
      const newValue = value ? 'dark' : 'light';
      await setThemePreference(newValue);
    } catch (error) {
      console.error('Error saving dark mode preference:', error);
      Alert.alert('Error', 'Failed to save dark mode preference');
    }
  };

  const handleNotificationsToggle = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, value.toString());
      setNotificationsEnabled(value);
    } catch (error) {
      console.error('Error saving notification preference:', error);
      Alert.alert('Error', 'Failed to save notification preference');
    }
  };

  const handleOpenContactModal = () => {
    if (emergencyContact) {
      setContactName(emergencyContact.name);
      setContactPhone(emergencyContact.phone);
    } else {
      setContactName('');
      setContactPhone('');
    }
    setContactModalVisible(true);
  };

  const handleSaveContact = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert.alert('Missing Information', 'Please enter both name and phone number.');
      return;
    }

    try {
      setIsSaving(true);
      await saveEmergencyContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
      });
      await loadEmergencyContact();
      setContactModalVisible(false);
      Alert.alert('Success', 'Emergency contact saved successfully.');
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      Alert.alert('Error', 'Failed to save emergency contact');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveContact = async () => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove your emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearEmergencyContact();
              await loadEmergencyContact();
              setContactModalVisible(false);
              Alert.alert('Success', 'Emergency contact removed.');
            } catch (error) {
              console.error('Error removing emergency contact:', error);
              Alert.alert('Error', 'Failed to remove emergency contact');
            }
          },
        },
      ]
    );
  };

  const handleCallEmergencyContact = () => {
    if (emergencyContact) {
      const phoneNumber = \`tel:\${emergencyContact.phone.replace(/[^0-9+]/g, '')}\`;
      Linking.openURL(phoneNumber).catch(() => {
        Alert.alert('Error', 'Unable to make phone call');
      });
    }
  };

  const handleResetCounter = async () => {
    try {
      if (keepData) {
        // Only reset sobriety date and milestones, keep journal and urge logs
        await resetSobrietyDate();
        await resetShownMilestones();
      } else {
        // Clear everything (AsyncStorage.clear would be too aggressive, so we clear selectively)
        await resetSobrietyDate();
        await resetShownMilestones();
        await AsyncStorage.removeItem('@sobriety_tracker:journal_entries');
        await AsyncStorage.removeItem('@sobriety_tracker:urge_logs');
      }

      setResetModalVisible(false);

      // Show compassionate message
      Alert.alert(
        'Counter Reset',
        "Recovery isn't linear. Every attempt is progress.\\n\\nYour journey continues with renewed strength.",
        [{ text: 'OK', style: 'default' }]
      );

      // Note: The app will need to reload the sobriety date naturally
    } catch (error) {
      console.error('Error resetting counter:', error);
      Alert.alert('Error', 'Failed to reset counter');
    }
  };

  const renderSettingItem = (
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed && onPress ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent && (
        <View style={styles.settingItemRight}>
          {rightComponent}
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Settings
          </Text>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            APPEARANCE
          </Text>
          {renderSettingItem(
            'Dark Mode',
            'Use dark theme',
            <Switch
              value={themePreference === 'dark'}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? colors.card : undefined}
            />
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            NOTIFICATIONS
          </Text>
          {renderSettingItem(
            'Enable Notifications',
            'Receive motivational reminders (coming soon)',
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={Platform.OS === 'android' ? colors.card : undefined}
              disabled={true}
            />
          )}
        </View>

        {/* Emergency Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            EMERGENCY CONTACT
          </Text>
          {emergencyContact ? (
            <>
              {renderSettingItem(
                emergencyContact.name,
                emergencyContact.phone,
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Edit
                </Text>,
                handleOpenContactModal
              )}
              {renderSettingItem(
                'Call Emergency Contact',
                'Quick access when you need support',
                <Text style={[styles.linkText, { color: colors.success }]}>
                  Call
                </Text>,
                handleCallEmergencyContact
              )}
            </>
          ) : (
            renderSettingItem(
              'Add Emergency Contact',
              'Someone to call when you need support',
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Add
              </Text>,
              handleOpenContactModal
            )
          )}
        </View>

        {/* Reset Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            DATA
          </Text>
          {renderSettingItem(
            'Reset Counter',
            'Start your journey again',
            <Text style={[styles.linkText, { color: colors.error }]}>
              Reset
            </Text>,
            () => setResetModalVisible(true)
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ABOUT
          </Text>
          {renderSettingItem(
            'Version',
            APP_VERSION
          )}
          {renderSettingItem(
            'Credits',
            'Built with care for your recovery journey'
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textTertiary }]}>
            Your privacy matters. All data is stored locally on your device.
          </Text>
        </View>
      </ScrollView>

      {/* Emergency Contact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setContactModalVisible(false)}
        >
          <Pressable
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Emergency Contact
              </Text>
              <Pressable
                onPress={() => setContactModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>
                  ✕
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              Add someone you trust to call when you need support.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="e.g., Alex"
                placeholderTextColor={colors.textTertiary}
                value={contactName}
                onChangeText={setContactName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Phone Number
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="e.g., (555) 123-4567"
                placeholderTextColor={colors.textTertiary}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.saveButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || isSaving ? 0.7 : 1,
                  },
                ]}
                onPress={handleSaveContact}
                disabled={isSaving}
              >
                <Text style={[styles.modalButtonText, { color: colors.textOnPrimary }]}>
                  {isSaving ? 'Saving...' : 'Save Contact'}
                </Text>
              </Pressable>

              {emergencyContact && (
                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.removeButton,
                    {
                      borderColor: colors.error,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={handleRemoveContact}
                >
                  <Text style={[styles.modalButtonText, { color: colors.error }]}>
                    Remove Contact
                  </Text>
                </Pressable>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Reset Counter Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setResetModalVisible(false)}
        >
          <Pressable
            style={[styles.resetModalContent, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.resetModalTitle, { color: colors.text }]}>
              Reset Counter?
            </Text>

            <Text style={[styles.resetModalMessage, { color: colors.textSecondary }]}>
              This will reset your sobriety counter. You can choose to keep your journal entries and urge logs.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.checkboxContainer,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => setKeepData(!keepData)}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: colors.border,
                    backgroundColor: keepData ? colors.primary : 'transparent',
                  },
                ]}
              >
                {keepData && (
                  <Text style={[styles.checkboxCheck, { color: colors.textOnPrimary }]}>
                    ✓
                  </Text>
                )}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                Keep journal entries and urge logs
              </Text>
            </Pressable>

            <View style={styles.resetModalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.resetModalButton,
                  {
                    backgroundColor: colors.error,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={handleResetCounter}
              >
                <Text style={[styles.resetModalButtonText, { color: colors.textOnPrimary }]}>
                  Reset Counter
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.resetModalButton,
                  styles.cancelButton,
                  {
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => setResetModalVisible(false)}
              >
                <Text style={[styles.resetModalButtonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
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
    paddingBottom: Spacing.xxl,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + 20 : Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingItemRight: {
    flexShrink: 0,
  },
  settingTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    marginTop: Spacing.xs,
  },
  linkText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  footerText: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  modalCloseText: {
    fontSize: 28,
  },
  modalDescription: {
    fontSize: Typography.sizes.md,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
  },
  input: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.md,
    borderWidth: 1,
  },
  modalActions: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  modalButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  removeButton: {
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },

  // Reset Modal styles
  resetModalContent: {
    width: '85%',
    maxWidth: 380,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  resetModalTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  resetModalMessage: {
    fontSize: Typography.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    marginRight: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCheck: {
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  checkboxLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  resetModalActions: {
    gap: Spacing.md,
  },
  resetModalButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  resetModalButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
  },
});
