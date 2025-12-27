import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { getPlantColors } from './plantColors';
import { ColorScheme } from '@/constants/theme';

interface GrowingPlantStageProps {
  colorScheme: ColorScheme;
}

export const GrowingPlantStage: React.FC<GrowingPlantStageProps> = ({ colorScheme }) => {
  const colors = getPlantColors(colorScheme);

  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Soil base */}
      <Path
        d="M 20 145 Q 100 135 180 145 L 180 180 L 20 180 Z"
        fill={colors.soilLight}
      />

      {/* Darker soil layer */}
      <Path
        d="M 20 155 Q 100 150 180 155 L 180 180 L 20 180 Z"
        fill={colors.soilDark}
      />

      {/* Main stem - thicker and taller */}
      <Path
        d="M 100 145 Q 98 90 100 50"
        stroke={colors.stem}
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Bottom layer leaves - left */}
      <Ellipse
        cx={70}
        cy={125}
        rx={18}
        ry={24}
        fill={colors.leafPrimary}
        transform="rotate(-45 70 125)"
      />
      <Path
        d="M 70 125 Q 65 118 60 112"
        stroke={colors.stem}
        strokeWidth={2}
        fill="none"
        opacity={0.5}
      />

      {/* Bottom layer leaves - right */}
      <Ellipse
        cx={130}
        cy={125}
        rx={18}
        ry={24}
        fill={colors.leafSecondary}
        transform="rotate(45 130 125)"
      />
      <Path
        d="M 130 125 Q 135 118 140 112"
        stroke={colors.stem}
        strokeWidth={2}
        fill="none"
        opacity={0.5}
      />

      {/* Middle layer leaves - left */}
      <Ellipse
        cx={75}
        cy={95}
        rx={16}
        ry={22}
        fill={colors.leafTertiary}
        transform="rotate(-40 75 95)"
      />

      {/* Middle layer leaves - right */}
      <Ellipse
        cx={125}
        cy={95}
        rx={16}
        ry={22}
        fill={colors.leafPrimary}
        transform="rotate(40 125 95)"
      />

      {/* Upper leaves - left */}
      <Ellipse
        cx={82}
        cy={70}
        rx={14}
        ry={20}
        fill={colors.leafSecondary}
        transform="rotate(-35 82 70)"
      />

      {/* Upper leaves - right */}
      <Ellipse
        cx={118}
        cy={70}
        rx={14}
        ry={20}
        fill={colors.leafTertiary}
        transform="rotate(35 118 70)"
      />

      {/* Top leaves - left */}
      <Ellipse
        cx={90}
        cy={50}
        rx={11}
        ry={16}
        fill={colors.leafPrimary}
        transform="rotate(-25 90 50)"
      />

      {/* Top leaves - right */}
      <Ellipse
        cx={110}
        cy={50}
        rx={11}
        ry={16}
        fill={colors.leafSecondary}
        transform="rotate(25 110 50)"
      />

      {/* Center top leaf */}
      <Ellipse
        cx={100}
        cy={42}
        rx={9}
        ry={14}
        fill={colors.leafTertiary}
      />

      {/* Small pebbles and grass details */}
      <Circle cx={55} cy={165} r={3} fill={colors.pebble} opacity={0.5} />
      <Circle cx={145} cy={168} r={2.5} fill={colors.pebble} opacity={0.5} />
      <Path
        d="M 40 155 Q 42 150 40 145"
        stroke={colors.leafPrimary}
        strokeWidth={1.5}
        fill="none"
        opacity={0.3}
      />
      <Path
        d="M 160 155 Q 158 148 160 142"
        stroke={colors.leafSecondary}
        strokeWidth={1.5}
        fill="none"
        opacity={0.3}
      />
    </Svg>
  );
};
