import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../constants/theme';
import { webAriaProgress } from '../../lib/a11y';

type Props = {
  /** 0–100 */
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

/** Circular progress indicator. The design prototype used a CSS conic-gradient,
 *  which has no React Native equivalent — this renders the same look with SVG. */
export function ProgressRing({ percent, size = 52, strokeWidth = 6, label }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped), min: 0, max: 100 }}
      accessibilityLabel={label}
      {...webAriaProgress(clamped)}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={center} cy={center} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          // Start at 12 o'clock instead of 3 o'clock.
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <Text className="font-bold text-[11px] text-ink">{Math.round(clamped)}%</Text>
    </View>
  );
}
