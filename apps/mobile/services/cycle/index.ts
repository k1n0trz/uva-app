export type CyclePrediction = {
  /** Human-readable, deliberately non-absolute per ficha técnica §12.2/§12.3. */
  message: string;
  confidence: 'none' | 'low' | 'medium';
};

export type CycleHistoryEntry = {
  range: string;
  lengthDays: number;
};

export interface CycleService {
  getPrediction(scenario: 'regular' | 'irregular' | 'insufficient'): Promise<CyclePrediction>;
  listCycleHistory(): Promise<CycleHistoryEntry[]>;
  registerPeriodEdge(date: string, kind: 'start' | 'end'): Promise<void>;
}

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 350));

export const mockCycleService: CycleService = {
  getPrediction: (scenario) => {
    if (scenario === 'insufficient') {
      return delay({ message: 'Aún no tengo suficiente información para estimar tu próximo periodo.', confidence: 'none' });
    }
    if (scenario === 'irregular') {
      return delay({ message: 'Necesito más registros para estimar mejor tu próximo periodo.', confidence: 'low' });
    }
    return delay({ message: 'Tu periodo podría iniciar en 4 a 6 días.', confidence: 'medium' });
  },
  listCycleHistory: () =>
    delay([
      { range: '1 – 5 jun', lengthDays: 5 },
      { range: '3 – 8 may', lengthDays: 6 },
      { range: '30 mar – 4 abr', lengthDays: 6 },
    ]),
  registerPeriodEdge: (_date, _kind) => delay(undefined),
};
