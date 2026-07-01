import { AnimatePresence, motion } from 'framer-motion';

export default function Overlay({ show, text, sub }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="gen-overlay show"
          style={{ display: 'flex' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="gen-spinner" />
          <motion.div
            className="gen-text"
            key={text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {text}
          </motion.div>
          <div className="gen-sub">{sub || '잠시만 기다려주세요'}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
