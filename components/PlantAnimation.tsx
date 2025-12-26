import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { SeedStage } from './PlantAnimation/SeedStage';
import { SproutStage } from './PlantAnimation/SproutStage';
import { YoungPlantStage } from './PlantAnimation/YoungPlantStage';
import { GrowingPlantStage } from './PlantAnimation/GrowingPlantStage';
import { FloweringPlantStage } from './PlantAnimation/FloweringPlantStage';
import { TreeStage } from './PlantAnimation/TreeStage';

interface PlantAnimationProps {
  daysClean: number;
}

const MILESTONE_DAYS = [7, 14, 30, 90];

export const PlantAnimation: React.FC<PlantAnimationProps> = ({ daysClean }) => {
  // Breathing animation scale value
  const breatheScale = useSharedValue(1);

  // Glow animation opacity value
  const glowOpacity = useSharedValue(0);

  // Determine current plant stage based on days
  const currentStage = useMemo(() => {
    if (daysClean <= 1) return 'seed';
    if (daysClean <= 6) return 'sprout';
    if (daysClean <= 13) return 'young';
    if (daysClean <= 29) return 'growing';
    if (daysClean <= 89) return 'flowering';
    return 'tree';
  }, [daysClean]);

  // Check if current day is a milestone
  const isMilestone = useMemo(() => {
    return MILESTONE_DAYS.includes(daysClean);
  }, [daysClean]);

  // Render the appropriate plant component
  const PlantComponent = useMemo(() => {
    switch (currentStage) {
      case 'seed':
        return SeedStage;
      case 'sprout':
        return SproutStage;
      case 'young':
        return YoungPlantStage;
      case 'growing':
        return GrowingPlantStage;
      case 'flowering':
        return FloweringPlantStage;
      case 'tree':
        return TreeStage;
      default:
        return SeedStage;
    }
  }, [currentStage]);

  // Start breathing animation on mount
  useEffect(() => {
    breatheScale.value = withRepeat(
      withSequence(
        withTiming(1.03, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1, // Repeat infinitely
      false
    );
  }, []);

  // Trigger glow animation for milestones
  useEffect(() => {
    if (isMilestone) {
      glowOpacity.value = withSequence(
        withTiming(0.8, { duration: 500 }),
        withRepeat(
          withSequence(
            withTiming(0.4, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          false
        )
      );
    } else {
      glowOpacity.value = withTiming(0, { duration: 500 });
    }
  }, [isMilestone]);

  // Animated style for breathing effect
  const breatheStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: breatheScale.value }],
    };
  });

  // Animated style for glow effect
  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Milestone glow effect - outer glow */}
      <Animated.View style={[styles.glowOuter, glowStyle]} />

      {/* Milestone glow effect - middle glow */}
      <Animated.View style={[styles.glowMiddle, glowStyle]} />

      {/* Milestone glow effect - inner glow */}
      <Animated.View style={[styles.glowInner, glowStyle]} />

      {/* Plant with breathing animation and fade transitions */}
      <Animated.View
        key={currentStage}
        entering={FadeIn.duration(800).easing(Easing.inOut(Easing.ease))}
        exiting={FadeOut.duration(600).easing(Easing.inOut(Easing.ease))}
        style={breatheStyle}
      >
        <PlantComponent />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#9BC4BC',
    opacity: 0,
    shadowColor: '#9BC4BC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 10,
  },
  glowMiddle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#A8C5A6',
    opacity: 0,
    shadowColor: '#A8C5A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 8,
  },
  glowInner: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#7C9885',
    opacity: 0,
    shadowColor: '#7C9885',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 6,
  },
});
