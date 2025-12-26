import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export const TreeStage: React.FC = () => {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Soil/ground */}
      <Path
        d="M 20 150 Q 100 145 180 150 L 180 180 L 20 180 Z"
        fill="#D4A574"
      />
      <Path
        d="M 20 160 Q 100 155 180 160 L 180 180 L 20 180 Z"
        fill="#C19A6B"
      />

      {/* Tree trunk - wider and textured */}
      <Path
        d="M 90 150 Q 88 100 90 60 Q 92 40 95 25 L 105 25 Q 108 40 110 60 Q 112 100 110 150 Z"
        fill="#C19A6B"
      />

      {/* Trunk texture lines */}
      <Path d="M 93 120 Q 95 115 97 120" stroke="#D4A574" strokeWidth={1} fill="none" opacity={0.5} />
      <Path d="M 103 100 Q 105 95 107 100" stroke="#D4A574" strokeWidth={1} fill="none" opacity={0.5} />
      <Path d="M 92 80 Q 94 75 96 80" stroke="#D4A574" strokeWidth={1} fill="none" opacity={0.5} />

      {/* Lower left branch */}
      <Path
        d="M 92 90 Q 70 85 55 80"
        stroke="#C19A6B"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {/* Lower right branch */}
      <Path
        d="M 108 90 Q 130 85 145 80"
        stroke="#C19A6B"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />

      {/* Upper left branch */}
      <Path
        d="M 94 60 Q 75 55 60 52"
        stroke="#C19A6B"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Upper right branch */}
      <Path
        d="M 106 60 Q 125 55 140 52"
        stroke="#C19A6B"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Canopy - layered circles for fullness */}
      <Circle cx={100} cy={35} r={25} fill="#9BC4BC" opacity={0.8} />
      <Circle cx={80} cy={50} r={22} fill="#7C9885" opacity={0.8} />
      <Circle cx={120} cy={50} r={22} fill="#A8C5A6" opacity={0.8} />
      <Circle cx={65} cy={70} r={18} fill="#9BC4BC" opacity={0.7} />
      <Circle cx={135} cy={70} r={18} fill="#7C9885" opacity={0.7} />
      <Circle cx={100} cy={55} r={20} fill="#A8C5A6" opacity={0.9} />

      {/* Smaller foliage clusters */}
      <Circle cx={55} cy={82} r={12} fill="#9BC4BC" opacity={0.7} />
      <Circle cx={145} cy={82} r={12} fill="#A8C5A6" opacity={0.7} />

      {/* Bird on left - simple V shape */}
      <Path
        d="M 25 35 Q 28 38 31 35"
        stroke="#7C9885"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Bird on right - simple V shape */}
      <Path
        d="M 165 45 Q 168 48 171 45"
        stroke="#7C9885"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Bird in tree - resting */}
      <Ellipse cx={115} cy={48} rx={4} ry={3} fill="#C19A6B" />
      <Path
        d="M 111 48 L 113 46"
        stroke="#C19A6B"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Grass and ground details */}
      <Path
        d="M 30 160 Q 32 152 30 145"
        stroke="#9BC4BC"
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />
      <Path
        d="M 42 160 Q 44 154 42 148"
        stroke="#A8C5A6"
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />
      <Path
        d="M 158 160 Q 156 153 158 147"
        stroke="#7C9885"
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />
      <Path
        d="M 170 160 Q 168 154 170 149"
        stroke="#9BC4BC"
        strokeWidth={2}
        fill="none"
        opacity={0.4}
      />

      <Circle cx={45} cy={170} r={3} fill="#C19A6B" opacity={0.5} />
      <Circle cx={155} cy={172} r={2.5} fill="#C19A6B" opacity={0.5} />
    </Svg>
  );
};
