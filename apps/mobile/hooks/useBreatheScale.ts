import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/** Shared "breathe" loop (scale 1 -> 1.06 -> 1) used by the logo, VeraAvatar, etc. */
export function useBreatheScale(active: boolean, duration = 1700) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    scale.stopAnimation();
    scale.setValue(1);
    if (!active) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, duration, scale]);

  return scale;
}
