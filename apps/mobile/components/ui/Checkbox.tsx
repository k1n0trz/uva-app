import { Pressable, Text, View } from 'react-native';
import { webAriaChecked } from '../../lib/a11y';

type Props = {
  checked: boolean;
  onToggle: () => void;
  label: string;
};

/** Custom checkbox (RN has no native one). Whole row is tappable (>=44px).
 *  `webAriaChecked` covers an RN-web gap — see lib/a11y.ts. */
export function Checkbox({ checked, onToggle, label }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      className="flex-row items-start gap-2.5 rounded-2xl border border-border bg-white p-3.5"
      {...webAriaChecked(checked)}
    >
      <View
        className={[
          'mt-0.5 h-[18px] w-[18px] items-center justify-center rounded-[5px] border',
          checked ? 'border-primary bg-primary' : 'border-border bg-white',
        ].join(' ')}
      >
        {checked ? <Text className="text-[11px] font-bold text-white">✓</Text> : null}
      </View>
      <Text className="flex-1 font-medium text-[13px] leading-5 text-ink">{label}</Text>
    </Pressable>
  );
}
