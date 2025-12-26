import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  SOBRIETY_DATE: '@sobriety_tracker:sobriety_date',
  URGE_LOGS: '@sobriety_tracker:urge_logs',
  JOURNAL_ENTRIES: '@sobriety_tracker:journal_entries',
  EMERGENCY_CONTACT: '@sobriety_tracker:emergency_contact',
} as const;

// TypeScript types
export interface UrgeLog {
  id: string;
  timestamp: string;
  intensity: number;
  note?: string;
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  entry: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

/**
 * Save the sobriety start date to storage
 * @param date The sobriety start date
 */
export async function saveSobrietyDate(date: Date): Promise<void> {
  try {
    const isoString = date.toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.SOBRIETY_DATE, isoString);
  } catch (error) {
    console.error('Error saving sobriety date:', error);
    throw new Error('Failed to save sobriety date');
  }
}

/**
 * Get the sobriety start date from storage
 * @returns The sobriety start date or null if not set
 */
export async function getSobrietyDate(): Promise<Date | null> {
  try {
    const dateString = await AsyncStorage.getItem(STORAGE_KEYS.SOBRIETY_DATE);
    if (!dateString) {
      return null;
    }
    return new Date(dateString);
  } catch (error) {
    console.error('Error getting sobriety date:', error);
    throw new Error('Failed to retrieve sobriety date');
  }
}

/**
 * Reset the sobriety date (remove from storage)
 */
export async function resetSobrietyDate(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SOBRIETY_DATE);
  } catch (error) {
    console.error('Error resetting sobriety date:', error);
    throw new Error('Failed to reset sobriety date');
  }
}

/**
 * Save a new urge log entry
 * @param intensity The intensity level (typically 1-10)
 * @param note Optional note about the urge
 */
export async function saveUrgeLog(
  intensity: number,
  note?: string
): Promise<void> {
  try {
    // Validate intensity
    if (intensity < 1 || intensity > 10) {
      throw new Error('Intensity must be between 1 and 10');
    }

    // Get existing logs
    const existingLogs = await getUrgeLogs();

    // Create new log entry
    const newLog: UrgeLog = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      intensity,
      note,
    };

    // Add to beginning of array (most recent first)
    const updatedLogs = [newLog, ...existingLogs];

    // Save back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.URGE_LOGS,
      JSON.stringify(updatedLogs)
    );
  } catch (error) {
    console.error('Error saving urge log:', error);
    throw new Error('Failed to save urge log');
  }
}

/**
 * Get all urge logs from storage
 * @returns Array of urge logs, sorted by most recent first
 */
export async function getUrgeLogs(): Promise<UrgeLog[]> {
  try {
    const logsString = await AsyncStorage.getItem(STORAGE_KEYS.URGE_LOGS);
    if (!logsString) {
      return [];
    }
    const logs = JSON.parse(logsString);
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error('Error getting urge logs:', error);
    throw new Error('Failed to retrieve urge logs');
  }
}

/**
 * Save a new journal entry
 * @param entry The journal entry text
 */
export async function saveJournalEntry(entry: string): Promise<void> {
  try {
    if (!entry || entry.trim().length === 0) {
      throw new Error('Journal entry cannot be empty');
    }

    // Get existing entries
    const existingEntries = await getJournalEntries();

    // Create new journal entry
    const newEntry: JournalEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      entry: entry.trim(),
    };

    // Add to beginning of array (most recent first)
    const updatedEntries = [newEntry, ...existingEntries];

    // Save back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.JOURNAL_ENTRIES,
      JSON.stringify(updatedEntries)
    );
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw new Error('Failed to save journal entry');
  }
}

/**
 * Get all journal entries from storage
 * @returns Array of journal entries, sorted by most recent first
 */
export async function getJournalEntries(): Promise<JournalEntry[]> {
  try {
    const entriesString = await AsyncStorage.getItem(
      STORAGE_KEYS.JOURNAL_ENTRIES
    );
    if (!entriesString) {
      return [];
    }
    const entries = JSON.parse(entriesString);
    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    console.error('Error getting journal entries:', error);
    throw new Error('Failed to retrieve journal entries');
  }
}

/**
 * Delete a journal entry by ID
 * @param id The ID of the journal entry to delete
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  try {
    // Get existing entries
    const existingEntries = await getJournalEntries();

    // Filter out the entry with the given ID
    const updatedEntries = existingEntries.filter((entry) => entry.id !== id);

    // Save back to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.JOURNAL_ENTRIES,
      JSON.stringify(updatedEntries)
    );
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw new Error('Failed to delete journal entry');
  }
}

/**
 * Generate a unique ID for entries
 * @returns A unique string ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save emergency contact information
 * @param contact The emergency contact with name and phone
 */
export async function saveEmergencyContact(
  contact: EmergencyContact
): Promise<void> {
  try {
    if (!contact.name || contact.name.trim().length === 0) {
      throw new Error('Contact name cannot be empty');
    }
    if (!contact.phone || contact.phone.trim().length === 0) {
      throw new Error('Contact phone cannot be empty');
    }

    const contactData = {
      name: contact.name.trim(),
      phone: contact.phone.trim(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.EMERGENCY_CONTACT,
      JSON.stringify(contactData)
    );
  } catch (error) {
    console.error('Error saving emergency contact:', error);
    throw new Error('Failed to save emergency contact');
  }
}

/**
 * Get the emergency contact from storage
 * @returns The emergency contact or null if not set
 */
export async function getEmergencyContact(): Promise<EmergencyContact | null> {
  try {
    const contactString = await AsyncStorage.getItem(
      STORAGE_KEYS.EMERGENCY_CONTACT
    );
    if (!contactString) {
      return null;
    }
    return JSON.parse(contactString);
  } catch (error) {
    console.error('Error getting emergency contact:', error);
    throw new Error('Failed to retrieve emergency contact');
  }
}

/**
 * Remove the emergency contact from storage
 */
export async function clearEmergencyContact(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.EMERGENCY_CONTACT);
  } catch (error) {
    console.error('Error clearing emergency contact:', error);
    throw new Error('Failed to clear emergency contact');
  }
}
