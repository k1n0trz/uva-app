import { forwardRef, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  errorText?: string;
};

/** Text field matching the prototype's 44px-min, rounded-xl, border-border inputs. */
export const AppInput = forwardRef<TextInput, Props>(
  ({ label, errorText, className, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    return (
      <View className="w-full">
        {label ? <Text className="mb-1.5 font-semibold text-xs text-ink-secondary">{label}</Text> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#6F666B"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={[
            'min-h-[44px] rounded-xl border px-3.5 font-medium text-sm text-ink',
            errorText ? 'border-danger' : focused ? 'border-primary' : 'border-border',
            className ?? '',
          ].join(' ')}
          accessibilityLabel={label}
          {...rest}
        />
        {errorText ? <Text className="mt-1 font-medium text-xs text-danger">{errorText}</Text> : null}
      </View>
    );
  }
);

AppInput.displayName = 'AppInput';
