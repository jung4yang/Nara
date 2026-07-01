import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScreenShell from '../components/ScreenShell';
import { GENRE_QUESTIONS } from '../data/content';

export default function QuestionsScreen({ branchMode, selectedGenre, onBack, onComplete }) {
  const questions = GENRE_QUESTIONS[selectedGenre] || [];

  const title = '세계관 질문';
  const desc = 'AI가 장르에 맞는 질문을 드립니다. 답변할수록 더 좋은 영상이 만들어집니다.';

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

        <div className="q-progress">질문 {index + 1} / {questions.length}</div>
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
        <button className="btn-back" onClick={prev}>← 이전</button>
        <button className="btn-next" onClick={next}>{isLast ? '시놉시스 생성 →' : '다음 →'}</button>
      </div>
    </ScreenShell>
  );
}
