import { Pressable, Text, View } from 'react-native';

type Props = {
  options: readonly string[];
  /** Selected values. Single-select callers pass an array of 0 or 1 item. */
  selected: readonly string[];
  onToggle: (value: string) => void;
  label: string;
  multi?: boolean;
};

/** Wrapping pill chips. Mirrors the prototype's symptom/product chips:
 *  selected = soft pink fill + primary border, unselected = white + border. */
export function ChipGroup({ options, selected, onToggle, label, multi = true }: Props) {
  return (
    <View
      className="flex-row flex-wrap gap-2"
      accessibilityRole={multi ? undefined : 'radiogroup'}
      accessibilityLabel={label}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => onToggle(option)}
            accessibilityRole={multi ? 'checkbox' : 'radio'}
            accessibilityState={multi ? { checked: isSelected } : { selected: isSelected }}
            accessibilityLabel={option}
            className={[
              'min-h-[40px] justify-center rounded-full border px-3.5',
              isSelected ? 'border-primary bg-primary-xsoft' : 'border-border bg-white',
            ].join(' ')}
          >
            <Text className={['font-semibold text-xs', isSelected ? 'text-primary-dark' : 'text-ink'].join(' ')}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
