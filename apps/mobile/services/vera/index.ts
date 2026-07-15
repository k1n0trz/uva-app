export type ChatMessage = {
  from: 'vera' | 'user';
  text: string;
};

export type ChatIntent = 'dolor' | 'rutina' | null;

export type VeraReply = {
  message: ChatMessage;
  intent: ChatIntent;
};

export interface VeraChatService {
  sendMessage(text: string): Promise<VeraReply>;
}

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 500));

/**
 * Placeholder intent classifier — real version is the flow in ficha técnica
 * §11.1/§19.1 (STT -> intención -> reglas de seguridad -> LLM -> filtro de
 * salida). This mock only exists so chat UI has something to render.
 */
export const mockVeraChatService: VeraChatService = {
  sendMessage: (text) => {
    const lower = text.toLowerCase();
    let reply = 'Gracias por contarme. Lo tendré en cuenta para acompañarte mejor.';
    let intent: ChatIntent = null;

    if (lower.includes('periodo')) {
      reply = 'Con la información que tengo, tu periodo podría comenzar entre el 29 y el 31 de julio.';
    } else if (lower.includes('cólico') || lower.includes('colico') || lower.includes('dolor')) {
      reply = 'Antes de continuar, cuéntame qué tan fuerte es el dolor. Si es intenso, te recomiendo pausar y consultar a un profesional.';
      intent = 'dolor';
    } else if (lower.includes('rutina')) {
      reply = 'Te preparé una rutina de respiración de 3 minutos. ¿Quieres empezar ahora?';
      intent = 'rutina';
    }

    return delay({ message: { from: 'vera', text: reply }, intent });
  },
};
