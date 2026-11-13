import{useRef,useState}from'react';import{AnimatePresence,motion,useReducedMotion}from'framer-motion';import{Heart,ArrowRight}from'lucide-react';import{birthday}from'../../data/birthday';import{Button}from'../common.jsx';import{gsap,useGSAP}from'../../animation/gsapSetup';
const dust=Array.from({length:9},(_,i)=>({x:(i*37+9)%100,y:(i*61+7)%100,d:4+(i%3)*2,delay:(i%5)*-1.3}));
export default function CinematicIntro({onEnter}){const scene=useRef(null),[opened,setOpened]=useState(false),[flapOpen,setFlapOpen]=useState(false),[ready,setReady]=useState(false),reduce=useReducedMotion();const{contextSafe}=useGSAP({scope:scene});
 const openGift=contextSafe(()=>{if(opened)return;setOpened(true);if(reduce){setFlapOpen(true);const reveal=scene.current?.querySelector('.intro-reveal');gsap.set(reveal,{visibility:'visible',autoAlpha:1,y:0});gsap.set(scene.current?.querySelectorAll('.intro-reveal-line'),{autoAlpha:1,y:0});setReady(true);return}const reveal=scene.current?.querySelector('.intro-reveal');gsap.set(reveal,{visibility:'visible',autoAlpha:0,y:14});const seal=scene.current?.querySelector('.wax-seal'),flap=scene.current?.querySelector('.envelope-flap-3d'),letter=scene.current?.querySelector('.envelope-letter-3d'),copy=scene.current?.querySelectorAll('.intro-reveal-line');gsap.timeline({defaults:{ease:'power3.inOut'},onComplete:()=>setReady(true)}).to(seal,{scale:1.45,rotation:12,filter:'brightness(1.8)',duration:.34}).to(seal,{scale:.15,autoAlpha:0,duration:.26,ease:'back.in(2)'},'-=.08').to(flap,{rotateX:-178,duration:.82,transformOrigin:'50% 0%',onComplete:()=>setFlapOpen(true)},'-=.16').to(letter,{y:-76,z:80,rotation:-1.1,autoAlpha:1,duration:1,ease:'power3.out'},'-=.48').to(reveal,{autoAlpha:1,y:0,duration:.42,ease:'power2.out'},'-=.08').to(copy,{autoAlpha:1,y:0,stagger:.17,duration:.65,ease:'power2.out'},'-=.06')});
 return <motion.section ref={scene} className="cinematic-intro" initial={reduce?false:{opacity:0}} animate={{opacity:1}} exit={reduce?{opacity:0}:{opacity:0,scale:1.025,filter:'blur(7px)'}} transition={{duration:reduce?0:.72}} aria-label={'A birthday surprise for '+birthday.herName}>
  <div className="intro-spotlight"/><div className="intro-grain"/><div className="intro-dust" aria-hidden="true">{dust.map((p,i)=><i key={i} style={{'--x':p.x+'%','--y':p.y+'%','--d':p.d+'px','--delay':p.delay+'s'}}/>)}</div>
  <div className="intro-content">
   <motion.p className="intro-kicker" initial={reduce?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:reduce?0:.25,duration:reduce?0:.35}}><span/>A keepsake, made with love<span/></motion.p>
   <motion.h1 initial={reduce?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:reduce?0:.38,duration:reduce?0:.85,ease:[.2,.8,.2,1]}}>{birthday.introLine}</motion.h1>
   <p className="intro-hint">{birthday.introHint}</p>
   <div className="envelope-stage">
    <button type="button" className={'envelope-3d '+(opened?'envelope-started ':'')+(flapOpen?'envelope-flap-open':'')} onClick={openGift} aria-label={opened?'Your envelope is open':'Tap to open your surprise'} aria-expanded={opened}>
     <span className="envelope-shadow"/>
     <span className="envelope-back"/><span className="envelope-lining"/>
     <span className="envelope-letter-3d"><span className="letter-monogram"><Heart size={14}/></span><small>a little note for</small><strong>{birthday.herName}</strong><span className="letter-script">{birthday.envelopeNote}</span></span>
     <span className="envelope-pocket"><i/><b/></span>
     <span className="envelope-flap-3d"/>
     <span className="wax-seal"><Heart size={20} fill="currentColor"/></span>
    </button>
   </div>
   <AnimatePresence>{!opened&&<motion.p className="intro-prompt" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><span className="prompt-dot"/>Tap to open your surprise</motion.p>}</AnimatePresence>
   <div className="intro-reveal" aria-live="polite">
    <p className="intro-reveal-line">For {birthday.herName},</p>
    <h2 className="intro-reveal-line">{birthday.welcome}</h2>
    <Button className="enter-world" onClick={onEnter} disabled={!ready}>Enter our little world <ArrowRight size={16}/></Button>
   </div>
  </div>
  <p className="intro-footer">a small world, made just for you <span>✦</span></p>
 </motion.section>
}
