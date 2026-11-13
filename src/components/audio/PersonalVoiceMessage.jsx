import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AudioLines, Pause, Play, RotateCcw } from 'lucide-react';
import { birthday } from '../../data/birthday';
import './PersonalVoiceMessage.css';

const waveform = [18, 29, 13, 37, 22, 44, 26, 34, 17, 48, 27, 38, 20, 43, 15, 32, 23, 46, 18, 35, 25, 41, 16, 30, 21, 39, 14, 28];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

export default function PersonalVoiceMessage({ src = birthday.audioPath }) {
  const audioRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState(src ? 'loading' : 'missing');
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setPlaying(false);
    setEnded(false);
    setCurrentTime(0);
    setDuration(0);
    setError('');

    if (!src) {
      setStatus('missing');
      return undefined;
    }

    setStatus('loading');
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const setReady = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
      setStatus('ready');
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onPlay = () => { setPlaying(true); setEnded(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      setCurrentTime(Number.isFinite(audio.duration) ? audio.duration : audio.currentTime);
    };
    const onError = () => {
      setPlaying(false);
      setStatus('missing');
      setError('');
    };

    audio.addEventListener('loadedmetadata', setReady);
    audio.addEventListener('durationchange', setReady);
    audio.addEventListener('canplay', setReady);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.src = /^(https?:|data:|blob:)/i.test(src)
      ? src
      : `${import.meta.env.BASE_URL}${src.replace(/^\/+/, '')}`;
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', setReady);
      audio.removeEventListener('durationchange', setReady);
      audio.removeEventListener('canplay', setReady);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeAttribute('src');
      audio.load();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [src]);

  const playPause = async () => {
    const audio = audioRef.current;
    if (!audio || status !== 'ready') return;
    setError('');
    if (playing) {
      audio.pause();
      return;
    }
    if (ended || (duration > 0 && audio.currentTime >= duration)) {
      audio.currentTime = 0;
      setCurrentTime(0);
      setEnded(false);
    }
    try {
      await audio.play();
    } catch {
      setPlaying(false);
      setError('Playback didn’t start. Tap play once more to try again.');
    }
  };

  const seek = (event) => {
    const audio = audioRef.current;
    if (!audio || status !== 'ready' || !Number.isFinite(audio.duration)) return;
    const nextTime = Number(event.currentTarget.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    if (ended && nextTime < audio.duration) setEnded(false);
  };

  const available = status === 'ready';
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return <motion.section
    className="personal-voice"
    aria-labelledby="personal-voice-title"
    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: .18 }}
    transition={{ duration: reduceMotion ? 0 : .75, ease: [.22, .75, .25, 1] }}
  >
    <div className="personal-voice-inner">
      <p className="personal-voice-eyebrow">a keepsake to listen to</p>
      <h2 id="personal-voice-title">{birthday.cinematic.voiceHeading}</h2>
      <p className="personal-voice-subtitle">{birthday.cinematic.voiceSubtitle}</p>

      <div className={'voice-cassette' + (playing ? ' is-playing' : '') + (status === 'missing' ? ' is-unavailable' : '')}>
        <div className="cassette-topline"><span>FOR {birthday.herName.toUpperCase()}</span><i>✦</i><span>SIDE A</span></div>
        <div className="cassette-label">
          <span className="cassette-brand">a voice note</span>
          <span className="cassette-name">{birthday.herName}</span>
          <span className="cassette-rule"/>
          <div className="voice-waveform" aria-label={playing ? 'Voice message playing' : 'Voice message paused'}>
            {waveform.map((height, index) => <motion.i
              key={index}
              style={{ height: `${height}px` }}
              animate={playing && !reduceMotion ? { scaleY: [.34, .86, .46, 1, .3] } : { scaleY: .22 }}
              transition={playing && !reduceMotion ? { duration: .75 + (index % 4) * .12, delay: (index % 7) * .035, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : { duration: .16 }}
              aria-hidden="true"
            />)}
          </div>
        </div>
        <div className="cassette-window" aria-hidden="true">
          {[0, 1].map((reel) => <motion.span
            className="cassette-reel"
            key={reel}
            animate={{ rotate: playing && !reduceMotion ? 360 : 0 }}
            transition={playing && !reduceMotion ? { duration: 3.5, repeat: Infinity, ease: 'linear' } : { duration: .2 }}
          ><i/><i/><i/></motion.span>)}
          <span className="cassette-tape-line"/>
        </div>
        <div className="cassette-screws" aria-hidden="true"><i/><i/><i/><i/></div>
      </div>

      <div className="voice-controls">
        <button
          type="button"
          className="voice-play-button"
          onClick={playPause}
          disabled={!available}
          aria-label={playing ? 'Pause Ananya’s voice message' : ended ? 'Replay Ananya’s voice message' : 'Play Ananya’s voice message'}
          aria-pressed={playing}
        >
          {playing ? <Pause size={22} fill="currentColor"/> : ended ? <RotateCcw size={21}/> : <Play size={22} fill="currentColor"/>}
        </button>
        <div className="voice-track">
          <input
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={seek}
            disabled={!available}
            aria-label="Seek in the voice message"
            style={{ '--voice-progress': `${progress}%` }}
          />
          <div className="voice-times"><time>{formatTime(currentTime)}</time><time>{formatTime(duration)}</time></div>
        </div>
      </div>

      <p className="voice-state" role="status" aria-live="polite">
        {status === 'loading' && <><AudioLines size={15}/> Finding your voice note…</>}
        {status === 'ready' && (ended ? 'A little note, just for you.' : playing ? 'A little note, just for you.' : 'Tap play when you’re ready.')}
        {status === 'missing' && 'Your voice message is waiting to be added.'}
      </p>
      {ended && <motion.p className="voice-completion" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .5 }}>{birthday.cinematic.voiceCompletion}</motion.p>}
      {error && <p className="voice-error" role="alert">{error}</p>}
      {status === 'missing' && <p className="voice-file-hint">Place your recording at <code>public{src || '/audio/ananya-voice-note.mp3'}</code>. You can change the path in <code>birthday.js</code>.</p>}
    </div>
  </motion.section>;
}
