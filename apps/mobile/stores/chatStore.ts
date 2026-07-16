import { create } from 'zustand';
import type { ChatIntent, ChatMessage, ReplyLength } from '../services/abril';

/**
 * Conversation state.
 *
 * Voice is push-to-talk only — never always-on, no "Hola, Abril" wake word
 * (ficha §4.2 / §11.2). The transcript is editable BEFORE sending, and audio is
 * never retained by default.
 */
export type VoiceStage =
  | 'idle'
  | 'listening'
  | 'transcribing'
  /** Transcript ready and editable — the user confirms before it's sent. */
  | 'review'
  | 'error';

export type ChatStatus = 'idle' | 'thinking' | 'speaking';

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export function makeMessage(from: ChatMessage['from'], text: string, warn = false): ChatMessage {
  return { id: nextId(), from, text, warn };
}

type ChatStore = {
  messages: ChatMessage[];
  input: string;
  status: ChatStatus;
  voiceStage: VoiceStage;
  /** Editable transcript awaiting confirmation. */
  transcript: string;
  lastIntent: ChatIntent;
  replyLength: ReplyLength;
  /** Spoken replies can be turned off without disabling the mic (ficha §11.2). */
  speechEnabled: boolean;

  setInput: (text: string) => void;
  setStatus: (status: ChatStatus) => void;
  setVoiceStage: (stage: VoiceStage) => void;
  setTranscript: (text: string) => void;
  setLastIntent: (intent: ChatIntent) => void;
  setReplyLength: (length: ReplyLength) => void;
  toggleSpeech: () => void;
  addMessage: (message: ChatMessage) => void;
  rateMessage: (id: string, rating: 'up' | 'down') => void;
  reset: () => void;
};

const greeting = () => makeMessage('abril', 'Hola. Estoy aquí para acompañarte. ¿En qué te ayudo hoy?');

export const useChatStore = create<ChatStore>((set) => ({
  messages: [greeting()],
  input: '',
  status: 'idle',
  voiceStage: 'idle',
  transcript: '',
  lastIntent: null,
  replyLength: 'breve',
  speechEnabled: true,

  setInput: (input) => set({ input }),
  setStatus: (status) => set({ status }),
  setVoiceStage: (voiceStage) => set({ voiceStage }),
  setTranscript: (transcript) => set({ transcript }),
  setLastIntent: (lastIntent) => set({ lastIntent }),
  setReplyLength: (replyLength) => set({ replyLength }),
  toggleSpeech: () => set((s) => ({ speechEnabled: !s.speechEnabled })),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  rateMessage: (id, rating) =>
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, rating } : m)) })),
  reset: () => set({ messages: [greeting()], input: '', status: 'idle', voiceStage: 'idle', transcript: '', lastIntent: null }),
}));
