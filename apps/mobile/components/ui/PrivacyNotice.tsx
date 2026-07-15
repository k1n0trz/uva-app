import { PropsWithChildren, ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = PropsWithChildren<{
  title?: string;
  message: string;
  eyebrow?: string;
  action?: ReactNode;
}>;

/** Card used for privacy/consent explanations during onboarding and profile. */
export function PrivacyNotice({ eyebrow, title, message, action, children }: Props) {
  return (
    <View className="gap-3 rounded-3xl border border-primary-border bg-primary-xsoft px-4 py-4">
      {eyebrow ? <Text className="font-bold text-xs text-primary-dark">{eyebrow}</Text> : null}
      {title ? <Text className="font-extrabold text-lg text-ink">{title}</Text> : null}
      <Text className="font-medium text-sm leading-6 text-ink-secondary">{message}</Text>
      {children}
      {action}
    </View>
  );
}
