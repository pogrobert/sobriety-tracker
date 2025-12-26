import React from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

export const FloweringPlantStage: React.FC = () => {
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

      {/* Main stem */}
      <Path
        d="M 100 145 Q 98 85 100 40"
        stroke="#7C9885"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Bottom leaves - left */}
      <Ellipse
        cx={68}
        cy={125}
        rx={18}
        ry={24}
        fill="#9BC4BC"
        transform="rotate(-45 68 125)"
      />

      {/* Bottom leaves - right */}
      <Ellipse
        cx={132}
        cy={125}
        rx={18}
        ry={24}
        fill="#A8C5A6"
        transform="rotate(45 132 125)"
      />

      {/* Middle leaves - left */}
      <Ellipse
        cx={72}
        cy={95}
        rx={16}
        ry={22}
        fill="#7C9885"
        transform="rotate(-40 72 95)"
      />

      {/* Middle leaves - right */}
      <Ellipse
        cx={128}
        cy={95}
        rx={16}
        ry={22}
        fill="#9BC4BC"
        transform="rotate(40 128 95)"
      />

      {/* Upper leaves - left */}
      <Ellipse
        cx={80}
        cy={70}
        rx={14}
        ry={20}
        fill="#A8C5A6"
        transform="rotate(-35 80 70)"
      />

      {/* Upper leaves - right */}
      <Ellipse
        cx={120}
        cy={70}
        rx={14}
        ry={20}
        fill="#7C9885"
        transform="rotate(35 120 70)"
      />

      {/* Flower stem - left */}
      <Path
        d="M 95 60 Q 75 50 65 35"
        stroke="#7C9885"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Flower petals - left flower */}
      <Circle cx={60} cy={30} r={5} fill="#E8DCC4" />
      <Circle cx={70} cy={30} r={5} fill="#E8DCC4" />
      <Circle cx={60} cy={40} r={5} fill="#E8DCC4" />
      <Circle cx={70} cy={40} r={5} fill="#E8DCC4" />
      <Circle cx={65} cy={35} r={6} fill="#D4A574" />

      {/* Flower stem - center */}
      <Path
        d="M 100 55 Q 100 42 100 28"
        stroke="#7C9885"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Flower petals - center flower */}
      <Circle cx={95} cy={23} r={5} fill="#E8DCC4" />
      <Circle cx={105} cy={23} r={5} fill="#E8DCC4" />
      <Circle cx={95} cy={33} r={5} fill="#E8DCC4" />
      <Circle cx={105} cy={33} r={5} fill="#E8DCC4" />
      <Circle cx={100} cy={28} r={6} fill="#D4A574" />

      {/* Flower stem - right */}
      <Path
        d="M 105 60 Q 125 50 135 38"
        stroke="#7C9885"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Flower petals - right flower */}
      <Circle cx={130} cy={33} r={5} fill="#E8DCC4" />
      <Circle cx={140} cy={33} r={5} fill="#E8DCC4" />
      <Circle cx={130} cy={43} r={5} fill="#E8DCC4" />
      <Circle cx={140} cy={43} r={5} fill="#E8DCC4" />
      <Circle cx={135} cy={38} r={6} fill="#D4A574" />

      {/* Small grass details */}
      <Path
        d="M 35 155 Q 37 148 35 142"
        stroke="#9BC4BC"
        strokeWidth={1.5}
        fill="none"
        opacity={0.4}
      />
      <Path
        d="M 165 155 Q 163 147 165 140"
        stroke="#A8C5A6"
        strokeWidth={1.5}
        fill="none"
        opacity={0.4}
      />
      <Circle cx={50} cy={168} r={2.5} fill="#C19A6B" opacity={0.5} />
      <Circle cx={150} cy={170} r={3} fill="#C19A6B" opacity={0.5} />
    </Svg>
  );
};
