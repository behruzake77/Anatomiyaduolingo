import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Clock3, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import type { Organ } from '../data/anatomy';
import Dialog from './Dialog';

export type LearningMode = 'learn' | 'quiz' | 'review';

interface LearningDialogProps {
  organ: Organ;
  mode: LearningMode;
  onClose: () => void;
  onComplete: (xp: number, correct: number, total: number) => void;
}

export default function LearningDialog({ organ, mode, onClose, onComplete }: LearningDialogProps) {
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'review' | 'complete'>(mode);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const answerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const question = organ.questions[questionIndex];
  const fact = organ.facts[questionIndex];

  function navigateAnswers(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (checked) return;
    let next = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % question.answers.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + question.answers.length) % question.answers.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = question.answers.length - 1;
    else return;
    event.preventDefault();
    setAnswer(next);
    answerRefs.current[next]?.focus();
  }

  function complete(correct: number, review = false) {
    const xp = review ? 30 : 15 + correct * 15;
    setEarnedXp(xp);
    setScore(correct);
    setPhase('complete');
    onComplete(xp, correct, organ.questions.length);
  }

  function nextQuestion() {
    const newScore = score + (answer === question.correct ? 1 : 0);
    if (questionIndex === organ.questions.length - 1) {
      complete(newScore);
    } else {
      setScore(newScore);
      setQuestionIndex((index) => index + 1);
      setAnswer(null);
      setChecked(false);
    }
  }

  function nextReview() {
    if (questionIndex === organ.facts.length - 1) complete(organ.facts.length, true);
    else { setQuestionIndex((index) => index + 1); setFlipped(false); }
  }

  return (
    <Dialog onClose={onClose} labelledBy="lesson-title" className={`learning-dialog ${phase === 'complete' ? 'is-complete' : ''}`}>
      <div className="lesson-topline"><span className="wordmark">CORPUS</span><span><Clock3 size={14} /> 5 daqiqalik dars</span></div>
      <div className="lesson-stage-indicators" aria-label="Dars bosqichlari">
        {['O\'rganing', 'Mashq qiling', 'Mustahkamlang'].map((label, index) => <span className={(phase === 'learn' ? 0 : phase === 'complete' ? 2 : 1) >= index ? 'active' : ''} key={label}>{String(index + 1).padStart(2, '0')}<span>{label}</span></span>)}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'learn' && <motion.div key="learn" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <p className="eyebrow">VIZUAL DARS</p>
          <h2 id="lesson-title">{organ.name}: tanangizni kashf eting.</h2>
          <p className="lesson-description">{organ.description}</p>
          <div className="lesson-content-grid">
            <div className={`lesson-organ-image image-${organ.id}`}><img src={organ.image} alt={`${organ.name} anatomik modeli`} /></div>
            <div className="lesson-facts">{organ.facts.map((item, index) => <div key={item.title}><span className="fact-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div>
          </div>
          <div className="lesson-bottom"><span><BookOpen size={16} /> Kichik dars. Katta kashfiyot.</span><button className="button button-primary" onClick={() => setPhase('quiz')}>Bilimingizni sinang <ArrowRight size={18} /></button></div>
        </motion.div>}
        {phase === 'quiz' && <motion.div key={`quiz-${questionIndex}`} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}>
          <div className="quiz-meta"><p className="eyebrow">{organ.name.toUpperCase()} / INTERAKTIV MASHQ</p><span>{questionIndex + 1} / {organ.questions.length}</span></div>
          <div className="quiz-progress"><span style={{ width: `${((questionIndex + 1) / organ.questions.length) * 100}%` }} /></div>
          <h2 id="lesson-title" className="quiz-question">{question.question}</h2>
          <div className="quiz-answers" role="radiogroup" aria-label="Javobni tanlang">
            {question.answers.map((option, index) => <button ref={(element) => { answerRefs.current[index] = element; }} key={option} role="radio" aria-checked={answer === index} tabIndex={(answer ?? 0) === index ? 0 : -1} disabled={checked} className={`quiz-answer ${answer === index ? 'selected' : ''} ${checked && index === question.correct ? 'correct' : ''} ${checked && answer === index && index !== question.correct ? 'incorrect' : ''}`} onClick={() => setAnswer(index)} onKeyDown={(event) => navigateAnswers(event, index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{checked && index === question.correct ? <Check size={19} /> : checked && answer === index ? <X size={19} /> : <span className="answer-radio" />}</button>)}
          </div>
          {checked && <motion.div role="status" className={`answer-feedback ${answer === question.correct ? 'is-correct' : ''}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}><strong>{answer === question.correct ? "To'g'ri! Juda yaxshi." : "Yaxshi urinish. Birga eslab qolamiz."}</strong><p>{question.explanation}</p></motion.div>}
          <div className="lesson-bottom"><button className="text-button muted" onClick={() => { setPhase('learn'); setQuestionIndex(0); setAnswer(null); setChecked(false); setScore(0); }}><ArrowLeft size={16} /> Darsga qaytish</button><button className="button button-primary" disabled={answer === null} onClick={checked ? nextQuestion : () => setChecked(true)}>{checked ? questionIndex === organ.questions.length - 1 ? "Natijani ko'rish" : 'Keyingi savol' : 'Javobni tekshirish'}<ArrowRight size={18} /></button></div>
        </motion.div>}
        {phase === 'review' && <motion.div key={`review-${questionIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <p className="eyebrow">FAOL ESLASH / {questionIndex + 1} / {organ.facts.length}</p>
          <h2 id="lesson-title">Bilimingizni mustahkamlang.</h2>
          <p className="lesson-description">Avval o'zingiz eslashga harakat qiling. Keyin javobni oching.</p>
          <button className={`review-flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label={flipped ? 'Savolni ko`rsatish' : 'Javobni ochish'}>
            <RotateCcw size={25} /><span className="flashcard-label">{flipped ? 'ESLAB QOLING' : organ.name.toUpperCase()}</span><strong>{fact.title}</strong>{flipped ? <p>{fact.text}</p> : <p>Bu haqida nimalarni bilasiz?</p>}<span className="flashcard-hint">{flipped ? 'Savolga qaytish uchun bosing' : "Javobni ko'rish uchun bosing"}</span>
          </button>
          <div className="lesson-bottom"><span><Sparkles size={16} /> Takrorlash xotirani kuchaytiradi.</span><button className="button button-primary" disabled={!flipped} onClick={nextReview}>Esda qoldi <Check size={18} /></button></div>
        </motion.div>}
        {phase === 'complete' && <motion.div className="lesson-complete" key="complete" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="completion-symbol"><Trophy size={43} /></div><p className="eyebrow">YANA BIR QADAM OLDINGA</p><h2 id="lesson-title">Kichik dars. Haqiqiy natija.</h2><p>{mode === 'review' ? "Bilimingizni muvaffaqiyatli takrorladingiz. Ajoyib davom etyapsiz!" : `${organ.questions.length} ta savoldan ${score} tasiga to'g'ri javob berdingiz. Har bir urinish sizni bilimga yaqinlashtiradi.`}</p>
          <div className="completion-xp"><Sparkles size={24} /><strong>+{earnedXp} XP</strong><span>hisobingizga qo'shildi</span></div><div className="saved-message"><CheckCircle2 size={16} /> Natijangiz ushbu qurilmada saqlandi.</div>
          <button className="button button-primary" onClick={onClose}>Davom etamiz <ArrowRight size={18} /></button>
        </motion.div>}
      </AnimatePresence>
    </Dialog>
  );
}