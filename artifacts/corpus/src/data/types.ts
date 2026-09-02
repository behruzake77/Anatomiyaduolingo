/**
 * Umumiy kontent tiplari — barcha tizimlar uchun (osteologiya, artrologiya,
 * miologiya, splanxnologiya, angiologiya, nevrologiya, sezgi a'zolari).
 */

export type QuestionType = "quiz" | "img" | "match" | "build" | "tf" | "order" | "fill" | "func";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  type: QuestionType;
  prompt: string;
  options?: string[];
  answer?: number;
  image?: string;
  /** Foydalanuvchi testlari: variantlar rasmi (Kahoot "rasmni tanlang" turi) */
  optionImages?: string[];
  pairs?: [string, string][];
  answerText?: string;
  extra?: string[];
  statement?: boolean;
  /** order turi uchun to'g'ri ketma-ketlik */
  items?: string[];
  hint?: string;
  explanation?: string;
  /** Qiyinlik darajasi (oson → o'rta → qiyin). Ko'rsatilmagan bo'lsa avtomatik aniqlanadi. */
  difficulty?: Difficulty;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xp: number;
  minutes: number;
  questions: Question[];
  /** kitob manbasi */
  source?: { book: string; page: string };
  /** dars boshidagi o'rganish slaydlari */
  slides?: {
    title: string;
    text: string;
    img?: string;
    cap?: string;
    legend?: { n: string; name: string }[];
    /** rangli diagramma: qism raqami → faqat shu qism rangli rasm (interaktiv) */
    highlights?: Record<string, string>;
  }[];
  /** o'rganish fazaси учун флеш-карталар (саволдан олдин) */
  flashcards?: { n: string; name: string; img: string; def?: string }[];
}

export interface SystemUnit {
  id: string;
  title: string;
  icon: string;
  color: string;
  intro: string;
  lessons: Lesson[];
}

export interface ContentSystem {
  id: string;
  name: string;
  latin: string;
  en: string;
  icon: string;
  color: string;
  image: string;
  units: SystemUnit[];
}
