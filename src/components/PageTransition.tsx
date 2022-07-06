import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import store from '@/lib/store';

const PageTransition = ({ children }: { children: ReactNode }) => {
  const reduceMotion = store((state) => state.configuration.reduceMotion);

  return (
    <motion.span
      initial={{ opacity: 0, scale: reduceMotion ? 0.98 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduceMotion ? 0.98 : 0.95 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.32, ease: [.67, -0.01, .35, 1] }}
      className="absolute"
    >
      {children}
    </motion.span>
  );
};

export default PageTransition;