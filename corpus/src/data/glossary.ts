/**
 * Atamalar lug'ati — barcha raqamlangan qismlar (kitob izohi) + atlas ob'yektlari.
 * Har bir yozuv: lotincha/nom + qaysi tizim va darsda o'rganiladi.
 * Manba: LESSON_LEGENDS (Ahmedov kitob izohlari) — ixtiro qilinmagan.
 */
import { LESSON_LEGENDS } from "./labels";
import { CONTENT_SYSTEMS, lessonById } from "./content";
import { ATLAS_OBJECTS } from "./anatomy";

export interface GlossaryEntry {
  term: string;
  meaning?: string;
  lessonId: string;
  lessonTitle: string;
  systemId: string;
  systemName: string;
  systemColor: string;
  /** lotincha atama bo'lsa true (talaffuz uchun) */
  latin: boolean;
}

function isLatin(s: string): boolean {
  // Lotincha atamalar asosan lotin alifbosida va kamdan-kam bo'sh joy bilan yoziladi.
  const latinChars = (s.match(/[a-zA-Z]/g) ?? []).length;
  const cyr = (s.match(/[а-яёў]/gi) ?? []).length;
  return latinChars > 0 && cyr === 0 && latinChars >= (s.match(/[a-zA-Z0-9 ]/g) ?? []).length * 0.7;
}

function build(): GlossaryEntry[] {
  const map = new Map<string, GlossaryEntry>();
  for (const sys of CONTENT_SYSTEMS) {
    for (const unit of sys.units) {
      for (const lesson of unit.lessons) {
        const legend = LESSON_LEGENDS[lesson.id];
        if (!legend) continue;
        for (const it of legend) {
          const term = it.name.trim();
          if (!term || term.length < 2) continue;
          const key = term.toLowerCase();
          if (map.has(key)) continue;
          map.set(key, {
            term,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            systemId: sys.id,
            systemName: sys.name,
            systemColor: sys.color,
            latin: isLatin(term),
          });
        }
      }
    }
  }

  // Atlas ob'yektlari ham (nomi + lotincha + inglizcha)
  for (const o of ATLAS_OBJECTS) {
    for (const term of [o.name, o.latin, o.en]) {
      const key = term.toLowerCase();
      if (map.has(key)) continue;
      map.set(key, {
        term,
        meaning: o.name !== term ? `${o.name} — ${o.function}` : o.function,
        lessonId: "",
        lessonTitle: o.name,
        systemId: "atlas",
        systemName: "Atlas",
        systemColor: "#6C5CE7",
        latin: isLatin(term),
      });
    }
  }

  return [...map.values()].sort((a, b) => a.term.localeCompare(b.term, "uz"));
}

export const GLOSSARY: GlossaryEntry[] = build();

export function searchGlossary(query: string, limit = 80): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY.slice(0, limit);
  return GLOSSARY.filter(
    (e) => e.term.toLowerCase().includes(q) || (e.meaning ?? "").toLowerCase().includes(q),
  ).slice(0, limit);
}
