# Cornwall Ponds Color Palette

The source of truth for theme colors lives in
`apps/web/src/styles/global.css`.

Inline editor swatches are already enabled for this repo via
`.vscode/settings.json`:

```json
{
  "editor.colorDecorators": true
}
```

That means Cursor/VS Code should show color chips next to the `oklch(...)`
definitions in `global.css` while you edit them.

## Semantic utility aliases

The app now treats DaisyUI as the single runtime theme source. These semantic
utilities resolve from the active DaisyUI theme:

- `background` -> `--color-base-100`
- `foreground` -> `--color-base-content`
- `muted` -> `--color-base-200`
- `muted-foreground` -> `--color-base-content`
- `border` -> `--color-base-300`
- `input` -> `--color-base-300`
- `card` -> `--color-base-100`
- `card-foreground` -> `--color-base-content`
- `popover` -> `--color-base-100`
- `popover-foreground` -> `--color-base-content`
- `primary-foreground` -> `--color-primary-content`
- `secondary-foreground` -> `--color-secondary-content`
- `accent-foreground` -> `--color-accent-content`
- `destructive` -> `--color-error`
- `ring` -> `--color-primary`

## `aquascape-pro` light theme

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(97.36% 0.0034 174.48);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-base-100</strong><br /><code>oklch(97.36% 0.0034 174.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(93.5% 0.006 174.48);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-base-200</strong><br /><code>oklch(93.5% 0.006 174.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(86% 0.012 174.48);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-base-300</strong><br /><code>oklch(86% 0.012 174.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(39.84% 0.0679 233.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-base-content</strong><br /><code>oklch(39.84% 0.0679 233.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(39.84% 0.0679 233.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-primary</strong><br /><code>oklch(39.84% 0.0679 233.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(96% 0.015 233.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-primary-content</strong><br /><code>oklch(96% 0.015 233.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(53.09% 0.0946 138.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-secondary</strong><br /><code>oklch(53.09% 0.0946 138.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(97% 0.02 138.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-secondary-content</strong><br /><code>oklch(97% 0.02 138.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(52.37% 0.0251 214.58);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-accent</strong><br /><code>oklch(52.37% 0.0251 214.58)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(97% 0.012 214.58);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-accent-content</strong><br /><code>oklch(97% 0.012 214.58)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(48% 0.028 214.58);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-neutral</strong><br /><code>oklch(48% 0.028 214.58)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(98% 0.005 214.58);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-neutral-content</strong><br /><code>oklch(98% 0.005 214.58)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(55% 0.12 240);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-info</strong><br /><code>oklch(55% 0.12 240)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(98% 0.01 240);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-info-content</strong><br /><code>oklch(98% 0.01 240)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(53.09% 0.0946 138.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-success</strong><br /><code>oklch(53.09% 0.0946 138.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(97% 0.02 138.59);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-success-content</strong><br /><code>oklch(97% 0.02 138.59)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(78% 0.14 85);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-warning</strong><br /><code>oklch(78% 0.14 85)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(28% 0.08 55);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-warning-content</strong><br /><code>oklch(28% 0.08 55)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(55% 0.2 25);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-error</strong><br /><code>oklch(55% 0.2 25)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(0,0,0,0.08);border-radius:12px;background:#fff;">
    <div style="height:56px;border-radius:8px;background:oklch(98% 0.01 25);border:1px solid rgba(0,0,0,0.08);"></div>
    <p><strong>--color-error-content</strong><br /><code>oklch(98% 0.01 25)</code></p>
  </div>
</div>

## `aquascape-midnight` dark theme

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(21.36% 0.0483 257.95);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-base-100</strong><br /><code>oklch(21.36% 0.0483 257.95)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(24% 0.046 257.95);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-base-200</strong><br /><code>oklch(24% 0.046 257.95)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(30% 0.042 257.95);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-base-300</strong><br /><code>oklch(30% 0.042 257.95)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(93% 0.015 257.95);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-base-content</strong><br /><code>oklch(93% 0.015 257.95)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(69.59% 0.1491 162.48);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-primary</strong><br /><code>oklch(69.59% 0.1491 162.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(18% 0.04 162.48);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-primary-content</strong><br /><code>oklch(18% 0.04 162.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(27.95% 0.0368 260.03);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-secondary</strong><br /><code>oklch(27.95% 0.0368 260.03)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(92% 0.025 260.03);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-secondary-content</strong><br /><code>oklch(92% 0.025 260.03)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(37.8% 0.073 168.94);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-accent</strong><br /><code>oklch(37.8% 0.073 168.94)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(90% 0.04 168.94);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-accent-content</strong><br /><code>oklch(90% 0.04 168.94)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(35% 0.035 260.03);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-neutral</strong><br /><code>oklch(35% 0.035 260.03)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(95% 0.01 260.03);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-neutral-content</strong><br /><code>oklch(95% 0.01 260.03)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(65% 0.12 230);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-info</strong><br /><code>oklch(65% 0.12 230)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(18% 0.05 230);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-info-content</strong><br /><code>oklch(18% 0.05 230)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(69.59% 0.1491 162.48);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-success</strong><br /><code>oklch(69.59% 0.1491 162.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(18% 0.04 162.48);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-success-content</strong><br /><code>oklch(18% 0.04 162.48)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(78% 0.14 85);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-warning</strong><br /><code>oklch(78% 0.14 85)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(28% 0.08 55);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-warning-content</strong><br /><code>oklch(28% 0.08 55)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(62% 0.2 25);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-error</strong><br /><code>oklch(62% 0.2 25)</code></p>
  </div>
  <div style="padding:12px;border:1px solid rgba(255,255,255,0.12);border-radius:12px;background:#0f172a;color:#e5e7eb;">
    <div style="height:56px;border-radius:8px;background:oklch(98% 0.01 25);border:1px solid rgba(255,255,255,0.12);"></div>
    <p><strong>--color-error-content</strong><br /><code>oklch(98% 0.01 25)</code></p>
  </div>
</div>

## Maintenance note

If you change a DaisyUI theme token in `apps/web/src/styles/global.css`, update
this doc in the same change so the docs preview stays in sync.
