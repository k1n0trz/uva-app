export type Memory = {
  id: string;
  tag: 'Declarado' | 'Inferido';
  text: string;
};

export interface UserMemoryService {
  listMemories(): Promise<Memory[]>;
  deleteMemory(id: string): Promise<void>;
  setMemoryActive(active: boolean): Promise<void>;
  clearChatHistory(): Promise<void>;
}

export interface RecommendationService {
  /** Every recommendation must carry a visible reason — ficha técnica §18.5. */
  explainRecommendation(productId: string): Promise<{ reason: string }>;
}

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 300));

const MOCK_MEMORIES: Memory[] = [
  { id: 'm1', tag: 'Declarado', text: 'Te llamas Laura y prefieres rutinas cortas.' },
  { id: 'm2', tag: 'Declarado', text: 'Tu ciclo suele durar 5 días.' },
  { id: 'm3', tag: 'Inferido', text: 'Sueles registrar mayor flujo durante la segunda noche.' },
];

export const mockUserMemoryService: UserMemoryService = {
  listMemories: () => delay(MOCK_MEMORIES),
  deleteMemory: (_id) => delay(undefined),
  setMemoryActive: (_active) => delay(undefined),
  clearChatHistory: () => delay(undefined),
};

export const mockRecommendationService: RecommendationService = {
  explainRecommendation: (_productId) => delay({ reason: 'Parte del catálogo destacado de UVA.' }),
};
