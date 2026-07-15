import { useEffect, useRef } from 'react';
import { Animated, DimensionValue, Easing } from 'react-native';

type Props = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  className?: string;
};

/** Pulsing placeholder block used while content loads. */
export function LoadingSkeleton({ width = '100%', height = 16, radius = 8, className }: Props) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={['bg-border', className ?? ''].join(' ')}
      style={{ width, height, borderRadius: radius, opacity }}
    />
  );
}
