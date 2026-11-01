# Image audit and generated asset inventory

Prepared 2026-11-01 for Result Scale AI. Generation used the built-in imagegen tool, not an API/CLI fallback. Existing public copy, project claims and team identities are not verified by creating artwork.

## Saved assets

All selected project assets are saved in `public/images/brand/` and are committed with the application. Original generated PNGs remain in the image tool's generated-images directory. WebP/JPEG exports were resized and compressed with Sharp for delivery; no creative changes were made during conversion.

| File | Purpose |
|---|---|
| `hero-v1.webp` | Homepage background, dark negative space behind page copy |
| `software-v1.webp` | Web/mobile/software service illustration and contextual fallback |
| `ai-v1.webp` | AI/automation service illustration, About visual and editorial fallback |
| `security-v1.webp` | Cybersecurity banner, service visual and editorial fallback |
| `social-preview-v1.jpg` | 1200 x 630 social-sharing export using the hero artwork |

The four WebP assets total approximately 290 KiB. They share midnight navy, indigo, cyan, frosted glass, brushed metal and restrained studio lighting. Generated art is illustrative, not evidence of delivered work.

## Section audit

| Section | Image treatment implemented | Still needs genuine assets |
|---|---|---|
| Home hero | Optimized generated hero, decorative empty alt, preload and contrast overlay | None for the brand illustration |
| Home app cards / app catalogue / downloads | Existing icon field rendered as actual image or emoji; monogram if missing/broken | Authentic app icons where available |
| Services | Category-matched software, AI or security illustrations replace oversized emoji-only panels | Optional actual process/project photography |
| About story | AI/software collaboration illustration replaces the journey placeholder | Real founder/team portraits if desired; no invented employee photos generated |
| About team / testimonials | Existing monograms retained | Verified identities, permissioned portraits and real testimonial evidence |
| Portfolio | First supplied project image is rendered; missing/broken image uses labelled concept art | Actual screenshots, demo links and permissioned client evidence. Concept art does not validate project/outcome claims |
| Blog list and articles | Existing cover-image field is used, with category-matched editorial fallback; admin has a cover URL input | Optional original article-specific covers |
| Security | Dedicated shield illustration and existing functional service cards | No fake security badges, certifications or scanning results created |
| App detail screenshots | Real screenshot URLs displayed with contain sizing; missing/broken screenshot explicitly labelled as concept art | Real screenshots exported from each app, not generated facsimiles |
| Contact | Software collaboration illustration replaces the nonfunctional map placeholder | Verified location/map and business contact details; illustration is not a location photo |
| Pricing | Existing comparison/cards retained; no decorative bitmap needed | Actual product screenshots if premium products are later showcased |
| Accounts and admin | Functional layouts retained; no artificial charts or decorative photos added | Genuine profile photos optional; operational charts must come from real data |
| Privacy/legal | Text-first layout retained | No image required for readability |
| Navigation/footer/logo | Existing code-native brand mark retained | Official external brand/client logos only with permission |
| Social sharing | Metadata now references a real local 1200 x 630 preview | Custom typography/social variants can be added later |

## Rendering and maintenance

- `src/lib/visuals.ts` is the common asset/category map.
- `ContentImage` uses Next Image with reserved layout space and responsive sizes. Missing/broken user image URLs fall back to local artwork. Relevant fallbacks explicitly say editorial/concept illustration.
- `AppIcon` keeps app identity separate from generated brand artwork: it displays the real icon/emoji or a monogram.
- Remote images are delivered directly to the browser rather than enabling an unrestricted server-side remote-image proxy. Use licensed HTTPS URLs; local optimized assets are preferable for stability and privacy.
- Existing JSON records are not overwritten or reseeded. Their image fields continue to work, with fallbacks for missing legacy files.
- Portfolio currently displays the first supplied image. A full screenshot gallery remains a separate enhancement.
- The social preview contains artwork, not baked-in text; page title/description remain selectable metadata.
- Asset generation and source review are complete; visual browser QA is not implied by passing a build. Check hero cropping/contrast, mobile screens, real/broken image URLs, and social-preview refresh after deployment.

## Final generation prompts

### Hero

Use case: stylized-concept. Asset type: wide website hero background for Result Scale AI, a professional freelance software engineering and AI services website. Create a polished editorial 3D still life: a sculptural network of translucent glass architectural blocks and slim brushed-metal connections, one central softly glowing indigo computation core with fine cyan light traces. Precise, restrained, premium technology consultancy visual, physically believable materials, subtle depth and soft shadows, elegant not flashy. Wide landscape composition, subjects concentrated on the RIGHT third, LEFT HALF mostly very dark midnight navy negative space for white website text. Existing brand palette deep navy #0a0a0f, indigo #6366f1, cyan #06b6d4 with subtle pale-lavender highlights. Deep navy backdrop, no frame. No people, no words, no letters, no logos, no charts, no fake screens, no watermarks. This is a brand illustration, not a real project photograph.

### Software

Use case: stylized-concept. Asset type: wide landscape website services illustration and editorial cover, harmonious with a dark navy/indigo/cyan freelance software engineering brand. Subject: a refined architectural composition of layered browser-like glass panes, precise modular grids, a small blank mobile-device silhouette and elegant connected rectangular components suggesting thoughtfully engineered web and mobile software. Premium photorealistic 3D studio rendering, restrained, sophisticated, soft edge illumination, translucent frosted glass and brushed metal. Centered balanced composition fully inside the frame, dark midnight navy background #0a0a0f, indigo #6366f1, cyan #06b6d4, pale lavender accents. No text, no logos, no people, no realistic UI screenshot, no data claims, no charts, no watermarks. Purpose is a clearly conceptual service illustration, not proof of client work.

### AI

Use case: stylized-concept. Asset type: wide landscape AI services illustration and blog editorial cover for Result Scale AI. Subject: a precise luminous glass neural lattice branching into a few elegant modular crystalline nodes, with one subtle rounded conversation-shaped glass form integrated into the sculpture; conveys practical AI automation and thoughtful collaboration. Premium 3D studio still life with physically believable frosted glass and brushed aluminum, focused, sophisticated, minimal clutter. Balanced centered composition entirely within frame, softly lit midnight navy background #0a0a0f, indigo #6366f1 and cyan #06b6d4 light with pale lavender highlights. Consistent with an editorial technology consultancy visual family. No text, letters, robots, human faces, logos, fake interface screenshots, claims or watermark.

### Security

Use case: stylized-concept. Asset type: wide landscape cybersecurity service illustration and blog editorial cover. Subject: an elegant thick translucent indigo glass shield suspended just above a precise concentric brushed-metal platform with a few fine cyan light connections, architectural and tangible rather than a cartoon icon. Premium editorial 3D studio product still life, controlled lighting, realistic subtle reflections and soft shadows, refined, reassuring, understated. Balanced centered composition with spacious margins, deep midnight navy #0a0a0f backdrop, indigo #6366f1, cyan #06b6d4, pale lavender accents. Match a sophisticated software engineering consultancy brand. No text, letters, logos, people, locks on screens, padlock cliches, fake certifications or watermarks.
