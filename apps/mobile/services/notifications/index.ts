export type DiscretionLevel = 'normal' | 'discreto' | 'muy-discreto';

export interface NotificationsService {
  setDiscretionLevel(level: DiscretionLevel): Promise<void>;
  getDiscretionLevel(): Promise<DiscretionLevel>;
}

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 250));

let currentLevel: DiscretionLevel = 'normal';

export const mockNotificationsService: NotificationsService = {
  setDiscretionLevel: (level) => {
    currentLevel = level;
    return delay(undefined);
  },
  getDiscretionLevel: () => delay(currentLevel),
};
