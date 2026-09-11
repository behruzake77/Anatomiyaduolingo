import { Router, type Request, type Response } from "express";
import { AnatomyRetriever, StudentMemoryService, TutorSessionService, authenticateAccessToken } from "../ai/store";
import { CorpusTutorEngine, OpenRouterProvider } from "../ai/tutor";

const router = Router();
const retriever = new AnatomyRetriever();
const memories = new StudentMemoryService();
const sessions = new TutorSessionService();
const engine = new CorpusTutorEngine(new OpenRouterProvider());

function errorResponse(res: Response, error: unknown): Response {
  const code = error instanceof Error ? error.message : "TUTOR_UNKNOWN_ERROR";
  const safe: Record<string, { status: number; message: string }> = {
    AI_PROVIDER_NOT_CONFIGURED: { status: 503, message: "AI Tutor hozircha sozlanmagan." },
    AI_PROVIDER_TIMEOUT: { status: 504, message: "Tutor javobi kechikdi. Qayta urinib ko‘ring." },
    AI_PROVIDER_RATE_LIMIT: { status: 429, message: "Tutorga so‘rovlar ko‘payib ketdi. Birozdan keyin urinib ko‘ring." },
    AI_PROVIDER_INVALID_KEY: { status: 503, message: "AI provider kaliti sozlanmagan." },
    TUTOR_DATABASE_NOT_CONFIGURED: { status: 503, message: "Tutor xotirasi uchun baza sozlanmagan." },
  };
  const result = safe[code] || { status: 500, message: "Tutor vaqtincha javob bera olmadi." };
  return res.status(result.status).json({ error: result.message });
}

router.post("/ai/chat", async (req: Request, res: Response) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message || message.length > 4000) return res.status(400).json({ error: "Xabar 1–4000 belgi oralig‘ida bo‘lishi kerak." });
    const authorization = req.header("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const user = token ? await authenticateAccessToken(token) : null;
    if (!user) return res.status(401).json({ error: "Tutor bilan suhbatlashish uchun tizimga kiring." });

    let sessionId = typeof req.body.sessionId === "string" ? req.body.sessionId : "";
    if (!sessionId) sessionId = (await sessions.create(user.id)).id;
    const conversation = await sessions.messages(sessionId, user.id);
    const [knowledge, relevantMemories] = await Promise.all([retriever.search(message), memories.relevant(user.id, message)]);
    const result = await engine.respond({
      student: { id: user.id, username: user.email?.split("@")[0] },
      conversation: [...conversation, { role: "user", content: message }],
      retrievedKnowledge: knowledge,
      relevantMemories,
      progress: {},
      currentGoal: "Anatomiyani tushunish va eslab qolish",
      session: { id: sessionId, startedAt: new Date().toISOString() },
    });
    await sessions.saveMessage(sessionId, user.id, "user", message);
    await sessions.saveMessage(sessionId, user.id, "assistant", result.response);
    await Promise.all(result.memoriesToSave.map((memory) => memories.saveMemory(user.id, memory)));
    await sessions.update(sessionId, user.id, { topics: result.topics, suggestedNextTopic: result.suggestedNextTopic });
    return res.json({ response: result.response, sessionId, topics: result.topics, sources: knowledge.map((item) => ({ chapter: item.chapter, section: item.section, pageNumber: item.pageNumber })) });
  } catch (error) {
    return errorResponse(res, error);
  }
});

export default router;
