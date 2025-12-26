import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export const GrowingPlantStage: React.FC = () => {
  return (
    <Svg width={200} height={200} viewBox="0 0 200 200">
      {/* Soil base */}
      <Path
        d="M 20 145 Q 100 135 180 145 L 180 180 L 20 180 Z"
        fill="#D4A574"
      />

      {/* Darker soil layer */}
      <Path
        d="M 20 155 Q 100 150 180 155 L 180 180 L 20 180 Z"
        fill="#C19A6B"
      />

      {/* Main stem - thicker and taller */}
      <Path
        d="M 100 145 Q 98 90 100 50"
        stroke="#7C9885"
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
        fill="#9BC4BC"
        transform="rotate(-45 70 125)"
      />
      <Path
        d="M 70 125 Q 65 118 60 112"
        stroke="#7C9885"
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
        fill="#A8C5A6"
        transform="rotate(45 130 125)"
      />
      <Path
        d="M 130 125 Q 135 118 140 112"
        stroke="#7C9885"
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
        fill="#7C9885"
        transform="rotate(-40 75 95)"
      />

      {/* Middle layer leaves - right */}
      <Ellipse
        cx={125}
        cy={95}
        rx={16}
        ry={22}
        fill="#9BC4BC"
        transform="rotate(40 125 95)"
      />

      {/* Upper leaves - left */}
      <Ellipse
        cx={82}
        cy={70}
        rx={14}
        ry={20}
        fill="#A8C5A6"
        transform="rotate(-35 82 70)"
      />

      {/* Upper leaves - right */}
      <Ellipse
        cx={118}
        cy={70}
        rx={14}
        ry={20}
        fill="#7C9885"
        transform="rotate(35 118 70)"
      />

      {/* Top leaves - left */}
      <Ellipse
        cx={90}
        cy={50}
        rx={11}
        ry={16}
        fill="#9BC4BC"
        transform="rotate(-25 90 50)"
      />

      {/* Top leaves - right */}
      <Ellipse
        cx={110}
        cy={50}
        rx={11}
        ry={16}
        fill="#A8C5A6"
        transform="rotate(25 110 50)"
      />

      {/* Center top leaf */}
      <Ellipse
        cx={100}
        cy={42}
        rx={9}
        ry={14}
        fill="#7C9885"
      />

      {/* Small pebbles and grass details */}
      <Circle cx={55} cy={165} r={3} fill="#C19A6B" opacity={0.5} />
      <Circle cx={145} cy={168} r={2.5} fill="#C19A6B" opacity={0.5} />
      <Path
        d="M 40 155 Q 42 150 40 145"
        stroke="#9BC4BC"
        strokeWidth={1.5}
        fill="none"
        opacity={0.3}
      />
      <Path
        d="M 160 155 Q 158 148 160 142"
        stroke="#A8C5A6"
        strokeWidth={1.5}
        fill="none"
        opacity={0.3}
      />
    </Svg>
  );
};
