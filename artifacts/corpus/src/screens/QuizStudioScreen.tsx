"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Trash2, Play, Users, Globe, Lock, ImagePlus, ImageOff } from "lucide-react";
import { Screen } from "@/components/layout/Screen";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { useStrings, fmt } from "@/i18n";
import { cn } from "@/utils/cn";
import {
  QUIZ_MAX_Q,
  QUIZ_MIN_Q,
  deleteQuiz,
  imageFileToDataUrl,
  isQuizReady,
  listMyQuizzes,
  listPublicQuizzes,
  packQuestion,
  saveQuiz,
  type QuizQuestion,
  type QuizQuestionType,
  type UserQuiz,
} from "@/lib/userQuizzes";

type Tab = "mine" | "community";
type Phase = "list" | "edit";

const TF_OPTIONS = ["To'g'ri", "Noto'g'ri"];

const emptyQ = (type: QuizQuestionType = "choice"): QuizQuestion => ({
  prompt: "",
  options: type === "tf" ? [...TF_OPTIONS] : ["", "", "", ""],
  answer: 0,
  type,
  optionImages: type === "pickImage" ? ["", "", "", ""] : undefined,
});

const TYPE_META: { id: QuizQuestionType; icon: string }[] = [
  { id: "choice", icon: "📝" },
  { id: "tf", icon: "⚖️" },
  { id: "image", icon: "🖼️" },
  { id: "pickImage", icon: "🎯" },
];

export function QuizStudioScreen() {
  const t = useStrings();
  const currentUser = useAppStore((s) => s.currentUser);
  const openKahootQuiz = useAppStore((s) => s.openKahootQuiz);
  const [tab, setTab] = useState<Tab>("mine");
  const [phase, setPhase] = useState<Phase>("list");
  const [mine, setMine] = useState<UserQuiz[]>([]);
  const [community, setCommunity] = useState<UserQuiz[]>([]);
  const [busy, setBusy] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQ(), emptyQ()]);
  const [qOpen, setQOpen] = useState(0);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgErr, setMsgErr] = useState(false);

  const load = async () => {
    setBusy(true);
    if (currentUser) setMine(await listMyQuizzes(currentUser.id));
    else setMine([]);
    setCommunity(await listPublicQuizzes());
    setBusy(false);
  };

  useEffect(() => {
    void load();
  }, [currentUser?.id]);

  const setMsgBoth = (s: string, isErr = false) => {
    setMsg(s);
    setMsgErr(isErr);
  };

  const startNew = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setIsPublic(true);
    setQuestions([emptyQ(), emptyQ()]);
    setQOpen(0);
    setMsgBoth("");
    setPhase("edit");
  };

  const startEdit = (q: UserQuiz) => {
    setEditId(q.id);
    setTitle(q.title);
    setDescription(q.description);
    setIsPublic(q.is_public);
    setQuestions(
      q.questions.length
        ? q.questions.map((x) => ({
            ...x,
            options: [...x.options, "", "", "", ""].slice(0, 4),
            optionImages: x.optionImages ? [...x.optionImages, "", "", "", ""].slice(0, 4) : undefined,
          }))
        : [emptyQ(), emptyQ()],
    );
    setQOpen(0);
    setMsgBoth("");
    setPhase("edit");
  };

  const patchQ = (i: number, patch: Partial<QuizQuestion>) => {
    setQuestions((cur) => cur.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  };

  const setType = (i: number, type: QuizQuestionType) => {
    setQuestions((cur) =>
      cur.map((x, j) => {
        if (j !== i) return x;
        const next: QuizQuestion = { ...x, type, answer: 0 };
        if (type === "tf") {
          next.options = [...TF_OPTIONS];
          next.optionImages = undefined;
          next.image = undefined;
        } else {
          next.options = ["", "", "", ""];
          next.image = undefined;
          if (type === "pickImage") next.optionImages = ["", "", "", ""];
          else next.optionImages = undefined;
        }
        return next;
      }),
    );
  };

  const setOptionImage = (i: number, oi: number, url: string) => {
    setQuestions((cur) =>
      cur.map((x, j) => {
        if (j !== i) return x;
        const imgs = [...(x.optionImages ?? ["", "", "", ""])].slice(0, 4);
        while (imgs.length < 4) imgs.push("");
        imgs[oi] = url;
        return { ...x, optionImages: imgs };
      }),
    );
  };

  const onPickImage = async (i: number, input: HTMLInputElement, kind: "q" | "opt", oi = 0) => {
    const file = input.files?.[0];
    input.value = "";
    if (!file || !currentUser) return;
    try {
      const url = await imageFileToDataUrl(file);
      if (kind === "q") patchQ(i, { image: url });
      else setOptionImage(i, oi, url);
      setMsgBoth("");
    } catch (e) {
      const m = e instanceof Error ? e.message : "";
      setMsgBoth(m === "too-big" ? t.quizImageTooBig : t.quizImageRequired, true);
    }
  };

  const save = async () => {
    if (!currentUser) {
      setMsgBoth(t.quizNeedLogin, true);
      return;
    }
    // Aniq tekshiruv — qaysi savolda nima yetishmayapti
    for (const q of questions) {
      const type = q.type ?? "choice";
      if (!q.prompt.trim()) {
        setMsgBoth(t.quizNeedQs, true);
        return;
      }
      if (type === "image" && !q.image) {
        setMsgBoth(t.quizImageRequired, true);
        return;
      }
      if (type === "pickImage") {
        const imgs = q.optionImages ?? [];
        const last = q.options.reduce((acc, o, i) => ((o.trim() || imgs[i]) ? i : acc), -1);
        if (last < 1 || !q.options.slice(0, last + 1).every((_, i) => imgs[i])) {
          setMsgBoth(t.quizOptionImageRequired, true);
          return;
        }
      }
    }
    const cleaned = questions.map(packQuestion).filter((q): q is QuizQuestion => Boolean(q));
    if (cleaned.length < QUIZ_MIN_Q) {
      setMsgBoth(t.quizNeedQs, true);
      return;
    }
    setSaving(true);
    const saved = await saveQuiz(currentUser, { title, description, is_public: isPublic, questions: cleaned }, editId);
    setSaving(false);
    if (!saved) {
      setMsgBoth(t.reportFail, true);
      return;
    }
    setEditId(saved.id);
    setQuestions(
      saved.questions.map((x) => ({
        ...x,
        options: [...x.options, "", "", "", ""].slice(0, 4),
        optionImages: x.optionImages ? [...x.optionImages, "", "", "", ""].slice(0, 4) : undefined,
      })),
    );
    setMsgBoth(t.quizSaved);
    void load();
  };

  const host = (quiz: UserQuiz) => {
    if (!isQuizReady(quiz)) {
      setMsgBoth(t.quizNeedQs, true);
      return;
    }
    openKahootQuiz(quiz);
  };

  if (phase === "edit") {
    return (
      <Screen padded={false}>
        <TopBar title={editId ? t.quizEdit : t.quizCreate} onBack={() => setPhase("list")} />
        <div className="px-5 pb-28">
          {!currentUser && <p className="mt-2 text-sm text-danger">{t.quizNeedLogin}</p>}
          <label className="mt-2 block text-xs font-semibold uppercase tracking-widest text-muted">{t.quizTitleField}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 80))}
            placeholder={t.quizTitlePh}
            className="mt-2 w-full rounded-2xl border-2 border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <label className="mt-3 block text-xs font-semibold uppercase tracking-widest text-muted">{t.quizDesc}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 240))}
            placeholder={t.quizDescPh}
            rows={2}
            className="mt-2 w-full resize-none rounded-2xl border-2 border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setIsPublic((v) => !v)}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-3 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isPublic ? <Globe className="h-4 w-4" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{isPublic ? t.quizPublic : t.quizPrivate}</span>
              <span className="text-xs text-muted">{t.quizPublicHint}</span>
            </span>
          </button>

          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-muted">
            {t.quizQuestions} · {questions.filter((q) => q.prompt.trim()).length}/{QUIZ_MAX_Q}
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {questions.map((q, i) => {
              const open = qOpen === i;
              const type = q.type ?? "choice";
              return (
                <Card key={i} className="overflow-hidden p-0">
                  <button type="button" onClick={() => setQOpen(open ? -1 : i)} className="flex w-full items-center gap-2 p-3 text-left">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                    <span className="text-base" aria-hidden>
                      {TYPE_META.find((m) => m.id === type)?.icon ?? "📝"}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {q.prompt.trim() || t.quizPrompt}
                      {((type === "image" && q.image) || (type === "pickImage" && q.optionImages?.some(Boolean))) && (
                        <span className="ml-1" aria-hidden>
                          📷
                        </span>
                      )}
                    </span>
                    {questions.length > QUIZ_MIN_Q && (
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuestions((cur) => cur.filter((_, j) => j !== i));
                          setQOpen(0);
                        }}
                        className="text-muted"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </span>
                    )}
                  </button>
                  {open && (
                    <div className="border-t border-line px-3 pb-3 pt-2">
                      {/* Savol turi */}
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{t.quizTypeLabel}</p>
                      <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {TYPE_META.map((m) => {
                          const label =
                            m.id === "choice"
                              ? t.quizTypeChoice
                              : m.id === "tf"
                                ? t.quizTypeTf
                                : m.id === "image"
                                  ? t.quizTypeImage
                                  : t.quizTypePickImage;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setType(i, m.id)}
                              className={cn(
                                "shrink-0 rounded-full border-2 px-3 py-1.5 text-xs font-semibold",
                                type === m.id ? "border-primary bg-primary text-white" : "border-line bg-surface text-ink",
                              )}
                            >
                              {m.icon} {label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Savol matni / statement */}
                      <textarea
                        value={q.prompt}
                        onChange={(e) => patchQ(i, { prompt: e.target.value.slice(0, 240) })}
                        placeholder={type === "tf" ? "Iborat (to'g'ri yoki noto'g'ri)" : t.quizPrompt}
                        rows={2}
                        className="mt-3 w-full resize-none rounded-xl border-2 border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                      />

                      {/* Savol rasmi (image turi) */}
                      {type === "image" && (
                        <ImagePick
                          label={t.quizAddImage}
                          hint={t.quizImageHint}
                          url={q.image}
                          onPick={(input) => void onPickImage(i, input, "q")}
                          onClear={() => patchQ(i, { image: undefined })}
                          removeLabel={t.quizRemoveImage}
                        />
                      )}

                      {/* Variantlar */}
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">{t.quizCorrect}</p>
                      <div className="mt-1.5 flex flex-col gap-2">
                        {(type === "tf" ? TF_OPTIONS : q.options).map((opt, oi) => {
                          return (
                            <div key={oi} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => patchQ(i, { answer: oi })}
                                className={cn(
                                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold",
                                  q.answer === oi ? "border-success bg-success text-white" : "border-line text-muted",
                                )}
                              >
                                {String.fromCharCode(65 + oi)}
                              </button>
                              {type === "pickImage" ? (
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <label
                                    className={cn(
                                      "flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2",
                                      (q.optionImages?.[oi] ?? "") ? "border-primary bg-primary/10" : "border-dashed border-line text-muted",
                                    )}
                                  >
                                    {(q.optionImages?.[oi] ?? "") ? (
                                      <img src={q.optionImages![oi]} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                      <ImagePlus className="h-4 w-4" aria-hidden />
                                    )}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => void onPickImage(i, e.currentTarget, "opt", oi)}
                                    />
                                  </label>
                                  {q.optionImages?.[oi] && (
                                    <button
                                      type="button"
                                      onClick={() => setOptionImage(i, oi, "")}
                                      aria-label={t.quizRemoveImage}
                                      className="text-muted"
                                    >
                                      <ImageOff className="h-4 w-4" aria-hidden />
                                    </button>
                                  )}
                                  <input
                                    value={opt}
                                    onChange={(e) =>
                                      patchQ(i, { options: q.options.map((o, k) => (k === oi ? e.target.value.slice(0, 80) : o)) })
                                    }
                                    placeholder={fmt(t.quizOption, { n: String.fromCharCode(65 + oi) })}
                                    className="min-w-0 flex-1 rounded-xl border-2 border-line bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                                  />
                                </div>
                              ) : (
                                <input
                                  value={type === "tf" ? opt : opt}
                                  readOnly={type === "tf"}
                                  onChange={(e) =>
                                    patchQ(i, { options: q.options.map((o, k) => (k === oi ? e.target.value.slice(0, 80) : o)) })
                                  }
                                  placeholder={fmt(t.quizOption, { n: String.fromCharCode(65 + oi) })}
                                  className={cn(
                                    "min-w-0 flex-1 rounded-xl border-2 bg-surface px-3 py-2 text-sm outline-none focus:border-primary",
                                    type === "tf" ? "border-line bg-surface2 text-muted" : "border-line",
                                  )}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {type === "pickImage" && (
                        <p className="mt-2 text-[11px] text-muted">{t.quizOptionImageRequired}</p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          {questions.length < QUIZ_MAX_Q && (
            <button
              type="button"
              onClick={() => {
                setQuestions((cur) => [...cur, emptyQ()]);
                setQOpen(questions.length);
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line py-3 text-sm font-semibold text-muted"
            >
              <Plus className="h-4 w-4" aria-hidden /> {t.quizAddQ}
            </button>
          )}
          {msg && <p className={cn("mt-3 text-center text-sm", msgErr ? "text-danger" : "text-primary")}>{msg}</p>}
          <Button className="mt-4 w-full" loading={saving} disabled={!currentUser} onClick={() => void save()}>
            {t.quizSave}
          </Button>
          {editId && (
            <Button
              className="mt-2 w-full"
              variant="secondary"
              onClick={() =>
                host({
                  id: editId,
                  owner_id: currentUser?.id ?? "",
                  owner_name: currentUser?.username ?? "",
                  title: title.trim() || t.quizStudio,
                  description,
                  is_public: isPublic,
                  questions: questions
                    .map((q) => ({
                      prompt: q.prompt.trim(),
                      options:
                        q.type === "tf"
                          ? [...TF_OPTIONS]
                          : q.options.map((o) => o.trim()).filter(Boolean),
                      answer: q.answer,
                      type: q.type,
                      image: q.image,
                      optionImages: q.optionImages,
                    }))
                    .filter((q) => q.prompt && q.options.length >= 2),
                  created_at: "",
                  updated_at: "",
                })
              }
            >
              <Play className="h-4 w-4" aria-hidden /> {t.quizHost}
            </Button>
          )}
        </div>
      </Screen>
    );
  }

  const rows = tab === "mine" ? mine : community.filter((q) => q.owner_id !== currentUser?.id || q.is_public);

  return (
    <Screen padded={false}>
      <TopBar title={t.quizStudio} />
      <div className="px-5 pb-28">
        <p className="text-sm text-muted">{t.quizStudioSub}</p>
        <Button className="mt-4 w-full" onClick={startNew} disabled={!currentUser}>
          <Plus className="h-4 w-4" aria-hidden /> {t.quizCreate}
        </Button>
        {!currentUser && <p className="mt-2 text-center text-xs text-muted">{t.quizNeedLogin}</p>}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTab("mine")}
            className={cn(
              "rounded-2xl border-2 py-2.5 text-sm font-semibold",
              tab === "mine" ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface",
            )}
          >
            {t.quizMine}
          </button>
          <button
            type="button"
            onClick={() => setTab("community")}
            className={cn(
              "rounded-2xl border-2 py-2.5 text-sm font-semibold",
              tab === "community" ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface",
            )}
          >
            {t.quizCommunity}
          </button>
        </div>

        {busy && <p className="mt-6 text-center text-sm text-muted">{t.pleaseWait}</p>}
        {!busy && rows.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted">{tab === "mine" ? t.quizEmptyMine : t.quizEmptyCommunity}</p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {rows.map((q) => (
            <Card key={q.id} className="p-4">
              <p className="text-sm font-semibold leading-snug">{q.title}</p>
              {q.description ? <p className="mt-1 text-xs text-muted">{q.description}</p> : null}
              <p className="mt-1 text-[11px] text-muted">
                {fmt(t.quizN, { n: q.questions.length })}
                {q.questions.some((x) => x.image || x.optionImages?.length) && " · 📷"}
                {tab === "community" ? ` · ${t.quizBy}: ${q.owner_name || "—"}` : q.is_public ? ` · ${t.quizPublic}` : ` · ${t.quizPrivate}`}
              </p>
              <div className="mt-3 flex gap-2">
                <Button className="flex-1" size="sm" onClick={() => host(q)} disabled={!isQuizReady(q)}>
                  <Users className="h-4 w-4" aria-hidden /> {t.quizHost}
                </Button>
                {tab === "mine" && (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => startEdit(q)}>
                      <Pencil className="h-4 w-4" aria-hidden />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!currentUser) return;
                        void deleteQuiz(currentUser.id, q.id).then((ok) => {
                          if (ok) setMine((cur) => cur.filter((x) => x.id !== q.id));
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/** Rasm tanlash maydoni — preview bilan. */
function ImagePick({
  label,
  hint,
  url,
  onPick,
  onClear,
  removeLabel,
}: {
  label: string;
  hint: string;
  url?: string;
  onPick: (input: HTMLInputElement) => void;
  onClear: () => void;
  removeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-3">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.currentTarget)} />
      {url ? (
        <div className="relative overflow-hidden rounded-xl border-2 border-primary bg-surface2">
          <img src={url} alt="" className="mx-auto max-h-44 object-contain" />
          <button
            type="button"
            onClick={onClear}
            aria-label={removeLabel}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-line px-3 py-5 text-muted active:scale-[.98]"
        >
          <ImagePlus className="h-6 w-6" aria-hidden />
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-[11px] text-muted/80">{hint}</span>
        </button>
      )}
    </div>
  );
}
