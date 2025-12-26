# AGENTS.override.md — CSS System Guardrails (scope: src/styles/\*\*)

## Goal

Maintain a coherent design system using CSS variables and predictable patterns.

## Hard rules

- New colors must be tokens (CSS variables). No raw hex/rgb in component styles unless explicitly approved.
- New spacing must use the spacing scale tokens (no random 13px/27px).
- Keep selectors low-specificity. Prefer class selectors; avoid deep nesting.
- Do not introduce new global element styles that risk regressions without auditing the impact.
- All interactive styles must include `:focus-visible` and meet contrast requirements.

## Structure rules for global.css

Maintain this rough order:

1. :root tokens (color, spacing, typography, radius, shadow, z-index)
2. theme overrides (e.g., [data-theme="dark"] or prefers-color-scheme)
3. base element styles (body, headings, links)
4. layout primitives (container, stack/flow, grid)
5. components (buttons, cards, nav, forms)
6. helpers (visually-hidden, sr-only, etc.)
7. media queries at the end (or colocated consistently, but pick one approach)

## Motion

- Any animation/transition must be subtle and disabled or reduced under `prefers-reduced-motion: reduce`.
