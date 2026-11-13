# A Little World Made for You

A frontend-only birthday story for Ananya, designed as an interactive short film told through a personal scrapbook world. Scroll position controls the photographs, transitions, and chapter reveals.

## Experience

- Open a layered 3D envelope to reveal the welcome note.
- Scroll through pinned, scrubbed scenes for Her World, Our Little Story, a memory collage, and Things I Love About You.
- See a playful candid-photo interlude tagged “my bhondu 😂” between the relationship story and collage.
- Pause in the quieter letter chapter, open the letter, then continue to the surprise and birthday finale.
- Find a dedicated voice-message moment between the letter and the final surprise. The cassette player supports play, pause, progress, seeking, duration, and replay.
- Follow the small chapter marker and scroll progress line; pinned distances adapt on mobile.
- Blow out the cake candles to trigger confetti and reveal the final wish.
- Optional local audio is visitor-controlled and never autoplays; reduced-motion settings disable pinned animation.

## Technology

React 18, Vite 6, Tailwind CSS 3.4, Framer Motion, GSAP with ScrollTrigger, Lucide React, and canvas-confetti. GSAP animations are scoped and cleaned up with @gsap/react. Native scrolling is used; Lenis is not required.

## Project layout

- public/images/childhood, public/images/her-favourites, public/images/memories, public/images/awkward
- public/audio, public/videos, public/textures
- src/animation/gsapSetup.js
- src/components/animations, book, audio, experience
- src/data/birthday.js
- src/sections/ (one component per chapter)
- src/App.jsx, src/main.jsx, src/index.css, src/storybook.css
- index.html, package.json, Vite and Tailwind configuration

## Install and run

Install Node.js LTS, open this folder in a terminal, then run:

    npm install
    npm run dev

Open the local URL Vite prints, normally http://localhost:5173.

This setup was installed and run with pnpm in the build environment; npm scripts are also provided.

## Personalize

All editable website copy and image paths are in [src/data/birthday.js](src/data/birthday.js). Ananya is already set as the name. Personalize these fields there:

- `herName`, `birthdayDate`, and `senderName`
- Opening copy: `introLine`, `introHint`, `envelopeNote` (`[A_SHORT_NOTE]`), and `welcome`
- Story headings and collage note: `cinematic.herWorldTitle`, `cinematic.ourStoryTitle`, `cinematic.reasonsTitle`, `cinematic.letterTitle`, and `cinematic.collageMessage`
- Her photos: each `herStory` entry has `title`, `caption`, `image`, and handwritten `note`
- Relationship memories: each `memories` entry has `date`, `title`, `caption`, and `image`
- `reasons`, `letter` paragraphs, `surprise.message`, `surprise.mediaPath`, `audioPath`, and `finalWish`
- Voice-player copy and its transition are in `cinematic.voiceHeading`, `cinematic.voiceSubtitle`, `cinematic.voiceTransition`, and `cinematic.voiceCompletion`.
- Optional legacy scrapbook copy: `bookTitle`, `bookSubtitle`, `storyIntro`, and `storyNote`

Every bracketed value such as `[HER_NAME]`, `[REASON_01]`, or `[LOVE_LETTER_PARAGRAPH_01]` is a placeholder; replace it with your own content. The envelope uses the short `envelopeNote` field, so the full letter will not appear inside the small envelope.

Put photos in `public/images/childhood/`, `public/images/her-favourites/`, or `public/images/memories/`. The 16 photos supplied for Ananya are already copied into those folders and displayed in the new “Photographs, held close” album. The album entries are in `birthday.photoAlbum` in `src/data/birthday.js`.

To add another picture, copy its file into one of those folders, then add an entry to the matching array in `birthday.photoAlbum`. Use a path beginning with `/images/`, such as `/images/her-favourites/my-photo.jpeg`. You can change the title shown below each picture in the same entry. The website uses a designed fallback if an image path is incorrect. The separate `herStory` and `memories` arrays control the hero and relationship story images.

## Add Prateek’s voice message

Copy the real recording to `public/audio/ananya-voice-note.mp3`. The configured path is `audioPath: '/audio/ananya-voice-note.mp3'` in `birthday.js`; change it there if you use a different filename. The player does not autoplay. Until the file exists, it shows a designed missing-recording state and tells you where to place it. No recording or music is included in this project.

If you later add ambient sound to the legacy flipbook, use `ambientAudioPath`; it is separate from the voice message.

Add your own video under `public/videos/` when ready. No recordings or stock personal photos are included.

## Production build

    npm run build
    npm run preview

Vite writes the production site to dist/.
