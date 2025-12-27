import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { getPlantColors } from './plantColors';
import { ColorScheme } from '@/constants/theme';

interface YoungPlantStageProps {
  colorScheme: ColorScheme;
}

export const YoungPlantStage: React.FC<YoungPlantStageProps> = ({ colorScheme }) => {
  const colors = getPlantColors(colorScheme);

  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Soil base */}
      <Path
        d="M 20 140 Q 100 130 180 140 L 180 180 L 20 180 Z"
        fill={colors.soilLight}
      />

      {/* Darker soil layer */}
      <Path
        d="M 20 150 Q 100 145 180 150 L 180 180 L 20 180 Z"
        fill={colors.soilDark}
      />

      {/* Main stem */}
      <Path
        d="M 100 140 Q 98 100 100 70"
        stroke={colors.stem}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />

      {/* Bottom left leaf */}
      <Ellipse
        cx={80}
        cy={115}
        rx={15}
        ry={20}
        fill={colors.leafPrimary}
        transform="rotate(-40 80 115)"
      />
      <Path
        d="M 80 115 Q 75 110 72 105"
        stroke={colors.stem}
        strokeWidth={1.5}
        fill="none"
        opacity={0.6}
      />

      {/* Bottom right leaf */}
      <Ellipse
        cx={120}
        cy={115}
        rx={15}
        ry={20}
        fill={colors.leafSecondary}
        transform="rotate(40 120 115)"
      />
      <Path
        d="M 120 115 Q 125 110 128 105"
        stroke={colors.stem}
        strokeWidth={1.5}
        fill="none"
        opacity={0.6}
      />

      {/* Top left leaf */}
      <Ellipse
        cx={85}
        cy={85}
        rx={12}
        ry={18}
        fill={colors.leafTertiary}
        transform="rotate(-35 85 85)"
      />

      {/* Top right leaf */}
      <Ellipse
        cx={115}
        cy={85}
        rx={12}
        ry={18}
        fill={colors.leafPrimary}
        transform="rotate(35 115 85)"
      />

      {/* Center top leaf */}
      <Ellipse
        cx={100}
        cy={65}
        rx={10}
        ry={15}
        fill={colors.leafSecondary}
        transform="rotate(-5 100 65)"
      />

      {/* Small pebbles */}
      <Circle cx={60} cy={160} r={3} fill={colors.pebble} opacity={0.5} />
      <Circle cx={140} cy={165} r={2.5} fill={colors.pebble} opacity={0.5} />
    </Svg>
  );
};
