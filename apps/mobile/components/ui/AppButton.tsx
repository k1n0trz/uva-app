import { forwardRef } from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

export type AppButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger-outline';
export type AppButtonSize = 'sm' | 'md' | 'lg';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
};

const containerByVariant: Record<AppButtonVariant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-primary-soft',
  dark: 'bg-ink',
  outline: 'bg-white border border-border',
  ghost: 'bg-transparent',
  'danger-outline': 'bg-white border border-danger-border',
};

const textByVariant: Record<AppButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-primary-dark',
  dark: 'text-white',
  outline: 'text-ink',
  ghost: 'text-primary-dark',
  'danger-outline': 'text-danger',
};

const heightBySize: Record<AppButtonSize, string> = {
  sm: 'min-h-[40px] px-4',
  md: 'min-h-[44px] px-5',
  lg: 'min-h-[48px] px-6',
};

const textSizeBySize: Record<AppButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

/** Primary interactive control. Mirrors the prototype's pill/rounded CTA styles. */
export const AppButton = forwardRef<React.ElementRef<typeof Pressable>, Props>(
  ({ label, variant = 'primary', size = 'md', fullWidth, loading, disabled, style, ...rest }, ref) => {
    const isPill = variant === 'primary' || variant === 'dark';
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled || !!loading }}
        disabled={disabled || loading}
        className={[
          'flex-row items-center justify-center',
          isPill ? 'rounded-full' : 'rounded-xl',
          containerByVariant[variant],
          heightBySize[size],
          fullWidth ? 'w-full' : '',
          disabled || loading ? 'opacity-50' : '',
        ].join(' ')}
        style={style}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' || variant === 'dark' ? '#FFFFFF' : '#CD2F62'} />
        ) : (
          <Text className={['font-bold', textSizeBySize[size], textByVariant[variant]].join(' ')}>{label}</Text>
        )}
      </Pressable>
    );
  }
);

AppButton.displayName = 'AppButton';
