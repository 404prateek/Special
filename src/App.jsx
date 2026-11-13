import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CinematicIntro from './components/experience/CinematicIntro';
import CinematicJourney from './components/experience/CinematicJourney';

export default function App() {
  const [stage, setStage] = useState('intro');
  return <main className="story-app">
    <AnimatePresence mode="wait">
      <motion.div className={'stage-host ' + (stage === 'story' ? 'stage-host--story' : '')} key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
        {stage === 'intro' ? <CinematicIntro onEnter={() => setStage('story')} /> : <CinematicJourney onReplay={() => setStage('intro')} />}
      </motion.div>
    </AnimatePresence>
  </main>;
}
