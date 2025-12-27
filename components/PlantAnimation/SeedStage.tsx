import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { getPlantColors } from './plantColors';
import { ColorScheme } from '@/constants/theme';

interface SeedStageProps {
  colorScheme: ColorScheme;
}

export const SeedStage: React.FC<SeedStageProps> = ({ colorScheme }) => {
  const colors = getPlantColors(colorScheme);

  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Soil base */}
      <Path
        d="M 20 120 Q 100 110 180 120 L 180 180 L 20 180 Z"
        fill={colors.soilLight}
      />

      {/* Darker soil layer */}
      <Path
        d="M 20 130 Q 100 125 180 130 L 180 180 L 20 180 Z"
        fill={colors.soilDark}
      />

      {/* Seed - main body */}
      <Ellipse
        cx={100}
        cy={140}
        rx={12}
        ry={15}
        fill={colors.seed}
      />

      {/* Seed - highlight */}
      <Ellipse
        cx={105}
        cy={138}
        rx={3}
        ry={4}
        fill={colors.seedHighlight}
        opacity={0.6}
      />

      {/* Small pebbles for detail */}
      <Circle cx={60} cy={155} r={3} fill={colors.pebble} opacity={0.5} />
      <Circle cx={140} cy={160} r={2.5} fill={colors.pebble} opacity={0.5} />
      <Circle cx={75} cy={170} r={2} fill={colors.soilLight} opacity={0.6} />
    </Svg>
  );
};
