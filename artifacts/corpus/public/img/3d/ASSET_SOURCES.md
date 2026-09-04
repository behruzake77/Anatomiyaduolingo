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

`public/img/stories/*.webp` (720×1280, 9:16) and `public/img/stories/covers/*.webp`
(176×176) are the backgrounds and cover thumbnails for the Home "Hikoyalar"
(Project Stories) feature. `about-*`, `how-*` and `news-*` were AI-generated for
CORPUS in a soft 3D clay style with the lower third kept dark for text; `tips-*`
and `team-*` are composed from the local stickers above plus gradients
(ImageMagick). All are project-owned — no third-party media.

To add a page: drop a 720×1280 WebP here (keep it ≲ 50 KB), reference it from
`src/data/projectStories.ts`, and bump that story's `version` so the ring shows
as unseen again.
