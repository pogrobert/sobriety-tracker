import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Rect, Ellipse } from 'react-native-svg';
import { getShownMilestones, markMilestoneAsShown } from '../utils/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

// Milestone definitions
const MILESTONES = [
  { days: 1, title: 'First Day!', message: 'You took the first step. Every journey begins here.' },
  { days: 3, title: 'Three Days Strong!', message: 'You\'re building momentum. Keep going!' },
  { days: 7, title: 'One Week!', message: 'A full week of growth. You\'re amazing!' },
  { days: 14, title: 'Two Weeks!', message: 'You\'re proving your strength every day.' },
  { days: 30, title: 'One Month!', message: 'A whole month of dedication. You\'re incredible!' },
  { days: 60, title: 'Two Months!', message: 'Look how far you\'ve come. Keep flourishing!' },
  { days: 90, title: 'Three Months!', message: 'You\'ve built something truly special here.' },
  { days: 180, title: 'Six Months!', message: 'Half a year of growth and strength. Extraordinary!' },
  { days: 365, title: 'One Year!', message: 'A full year of transformation. You\'re a champion!' },
];

interface MilestoneCelebrationProps {
  daysClean: number;
  onCelebrationShown?: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  daysClean,
  onCelebrationShown,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [visible, setVisible] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const [shownMilestones, setShownMilestones] = useState<number[]>([]);

  // Animation values for confetti particles
  const confettiOpacity = useSharedValue(0);

  useEffect(() => {
    checkForMilestone();
  }, [daysClean]);

  const checkForMilestone = async () => {
    try {
      // Load shown milestones
      const shown = await getShownMilestones();
      setShownMilestones(shown);

      // Find current milestone
      const milestone = MILESTONES.find((m) => m.days === daysClean);

      if (milestone && !shown.includes(milestone.days)) {
        // Show celebration
        setCurrentMilestone(milestone);
        setVisible(true);

        // Mark as shown
        await markMilestoneAsShown(milestone.days);
        setShownMilestones([...shown, milestone.days]);

        // Trigger haptic feedback
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Start confetti animation
        confettiOpacity.value = withSequence(
          withTiming(1, { duration: 300 }),
          withDelay(2000, withTiming(0, { duration: 1000 }))
        );

        // Call callback
        onCelebrationShown?.();
      }
    } catch (error) {
      console.error('Error checking milestone:', error);
    }
  };

  const handleDismiss = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisible(false);
  };

  const confettiAnimatedStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));

  const getMilestoneIllustration = () => {
    if (!currentMilestone) return null;

    const { days } = currentMilestone;

    // Different illustrations based on milestone
    if (days === 1) {
      return <SeedIllustration />;
    } else if (days === 3) {
      return <SproutIllustration />;
    } else if (days === 7) {
      return <YoungPlantIllustration />;
    } else if (days === 14) {
      return <GrowingPlantIllustration />;
    } else if (days === 30) {
      return <FloweringPlantIllustration />;
    } else if (days === 60) {
      return <BuddingTreeIllustration />;
    } else if (days === 90) {
      return <TreeIllustration />;
    } else if (days === 180) {
      return <MatureTreeIllustration />;
    } else if (days === 365) {
      return <FullTreeIllustration />;
    }

    return <FloweringPlantIllustration />;
  };

  if (!visible || !currentMilestone) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        {/* Confetti particles */}
        <Animated.View style={[styles.confettiContainer, confettiAnimatedStyle]}>
          {Array.from({ length: 30 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 50} />
          ))}
        </Animated.View>

        {/* Main celebration card */}
        <Animated.View
          entering={ZoomIn.duration(500).easing(Easing.out(Easing.cubic))}
          style={[styles.celebrationCard, { backgroundColor: colors.card }]}
        >
          {/* Plant illustration */}
          <View style={styles.illustrationContainer}>
            {getMilestoneIllustration()}
          </View>

          {/* Title */}
          <Animated.Text
            entering={FadeIn.delay(300)}
            style={[styles.title, { color: colors.primary }]}
          >
            {currentMilestone.title}
          </Animated.Text>

          {/* Message */}
          <Animated.Text
            entering={FadeIn.delay(500)}
            style={[styles.message, { color: colors.textSecondary }]}
          >
            {currentMilestone.message}
          </Animated.Text>

          {/* Dismiss button */}
          <Animated.View entering={FadeIn.delay(700)}>
            <TouchableOpacity
              style={[styles.dismissButton, { backgroundColor: colors.primary }]}
              onPress={handleDismiss}
              activeOpacity={0.8}
            >
              <Text style={[styles.dismissButtonText, { color: colors.textOnPrimary }]}>Keep Growing 🌱</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Confetti particle component
const ConfettiParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const randomX = Math.random() * width - width / 2;
    const randomRotation = Math.random() * 720 - 360;
    const duration = 2000 + Math.random() * 1000;

    translateY.value = withDelay(
      delay,
      withTiming(height, { duration, easing: Easing.inOut(Easing.quad) })
    );
    translateX.value = withDelay(
      delay,
      withTiming(randomX, { duration, easing: Easing.inOut(Easing.sin) })
    );
    rotation.value = withDelay(
      delay,
      withRepeat(withTiming(randomRotation, { duration }), -1, false)
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(0.8, { duration: 500 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` as string },
      { scale: scale.value },
    ] as any,
  }));

  const colors = ['#9BC4BC', '#7C9885', '#D4A574', '#E8DCC4'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomSize = 6 + Math.random() * 8;
  const randomLeft = Math.random() * width;

  return (
    <Animated.View
      style={[
        styles.confetti,
        animatedStyle,
        {
          backgroundColor: randomColor,
          width: randomSize,
          height: randomSize,
          left: randomLeft,
        },
      ]}
    />
  );
};

// Simple plant illustrations for each milestone
const SeedIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Ellipse cx={60} cy={60} rx={15} ry={18} fill="#7C9885" />
    <Ellipse cx={63} cy={58} rx={4} ry={5} fill="#E8DCC4" opacity={0.6} />
  </Svg>
);

const SproutIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Path d="M 60 70 Q 55 60 55 50 Q 55 45 60 45" stroke="#7C9885" strokeWidth={3} fill="none" />
    <Ellipse cx={55} cy={45} rx={8} ry={12} fill="#7C9885" />
    <Ellipse cx={60} cy={45} rx={8} ry={12} fill="#9BC4BC" />
  </Svg>
);

const YoungPlantIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Path d="M 60 80 L 60 50" stroke="#7C9885" strokeWidth={4} />
    <Ellipse cx={50} cy={55} rx={10} ry={15} fill="#7C9885" />
    <Ellipse cx={70} cy={55} rx={10} ry={15} fill="#9BC4BC" />
    <Ellipse cx={60} cy={45} rx={12} ry={16} fill="#7C9885" />
  </Svg>
);

const GrowingPlantIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Path d="M 60 85 L 60 40" stroke="#7C9885" strokeWidth={5} />
    <Ellipse cx={45} cy={60} rx={12} ry={18} fill="#7C9885" />
    <Ellipse cx={75} cy={60} rx={12} ry={18} fill="#9BC4BC" />
    <Ellipse cx={50} cy={45} rx={10} ry={14} fill="#7C9885" />
    <Ellipse cx={70} cy={45} rx={10} ry={14} fill="#9BC4BC" />
  </Svg>
);

const FloweringPlantIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Path d="M 60 90 L 60 35" stroke="#7C9885" strokeWidth={5} />
    {/* Petals */}
    <Circle cx={60} cy={30} r={8} fill="#D4A574" />
    <Circle cx={50} cy={35} r={8} fill="#D4A574" />
    <Circle cx={70} cy={35} r={8} fill="#D4A574" />
    <Circle cx={55} cy={25} r={8} fill="#D4A574" />
    <Circle cx={65} cy={25} r={8} fill="#D4A574" />
    {/* Center */}
    <Circle cx={60} cy={30} r={6} fill="#9BC4BC" />
    {/* Leaves */}
    <Ellipse cx={45} cy={55} rx={12} ry={18} fill="#7C9885" />
    <Ellipse cx={75} cy={55} rx={12} ry={18} fill="#7C9885" />
  </Svg>
);

const BuddingTreeIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Rect x={55} y={60} width={10} height={35} fill="#7C9885" />
    <Circle cx={60} cy={45} r={25} fill="#7C9885" opacity={0.7} />
    <Circle cx={45} cy={50} r={15} fill="#9BC4BC" opacity={0.6} />
    <Circle cx={75} cy={50} r={15} fill="#9BC4BC" opacity={0.6} />
    <Circle cx={60} cy={35} r={15} fill="#9BC4BC" opacity={0.8} />
  </Svg>
);

const TreeIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Rect x={54} y={55} width={12} height={40} fill="#7C9885" />
    <Circle cx={60} cy={40} r={28} fill="#7C9885" opacity={0.8} />
    <Circle cx={40} cy={45} r={18} fill="#9BC4BC" opacity={0.7} />
    <Circle cx={80} cy={45} r={18} fill="#9BC4BC" opacity={0.7} />
    <Circle cx={60} cy={30} r={20} fill="#9BC4BC" />
  </Svg>
);

const MatureTreeIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Rect x={53} y={50} width={14} height={45} fill="#7C9885" />
    <Circle cx={60} cy={35} r={32} fill="#7C9885" />
    <Circle cx={35} cy={40} r={20} fill="#9BC4BC" opacity={0.8} />
    <Circle cx={85} cy={40} r={20} fill="#9BC4BC" opacity={0.8} />
    <Circle cx={60} cy={25} r={22} fill="#9BC4BC" />
    {/* Flowers on tree */}
    <Circle cx={50} cy={30} r={4} fill="#D4A574" />
    <Circle cx={70} cy={35} r={4} fill="#D4A574" />
    <Circle cx={60} cy={20} r={4} fill="#D4A574" />
  </Svg>
);

const FullTreeIllustration = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    <Circle cx={60} cy={60} r={50} fill="#9BC4BC" opacity={0.2} />
    <Rect x={52} y={45} width={16} height={50} fill="#7C9885" />
    <Circle cx={60} cy={30} r={35} fill="#7C9885" />
    <Circle cx={30} cy={35} r={22} fill="#9BC4BC" />
    <Circle cx={90} cy={35} r={22} fill="#9BC4BC" />
    <Circle cx={60} cy={18} r={25} fill="#9BC4BC" />
    {/* Abundant flowers */}
    <Circle cx={45} cy={25} r={5} fill="#D4A574" />
    <Circle cx={75} cy={30} r={5} fill="#D4A574" />
    <Circle cx={60} cy={15} r={5} fill="#D4A574" />
    <Circle cx={35} cy={35} r={5} fill="#D4A574" />
    <Circle cx={85} cy={35} r={5} fill="#D4A574" />
    {/* Star/sparkle for achievement */}
    <Path d="M 60 5 L 62 10 L 67 10 L 63 13 L 65 18 L 60 15 L 55 18 L 57 13 L 53 10 L 58 10 Z" fill="#D4A574" />
  </Svg>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 4,
    top: 0,
  },
  celebrationCard: {
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    maxWidth: 400,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  dismissButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    shadowColor: '#9BC4BC',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  dismissButtonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
