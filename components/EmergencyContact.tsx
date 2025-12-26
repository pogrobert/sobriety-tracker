import React, { useState, useEffect } from 'react';
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
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import {
  getEmergencyContact,
  saveEmergencyContact,
  clearEmergencyContact,
  type EmergencyContact as EmergencyContactType,
} from '../utils/storage';

interface EmergencyContactProps {
  /** Callback when contact is updated */
  onContactUpdated?: (contact: EmergencyContactType | null) => void;
  /** Show as a card (for settings screen) or inline */
  variant?: 'card' | 'inline';
}

export const EmergencyContact: React.FC<EmergencyContactProps> = ({
  onContactUpdated,
  variant = 'card',
}) => {
  const [contact, setContact] = useState<EmergencyContactType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load contact on mount
  useEffect(() => {
    loadContact();
  }, []);

  const loadContact = async () => {
    try {
      const savedContact = await getEmergencyContact();
      setContact(savedContact);
      if (savedContact) {
        setName(savedContact.name);
        setPhone(savedContact.phone);
      }
    } catch (error) {
      console.error('Error loading emergency contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Reset form if there's an existing contact
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
    } else {
      setName('');
      setPhone('');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Missing Information', 'Please enter both a name and phone number.');
      return;
    }

    try {
      setIsSaving(true);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const newContact = { name: name.trim(), phone: phone.trim() };
      await saveEmergencyContact(newContact);
      setContact(newContact);
      onContactUpdated?.(newContact);

      setModalVisible(false);
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      Alert.alert('Error', 'Failed to save emergency contact. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = () => {
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
              setContact(null);
              setName('');
              setPhone('');
              onContactUpdated?.(null);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error removing emergency contact:', error);
              Alert.alert('Error', 'Failed to remove contact. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCall = async () => {
    if (!contact) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const phoneNumber = contact.phone.replace(/[^0-9+]/g, '');
    const url = `tel:${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to make phone call from this device');
      }
    } catch (error) {
      console.error('Error opening phone dialer:', error);
      Alert.alert('Error', 'Failed to open phone dialer');
    }
  };

  if (isLoading) {
    return null;
  }

  const containerStyle = variant === 'card' ? styles.card : styles.inline;

  return (
    <>
      <View style={containerStyle}>
        {contact ? (
          <>
            {/* Contact Info */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🤝</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Your Support Person</Text>
                <Text style={styles.subtitle}>
                  Someone who's there when you need them
                </Text>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Name</Text>
                <Text style={styles.contactValue}>{contact.name}</Text>
              </View>
              <View style={styles.contactRow}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{contact.phone}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.callButton]}
                onPress={handleCall}
                accessibilityLabel={`Call ${contact.name}`}
                accessibilityRole="button"
              >
                <Text style={styles.callButtonText}>📞 Call Now</Text>
              </TouchableOpacity>

              <View style={styles.secondaryActions}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={handleOpenModal}
                  accessibilityLabel="Edit contact"
                  accessibilityRole="button"
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.removeButton]}
                  onPress={handleRemove}
                  accessibilityLabel="Remove contact"
                  accessibilityRole="button"
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Empty State */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🌿</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Add a Support Person</Text>
                <Text style={styles.emptyText}>
                  Consider adding someone who supports your journey. Having a trusted
                  person to reach out to can make all the difference.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleOpenModal}
              accessibilityLabel="Add emergency contact"
              accessibilityRole="button"
            >
              <Text style={styles.addButtonText}>+ Add Contact</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Edit/Add Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={styles.modalContent}
              entering={SlideInDown.duration(300)}
            >
              <Text style={styles.modalTitle}>
                {contact ? 'Edit' : 'Add'} Support Person
              </Text>
              <Text style={styles.modalSubtitle}>
                Choose someone you trust and feel comfortable reaching out to
              </Text>

              {/* Name Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Sarah, Mom, Best Friend"
                  placeholderTextColor="#9A9A9A"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  maxLength={50}
                />
              </View>

              {/* Phone Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., (555) 123-4567"
                  placeholderTextColor="#9A9A9A"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={20}
                />
              </View>

              {/* Info Message */}
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  💚 This person will be available to call when you're struggling.
                  Make sure they know you're adding them as your support person.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isSaving}
                  accessibilityLabel="Save contact"
                  accessibilityRole="button"
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? 'Saving...' : 'Save'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCloseModal}
                  accessibilityLabel="Cancel"
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inline: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3A3A3A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B6B6B',
    lineHeight: 22,
    marginTop: 4,
  },
  contactInfo: {
    backgroundColor: '#F5F3EE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3A',
  },
  actions: {
    gap: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButton: {
    backgroundColor: '#7C9885',
  },
  callButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#7C9885',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C9885',
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DCC4',
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B6B6B',
  },
  addButton: {
    backgroundColor: '#7C9885',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3A3A3A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A3A3A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F3EE',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#3A3A3A',
    borderWidth: 1,
    borderColor: '#E8DCC4',
  },
  infoBox: {
    backgroundColor: '#F0F8F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#7C9885',
  },
  infoText: {
    fontSize: 14,
    color: '#3A3A3A',
    lineHeight: 20,
  },
  modalActions: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#7C9885',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DCC4',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B6B6B',
  },
});
