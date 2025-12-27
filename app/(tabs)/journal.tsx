import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
  type JournalEntry,
} from '@/utils/storage';

// Placeholder prompts for journal entries
const PROMPTS = [
  'How are you feeling today?',
  'What are you grateful for?',
  'What challenged you?',
  'What gave you strength today?',
  'What are you proud of?',
];

export default function JournalScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEntryText, setNewEntryText] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadEntries();
    // Set a random prompt when component mounts
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const loadEntries = async (isRefresh = false) => {
    try {
      setError(null);
      if (isRefresh) {
        setIsRefreshing(true);
      }

      const loadedEntries = await getJournalEntries();
      setEntries(loadedEntries);
    } catch (err) {
      console.error('Error loading journal entries:', err);
      setError('Unable to load journal entries');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await loadEntries(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(true);
    // Set a new random prompt each time modal opens
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setNewEntryText('');
  };

  const handleSaveEntry = async () => {
    if (!newEntryText.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    try {
      setIsSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await saveJournalEntry(newEntryText);
      await loadEntries();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      handleCloseModal();
    } catch (err) {
      console.error('Error saving journal entry:', err);
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = (entry: JournalEntry) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJournalEntry(entry.id);
              await loadEntries();
            } catch (error) {
              console.error('Error deleting journal entry:', error);
              Alert.alert('Error', 'Failed to delete journal entry');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    }

    // Otherwise show the date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderEntry = ({ item }: { item: JournalEntry }) => (
    <View
      style={[
        styles.entryCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...Platform.select({
            ios: {
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
          }),
        },
      ]}
    >
      <View style={styles.entryHeader}>
        <Text style={[styles.entryDate, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
          {formatDate(item.timestamp)}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteEntry(item)}
          onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={styles.deleteButton}
          accessibilityLabel="Delete entry"
          accessibilityRole="button"
        >
          <Text style={[styles.deleteButtonText, { color: colors.error, fontFamily: Typography.fonts.medium }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.entryText, { color: colors.text, fontFamily: Typography.fonts.regular }]}>
        {item.entry}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📖</Text>
      <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: Typography.fonts.semibold }]}>
        Your reflections will appear here
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary, fontFamily: Typography.fonts.regular }]}>
        Start your journaling journey by adding your first entry
      </Text>
    </View>
  );

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: Typography.fonts.bold }]}>
          Daily Reflections
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: Typography.fonts.regular }]}>
          A space for your thoughts and gratitude
        </Text>
      </View>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
          <Text style={[styles.errorText, { color: colors.error, fontFamily: Typography.fonts.medium }]}>
            {error}
          </Text>
        </View>
      )}

      {/* Journal Entries List */}
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          entries.length === 0 && styles.emptyListContent,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* New Entry Button */}
      <Pressable
        style={({ pressed }) => [
          styles.newEntryButton,
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.8 : 1,
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
        onPress={handleOpenModal}
        onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        accessibilityLabel="Create new journal entry"
        accessibilityRole="button"
      >
        <Text style={[styles.newEntryButtonText, { color: colors.textOnPrimary, fontFamily: Typography.fonts.semibold }]}>
          + New Entry
        </Text>
      </Pressable>

      {/* New Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseModal}>
          <Pressable
            style={[styles.modalContent, { backgroundColor: colors.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontFamily: Typography.fonts.bold }]}>
                New Entry
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={styles.modalCloseButton}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.promptText, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
              {currentPrompt}
            </Text>

            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                  fontFamily: Typography.fonts.regular,
                },
              ]}
              placeholder="Write your thoughts here..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              value={newEntryText}
              onChangeText={setNewEntryText}
              autoFocus
              maxLength={2000}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: isSaving ? 0.6 : pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
                onPress={handleSaveEntry}
                onPressIn={() => !isSaving && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                disabled={isSaving}
                accessibilityLabel="Save entry"
                accessibilityRole="button"
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <Text style={[styles.saveButtonText, { color: colors.textOnPrimary, fontFamily: Typography.fonts.semibold }]}>
                    Save Entry
                  </Text>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  {
                    borderColor: colors.border,
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
                onPress={handleCloseModal}
                onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                accessibilityLabel="Cancel"
                accessibilityRole="button"
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary, fontFamily: Typography.fonts.medium }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Platform.OS === 'ios' ? Spacing.xxl + 20 : Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100, // Space for floating button
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sizes.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    lineHeight: 22,
  },
  entryCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  entryDate: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  deleteButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  entryText: {
    fontSize: Typography.sizes.md,
    lineHeight: 24,
    fontWeight: Typography.weights.regular,
  },
  newEntryButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    left: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newEntryButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl * 1.5,
    borderTopRightRadius: BorderRadius.xl * 1.5,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xxl : Spacing.xl,
    minHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
    fontWeight: Typography.weights.regular,
  },
  promptText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.lg,
    fontStyle: 'italic',
  },
  textInput: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    fontSize: Typography.sizes.md,
    minHeight: 200,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  modalActions: {
    gap: Spacing.md,
  },
  saveButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  cancelButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
  },
});
