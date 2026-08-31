/**
 * Loyiha yangiliklari — Dashboard pastidagi banner karusselida ko'rsatiladi.
 * Yangi versiya chiqqanda shu ro'yxatga yuqoridan qo'shib boriladi
 * (eng yangisi birinchi ko'rsatiladi).
 */

export interface NewsItem {
  date: string; // "YYYY-MM-DD"
  icon: string;
  uz: { title: string; text: string };
  en: { title: string; text: string };
}

export const NEWS: NewsItem[] = [
  {
    date: "2026-08-31",
    icon: "🔔",
    uz: {
      title: "Bildirishnomalar — qo'ng'iroq",
      text: "Bosh sahifa tepasidagi qo'ng'iroqda admin xabarlarini o'qing.",
    },
    en: {
      title: "Notifications — the bell",
      text: "Read admin messages from the bell at the top of Home.",
    },
  },
  {
    date: "2026-08-31",
    icon: "🚩",
    uz: {
      title: "Talab, taklif va savol xatoliklari",
      text: "Savol yonidagi bayroqcha bilan xabar yuboring — admin menyusiga tushadi.",
    },
    en: {
      title: "Report question errors",
      text: "Tap the flag on a question to send it to the admin inbox.",
    },
  },
  {
    date: "2026-08-31",
    icon: "🎯",
    uz: {
      title: "Kahoot — sinf o'yini",
      text: "PIN oching, 10 savol × 20 soniya, tezlik balli va podyum. Mashq botlari internetsiz ishlaydi.",
    },
    en: {
      title: "Kahoot — class quiz",
      text: "Open a PIN, 10 questions × 20 seconds, speed points and a podium. Practice bots work offline.",
    },
  },
  {
    date: "2026-08-31",
    icon: "⚔️",
    uz: {
      title: "Jonli bellashuv — 1 ga 1",
      text: "Haqiqiy o'quvchilar bilan tezkor o'yin, do'st kodi va mashq raqibi. Reyting endi jonli.",
    },
    en: {
      title: "Live battles — 1v1",
      text: "Quick match real learners, friend codes, and a practice rival. Rankings are live.",
    },
  },
  {
    date: "2026-08-28",
    icon: "🏁",
    uz: {
      title: "Haftalik ligalar — endi raqobat bor!",
      text: "Bronzadan Olmosgacha 5 liga. Har hafta TOP-3 ko'tariladi — reytingda o'rningizni ko'ring.",
    },
    en: {
      title: "Weekly leagues — competition is here!",
      text: "5 leagues from Bronze to Diamond. TOP 3 climb every week — check your rank.",
    },
  },
  {
    date: "2026-08-28",
    icon: "📚",
    uz: {
      title: "Kutubxona tuzatildi",
      text: "Kitob va atlaslar endi barcha brauzerlarda — iOS Safari ham — ishonchli ochiladi.",
    },
    en: {
      title: "Library fixed",
      text: "Books and atlases now open reliably in every browser, including iOS Safari.",
    },
  },
  {
    date: "2026-08-27",
    icon: "🎉",
    uz: {
      title: "To'liq qamrov: 83 dars",
      text: "11 tizim · 34 bo'lim · 2065 savol — butun darslik mazmuni ilovada.",
    },
    en: {
      title: "Full coverage: 83 lessons",
      text: "11 systems · 34 sections · 2065 questions — the entire textbook in the app.",
    },
  },
  {
    date: "2026-08-27",
    icon: "🖼️",
    uz: {
      title: "1100 rasmli savol",
      text: "Har bir raqamlangan qism uchun «rasmda toping» savoli avtomatik yaratiladi.",
    },
    en: {
      title: "1100 image questions",
      text: "Every numbered part gets an automatic «find it on the image» question.",
    },
  },
  {
    date: "2026-08-26",
    icon: "🧠",
    uz: {
      title: "Spaced repetition",
      text: "Xato qilgan savollaringiz 0/1/3/7/16/35 kunlarda avtomatik qaytadi.",
    },
    en: {
      title: "Spaced repetition",
      text: "Missed questions come back automatically on days 0/1/3/7/16/35.",
    },
  },
  {
    date: "2026-08-26",
    icon: "🧊",
    uz: {
      title: "3D modellar",
      text: "Atlas mavzularida Sketchfab orqali interaktiv 3D ko'rish imkoniyati.",
    },
    en: {
      title: "3D models",
      text: "Interactive 3D viewing via Sketchfab in atlas topics.",
    },
  },
  {
    date: "2026-08-26",
    icon: "📴",
    uz: {
      title: "Offline rejim",
      text: "CORPUS — PWA: bir marta ochsangiz, internetsiz ham ishlaydi.",
    },
    en: {
      title: "Offline mode",
      text: "CORPUS is a PWA — once loaded, it works offline.",
    },
  },
];
