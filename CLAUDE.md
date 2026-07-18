# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

八字題目練習 ("Bazi Quiz Practice") — a static, client-side-only quiz web app for practicing Chinese metaphysics (BaZi / Four Pillars) concepts (五行生剋、天干地支陰陽、節氣、十二長生、干支合沖會、地支藏干等). All UI text and content is in Traditional Chinese (zh-Hant).

There is no build step, package manager, or test suite. It's plain HTML/CSS/vanilla JS (ES5-style, IIFEs, `var`) loaded directly via `<script>` tags.

## Running the app

Open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
python3 -m http.server 8000
```

There is no build, lint, or test command — verify changes by loading the page in a browser and exercising each mode (背誦/練習/測驗).

## Architecture

The app is a mobile-app-style single page: a sticky top app bar (title only), a fixed bottom tab bar with three tabs (背誦/練習/測驗) that toggle between three top-level view `<section>`s (`#referenceView`, `#practiceView`, `#testView`), and no other navigation chrome. `js/nav.js` owns this switching (including updating the app bar title and the active tab state) and is the only thing that shows/hides views — each view's own controller code always runs regardless of visibility, since the view is just `display:none`, not unmounted.

- `index.html` — single page shell containing all three views' DOM elements, all manipulated by ID. Loads topic scripts, then `js/reference-data.js`, `js/quiz-render.js`, `js/app.js`, `js/reference.js`, `js/test.js`, `js/nav.js` in that order.
- `js/topics/*.js` — one file per quiz topic. Each topic file is a self-contained IIFE that registers itself into the global `window.BaziTopics` array with `{ id, name, category, generateQuestion }`. `category` is the 大方向 grouping label shown in practice mode's category dropdown (topics sharing a `category` string are grouped together, in first-seen/script-load order). `generateQuestion()` normally returns `{ prompt, options, answerIndex, explanation }` (plain text options). A topic can instead return a click-on-image question: `{ prompt, type: "hand", handSvg, hotspots: [{x, y}] (percentages), answerIndex, explanation }` — see `js/topics/shouzhang-dizhi.js`. Either shape is rendered by `js/quiz-render.js`, so `answerIndex`/scoring/review/test-mode all work unchanged regardless of which shape a topic uses. This is the extension point for adding new quiz topics — add a new file here and include it via `<script>` in `index.html` before `js/app.js`.
- `js/quiz-render.js` — `window.BaziRenderQuizBody(promptEl, containerEl, q, onSelect)`, the single place that turns a question object into clickable `.option-btn` elements (plain buttons, or absolutely-positioned `.hand-dot` buttons over an inline SVG for `type: "hand"` questions). Used by both `js/app.js` and `js/test.js` so practice/review/test all support any question shape without duplicating rendering logic. Answer-checking stays generic in both callers (`querySelectorAll(".option-btn")`, compare index to `answerIndex`) since every clickable element gets that class regardless of layout.
- `js/app.js` — practice mode controller (single IIFE, lives inside `#practiceView`). Owns:
  - A two-level category (大方向) → topic (細項) picker, each with an implicit "全部" option. The current selection resolves to a "scope": either a single topic, all topics in one category, or all topics — see `currentScopeTopics`/`currentScopeKey`/`currentScopeLabel`.
  - Mode state machine: `"practice"` (randomly draws from the current scope's topic pool and calls its `generateQuestion()`) vs `"review"` (replays previously-missed questions from a shuffled queue).
  - Stats persisted to `localStorage` under key `bazi-quiz-stats-v1`, keyed by scope key (a single topic's own id when one topic is selected — for backward compatibility — or a synthetic `scope:all` / `scope:cat:<category>` key otherwise), shaped as `{ [scopeKey]: { total, correct, wrong: { [prompt]: question } } }`. Each scope's stats/wrong-queue are entirely independent of the others. Wrong answers are keyed by question `prompt` text (dedup map, not a list) and store the full question object for later replay in review mode.
  - Rendering of options, answer selection, feedback, and stats bar, all via direct DOM manipulation (no framework/virtual DOM).
- `js/reference-data.js` — pure data/HTML for 背誦 (memorization) mode, grouped by the same category names used in `js/topics/*.js`: `window.BaziReference = [{ category, sections: [{ title, html }] }]`. This is hand-authored reference content (tables, short notes), independent of the quiz-generation logic in `js/topics/*.js` — update both if the underlying facts change.
- `js/hand-diagram.js` — single source of truth for the 掌訣 hand artwork: `window.BaziHandDiagram = { viewBoxW, viewBoxH, positions: [{ zhi, x, y, label }], backgroundMarkup }`. `js/topics/shouzhang-dizhi.js` (the quiz) and `js/reference-data.js` (the 背誦 legend, with zhi labels drawn on top of the same background) both read from this rather than each hard-coding hand coordinates, so the two can't drift out of sync. Must load before either of those two files.
- `js/reference.js` — renders `#refTabs` (one tab per category) and `#refContent` (that category's sections) from `window.BaziReference`. Exposes `window.BaziReferenceInit()`, called by `js/nav.js` each time the user switches to the 背誦 tab.
- `js/test.js` — timed test mode (`#testView`), question count set by `TOTAL_QUESTIONS` (currently 20; the intro text and progress counter in `index.html` hard-code the same number — change both together). Builds an even-as-possible spread across all topics in `window.BaziTopics` (extra questions assigned to a random subset of topics when the count doesn't divide evenly), shuffles order, runs a live stopwatch (`Date.now()`-based, not a naive tick counter), and adds a fixed penalty (`PENALTY_MS`) to the displayed/final time per wrong answer. Feedback per question is a brief correct/wrong highlight with no explanation, auto-advancing after `ADVANCE_DELAY_MS`. Exposes `window.BaziTestReset()` so `js/nav.js` can stop the timer and reset to the intro screen when the user switches away from the 測驗 tab mid-test.
- `js/nav.js` — the only module aware of all three views; owns the bottom tab bar, the app-bar title text, and which view is visible.
- `style.css` — single stylesheet, mobile-first (fixed bottom tab bar, sticky app bar, single-column stacked quiz options, `env(safe-area-inset-*)` padding), theming via CSS custom properties in `:root` (colors for correct/wrong/accent/muted etc.).

## Adding a new quiz topic

Follow the pattern in `js/topics/wuxing.js`: wrap in an IIFE, implement `generateQuestion()` returning `{ prompt, options, answerIndex, explanation }`, then `window.BaziTopics.push({ id, name, category, generateQuestion })`. Add the corresponding `<script src="js/topics/....js">` in `index.html` before `js/app.js` loads. `category` should match an existing category string if the topic belongs there, or introduce a new one (it will automatically appear as a new 大方向 in practice mode and get its fair share of questions in test mode). No other registration step is needed — `app.js` and `test.js` pick up all topics from `window.BaziTopics` automatically.

If the new topic represents facts worth memorizing verbatim (tables, fixed lists), also add a corresponding section to `js/reference-data.js` under the same `category` so it shows up in 背誦 mode.
