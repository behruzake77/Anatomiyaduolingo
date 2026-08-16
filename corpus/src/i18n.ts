"use client";

import { useAppStore } from "@/store/useAppStore";
import type { LevelTier } from "@/utils/levels";

export type Lang = "uz" | "en";

/** All values are plain strings (bilingual chrome). */
export interface Strings {
  [key: string]: string;
}

/**
 * UI chrome strings — O'zbekcha (asosiy) + English (ikkilamchi).
 * Anatomik atamalar lotincha/inglizcha holda saqlanadi (data fayllarda).
 */
export const STR: Record<Lang, Strings> = {
  uz: {
    brand: "CORPUS",
    tagline: "Anatomiyani o'rgan. Hayotni boshqar.",

    skip: "O'tkazib yuborish",
    next: "Keyingi",
    getStarted: "Boshlash",

    home: "Bosh sahifa",
    learn: "O'rganish",
    profile: "Profil",

    registerBtn: "Ro'yxatdan o'tish",
    loginBtn: "Kirish",
    username: "Foydalanuvchi nomi",
    password: "Parol",
    haveAccount: "Hisobingiz bormi? «Kirish»ni tanlang",
    noAccount: "Hisobingiz yo'qmi? «Ro'yxatdan o'tish»ni tanlang",
    errEmpty: "Foydalanuvchi nomi va parolni kiriting",
    errLogin: "Foydalanuvchi nomi yoki parol noto'g'ri",
    errExists: "Bu nom band — boshqa nom tanlang",
    logout: "Chiqish",

    goodMorning: "Xayrli kun",
    name: "Anatomiya o'quvchisi",
    level: "Daraja",
    todayGoal: "Bugungi maqsad",
    goalPercent: "bugungi maqsadning {pct}% i",
    streak: "Seriya",
    days: "kun",
    totalEarned: "Jami XP",
    continueLearning: "O'rganishni davom eting",
    lessonOf: "Dars {n} / {total}",
    min: "daqiqa",
    continue: "Davom etish",
    quickTopics: "Tezkor mavzular",
    seeAll: "Barchasi",
    bones: "Suyaklar",
    muscles: "Mushaklar",
    organs: "A'zolar",
    nerves: "Asab",

    topicsTitle: "Mavzular",
    topicsSubtitle: "11 ta tana tizimi",
    search: "Qidirish",
    study3d: "3D o'rganish",
    models3d: "3D modellar",
    lessons: "dars",
    complete: "bajarildi",
    soonBadge: "Keyingi bosqich",

    question: "Savol",
    finish: "Yakunlash",
    easy: "Oson",
    medium: "O‘rta",
    hard: "Qiyin",
    quitLesson: "Darsni tark etish",

    zoomHint: "Kattalashtirib o'qish",
    zoomClose: "Yopish",
    zoomIn: "Kattalashtirish",
    zoomOut: "Kichraytirish",
    zoomReset: "Asliga qaytarish",
    imageParts: "Rasm qismlari (raqamlar)",
    tapToFind: "qismni bossangiz, rasmda topishga yordam beradi",
    findPart: "№{n} — {name} ni rasmda toping",
    legendList: "Ro'yxat",

    greatJob: "Ajoyib natija!",
    xpEarned: "XP to'plandi",
    answered: "Javob berildi",
    correct: "To'g'ri",
    accuracy: "Aniqlik",
    tryAgain: "Qayta urinib ko'ring",
    retry: "Qayta urinish",
    backToTopics: "Mavzularga qaytish",

    dayStreak: "Kunlik seriya",
    topics: "Mavzular",
    lessonsDone: "Darslar",
    achievements: "Yutuqlar",
    bookmarks: "Xatcho'plar",
    progress: "Progress",
    studyMode: "O'rganish rejimi",
    settings: "Sozlamalar",
    about: "CORPUS haqida",

    achSubtitle: "Har kuni o'rganib, anatomiya ustasi bo'ling.",
    unlocked: "Ochilgan",

    drag: "Aylantirish uchun suring",
    buildHint: "So'zlarni bosib atamani yig'ing",
    orderHint: "Elementlarni to'g'ri ketma-ketlikda bosing",
    functionLabel: "Vazifasi",
    prevModel: "Oldingi model",
    play: "O'ynatish",
    pause: "To'xtatish",
    nextModel: "Keyingi model",
    resetRotation: "Aylanishni tiklash",

    progressTitle: "Progress tahlili",
    thisWeek: "Bu hafta",
    month: "Oy",
    year: "Yil",
    xpEarnedChart: "To'plangan XP",
    vsPrev: "oldingi {range}ga nisbatan",
    rangeWeek: "hafta",
    rangeMonth: "oy",
    rangeYear: "yil",
    completed: "Bajarilgan",
    inProgress: "Jarayonda",
    notStarted: "Boshlanmagan",

    settingsSubtitle: "O'rganish tajribangizni moslang.",
    notifications: "Bildirishnomalar",
    darkMode: "Tungi rejim",
    soundEffects: "Ovoz effektlari",
    language: "Til",
    privacy: "Maxfiylik siyosati",
    terms: "Foydalanish shartlari",
    resetLogout: "Qayta boshlash va chiqish",

    tierBeginner: "Boshlang'ich",
    tierIntermediate: "O'rta",
    tierAdvanced: "Yuqori",
    tierExpert: "Ekspert",
  },

  en: {
    brand: "CORPUS",
    tagline: "Learn Anatomy. Master Life.",

    skip: "Skip",
    next: "Next",
    getStarted: "Get Started",

    home: "Home",
    learn: "Learn",
    profile: "Profile",

    registerBtn: "Sign up",
    loginBtn: "Log in",
    username: "Username",
    password: "Password",
    haveAccount: "Already have an account? Switch to Log in",
    noAccount: "No account yet? Switch to Sign up",
    errEmpty: "Please enter a username and password",
    errLogin: "Incorrect username or password",
    errExists: "That username is taken — try another",
    logout: "Log out",

    goodMorning: "Good morning",
    name: "Anatomy Learner",
    level: "Level",
    todayGoal: "Today's goal",
    goalPercent: "{pct}% of your daily goal",
    streak: "Streak",
    days: "days",
    totalEarned: "Total XP",
    continueLearning: "Continue Learning",
    lessonOf: "Lesson {n} of {total}",
    min: "min",
    continue: "Continue",
    quickTopics: "Quick Topics",
    seeAll: "See all",
    bones: "Bones",
    muscles: "Muscles",
    organs: "Organs",
    nerves: "Nerves",

    topicsTitle: "Topics",
    topicsSubtitle: "11 body systems",
    search: "Search",
    study3d: "3D study mode",
    models3d: "3D models",
    lessons: "lessons",
    complete: "complete",
    soonBadge: "Coming next",

    question: "Question",
    finish: "Finish",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    quitLesson: "Quit lesson",

    zoomHint: "Zoom to read",
    zoomClose: "Close",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomReset: "Reset",
    imageParts: "Labeled parts",
    tapToFind: "tap a part to locate it on the image",
    findPart: "Find №{n} — {name} on the image",
    legendList: "List",

    greatJob: "Great Job!",
    xpEarned: "XP earned",
    answered: "Answered",
    correct: "Correct",
    accuracy: "Accuracy",
    tryAgain: "Try Again",
    retry: "Retry",
    backToTopics: "Back to topics",

    dayStreak: "Day Streak",
    topics: "Topics",
    lessonsDone: "Lessons",
    achievements: "Achievements",
    bookmarks: "Bookmarks",
    progress: "Progress",
    studyMode: "Study Mode",
    settings: "Settings",
    about: "About CORPUS",

    achSubtitle: "Unlock badges by learning every day and mastering anatomy.",
    unlocked: "Unlocked",

    drag: "Drag to rotate",
    buildHint: "Tap the words to build the term",
    orderHint: "Tap the items in the correct order",
    functionLabel: "Function",
    prevModel: "Previous model",
    play: "Play",
    pause: "Pause",
    nextModel: "Next model",
    resetRotation: "Reset rotation",

    progressTitle: "Progress Analytics",
    thisWeek: "This Week",
    month: "Month",
    year: "Year",
    xpEarnedChart: "XP Earned",
    vsPrev: "vs. previous {range}",
    rangeWeek: "week",
    rangeMonth: "month",
    rangeYear: "year",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",

    settingsSubtitle: "Personalize your learning experience.",
    notifications: "Notifications",
    darkMode: "Dark Mode",
    soundEffects: "Sound Effects",
    language: "Language",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    resetLogout: "Reset & Log out",

    tierBeginner: "Beginner",
    tierIntermediate: "Intermediate",
    tierAdvanced: "Advanced",
    tierExpert: "Expert",
  },
};

/** Returns the string table for the currently selected language. */
export function useStrings(): Strings {
  const lang = useAppStore((s) => s.settings.language);
  return STR[lang] ?? STR.uz;
}

/** Simple {token} interpolation. */
export function fmt(s: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)), s);
}

/** Level tier → i18n key. */
export const TIER_KEY: Record<LevelTier, keyof Strings> = {
  beginner: "tierBeginner",
  intermediate: "tierIntermediate",
  advanced: "tierAdvanced",
  expert: "tierExpert",
};
