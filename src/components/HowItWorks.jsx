import { motion } from 'framer-motion';
import { useLang } from '../i18n';

export default function HowItWorks({ hiwRef }) {
  const { t } = useLang();
  const steps = t.hiw.steps;
  return (
    <div className="hiw show" id="hiw" ref={hiwRef}>
      <div className="hiw-inner">
        <div className="hiw-sticky">
          <div className="hiw-eyebrow">{t.hiw.eyebrow}</div>
          <div className="hiw-headline">{t.hiw.headline[0]}<br />{t.hiw.headline[1]}</div>
          <div className="hiw-sub">{t.hiw.sub[0]}<br />{t.hiw.sub[1]}</div>
        </div>
        <div className="hiw-steps">
          {steps.map((s, i) => (
            <motion.div
              className="hiw-step"
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <div className="hiw-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div className="hiw-step-cat">{s.cat}</div>
                <div className="hiw-step-title">{s.title}</div>
                <div className="hiw-step-desc">{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
