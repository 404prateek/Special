import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowDown, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { birthday } from '../../data/birthday';
import { gsap, ScrollTrigger, useGSAP } from '../../animation/gsapSetup';
import PersonalVoiceMessage from '../audio/PersonalVoiceMessage';
import LoveLetterSection from '../../sections/LoveLetter/LoveLetterSection';
import SecretGiftSection from '../../sections/SecretGift/SecretGiftSection';
import BirthdayFinaleSection from '../../sections/BirthdayFinale/BirthdayFinaleSection';

function assetUrl(path) {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

function FilmPhoto({ item, className = '', hideCaption = false }) {
  const [failed, setFailed] = useState(false);
  return <figure className={'film-photo ' + className}>
    {item?.image && !failed
      ? <img src={assetUrl(item.image)} alt={item.title || 'Photograph to add later'} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      : <div className="film-photo-fallback"><ImageIcon aria-hidden="true" size={28}/><span>[ADD_PHOTO_PATH]</span></div>}
    {!hideCaption && item?.caption && <figcaption>{item.caption}</figcaption>}
  </figure>;
}

function FilmChapter({ number, eyebrow, title, children, kind = '', id, pin = false }) {
  return <section className={'film-sequence ' + kind} id={id} data-film-chapter={number} data-pin={pin || undefined} aria-label={title || eyebrow}>
    <div className="film-stage">
      <span className="film-wash" aria-hidden="true"/><span className="film-orbit film-orbit-one" aria-hidden="true"/><span className="film-orbit film-orbit-two" aria-hidden="true"/>
      <div className="film-scene-content">
        {eyebrow && <p className="film-eyebrow">{eyebrow}</p>}{title && <h2 className="film-title">{title}</h2>}{children}
      </div><span className="film-grain" aria-hidden="true"/>
    </div>
  </section>;
}

function AlbumPhoto({ item, index }) {
  const [failed, setFailed] = useState(false);
  return <figure className={'album-photo' + (item.crop === 'square-center' ? ' album-photo-square-crop' : '')} style={{ '--album-index': index }}>
    {!failed
      ? <img src={assetUrl(item.image)} alt={item.title} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      : <div className="album-photo-fallback"><ImageIcon aria-hidden="true" size={26}/><span>Photo not found</span></div>}
    <figcaption>{item.title}</figcaption>
  </figure>;
}

function AlbumGroup({ title, entries }) {
  return <section className="album-group" aria-label={title}>
    <h3>{title}</h3>
    <div className="album-grid">{entries.map((item, index) => <AlbumPhoto key={item.image} item={item} index={index}/>)}</div>
  </section>;
}

const collagePhotos = [
  birthday.photoAlbum.herFavourites[0],
  birthday.photoAlbum.together[0],
  birthday.photoAlbum.childhood[0],
  birthday.photoAlbum.herFavourites[5],
];

export default function CinematicJourney({ onReplay }) {
  const root = useRef(null);
  const reduce = useReducedMotion();
  const [chapter, setChapter] = useState(1);

  useGSAP(() => {
    if (!root.current || reduce) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 760px)' }, ({ conditions }) => {
      const scenes = gsap.utils.toArray('[data-film-chapter]', root.current);
      scenes.forEach((scene, index) => {
        const stage = scene.querySelector('.film-stage');
        const pin = scene.hasAttribute('data-pin');
        const distance = window.innerHeight * (conditions.desktop ? (index === 2 ? 2.65 : 2.25) : (index === 2 ? 1.95 : 1.65));
        const timeline = gsap.timeline({scrollTrigger:{trigger:scene,...(pin?{pin:stage,pinSpacing:true}:{}),start:'top top',end:pin?'+='+distance:'bottom 72%',scrub:pin?.85:false,anticipatePin:pin?1:0,invalidateOnRefresh:true,onEnter:()=>setChapter(Number(scene.dataset.filmChapter)),onEnterBack:()=>setChapter(Number(scene.dataset.filmChapter))}});
        const q = (selector) => scene.querySelector(selector);
        if (scene.classList.contains('film-hero')) {
          const heroImage=q('.hero-photo img');
          timeline.fromTo(q('.hero-photo'),{autoAlpha:.38,scale:.78,y:34,rotation:-1.6},{autoAlpha:1,scale:1,y:0,rotation:-.4,duration:1.5});
          if(heroImage)timeline.to(heroImage,{scale:1.13,xPercent:2,duration:1.7,ease:'none'},'<');
          timeline.fromTo(q('.hero-caption'),{autoAlpha:0,y:15},{autoAlpha:1,y:0,duration:.6},'-=.55')
            .to(q('.hero-photo'),{scale:1.055,x:-16,duration:1.2},'+=.15');
        } else if (scene.classList.contains('film-memories')) {
          const frames=scene.querySelectorAll('.memory-frame');
          timeline.fromTo(q('.film-eyebrow'),{autoAlpha:0},{autoAlpha:1,duration:.3}).fromTo(q('.film-title'),{autoAlpha:0,y:15},{autoAlpha:1,y:0,duration:.45},'-.12');
          frames.forEach((frame,i)=>{const featured=frame.dataset.featured==='true';timeline.fromTo(frame,{autoAlpha:0,scale:.82,x:i%2?90:-90,y:26,rotation:i%2?4:-4},{autoAlpha:1,scale:featured?1.035:1,x:0,y:0,rotation:i%2?1.6:-1.8,duration:featured?1.35:1},i?'>-.1':'+=.12');if(featured)timeline.to(frame.querySelector('.memory-photo'),{scale:1.025,duration:.55},'+=.08');if(i<frames.length-1){timeline.to(frame,{autoAlpha:featured ? .34 : .2,scale:.93,x:i%2?-30:30,duration:featured ? .72 : .55},'+=.24');timeline.to(frame.querySelector('.memory-copy'),{autoAlpha:0,duration:.2},'<')}});
          timeline.to(frames,{autoAlpha:.72,scale:.91,duration:.38,stagger:.04},'+=.08');
        } else if (scene.classList.contains('film-collage')) {
          const photos=scene.querySelectorAll('.collage-photo');
          photos.forEach((photo,i)=>timeline.fromTo(photo,{autoAlpha:0,scale:.62,y:48+(i%2)*18,rotation:i%2?9:-9},{autoAlpha:1,scale:1,y:0,rotation:Number(photo.dataset.rotation),duration:.72},i?'>-.12':'+=.1'));
          timeline.fromTo(q('.collage-message'),{autoAlpha:0,scale:.95,y:12},{autoAlpha:1,scale:1,y:0,duration:.55},'-.1')
            .to(photos,{x:(i)=>Number(photos[i].dataset.settleX),y:(i)=>Number(photos[i].dataset.settleY),scale:.92,duration:.8,stagger:.04},'+=.12')
            .to(q('.collage-hold'),{scale:1.025,duration:.6});
        } else if (scene.classList.contains('film-reasons')) {
          const reasons=scene.querySelectorAll('.reason-line');
          timeline.fromTo(q('.film-eyebrow'),{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.35}).fromTo(q('.film-title'),{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.5},'-.1');
          reasons.forEach((reason,i)=>{timeline.fromTo(reason,{autoAlpha:0,y:24,scale:.97},{autoAlpha:1,y:0,scale:1,duration:.55},i?'>-.12':'+=.15');if(i<reasons.length-1)timeline.to(reason,{autoAlpha:.16,y:-8,scale:.98,duration:.38},'+=.45')});
        } else if (scene.classList.contains('film-letter')) {
          timeline.fromTo(q('.film-title'),{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.55}).fromTo(q('.letter-scene'),{autoAlpha:0,y:12},{autoAlpha:1,y:0,duration:.7},'-.15');
        } else if (q('.film-title')) timeline.fromTo(q('.film-title'),{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.55});
      });
      const finale=root.current.querySelector('#birthday');
      if(finale)ScrollTrigger.create({trigger:finale,start:'top 68%',onEnter:()=>setChapter(5),onEnterBack:()=>setChapter(5)});
      const progressLine=root.current.querySelector('.film-progress span');
      ScrollTrigger.create({trigger:root.current,start:'top top',end:'bottom bottom',onUpdate:self=>gsap.set(progressLine,{scaleY:self.progress})});
      requestAnimationFrame(()=>ScrollTrigger.refresh());
    });
    return ()=>mm.revert();
  },{scope:root,dependencies:[reduce]});

  useEffect(()=>{if(!root.current||typeof ResizeObserver==='undefined')return;const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(root.current);return()=>observer.disconnect()},[]);

  return <div className="cinematic-journey" ref={root} id="film">
    <a className="film-skip" href="#birthday">Skip to the birthday finale</a>
    <div className="film-progress" aria-hidden="true"><span/></div>
    <div className="film-chapter-indicator" aria-live="polite"><span>CHAPTER</span><b>{String(chapter).padStart(2,'0')}</b><i/><em>05</em></div>
    <div className="film-scroll-cue"><ArrowDown size={14}/><span>scroll to wander</span></div>

    <FilmChapter number="1" eyebrow="CHAPTER 01 · A LITTLE WORLD" title={birthday.cinematic.herWorldTitle} kind="film-hero" id="her-world" pin>
      <div className="hero-composition"><FilmPhoto item={birthday.herStory[0]} className="hero-photo" hideCaption/><p className="hero-caption">{birthday.herStory[0]?.caption || '[A LITTLE THING I LOVE ABOUT YOU]'}</p><span className="hero-margin-note">{birthday.herStory[0]?.note}</span></div>
    </FilmChapter>

    <section className="photo-album" id="ananya-photos" aria-labelledby="photo-album-title">
      <header className="photo-album-heading"><p className="album-eyebrow">A LITTLE PHOTO ALBUM</p><h2 id="photo-album-title">{birthday.photoAlbum.heading}</h2><p>{birthday.photoAlbum.subtitle}</p><span aria-hidden="true">✦</span></header>
      <AlbumGroup title={birthday.photoAlbum.childhoodTitle} entries={birthday.photoAlbum.childhood}/>
      <AlbumGroup title={birthday.photoAlbum.favouritesTitle} entries={birthday.photoAlbum.herFavourites}/>
      <AlbumGroup title={birthday.photoAlbum.togetherTitle} entries={birthday.photoAlbum.together}/>
    </section>

    <FilmChapter number="2" eyebrow="CHAPTER 02 · HELD CLOSE" title={birthday.cinematic.ourStoryTitle} kind="film-memories" id="our-story-film" pin>
      <div className="memory-composition">{birthday.memories.map((item,i)=><div className={'memory-frame memory-frame-'+i+(item.featured?' memory-frame-featured':'')} data-featured={item.featured?'true':'false'} key={i}><FilmPhoto item={item} className="memory-photo" hideCaption/><div className="memory-copy"><h3>{item.title}</h3><p>{item.caption}</p></div></div>)}</div><p className="memory-scroll-note">little moments, passing through</p>
    </FilmChapter>

    <section className="awkward-interlude" id="bhondu-photos" aria-labelledby="awkward-title">
      <div className="awkward-inner">
        <header className="awkward-heading"><p className="awkward-eyebrow">{birthday.awkwardPhotos.eyebrow}</p><h2 id="awkward-title">{birthday.awkwardPhotos.heading}</h2><p>{birthday.awkwardPhotos.subtitle}</p><span className="awkward-tag">{birthday.awkwardPhotos.tag}</span></header>
        <div className="awkward-grid">{birthday.awkwardPhotos.photos.map((item, index) => <div className="awkward-photo-wrap" key={item.image}>
          <FilmPhoto item={item} className="awkward-photo"/>
          <span className="awkward-photo-tag" aria-label={birthday.awkwardPhotos.tag}>{birthday.awkwardPhotos.tag}</span>
        </div>)}</div>
      </div>
    </section>

    <FilmChapter number="2" eyebrow="A FEW THINGS, ALL TOGETHER" kind="film-collage" id="memory-collage" pin>
      <div className="collage-composition">{collagePhotos.map((item,i)=><div className={'collage-photo collage-photo-'+i} key={i} data-rotation={[-7,5,3,-4][i]} data-settle-x={[0,20,-22,0][i]} data-settle-y={[10,8,-12,22][i]}><FilmPhoto item={item} className="collage-polaroid"/></div>)}<article className="collage-message collage-hold"><span>✦</span><p>{birthday.cinematic.collageMessage}</p></article></div>
    </FilmChapter>

    <FilmChapter number="3" eyebrow="CHAPTER 03 · A LIST THAT KEEPS GROWING" title={birthday.cinematic.reasonsTitle} kind="film-reasons" id="reasons-film" pin>
      <div className="reasons-sequence">{birthday.reasons.map((reason,i)=><article className="reason-line" key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{reason}</p><i>✦</i></article>)}</div><p className="reasons-scroll-note">and many more, still unwritten</p>
    </FilmChapter>

    <FilmChapter number="4" eyebrow="CHAPTER 04 · TAKE YOUR TIME" title={birthday.cinematic.letterTitle} kind="film-letter" id="letter-film">
      <div className="quiet-letter"><p className="quiet-letter-note">The world can wait a little.</p><LoveLetterSection/></div>
    </FilmChapter>
    <section className="voice-interlude" aria-label="A transition to a personal voice message"><p>{birthday.cinematic.voiceTransition}</p><span>✦</span></section>
    <PersonalVoiceMessage src={birthday.audioPath}/>
    <section className="film-extra" data-film-chapter="5" id="surprise-film"><p className="film-eyebrow">ONE MORE LITTLE THING</p><SecretGiftSection/></section>
    <div className="finale-transition" aria-hidden="true"><span>and now, a wish for you</span></div>
    <div className="film-finale"><BirthdayFinaleSection onReplay={onReplay}/></div>
    <footer className="film-end"><span>✦</span><p>A little world, made for you.</p><button type="button" onClick={onReplay}><RotateCcw size={14}/>begin again</button></footer>
  </div>;
}
