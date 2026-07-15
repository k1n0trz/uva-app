export type AuthProvider = 'google' | 'apple' | 'facebook';

export type AuthSession = {
  userId: string;
  displayName: string;
  isGuest: boolean;
};

export interface AuthService {
  loginWithPassword(email: string, password: string): Promise<AuthSession>;
  loginWithProvider(provider: AuthProvider): Promise<AuthSession>;
  requestPhoneOtp(phone: string): Promise<{ requestId: string }>;
  verifyPhoneOtp(requestId: string, code: string): Promise<AuthSession>;
  continueAsGuest(): Promise<AuthSession>;
  requestPasswordReset(email: string): Promise<void>;
  logout(): Promise<void>;
}

const MOCK_DELAY_MS = 400;
const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), MOCK_DELAY_MS));

export const mockAuthService: AuthService = {
  loginWithPassword: (_email, _password) => delay({ userId: 'u1', displayName: 'Laura', isGuest: false }),
  loginWithProvider: (_provider) => delay({ userId: 'u1', displayName: 'Laura', isGuest: false }),
  requestPhoneOtp: (_phone) => delay({ requestId: 'otp-mock' }),
  verifyPhoneOtp: (_requestId, _code) => delay({ userId: 'u1', displayName: 'Laura', isGuest: false }),
  continueAsGuest: () => delay({ userId: 'guest', displayName: 'Invitada', isGuest: true }),
  requestPasswordReset: (_email) => delay(undefined),
  logout: () => delay(undefined),
};
