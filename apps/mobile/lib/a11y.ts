import { Platform } from 'react-native';

/**
 * react-native-web (0.21) doesn't reliably map RN's `accessibilityState` /
 * `accessibilityValue` onto the corresponding ARIA attributes, so screen
 * readers on web miss checked/progress values. These helpers spread the raw
 * ARIA props on web only; native keeps using the RN props and never sees an
 * unknown prop.
 *
 * Always pass the RN prop too — these are a web supplement, not a replacement.
 */

/** `aria-checked` for checkbox/radio roles. */
export function webAriaChecked(checked: boolean): Record<string, unknown> {
  return Platform.OS === 'web' ? { 'aria-checked': checked } : {};
}

/** `aria-valuenow/min/max` for the progressbar role. */
export function webAriaProgress(now: number, min = 0, max = 100): Record<string, unknown> {
  return Platform.OS === 'web'
    ? { 'aria-valuenow': Math.round(now), 'aria-valuemin': min, 'aria-valuemax': max }
    : {};
}
