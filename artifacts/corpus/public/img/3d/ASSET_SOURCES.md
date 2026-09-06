# CORPUS visual asset sources

This folder contains the small local visual library used by the app. The app
keeps assets local so the onboarding, results, achievements, and loading states
also work offline and do not depend on third-party CDN availability.

## Bundled open assets

The files in `3dicons/` are previews from [3dicons.co](https://3dicons.co/).
The current 3dicons collection is published as CC0, allowing personal and
commercial use without attribution.

- `bone.webp` — [Bone](https://3dicons.co/icons/1dec68-bone)
- `book.webp` — [Bookmark/Fav](https://3dicons.co/icons/3d77e2-bookmark-fav)
- `fire.webp` — [Fire](https://3dicons.co/icons/6bfe8c-fire)
- `progress.webp` — [Notify Heart](https://3dicons.co/icons/196608-notify-heart)
- `trophy.webp` — [Trophy](https://3dicons.co/icons/49654f-trophy)

The other lightweight files in this folder are app-specific transparent WebP
stickers created for the CORPUS visual language. Existing animated GIF stickers
are kept under `../stickers/` and are used for success/failure reactions.

- `../stickers/mail-fast-hover-flying.gif` — [Mail Fast (wired-gradient #177)](https://lordicon.com/icons/wired/gradient/177-mail-fast),
  Lordicon FREE icon, "hover-flying" animation. Used by `MailFastIcon` on the
  feedback entry card and on the "sent" confirmation. Credit: Lordicon.
- `../stickers/logo-google-in-reveal.gif` — [Logo Google (wired-lineal #2557)](https://lordicon.com/icons/wired/lineal/2557-logo-google),
  Lordicon FREE icon, "in-reveal" animation. Used by `GoogleMark` on the
  "Continue with Google" button (login/register). Credit: Lordicon.

## Reference libraries

These are design references for future additions, not vendored libraries:

- 3D icons: https://3dicons.co/ · https://iconscout.com/free-3d-icons · https://thridy.com/
- Motion: https://lottiefiles.com/ · https://iconscout.com/lottie-animations · https://lordicon.com/
- Characters: https://iconscout.com/ · https://www.figma.com/community/ · https://www.drawkit.com/
- Illustrations: https://storyset.com/ · https://undraw.co/ · https://www.drawkit.com/
- SVG icons: https://www.svgrepo.com/ · https://www.figma.com/community/ · https://www.untitledui.com/
- UI kits: https://www.figma.com/community/ · https://www.untitledui.com/free-figma-ui-kit · https://uiprep.gumroad.com/
- Banners: https://www.canva.com/ · https://storyset.com/ · https://www.figma.com/community/

Only assets with a clear redistribution license should be copied into this
repository. Check the individual license before adding a Figma, Iconscout,
LottieFiles, Lordicon, Canva, Drawkit, Storyset, or UI kit asset.
## Story banners (`../stories/`)

Assets for the Home "Hikoyalar" (Project Stories) onboarding feature. Content
lives in `src/data/projectStories.ts`.

- `bg-*.webp` (720×1280, 9:16, 35–70 KB) — photorealistic anatomical backgrounds
  (skeleton, heart, brain, cervical spine, lungs, muscles, skull, abdominal organs,
  urinary system, hand). AI-generated for CORPUS in a medical-atlas render style;
  the lower third is kept dark for the text overlay. Project-owned, no third-party media.
- `covers/*.webp` (176×176) — square crops of the backgrounds used as story rings.
- `screens/*.webp` (360 px wide) — real screenshots of the app itself (dashboard,
  lessons, color diagram, quiz, review, exam, leaderboard, battle, Kahoot, 3D,
  glossary, library, progress). They are shown inside a phone frame with a
  "tap here" hotspot so users learn where to tap. Re-capture them whenever the
  corresponding screen changes visibly.

To add a page: add a `bg-*.webp` (keep ≲ 70 KB) and optionally a `screens/*.webp`,
reference them from `projectStories.ts`, set `hotspot` in percentages of the
screenshot, and bump that story's `version` so the ring shows as unseen again.
