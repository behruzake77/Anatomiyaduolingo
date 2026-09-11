import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pipeline } from "@huggingface/transformers";

const ROOT = resolve(process.cwd(), "..");
const PDF_ROOTS = [resolve(ROOT, "artifacts/corpus/public/books"), resolve(ROOT, ".migration-backup")];
const MODEL = "Xenova/all-MiniLM-L6-v2";
const MAX_CHARS = 1800;
const OVERLAP_CHARS = 280;

type SourceType = "textbook" | "atlas";
type Chunk = { chunk_key: string; book_id: string; content: string; chapter: string | null; section: string | null; page_number: number; metadata: Record<string, unknown> };

function filesIn(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : entry.name.toLowerCase().endsWith(".pdf") ? [path] : [];
  });
}
function sourceType(file: string): SourceType { return /atlas|columna|vertebralis/i.test(file) ? "atlas" : "textbook"; }
function title(file: string): string { return relative(ROOT, file).replace(/\.pdf$/i, "").replace(/[\\/_-]+/g, " ").trim(); }
function clean(text: string): string { return text.replace(/\u00ad/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(); }
function looksLikeHeading(line: string): boolean { const value = line.trim(); return value.length >= 4 && value.length < 150 && (/^(\d+(\.\d+)*[.)]?\s+|[IVXLC]+\.\s+)/.test(value) || (value === value.toUpperCase() && /[A-ZА-ЯЎҚҒҲ]/.test(value))); }
function chunksForPage(text: string, page: number, file: string): Chunk[] {
  const paragraphs = clean(text).split(/\n\s*\n/).map(clean).filter((part) => part.length > 30);
  const output: Chunk[] = [];
  let chapter: string | null = null;
  let section: string | null = null;
  let buffer = "";
  let index = 0;
  const flush = () => {
    if (!buffer.trim()) return;
    const content = buffer.trim();
    const hash = createHash("sha256").update(content).digest("hex").slice(0, 20);
    output.push({ chunk_key: `${relative(ROOT, file)}:${page}:${index}:${hash}`, book_id: relative(ROOT, file), content, chapter, section, page_number: page, metadata: { book_title: title(file), source_type: sourceType(file), relative_path: relative(ROOT, file), chunk_index: index } });
    index += 1;
    buffer = content.slice(Math.max(0, content.length - OVERLAP_CHARS));
  };
  for (const paragraph of paragraphs) {
    const firstLine = paragraph.split("\n")[0];
    if (looksLikeHeading(firstLine)) { if (buffer.length > 80) flush(); section = firstLine; if (/^(\d+\.|[IVXLC]+\.)/.test(firstLine)) chapter = firstLine; }
    if (buffer && buffer.length + paragraph.length + 2 > MAX_CHARS) flush();
    buffer += `${buffer ? "\n\n" : ""}${paragraph}`;
  }
  flush();
  return output;
}
function extract(file: string): Chunk[] {
  const text = execFileSync("pdftotext", ["-layout", file, "-"], { maxBuffer: 250 * 1024 * 1024 }).toString("utf8");
  return text.split("\f").flatMap((page, index) => chunksForPage(page, index + 1, file));
}
async function embedder() {
  const extractor = await pipeline("feature-extraction", MODEL, { dtype: "fp32" });
  return async (text: string): Promise<number[]> => {
    const result = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from((result as { data: Float32Array }).data);
  };
}
async function upsert(rows: unknown[]) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for non-dry ingestion");
  const response = await fetch(`${url}/rest/v1/anatomy_chunks?on_conflict=chunk_key`, { method: "POST", headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(rows) });
  if (!response.ok) throw new Error(`Supabase ingestion failed: HTTP ${response.status} ${await response.text()}`);
}
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const files = PDF_ROOTS.flatMap(filesIn).filter((file, index, all) => all.indexOf(file) === index);
  if (!files.length) throw new Error("No anatomy PDFs found in configured roots");
  console.log(`CORPUS Anatomy Ingestion${dryRun ? " (dry-run)" : ""}`);
  console.log(`Embedding model: ${MODEL} (384 dimensions)`);
  console.log(`PDF files detected: ${files.length}`);
  const all: Chunk[] = [];
  for (const file of files) { const chunks = extract(file); all.push(...chunks); console.log(`${sourceType(file).padEnd(8)} ${relative(ROOT, file)} → ${chunks.length} semantic chunks`); }
  console.log(`Total chunks: ${all.length}`);
  if (dryRun) { console.log("Dry-run complete. No embeddings generated and no database writes performed."); return; }
  const embed = await embedder();
  let done = 0;
  for (let start = 0; start < all.length; start += 32) {
    const batch = all.slice(start, start + 32);
    const rows = [];
    for (const chunk of batch) rows.push({ ...chunk, embedding: await embed(chunk.content) });
    await upsert(rows);
    done += rows.length;
    if (done % 128 < rows.length || done === all.length) console.log(`Embedded and upserted ${done}/${all.length}`);
  }
  console.log("RAG knowledge base ready.");
}
main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
