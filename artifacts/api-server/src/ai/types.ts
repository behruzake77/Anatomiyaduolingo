export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatInput {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  model?: string;
}

export interface AIProvider {
  chat(input: ChatInput): Promise<ChatResponse>;
}

export interface EmbeddingProvider {
  embed(input: string): Promise<number[]>;
}

export interface TutorContext {
  student: { id: string; username?: string; level?: number; xp?: number };
  conversation: ChatMessage[];
  retrievedKnowledge: RetrievedKnowledge[];
  relevantMemories: TutorMemory[];
  progress: Record<string, unknown>;
  currentGoal?: string;
  session: { id: string; startedAt: string };
}

export interface RetrievedKnowledge {
  id: string;
  chapter?: string;
  section?: string;
  content: string;
  pageNumber?: number;
}

export interface TutorMemory {
  id: string;
  memoryType: string;
  content: string;
  importance: number;
}

export interface TutorResult {
  response: string;
  topics: string[];
  learningIntent: string;
  detectedMisconception?: string;
  suggestedNextTopic?: string;
  memoriesToSave: Array<{ memoryType: string; content: string; importance: number }>;
}
