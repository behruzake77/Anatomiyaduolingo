import type { AIProvider, ChatMessage, ChatResponse, TutorContext, TutorResult } from "./types";

const SYSTEM_PROMPT = `You are CORPUS, a warm, intelligent Uzbek anatomy tutor.
Teach for learning, not just answering. Use active recall and ask one useful guiding question when appropriate. Detect misconceptions, adapt difficulty, encourage the student, and gently challenge avoidance without shame. Be natural, slightly playful, concise, and never robotic.
Use retrieved textbook/atlas context for source-specific claims. Never invent textbook content. If context is empty, clearly say when you are giving general anatomy knowledge rather than claiming it comes from the CORPUS textbook.
Return ONLY valid JSON with keys: response (string), topics (string[]), learningIntent (string), detectedMisconception (string|null), suggestedNextTopic (string|null), memoriesToSave (array of {memoryType,content,importance}).`;

export class OpenRouterProvider implements AIProvider {
  private readonly apiKey = process.env.OPENROUTER_API_KEY;
  private readonly model = process.env.OPENROUTER_MODEL || "openrouter/free";

  async chat(input: { messages: ChatMessage[]; temperature?: number; maxTokens?: number }): Promise<ChatResponse> {
    if (!this.apiKey) throw new Error("AI_PROVIDER_NOT_CONFIGURED");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_ORIGIN || "https://corpus.app",
          "X-Title": "CORPUS Anatomy Tutor",
        },
        body: JSON.stringify({
          model: this.model,
          messages: input.messages,
          temperature: input.temperature ?? 0.65,
          max_tokens: input.maxTokens ?? 700,
        }),
      });
      if (response.status === 401) throw new Error("AI_PROVIDER_INVALID_KEY");
      if (response.status === 429) throw new Error("AI_PROVIDER_RATE_LIMIT");
      if (!response.ok) throw new Error(`AI_PROVIDER_HTTP_${response.status}`);
      const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const content = json.choices?.[0]?.message?.content?.trim();
      if (!content) throw new Error("AI_PROVIDER_EMPTY_RESPONSE");
      return { content, model: this.model };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") throw new Error("AI_PROVIDER_TIMEOUT");
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }
}

function parseResult(content: string): TutorResult {
  const cleaned = content.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  try {
    const value = JSON.parse(cleaned) as Partial<TutorResult>;
    return {
      response: typeof value.response === "string" ? value.response : content,
      topics: Array.isArray(value.topics) ? value.topics.filter((x): x is string => typeof x === "string").slice(0, 8) : [],
      learningIntent: typeof value.learningIntent === "string" ? value.learningIntent : "teach",
      detectedMisconception: typeof value.detectedMisconception === "string" ? value.detectedMisconception : undefined,
      suggestedNextTopic: typeof value.suggestedNextTopic === "string" ? value.suggestedNextTopic : undefined,
      memoriesToSave: Array.isArray(value.memoriesToSave) ? value.memoriesToSave.filter((m) => m && typeof m.content === "string").slice(0, 3).map((m) => ({ memoryType: typeof m.memoryType === "string" ? m.memoryType : "observation", content: m.content as string, importance: typeof m.importance === "number" ? Math.max(1, Math.min(5, m.importance)) : 3 })) : [],
    };
  } catch {
    return { response: content, topics: [], learningIntent: "teach", memoriesToSave: [] };
  }
}

export class CorpusTutorEngine {
  constructor(private readonly provider: AIProvider) {}

  async respond(context: TutorContext): Promise<TutorResult> {
    const knowledge = context.retrievedKnowledge.length
      ? context.retrievedKnowledge.map((item) => `[${item.chapter || "Atlas"}${item.pageNumber ? `, p.${item.pageNumber}` : ""}] ${item.content}`).join("\n")
      : "No textbook/atlas passage matched. Do not present source-specific claims as textbook facts.";
    const memories = context.relevantMemories.length
      ? context.relevantMemories.map((memory) => `- ${memory.content}`).join("\n")
      : "No long-term weaknesses recorded yet.";
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: `Student profile: ${JSON.stringify(context.student)}\nProgress: ${JSON.stringify(context.progress)}\nGoal: ${context.currentGoal || "Build anatomy recall"}\nRelevant memories:\n${memories}\nRetrieved source context:\n${knowledge}` },
      ...context.conversation.slice(-12),
    ];
    const result = await this.provider.chat({ messages });
    return parseResult(result.content);
  }
}
