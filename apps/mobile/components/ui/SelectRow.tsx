import { Pressable, Text, View } from 'react-native';

type Props<T extends string> = {
  options: readonly T[];
  value: T | null;
  onSelect: (value: T) => void;
  /** Accessible name for the group (e.g. "Flujo"). */
  label: string;
};

/** Single-select row of equal-width options. Mirrors the prototype's "Flujo" row:
 *  selected = solid primary, unselected = white with border. */
export function SelectRow<T extends string>({ options, value, onSelect, label }: Props<T>) {
  return (
    <View className="flex-row gap-2" accessibilityRole="radiogroup" accessibilityLabel={label}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={option}
            className={[
              'min-h-[44px] flex-1 items-center justify-center rounded-xl border px-1',
              selected ? 'border-primary bg-primary' : 'border-border bg-white',
            ].join(' ')}
          >
            <Text
              className={['text-center font-semibold text-xs', selected ? 'text-white' : 'text-ink'].join(' ')}
              numberOfLines={1}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
