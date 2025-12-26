import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export const SproutStage: React.FC = () => {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Soil base */}
      <Path
        d="M 20 130 Q 100 120 180 130 L 180 180 L 20 180 Z"
        fill="#D4A574"
      />

      {/* Darker soil layer */}
      <Path
        d="M 20 140 Q 100 135 180 140 L 180 180 L 20 180 Z"
        fill="#C19A6B"
      />

      {/* Small sprout stem */}
      <Path
        d="M 100 130 Q 98 110 100 95"
        stroke="#7C9885"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {/* First small leaf - left */}
      <Ellipse
        cx={92}
        cy={105}
        rx={8}
        ry={12}
        fill="#9BC4BC"
        transform="rotate(-30 92 105)"
      />

      {/* First small leaf - right */}
      <Ellipse
        cx={108}
        cy={105}
        rx={8}
        ry={12}
        fill="#A8C5A6"
        transform="rotate(30 108 105)"
      />

      {/* Seed shell remnants */}
      <Path
        d="M 95 128 Q 92 130 90 132"
        stroke="#C19A6B"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M 105 128 Q 108 130 110 132"
        stroke="#C19A6B"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Small pebbles */}
      <Circle cx={65} cy={155} r={3} fill="#C19A6B" opacity={0.5} />
      <Circle cx={135} cy={160} r={2.5} fill="#C19A6B" opacity={0.5} />
    </Svg>
  );
};
