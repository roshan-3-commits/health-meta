# Principal UI/UX & Bespoke Front-End Design System Rules

These guidelines are strictly enforced across all components, styles, layouts, and copy in this application:

## 1. Anti-AI Visual Patterns (Strictly Forbidden)
- **Zero AI Lighting Clichés**: NEVER create dark-mode sites with glowing neon blue/purple gradients, radial background glows, or blurry floating glassmorphism shapes (`blur-2xl`, `blur-3xl`).
- **No Symmetrical AI Grids**: NEVER default to symmetrical 3-column feature grids with centered circular icons on top.
- **No Generic Card Stacks**: NEVER use generic stock placeholder graphics, centered text blocks across the entire page, or standard uniform card layouts.
- **Do Not Break Existing Structure**: Maintain full functional routing, props, state engines, and data pipelines without regression.

## 2. Typography & Spacing Hierarchy
- **Striking Contrast**: Pair bold, high-impact headings (tracking-tight display sans/editorial typography) with clean, legible body copy.
- **Editorial Eyebrows**: Incorporate crisp eyebrow labels and index markers (e.g., `[ 01 / CLINICAL PROTOCOL ]`, `[ REF // ISO 15189 ]`) above main headings.
- **Breathing Room & Asymmetry**: Utilize off-center headings, staggered layout segments, and deliberate vertical breathing room.

## 3. Dynamic & Bespoke Layout Structures
- **Irregular Bento-Style Grids**: Form asymmetrical layouts (e.g. 2/3 paired with 1/3, staggered analytical cards, mixed visual weights).
- **Tactile Micro-Details**: Hairline borders (`border border-slate-200` / `border-slate-800` or `border-neutral-200/80` / `border-neutral-800`), visible hairline grid dividers, subtle warm background tints (`#FAF9F6`, `#0F1115`), and crisp micro-shadows instead of soft blurry halos.

## 4. Realistic Human Copywriting (No AI Clichés)
- **Banned Words & Phrases**: NEVER use "Revolutionary", "Unleash", "Elevate" (unless referring strictly to an elevated clinical biomarker), "Seamless", "Next-gen", "Empower", "Game-changer", or "In today's fast-paced world".
- **Authentic Voice**: Write direct, conversational, human, and domain-specific copy. State clear numbers, authentic biomarker reference ranges, and real-world medical data.

## 5. Code & Front-End Quality
- Output clean, semantic HTML5 with Tailwind CSS classes.
- Include interactive hover micro-states (`hover:border-neutral-400 transition-all duration-200`).
- Ensure full mobile responsiveness and smooth structural hierarchy across all device viewports.
