import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { GENRE_QUESTIONS } from '../data/content';
import { useLang } from '../i18n';

export default function QuestionsScreen({ branchMode, selectedGenre, onBack, onComplete }) {
  const { t } = useLang();
  const qt = t.flow.questions;
  const questions = GENRE_QUESTIONS[selectedGenre] || [];

  const title = qt.title;
  const desc = qt.desc;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => new Array(questions.length).fill(''));

  useEffect(() => { setAnswers(new Array(questions.length).fill('')); setIndex(0); }, [branchMode, selectedGenre]);

  const isLast = index === questions.length - 1;
  const q = questions[index] || { q: '', p: '' };

  const next = () => {
    if (!isLast) setIndex((i) => i + 1);
    else onComplete(answers);
  };
  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
    else onBack();
  };
  const setAnswer = (v) => {
    setAnswers((prev) => prev.map((a, i) => (i === index ? v : a)));
  };

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <div className="screen-title">{title}</div>
        <div className="screen-desc">{desc}</div>

        <div className="q-progress">{qt.progress} {index + 1} / {questions.length}</div>
        <div className="q-dots">
          {questions.map((_, i) => (
            <div key={i} className={`q-dot ${i < index ? 'done' : ''} ${i === index ? 'active' : ''}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="node-question" style={{ fontSize: 20, marginTop: 28 }}>{q.q}</div>
            <textarea
              className="node-answer"
              placeholder={q.p}
              value={answers[index] || ''}
              onChange={(e) => setAnswer(e.target.value)}
              autoFocus
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={prev}><ArrowLeft size={15} /> {t.common.back}</button>
        <button className="btn-next" onClick={next}>{isLast ? <>{qt.genSynopsis} <ArrowRight size={15} /></> : <>{t.common.next} <ArrowRight size={15} /></>}</button>
      </div>
    </ScreenShell>
  );
}
