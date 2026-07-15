import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ImageSourcePropType, View } from 'react-native';
import { colors } from '../../constants/theme';
import { useBreatheScale } from '../../hooks/useBreatheScale';
import { useReduceMotion } from '../../hooks/useReduceMotion';

/**
 * Replaceable placeholder for Vera. Swap `source` for the real render/video
 * frame/Lottie/3D-exported clip per state once assets exist — the rest of the
 * app should keep working unchanged (see data/prompt-claude.txt section 4).
 */
export type VeraState =
  | 'idle'
  | 'greeting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'guiding'
  | 'celebrating'
  | 'concerned'
  | 'unavailable';

type Props = {
  state?: VeraState;
  size?: number;
  /** Corner rounding as a percentage of size, matching the prototype's "organic squircle" (26-30%). */
  radiusPct?: number;
  source?: ImageSourcePropType;
};

const placeholderSource = require('../../assets/nav/nav-vera.png');

const ringColorByState: Record<VeraState, string> = {
  idle: colors.primaryBorder,
  greeting: colors.primaryBorder,
  listening: colors.primary,
  thinking: colors.primary,
  speaking: colors.primary,
  guiding: colors.primary,
  celebrating: colors.primary,
  concerned: colors.warning,
  unavailable: colors.border,
};

const motionByState: Record<VeraState, 'breathe' | 'pulse' | 'none'> = {
  idle: 'breathe',
  greeting: 'breathe',
  guiding: 'breathe',
  celebrating: 'breathe',
  listening: 'pulse',
  thinking: 'pulse',
  speaking: 'pulse',
  concerned: 'none',
  unavailable: 'none',
};

export function VeraAvatar({ state = 'idle', size = 64, radiusPct = 28, source }: Props) {
  const reduceMotion = useReduceMotion();
  const motion = reduceMotion ? 'none' : motionByState[state];
  const breathe = useBreatheScale(motion === 'breathe', 1700);
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    pulseScale.stopAnimation();
    pulseOpacity.stopAnimation();
    pulseScale.setValue(1);
    pulseOpacity.setValue(0.35);
    if (motion !== 'pulse') return;
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale, { toValue: 1.35, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 0, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [motion, pulseScale, pulseOpacity]);

  const borderRadius = size * (radiusPct / 100);
  const ringColor = ringColorByState[state];
  const imageOpacity = state === 'unavailable' ? 0.55 : 1;

  return (
    <View style={{ width: size, height: size }} accessibilityRole="image" accessibilityLabel={`Vera — ${state}`}>
      {motion === 'pulse' ? (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            borderWidth: 2,
            borderColor: ringColor,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
        />
      ) : null}
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: ringColor,
          transform: [{ scale: breathe }],
        }}
      >
        <Image
          source={source ?? placeholderSource}
          style={{ width: '100%', height: '100%', opacity: imageOpacity }}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
}
