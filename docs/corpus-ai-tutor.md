# CORPUS AI Anatomy Tutor

## Holat

Bu birinchi bosqichdagi **matnli AI tutor foundation**. Realtime voice implement qilinmagan. Tutor engine keyinchalik text va voice transportlari bilan qayta ishlatilishi uchun provider-agnostic interfeyslar bilan ajratilgan.

## Arxitektura

Frontend `artifacts/corpus` mavjud Zustand auth/progress store va Supabase browser client’ini qayta ishlatadi. `TutorScreen` tokenni Supabase session’dan oladi va serverga `POST /api/ai/chat` yuboradi.

Backend `artifacts/api-server` ichida quyidagi modullar mavjud:

- `ai/types.ts` — `AIProvider`, `EmbeddingProvider`, `TutorContext` va structured result turlari.
- `ai/tutor.ts` — `OpenRouterProvider` va markaziy `CorpusTutorEngine`.
- `ai/store.ts` — Supabase REST orqali `AnatomyRetriever`, `StudentMemoryService` va `TutorSessionService`.
- `routes/ai.ts` — authenticated `/api/ai/chat` endpointi.

OpenRouter keyinchalik Gemini yoki boshqa provider bilan `AIProvider` implementatsiyasini almashtirish orqali o‘zgartiriladi. API key browser bundle’iga kiritilmaydi.

## API

`POST /api/ai/chat`

```json
{
  "message": "Mitral klapan qayerda joylashgan?",
  "sessionId": "optional-existing-session-id"
}
```

Bearer token Supabase Auth session’dan olinadi. Server foydalanuvchini Supabase `/auth/v1/user` endpointi orqali tekshiradi, conversation history va memory’ni yuklaydi, `anatomy_chunks` ichidan keyword context qidiradi, tutor javobini saqlaydi va `{ response, sessionId, topics, sources }` qaytaradi.

## Supabase migration

`artifacts/corpus/supabase/ai_tutor.sql` quyidagilarni yaratadi:

- `anatomy_chunks` — textbook/atlas chunklari va kelajakdagi pgvector embedding ustuni.
- `tutor_memory` — foydalanuvchining meaningful weak/strong learning memory’lari.
- `tutor_sessions` — session summary, topics, mistakes, strengths va understanding score.
- `tutor_messages` — user/assistant conversation xabarlari.

Barcha user jadvallarida owner-based RLS mavjud. `anatomy_chunks` authenticated users uchun read-only. Migrationni Supabase SQL Editor’da bir marta ishga tushiring.

## Environment variables

API server environment’ida:

```env
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=openrouter/free
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
APP_ORIGIN=https://YOUR_APP_DOMAIN
```

`SUPABASE_SERVICE_ROLE_KEY` faqat serverda bo‘lishi kerak; frontendga yoki GitHub’ga commit qilinmaydi. Frontend uchun API boshqa hostda bo‘lsa `VITE_API_URL` ni API server originiga o‘rnating.

## RAG ingestion

Repositoryda anatomy textbook/atlas PDF’lar mavjud, ammo ularni chat promptiga to‘liq yuborish mumkin emas. Keyingi ingestion ishida PDF matni chapter/section/page bo‘yicha chunklanib, `anatomy_chunks` jadvaliga yoziladi. Embedding provider `EmbeddingProvider` orqali qo‘shiladi; hozirgi retriever foundation xavfsiz keyword fallback ishlatadi va source context bo‘lmasa tutor buni aniq aytadi.

## Tutor xulqi

Tutor active recall, guiding questions, misconception detection, adaptive difficulty va gentle motivation qoidalariga amal qiladi. Har bir chat xabari permanent memory sifatida yozilmaydi; faqat provider structured result ichidan meaningful memories saqlanadi.

## Manual deployment steps

1. `ai_tutor.sql` migrationni Supabase SQL Editor’da ishga tushiring.
2. API server deploy qilinadigan servisga server-side environment variables kiriting.
3. Frontend build environment’iga `VITE_API_URL` kiriting, agar API frontend bilan bir origin’da bo‘lmasa.
4. OpenRouter account’dan key oling va key’ni hech qachon browser env (`VITE_...`) sifatida qo‘ymang.
5. `anatomy_chunks` ga approved textbook/atlas ingestion pipeline orqali chunklar kiriting.

## Voice Phase 2

Realtime voice keyingi bosqichda `VoiceProvider`/`RealtimeVoiceProvider` transporti orqali qo‘shiladi. Ular `CorpusTutorEngine`ga text message kabi structured input beradi; tutor logic audio SDK’ga bog‘lanmaydi.

## Phase 1.5 — Real anatomy RAG ingestion

The reusable ingestion command is:

```bash
pnpm --filter @workspace/scripts run ingest:anatomy -- --dry-run
pnpm --filter @workspace/scripts run ingest:anatomy
```

The pipeline detects PDFs under `artifacts/corpus/public/books` and `.migration-backup`, extracts text with the system `pdftotext` utility, preserves page boundaries, detects likely chapter/section headings, groups paragraphs into semantic chunks with overlap, assigns a stable `chunk_key`, generates local embeddings, and upserts rows to Supabase in batches of 32. Running it again uses `chunk_key` conflict resolution and does not duplicate unchanged chunks.

The selected embedding model is **`Xenova/all-MiniLM-L6-v2`**, executed through `@huggingface/transformers`. It is free to run locally and produces **384-dimensional normalized vectors**. The Supabase `embedding` column and `match_anatomy_chunks` RPC use `vector(384)`.

The source roots currently contain real repository PDFs. A dry-run on 2026-09-11 detected **3,871 semantic chunks** across the available textbook and atlas files. Several atlas PDFs are image-only and produced zero text chunks; they require OCR/image-caption ingestion in a later pass rather than invented prose. This dry-run did not write to Supabase, so **the textbook and atlas have not yet been actually ingested into the remote database**. Actual ingestion requires `SUPABASE_URL` and the server-only `SUPABASE_SERVICE_ROLE_KEY`.

### Retrieval

The API now embeds each question with the same local model, calls `match_anatomy_chunks` through Supabase RPC, and merges the top vector matches with a bounded keyword/full-text fallback. It never loads the complete `anatomy_chunks` table into Node. Each returned source contains its id, book title, chapter, section, page number, source type, and similarity score. The prompt clearly labels textbook versus atlas context and prohibits invented citations, page numbers, plate numbers, and quotations.

### Re-ingesting updated books

Replace or add PDFs in the configured source roots and run the command again. The stable key includes the relative book path, page number, chunk index, and content hash. Changed content creates a new key; unchanged chunks are merged by `chunk_key`.

### Troubleshooting

- `No anatomy PDFs found`: confirm the source root paths or pass an equivalent repository layout before running ingestion.
- `SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required`: use dry-run for extraction checks, or configure server-only values for database writes.
- `vector dimension` errors: ensure the `ai_tutor.sql` migration and the running embedding model both use 384 dimensions. If an older empty `vector(1536)` table was already created, migrate the empty column to `vector(384)` before ingestion; never silently mix dimensions.
- Image-only atlas files: use a separate OCR/vision extraction phase and preserve atlas plate/section metadata; do not create unsupported text from filenames.
