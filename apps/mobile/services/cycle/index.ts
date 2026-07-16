/**
 * Cycle data + basic prediction.
 *
 * Hard rules from ficha técnica §12.2/§12.3 and brief §11/§24 — the real
 * backend implementation MUST keep these:
 *   - Prediction is a RANGE, never an absolute date, and never framed as
 *     contraception or fertility.
 *   - With little history, show uncertainty instead of a confident date.
 *   - Irregular cycles get a wider range and prioritize logging over precision.
 *   - Pregnancy / postpartum / menopause disable standard prediction.
 *   - Never diagnose.
 */

/** Domain state of the user's cycle data — NOT a dev scenario. The UI maps
 *  its own state (or, in mocks, the dev scenario) onto this. */
export type CycleDataState = 'regular' | 'irregular' | 'insufficient' | 'disabled';

export type PredictionConfidence = 'none' | 'low' | 'medium';

export type CyclePrediction = {
  message: string;
  confidence: PredictionConfidence;
  /** Short note explaining the basis of the estimate (explicabilidad, ficha §18.5). */
  note: string;
};

export type MonthCycleData = {
  /** Days with a logged period. */
  registeredDays: number[];
  /** Days in the probable range of the next period — always a range, never one date. */
  estimatedDays: number[];
};

export type CycleHistoryEntry = {
  range: string;
  lengthDays: number;
};

export interface CycleService {
  getPrediction(state: CycleDataState): Promise<CyclePrediction>;
  getMonthData(year: number, month: number, state: CycleDataState): Promise<MonthCycleData>;
  listCycleHistory(state: CycleDataState): Promise<CycleHistoryEntry[]>;
  registerPeriodEdge(isoDate: string, kind: 'start' | 'end'): Promise<void>;
}

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 250));

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const mockCycleService: CycleService = {
  getPrediction: (state) => {
    switch (state) {
      case 'insufficient':
        return delay({
          message: 'Aún no tengo suficiente información para estimar tu próximo periodo.',
          confidence: 'none',
          note: 'Registra tu periodo unos días y podré darte una estimación.',
        });
      case 'irregular':
        return delay({
          message: 'Necesito más registros para estimar mejor tu próximo periodo.',
          confidence: 'low',
          note: 'Tus últimos ciclos han variado bastante — sigue registrando para mejorar la estimación.',
        });
      case 'disabled':
        return delay({
          message: 'Por ahora no estimo tu periodo.',
          confidence: 'none',
          note: 'Según lo que me contaste, adapté la app a tu situación actual.',
        });
      default:
        return delay({
          message: 'Tu periodo podría iniciar en 4 a 6 días.',
          confidence: 'medium',
          note: 'Estimación basada en tus últimos 3 ciclos registrados.',
        });
    }
  },

  getMonthData: (_year, _month, state) => {
    if (state === 'insufficient' || state === 'disabled') {
      return delay({ registeredDays: [], estimatedDays: [] });
    }
    if (state === 'irregular') {
      // Wider, less confident window.
      return delay({ registeredDays: range(1, 4), estimatedDays: range(26, 31) });
    }
    return delay({ registeredDays: range(1, 4), estimatedDays: range(29, 31) });
  },

  listCycleHistory: (state) => {
    if (state === 'insufficient' || state === 'disabled') return delay([]);
    if (state === 'irregular') {
      return delay([
        { range: '1 – 5 jun', lengthDays: 5 },
        { range: '26 abr – 3 may', lengthDays: 8 },
        { range: '20 – 24 mar', lengthDays: 4 },
      ]);
    }
    return delay([
      { range: '1 – 5 jun', lengthDays: 5 },
      { range: '3 – 8 may', lengthDays: 6 },
      { range: '30 mar – 4 abr', lengthDays: 6 },
    ]);
  },

  registerPeriodEdge: (_isoDate, _kind) => delay(undefined),
};
