/**
 * Example usage of MilestoneCelebration component
 *
 * This component automatically detects and celebrates milestones in a user's sobriety journey.
 * It shows a full-screen modal with confetti animations, plant illustrations, and encouraging messages.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { MilestoneCelebration } from './MilestoneCelebration';
import { getSobrietyDate } from '../utils/storage';

export const MilestoneCelebrationExample = () => {
  const [daysClean, setDaysClean] = useState(0);

  useEffect(() => {
    calculateDaysClean();
  }, []);

  const calculateDaysClean = async () => {
    const sobrietyDate = await getSobrietyDate();
    if (sobrietyDate) {
      const now = new Date();
      const diff = now.getTime() - sobrietyDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      setDaysClean(days);
    }
  };

  // For testing purposes - simulate different milestones
  const simulateMilestone = (days: number) => {
    setDaysClean(days);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milestone Celebration Example</Text>
      <Text style={styles.subtitle}>Current Days: {daysClean}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Simulate Day 1" onPress={() => simulateMilestone(1)} />
        <Button title="Simulate Day 3" onPress={() => simulateMilestone(3)} />
        <Button title="Simulate Day 7" onPress={() => simulateMilestone(7)} />
        <Button title="Simulate Day 14" onPress={() => simulateMilestone(14)} />
        <Button title="Simulate Day 30" onPress={() => simulateMilestone(30)} />
        <Button title="Simulate Day 60" onPress={() => simulateMilestone(60)} />
        <Button title="Simulate Day 90" onPress={() => simulateMilestone(90)} />
        <Button title="Simulate Day 180" onPress={() => simulateMilestone(180)} />
        <Button title="Simulate Day 365" onPress={() => simulateMilestone(365)} />
      </View>

      <MilestoneCelebration
        daysClean={daysClean}
        onCelebrationShown={() => console.log('Milestone celebration shown!')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F3EE',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3A3A3A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B6B6B',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
  },
});

/**
 * Integration Example:
 *
 * In your main app screen (e.g., index.tsx):
 *
 * import { MilestoneCelebration } from '@/components/MilestoneCelebration';
 *
 * export default function HomeScreen() {
 *   const [daysClean, setDaysClean] = useState(0);
 *
 *   // Calculate days clean from your sobriety date
 *   useEffect(() => {
 *     const calculateDays = async () => {
 *       const sobrietyDate = await getSobrietyDate();
 *       if (sobrietyDate) {
 *         const now = new Date();
 *         const diff = now.getTime() - sobrietyDate.getTime();
 *         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
 *         setDaysClean(days);
 *       }
 *     };
 *     calculateDays();
 *   }, []);
 *
 *   return (
 *     <View>
 *       // Your screen content
 *
 *       // Add the milestone celebration component
 *       <MilestoneCelebration daysClean={daysClean} />
 *     </View>
 *   );
 * }
 *
 * Features:
 * - Automatically detects milestones: 1, 3, 7, 14, 30, 60, 90, 180, 365 days
 * - Full-screen celebration modal with confetti animations
 * - Different plant illustrations for each milestone
 * - Milestone-specific encouraging messages
 * - Haptic feedback for celebration
 * - Tracks which milestones have been shown (won't repeat)
 * - Uses success color (#9BC4BC) as primary
 * - "Keep Growing" button to dismiss
 *
 * Storage Functions:
 * - getShownMilestones(): Returns array of milestone days that have been shown
 * - markMilestoneAsShown(days): Marks a milestone as shown
 * - resetShownMilestones(): Clears all shown milestones (useful for testing)
 */
