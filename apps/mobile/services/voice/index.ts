/**
 * STT/TTS stay behind independent interfaces on purpose — ficha técnica §11.3
 * is explicit that DeepSeek is a conversational LLM, not a voice provider, so
 * whatever voice vendor gets benchmarked and picked must be swappable here
 * without touching chat/UI code.
 */
export interface SpeechToTextService {
  transcribe(audioUri: string): Promise<{ text: string }>;
}

export interface TextToSpeechService {
  speak(text: string): Promise<{ audioUri: string }>;
  stop(): Promise<void>;
}

const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), 600));

export const mockSpeechToTextService: SpeechToTextService = {
  transcribe: (_audioUri) => delay({ text: '' }),
};

export const mockTextToSpeechService: TextToSpeechService = {
  speak: (_text) => delay({ audioUri: '' }),
  stop: () => delay(undefined),
};
