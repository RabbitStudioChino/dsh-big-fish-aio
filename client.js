// 自动生成：修改 src/panel.js 或 modules/*/lib/client.js 后运行 npm run build。
window.__ModuleLoader__.load({ id: "dsh-big-fish-aio", factory(require) {
const FISH_PALETTE_CSS = "/* 大肥鱼浅色 · 奶油纸与深海蓝色库。界面与挂饰共用。 */\n.big-fish,\n.big-fish-notice,\n:host {\n  /* 基础背景、文字、边框与状态色 */\n  --fish-cream: #f3e9d5;\n  --fish-bg: var(--fish-cream);\n  --fish-paper-bg: #fcf6e9;\n  --fish-paper-2: #f5ebd8;\n  --fish-paper-glow: #ffffffd9;\n  --fish-fade-mid: rgba(252, 246, 233, .55);\n  --fish-paper-border: #e4d5bb;\n  --fish-dot: rgba(58, 73, 112, .1);\n  --fish-stitch: rgba(80, 94, 128, .28);\n  --fish-card-bg: #fffdf8;\n  --fish-surface: #fffdf8;\n  --fish-soft: #f5ecdb;\n  --fish-hover: #eddfc8;\n  --fish-line: #eadfcb;\n  --fish-border: #dfd0b6;\n  --fish-control-border: #c2b097;\n  --fish-control-shadow: inset 0 1px 0 #ffffffc7, 0 1px 2px rgba(43, 58, 96, .06);\n  --fish-focus-ring: rgba(91, 121, 196, .16);\n  --fish-select-arrow: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='m1 1 6 6 6-6' fill='none' stroke='%23806a43' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");\n  --fish-ink: #1b2a4e;\n  --fish-text: var(--fish-ink);\n  --fish-muted: #59627d;\n  --fish-accent: #5b79c4;\n  --fish-action: #22345c;\n  --fish-on-accent: #fff8ea;\n  --fish-accent-soft: #e6ecfb;\n  --fish-blue: #6f8bd4;\n  --fish-blue-soft: #e6ecfb;\n  --fish-blue-strong: #3f5798;\n  --fish-gold: #c69a4a;\n  --fish-gold-soft: #f6e7c3;\n  --fish-pink: #cf7e93;\n  --fish-pink-soft: #fbe7ec;\n  --fish-mint: #4d9b86;\n  --fish-mint-soft: #e2f2ec;\n  --fish-navy: #16223d;\n  --fish-navy-2: #22345c;\n  --fish-link: #38549a;\n  --fish-success: #2f7d63;\n  --fish-warning: #9a641c;\n  --fish-danger: #b0475c;\n  --fish-info: #3f5d9f;\n  --fish-rim: #ffffffd9;\n  --fish-edge: #d7c7aa;\n  --fish-bottom: #efe2cc;\n  --fish-panel: linear-gradient(180deg, #fffdf8, #fffaf1);\n  --fish-shell-fill: #16223d;\n  --fish-control-fill: linear-gradient(180deg, #fffdf9, #f7eedf);\n  --fish-inset: inset 0 1px 2px rgba(43, 58, 96, .07);\n  --fish-small-shadow: inset 0 1px 0 #ffffffcc, 0 1px 2px rgba(43, 58, 96, .08);\n  --fish-shadow: inset 0 1px 0 #ffffffbf, 0 2px 0 rgba(43, 58, 96, .05), 0 14px 28px rgba(43, 58, 96, .07);\n  --fish-control-border-strong: #8f7a5d;\n  --fish-pink-decor: #d794a5;\n  --fish-decor: #8ba0d6;\n  --fish-foam: #fffdf8;\n  --fish-workspace: #fcf6e9;\n  --fish-wave: #c9d7f5;\n  --fish-wave-back: #dfe8fb;\n  --fish-switch-off: #b9aa91;\n  --fish-switch-on: #22345c;\n  --fish-tape-warm: #e9d8b3;\n  --fish-tape-blue: #c9d9f6;\n  --fish-tape-rose: #f2d7de;\n  --fish-app-glow-1: #fffaf0;\n  --fish-app-glow-2: #ead9bb;\n  --fish-tag-bg: #ffffff8c;\n  --fish-stamp-bg: radial-gradient(circle at 50% 25%, #fffdf7, #f6e8ca);\n  --fish-stamp-ink: #7d5a1e;\n  --fish-gold-ink: #7d5a1e;\n  --fish-rose-ink: #9a5267;\n  --fish-mint-ink: #397463;\n  --fish-symbol-3-bg: radial-gradient(circle at 40% 30%, #fff, #f6dbe3);\n  --fish-symbol-4-bg: radial-gradient(circle at 40% 30%, #fff, #dcefe8);\n  --fish-hero-bg: radial-gradient(120% 130% at 86% 0%, #fdf8ed 0%, #edf2fc 50%, #e1e9f7 100%);\n  --fish-hero-text: var(--fish-text);\n  --fish-hero-lead: var(--fish-muted);\n  --fish-hero-gold: var(--fish-gold-ink);\n  --fish-chip-bg: var(--fish-tag-bg);\n  --fish-feature-1: linear-gradient(145deg, #eef3ff 0%, #fffdf8 62%);\n  --fish-feature-2: linear-gradient(145deg, #fff6e5 0%, #fffdf8 62%);\n  --fish-feature-3: linear-gradient(145deg, #fbe9ee 0%, #fffdf8 62%);\n  --fish-feature-4: linear-gradient(145deg, #e6f3ee 0%, #fffdf8 62%);\n  --fish-update-bg: linear-gradient(145deg, #eef3ff 0%, #fffdf8 62%);\n  --fish-portrait-glow: rgba(255, 255, 255, .55);\n\n  /* 导航、卡片、图表、控件与浮层 */\n  --fish-binder-text: var(--fish-text);\n  --fish-binder-bg: linear-gradient(160deg, #fffdf8 0%, #f4ecdd 58%, #ede2ce 100%);\n  --fish-binder-shadow: var(--fish-shadow);\n  --fish-binder-before-border: var(--fish-border);\n  --fish-rings-bg: linear-gradient(180deg, #f8e8bd, #c39743);\n  --fish-rings-shadow: inset 0 1px 0 #fff9e7, 0 2px 4px rgba(8, 16, 34, .45);\n  --fish-brand-border-bottom: var(--fish-border);\n  --fish-logo-img-filter: rgba(5, 12, 26, .32);\n  --fish-brand-name-text: var(--fish-text);\n  --fish-brand-sub-text: var(--fish-muted);\n  --fish-version-pin-border: var(--fish-border);\n  --fish-version-pin-bg: var(--fish-tag-bg);\n  --fish-version-pin-text: var(--fish-text);\n  --fish-tab-text: var(--fish-text);\n  --fish-tab-icon-text: var(--fish-blue-strong);\n  --fish-tab-icon-bg: var(--fish-accent-soft);\n  --fish-tab-no-text: var(--fish-muted);\n  --fish-tab-active-text: var(--fish-text);\n  --fish-tab-active-icon-text: var(--fish-text);\n  --fish-tab-active-icon-bg: rgba(61, 87, 155, .1);\n  --fish-tab-active-number-text: var(--fish-blue-strong);\n  --fish-nav-highlight-bg: linear-gradient(135deg, #e8eefb, #d8e2f6);\n  --fish-nav-highlight-shadow: var(--fish-small-shadow);\n  --fish-tab-hover-text: var(--fish-text);\n  --fish-tab-hover-bg: var(--fish-hover);\n  --fish-tab-active-hover-text: var(--fish-text);\n  --fish-submenu-border-left: var(--fish-border);\n  --fish-submenu-text: var(--fish-muted);\n  --fish-submenu-active-text: var(--fish-blue-strong);\n  --fish-submenu-bg: var(--fish-accent-soft);\n  --fish-submenu-shadow: inset 2px 0 0 var(--fish-accent);\n  --fish-submenu-hover-text: var(--fish-text);\n  --fish-submenu-hover-bg: var(--fish-hover);\n  --fish-submenu-active-hover-text: var(--fish-blue-strong);\n  --fish-submenu-active-hover-bg: var(--fish-accent-soft);\n  --fish-binder-foot-border-top: var(--fish-border);\n  --fish-sidebar-note-text: var(--fish-muted);\n  --fish-connection-dot-bg: var(--fish-warning);\n  --fish-connection-dot-shadow: 0 0 0 3px rgba(231, 185, 109, .16);\n  --fish-connection-dot-online-bg: var(--fish-success);\n  --fish-connection-dot-online-shadow: 0 0 0 3px rgba(127, 210, 181, .16);\n  --fish-paper-shadow: inset 0 1px 0 var(--fish-rim),\n    0 2px 0 rgba(43, 58, 96, .05),\n    0 20px 50px rgba(42, 54, 92, .1);\n  --fish-tape-bg-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, .4) 0 6px, transparent 6px 12px);\n  --fish-tape-shadow: 0 1px 2px rgba(40, 50, 80, .14);\n  --fish-kicker-dot-shadow: 0 0 0 4px rgba(198, 154, 74, .15);\n  --fish-kicker-light-text: var(--fish-blue-strong);\n  --fish-page-stamp-border: rgba(198, 154, 74, .55);\n  --fish-page-stamp-shadow: 0 3px 0 rgba(198, 154, 74, .16);\n  --fish-hero-border: var(--fish-border);\n  --fish-hero-shadow: var(--fish-shadow);\n  --fish-hero-before-bg: radial-gradient(70% 80% at 4% 100%, rgba(94, 130, 206, .25), transparent 60%);\n  --fish-hero-title-text: var(--fish-text);\n  --fish-mark-text: var(--fish-blue-strong);\n  --fish-mark-after-bg: var(--fish-accent-soft);\n  --fish-hero-quote-border-left: var(--fish-gold);\n  --fish-chip-border: var(--fish-control-border);\n  --fish-chip-text: var(--fish-text);\n  --fish-chip-dot-bg: var(--fish-warning);\n  --fish-chip-dot-online-bg: var(--fish-success);\n  --fish-welcome-bg: color-mix(in srgb, var(--fish-card-bg) 78%, transparent);\n  --fish-welcome-shadow: 0 18px 34px rgba(6, 14, 31, .35);\n  --fish-welcome-photo-bg: transparent;\n  --fish-welcome-text: var(--fish-text);\n  --fish-wave-back-fill: rgba(106, 140, 205, .34);\n  --fish-wave-front-fill: rgba(145, 177, 232, .22);\n  --fish-wave-foam-stroke: rgba(255, 255, 255, .75);\n  --fish-bubbles-stroke: rgba(54, 75, 122, .2);\n  --fish-stat-icon-border: rgba(79, 109, 187, .18);\n  --fish-stat-icon-gold-border: rgba(198, 154, 74, .26);\n  --fish-stat-icon-pink-border: rgba(207, 126, 147, .28);\n  --fish-stat-icon-mint-border: rgba(77, 155, 134, .26);\n  --fish-feature-shadow: 0 2px 0 rgba(49, 62, 98, .06), 0 14px 30px rgba(50, 64, 105, .07);\n  --fish-feature-hover-shadow: 0 20px 40px rgba(50, 64, 105, .12);\n  --fish-feature-before-text: rgba(54, 75, 122, .06);\n  --fish-feature-tag-border: rgba(138, 100, 36, .4);\n  --fish-feature-sticker-bg: #fffdf8;\n  --fish-feature-sticker-shadow: 0 12px 24px rgba(37, 51, 88, .15);\n  --fish-button-hover-shadow: 0 3px 0 var(--fish-edge), 0 8px 16px rgba(43, 58, 96, .12);\n  --fish-danger-text: #fffdf8;\n  --fish-danger-shadow: 0 2px 0 rgba(90, 24, 40, .28);\n  --fish-primary-hover-text: #fff8ea;\n  --fish-switch-bg: linear-gradient(180deg, #ffffff26, #0000000a), var(--fish-switch-off);\n  --fish-switch-shadow: inset 0 1px 2px #0002, 0 1px 0 var(--fish-rim);\n  --fish-switch-thumb-bg: #fff8e9;\n  --fish-switch-thumb-shadow: inset 0 1px 0 #fff, 0 2px 4px #0003;\n  --fish-switch-checked-bg: linear-gradient(180deg, #ffffff26, #0000000a), var(--fish-switch-on);\n  --fish-switch-checked-shadow: inset 0 1px 0 #ffffff26, 0 1px 0 var(--fish-rim);\n  --fish-update-dot-shadow: 0 0 0 3px rgba(198, 154, 74, .16);\n  --fish-update-art-shadow: 0 20px 42px rgba(37, 51, 88, .16), 0 2px 0 rgba(49, 62, 98, .06);\n  --fish-update-art-before-bg: radial-gradient(circle at 50% 45%, rgba(198, 154, 74, .18), transparent 68%);\n  --fish-update-art-hover-shadow: 0 26px 50px rgba(37, 51, 88, .2), 0 2px 0 rgba(49, 62, 98, .06);\n  --fish-table-text: var(--fish-text);\n  --fish-table-bg: rgba(198, 154, 74, .05);\n  --fish-modal-bg: rgba(8, 16, 32, .55);\n  --fish-modal-card-shadow: inset 0 1px 0 var(--fish-rim), 0 24px 54px rgba(7, 15, 32, .35);\n  --fish-message-border: rgba(154, 100, 28, .35);\n  --fish-notice-border: var(--fish-border);\n  --fish-notice-bg: var(--fish-panel);\n  --fish-notice-text: var(--fish-text);\n  --fish-notice-shadow: var(--fish-shadow);\n  --fish-notice-button-border: var(--fish-control-border);\n  --fish-notice-button-bg: var(--fish-control-fill);\n  --fish-notice-button-text: var(--fish-text);\n  --fish-tab-active-bg: var(--fish-nav-highlight-bg);\n  --fish-tab-shadow: var(--fish-small-shadow);\n  --fish-tab-active-hover-bg: var(--fish-nav-highlight-bg);\n  --fish-submenu-mobile-bg: var(--fish-tag-bg);\n  --fish-nav-bg: rgba(246, 231, 197, .24);\n  --fish-help-popover-shadow: var(--fish-shadow), 0 12px 26px rgba(30, 42, 74, .16);\n  --fish-jump-flash-after-shadow: 0 0 0 2px var(--fish-gold), 0 0 26px rgba(198, 154, 74, .38);\n  --fish-terminal-card-border: var(--fish-border);\n  --fish-terminal-card-bg: var(--fish-surface);\n  --fish-terminal-card-shadow: var(--fish-shadow);\n  --fish-terminal-head-border-bottom: var(--fish-border);\n  --fish-terminal-head-bg: linear-gradient(180deg, #f5f7fc, #e9eef8);\n  --fish-terminal-head-text: var(--fish-text);\n  --fish-terminal-live-text: var(--fish-success);\n  --fish-terminal-live-bg: var(--fish-success);\n  --fish-terminal-live-shadow: 0 0 0 3px rgba(101, 214, 154, .14);\n  --fish-terminal-title-text: var(--fish-muted);\n  --fish-terminal-count-text: var(--fish-muted);\n  --fish-terminal-bg: var(--fish-paper-bg);\n  --fish-terminal-text: var(--fish-text);\n  --fish-terminal-time-text: var(--fish-gold-ink);\n  --fish-terminal-prompt-text: var(--fish-blue-strong);\n  --fish-terminal-empty-text: var(--fish-muted);\n  --fish-terminal-error-border-top: var(--fish-border);\n  --fish-terminal-error-text: var(--fish-danger);\n  --fish-select-popup-bg: linear-gradient(135deg, #ffffff1f, #ffffff03), color-mix(in srgb, var(--fish-surface) 82%, transparent);\n  --fish-select-popup-shadow: inset 0 1px 0 #ffffff24, 0 18px 40px rgba(15, 25, 45, .22), var(--fish-control-shadow);\n  --fish-version-pin-hover-focus-text: var(--fish-blue-strong);\n  --fish-rice-tooltip-border: var(--fish-border);\n  --fish-rice-tooltip-bg: var(--fish-surface);\n  --fish-rice-tooltip-shadow: var(--fish-shadow);\n  --fish-rice-tooltip-text: var(--fish-text);\n  --fish-rice-tip-date-text: var(--fish-muted);\n  --fish-rice-tip-total-text: var(--fish-muted);\n  --fish-rice-tip-cost-text: var(--fish-success);\n  --fish-rice-tip-label-border-top: var(--fish-line);\n  --fish-rice-tip-label-text: var(--fish-muted);\n  --fish-rice-tip-row-head-text: var(--fish-muted);\n  --fish-rice-tip-bar-bg: var(--fish-line);\n  --fish-rice-tip-bar-fill: var(--fish-success);\n  --fish-rice-tip-empty-text: var(--fish-muted);\n  --fish-memory-dialog-shadow: 0 24px 100px #0005;\n  --fish-memory-dialog-bg: rgba(8,16,28,.55);\n  --fish-notice-card-shadow: 0 8px 30px #0003;\n  --fish-memory-nav-active-shadow: 0 3px 10px #0000000a;\n  --fish-table-head-bg: var(--fish-accent-soft);\n  --fish-sticker-backdrop: rgba(8,16,32,.65);\n\n  /* 挂饰与液态玻璃浮层 */\n  --fm-paper: var(--fish-paper-bg);\n  --fm-rim: #ffffffdf;\n  --fm-edge: #b3c7f1;\n  --fm-fill: var(--fish-panel);\n  --fm-shadow: inset 0 2px 0 var(--fm-rim),inset 0 -3px 0 #cfddfa,0 3px 0 var(--fm-edge),0 10px 24px #294b8720;\n  --fm-text: var(--fish-text);\n  --fm-muted: var(--fish-muted);\n  --fm-border: var(--fish-border);\n  --fm-soft: var(--fish-soft);\n  --fm-accent: var(--fish-accent);\n  --fm-green: var(--fish-success);\n  --fm-blue: var(--fish-blue-strong);\n  --fm-pink: var(--fish-rose-ink);\n  --fm-amber: var(--fish-warning);\n  --fm-purple: #80548e;\n  --fm-glass-color: 252,246,233;\n  --fm-glass-edge: #ffffffb3;\n  --fm-glass-shadow: inset 1px 1px 1px #ffffffd9,inset -1px -1px 1px #a9b7d64d,0 16px 40px #29446e30;\n  --fm-glass-highlight: linear-gradient(135deg,#ffffff2e,transparent 42%,#ffffff08);\n  color-scheme: light;\n}\n\n:host .fm-panel[data-content=cost] {\n  --fm-paper: var(--fish-bg);\n  --fm-fill: var(--fish-panel);\n  --fm-text: var(--fish-text);\n  --fm-muted: var(--fish-muted);\n  --fm-border: var(--fish-border);\n  --fm-green: var(--fish-success);\n  --fm-shadow: var(--fish-shadow);\n}\n\n/* 大肥鱼深色 · 夜海纸与暖金色色库。界面与挂饰共用。 */\nbody[data-ds-dark-theme] .big-fish,\nbody[data-ds-dark-theme] .big-fish-notice,\n:host([data-theme=dark]) {\n  /* 基础背景、文字、边框与状态色 */\n  --fish-cream: #0c1424;\n  --fish-bg: #0c1424;\n  --fish-paper-bg: #111a2d;\n  --fish-paper-2: #17213a;\n  --fish-paper-glow: #5a78b414;\n  --fish-fade-mid: rgba(17, 26, 45, .55);\n  --fish-paper-border: #2d3850;\n  --fish-dot: rgba(220, 230, 255, .055);\n  --fish-stitch: rgba(210, 222, 255, .18);\n  --fish-card-bg: #19233a;\n  --fish-surface: #182238;\n  --fish-soft: #202a42;\n  --fish-hover: #2a3752;\n  --fish-line: #2b3550;\n  --fish-border: #37435e;\n  --fish-control-border: #4d5a75;\n  --fish-control-shadow: inset 0 1px 0 #ffffff0d, 0 1px 2px rgba(0, 0, 0, .3);\n  --fish-focus-ring: rgba(185, 203, 244, .18);\n  --fish-select-arrow: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='9' viewBox='0 0 14 9'%3E%3Cpath d='m1 1 6 6 6-6' fill='none' stroke='%23d8c39a' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");\n  --fish-ink: #f1ead9;\n  --fish-text: var(--fish-ink);\n  --fish-muted: #b8b5aa;\n  --fish-accent: #a9bef0;\n  --fish-action: #e4c98d;\n  --fish-on-accent: #182238;\n  --fish-accent-soft: #2a3b5e;\n  --fish-blue: #9db4ee;\n  --fish-blue-soft: #25344f;\n  --fish-blue-strong: #b9cbf4;\n  --fish-gold: #e4c98d;\n  --fish-gold-soft: #3a3221;\n  --fish-pink: #f0a9bd;\n  --fish-pink-soft: #3a2833;\n  --fish-mint: #8bcdb8;\n  --fish-mint-soft: #223a35;\n  --fish-navy: #0c1526;\n  --fish-navy-2: #17233a;\n  --fish-link: #e7cf9d;\n  --fish-success: #8acbb6;\n  --fish-warning: #ecc38b;\n  --fish-danger: #ffabb9;\n  --fish-info: #a9bdf0;\n  --fish-rim: #ffffff1a;\n  --fish-edge: #070d19;\n  --fish-bottom: #0d1627;\n  --fish-panel: linear-gradient(180deg, #1c2740, #182136);\n  --fish-shell-fill: #0c1526;\n  --fish-control-fill: linear-gradient(180deg, #26324b, #1b263c);\n  --fish-inset: inset 0 1px 2px rgba(0, 0, 0, .4);\n  --fish-small-shadow: inset 0 1px 0 #ffffff0f, 0 1px 2px rgba(0, 0, 0, .3);\n  --fish-shadow: inset 0 1px 0 #ffffff0d, 0 2px 0 #00000033, 0 14px 28px #0000004d;\n  --fish-control-border-strong: #78849f;\n  --fish-pink-decor: #e7a1b4;\n  --fish-decor: #6d84bf;\n  --fish-foam: #dbe5ff;\n  --fish-workspace: #111a2d;\n  --fish-wave: #22365a;\n  --fish-wave-back: #1a2a48;\n  --fish-switch-off: #4b556c;\n  --fish-switch-on: #e4c98d;\n  --fish-tape-warm: #574a36;\n  --fish-tape-blue: #3c4d6d;\n  --fish-tape-rose: #513b46;\n  --fish-app-glow-1: #17263f;\n  --fish-app-glow-2: #1a2c4a;\n  --fish-tag-bg: #ffffff0d;\n  --fish-stamp-bg: radial-gradient(circle at 50% 25%, #23324e, #1a2438);\n  --fish-stamp-ink: #e4c98d;\n  --fish-gold-ink: #f0d49a;\n  --fish-rose-ink: #f2b6c6;\n  --fish-mint-ink: #9ed9c8;\n  --fish-symbol-3-bg: radial-gradient(circle at 40% 30%, #2b2433, #3a2833);\n  --fish-symbol-4-bg: radial-gradient(circle at 40% 30%, #1e302d, #223a35);\n  --fish-hero-bg: radial-gradient(120% 130% at 86% 0%, #1b2c4b 0%, #101b31 50%, #0a1120 100%);\n  --fish-hero-text: #fbf4e6;\n  --fish-hero-lead: #c9d0e0;\n  --fish-hero-gold: #edcf92;\n  --fish-chip-bg: rgba(255, 255, 255, .06);\n  --fish-feature-1: linear-gradient(145deg, #1c2b49 0%, #141d30 62%);\n  --fish-feature-2: linear-gradient(145deg, #292418 0%, #141d30 62%);\n  --fish-feature-3: linear-gradient(145deg, #2b1f2a 0%, #141d30 62%);\n  --fish-feature-4: linear-gradient(145deg, #1a2c28 0%, #141d30 62%);\n  --fish-update-bg: linear-gradient(145deg, #1c2b49 0%, #141d30 62%);\n  --fish-portrait-glow: rgba(120, 150, 210, .18);\n\n  /* 导航、卡片、图表、控件与浮层 */\n  --fish-binder-text: #f7eeda;\n  --fish-binder-bg: radial-gradient(90% 60% at 100% 0%, rgba(121, 153, 219, .28), transparent 64%),\n    radial-gradient(70% 46% at 0% 100%, rgba(214, 174, 100, .16), transparent 66%),\n    linear-gradient(160deg, #1b2a4a 0%, #111c34 58%, #0c1628 100%);\n  --fish-binder-shadow: inset 0 1px 0 rgba(255, 255, 255, .16),\n    0 3px 0 rgba(8, 16, 32, .24),\n    0 22px 46px rgba(9, 19, 40, .28);\n  --fish-binder-before-border: rgba(246, 231, 197, .22);\n  --fish-rings-bg: linear-gradient(180deg, #f8e8bd, #c39743);\n  --fish-rings-shadow: inset 0 1px 0 #fff9e7, 0 2px 4px rgba(8, 16, 34, .45);\n  --fish-brand-border-bottom: rgba(246, 231, 197, .24);\n  --fish-logo-img-filter: rgba(5, 12, 26, .32);\n  --fish-brand-name-text: #fff9ec;\n  --fish-brand-sub-text: #c4cee5;\n  --fish-version-pin-border: rgba(246, 231, 197, .24);\n  --fish-version-pin-bg: rgba(255, 255, 255, .06);\n  --fish-version-pin-text: #ecdaac;\n  --fish-tab-text: #d5ddef;\n  --fish-tab-icon-text: #aebfe6;\n  --fish-tab-icon-bg: rgba(255, 255, 255, .055);\n  --fish-tab-no-text: rgba(233, 224, 199, .48);\n  --fish-tab-active-text: #1b2a4e;\n  --fish-tab-active-icon-text: #3d579b;\n  --fish-tab-active-icon-bg: rgba(61, 87, 155, .1);\n  --fish-tab-active-number-text: #9a7a3d;\n  --fish-nav-highlight-bg: linear-gradient(135deg, #fff8e9, #f3e4c4);\n  --fish-nav-highlight-shadow: 0 2px 0 rgba(8, 16, 34, .25), 0 8px 18px rgba(6, 14, 30, .24);\n  --fish-tab-hover-text: #fff9ec;\n  --fish-tab-hover-bg: rgba(255, 255, 255, .06);\n  --fish-tab-active-hover-text: #1b2a4e;\n  --fish-submenu-border-left: rgba(246, 231, 197, .28);\n  --fish-submenu-text: #c2cce2;\n  --fish-submenu-active-text: #ffe6ac;\n  --fish-submenu-bg: rgba(246, 231, 197, .12);\n  --fish-submenu-shadow: inset 2px 0 0 #e7c478;\n  --fish-submenu-hover-text: #fff9ec;\n  --fish-submenu-hover-bg: rgba(255, 255, 255, .07);\n  --fish-submenu-active-hover-text: #ffe6ac;\n  --fish-submenu-active-hover-bg: rgba(246, 231, 197, .16);\n  --fish-binder-foot-border-top: rgba(246, 231, 197, .22);\n  --fish-sidebar-note-text: #ced7e8;\n  --fish-connection-dot-bg: #e7b96d;\n  --fish-connection-dot-shadow: 0 0 0 3px rgba(231, 185, 109, .16);\n  --fish-connection-dot-online-bg: #7fd2b5;\n  --fish-connection-dot-online-shadow: 0 0 0 3px rgba(127, 210, 181, .16);\n  --fish-paper-shadow: inset 0 1px 0 var(--fish-rim),\n    0 2px 0 rgba(43, 58, 96, .05),\n    0 20px 50px rgba(42, 54, 92, .1);\n  --fish-tape-bg-image: repeating-linear-gradient(45deg, rgba(255, 255, 255, .4) 0 6px, transparent 6px 12px);\n  --fish-tape-shadow: 0 1px 2px rgba(40, 50, 80, .14);\n  --fish-kicker-dot-shadow: 0 0 0 4px rgba(198, 154, 74, .15);\n  --fish-kicker-light-text: #f3d697;\n  --fish-page-stamp-border: rgba(198, 154, 74, .55);\n  --fish-page-stamp-shadow: 0 3px 0 rgba(198, 154, 74, .16);\n  --fish-hero-border: rgba(255, 255, 255, .12);\n  --fish-hero-shadow: inset 0 1px 0 rgba(255, 255, 255, .16),\n    0 24px 48px rgba(18, 29, 57, .28);\n  --fish-hero-before-bg: radial-gradient(70% 80% at 4% 100%, rgba(94, 130, 206, .25), transparent 60%);\n  --fish-hero-title-text: #fff8ea;\n  --fish-mark-text: #ffdf9d;\n  --fish-mark-after-bg: rgba(255, 208, 126, .2);\n  --fish-hero-quote-border-left: rgba(243, 214, 151, .55);\n  --fish-chip-border: rgba(255, 255, 255, .16);\n  --fish-chip-text: #e8edf8;\n  --fish-chip-dot-bg: #e7b96d;\n  --fish-chip-dot-online-bg: #84d8bb;\n  --fish-welcome-bg: color-mix(in srgb, var(--fish-card-bg) 78%, transparent);\n  --fish-welcome-shadow: 0 18px 34px rgba(6, 14, 31, .35);\n  --fish-welcome-photo-bg: transparent;\n  --fish-welcome-text: var(--fish-text);\n  --fish-wave-back-fill: rgba(106, 140, 205, .34);\n  --fish-wave-front-fill: rgba(145, 177, 232, .22);\n  --fish-wave-foam-stroke: rgba(255, 246, 224, .45);\n  --fish-bubbles-stroke: rgba(240, 230, 204, .28);\n  --fish-stat-icon-border: rgba(79, 109, 187, .18);\n  --fish-stat-icon-gold-border: rgba(198, 154, 74, .26);\n  --fish-stat-icon-pink-border: rgba(207, 126, 147, .28);\n  --fish-stat-icon-mint-border: rgba(77, 155, 134, .26);\n  --fish-feature-shadow: 0 2px 0 rgba(49, 62, 98, .06), 0 14px 30px rgba(50, 64, 105, .07);\n  --fish-feature-hover-shadow: 0 20px 40px rgba(50, 64, 105, .12);\n  --fish-feature-before-text: rgba(54, 75, 122, .06);\n  --fish-feature-tag-border: rgba(138, 100, 36, .4);\n  --fish-feature-sticker-bg: #fffdf8;\n  --fish-feature-sticker-shadow: 0 12px 24px rgba(37, 51, 88, .15);\n  --fish-button-hover-shadow: 0 3px 0 var(--fish-edge), 0 8px 16px rgba(43, 58, 96, .12);\n  --fish-danger-text: #2a1420;\n  --fish-danger-shadow: 0 2px 0 rgba(90, 24, 40, .28);\n  --fish-primary-hover-text: #fff8ea;\n  --fish-switch-bg: linear-gradient(180deg, #ffffff26, #0000000a), var(--fish-switch-off);\n  --fish-switch-shadow: inset 0 1px 2px #0002, 0 1px 0 var(--fish-rim);\n  --fish-switch-thumb-bg: #fff8e9;\n  --fish-switch-thumb-shadow: inset 0 1px 0 #fff, 0 2px 4px #0003;\n  --fish-switch-checked-bg: linear-gradient(180deg, #ffffff26, #0000000a), var(--fish-switch-on);\n  --fish-switch-checked-shadow: inset 0 1px 0 #ffffff26, 0 1px 0 var(--fish-rim);\n  --fish-update-dot-shadow: 0 0 0 3px rgba(198, 154, 74, .16);\n  --fish-update-art-shadow: 0 20px 42px rgba(37, 51, 88, .16), 0 2px 0 rgba(49, 62, 98, .06);\n  --fish-update-art-before-bg: radial-gradient(circle at 50% 45%, rgba(198, 154, 74, .18), transparent 68%);\n  --fish-update-art-hover-shadow: 0 26px 50px rgba(37, 51, 88, .2), 0 2px 0 rgba(49, 62, 98, .06);\n  --fish-table-text: #f6ecd6;\n  --fish-table-bg: rgba(198, 154, 74, .05);\n  --fish-modal-bg: rgba(8, 16, 32, .55);\n  --fish-modal-card-shadow: inset 0 1px 0 var(--fish-rim), 0 24px 54px rgba(7, 15, 32, .35);\n  --fish-message-border: rgba(154, 100, 28, .35);\n  --fish-notice-border: rgba(198, 154, 74, .5);\n  --fish-notice-bg: radial-gradient(120% 120% at 100% 0%, #2c4570, #16223d);\n  --fish-notice-text: #f8f1e2;\n  --fish-notice-shadow: inset 0 1px 0 rgba(255, 255, 255, .16), 0 20px 44px rgba(6, 13, 28, .4);\n  --fish-notice-button-border: rgba(255, 255, 255, .2);\n  --fish-notice-button-bg: rgba(255, 255, 255, .08);\n  --fish-notice-button-text: #f8f1e2;\n  --fish-tab-active-bg: linear-gradient(135deg, #fff8e9, #f3e4c4);\n  --fish-tab-shadow: 0 2px 0 rgba(8, 16, 34, .22);\n  --fish-tab-active-hover-bg: linear-gradient(135deg, #fff8e9, #f3e4c4);\n  --fish-submenu-mobile-bg: rgba(255, 255, 255, .04);\n  --fish-nav-bg: rgba(246, 231, 197, .24);\n  --fish-help-popover-shadow: var(--fish-shadow), 0 12px 26px rgba(30, 42, 74, .16);\n  --fish-jump-flash-after-shadow: 0 0 0 2px var(--fish-gold), 0 0 26px rgba(198, 154, 74, .38);\n  --fish-terminal-card-border: rgba(194, 158, 92, .32);\n  --fish-terminal-card-bg: #0b1725;\n  --fish-terminal-card-shadow: 0 18px 40px rgba(4, 12, 22, .28);\n  --fish-terminal-head-border-bottom: rgba(194, 158, 92, .18);\n  --fish-terminal-head-bg: linear-gradient(180deg, #102132 0%, rgba(16, 33, 50, .97) 100%);\n  --fish-terminal-head-text: #d9e7e9;\n  --fish-terminal-live-text: #8fe0b1;\n  --fish-terminal-live-bg: #65d69a;\n  --fish-terminal-live-shadow: 0 0 0 3px rgba(101, 214, 154, .14);\n  --fish-terminal-title-text: rgba(217, 231, 233, .72);\n  --fish-terminal-count-text: rgba(217, 231, 233, .45);\n  --fish-terminal-bg: #08131f;\n  --fish-terminal-text: #cfe3e8;\n  --fish-terminal-time-text: rgba(194, 158, 92, .82);\n  --fish-terminal-prompt-text: #c2a05f;\n  --fish-terminal-empty-text: rgba(207, 227, 232, .48);\n  --fish-terminal-error-border-top: rgba(194, 158, 92, .18);\n  --fish-terminal-error-text: #f0b5a7;\n  --fish-select-popup-bg: linear-gradient(135deg, #ffffff1f, #ffffff03), color-mix(in srgb, var(--fish-surface) 82%, transparent);\n  --fish-select-popup-shadow: inset 0 1px 0 #ffffff24, 0 18px 40px rgba(15, 25, 45, .22), var(--fish-control-shadow);\n  --fish-version-pin-hover-focus-text: #fff1c9;\n  --fish-rice-tooltip-border: rgba(246, 231, 197, .16);\n  --fish-rice-tooltip-bg: #1b222d;\n  --fish-rice-tooltip-shadow: 0 18px 44px rgba(0, 0, 0, .36);\n  --fish-rice-tooltip-text: #f6edda;\n  --fish-rice-tip-date-text: #b9c3d2;\n  --fish-rice-tip-total-text: #b9c3d2;\n  --fish-rice-tip-cost-text: #6ee7b7;\n  --fish-rice-tip-label-border-top: rgba(246, 231, 197, .13);\n  --fish-rice-tip-label-text: #b9c3d2;\n  --fish-rice-tip-row-head-text: #9aa6b7;\n  --fish-rice-tip-bar-bg: rgba(255, 255, 255, .08);\n  --fish-rice-tip-bar-fill: #49e3a2;\n  --fish-rice-tip-empty-text: #9aa6b7;\n  --fish-memory-dialog-shadow: 0 24px 100px #0005;\n  --fish-memory-dialog-bg: rgba(8,16,28,.55);\n  --fish-notice-card-shadow: 0 8px 30px #0003;\n  --fish-memory-nav-active-shadow: 0 3px 10px #0000000a;\n  --fish-table-head-bg: var(--fish-navy);\n  --fish-sticker-backdrop: rgba(8,16,32,.65);\n\n  /* 挂饰与液态玻璃浮层 */\n  --fm-paper: #182741;\n  --fm-rim: #587aaa66;\n  --fm-edge: #091426;\n  --fm-fill: linear-gradient(155deg,#243757,#1b2c48 50%,#16253f);\n  --fm-shadow: inset 0 2px 0 var(--fm-rim),inset 0 -3px 0 #10213d,0 3px 0 var(--fm-edge),0 10px 24px #03091555;\n  --fm-text: #e2ecff;\n  --fm-muted: #b0c1e0;\n  --fm-border: #344a70;\n  --fm-soft: #1d2f50;\n  --fm-accent: #a6bbff;\n  --fm-green: #93d1bb;\n  --fm-blue: #a6bbff;\n  --fm-pink: #e5a9c8;\n  --fm-amber: #eac28c;\n  --fm-purple: #caa8dc;\n  --fm-glass-color: 18,29,51;\n  --fm-glass-edge: #ffffff40;\n  --fm-glass-shadow: inset 1px 1px 1px #ffffff40,inset -1px -1px 1px #ffffff10,0 18px 48px #02081866;\n  --fm-glass-highlight: linear-gradient(135deg,#ffffff2e,transparent 42%,#ffffff08);\n  color-scheme: dark;\n}\n\n:host([data-theme=dark]) .fm-panel[data-content=cost] {\n  --fm-paper: var(--fish-bg);\n  --fm-fill: var(--fish-panel);\n  --fm-text: var(--fish-text);\n  --fm-muted: var(--fish-muted);\n  --fm-border: var(--fish-border);\n  --fm-green: var(--fish-success);\n  --fm-shadow: var(--fish-shadow);\n}\n";
const FISH_THEME_CSS = FISH_PALETTE_CSS + "/* 大肥鱼 · 深海手帐。\n   浅色是奶油纸 + 深海军蓝装订；深色是夜海纸 + 金色墨水。\n   所有样式都收在 .big-fish / .big-fish-notice 内，不碰宿主。 */\n.big-fish,\n.big-fish-notice {\n  --fish-font: 'HarmonyOS Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;\n  --fish-title: var(--fish-font);\n  --fish-body: 15px;\n  --fish-small: 12.5px;\n  --fish-label: 14px;\n  --fish-radius: 24px;\n  --fish-radius-mid: 18px;\n  --fish-radius-sm: 11px;\n  --fish-gap: 24px;\n  --fish-motion: 180ms;\n\n  --dsw-alias-bg-base: var(--fish-bg);\n  --dsw-alias-bg-layer-1: var(--fish-surface);\n  --dsw-alias-bg-layer-2: var(--fish-soft);\n  --dsw-alias-label-primary: var(--fish-text);\n  --dsw-alias-label-secondary: var(--fish-muted);\n  --dsw-alias-label-tertiary: var(--fish-muted);\n  --dsw-alias-border-l1: var(--fish-line);\n  --dsw-alias-border-l2: var(--fish-border);\n  --dsw-alias-state-business-primary: var(--fish-action);\n  --dsw-alias-interactive-bg-hover: var(--fish-hover);\n\n  color: var(--fish-text);\n  font: var(--fish-body)/1.7 var(--fish-font);\n  font-weight: 400;\n}\n\n\n@font-face {\n  font-family: 'HarmonyOS Sans SC';\n  src: local('HarmonyOS Sans SC'), local('HarmonyOS Sans SC Regular'), local('HarmonyOS_Sans_SC_Regular');\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: 'HarmonyOS Sans SC';\n  src: local('HarmonyOS Sans SC Medium'), local('HarmonyOS_Sans_SC_Medium');\n  font-weight: 500 600;\n  font-style: normal;\n  font-display: swap;\n}\n\n@font-face {\n  font-family: 'HarmonyOS Sans SC';\n  src: local('HarmonyOS Sans SC Bold'), local('HarmonyOS_Sans_SC_Bold');\n  font-weight: 700 900;\n  font-style: normal;\n  font-display: swap;\n}\n\n.big-fish {\n  box-sizing: border-box;\n  container-type: inline-size;\n  width: 100%;\n  height: 100%;\n  min-width: 0;\n  overflow: hidden;\n  padding: calc(12px + var(--dsh-frame-top-clearance, 0px)) 12px 12px;\n  background:\n    radial-gradient(80% 60% at 12% 0%, var(--fish-app-glow-1) 0%, transparent 64%),\n    radial-gradient(70% 50% at 100% 100%, var(--fish-app-glow-2) 0%, transparent 60%),\n    var(--fish-bg);\n}\n\n.big-fish *,\n.big-fish-notice * {\n  box-sizing: border-box;\n}\n\n.big-fish [hidden]:not([hidden=\"until-found\"]) {\n  display: none !important;\n}\n\n.big-fish .fish-logo-img {\n  display: block;\n  object-fit: contain;\n}\n\n.big-fish .fish-glyph {\n  display: block;\n  flex: none;\n}\n\n.big-fish .fish-frame {\n  position: relative;\n  display: grid;\n  grid-template-columns: 236px minmax(0, 1fr);\n  gap: 18px;\n  height: 100%;\n  max-width: 1600px;\n  margin: 0 auto;\n}\n\n/* ── 装订侧栏 ─────────────────────────────────────────────── */\n\n.big-fish .fish-binder {\n  position: relative;\n  isolation: isolate;\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  min-height: 0;\n  padding: 22px 14px 16px;\n  border-radius: 30px;\n  color: var(--fish-binder-text);\n  background: var(--fish-binder-bg);\n  box-shadow: var(--fish-binder-shadow);\n}\n\n.big-fish .fish-binder::before {\n  content: '';\n  position: absolute;\n  inset: 9px;\n  z-index: 3;\n  border: 1px dashed var(--fish-binder-before-border);\n  border-radius: 23px;\n  pointer-events: none;\n}\n\n.big-fish .fish-rings {\n  position: absolute;\n  z-index: 4;\n  top: 92px;\n  bottom: 92px;\n  right: -10px;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  pointer-events: none;\n}\n\n.big-fish .fish-rings span {\n  width: 20px;\n  height: 12px;\n  border-radius: 99px;\n  background: var(--fish-rings-bg);\n  box-shadow: var(--fish-rings-shadow);\n}\n\n.big-fish .fish-brand {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 2px 6px 16px;\n  border-bottom: 1px dashed var(--fish-brand-border-bottom);\n}\n\n.big-fish .fish-logo {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 46px;\n  height: 46px;\n  border-radius: 50%;\n  background: transparent;\n  box-shadow: none;\n  transform: none;\n}\n\n.big-fish .fish-logo .fish-logo-img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: contain;\n  filter: drop-shadow(0 5px 10px var(--fish-logo-img-filter));\n}\n\n.big-fish .fish-brand-text {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-width: 0;\n}\n\n.big-fish .fish-brand-name {\n  font: 800 22px/1.2 var(--fish-title);\n  letter-spacing: .06em;\n  color: var(--fish-brand-name-text);\n  white-space: nowrap;\n}\n\n.big-fish .fish-brand-sub {\n  margin-top: 2px;\n  color: var(--fish-brand-sub-text);\n  font-size: 10.5px;\n  letter-spacing: .16em;\n  white-space: nowrap;\n}\n\n.big-fish .fish-version-pin {\n  flex: none;\n  padding: 3px 7px;\n  border: 1px solid var(--fish-version-pin-border);\n  border-radius: 99px;\n  background: var(--fish-version-pin-bg);\n  color: var(--fish-version-pin-text);\n  font-size: 10px;\n  line-height: 1.4;\n}\n\n.big-fish .fish-nav {\n  justify-content: flex-start;\n  position: relative;\n  isolation: isolate;\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  gap: 7px;\n  min-height: 0;\n  overflow: auto;\n  overflow-x: hidden;\n  padding: 2px;\n  scrollbar-width: thin;\n}\n\n.big-fish .fish-nav-group {\n  min-width: 0;\n  flex: none;\n}\n\n.big-fish .fish-nav button {\n  box-shadow: none;\n  transform: none;\n}\n\n.big-fish .fish-tab {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  min-height: 44px;\n  padding: 9px 11px;\n  border: 0;\n  border-radius: 14px;\n  background: transparent;\n  color: var(--fish-tab-text);\n  font: 600 14px/1.4 var(--fish-font);\n  text-align: left;\n  letter-spacing: .01em;\n  transition: color var(--fish-motion), background-color var(--fish-motion);\n}\n\n.big-fish .fish-tab-icon {\n  display: grid;\n  place-items: center;\n  flex: none;\n  width: 28px;\n  height: 28px;\n  border-radius: 10px;\n  color: var(--fish-tab-icon-text);\n  background: var(--fish-tab-icon-bg);\n  transition: color var(--fish-motion), background-color var(--fish-motion);\n}\n\n.big-fish .fish-tab-label {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.big-fish .fish-tab-no {\n  flex: none;\n  color: var(--fish-tab-no-text);\n  font: 600 9.5px/1 var(--fish-font);\n  letter-spacing: .12em;\n}\n\n.big-fish .fish-tab[aria-selected=true] {\n  color: var(--fish-tab-active-text);\n}\n\n.big-fish .fish-tab[aria-selected=true] .fish-tab-icon {\n  color: var(--fish-tab-active-icon-text);\n  background: var(--fish-tab-active-icon-bg);\n}\n\n.big-fish .fish-tab[aria-selected=true] .fish-tab-no {\n  color: var(--fish-tab-active-number-text);\n}\n\n.big-fish .fish-nav-highlight {\n  position: absolute;\n  z-index: 0;\n  top: 0;\n  left: 2px;\n  right: 2px;\n  height: 44px;\n  border-radius: 14px;\n  background: var(--fish-nav-highlight-bg);\n  box-shadow: var(--fish-nav-highlight-shadow);\n  pointer-events: none;\n  transition: transform .32s cubic-bezier(.22, 1, .36, 1), height .25s;\n}\n\n.big-fish .fish-tab:hover {\n  color: var(--fish-tab-hover-text);\n  background: var(--fish-tab-hover-bg);\n}\n\n.big-fish .fish-tab[aria-selected=true]:hover {\n  color: var(--fish-tab-active-hover-text);\n  background: transparent;\n}\n\n.big-fish .fish-submenu {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 4px 0 8px 34px;\n  padding: 4px 0 4px 12px;\n  border-left: 1px dashed var(--fish-submenu-border-left);\n}\n\n.big-fish .fish-submenu button {\n  display: block;\n  width: 100%;\n  min-height: 34px;\n  padding: 6px 10px;\n  border: 0;\n  border-radius: 10px;\n  background: transparent;\n  color: var(--fish-submenu-text);\n  font: 500 13px/1.4 var(--fish-font);\n  text-align: left;\n  white-space: nowrap;\n  box-shadow: none;\n}\n\n.big-fish .fish-submenu button[aria-current=page] {\n  color: var(--fish-submenu-active-text);\n  background: var(--fish-submenu-bg);\n  box-shadow: var(--fish-submenu-shadow);\n  font-weight: 700;\n}\n\n.big-fish .fish-submenu button:hover {\n  color: var(--fish-submenu-hover-text);\n  background: var(--fish-submenu-hover-bg);\n}\n\n.big-fish .fish-submenu button[aria-current=page]:hover {\n  color: var(--fish-submenu-active-hover-text);\n  background: var(--fish-submenu-active-hover-bg);\n}\n\n.big-fish .fish-binder-foot {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex: none;\n  flex-direction: column;\n  gap: 10px;\n  padding: 12px 6px 5px;\n  border-top: 1px dashed var(--fish-binder-foot-border-top);\n}\n\n.big-fish .fish-sidebar-note {\n  display: flex;\n  align-items: flex-start;\n  gap: 7px;\n  margin: 0;\n  color: var(--fish-sidebar-note-text);\n  font-size: 11.5px;\n  line-height: 1.6;\n  overflow-wrap: anywhere;\n}\n\n.big-fish .fish-connection-dot {\n  flex: none;\n  width: 7px;\n  height: 7px;\n  margin-top: 5px;\n  border-radius: 99px;\n  background: var(--fish-connection-dot-bg);\n  box-shadow: var(--fish-connection-dot-shadow);\n}\n\n.big-fish .fish-connection-dot[data-connected=true] {\n  background: var(--fish-connection-dot-online-bg);\n  box-shadow: var(--fish-connection-dot-online-shadow);\n}\n\n/* ── 手帐纸面 ─────────────────────────────────────────────── */\n\n.big-fish .fish-workspace {\n  position: relative;\n  min-width: 0;\n  min-height: 0;\n  height: 100%;\n}\n\n.big-fish .fish-paper {\n  --fish-paper-radius: 30px;\n  --fish-scroll-inset: 12px;\n  --fish-scroll-radius: 18px;\n  --fish-fade-height: 28px;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  overflow: visible;\n  border: 1px solid var(--fish-paper-border);\n  border-radius: var(--fish-paper-radius);\n  background-color: var(--fish-paper-bg);\n  background-image:\n    radial-gradient(90% 44% at 50% 0%, var(--fish-paper-glow), transparent 70%),\n    radial-gradient(var(--fish-dot) 1px, transparent 1px);\n  background-size: auto, 20px 20px;\n  box-shadow: var(--fish-paper-shadow);\n}\n\n.big-fish .fish-scroll {\n  position: relative;\n  z-index: 1;\n  flex: 1 1 auto;\n  min-height: 0;\n  margin: var(--fish-scroll-inset);\n  padding: 24px 34px 34px;\n  overflow-x: hidden;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  scrollbar-gutter: stable;\n  border-radius: var(--fish-scroll-radius);\n  clip-path: inset(0 round var(--fish-scroll-radius));\n  scrollbar-color: var(--fish-control-border) transparent;\n}\n\n.big-fish .fish-fade {\n  position: absolute;\n  z-index: 2;\n  right: calc(var(--fish-scroll-inset) + 11px);\n  left: var(--fish-scroll-inset);\n  height: var(--fish-fade-height);\n  opacity: .9;\n  pointer-events: none;\n}\n\n.big-fish .fish-fade-top {\n  top: 0;\n  background: linear-gradient(180deg, var(--fish-paper-bg) 0%, var(--fish-fade-mid) 42%, transparent 100%);\n}\n\n.big-fish .fish-fade-bottom {\n  bottom: 0;\n  background: linear-gradient(0deg, var(--fish-paper-bg) 0%, var(--fish-fade-mid) 42%, transparent 100%);\n}\n\n.big-fish .fish-paper::before {\n  content: '';\n  position: absolute;\n  z-index: 3;\n  inset: 11px;\n  border: 1px dashed var(--fish-stitch);\n  border-radius: 22px;\n  opacity: .55;\n  pointer-events: none;\n}\n\n.big-fish .fish-content {\n  position: relative;\n  z-index: 1;\n  max-width: 1180px;\n  margin: 0 auto;\n}\n\n.big-fish .fish-tape {\n  position: absolute;\n  z-index: 4;\n  width: 86px;\n  height: 24px;\n  background-color: var(--fish-tape-warm);\n  background-image: var(--fish-tape-bg-image);\n  opacity: .92;\n  clip-path: polygon(2% 0, 100% 4%, 98% 100%, 0 94%);\n  box-shadow: var(--fish-tape-shadow);\n  pointer-events: none;\n}\n\n.big-fish .fish-tape-corner {\n  top: -11px;\n}\n\n.big-fish .fish-tape-left {\n  left: 72px;\n  transform: rotate(-6deg);\n}\n\n.big-fish .fish-tape-right {\n  right: 96px;\n  background-color: var(--fish-tape-blue);\n  transform: rotate(5deg);\n}\n\n.big-fish .fish-kicker {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--fish-blue-strong);\n  font: 700 10.5px/1.6 var(--fish-font);\n  letter-spacing: .18em;\n  text-transform: uppercase;\n}\n\n.big-fish .fish-kicker-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 99px;\n  background: var(--fish-gold);\n  box-shadow: var(--fish-kicker-dot-shadow);\n}\n\n.big-fish .fish-kicker-light {\n  color: var(--fish-kicker-light-text);\n}\n\n.big-fish .fish-muted {\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n}\n\n.big-fish h1 {\n  margin: 0;\n  font: 800 clamp(28px, 3cqi, 38px)/1.25 var(--fish-title);\n  letter-spacing: -.01em;\n}\n\n.big-fish h2 {\n  margin: 0 0 8px;\n  font: 800 20px/1.35 var(--fish-title);\n  letter-spacing: -.005em;\n}\n\n.big-fish h3 {\n  margin: 0 0 8px;\n  font-size: 16px;\n  line-height: 1.7;\n}\n\n.big-fish p {\n  margin: 8px 0;\n  max-width: none;\n  overflow-wrap: anywhere;\n}\n\n.big-fish .fish-page-head {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 28px;\n  margin: 0 0 28px;\n  padding: 0 0 24px;\n  border-bottom: 1px dashed var(--fish-stitch);\n}\n\n.big-fish .fish-page-head-copy {\n  min-width: 0;\n}\n\n.big-fish .fish-page-head h1 {\n  margin: 6px 0 8px;\n}\n\n.big-fish .fish-page-desc {\n  margin: 0;\n  max-width: none;\n  color: var(--fish-muted);\n  font-size: 14.5px;\n  line-height: 1.75;\n}\n\n.big-fish .fish-page-stamp {\n  position: relative;\n  display: flex;\n  flex: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 1px;\n  width: 96px;\n  height: 96px;\n  border: 2px solid var(--fish-page-stamp-border);\n  border-radius: 50%;\n  background: var(--fish-stamp-bg);\n  color: var(--fish-stamp-ink);\n  box-shadow: var(--fish-page-stamp-shadow);\n  transform: rotate(-7deg);\n}\n\n.big-fish .fish-page-stamp::after {\n  content: '';\n  position: absolute;\n  inset: 5px;\n  border: 1px dashed currentColor;\n  border-radius: 50%;\n  opacity: .42;\n}\n\n.big-fish .fish-page-stamp .fish-glyph {\n  color: var(--fish-blue-strong);\n}\n\n.big-fish .fish-page-stamp-no {\n  color: var(--fish-blue-strong);\n  font: 800 17px/1 var(--fish-title);\n  letter-spacing: .08em;\n}\n\n.big-fish .fish-page-stamp-label {\n  font: 600 10px/1.4 var(--fish-font);\n  letter-spacing: .12em;\n}\n\n/* ── 总览 · 深海封面 ──────────────────────────────────────── */\n\n.big-fish .fish-overview {\n  display: flex;\n  flex-direction: column;\n  gap: 30px;\n}\n\n.big-fish .fish-hero {\n  position: relative;\n  isolation: isolate;\n  display: grid;\n  grid-template-columns: minmax(0, 1.12fr) minmax(238px, .88fr);\n  align-items: center;\n  gap: clamp(18px, 3cqi, 40px);\n  min-height: 396px;\n  padding: clamp(28px, 4cqi, 50px) clamp(24px, 4cqi, 52px) 92px;\n  overflow: hidden;\n  border: 1px solid var(--fish-hero-border);\n  border-radius: 30px;\n  background: var(--fish-hero-bg);\n  box-shadow: var(--fish-hero-shadow);\n  color: var(--fish-hero-text);\n}\n\n.big-fish .fish-hero::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background: var(--fish-hero-before-bg);\n  pointer-events: none;\n}\n\n.big-fish .fish-hero-copy {\n  position: relative;\n  z-index: 2;\n  min-width: 0;\n}\n\n.big-fish .fish-hero h1 {\n  margin: 14px 0 16px;\n  color: var(--fish-hero-title-text);\n  font: 800 clamp(30px, 4.2cqi, 52px)/1.28 var(--fish-title);\n  letter-spacing: -.02em;\n  text-wrap: balance;\n}\n\n.big-fish .fish-mark {\n  position: relative;\n  display: inline-block;\n  z-index: 1;\n  color: var(--fish-mark-text);\n}\n\n.big-fish .fish-mark::after {\n  content: '';\n  position: absolute;\n  z-index: -1;\n  right: -4px;\n  bottom: 1px;\n  left: -4px;\n  height: .32em;\n  border-radius: 99px;\n  background: var(--fish-mark-after-bg);\n}\n\n.big-fish .fish-hero-lead {\n  max-width: none;\n  margin: 0;\n  color: var(--fish-hero-lead);\n  font-size: 15.5px;\n  line-height: 1.85;\n}\n\n.big-fish .fish-hero-quote {\n  max-width: none;\n  margin: 20px 0 0;\n  padding-left: 14px;\n  border-left: 2px dashed var(--fish-hero-quote-border-left);\n  color: var(--fish-hero-gold);\n  font: 500 15px/1.7 'Kaiti SC', STKaiti, KaiTi, serif;\n  letter-spacing: .04em;\n}\n\n.big-fish .fish-hero-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin-top: 24px;\n}\n\n.big-fish .fish-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  padding: 6px 11px;\n  border: 1px solid var(--fish-chip-border);\n  border-radius: 99px;\n  background: var(--fish-chip-bg);\n  color: var(--fish-chip-text);\n  font-size: 11.5px;\n  line-height: 1.4;\n  letter-spacing: .02em;\n}\n\n.big-fish .fish-chip-status {\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--fish-hero-lead);\n  font-weight: 600;\n}\n\n.big-fish .fish-chip b {\n  color: var(--fish-hero-gold);\n  font-weight: 700;\n}\n\n.big-fish .fish-chip-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 99px;\n  background: var(--fish-chip-dot-bg);\n}\n\n.big-fish .fish-chip[data-ok] .fish-chip-dot {\n  background: var(--fish-chip-dot-online-bg);\n}\n\n.big-fish .fish-welcome {\n  position: relative;\n  z-index: 2;\n  justify-self: center;\n  width: clamp(220px, 24cqi, 320px);\n  margin: 0;\n  padding: 12px 12px 10px;\n  border-radius: 20px;\n  background: var(--fish-welcome-bg);\n  box-shadow: var(--fish-welcome-shadow);\n  transform: rotate(2.5deg);\n  pointer-events: none;\n  animation: fish-float 7s ease-in-out infinite;\n}\n\n.big-fish .fish-welcome img {\n  display: block;\n  width: 100%;\n  height: auto;\n  border-radius: 12px;\n  background: var(--fish-welcome-photo-bg);\n}\n\n.big-fish .fish-welcome figcaption {\n  padding-top: 8px;\n  color: var(--fish-welcome-text);\n  font: 600 12.5px/1.5 'Kaiti SC', STKaiti, KaiTi, serif;\n  text-align: center;\n  letter-spacing: .02em;\n}\n\n.big-fish .fish-welcome-tape {\n  top: -12px;\n  left: 50%;\n  width: 94px;\n  transform: translateX(-50%) rotate(-3deg);\n}\n\n.big-fish .fish-hero-wave {\n  position: absolute;\n  z-index: 0;\n  right: 0;\n  bottom: -2px;\n  left: 0;\n  width: 100%;\n  height: 118px;\n  pointer-events: none;\n}\n\n.big-fish .fish-wave-back {\n  fill: var(--fish-wave-back-fill);\n  transform-box: fill-box;\n  transform-origin: center bottom;\n  animation: fish-wave-breathe 12s ease-in-out infinite;\n}\n\n.big-fish .fish-wave-front {\n  fill: var(--fish-wave-front-fill);\n  transform-box: fill-box;\n  transform-origin: center bottom;\n  animation: fish-wave-breathe 9s ease-in-out -2.2s infinite;\n}\n\n.big-fish .fish-wave-foam {\n  fill: none;\n  stroke: var(--fish-wave-foam-stroke);\n  stroke-width: 2;\n  transform-box: fill-box;\n  transform-origin: center;\n  animation: fish-foam-drift 8s ease-in-out infinite;\n}\n\n@keyframes fish-wave-breathe {\n  0%, 100% { transform: translateX(-1px) scale(1, 1); }\n  50% { transform: translateX(1px) scale(1.01, 1.03); }\n}\n\n@keyframes fish-foam-drift {\n  0%, 100% { transform: translateX(-3px) scaleX(1.008); }\n  50% { transform: translateX(3px) scaleX(1.008); }\n}\n\n.big-fish .fish-bubbles {\n  position: absolute;\n  stroke: var(--fish-bubbles-stroke);\n  stroke-width: 2;\n  pointer-events: none;\n}\n\n.big-fish .fish-hero-bubbles {\n  z-index: 1;\n  right: 7%;\n  bottom: 8px;\n  width: 174px;\n  height: 174px;\n  opacity: .82;\n}\n\n.big-fish .fish-hero-bubbles circle,\n.big-fish .fish-hero-bubbles path {\n  transform-box: fill-box;\n  transform-origin: center;\n  animation: fish-bubble-float 6.5s ease-in-out infinite;\n}\n\n.big-fish .fish-hero-bubbles circle:nth-of-type(2) {\n  animation-delay: -2.1s;\n  animation-duration: 7.5s;\n}\n\n.big-fish .fish-hero-bubbles circle:nth-of-type(3) {\n  animation-delay: -4.2s;\n  animation-duration: 5.8s;\n}\n\n.big-fish .fish-hero-bubbles circle:nth-of-type(4) {\n  animation-delay: -1.2s;\n  animation-duration: 8.2s;\n}\n\n.big-fish .fish-hero-bubbles circle:nth-of-type(5) {\n  animation-delay: -3.6s;\n  animation-duration: 6.8s;\n}\n\n.big-fish .fish-hero-bubbles path {\n  animation-delay: -2.8s;\n  animation-duration: 9s;\n}\n\n@keyframes fish-bubble-float {\n  0%, 100% { transform: translateY(2px); opacity: .55; }\n  50% { transform: translateY(-5px); opacity: .95; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .big-fish .fish-wave-back,\n  .big-fish .fish-wave-front,\n  .big-fish .fish-wave-foam,\n  .big-fish .fish-hero-bubbles circle,\n  .big-fish .fish-hero-bubbles path {\n    animation: none;\n  }\n}\n\n.big-fish .fish-sparkle {\n  fill: currentColor;\n  stroke: none;\n  color: var(--fish-hero-gold);\n  pointer-events: none;\n}\n\n.big-fish .fish-hero-spark {\n  position: absolute;\n  z-index: 1;\n  top: 26px;\n  right: 32%;\n  width: 38px;\n  height: 38px;\n  opacity: .76;\n}\n\n/* ── 总览 · 状态与分区 ────────────────────────────────────── */\n\n.big-fish .fish-board {\n  display: block;\n}\n\n.big-fish .fish-section-head {\n  display: flex;\n  align-items: flex-end;\n  justify-content: space-between;\n  gap: 20px;\n  margin-bottom: 16px;\n}\n\n.big-fish .fish-section-head h2 {\n  margin: 5px 0 0;\n  font: 800 clamp(22px, 2.2cqi, 27px)/1.3 var(--fish-title);\n}\n\n.big-fish .fish-section-note {\n  max-width: none;\n  color: var(--fish-muted);\n  font-size: 12px;\n  line-height: 1.6;\n  text-align: right;\n}\n\n.big-fish .fish-stats {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 14px;\n}\n\n.big-fish .fish-stat {\n  display: grid;\n  grid-template-columns: 44px minmax(0, 1fr);\n  align-items: start;\n  gap: 12px;\n  padding: 18px;\n  border-radius: 20px;\n  background: var(--fish-card-bg);\n  border: 1px solid var(--fish-border);\n  box-shadow: var(--fish-small-shadow);\n}\n\n.big-fish .fish-stat-icon {\n  display: grid;\n  place-items: center;\n  width: 44px;\n  height: 44px;\n  border: 1px solid var(--fish-stat-icon-border);\n  border-radius: 14px;\n  background: var(--fish-blue-soft);\n  color: var(--fish-blue-strong);\n}\n\n.big-fish .fish-stat[data-tone=gold] .fish-stat-icon {\n  border-color: var(--fish-stat-icon-gold-border);\n  background: var(--fish-gold-soft);\n  color: var(--fish-gold-ink);\n}\n\n.big-fish .fish-stat[data-tone=rose] .fish-stat-icon {\n  border-color: var(--fish-stat-icon-pink-border);\n  background: var(--fish-pink-soft);\n  color: var(--fish-rose-ink);\n}\n\n.big-fish .fish-stat[data-tone=mint] .fish-stat-icon {\n  border-color: var(--fish-stat-icon-mint-border);\n  background: var(--fish-mint-soft);\n  color: var(--fish-mint-ink);\n}\n\n.big-fish .fish-stat-copy {\n  min-width: 0;\n}\n\n.big-fish .fish-stat-label {\n  display: block;\n  color: var(--fish-muted);\n  font-size: 12px;\n  letter-spacing: .04em;\n}\n\n.big-fish .fish-value {\n  margin: 2px 0 4px;\n  color: var(--fish-text);\n  font: 800 clamp(20px, 2.2cqi, 26px)/1.3 var(--fish-title);\n  letter-spacing: -.01em;\n}\n\n.big-fish .fish-stat-hint {\n  display: block;\n  color: var(--fish-muted);\n  font-size: 12px;\n  line-height: 1.6;\n}\n\n.big-fish .fish-chapters {\n  margin-top: 2px;\n}\n\n.big-fish .fish-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 18px;\n}\n\n@container (min-width: 1320px) {\n  .big-fish .fish-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .big-fish .fish-feature {\n    grid-template-columns: minmax(0, 1fr) 150px;\n    padding: 24px;\n  }\n\n\n  .big-fish .fish-feature h2 {\n    font-size: 22px;\n  }\n\n  .big-fish .fish-feature p {\n    font-size: 13px;\n  }\n}\n\n.big-fish .fish-feature {\n  position: relative;\n  isolation: isolate;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 172px;\n  align-items: center;\n  gap: 18px;\n  min-width: 0;\n  padding: 26px 26px;\n  overflow: hidden;\n  border: 1px solid var(--fish-border);\n  border-radius: 26px;\n  background: var(--fish-feature-1);\n  box-shadow: var(--fish-feature-shadow);\n  transform: rotate(-.35deg);\n  transition: transform .32s cubic-bezier(.22, 1, .36, 1), box-shadow .32s;\n}\n\n.big-fish .fish-feature:nth-child(2) {\n  background: var(--fish-feature-2);\n  transform: rotate(.4deg);\n}\n\n.big-fish .fish-feature:nth-child(3) {\n  background: var(--fish-feature-3);\n  transform: rotate(.3deg);\n}\n\n.big-fish .fish-feature:nth-child(4) {\n  background: var(--fish-feature-4);\n  transform: rotate(-.4deg);\n}\n\n.big-fish .fish-feature:hover {\n  box-shadow: var(--fish-feature-hover-shadow);\n  transform: rotate(0) translateY(-3px);\n}\n\n.big-fish .fish-feature::before {\n  content: attr(data-index);\n  position: absolute;\n  z-index: -1;\n  right: 14px;\n  bottom: -22px;\n  color: var(--fish-feature-before-text);\n  font: 800 92px/1 var(--fish-title);\n  pointer-events: none;\n}\n\n.big-fish .fish-feature-copy {\n  position: relative;\n  z-index: 1;\n  min-width: 0;\n}\n\n.big-fish .fish-feature-tag {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  padding: 4px 10px;\n  border: 1px dashed var(--fish-feature-tag-border);\n  border-radius: 99px;\n  background: var(--fish-tag-bg);\n  color: var(--fish-stamp-ink);\n  font-size: 11px;\n  letter-spacing: .08em;\n}\n\n.big-fish .fish-feature-tag b {\n  color: var(--fish-blue-strong);\n  font: 800 11px/1 var(--fish-title);\n}\n\n.big-fish .fish-feature h2 {\n  margin: 10px 0 8px;\n  font: 800 24px/1.3 var(--fish-title);\n}\n\n.big-fish .fish-feature p {\n  margin: 0;\n  max-width: none;\n  color: var(--fish-muted);\n  font-size: 13.5px;\n  line-height: 1.75;\n}\n\n.big-fish .fish-feature .fish-actions {\n  margin-top: 16px;\n}\n\n.big-fish .fish-feature-sticker {\n  position: relative;\n  justify-self: center;\n  align-self: end;\n  width: clamp(120px, 14cqi, 168px);\n  margin: 0;\n  padding: 8px 8px 6px;\n  border-radius: 16px;\n  background: var(--fish-feature-sticker-bg);\n  box-shadow: var(--fish-feature-sticker-shadow);\n  transform: rotate(-4deg);\n  pointer-events: none;\n}\n\n.big-fish .fish-feature:nth-child(2) .fish-feature-sticker {\n  transform: rotate(4deg);\n}\n\n.big-fish .fish-feature-sticker img {\n  display: block;\n  width: 100%;\n  height: auto;\n  border-radius: 10px;\n}\n\n.big-fish .fish-feature-tape {\n  top: -10px;\n  left: 50%;\n  width: 64px;\n  height: 19px;\n  background-color: var(--fish-tape-rose);\n  transform: translateX(-50%) rotate(2deg);\n}\n\n.big-fish .fish-feature-light {\n  grid-template-columns: minmax(0, 1fr) auto;\n}\n\n.big-fish .fish-feature-sticker-small {\n  align-self: center;\n  width: clamp(96px, 12cqi, 152px);\n  transform: rotate(-4deg);\n}\n\n.big-fish .fish-feature:nth-child(4) .fish-feature-sticker-small {\n  transform: rotate(4deg);\n}\n\n/* ── 通用控件 ─────────────────────────────────────────────── */\n\n.big-fish button,\n.big-fish input,\n.big-fish select,\n.big-fish textarea,\n.big-fish-notice button {\n  max-width: 100%;\n  font-family: var(--fish-font);\n  font-size: var(--fish-label);\n  line-height: 1.6;\n}\n\n.big-fish button,\n.big-fish-notice button {\n  min-height: 38px;\n  cursor: pointer;\n  letter-spacing: .02em;\n  transition: box-shadow var(--fish-motion), transform var(--fish-motion), background-color var(--fish-motion), color var(--fish-motion);\n}\n\n.big-fish .fish-button,\n.big-fish-notice button {\n  padding: 9px 16px;\n  border: 1px solid var(--fish-border);\n  border-radius: 12px;\n  background: var(--fish-control-fill);\n  color: var(--fish-text);\n  font-weight: 600;\n  box-shadow: 0 2px 0 var(--fish-edge);\n}\n\n.big-fish .fish-button:not(:disabled):hover,\n.big-fish-notice button:not(:disabled):hover {\n  transform: translateY(-1px);\n  box-shadow: var(--fish-button-hover-shadow);\n}\n\n.big-fish .fish-button:not(:disabled):active,\n.big-fish-notice button:not(:disabled):active {\n  transform: translateY(1px);\n  box-shadow: var(--fish-inset);\n}\n\n.big-fish .fish-button.fish-danger {\n  border-color: var(--fish-danger);\n  background: var(--fish-danger);\n  color: var(--fish-danger-text);\n  box-shadow: var(--fish-danger-shadow);\n}\n\n.big-fish .fish-primary {\n  border-color: var(--fish-action);\n  background: var(--fish-action);\n  color: var(--fish-on-accent);\n}\n\n.big-fish .fish-primary:not(:disabled):hover {\n  background: var(--fish-blue-strong);\n  border-color: var(--fish-blue-strong);\n  color: var(--fish-primary-hover-text);\n}\n\n.big-fish .fish-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  padding: 4px 11px;\n  border: 1px dashed var(--fish-border);\n  border-radius: 99px;\n  background: var(--fish-soft);\n  color: var(--fish-blue-strong);\n  font-size: 11.5px;\n  line-height: 1.6;\n  white-space: nowrap;\n}\n\n.big-fish .fish-actions {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-top: 14px;\n}\n\n.big-fish .fish-card {\n  min-width: 0;\n  padding: 20px;\n  border: 1px solid var(--fish-border);\n  border-radius: 22px;\n  background: var(--fish-panel);\n  box-shadow: var(--fish-shadow);\n}\n\n.big-fish input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=color]):not([type=button]):not([type=submit]):not([type=reset]),\n.big-fish select,\n.big-fish textarea {\n  appearance: none !important;\n  -webkit-appearance: none !important;\n  min-width: 0;\n  min-height: 42px;\n  padding: 10px 14px 10px var(--fish-input-left, 14px) !important;\n  border: 1px solid var(--fish-control-border) !important;\n  border-radius: 12px !important;\n  background-color: var(--fish-surface) !important;\n  background-image: none !important;\n  color: var(--fish-text) !important;\n  box-shadow: var(--fish-control-shadow) !important;\n  font-family: var(--fish-font) !important;\n  font-size: var(--fish-label) !important;\n  line-height: 1.5 !important;\n  transition: border-color var(--fish-motion), box-shadow var(--fish-motion), background-color var(--fish-motion) !important;\n}\n\n.big-fish select {\n  padding-right: 38px !important;\n  background-image: var(--fish-select-arrow) !important;\n  background-repeat: no-repeat !important;\n  background-position: right 13px center !important;\n  background-size: 13px 9px !important;\n  cursor: pointer;\n}\n\n.big-fish textarea {\n  min-height: 112px;\n  padding: 12px 14px !important;\n}\n\n.big-fish select option {\n  background: var(--fish-surface);\n  color: var(--fish-text);\n}\n\n.big-fish input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=color]):not([type=button]):not([type=submit]):not([type=reset]):not(:disabled):hover,\n.big-fish select:not(:disabled):hover,\n.big-fish textarea:not(:disabled):hover {\n  border-color: var(--fish-control-border-strong) !important;\n}\n\n.big-fish input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=color]):not([type=button]):not([type=submit]):not([type=reset]):focus,\n.big-fish select:focus,\n.big-fish textarea:focus {\n  border-color: var(--fish-blue-strong) !important;\n  outline: none !important;\n  box-shadow: 0 0 0 3px var(--fish-focus-ring), var(--fish-control-shadow) !important;\n}\n\n.big-fish input[type=number]::-webkit-inner-spin-button,\n.big-fish input[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n\n.big-fish input[type=number] {\n  appearance: textfield !important;\n  -moz-appearance: textfield !important;\n}\n\n.big-fish input[type=file] {\n  min-height: 42px;\n  padding: 7px 10px;\n  border: 1px solid var(--fish-control-border);\n  border-radius: 12px;\n  background-color: var(--fish-surface);\n  color: var(--fish-text);\n  box-shadow: var(--fish-control-shadow);\n  font-family: var(--fish-font);\n  font-size: var(--fish-label);\n}\n\n.big-fish input[type=file]::file-selector-button {\n  margin-right: 10px;\n  padding: 7px 12px;\n  border: 1px solid var(--fish-border);\n  border-radius: 9px;\n  background: var(--fish-control-fill);\n  color: var(--fish-text);\n  font-family: var(--fish-font);\n  font-size: var(--fish-small);\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.big-fish input::placeholder,\n.big-fish textarea::placeholder {\n  color: var(--fish-muted);\n  opacity: .62;\n}\n\n.big-fish .fish-input-box,\n.big-fish .fish-select-box {\n  position: relative;\n  display: block;\n  width: 100%;\n  min-width: 0;\n}\n\n.big-fish .fish-input-box .fish-input,\n.big-fish .fish-select-box .fish-select-input {\n  width: 100%;\n}\n\n.big-fish .fish-input-icon {\n  position: absolute;\n  top: 50%;\n  left: 12px;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  color: var(--fish-muted);\n  pointer-events: none;\n  transform: translateY(-50%);\n}\n\n.big-fish .fish-input-with-icon {\n  --fish-input-left: 40px;\n}\n\n.big-fish input[type=checkbox],\n.big-fish input[type=radio] {\n  flex: none;\n  width: 18px;\n  height: 18px;\n  accent-color: var(--fish-action);\n  vertical-align: middle;\n}\n\n.big-fish input[type=range],\n.big-fish progress {\n  max-width: 100%;\n  accent-color: var(--fish-action);\n}\n\n.big-fish textarea {\n  resize: vertical;\n  overflow-wrap: anywhere;\n}\n\n.big-fish :disabled,\n.big-fish-notice :disabled {\n  cursor: not-allowed;\n  opacity: .54;\n}\n\n.big-fish :is(button, a, input, select, textarea, summary, [tabindex]):focus-visible,\n.big-fish-notice button:focus-visible {\n  outline: 2px solid var(--fish-gold);\n  outline-offset: 3px;\n}\n\n.big-fish a {\n  color: var(--fish-link);\n  text-decoration: none;\n  overflow-wrap: anywhere;\n}\n\n.big-fish a:hover {\n  text-decoration: underline;\n  text-underline-offset: 3px;\n}\n\n.big-fish summary {\n  min-height: 40px;\n  cursor: pointer;\n  font-weight: 600;\n}\n\n/* 大肥鱼胶囊开关。 */\n.big-fish button.fish-switch[role=switch] {\n  position: relative;\n  display: inline-block;\n  flex: 0 0 52px;\n  width: 52px !important;\n  min-width: 52px !important;\n  max-width: 52px;\n  height: 30px !important;\n  min-height: 30px !important;\n  margin: 6px 0;\n  padding: 0 !important;\n  border: 1px solid var(--fish-control-border) !important;\n  border-radius: 999px !important;\n  appearance: none;\n  -webkit-appearance: none;\n  background: var(--fish-switch-bg) !important;\n  box-shadow: var(--fish-switch-shadow) !important;\n  vertical-align: middle;\n  cursor: pointer;\n  transform: none !important;\n  transition: background-color .2s, border-color .2s, box-shadow .2s;\n}\n\n.big-fish button.fish-switch[role=switch]::before,\n.big-fish button.fish-switch[role=switch]::after {\n  content: none !important;\n}\n\n.big-fish .fish-switch-thumb {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background: var(--fish-switch-thumb-bg);\n  box-shadow: var(--fish-switch-thumb-shadow);\n  pointer-events: none;\n  transition: transform .26s cubic-bezier(.2, .8, .2, 1);\n}\n\n.big-fish button.fish-switch[aria-checked=true] {\n  border-color: var(--fish-switch-on) !important;\n  background: var(--fish-switch-checked-bg) !important;\n  box-shadow: var(--fish-switch-checked-shadow) !important;\n}\n\n.big-fish .fish-switch[aria-checked=true] .fish-switch-thumb {\n  transform: translateX(22px);\n}\n\n.big-fish button.fish-switch:not(:disabled):hover {\n  filter: brightness(1.05);\n}\n\n.big-fish button.fish-switch:disabled {\n  cursor: not-allowed;\n}\n\n/* ── 更新与来源 ───────────────────────────────────────────── */\n\n.big-fish .fish-updates {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n\n.big-fish .fish-updates {\n  gap: 18px;\n}\n\n.big-fish .fish-update-card {\n  position: relative;\n  isolation: isolate;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);\n  align-items: center;\n  gap: 30px;\n  min-height: 300px;\n  padding: 32px 34px;\n  overflow: hidden;\n  background: var(--fish-update-bg);\n}\n\n.big-fish .fish-update-card::after {\n  content: 'EVOLVE';\n  position: absolute;\n  right: 12px;\n  bottom: -28px;\n  z-index: 0;\n  color: var(--fish-ink);\n  font: 800 clamp(72px, 9cqi, 118px)/1 var(--fish-title);\n  letter-spacing: .04em;\n  opacity: .045;\n  pointer-events: none;\n}\n\n.big-fish .fish-update-body {\n  position: relative;\n  z-index: 1;\n  min-width: 0;\n}\n\n.big-fish .fish-update-heading {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  gap: 14px 20px;\n}\n\n.big-fish .fish-update-body h2 {\n  margin: 6px 0 10px;\n  font: 800 clamp(30px, 3.4cqi, 40px)/1.15 var(--fish-title);\n  letter-spacing: -.01em;\n}\n\n.big-fish .fish-update-desc {\n  max-width: none;\n  margin: 0;\n}\n\n.big-fish .fish-update-controls {\n  display: flex;\n  align-items: flex-end;\n  flex-wrap: wrap;\n  gap: 16px 20px;\n  margin-top: 26px;\n  padding-top: 20px;\n  border-top: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-channel-field {\n  display: flex;\n  flex: 0 1 310px;\n  flex-direction: column;\n  gap: 7px;\n  min-width: 250px;\n  max-width: 100%;\n}\n\n.big-fish .fish-channel-field > span {\n  color: var(--fish-text);\n  font-size: 12.5px;\n  font-weight: 600;\n}\n\n.big-fish .fish-channel-field .fish-select-box {\n  width: 100%;\n}\n\n.big-fish .fish-channel-field .fish-select-input {\n  width: 100%;\n  min-width: 250px;\n}\n\n.big-fish .fish-update-operations {\n  display: flex;\n  flex: 0 0 100%;\n  align-items: center;\n  justify-content: flex-start;\n  flex-wrap: nowrap;\n  gap: 10px 12px;\n}\n\n.big-fish .fish-update-badges {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.big-fish .fish-update-status {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  margin: 6px 0 0;\n  padding: 8px 13px;\n  border: 1px solid var(--fish-line);\n  border-radius: 999px;\n  background: var(--fish-soft);\n  color: var(--fish-text);\n  font-size: 12.5px;\n  white-space: nowrap;\n}\n\n.big-fish .fish-update-dot {\n  width: 7px;\n  height: 7px;\n  flex: none;\n  border-radius: 99px;\n  background: var(--fish-gold);\n  box-shadow: var(--fish-update-dot-shadow);\n}\n\n/* 仅侧栏更新提示缓慢明暗变化，保持圆点持续可见。 */\n.big-fish .fish-version-pin .fish-update-dot { animation: fish-update-hint 3.2s ease-in-out infinite; }\n@keyframes fish-update-hint { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }\n@media (prefers-reduced-motion: reduce) {\n  .big-fish .fish-version-pin .fish-update-dot { animation: none; }\n}\n\n.big-fish .fish-update-operations .fish-actions {\n  margin: 0;\n  gap: 10px;\n}\n\n.big-fish .fish-update-operations .fish-button {\n  min-height: 44px;\n  padding: 11px 20px;\n  border-radius: 13px;\n}\n\n.big-fish .fish-update-note {\n  max-width: none;\n  margin: 12px 0 0;\n  font-size: var(--fish-small);\n}\n\n.big-fish .fish-update-art {\n  position: relative;\n  z-index: 1;\n  justify-self: center;\n  width: min(100%, 280px);\n  margin: 0;\n  padding: 10px 10px 8px;\n  border-radius: 20px;\n  background: var(--fish-card-bg);\n  box-shadow: var(--fish-update-art-shadow);\n  transform: rotate(3deg);\n  transition: transform .35s cubic-bezier(.22, 1, .36, 1), box-shadow .35s;\n}\n\n.big-fish .fish-update-art::before {\n  content: '';\n  position: absolute;\n  inset: -32px;\n  z-index: -1;\n  border-radius: 50%;\n  background: var(--fish-update-art-before-bg);\n  pointer-events: none;\n}\n\n.big-fish .fish-update-art img {\n  display: block;\n  width: 100%;\n  height: auto;\n  border-radius: 13px;\n}\n\n.big-fish .fish-update-art:hover {\n  transform: rotate(1deg) translateY(-3px);\n  box-shadow: var(--fish-update-art-hover-shadow);\n}\n\n.big-fish .fish-update-tape {\n  top: -12px;\n  left: 50%;\n  width: 82px;\n  height: 21px;\n  background-color: var(--fish-tape-warm);\n  transform: translateX(-50%) rotate(-2deg);\n}\n\n.big-fish .fish-sources {\n  padding: 24px 28px 26px;\n}\n\n.big-fish .fish-sources-head {\n  align-items: flex-start;\n  gap: 20px;\n}\n\n.big-fish .fish-sources h2 {\n  margin: 4px 0 0;\n  font-size: 23px;\n}\n\n.big-fish .fish-source-link {\n  margin: 7px 0 0;\n  font-size: 12.5px;\n}\n\n.big-fish .fish-sources .fish-table-wrap {\n  margin-top: 16px;\n}\n\n.big-fish .fish-source-name {\n  font-weight: 700;\n  color: var(--fish-text);\n}\n\n.big-fish .fish-table-wrap {\n  overflow-x: auto;\n  border: 1px solid var(--fish-border);\n  border-radius: 18px;\n  background: var(--fish-card-bg);\n}\n\n.big-fish .fish-table {\n  width: 100%;\n  min-width: 760px;\n  border-collapse: collapse;\n  font-size: 13px;\n}\n\n.big-fish .fish-table th {\n  padding: 13px 16px;\n  background: var(--fish-table-head-bg);\n  color: var(--fish-table-text);\n  font-weight: 600;\n  text-align: left;\n  white-space: nowrap;\n}\n\n.big-fish .fish-table td {\n  padding: 14px 16px;\n  border-bottom: 1px dashed var(--fish-line);\n  vertical-align: top;\n}\n\n.big-fish .fish-table tbody tr:last-child td {\n  border-bottom: 0;\n}\n\n.big-fish .fish-table tbody tr:nth-child(even) {\n  background: var(--fish-table-bg);\n}\n\n\n/* ── QQ 绑定表格 ─────────────────────────────────────────── */\n\n.big-fish .qq-binding-groups {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n\n.big-fish .qq-bind-group-head {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n\n.big-fish .qq-bind-group-head h3 {\n  margin: 0;\n  font: 800 18px/1.4 var(--fish-title);\n  white-space: nowrap;\n}\n\n.big-fish .qq-bind-group-head .fish-muted {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.big-fish .qq-bind-group-head .fish-button {\n  flex: none;\n}\n\n.big-fish .qq-bind-scroll {\n  overflow-x: auto;\n  padding-bottom: 4px;\n}\n\n.big-fish .qq-bind-table {\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n}\n\n.big-fish .qq-bind-row {\n  display: grid;\n  align-items: center;\n  gap: 10px;\n  padding: 9px 0;\n  border-bottom: 1px dashed var(--fish-line);\n  white-space: nowrap;\n}\n\n.big-fish .qq-bind-row:last-child {\n  border-bottom: 0;\n}\n\n.big-fish .qq-bind-row-private {\n  grid-template-columns: 90px 100px minmax(160px, 1fr) 78px 92px 120px 52px;\n}\n\n.big-fish .qq-bind-row-group {\n  grid-template-columns: 90px 100px minmax(160px, 1fr) 76px 76px 76px 92px 120px 52px;\n}\n\n.big-fish .qq-bind-row.qq-bind-head {\n  padding: 4px 0 8px;\n  color: var(--fish-muted);\n  font-size: 12px;\n  border-bottom: 1px solid var(--fish-border);\n}\n\n.big-fish .qq-bind-row.qq-bind-head > :nth-last-child(2),\n.big-fish .qq-bind-row.qq-bind-head > :last-child {\n  display: flex;\n  justify-content: flex-start;\n  text-align: left;\n}\n\n.big-fish .qq-bind-row.qq-bind-head > *,\n.big-fish .qq-bind-row:not(.qq-bind-head) > * {\n  text-align: left;\n}\n\n.big-fish .qq-bind-table.qq-bind-hide-enable .qq-bind-row-private {\n  grid-template-columns: 90px 100px minmax(160px, 1fr) 78px 92px 120px;\n}\n\n.big-fish .qq-bind-table.qq-bind-hide-enable .qq-bind-row-group {\n  grid-template-columns: 90px 100px minmax(160px, 1fr) 76px 76px 76px 92px 120px;\n}\n\n.big-fish .qq-bind-table.qq-bind-hide-enable .qq-bind-row > :last-child {\n  display: none;\n}\n\n.big-fish .qq-bind-row input {\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.big-fish .qq-bind-session {\n  min-width: 0;\n}\n\n.big-fish .qq-bind-session select {\n  width: 100%;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.big-fish .qq-bind-cell {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n  min-width: 0;\n}\n\n.big-fish .qq-bind-read {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--fish-text);\n  font-size: 13.5px;\n  line-height: 1.6;\n}\n\n.big-fish .qq-bind-session-read {\n  color: var(--fish-muted);\n}\n\n.big-fish .qq-bind-actions {\n  justify-content: flex-start;\n  gap: 6px;\n  flex-wrap: nowrap;\n}\n\n.big-fish .qq-bind-actions .fish-button {\n  min-width: 0;\n}\n\n.big-fish .qq-bind-editing {\n  padding-inline: 8px;\n  border-radius: 12px;\n  background: var(--fish-soft);\n}\n\n.big-fish .qq-bind-save {\n  min-width: 64px;\n}\n\n.big-fish .qq-bind-row .fish-button {\n  min-height: 32px;\n  padding: 5px 10px;\n  font-size: 12px;\n  white-space: nowrap;\n}\n\n.big-fish .qq-bind-detail {\n  display: grid;\n  gap: 6px;\n  margin: 0 0 10px;\n  padding: 12px 14px;\n  border: 1px dashed var(--fish-border);\n  border-radius: 14px;\n  background: var(--fish-soft);\n}\n\n.big-fish .qq-bind-detail-head {\n  font: 700 14px/1.4 var(--fish-title);\n  color: var(--fish-text);\n}\n\n.big-fish .qq-bind-extra {\n  display: block;\n  margin-top: 4px;\n}\n\n.big-fish .qq-bind-extra-label {\n  display: block;\n  margin-bottom: 4px;\n  color: var(--fish-muted);\n  font-size: 12.5px;\n}\n\n\n.big-fish .qq-role-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 16px;\n  margin-bottom: 14px;\n}\n\n.big-fish .qq-role-head h2 {\n  margin: 0;\n}\n\n.big-fish .qq-role-toggle {\n  display: flex;\n  align-items: center;\n  margin-top: 2px;\n}\n\n.big-fish .qq-role-desc {\n  margin: 0;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n  line-height: 1.8;\n}\n\n.big-fish .qq-role-hint {\n  margin: 8px 0 0;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n  line-height: 1.8;\n}\n\n.big-fish .qq-role-writer-open {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  min-height: 44px;\n}\n\n.big-fish .qq-role-card h3 {\n  margin: 0 0 4px;\n}\n\n.big-fish .qq-role-table-wrap {\n  margin-top: 10px;\n  overflow-x: auto;\n}\n\n.big-fish .qq-role-table {\n  width: 100%;\n  min-width: 680px;\n  border-collapse: collapse;\n  table-layout: fixed;\n}\n\n.big-fish .qq-role-table th {\n  padding: 4px 8px 8px;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n  font-weight: 500;\n  text-align: left;\n  white-space: nowrap;\n  border-bottom: 1px solid var(--fish-border);\n}\n\n.big-fish .qq-role-table td {\n  padding: 10px 8px;\n  border-bottom: 1px dashed var(--fish-line);\n  color: var(--fish-text);\n  font-size: 13.5px;\n  vertical-align: middle;\n  text-align: left;\n}\n\n.big-fish .qq-role-table tbody tr:last-child td {\n  border-bottom: 0;\n}\n\n.big-fish .qq-role-number {\n  width: 110px;\n  white-space: nowrap;\n}\n\n.big-fish .qq-role-session {\n  width: 170px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--fish-muted);\n}\n\n.big-fish .qq-role-text-cell {\n  min-width: 0;\n}\n\n.big-fish .qq-role-text {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.big-fish .qq-role-inherit {\n  color: var(--fish-muted);\n  font-size: 13px;\n}\n\n.big-fish .qq-role-col-icon {\n  width: 58px;\n  text-align: center !important;\n}\n\n.big-fish .qq-role-icon {\n  display: inline-grid;\n  place-items: center;\n  width: 30px;\n  height: 30px;\n  min-height: 30px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 9px;\n  background: transparent;\n  color: var(--fish-blue-strong);\n  box-shadow: none;\n  cursor: pointer;\n}\n\n.big-fish .qq-role-icon:hover:not(:disabled) {\n  border-color: var(--fish-border);\n  background: var(--fish-blue-soft);\n}\n\n.big-fish .qq-role-icon-danger {\n  color: var(--fish-danger);\n}\n\n.big-fish .qq-role-icon:disabled {\n  opacity: .35;\n  cursor: not-allowed;\n}\n\n.big-fish .qq-text-modal {\n  width: min(760px, 100%);\n  max-height: calc(100vh - 40px);\n  overflow: auto;\n}\n\n.big-fish .qq-text-modal-input {\n  display: block;\n  width: 100%;\n  min-height: 220px;\n  margin-top: 14px;\n  padding: 12px;\n  border: 1px solid var(--fish-control-border);\n  border-radius: var(--fish-radius-sm);\n  background: var(--fish-surface);\n  color: var(--fish-text);\n  font: inherit;\n  line-height: 1.75;\n  box-sizing: border-box;\n  resize: vertical;\n}\n\n.big-fish .qq-role-writer-card {\n  width: min(680px, 100%);\n  max-height: calc(100vh - 40px);\n  overflow: auto;\n}\n\n.big-fish .qq-role-writer-input {\n  display: block;\n  width: 100%;\n  min-height: 96px;\n  margin-top: 14px;\n  padding: 12px;\n  border: 1px solid var(--fish-control-border);\n  border-radius: var(--fish-radius-sm);\n  background: var(--fish-surface);\n  color: var(--fish-text);\n  font: inherit;\n  line-height: 1.75;\n  box-sizing: border-box;\n  resize: vertical;\n}\n\n.big-fish .qq-role-writer-result {\n  margin-top: 14px;\n  padding-top: 12px;\n  border-top: 1px dashed var(--fish-border);\n}\n\n.big-fish .qq-role-writer-result-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.big-fish .qq-role-writer-result-text {\n  max-height: 260px;\n  margin: 8px 0 0;\n  padding: 10px 12px;\n  overflow: auto;\n  border: 1px solid var(--fish-border);\n  border-radius: 12px;\n  background: var(--fish-soft);\n  color: var(--fish-text);\n  font: inherit;\n  font-size: 13.5px;\n  line-height: 1.8;\n  white-space: pre-wrap;\n}\n\n.big-fish .qq-bind-reminder {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 12px 16px;\n  border: 1px dashed var(--fish-border);\n  border-radius: 16px;\n  background: var(--fish-soft);\n  color: var(--fish-text);\n  font-size: 13px;\n  line-height: 1.7;\n}\n\n.big-fish .qq-bind-reminder-icon {\n  display: grid;\n  flex: none;\n  place-items: center;\n  width: 20px;\n  height: 20px;\n  margin-top: 1px;\n  border-radius: 50%;\n  background: var(--fish-gold-soft);\n  color: var(--fish-blue-strong);\n  font: 800 12px/1 var(--fish-font);\n}\n\n.big-fish .qq-bind-add-disabled {\n  opacity: .5;\n  cursor: not-allowed;\n}\n\n.big-fish .qq-bind-add-disabled:hover {\n  transform: none;\n  box-shadow: 0 2px 0 var(--fish-edge);\n}\n\n.big-fish .qq-bind-mark {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  color: var(--fish-danger);\n  font: 800 17px/1 var(--fish-font);\n}\n\n.big-fish .qq-bind-mark[data-on=\"true\"] {\n  color: var(--fish-success);\n}\n\n.big-fish .qq-bind-note {\n  margin-top: 8px;\n  color: var(--fish-muted);\n  font-size: 12.5px;\n  line-height: 1.7;\n}\n\n.big-fish .qq-bind-tools {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 12px;\n  padding: 12px 16px;\n  border: 1px dashed var(--fish-border);\n  border-radius: 14px;\n  background: var(--fish-soft);\n}\n\n.big-fish .qq-bind-empty {\n  padding: 14px 0;\n  color: var(--fish-muted);\n  font-size: 13px;\n}\n\n/* ── 未保存确认 ───────────────────────────────────────────── */\n\n.big-fish .fish-modal {\n  position: fixed;\n  box-sizing: border-box;\n  width: 100vw;\n  height: 100dvh;\n  max-width: none;\n  max-height: none;\n  margin: 0;\n  border: 0;\n  color: var(--fish-text);\n  overflow: auto;\n  inset: 0;\n  z-index: 50;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: var(--fish-modal-bg);\n  backdrop-filter: blur(3px);\n}\n\n.big-fish .fish-modal-card {\n  box-sizing: border-box;\n  max-height: calc(100dvh - 40px);\n  overflow: auto;\n  width: min(460px, 100%);\n  padding: 28px;\n  border: 1px solid var(--fish-border);\n  border-radius: 24px;\n  background: var(--fish-panel);\n  box-shadow: var(--fish-modal-card-shadow);\n}\n\n.big-fish .fish-modal-card h2 {\n  margin: 8px 0 6px;\n  font: 800 24px/1.35 var(--fish-title);\n}\n\n/* 模态框关闭入口只改变符号的颜色与字重，保留键盘焦点提示。 */\n.big-fish .fish-modal-close {\n  display: inline-grid;\n  place-items: center;\n  flex: none;\n  width: 36px;\n  height: 36px;\n  min-height: 36px;\n  padding: 0;\n  border: 0;\n  border-radius: 0;\n  appearance: none;\n  background: transparent;\n  color: var(--fish-muted);\n  box-shadow: none;\n  font: 400 28px/1 var(--fish-font);\n  letter-spacing: 0;\n  transform: none;\n  transition: color var(--fish-motion);\n}\n.big-fish .fish-modal-close:not(:disabled):is(:hover, :focus-visible) {\n  background: transparent;\n  color: var(--fish-text);\n  font-weight: 700;\n  box-shadow: none;\n  transform: none;\n}\n\n.big-fish .fish-modal-desc {\n  margin: 0;\n  color: var(--fish-muted);\n  font-size: 13.5px;\n  line-height: 1.8;\n}\n\n.big-fish .fish-modal-error {\n  margin: 12px 0 0;\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: var(--fish-pink-soft);\n  color: var(--fish-danger);\n  font-size: 12.5px;\n}\n\n.big-fish .fish-modal-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-top: 20px;\n}\n\n.big-fish .fish-modal-actions .fish-button {\n  flex: 1 1 auto;\n}\n\n.big-fish .fish-modal-cancel {\n  border-color: transparent;\n  background: transparent;\n  color: var(--fish-muted);\n  box-shadow: none;\n}\n\n/* ── 模块内页 ─────────────────────────────────────────────── */\n\n.big-fish .fish-module {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n\n.big-fish .fish-speak > .fish-section-title:first-child {\n  display: none;\n}\n\n.big-fish .fish-section-title {\n  font: 800 21px/1.5 var(--fish-title);\n}\n\n.big-fish .fish-settings-stack {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr);\n  gap: 16px;\n}\n\n.big-fish .fish-form-row {\n  align-items: flex-start;\n  gap: 12px 24px;\n  padding: 14px 0;\n  margin-bottom: 0 !important;\n  border-bottom: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-form-row:last-child {\n  border-bottom: 0;\n}\n\n.big-fish .fish-form-label {\n  flex: 0 1 190px;\n  padding-top: 8px;\n  color: var(--fish-text);\n  font-weight: 600;\n}\n\n.big-fish .fish-control {\n  flex: 1 1 300px;\n  min-width: 0;\n}\n\n.big-fish .fish-subnav,\n.big-fish .fish-qq .fish-subnav {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  overflow: visible;\n  margin: 0 0 20px;\n  padding: 0 0 14px;\n  border-bottom: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-subnav button {\n  flex: none;\n  padding: 6px 12px;\n  border-radius: 99px;\n  white-space: normal;\n}\n\n.big-fish .fish-message {\n  margin: 12px 0;\n  overflow-wrap: anywhere;\n  white-space: pre-wrap;\n}\n\n.big-fish .fish-message:not(:empty) {\n  padding: 10px 14px;\n  border: 1px dashed var(--fish-message-border);\n  border-radius: 12px;\n  background: var(--fish-gold-soft);\n  color: var(--fish-warning);\n  font-size: 12.5px;\n}\n\n.big-fish .fish-test-action {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 12px;\n  margin-bottom: 20px;\n  padding: 12px 16px;\n  border: 1px dashed var(--fish-border);\n  border-radius: 14px;\n  background: var(--fish-soft);\n}\n\n.big-fish .fish-rule-section {\n  margin-top: 24px;\n  padding-top: 22px;\n  border-top: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-log {\n  overflow-wrap: anywhere;\n  white-space: pre-wrap;\n}\n\n.big-fish .fish-diagnostics {\n  margin-top: 24px;\n  padding-top: 16px;\n  border-top: 1px dashed var(--fish-line);\n  color: var(--fish-muted);\n  font-size: 12.5px;\n  overflow-wrap: anywhere;\n}\n\n.big-fish .fish-diagnostics summary {\n  color: var(--fish-text);\n}\n\n.big-fish .fish-binding-row {\n  display: grid;\n  grid-template-columns: 80px minmax(100px, 1fr) minmax(120px, 1.5fr) 44px 76px 60px;\n  gap: 8px;\n  align-items: center;\n  padding: 12px 0;\n  border-bottom: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-schedule-row {\n  display: grid;\n  grid-template-columns: 120px 140px minmax(60px, 1fr) 60px;\n  gap: 8px;\n  align-items: center;\n  padding: 12px 0;\n  border-bottom: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-feed-result {\n  max-height: 480px;\n  margin-top: 20px;\n  padding: 18px;\n  overflow: auto;\n  border: 1px dashed var(--fish-border);\n  border-radius: 14px;\n  background: var(--fish-paper-2);\n  color: var(--fish-text);\n  font: 13px/1.8 ui-monospace, Consolas, monospace;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n\n.big-fish .fish-embedding {\n  padding: 22px 0;\n  border-block: 1px dashed var(--fish-border);\n}\n\n.big-fish .fish-embedding label {\n  display: grid !important;\n  grid-template-columns: minmax(180px, 1fr) minmax(100px, 2fr);\n  gap: 12px;\n  align-items: center;\n  margin: 12px 0;\n}\n\n.big-fish .fish-embedding label:has([role=switch]) {\n  display: flex !important;\n}\n\n.big-fish .fish-embedding input:not([role=switch]) {\n  width: 100% !important;\n}\n\n.big-fish .fish-embedding button {\n  margin: 4px 8px 4px 0;\n  padding: 8px 12px;\n  border: 1px solid var(--fish-border);\n  border-radius: 10px;\n  background: var(--fish-soft);\n  color: var(--fish-text);\n}\n\n.big-fish .fish-dimensions {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 16px 32px;\n}\n\n.big-fish .fish-dimension-label {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 4px;\n  font-size: 13px;\n}\n\n.big-fish .fish-dimension-track {\n  height: 9px;\n  overflow: hidden;\n  border-radius: 99px;\n  background: var(--fish-line);\n}\n\n.big-fish .fish-dimension-track span {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: linear-gradient(90deg, var(--fish-blue), var(--fish-gold));\n}\n\n.big-fish .fish-library-row {\n  margin: 12px 0;\n  padding: 20px;\n  border: 1px solid var(--fish-border);\n  border-radius: 18px;\n  background: var(--fish-card-bg);\n  box-shadow: var(--fish-shadow);\n}\n\n.big-fish .fish-memory .fish-record {\n  padding: 16px 0;\n  border-bottom: 1px dashed var(--fish-line);\n}\n\n.big-fish .fish-memory .fish-record:last-child {\n  border-bottom: 0;\n}\n\n.big-fish .fish-memory .fish-record-row {\n  align-items: center;\n  gap: 12px;\n  padding: 8px 0;\n}\n\n.big-fish .fish-memory .fish-record-note {\n  padding: 4px 0;\n  color: var(--fish-muted);\n  font-size: 13px;\n}\n\n.big-fish .fish-memory .fish-link {\n  padding: 4px 0;\n  border: 0;\n  background: transparent;\n  text-align: left;\n  text-decoration: underline;\n  text-underline-offset: 4px;\n}\n\n.big-fish .fish-memory details {\n  padding: 16px 20px;\n  border: 1px solid var(--fish-border);\n  border-radius: 18px;\n  background: var(--fish-card-bg);\n  box-shadow: var(--fish-shadow);\n}\n\n.big-fish .fish-memory [role=button] {\n  cursor: pointer;\n}\n\n.big-fish .fish-memory [role=button]:hover {\n  text-decoration: underline;\n  text-underline-offset: 4px;\n}\n\n.big-fish .fish-memory [role=button][style] {\n  box-shadow: none;\n}\n\n/* 心情页自带的样式也用同一套纸面材质，只补圆角和底色。 */\n.big-fish .fish-panel [data-fm-wrap] {\n  gap: 18px;\n}\n\n.big-fish .fish-panel [data-fm-hero] {\n  border-radius: 22px;\n  background: var(--fish-card-bg);\n  box-shadow: var(--fish-shadow);\n}\n\n.big-fish .fish-panel [data-fm-slot] {\n  border-radius: 18px;\n  background: var(--fish-card-bg);\n}\n\n.big-fish .fish-panel [data-fm-big] {\n  color: var(--fish-text);\n}\n\n.big-fish .fish-panel [data-fm-quote] {\n  border-radius: 14px;\n  background: var(--fish-paper-2);\n}\n\n.big-fish .fish-panel [data-fm-btn],\n.big-fish .fish-panel [data-fm-pick] {\n  border-radius: 10px;\n  background: var(--fish-control-fill);\n  box-shadow: 0 2px 0 var(--fish-edge);\n}\n\n.big-fish .fish-panel [data-fm-on] {\n  background: var(--fish-accent-soft);\n  box-shadow: none;\n}\n\n/* ── 兼容提示条 ───────────────────────────────────────────── */\n\n.big-fish-notice {\n  position: fixed;\n  z-index: 1000;\n  right: 20px;\n  bottom: 24px;\n  max-width: min(400px, calc(100vw - 40px));\n  padding: 18px 20px;\n  border: 1px solid var(--fish-notice-border);\n  border-radius: 20px;\n  background: var(--fish-notice-bg);\n  color: var(--fish-notice-text);\n  box-shadow: var(--fish-notice-shadow);\n  pointer-events: auto;\n}\n\n.big-fish-notice > div:first-child {\n  font-size: 13.5px;\n  line-height: 1.7;\n}\n\n.big-fish-notice button {\n  border-color: var(--fish-notice-button-border);\n  background: var(--fish-notice-button-bg);\n  color: var(--fish-notice-button-text);\n  box-shadow: none;\n}\n\n/* ── 适配 ─────────────────────────────────────────────────── */\n\n@container (max-width: 1240px) {\n  .big-fish .fish-frame {\n    grid-template-columns: 220px minmax(0, 1fr);\n  }\n\n  .big-fish .fish-hero h1 {\n    font-size: clamp(28px, 3.8cqi, 44px);\n  }\n\n  .big-fish .fish-welcome {\n    width: clamp(210px, 22cqi, 280px);\n  }\n\n  .big-fish .fish-feature {\n    grid-template-columns: minmax(0, 1fr) 150px;\n  }\n}\n\n@container (max-width: 1180px) {\n  .big-fish .fish-feature {\n    grid-template-columns: minmax(0, 1fr) 138px;\n  }\n\n}\n\n@container (max-width: 1040px) {\n  .big-fish .fish-frame {\n    grid-template-columns: minmax(0, 1fr);\n    grid-template-rows: auto minmax(0, 1fr);\n    height: 100%;\n    min-height: 0;\n    gap: 12px;\n  }\n\n  .big-fish .fish-binder {\n    min-height: 0;\n    padding: 14px 16px;\n    border-radius: 24px;\n    gap: 12px;\n  }\n\n  .big-fish .fish-binder::before {\n    inset: 7px;\n    border-radius: 18px;\n  }\n\n  .big-fish .fish-rings {\n    display: none;\n  }\n\n  .big-fish .fish-brand {\n    padding: 0 2px 10px;\n  }\n\n  .big-fish .fish-logo {\n    width: 38px;\n    height: 38px;\n    border-radius: 13px;\n  }\n\n  .big-fish .fish-brand-name {\n    font-size: 20px;\n  }\n\n  .big-fish .fish-nav {\n    flex: none;\n    flex-direction: row;\n    flex-wrap: wrap;\n    gap: 6px;\n    overflow: visible;\n    padding: 0;\n  }\n\n  .big-fish .fish-nav-group {\n    display: contents;\n  }\n\n  .big-fish .fish-tab {\n    order: 0;\n    width: auto;\n    min-height: 40px;\n    padding: 8px 12px;\n  }\n\n  .big-fish .fish-nav-highlight {\n    display: none;\n  }\n\n  .big-fish .fish-tab[aria-selected=true] {\n    background: var(--fish-tab-active-bg);\n    box-shadow: var(--fish-tab-shadow);\n  }\n\n  .big-fish .fish-tab[aria-selected=true]:hover {\n    background: var(--fish-tab-active-hover-bg);\n  }\n\n  .big-fish .fish-submenu {\n    order: 1;\n    flex: 1 0 100%;\n    flex-direction: row;\n    flex-wrap: wrap;\n    gap: 4px;\n    margin: 2px 0 0;\n    padding: 0;\n    border-left: 0;\n    overflow-x: auto;\n  }\n\n  .big-fish .fish-submenu button {\n    width: auto;\n    min-height: 30px;\n    padding: 4px 10px;\n    border-radius: 99px;\n    background: var(--fish-submenu-mobile-bg);\n  }\n\n  .big-fish .fish-binder-foot {\n    display: none;\n  }\n\n  .big-fish .fish-workspace {\n    height: 100%;\n    min-height: 0;\n  }\n\n  .big-fish .fish-stats {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n}\n\n@container (max-width: 900px) {\n  .big-fish .fish-hero {\n    grid-template-columns: minmax(0, 1fr);\n    padding-bottom: 88px;\n  }\n\n  .big-fish .fish-welcome {\n    grid-row: 1;\n    width: min(260px, 56cqi);\n    margin-bottom: 4px;\n  }\n\n  .big-fish .fish-hero-copy {\n    grid-row: 2;\n  }\n\n  .big-fish .fish-hero h1 {\n    font-size: clamp(30px, 5.6cqi, 42px);\n  }\n\n  .big-fish .fish-hero-bubbles {\n    right: 6%;\n    bottom: 12px;\n    width: 140px;\n    height: 140px;\n  }\n\n  .big-fish .fish-hero-spark {\n    top: 14px;\n    right: 10%;\n  }\n\n  .big-fish .fish-stats {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .big-fish .fish-update-card {\n    grid-template-columns: minmax(0, 1fr);\n    gap: 24px;\n    padding: 28px 24px;\n  }\n\n  .big-fish .fish-update-art {\n    order: 2;\n    width: min(210px, 52cqi);\n  }\n\n  .big-fish .fish-update-heading {\n    align-items: flex-start;\n  }\n\n  .big-fish .fish-update-status {\n    white-space: normal;\n  }\n\n  .big-fish .fish-update-controls {\n    align-items: stretch;\n  }\n\n  .big-fish .fish-channel-field {\n    flex-basis: 100%;\n  }\n\n  .big-fish .fish-update-operations {\n    flex-basis: 100%;\n    justify-content: flex-start;\n  }\n}\n\n@container (max-width: 760px) {\n  .big-fish .fish-paper {\n    --fish-paper-radius: 24px;\n    --fish-scroll-inset: 10px;\n    --fish-scroll-radius: 16px;\n    --fish-fade-height: 20px;\n  }\n\n  .big-fish .fish-scroll {\n    padding: 14px 10px 22px;\n  }\n\n  .big-fish .fish-paper::before {\n    inset: 8px;\n    border-radius: 18px;\n  }\n\n  .big-fish .fish-tape {\n    display: none;\n  }\n\n  .big-fish .fish-page-head {\n    align-items: flex-start;\n    gap: 16px;\n    margin-bottom: 22px;\n    padding-bottom: 18px;\n  }\n\n  .big-fish .fish-page-stamp {\n    width: 76px;\n    height: 76px;\n  }\n\n  .big-fish .fish-page-stamp .fish-glyph {\n    width: 24px;\n    height: 24px;\n  }\n\n  .big-fish .fish-page-stamp-no {\n    font-size: 14px;\n  }\n\n  .big-fish .fish-page-stamp-label {\n    font-size: 9px;\n  }\n\n  .big-fish .fish-feature {\n    grid-template-columns: minmax(0, 1fr) 128px;\n    padding: 22px 20px;\n  }\n\n  .big-fish .fish-dimensions {\n    grid-template-columns: 1fr;\n  }\n\n  .big-fish .fish-binding-row,\n  .big-fish .fish-schedule-row {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .big-fish .fish-binding-head {\n    display: none;\n  }\n}\n\n@container (max-width: 620px) {\n  .big-fish .fish-brand-sub,\n  .big-fish .fish-version-pin {\n    display: none;\n  }\n\n  .big-fish .fish-tab {\n    padding: 7px 9px;\n    font-size: 13px;\n  }\n\n  .big-fish .fish-tab-icon {\n    width: 24px;\n    height: 24px;\n    border-radius: 8px;\n  }\n\n  .big-fish .fish-tab-no {\n    display: none;\n  }\n\n  .big-fish .fish-stats {\n    grid-template-columns: 1fr;\n  }\n\n  .big-fish .fish-feature {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n\n  .big-fish .fish-feature-sticker {\n    justify-self: start;\n    width: 118px;\n    margin-left: 2px;\n  }\n\n\n  .big-fish .fish-section-head {\n    align-items: flex-start;\n    flex-direction: column;\n    gap: 4px;\n  }\n\n  .big-fish .fish-section-note {\n    text-align: left;\n  }\n\n  .big-fish .fish-form-label {\n    flex-basis: 100%;\n    padding-top: 0;\n  }\n\n  .big-fish .fish-embedding label {\n    grid-template-columns: 1fr;\n  }\n\n  .big-fish .fish-subnav button {\n    flex: 1 1 auto;\n  }\n\n  .big-fish .fish-sources {\n    padding: 20px 16px;\n  }\n\n  .big-fish .fish-update-card {\n    padding: 22px 18px;\n  }\n}\n\n@container (max-width: 520px) {\n  .big-fish {\n    padding: calc(8px + var(--dsh-frame-top-clearance, 0px)) 8px 8px;\n  }\n\n  .big-fish .fish-binder {\n    padding: 12px;\n  }\n\n  .big-fish .fish-brand {\n    gap: 8px;\n  }\n\n  .big-fish .fish-brand-name {\n    font-size: 18px;\n  }\n\n  .big-fish .fish-logo {\n    width: 34px;\n    height: 34px;\n  }\n\n  .big-fish .fish-paper {\n    --fish-paper-radius: 20px;\n    --fish-scroll-inset: 9px;\n    --fish-scroll-radius: 14px;\n    --fish-fade-height: 16px;\n  }\n\n  .big-fish .fish-scroll {\n    padding: 10px 8px 18px;\n  }\n\n  .big-fish .fish-page-head {\n    flex-direction: column;\n    gap: 12px;\n  }\n\n  .big-fish .fish-page-stamp {\n    display: none;\n  }\n\n  .big-fish .fish-hero {\n    min-height: 0;\n    padding: 24px 20px 78px;\n    border-radius: 24px;\n  }\n\n  .big-fish .fish-hero h1 {\n    margin-top: 10px;\n    font-size: clamp(27px, 8.2cqi, 34px);\n  }\n\n  .big-fish .fish-hero-lead {\n    font-size: 14px;\n    line-height: 1.8;\n  }\n\n  .big-fish .fish-hero-quote {\n    margin-top: 16px;\n    font-size: 13.5px;\n  }\n\n  .big-fish .fish-hero-chips {\n    margin-top: 18px;\n    gap: 6px;\n  }\n\n  .big-fish .fish-chip {\n    padding: 5px 9px;\n    font-size: 10.5px;\n  }\n\n  .big-fish .fish-welcome {\n    width: min(214px, 64cqi);\n    padding: 9px 9px 8px;\n  }\n\n  .big-fish .fish-welcome figcaption {\n    font-size: 11px;\n  }\n\n  .big-fish .fish-stat {\n    padding: 15px;\n  }\n\n  .big-fish .fish-feature {\n    padding: 20px 16px;\n    border-radius: 22px;\n  }\n\n  .big-fish .fish-feature h2 {\n    font-size: 22px;\n  }\n\n  .big-fish .fish-feature-sticker {\n    width: 108px;\n  }\n\n\n  .big-fish .fish-table {\n    min-width: 660px;\n  }\n\n  .big-fish .fish-update-body h2 {\n    font-size: 23px;\n  }\n\n  .big-fish .fish-actions {\n    gap: 8px;\n  }\n\n  .big-fish .fish-actions .fish-button {\n    flex: 1 1 auto;\n  }\n}\n\n@media (max-width: 720px) {\n  .big-fish .fish-hero-bubbles {\n    display: none;\n  }\n}\n\n@media (max-height: 620px) {\n  .big-fish .fish-binder-foot {\n    display: none;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .big-fish *,\n  .big-fish-notice * {\n    animation: none !important;\n    transition: none !important;\n    scroll-behavior: auto !important;\n  }\n\n  .big-fish button:not(:disabled):hover,\n  .big-fish button:not(:disabled):active,\n  .big-fish-notice button,\n  .big-fish .fish-feature,\n  .big-fish .fish-welcome {\n    transform: none !important;\n  }\n\n  .big-fish .fish-nav-highlight {\n    transition: none !important;\n  }\n\n}\n\n@keyframes fish-float {\n  0%,\n  100% {\n    transform: translateY(0) rotate(2.5deg);\n  }\n\n  50% {\n    transform: translateY(-7px) rotate(1.5deg);\n  }\n}\n\n/* 主题滚动条：纸面用暖色，侧栏用金色。 */\n.big-fish,\n.big-fish * {\n  scrollbar-width: thin;\n  scrollbar-color: var(--fish-control-border) var(--fish-soft);\n}\n\n.big-fish::-webkit-scrollbar,\n.big-fish *::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n.big-fish::-webkit-scrollbar-track,\n.big-fish *::-webkit-scrollbar-track {\n  background: var(--fish-soft);\n  border-radius: 99px;\n}\n\n.big-fish::-webkit-scrollbar-thumb,\n.big-fish *::-webkit-scrollbar-thumb {\n  border: 2px solid var(--fish-soft);\n  border-radius: 99px;\n  background: var(--fish-control-border);\n}\n\n.big-fish::-webkit-scrollbar-thumb:hover,\n.big-fish *::-webkit-scrollbar-thumb:hover {\n  background: var(--fish-accent);\n}\n\n.big-fish::-webkit-scrollbar-corner,\n.big-fish *::-webkit-scrollbar-corner {\n  background: var(--fish-soft);\n}\n\n.big-fish .fish-scroll::-webkit-scrollbar {\n  width: 9px;\n}\n\n.big-fish .fish-scroll::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.big-fish .fish-scroll::-webkit-scrollbar-thumb {\n  border: 2px solid transparent;\n  background: var(--fish-control-border);\n  background-clip: padding-box;\n}\n\n.big-fish .fish-scroll::-webkit-scrollbar-thumb:hover {\n  background: var(--fish-accent);\n  background-clip: padding-box;\n}\n\n.big-fish .fish-nav::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n.big-fish .fish-nav::-webkit-scrollbar-thumb {\n  border: 2px solid transparent;\n  background: var(--fish-nav-bg);\n  background-clip: padding-box;\n}\n\n\n/* 绑定字段说明使用原生悬浮提示，不受横向表格滚动容器裁切。 */\n.big-fish .qq-bind-field-label {display:inline-flex;align-items:center;gap:3px}\n.big-fish .qq-bind-field-label .qq-field-help {\n  display: inline-grid;\n  place-items: center;\n  flex: none;\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n  margin-left: 3px;\n  padding: 0;\n  border: 1px solid var(--fish-border);\n  border-radius: 50%;\n  background: var(--fish-blue-soft);\n  color: var(--fish-blue-strong);\n  font: 700 10px/1 var(--fish-font);\n  box-shadow: none;\n  cursor: help;\n  transform: none;\n}\n\n.big-fish .qq-bind-field-label .qq-field-help:hover,\n.big-fish .qq-bind-field-label .qq-field-help:focus-visible {\n  color: var(--fish-on-accent);\n  border-color: var(--fish-action);\n  background: var(--fish-action);\n}\n\n.big-fish .fish-help-popover {\n  position: fixed;\n  z-index: 45;\n  padding: 12px 14px;\n  border: 1px solid var(--fish-border);\n  border-radius: 14px;\n  background: var(--fish-card-bg);\n  color: var(--fish-text);\n  box-shadow: var(--fish-help-popover-shadow);\n  pointer-events: auto;\n}\n\n.big-fish .fish-help-popover[data-placement=above] {\n  transform: translateY(-100%);\n}\n\n.big-fish .fish-help-popover::after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  margin-left: -6px;\n  border: 6px solid transparent;\n}\n\n.big-fish .fish-help-popover[data-placement=below]::after {\n  top: -12px;\n  border-bottom-color: var(--fish-card-bg);\n}\n\n.big-fish .fish-help-popover[data-placement=above]::after {\n  bottom: -12px;\n  border-top-color: var(--fish-card-bg);\n}\n\n.big-fish .fish-help-label {\n  display: block;\n  color: var(--fish-blue-strong);\n  font: 700 10.5px/1.5 var(--fish-font);\n  letter-spacing: .12em;\n}\n\n.big-fish .fish-help-popover p {\n  margin: 4px 0 0;\n  color: var(--fish-text);\n  font-size: 13px;\n  line-height: 1.75;\n  white-space: normal;\n}\n\n.big-fish .fish-help-link {\n  display: inline;\n  min-height: 0;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  background: none;\n  color: var(--fish-blue-strong);\n  font: inherit;\n  font-weight: 600;\n  line-height: inherit;\n  letter-spacing: 0;\n  text-align: left;\n  text-decoration: underline;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 3px;\n  box-shadow: none;\n  cursor: pointer;\n}\n\n.big-fish .fish-help-link:hover {\n  text-decoration-thickness: 2px;\n}\n\n/* 角色设定模态框要覆盖默认 460px 卡片宽度（后定义的 .fish-modal-card 优先）。 */\n.big-fish .fish-modal-card.qq-text-modal {\n  width: min(760px, 100%);\n  max-height: calc(100vh - 40px);\n  overflow: auto;\n}\n\n.big-fish .fish-modal-card.qq-role-writer-card {\n  width: min(680px, 100%);\n  max-height: calc(100vh - 40px);\n  overflow: auto;\n}\n\n/* ── 文件管理 ─────────────────────────────────────────────── */\n\n.big-fish .fish-file-manager {\n  display: flex;\n  flex-direction: column;\n  gap: 18px;\n}\n\n.big-fish .fish-file-manager-stickers > h2 {\n  margin: 0 0 8px;\n}\n\n.big-fish .fish-file-manager .fish-media-storage {\n  margin-top: 10px;\n}\n\n/* 跳转目标：滚动到位后闪一下，提醒用户看这里。 */\n.big-fish .fish-jump-flash {\n  position: relative;\n}\n\n.big-fish .fish-jump-flash::after {\n  content: '';\n  position: absolute;\n  inset: 0;\n  z-index: 2;\n  border-radius: inherit;\n  box-shadow: var(--fish-jump-flash-after-shadow);\n  opacity: 0;\n  pointer-events: none;\n  animation: fish-jump-glow 1.35s ease-in-out both;\n}\n\n@keyframes fish-jump-glow {\n  0% { opacity: 0; }\n  25% { opacity: 1; }\n  65% { opacity: 1; }\n  100% { opacity: 0; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .big-fish .fish-jump-flash::after {\n    opacity: 1;\n    box-shadow: inset 0 0 0 2px var(--fish-gold);\n  }\n}\n\n.big-fish #fish-sticker-files-card,\n.big-fish #qq-reply-threshold {\n  scroll-margin-top: 24px;\n}\n\n/* ── QQ 空间浏览 ─────────────────────────────────────────── */\n\n.big-fish .qq-space-browse-head h2 {\n  margin: 0 0 4px;\n}\n\n.big-fish .qq-space-browse-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 14px 18px;\n  margin: 16px 0 4px;\n}\n\n.big-fish .qq-space-field {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n}\n\n.big-fish .qq-space-field input {\n  width: 100%;\n}\n\n.big-fish .qq-space-browse-actions {\n  gap: 8px;\n  margin-top: 12px;\n}\n\n@container (max-width: 760px) {\n  .big-fish .qq-space-browse-grid {\n    grid-template-columns: 1fr;\n  }\n}\n\n/* ── QQ 语音转写 ─────────────────────────────────────────── */\n\n.big-fish .qq-voice-card .fish-form-row {\n  padding: 17px 0;\n}\n\n.big-fish .qq-voice-env {\n  margin-bottom: 6px;\n}\n\n.big-fish .qq-voice-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  margin-bottom: 4px;\n}\n\n.big-fish .qq-voice-env .fish-hint {\n  margin-top: 10px;\n}\n\n.big-fish .qq-voice-note {\n  margin-top: 14px;\n  line-height: 1.8;\n}\n\n@container (max-width: 620px) {\n  .big-fish .qq-voice-card .fish-form-row {\n    padding: 14px 0;\n  }\n}\n\n.big-fish .qq-voice-cost {\n  width: 100%;\n  max-width: 100%;\n  margin-top: 20px;\n  padding-top: 16px;\n  border-top: 1px dashed var(--fish-line);\n  overflow-x: auto;\n}\n\n.big-fish .qq-voice-cost-intro {\n  margin: 0 0 10px;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n  line-height: 1.7;\n}\n\n.big-fish .qq-voice-cost-table {\n  width: 100%;\n  border-collapse: collapse;\n  table-layout: auto;\n}\n\n.big-fish .qq-voice-cost-table th,\n.big-fish .qq-voice-cost-table td {\n  padding: 9px 6px;\n  border-bottom: 1px solid var(--fish-line);\n  font-size: 12px;\n  line-height: 1.6;\n  text-align: left;\n  vertical-align: top;\n  white-space: nowrap;\n}\n\n.big-fish .qq-voice-cost-table thead th {\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n  font-weight: 500;\n}\n\n.big-fish .qq-voice-cost-table tbody th {\n  width: 92px;\n  color: var(--fish-text);\n  font-weight: 400;\n  white-space: nowrap;\n}\n\n.big-fish .qq-voice-cost-table tbody td {\n  color: var(--fish-muted);\n}\n\n.big-fish .qq-voice-cost-table tbody tr:last-child th,\n.big-fish .qq-voice-cost-table tbody tr:last-child td {\n  border-bottom: 0;\n}\n\n.big-fish .qq-voice-cost-note {\n  margin: 16px 0 0;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n  line-height: 1.85;\n}\n\n@container (max-width: 620px) {\n  .big-fish .qq-voice-cost {\n    width: 100%;\n    max-width: 100%;\n  }\n\n  .big-fish .qq-voice-cost-table tbody th {\n    width: 82px;\n  }\n}\n\n/* ── 运行日志：命令行式实时终端 ─────────────────────────── */\n\n.big-fish .fish-run-log {\n  display: grid;\n  gap: 16px;\n}\n\n.big-fish .fish-terminal-card {\n  position: relative;\n  overflow: hidden;\n  border: 1px solid var(--fish-terminal-card-border);\n  border-radius: 22px;\n  background: var(--fish-terminal-card-bg);\n  box-shadow: var(--fish-terminal-card-shadow);\n}\n\n.big-fish .fish-terminal-head {\n  position: absolute;\n  inset: 0 0 auto;\n  z-index: 2;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 18px;\n  border-bottom: 1px solid var(--fish-terminal-head-border-bottom);\n  background: var(--fish-terminal-head-bg);\n  color: var(--fish-terminal-head-text);\n}\n\n.big-fish .fish-terminal-live {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  color: var(--fish-terminal-live-text);\n  font: 700 11px/1 ui-monospace, SFMono-Regular, Consolas, monospace;\n  letter-spacing: .12em;\n}\n\n.big-fish .fish-terminal-live i {\n  width: 7px;\n  height: 7px;\n  border-radius: 50%;\n  background: var(--fish-terminal-live-bg);\n  box-shadow: var(--fish-terminal-live-shadow);\n}\n\n.big-fish .fish-terminal-title {\n  color: var(--fish-terminal-title-text);\n  font-size: 12.5px;\n}\n\n.big-fish .fish-terminal-count {\n  margin-left: auto;\n  color: var(--fish-terminal-count-text);\n  font: 11.5px/1 ui-monospace, SFMono-Regular, Consolas, monospace;\n}\n\n.big-fish .fish-terminal {\n  height: min(68vh, 760px);\n  min-height: 320px;\n  overflow: auto;\n  padding: 68px 18px 20px;\n  background: var(--fish-terminal-bg);\n  color: var(--fish-terminal-text);\n  font: 12.5px/1.75 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n}\n\n.big-fish .fish-terminal-line {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n  padding: 1px 0;\n}\n\n.big-fish .fish-terminal-time {\n  flex: none;\n  color: var(--fish-terminal-time-text);\n  white-space: nowrap;\n}\n\n.big-fish .fish-terminal-prompt {\n  flex: none;\n  color: var(--fish-terminal-prompt-text);\n}\n\n.big-fish .fish-terminal-text {\n  min-width: 0;\n  overflow-wrap: anywhere;\n  white-space: pre-wrap;\n}\n\n.big-fish .fish-terminal-empty {\n  color: var(--fish-terminal-empty-text);\n}\n\n.big-fish .fish-terminal-error {\n  margin: 0;\n  padding: 10px 18px;\n  border-top: 1px solid var(--fish-terminal-error-border-top);\n  color: var(--fish-terminal-error-text);\n  font-size: var(--fish-small);\n}\n\n@container (max-width: 640px) {\n  .big-fish .fish-terminal-head {\n    padding: 12px 14px;\n  }\n\n  .big-fish .fish-terminal {\n    height: 58vh;\n    padding: 60px 14px 14px;\n    font-size: 12px;\n  }\n}\n\n/* 表单控件使用自己的焦点环，不再叠加浏览器默认 outline。 */\n.big-fish input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=color]):not([type=button]):not([type=submit]):not([type=reset]):focus-visible,\n.big-fish select:focus-visible,\n.big-fish textarea:focus-visible {\n  outline: none !important;\n}\n\n/* 自定义下拉浮层：替代原生 option 弹层。 */\n.big-fish .fish-select-popup {\n  position: fixed;\n  inset: auto;\n  margin: 0;\n  box-sizing: border-box;\n  z-index: 12000;\n  overflow-y: auto;\n  padding: 6px;\n  border: 1px solid color-mix(in srgb, var(--fish-control-border) 78%, transparent);\n  border-radius: 14px;\n  background: var(--fish-select-popup-bg);\n  backdrop-filter: blur(20px) saturate(1.25);\n  -webkit-backdrop-filter: blur(20px) saturate(1.25);\n  box-shadow: var(--fish-select-popup-shadow);\n  animation: fish-select-pop 140ms ease-out;\n}\n\n.big-fish .fish-select-option {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  min-height: 38px;\n  margin: 2px 0;\n  padding: 8px 12px 8px 32px;\n  border: 1px solid transparent;\n  border-radius: 9px;\n  background: transparent;\n  color: var(--fish-text);\n  font-family: var(--fish-font);\n  font-size: var(--fish-label);\n  line-height: 1.45;\n  text-align: left;\n  cursor: pointer;\n}\n\n.big-fish .fish-select-option::before {\n  content: '✓';\n  position: absolute;\n  left: 10px;\n  color: var(--fish-gold);\n  font-weight: 700;\n  opacity: 0;\n}\n\n.big-fish .fish-select-popup[data-compact=true] .fish-select-option {\n  padding-left: 26px;\n  padding-right: 8px;\n  white-space: nowrap;\n}\n\n.big-fish .fish-select-option[aria-selected=true] {\n  background: color-mix(in srgb, var(--fish-gold-soft) 78%, transparent);\n}\n\n.big-fish .fish-select-option[aria-selected=true]::before {\n  opacity: 1;\n}\n\n.big-fish .fish-select-option.is-active:not([aria-selected=true]) {\n  background: color-mix(in srgb, var(--fish-soft) 64%, transparent);\n}\n\n.big-fish .fish-select-option:hover {\n  background: color-mix(in srgb, var(--fish-hover) 72%, transparent);\n}\n\n.big-fish .fish-select-option:disabled {\n  cursor: not-allowed;\n  opacity: .45;\n}\n\n@keyframes fish-select-pop {\n  from { opacity: 0; transform: translateY(-3px) scale(.99); }\n  to { opacity: 1; transform: translateY(0) scale(1); }\n}\n\n.big-fish .fish-update-check {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 142px;\n  min-height: 44px;\n  padding: 11px 22px;\n  border-radius: 13px;\n}\n\n.big-fish .fish-button.fish-gold {\n  border-color: var(--fish-gold);\n  background: var(--fish-gold);\n  color: var(--fish-navy);\n  box-shadow: 0 2px 0 var(--fish-gold-ink);\n}\n\n.big-fish .fish-button.fish-gold:not(:disabled):hover {\n  border-color: var(--fish-gold);\n  background: var(--fish-gold);\n  color: var(--fish-navy);\n  filter: brightness(1.06);\n}\n\n.big-fish .fish-spin {\n  animation: fish-spin 900ms linear infinite;\n}\n\n@keyframes fish-spin {\n  to { transform: rotate(360deg); }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .big-fish .fish-spin {\n    animation-duration: 2.4s;\n  }\n}\n\n/* 新建 QQ 映射：字段竖向排列，不显示目标会话。 */\n.big-fish .fish-modal-card.qq-bind-add-modal {\n  width: min(520px, 100%);\n}\n\n.big-fish .qq-bind-modal-fields {\n  display: grid;\n  gap: 14px;\n  margin: 18px 0 4px;\n}\n\n.big-fish .qq-bind-modal-field {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n}\n\n.big-fish .qq-bind-modal-field input {\n  width: 100%;\n}\n\n.big-fish .qq-bind-modal-toggles {\n  display: grid;\n  gap: 10px;\n}\n\n.big-fish .qq-bind-modal-toggle {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 14px;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n}\n\n.big-fish .qq-bind-modal-name-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.big-fish .qq-bind-modal-name-row input {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.big-fish .qq-bind-modal-name-row .fish-button {\n  flex: none;\n  min-height: 38px;\n  padding: 8px 12px;\n  white-space: nowrap;\n}\n\n.big-fish .qq-bind-modal-lookup {\n  margin-top: -6px;\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n}\n\n/* 吃大米饭：当前绑定工作区的 Token 用量 */\n.big-fish .rice-page {\n  display: grid;\n  gap: 14px;\n}\n\n.big-fish .rice-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.big-fish .rice-toolbar h2 {\n  margin: 2px 0 0;\n  font-family: var(--fish-title);\n  font-size: 21px;\n}\n\n.big-fish .rice-stats {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n}\n\n.big-fish .rice-stat {\n  display: grid;\n  gap: 5px;\n  padding: 16px;\n}\n\n.big-fish .rice-stat-label {\n  color: var(--fish-muted);\n  font-size: var(--fish-small);\n}\n\n.big-fish .rice-stat-value {\n  font-family: var(--fish-title);\n  font-size: 26px;\n  line-height: 1.15;\n}\n\n.big-fish .rice-stat-sub {\n  color: var(--fish-muted);\n  font-size: 12px;\n}\n\n.big-fish .rice-grid {\n  display: grid;\n  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);\n  gap: 12px;\n}\n\n.big-fish .rice-chart-card,\n.big-fish .rice-heat-card,\n.big-fish .rice-table-card {\n  padding: 16px;\n  min-width: 0;\n}\n\n.big-fish .rice-range {\n  margin: 0;\n  gap: 4px;\n}\n\n.big-fish .rice-range .fish-button {\n  padding: 5px 9px;\n  font-size: 12px;\n}\n\n.big-fish .rice-line {\n  display: block;\n  width: 100%;\n  height: auto;\n  margin-top: 12px;\n  overflow: visible;\n}\n\n.big-fish .rice-gridline {\n  stroke: var(--fish-line);\n  stroke-width: 1;\n}\n\n.big-fish .rice-area {\n  fill: color-mix(in srgb, var(--fish-accent) 18%, transparent);\n}\n\n.big-fish .rice-polyline {\n  fill: none;\n  stroke: var(--fish-accent);\n  stroke-width: 2.5;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.big-fish .rice-axis {\n  fill: var(--fish-muted);\n  font-size: 11px;\n}\n\n.big-fish .rice-heat-legend {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n  font-size: 11px;\n}\n\n.big-fish .rice-heat-dot {\n  width: 10px;\n  height: 10px;\n  border-radius: 2px;\n  background: var(--fish-line);\n}\n\n.big-fish .rice-heat {\n  display: grid;\n  grid-auto-flow: column;\n  grid-template-rows: repeat(7, 11px);\n  grid-auto-columns: 11px;\n  gap: 3px;\n  margin-top: 14px;\n  overflow-x: auto;\n  padding-bottom: 4px;\n}\n\n.big-fish .rice-heat-cell,\n.big-fish .rice-heat-dot[data-level=\"0\"] { background: var(--fish-line); }\n.big-fish .rice-heat-cell[data-level=\"1\"], .big-fish .rice-heat-dot[data-level=\"1\"] { background: color-mix(in srgb, var(--fish-accent) 28%, var(--fish-line)); }\n.big-fish .rice-heat-cell[data-level=\"2\"], .big-fish .rice-heat-dot[data-level=\"2\"] { background: color-mix(in srgb, var(--fish-accent) 48%, var(--fish-line)); }\n.big-fish .rice-heat-cell[data-level=\"3\"], .big-fish .rice-heat-dot[data-level=\"3\"] { background: color-mix(in srgb, var(--fish-accent) 72%, var(--fish-line)); }\n.big-fish .rice-heat-cell[data-level=\"4\"], .big-fish .rice-heat-dot[data-level=\"4\"] { background: var(--fish-accent); }\n\n.big-fish .rice-heat-cell {\n  border-radius: 2px;\n}\n\n.big-fish .rice-table-wrap {\n  overflow-x: auto;\n  margin-top: 10px;\n}\n\n.big-fish .rice-table {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: var(--fish-small);\n}\n\n.big-fish .rice-table th,\n.big-fish .rice-table td {\n  padding: 10px 12px;\n  border-bottom: 1px solid var(--fish-line);\n  text-align: right;\n  white-space: nowrap;\n}\n\n.big-fish .rice-table th:first-child,\n.big-fish .rice-table td:first-child {\n  text-align: left;\n}\n\n.big-fish .rice-table th {\n  color: var(--fish-muted);\n  font-weight: 500;\n}\n\n.big-fish .rice-session-title {\n  display: block;\n  max-width: 280px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.big-fish .rice-session-id {\n  display: block;\n  color: var(--fish-muted);\n  font-size: 11px;\n  margin-top: 2px;\n}\n\n@media (max-width: 980px) {\n  .big-fish .rice-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .big-fish .rice-grid { grid-template-columns: minmax(0, 1fr); }\n}\n\n.big-fish .rice-stat-cost {\n  color: var(--fish-success);\n  font-family: var(--fish-title);\n  font-size: 15px;\n  font-weight: 600;\n}\n\n.big-fish .rice-rate-note {\n  margin-top: -6px;\n  font-size: 11px;\n}\n\n.big-fish .fish-version-pin {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  cursor: pointer;\n  font-family: inherit;\n  min-height: 22px;\n  height: 22px;\n  padding: 2px 8px;\n  line-height: 16px;\n}\n\n.big-fish .fish-beta-label {\n  display: block;\n  margin-bottom: 6px;\n}\n\n.big-fish #fish-beta-token {\n  width: 100%;\n}\n\n.big-fish .fish-version-pin:hover,\n.big-fish .fish-version-pin:focus-visible {\n  color: var(--fish-version-pin-hover-focus-text);\n  outline: none;\n}\n\n.big-fish .rice-hit {\n  fill: transparent;\n  pointer-events: all;\n  cursor: crosshair;\n}\n\n.big-fish .rice-heat-blank {\n  background: transparent !important;\n}\n\n.big-fish .rice-tooltip {\n  position: fixed;\n  z-index: 80;\n  width: 280px;\n  max-width: calc(100vw - 28px);\n  padding: 14px 16px;\n  border: 1px solid var(--fish-rice-tooltip-border);\n  border-radius: 12px;\n  background: var(--fish-rice-tooltip-bg);\n  box-shadow: var(--fish-rice-tooltip-shadow);\n  color: var(--fish-rice-tooltip-text);\n  pointer-events: none;\n  font-size: 12px;\n}\n\n.big-fish .rice-tip-date {\n  color: var(--fish-rice-tip-date-text);\n  font-size: 12px;\n  letter-spacing: .04em;\n}\n\n.big-fish .rice-tip-total {\n  margin-top: 6px;\n  font-family: var(--fish-title);\n  font-size: 25px;\n  font-weight: 700;\n}\n\n.big-fish .rice-tip-total span {\n  font-family: inherit;\n  font-size: 12px;\n  font-weight: 500;\n  letter-spacing: .08em;\n  color: var(--fish-rice-tip-total-text);\n}\n\n.big-fish .rice-tip-cost {\n  margin-top: 2px;\n  color: var(--fish-rice-tip-cost-text);\n  font-size: 12px;\n}\n\n.big-fish .rice-tip-label {\n  margin: 12px 0 8px;\n  padding-top: 9px;\n  border-top: 1px solid var(--fish-rice-tip-label-border-top);\n  color: var(--fish-rice-tip-label-text);\n  font-size: 11px;\n}\n\n.big-fish .rice-tip-row {\n  margin: 7px 0;\n}\n\n.big-fish .rice-tip-row-head {\n  display: flex;\n  align-items: baseline;\n  gap: 7px;\n  min-width: 0;\n}\n\n.big-fish .rice-tip-row-head span {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.big-fish .rice-tip-row-head strong {\n  flex: none;\n  font-size: 12px;\n}\n\n.big-fish .rice-tip-row-head em {\n  flex: none;\n  width: 34px;\n  color: var(--fish-rice-tip-row-head-text);\n  font-style: normal;\n  text-align: right;\n}\n\n.big-fish .rice-tip-bar {\n  height: 5px;\n  margin-top: 4px;\n  overflow: hidden;\n  border-radius: 99px;\n  background: var(--fish-rice-tip-bar-bg);\n}\n\n.big-fish .rice-tip-bar i {\n  display: block;\n  height: 100%;\n  border-radius: inherit;\n  background: var(--fish-rice-tip-bar-fill);\n}\n\n.big-fish .rice-tip-empty {\n  color: var(--fish-rice-tip-empty-text);\n  font-size: 11px;\n}\n\n/* 长期记忆：平铺列表、统一表单和单层操作弹窗。 */\n.big-fish .memory-page { display: grid; gap: 24px; }\n.big-fish .memory-page-toolbar,\n.big-fish .memory-card-head,\n.big-fish .memory-summary,\n.big-fish .memory-library-row,\n.big-fish .memory-dialog-head,\n.big-fish .memory-dialog-footer { display: flex; justify-content: space-between; align-items: center; gap: 20px; }\n.big-fish .memory-page-toolbar h2 { margin: 6px 0; font-family: var(--fish-title); font-size: 23px; }\n.big-fish .memory-page-toolbar p { margin: 0; color: var(--fish-muted); font-size: var(--fish-small); overflow-wrap: anywhere; }\n.big-fish .memory-page h3 { margin: 0; font-family: var(--fish-title); font-size: 18px; }\n.big-fish .memory-card-head { margin-bottom: 24px; align-items: flex-start; }\n.big-fish .memory-card-head p,\n.big-fish .memory-summary p { margin: 6px 0 0; color: var(--fish-muted); font-size: var(--fish-small); line-height: 1.7; }\n.big-fish .memory-stack { display: grid; gap: 24px; min-width: 0; }\n.big-fish .memory-stats { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; }\n.big-fish .memory-stats > div { display: flex; align-items: baseline; gap: 12px; padding: 18px 20px; border: 1px solid var(--fish-border); border-radius: 14px; background: var(--fish-soft); }\n.big-fish .memory-stats strong { font-family: var(--fish-title); font-size: 28px; font-weight: 650; line-height: 1.3; }\n.big-fish .memory-stats span { color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .memory-switch { display: inline-flex; gap: 12px; align-items: center; flex-shrink: 0; border: 0; background: transparent; color: var(--fish-text); font: inherit; cursor: pointer; }\n.big-fish .memory-libraries { padding-bottom: 0; }\n.big-fish .memory-library-row { padding: 20px 0; border-top: 1px solid var(--fish-border); }\n.big-fish .memory-library-copy { min-width: 0; flex: 1; }\n.big-fish .memory-library-title { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; }\n.big-fish .memory-library-title strong { font-size: 16px; overflow-wrap: anywhere; }\n.big-fish .memory-library-copy p { margin: 8px 0 0; font-size: var(--fish-small); color: var(--fish-muted); }\n.big-fish .memory-badge { display: inline-block; padding: 3px 9px; border: 1px solid var(--fish-border); border-radius: 6px; color: var(--fish-muted); font-size: 11px; font-weight: 500; white-space: nowrap; }\n.big-fish .memory-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }\n.big-fish .memory-save-row { padding-top: 24px; margin-top: 24px; border-top: 1px solid var(--fish-border); }\n.big-fish .memory-form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 24px; }\n.big-fish .memory-field { display: grid; align-content: start; gap: 8px; font-size: var(--fish-label); min-width: 0; }\n.big-fish .memory-field-wide { grid-column: 1/-1; }\n.big-fish .memory-field input,\n.big-fish .memory-field select { width: 100%; }\n.big-fish .memory-field small { color: var(--fish-muted); font-size: var(--fish-small); line-height: 1.6; }\n.big-fish .memory-callout { display: flex; justify-content: space-between; gap: 20px; align-items: center; margin: 0 0 24px; padding: 16px 18px; border-radius: 12px; background: var(--fish-soft); color: var(--fish-muted); font-size: var(--fish-small); line-height: 1.75; }\n.big-fish .memory-callout p { margin: 4px 0 0; }\n.big-fish .memory-index-hint,\n.big-fish .memory-backup-note { margin: 16px 0 0; color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .memory-policy-group { display: grid; grid-template-columns: minmax(180px, .7fr) minmax(0, 1.3fr); gap: 32px; padding: 24px 0; border-top: 1px solid var(--fish-border); }\n.big-fish .memory-policy-head h4 { margin: 0 0 8px; font-size: 15px; font-weight: 600; }\n.big-fish .memory-policy-head p { margin: 0 0 12px; color: var(--fish-muted); font-size: var(--fish-small); line-height: 1.7; }\n.big-fish .memory-policy-fields { display: grid; gap: 24px; }\n.big-fish .memory-policy-field { min-width: 0; }\n.big-fish .memory-policy-input { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 6px; }\n.big-fish .memory-policy-input > span:first-child { flex: 1 1 160px !important; font-size: var(--fish-label); }\n.big-fish .memory-policy-input input { width: 108px !important; }\n.big-fish .memory-target { display: grid; grid-template-columns: 120px minmax(0,1fr); gap: 16px; align-items: center; margin-bottom: 24px; font-size: var(--fish-label); }\n.big-fish .memory-task-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }\n.big-fish .memory-task { text-align: left; display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 20px; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-surface); color: var(--fish-text); font: inherit; cursor: pointer; }\n.big-fish .memory-task:hover { border-color: var(--fish-action); background: var(--fish-soft); }\n.big-fish .memory-task strong { font-size: 15px; font-weight: 600; }\n.big-fish .memory-task span { color: var(--fish-muted); font-size: var(--fish-small); line-height: 1.65; }\n.big-fish .memory-task:disabled { opacity: .5; cursor: default; }\n.big-fish .memory-empty { padding: 40px 24px; text-align: center; color: var(--fish-muted); font-size: var(--fish-label); line-height: 1.8; }\n.big-fish .memory-feedback { padding: 14px 16px; border: 1px solid var(--fish-border); border-radius: 10px; background: var(--fish-soft); font-size: var(--fish-small); white-space: pre-line; line-height: 1.8; margin-bottom: 16px; }\n.big-fish .memory-isolation > .qq-memory-isolation { margin: 0; border: 0; padding: 0; background: none; box-shadow: none; }\n.big-fish .memory-isolation > .qq-memory-isolation > div:first-child { display: none; }\n.big-fish .memory-isolation label { display: grid; grid-template-columns: 120px minmax(0,1fr); align-items: center; gap: 16px; margin-bottom: 16px; }\n.big-fish .memory-isolation label input { width: 100% !important; }\n.big-fish .memory-isolation p { color: var(--fish-muted); font-size: var(--fish-small); line-height: 1.8; }\n.big-fish .memory-dialog { width: min(960px, calc(100vw - 48px)); max-width: none; max-height: min(88dvh, 960px); padding: 0; border: 1px solid var(--fish-border); border-radius: 20px; background: var(--fish-surface); color: var(--fish-text); font-family: var(--fish-font); font-size: var(--fish-body); line-height: 1.75; box-shadow: var(--fish-memory-dialog-shadow); overflow: hidden; }\n.big-fish .memory-dialog[open] { display: flex; flex-direction: column; }\n.big-fish .memory-dialog::backdrop { background: var(--fish-memory-dialog-bg); backdrop-filter: blur(4px); }\n.big-fish .memory-dialog-head { flex: none; padding: 24px 28px; border-bottom: 1px solid var(--fish-border); }\n.big-fish .memory-dialog-head p { margin: 0 0 4px; font-size: var(--fish-small); color: var(--fish-muted); overflow-wrap: anywhere; }\n.big-fish .memory-dialog-head h2 { font-family: var(--fish-title); font-size: 22px; margin: 0; line-height: 1.4; }\n.big-fish .memory-dialog-body { flex: 1; min-height: 0; padding: 24px 28px 28px; overflow: auto; overscroll-behavior: contain; scrollbar-gutter: stable; }\n.big-fish .memory-dialog-body > div { min-width: 0; }\n.big-fish .memory-dialog-foot { flex: none; border-top: 1px solid var(--fish-border); padding: 16px 28px; }\n.big-fish .memory-dialog-footer { font-size: var(--fish-small); color: var(--fish-muted); }\n.big-fish .memory-dialog .memory-stats { margin: 20px 0; }\n.big-fish .memory-dialog .memory-records > .memory-actions { margin-bottom: 20px; }\n.big-fish .memory-filter { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 16px 0; border-top: 1px solid var(--fish-border); }\n.big-fish .memory-filter input { flex: 1 1 250px !important; width: auto !important; }\n.big-fish .memory-filter input::placeholder { font-size: 12px; }\n.big-fish .memory-source-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 0; border-bottom: 1px solid var(--fish-border); }\n.big-fish .memory-operation { min-width: 0; }\n.big-fish .memory-operation h3 { margin: 0 0 8px; font-size: 17px; }\n.big-fish .memory-operation > .memory-actions { margin: 20px 0; }\n.big-fish .memory-operation + .memory-operation { border-top: 1px solid var(--fish-border); padding-top: 24px; }\n@media(max-width: 760px) {\n  .big-fish .memory-card-head,\n  .big-fish .memory-summary,\n  .big-fish .memory-library-row { align-items: flex-start; flex-direction: column; gap: 16px; }\n  .big-fish .memory-stats { gap: 8px; }\n  .big-fish .memory-stats > div { flex-direction: column; gap: 4px; padding: 12px; }\n  .big-fish .memory-stats strong { font-size: 23px; }\n  .big-fish .memory-policy-group,\n  .big-fish .memory-form-grid,\n  .big-fish .memory-task-grid { grid-template-columns: minmax(0,1fr); gap: 20px; }\n  .big-fish .memory-target,\n  .big-fish .memory-isolation label { grid-template-columns: minmax(0,1fr); gap: 8px; }\n  .big-fish .memory-dialog { width: calc(100vw - 20px); max-height: calc(100dvh - 24px); border-radius: 16px; }\n  .big-fish .memory-dialog-head,\n  .big-fish .memory-dialog-body { padding: 20px; }\n  .big-fish .memory-dialog-foot { padding: 14px 20px; }\n}\n.big-fish .memory-methods { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; margin: 16px 0 24px; }\n.big-fish .memory-methods > div { padding: 16px; background: var(--fish-soft); border-radius: 10px; }\n.big-fish .memory-methods p { margin: 6px 0 0; color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .memory-import-guide { margin: 16px 0; color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .memory-import-guide summary { cursor: pointer; font-weight: 600; }\n.big-fish .memory-import-guide li { margin: 8px 0; }\n.big-fish .memory-source-row > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n@media(max-width:760px) { .big-fish .memory-methods { grid-template-columns: minmax(0,1fr); } }\n\n.big-fish .platform-page { display: grid; gap: 24px; }\n.big-fish .platform-page p { max-width: none; }\n.big-fish .platform-toolbar { display: flex; flex-wrap: wrap; gap: 12px; }\n.big-fish .platform-provider-card { position: relative; padding: 0; }\n.big-fish .platform-provider-open { display: grid; gap: 12px; width: 100%; padding: 20px; border: 0; border-radius: inherit; background: none; text-align: left; font: inherit; color: var(--fish-text); cursor: pointer; }\n.big-fish .platform-provider-card button.platform-provider-toggle { position: absolute; top: 20px; right: 20px; }\n.big-fish .platform-provider-open .platform-provider-title { padding-right: 66px; }\n.big-fish .platform-provider-card:hover { border-color: var(--fish-accent); }\n.big-fish .platform-provider-open:focus-visible { outline: 2px solid var(--fish-accent); outline-offset: 4px; }\n.big-fish .platform-provider-title { font-family: var(--fish-title); font-size: 22px; font-weight: 600; }\n.big-fish .platform-provider-description { display: block; margin: 0; color: var(--fish-muted); overflow-wrap: anywhere; }\n.big-fish .platform-provider-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 20px; color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .platform-provider .platform-sessions,\n.big-fish .platform-provider .platform-operation { min-width: 0; margin: 0; }\n.big-fish .platform-sessions { margin: 0; padding: 4px 16px; border: 1px solid var(--fish-border); border-radius: 12px; }\n.big-fish .platform-session-option { display: flex; align-items: center; justify-content: space-between; gap: 20px; min-height: 54px; cursor: pointer; }\n.big-fish .platform-session-option + .platform-session-option { border-top: 1px solid var(--fish-line); }\n.big-fish .platform-session-option span { min-width: 0; overflow-wrap: anywhere; }\n.big-fish .platform-sessions[disabled] .platform-session-option { cursor: wait; }\n.big-fish .platform-operation { margin-top: 24px; border: 1px solid var(--fish-border); border-radius: 12px; overflow: hidden; }\n.big-fish .platform-operation-head { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; padding: 20px 24px; background: var(--fish-soft); }\n.big-fish .platform-operation-head h3 { margin: 0; font-size: 19px; }\n.big-fish .platform-method { padding: 3px 9px; border-radius: 6px; background: var(--fish-action); color: white; font-size: 12px; }\n.big-fish .platform-operation-body { display: grid; gap: 32px; padding: 28px; }\n.big-fish .platform-operation-intro { display: grid; gap: 12px; min-width: 0; }\n.big-fish .platform-operation-intro p { margin: 0; }\n.big-fish .platform-section { display: grid; gap: 16px; min-width: 0; padding-top: 28px; border-top: 1px solid var(--fish-border); }\n.big-fish .platform-section h3 { margin: 0; font-size: 17px; }\n.big-fish .platform-schema { display: grid; gap: 16px; min-width: 0; }\n.big-fish .platform-schema .fish-table-wrap { margin: 0; }\n.big-fish .platform-schema .fish-table { min-width: 620px; }\n.big-fish .platform-schema td { vertical-align: top; }\n.big-fish .platform-code-block { min-width: 0; overflow: hidden; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-soft); }\n.big-fish .platform-code-head { display: flex; justify-content: space-between; gap: 16px; padding: 10px 18px; border-bottom: 1px solid var(--fish-border); color: var(--fish-muted); font-size: 12px; }\n.big-fish .platform-code-block pre,\n.big-fish .platform-guide pre { margin: 0; max-height: 460px; padding: 20px; overflow: auto; white-space: pre; tab-size: 2; font: 13px/1.8 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: var(--fish-text); }\n.big-fish .platform-code-block pre code,\n.big-fish .platform-guide pre code { display: block; padding: 0; border: 0; background: none; color: inherit; font: inherit; white-space: inherit; }\n.big-fish .platform-page summary { cursor: pointer; }\n.big-fish .platform-path { display: block; overflow-wrap: anywhere; font-size: 12px; }\n.big-fish .platform-operation textarea { box-sizing: border-box; width: 100%; font-family: monospace; }\n.big-fish .platform-operation .memory-actions { margin-top: 0; }\n.big-fish .platform-response { display: grid; gap: 16px; }\n.big-fish .memory-dialog.platform-guide { width: min(1120px, calc(100vw - 48px)); }\n.big-fish .fish-refresh-button { display: grid; place-items: center; flex: none; min-width: 44px; min-height: 44px; padding: 0; }\n.big-fish .fish-refresh-button .fish-spin { animation-play-state: paused; }\n.big-fish .fish-refresh-button[aria-busy=true] .fish-spin { animation-play-state: running; }\n.big-fish .platform-guide-body { display: grid; align-content: start; overflow-y: auto; }\n.big-fish .platform-guide-sections { display: grid; gap: 20px; counter-reset: guide-section; }\n.big-fish .platform-guide-sections > section { display: grid; gap: 18px; padding: 24px; min-width: 0; border: 1px solid var(--fish-border); border-radius: 16px; counter-increment: guide-section; }\n.big-fish .platform-guide h3 { display: flex; align-items: center; gap: 12px; margin: 0 0 4px; font-size: 17px; line-height: 1.5; }\n.big-fish .platform-guide h3::before { content: counter(guide-section, decimal-leading-zero); display: grid; place-items: center; flex: none; width: 32px; height: 32px; border-radius: 10px; background: var(--fish-soft); color: var(--fish-action); font-size: 12px; letter-spacing: .06em; }\n.big-fish .platform-guide p { margin: 0; max-width: none; overflow-wrap: anywhere; font-size: var(--fish-small); line-height: 1.8; }\n.big-fish .platform-guide .platform-code-block pre { max-height: 440px; }\n.big-fish .platform-guide-table { min-width: 0; }\n.big-fish .platform-guide-table:focus-visible { outline: 2px solid var(--fish-action); outline-offset: 3px; }\n.big-fish .platform-guide-table .fish-table { width: 100%; min-width: 780px; font-size: 12.5px; line-height: 1.75; }\n.big-fish .platform-guide-table caption { padding: 12px 16px; text-align: left; font-weight: 600; color: var(--fish-text); background: var(--fish-soft); }\n.big-fish .platform-guide-table th,\n.big-fish .platform-guide-table td { padding: 12px 14px; text-align: left; vertical-align: top; white-space: normal; overflow-wrap: anywhere; }\n.big-fish .platform-guide-table tbody th { min-width: 140px; max-width: 230px; border-bottom: 1px dashed var(--fish-line); background: transparent; color: var(--fish-text); font-weight: 500; }\n.big-fish .platform-guide-table tbody tr:last-child th { border-bottom: 0; }\n.big-fish .platform-guide-table code { padding: 0; background: none; color: var(--fish-text); white-space: normal; overflow-wrap: anywhere; font-size: 12px; }\n.big-fish .platform-guide-examples { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); align-items: start; gap: 16px; }\n.big-fish .platform-guide-examples > .platform-code-block:first-child { grid-column: 1 / -1; }\n.big-fish .platform-guide-examples .platform-code-block pre { max-height: 320px; }\n@media (max-width: 760px) {\n  .big-fish .platform-operation-body { padding: 20px; }\n  .big-fish .memory-dialog.platform-guide { width: calc(100vw - 20px); }\n  .big-fish .platform-guide-sections > section { padding: 16px; }\n  .big-fish .platform-guide-examples { grid-template-columns: minmax(0,1fr); }\n}\n\n.big-fish .memory-history-tools .fish-qq { padding: 0 !important; }\n.big-fish .memory-history-tools .fish-qq > div:not([hidden]) > div { border: 0 !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important; }\n.big-fish .memory-history-tools .fish-qq > div:not([hidden]) > div + div { border-top: 1px solid var(--fish-border) !important; padding-top: 24px !important; }\n.big-fish .memory-history-tools .fish-section-title { display: none; }\n\n.big-fish .platform-add-button { margin-left: auto; }\n.big-fish .platform-add-api { width: min(1120px, calc(100vw - 48px)); height: min(850px, calc(100dvh - 48px)); max-height: calc(100dvh - 48px); }\n.big-fish .platform-add-api .memory-dialog-head { padding: 16px 24px; }\n.big-fish .platform-add-api .memory-dialog-foot { padding: 12px 24px; }\n.big-fish .platform-api-form { display: flex; flex-direction: column; gap: 16px; padding: 18px 24px; overflow: hidden; }\n.big-fish .platform-api-form h3 { margin: 0; font-size: 16px; }\n.big-fish .platform-api-form p { margin: 0; font-size: var(--fish-small); }\n.big-fish .platform-import-bar { display: flex; flex: none; flex-wrap: wrap; align-items: center; gap: 12px; }\n.big-fish .platform-import-bar span { font-size: var(--fish-small); }\n.big-fish .platform-import-setup { display: grid; flex: none; gap: 12px; padding: 16px; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-soft); }\n.big-fish .platform-api-form:has(.platform-import-setup) { overflow: auto; }\n.big-fish .platform-import-setup input { width: 100%; }\n.big-fish .platform-api-manual { display: contents; }\n.big-fish .platform-api-manual[hidden] { display: none; }\n.big-fish .platform-api-provider { display: grid; flex: none; gap: 12px; }\n.big-fish .platform-api-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }\n.big-fish .platform-api-provider .platform-api-fields { grid-template-columns: 1fr 1fr .65fr 1.5fr; }\n.big-fish .platform-api-form .memory-field { min-width: 0; margin: 0; font-size: 13px; line-height: 1.4; }\n.big-fish .platform-api-workspace { display: grid; flex: 1; min-height: 0; grid-template-columns: 170px minmax(0, 1fr); gap: 24px; border-top: 1px solid var(--fish-border); padding-top: 16px; }\n.big-fish .platform-api-sidebar { display: flex; flex-direction: column; gap: 12px; min-height: 0; }\n.big-fish .platform-api-list-head,\n.big-fish .platform-api-editor-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n.big-fish .platform-api-list { display: flex; flex-direction: column; gap: 8px; flex: 1; min-height: 0; overflow: auto; }\n.big-fish .platform-api-list button { display: grid; flex: none; gap: 3px; padding: 10px 12px; border: 1px solid transparent; border-radius: 10px; background: var(--fish-soft); color: var(--fish-text); text-align: left; cursor: pointer; }\n.big-fish .platform-api-list button[aria-pressed=true] { border-color: var(--fish-accent); background: var(--fish-accent-soft); }\n.big-fish .platform-api-list button strong,\n.big-fish .platform-api-list button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.big-fish .platform-api-list button span { color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .platform-api-editor { display: flex; flex-direction: column; gap: 12px; min-width: 0; min-height: 0; }\n.big-fish .platform-api-editor-head > .fish-button { flex: none; padding: 5px 10px; font-size: var(--fish-small); }\n.big-fish .platform-api-tabs { display: flex; min-width: 0; gap: 6px; overflow-x: auto; }\n.big-fish .platform-api-tabs .fish-button { flex: none; padding: 7px 10px; font-size: var(--fish-small); white-space: nowrap; }\n.big-fish .platform-api-tabs button[aria-pressed=true] { border-color: var(--fish-accent); background: var(--fish-accent-soft); }\n.big-fish .platform-api-pane { flex: 1; min-height: 0; overflow: auto; }\n.big-fish .platform-api-base { display: grid; gap: 12px; }\n.big-fish .platform-api-json { display: grid; height: 100%; min-height: 220px; grid-template-rows: minmax(0, 1fr) auto; gap: 12px; }\n.big-fish .platform-api-json:has(> label:nth-of-type(2)) { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.big-fish .platform-api-json .memory-field { display: flex; flex-direction: column; min-height: 0; }\n.big-fish .platform-api-json textarea { flex: 1; min-height: 120px; resize: none; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }\n.big-fish .platform-api-json p { grid-column: 1 / -1; }\n.big-fish .platform-api-readonly { display: flex; align-items: center; gap: 10px; }\n.big-fish .platform-api-actions { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }\n.big-fish .platform-api-actions .fish-muted { font-size: var(--fish-small); }\n@media (max-width: 760px) {\n  .big-fish .platform-add-api { width: calc(100vw - 20px); height: calc(100dvh - 24px); max-height: calc(100dvh - 24px); }\n  .big-fish .platform-api-form { gap: 14px; }\n  .big-fish .platform-api-provider .platform-api-fields { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n  .big-fish .platform-api-workspace { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); gap: 14px; padding-top: 14px; }\n  .big-fish .platform-api-sidebar { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }\n  .big-fish .platform-api-list-head { grid-column: 1 / -1; }\n  .big-fish .platform-api-list { flex-direction: row; }\n  .big-fish .platform-api-list button { width: 130px; padding: 6px 10px; }\n  .big-fish .platform-api-actions { align-items: flex-end; flex-wrap: nowrap; }\n  .big-fish .platform-api-actions .fish-button { flex: none; }\n}\n\n.big-fish .fish-speak .fish-form-row { padding: 18px 0; gap: 16px 28px; }\n.big-fish .fish-speak .fish-actions { gap: 12px; margin-top: 8px; }\n@media (max-width: 760px) {\n  .big-fish .fish-speak { gap: 20px !important; }\n  .big-fish .fish-speak .fish-form-row { flex-direction: column; gap: 10px; }\n  .big-fish .fish-speak .fish-form-label,\n  .big-fish .fish-speak .fish-control { flex: none !important; width: 100%; }\n}\n\n.big-fish .fish-button.rice-threshold-button {\n  background: var(--fish-gold);\n  border-color: var(--fish-gold);\n  color: var(--fish-navy);\n}\n.big-fish .fish-button.rice-threshold-button:not(:disabled):hover {\n  background: var(--fish-gold-soft);\n  border-color: var(--fish-gold);\n  color: var(--fish-navy);\n}\n.big-fish .rice-threshold-field {\n  display: grid;\n  gap: 10px;\n  margin: 22px 0;\n}\n.big-fish .rice-threshold-field .fish-muted { line-height: 1.7; }\n\n/* 心情设置复用 QQ 卡片与左右表单布局。 */\n.big-fish .fish-mood.mood-settings [data-fm-sec] {\n  padding: 24px;\n  border: 1px solid var(--fish-border);\n  border-radius: var(--fish-radius);\n  background: var(--fish-panel);\n  box-shadow: var(--fish-shadow);\n}\n.big-fish .mood-form-row { display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; padding: 8px 0; }\n.big-fish .mood-form-row > .fish-form-label { flex: 0 1 200px; padding-top: 8px; font-size: var(--fish-label); font-weight: 550; }\n.big-fish .mood-form-row > .fish-control { flex: 1 1 260px; min-width: 0; }\n.big-fish .mood-form-row .fish-control > [data-fm-input] { width: 100%; box-sizing: border-box; }\n.big-fish .mood-form-row .fish-control > [data-fm-num] { width: 136px; }\n.big-fish .mood-form-row p { margin: 8px 0 0; font-size: var(--fish-small); }\n.big-fish .mood-settings [data-fm-row]:has(> [data-fm-input]) > [data-fm-grow] { flex: 0 1 200px; }\n.big-fish .mood-settings [data-fm-row] > [data-fm-input] { flex: 1 1 260px; box-sizing: border-box; }\n.big-fish .mood-settings [data-fm-slot] { padding: 24px; }\n.big-fish .mood-settings [data-fm-sess] { border-bottom: 1px solid var(--fish-line); }\n.big-fish .mood-charm-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; }\n.big-fish .mood-charm-card { display: flex; flex-direction: column; gap: 12px; min-width: 0; padding: 16px; border: 1px solid var(--fish-border); border-radius: var(--fish-radius-sm); background: var(--fish-soft); }\n.big-fish .mood-charm-card img { width: 100%; height: 140px; object-fit: contain; }\n.big-fish .mood-scale { display: flex; align-items: center; gap: 16px; }\n.big-fish .mood-scale input { flex: 1; min-width: 0; }\n@container(max-width:620px) {\n  .big-fish .mood-form-row > .fish-form-label { flex-basis: 100%; padding-top: 0; }\n  .big-fish .fish-mood.mood-settings [data-fm-sec] { padding: 16px; }\n}\n.big-fish .fish-mood section.fish-card[data-fm-sec] { padding: 24px; }\n@container(max-width:620px) {\n  .big-fish .fish-mood section.fish-card[data-fm-sec] { padding: 16px; }\n}\n.big-fish .mood-scale-card .mood-form-row { padding: 0; align-items: center; gap: 12px; }\n.big-fish .mood-scale-card .mood-form-row > .fish-form-label { flex: 0 0 112px; padding-top: 0; }\n.big-fish .mood-scale-card .mood-form-row > .fish-control { flex: 1 1 220px; }\n.big-fish .mood-scale-card .fish-control > select[data-fish-select-compact] { width: auto; max-width: 100%; }\n.big-fish .mood-charm-sliders { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-bottom: 28px; }\n.big-fish .mood-charm-sliders .mood-form-row { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; min-width: 0; }\n.big-fish .mood-charm-sliders .mood-scale { gap: 10px; }\n.big-fish .mood-charm-sliders output { min-width: 4ch; text-align: right; font-variant-numeric: tabular-nums; }\n.big-fish .mood-history-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }\n.big-fish .mood-history-date { display: flex; flex-direction: row; align-items: center; gap: 12px; margin: 0; white-space: nowrap; }\n.big-fish .mood-history-date input { width: 170px; min-width: 0; }\n.big-fish .mood-history-toolbar :is(input, button) { height: 44px; box-sizing: border-box; }\n.big-fish .mood-charm-portrait { display: flex; flex-direction: column; gap: 8px; padding-top: 12px; border-top: 1px solid var(--fish-border); }\n\n.big-fish .platform-isolation { display: grid; gap: 14px; padding: 18px; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-soft); }\n\n\n.big-fish .mood-portrait-stage { display: flex; align-items: center; justify-content: center; height: 148px; min-width: 0; }\n.big-fish .mood-portrait-upload { min-height: 0; position: relative; display: block; width: min(100%, calc(140px * var(--portrait-ratio, 1))); aspect-ratio: var(--portrait-ratio, 1); padding: 0; border: 0; background: transparent; cursor: pointer; box-shadow: none; }\n.big-fish .mood-portrait-upload img { display: block; width: 100%; height: 100%; object-fit: contain; filter: brightness(1); transition: filter 240ms ease; }\n.big-fish .mood-portrait-upload[data-outline=fallback]::after { content: ''; position: absolute; inset: -4px; border: 1.5px dashed var(--fish-action); border-radius: 8px; opacity: 0; pointer-events: none; }\n.big-fish .mood-portrait-plus { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; color: var(--fish-on-accent); background: var(--fish-action); font: 400 30px/1 var(--fish-font); opacity: 0; pointer-events: none; }\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled)::after,\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) .mood-portrait-outline,\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) .mood-portrait-plus { opacity: 1; }\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) img { filter: brightness(.55); }\n.big-fish .mood-portrait-caption { display: flex; align-items: center; justify-content: space-between; gap: 8px; }\n.big-fish .mood-portrait-reset { min-height: 0; padding: 2px 5px; border: 1px solid var(--fish-border); border-radius: 5px; background: transparent; color: var(--fish-muted); font: inherit; font-size: 11px; line-height: 1.5; cursor: pointer; }\n@media (hover: none) {\n  .big-fish .mood-portrait-upload:not(:disabled)::after,\n  .big-fish .mood-portrait-upload:not(:disabled) .mood-portrait-outline,\n  .big-fish .mood-portrait-upload:not(:disabled) .mood-portrait-plus { opacity: 1; }\n  .big-fish .mood-portrait-upload:not(:disabled) img { filter: brightness(.55); }\n}\n\n.big-fish .mood-portrait-upload { transition: transform 240ms cubic-bezier(.2,.7,.3,1); }\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) { transform: translateY(-2px); }\n.big-fish .mood-portrait-outline { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; opacity: 0; transform: scale(.98); transition: opacity 240ms ease, transform 280ms cubic-bezier(.2,.7,.3,1); }\n.big-fish .mood-portrait-outline path { fill: none; stroke: var(--fish-action); stroke-width: 1.5px; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 5 4; animation: mood-outline-dash 1.2s linear infinite; animation-play-state: paused; }\n.big-fish .mood-portrait-upload[data-outline=fallback]::after { transition: opacity 240ms ease; }\n.big-fish .mood-portrait-plus { transform: translate(-50%, -42%) scale(.75); transition: opacity 200ms ease, transform 280ms cubic-bezier(.2,.7,.3,1); }\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) .mood-portrait-outline { transform: scale(1); }\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) .mood-portrait-outline path { animation-play-state: running; }\n.big-fish .mood-portrait-upload:is(:hover, :focus-visible):not(:disabled) .mood-portrait-plus { transform: translate(-50%, -50%) scale(1); }\n@keyframes mood-outline-dash { to { stroke-dashoffset: -18; } }\n@media (hover: none) {\n  .big-fish .mood-portrait-outline { transform: none; }\n  .big-fish .mood-portrait-plus { transform: translate(-50%, -50%); }\n}\n@media (prefers-reduced-motion: reduce) {\n  .big-fish .mood-portrait-upload,\n  .big-fish .mood-portrait-outline,\n  .big-fish .mood-portrait-plus,\n  .big-fish .mood-portrait-upload[data-outline=fallback]::after { transition: none; transform: none !important; }\n  .big-fish .mood-portrait-upload .mood-portrait-plus { transform: translate(-50%, -50%) !important; }\n  .big-fish .mood-portrait-outline path { animation: none; }\n}\n\n/* 全局通知 */\n.big-fish-notice.fish-notice-stack {\n  position: fixed; inset: calc(16px + var(--dsh-frame-top-clearance, 0px)) 16px auto auto;\n  display: flex; flex-direction: column; gap: 12px; width: min(380px, calc(100vw - 32px));\n  max-width: none; margin: 0; padding: 0; border: 0; background: transparent; box-shadow: none;\n  max-height: calc(100dvh - 32px); overflow-x: hidden; overflow-y: auto; overflow-anchor: none; pointer-events: none; z-index: 10000; font-family: var(--fish-font);\n}\n.fish-notice-stack .fish-notice-slot { flex: none; min-width: 0; }\n.fish-notice-stack .fish-notice-card {\n  position: relative; padding: 18px 44px 20px 18px; border: 1px solid var(--fish-border); border-radius: 14px;\n  background: var(--fish-panel); color: var(--fish-text); box-shadow: var(--fish-notice-card-shadow);\n  overflow: hidden; pointer-events: auto; animation: fish-notice-enter .24s ease-out both;\n}\n.fish-notice-stack .fish-notice-text { white-space: pre-line; overflow-wrap: anywhere; font-size: 14px; line-height: 1.65; }\n.fish-notice-stack .fish-notice-close { position: absolute; right: 8px; top: 8px; border: 0; padding: 2px 8px; background: transparent; color: var(--fish-muted); font-size: 22px; box-shadow: none; }\n.fish-notice-stack .fish-notice-progress { transition: transform .2s linear; position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: var(--fish-gold); transform-origin: left; animation: fish-notice-countdown 5s linear forwards; }\n.fish-notice-stack [data-tone=success] .fish-notice-progress { background: var(--fish-mint); }\n.fish-notice-stack .fish-notice-actions { display: flex; gap: 8px; margin-top: 10px; }\n.fish-notice-stack .fish-notice-actions button { background: var(--fish-soft); color: var(--fish-text); border: 1px solid var(--fish-border); }\n.fish-notice-stack .is-closing { animation: fish-notice-exit .18s ease-in both; pointer-events: none; }\n@keyframes fish-notice-enter { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }\n@keyframes fish-notice-exit { to { opacity: 0; transform: translateX(24px); } }\n@keyframes fish-notice-countdown { to { transform: scaleX(0); } }\n@media(prefers-reduced-motion:reduce) { .fish-notice-stack .fish-notice-card { animation-duration: 1ms; } }\n\n.big-fish .memory-dialog.platform-provider,\n.big-fish .fish-modal-card.fish-sticker-dialog { width: min(1320px, calc(100vw - 48px)); max-width: none; height: min(900px, calc(100dvh - 48px)); max-height: calc(100dvh - 48px); }\n.big-fish .platform-provider-workspace { display: grid; grid-template-columns: minmax(260px, 320px) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); flex: 1; min-height: 0; overflow: hidden; }\n.big-fish .platform-provider-sidebar,\n.big-fish .platform-provider-detail { box-sizing: border-box; min-width: 0; min-height: 0; overflow-y: scroll; overscroll-behavior: contain; scrollbar-gutter: stable; }\n.big-fish .platform-provider-sidebar { display: grid; align-content: start; gap: 22px; padding: 24px 20px; border-right: 1px solid var(--fish-border); }\n.big-fish .platform-provider-sidebar > * { min-width: 0; }\n.big-fish .platform-provider-sidebar .platform-provider-description { font-size: var(--fish-small); line-height: 1.8; }\n.big-fish .platform-provider-settings { padding: 4px 14px; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-soft); }\n.big-fish .platform-provider-sidebar .platform-session-option { gap: 12px; padding: 10px 0; font-size: var(--fish-small); }\n.big-fish .platform-provider-sidebar .platform-session-option input { flex-shrink: 0; }\n.big-fish .platform-provider-sidebar .platform-isolation { padding: 4px 14px; gap: 0; }\n.big-fish .platform-provider-sidebar .platform-isolation .platform-session-option { min-height: 44px; padding: 4px 0; }\n.big-fish .platform-provider-operations { display: grid; gap: 10px; }\n.big-fish .platform-provider-operations h3 { margin: 0 0 4px; font-size: 15px; }\n.big-fish .platform-provider-operations button { display: grid; gap: 8px; width: 100%; min-width: 0; padding: 14px; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-soft); color: var(--fish-text); font: inherit; text-align: left; cursor: pointer; transition: background .18s, border-color .18s; }\n.big-fish .platform-provider-operations button:hover,\n.big-fish .platform-provider-operations button[aria-current=true] { border-color: var(--fish-accent); background: var(--fish-accent-soft); }\n.big-fish .platform-provider-operations button:focus-visible,\n.big-fish .platform-provider-detail:focus-visible { outline: 2px solid var(--fish-accent); outline-offset: -3px; }\n.big-fish .platform-operation-choice { display: flex; align-items: center; justify-content: space-between; gap: 10px; font-size: var(--fish-small); }\n.big-fish .platform-operation-choice strong,\n.big-fish .platform-provider-operations code { min-width: 0; overflow-wrap: anywhere; }\n.big-fish .platform-provider-operations code { font-size: 12px; color: var(--fish-muted); }\n.big-fish .platform-provider-detail { padding: 24px; }\n.big-fish .platform-provider-detail .platform-operation { animation: platform-detail-enter .22s ease-out both; }\n.big-fish .platform-provider-empty { display: grid; align-content: center; justify-items: center; gap: 12px; min-height: 100%; text-align: center; color: var(--fish-muted); }\n.big-fish .platform-provider-empty h3,\n.big-fish .platform-provider-empty p { margin: 0; }\n@keyframes platform-detail-enter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }\n@media (max-width: 700px) {\n  .big-fish .memory-dialog.platform-provider,\n  .big-fish .fish-modal-card.fish-sticker-dialog { width: calc(100vw - 20px); height: calc(100dvh - 24px); max-height: calc(100dvh - 24px); }\n  .big-fish .platform-provider-workspace { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, .8fr) minmax(0, 1.2fr); }\n  .big-fish .platform-provider-sidebar { gap: 18px; padding: 18px; border-right: 0; border-bottom: 1px solid var(--fish-border); }\n  .big-fish .platform-provider-detail { padding: 18px; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .big-fish .platform-provider-detail .platform-operation { animation: none; }\n  .big-fish .platform-provider-operations button { transition: none; }\n}\n\n.big-fish .memory-dialog.platform-prompt { width: min(1040px, calc(100vw - 32px)); height: min(820px, calc(100dvh - 32px)); max-height: calc(100dvh - 32px); }\n.big-fish .platform-prompt-body { display: flex; flex-direction: column; gap: 16px; overflow: hidden; }\n.big-fish .platform-prompt-body p { margin: 0; }\n.big-fish .platform-prompt-body textarea { flex: 1; min-height: 0; width: 100%; box-sizing: border-box; resize: none; padding: 16px; border: 1px solid var(--fish-border); border-radius: 12px; background: var(--fish-soft); color: var(--fish-text); font: 13px/1.8 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: auto; }\n.big-fish .platform-prompt .memory-dialog-foot { display: flex; justify-content: flex-end; }\n\n.big-fish .platform-providers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }\n.big-fish .platform-providers .platform-provider-card { min-width: 0; }\n.big-fish .platform-providers .platform-provider-open { height: 100%; align-content: start; }\n.big-fish .platform-provider-actions { display: flex; flex: none; align-items: center; gap: 12px; }\n@media (max-width: 900px) {\n  .big-fish .platform-providers { grid-template-columns: minmax(0, 1fr); }\n}\n\n/* 更新日志：分类独立滚动，版本选择固定在侧栏底部。 */\n.big-fish.fish-release-host { display: contents; }\n.big-fish .fish-release-dialog { width: min(1120px, calc(100vw - 32px)); height: min(820px, calc(100dvh - 48px)); max-width: none; padding: 0; overflow: hidden; display: flex; flex-direction: column; }\n.big-fish .fish-release-head { padding: 18px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex: none; border-bottom: 1px solid var(--fish-border); }\n.big-fish .fish-release-head > div { display: flex; align-items: center; gap: 14px; }\n.big-fish .fish-release-head h2 { margin: 0; font-size: 20px; }\n.big-fish .fish-release-head .fish-muted { font-size: 12px; }\n.big-fish .fish-release-columns { display: grid; grid-template-columns: 250px minmax(0, 1fr); min-height: 0; flex: 1; overflow: hidden; }\n.big-fish .fish-release-nav { min-height: 0; display: flex; flex-direction: column; border-right: 1px solid var(--fish-border); background: var(--fish-soft); }\n.big-fish .fish-release-version { display: grid; gap: 10px; padding: 24px 20px; }\n.big-fish .fish-release-version strong { color: var(--fish-link); font-size: 17px; }\n.big-fish .fish-release-version time { color: var(--fish-muted); font-size: 12px; }\n.big-fish .fish-release-categories { min-height: 0; flex: 1; padding: 0 12px 16px; overflow: auto; overscroll-behavior: contain; }\n.big-fish .fish-release-categories > .fish-kicker { display: block; margin: 0 8px 12px; }\n.big-fish .fish-release-nav nav { display: flex; flex-direction: column; gap: 6px; }\n.big-fish .fish-release-nav .fish-release-category { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; text-align: left; white-space: normal; border-color: transparent; background: transparent; box-shadow: none; }\n.big-fish .fish-release-category > span:first-child { min-width: 0; }\n.big-fish .fish-release-nav [aria-pressed=true] { background: var(--fish-surface); border-color: var(--fish-accent); color: var(--fish-text); }\n.big-fish .fish-release-count { flex: none; color: var(--fish-muted); font: 12px/1.5 ui-monospace, monospace; }\n.big-fish .fish-release-history { display: grid; gap: 10px; padding: 16px; border-top: 1px solid var(--fish-border); }\n.big-fish .fish-release-history > label, .big-fish .fish-release-history small { color: var(--fish-muted); font-size: 11px; line-height: 1.6; }\n.big-fish .fish-release-history .fish-select-box { width: 100%; }\n.big-fish .fish-release-history select { width: 100%; min-width: 0; font-size: 12px; }\n.big-fish .fish-release-history-error { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; color: var(--fish-danger); }\n.big-fish .fish-release-content { padding: 28px 32px; min-width: 0; overflow: auto; overflow-wrap: anywhere; overscroll-behavior: contain; scrollbar-gutter: stable; }\n.big-fish .fish-release-content-head { padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid var(--fish-border); }\n.big-fish .fish-release-content-head h3 { margin: 0; font-size: 25px; line-height: 1.5; }\n.big-fish .fish-release-summary { margin: 12px 0 0; color: var(--fish-muted); font-size: 13px; }\n.big-fish .fish-release-section-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 4px; }\n.big-fish .fish-release-section-head h4 { margin: 0; font-size: 18px; }\n.big-fish .fish-release-section-head > span { font-size: 12px; }\n.big-fish .fish-release-content ol { list-style: none; padding: 0; margin: 0; }\n.big-fish .fish-release-content li { display: grid; grid-template-columns: 32px minmax(0, 1fr); align-items: start; gap: 16px; padding: 22px 0; border-bottom: 1px solid var(--fish-line); }\n.big-fish .fish-release-content li:last-child { border-bottom: 0; }\n.big-fish .fish-release-number { display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid var(--fish-border); border-radius: 50%; color: var(--fish-muted); font: 12px/1 ui-monospace, monospace; }\n.big-fish .fish-release-content h5 { margin: 2px 0 8px; font-size: 16px; line-height: 1.65; }\n.big-fish .fish-release-description, .big-fish .fish-release-summary { white-space: pre-wrap; line-height: 1.8; }\n.big-fish .fish-release-content .fish-release-description { margin: 0; color: var(--fish-muted); font-size: 13px; }\n.big-fish .fish-release-content a { display: inline-block; margin: 8px 16px 0 0; color: var(--fish-link); }\n.big-fish .fish-modal:has(.fish-release-dialog) { padding: 0; }\n.big-fish .fish-modal:has(.fish-release-dialog) .fm-widget { visibility: hidden !important; pointer-events: none !important; }\n@media(max-width:620px) {\n  .big-fish .fish-release-dialog { height: calc(100dvh - 24px); width: calc(100vw - 20px); }\n  .big-fish .fish-release-columns { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }\n  .big-fish .fish-release-nav { border-right: 0; border-bottom: 1px solid var(--fish-border); display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }\n  .big-fish .fish-release-version { padding: 14px 16px; gap: 4px; }\n  .big-fish .fish-release-categories { grid-column: 1 / -1; grid-row: 2; padding: 0 12px 12px; }\n  .big-fish .fish-release-categories > .fish-kicker { display: none; }\n  .big-fish .fish-release-nav nav { flex-direction: row; overflow: auto; }\n  .big-fish .fish-release-nav .fish-release-category { flex: none; white-space: nowrap; padding: 8px 10px; }\n  .big-fish .fish-release-history { grid-column: 2; grid-row: 1; padding: 12px; border-top: 0; gap: 4px; }\n  .big-fish .fish-release-history small { display: none; }\n  .big-fish .fish-release-content, .big-fish .fish-release-head { padding: 16px; }\n  .big-fish .fish-release-content-head { padding-bottom: 16px; margin-bottom: 18px; }\n  .big-fish .fish-release-content-head h3 { font-size: 20px; }\n  .big-fish .fish-release-content li { gap: 12px; padding: 18px 0; }\n}\n@media(max-width:620px) {\n  .big-fish .fish-update-operations .fish-button { flex: 1; min-width: 0; padding-inline: 12px; white-space: nowrap; }\n}\n\n.big-fish .fish-update-stickers { display: grid; aspect-ratio: 1; isolation: isolate; }\n.big-fish .fish-update-stickers img {\n  grid-area: 1 / 1; width: 100%; height: 100%; object-fit: contain;\n  opacity: 0; transform: translateY(10px) rotate(-3deg) scale(.94); filter: blur(5px);\n  transition: opacity 420ms ease, transform 700ms cubic-bezier(.16, 1, .3, 1), filter 480ms ease;\n  pointer-events: none;\n}\n.big-fish .fish-update-stickers[data-outcome=idle] [data-artwork=idle],\n.big-fish .fish-update-stickers[data-outcome=success] [data-artwork=success],\n.big-fish .fish-update-stickers[data-outcome=failure] [data-artwork=failure] {\n  opacity: 1; transform: translateY(0) rotate(0) scale(1); filter: blur(0); transition-delay: 80ms;\n}\n@media(prefers-reduced-motion:reduce) {\n  .big-fish .fish-update-stickers img { transition: none; transform: none; filter: none; }\n}\n\n/* 记忆库管理工作台 */\n.big-fish .memory-library-dialog { width: min(1120px, calc(100vw - 48px)); height: min(840px, calc(100dvh - 48px)); max-height: calc(100dvh - 48px); }\n.big-fish .memory-library-dialog .memory-dialog-body { display: flex; padding: 0; overflow: hidden; scrollbar-gutter: auto; }\n.big-fish .memory-library-dialog .memory-dialog-foot { color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .memory-library-workspace { display: grid; grid-template-columns: 228px minmax(0, 1fr); flex: 1; min-height: 0; }\n.big-fish .memory-library-nav { display: flex; flex-direction: column; gap: 8px; padding: 20px 14px; overflow: auto; border-right: 1px solid var(--fish-border); background: var(--fish-soft); }\n.big-fish .memory-library-nav .fish-button { display: flex; gap: 12px; align-items: flex-start; flex: none; width: 100%; padding: 12px; text-align: left; white-space: normal; border-color: transparent; background: transparent; box-shadow: none; }\n.big-fish .memory-nav-number { flex: none; padding-top: 2px; color: var(--fish-muted); font-size: 11px; font-variant-numeric: tabular-nums; }\n.big-fish .memory-nav-copy { display: grid; gap: 4px; min-width: 0; }\n.big-fish .memory-nav-copy strong { font-size: 14px; line-height: 1.5; font-weight: 600; }\n.big-fish .memory-nav-copy small { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--fish-muted); font-size: 11px; line-height: 1.65; font-weight: 400; }\n.big-fish .memory-library-nav .fish-button[aria-current=page] { background: var(--fish-surface) !important; border-color: var(--fish-accent) !important; color: var(--fish-text); box-shadow: var(--fish-memory-nav-active-shadow); }\n.big-fish .memory-library-nav [aria-current=page] .memory-nav-number { color: var(--fish-link); }\n.big-fish .memory-library-content { min-width: 0; padding: 28px; overflow: auto; overscroll-behavior: contain; scrollbar-gutter: stable; }\n.big-fish .memory-content-heading { padding-bottom: 20px; margin-bottom: 24px; border-bottom: 1px solid var(--fish-border); }\n.big-fish .memory-content-heading h3 { font-size: 21px; line-height: 1.5; }\n.big-fish .memory-content-heading p { margin: 6px 0 0; color: var(--fish-muted); font-size: var(--fish-small); }\n.big-fish .memory-library-content .memory-filter { padding: 0 0 18px; border: 0; }\n.big-fish .memory-library-content .memory-filter input { flex-basis: 100% !important; }\n.big-fish .memory-records > .memory-actions:empty { display: none; }\n.big-fish .memory-entry-card { margin-top: 14px; padding: 18px !important; border: 1px solid var(--fish-border) !important; border-radius: 14px; background: var(--fish-panel); }\n.big-fish .memory-entry-card .fish-record-row { margin: 0; gap: 10px 14px; }\n.big-fish .memory-library-content .memory-operation { padding: 20px; border: 1px solid var(--fish-border); border-radius: 14px; background: var(--fish-panel); }\n.big-fish .memory-library-content .memory-operation + .memory-operation { padding-top: 20px; }\n.big-fish .memory-library-content .memory-editor { margin: 0 !important; padding: 20px !important; border: 1px solid var(--fish-border) !important; border-radius: 14px; background: var(--fish-panel) !important; }\n.big-fish .memory-editor textarea { min-height: 140px !important; line-height: 1.85; }\n.big-fish .memory-editor-actions { display: flex; justify-content: flex-end; padding-top: 20px; margin-top: 20px; border-top: 1px solid var(--fish-border); }\n.big-fish .memory-editor-row { gap: 12px !important; padding-bottom: 18px; margin-bottom: 18px !important; border-bottom: 1px solid var(--fish-line); }\n@media (max-width: 700px) {\n  .big-fish .memory-library-dialog { width: calc(100vw - 20px); height: calc(100dvh - 24px); max-height: calc(100dvh - 24px); }\n  .big-fish .memory-library-workspace { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }\n  .big-fish .memory-library-nav { flex-direction: row; gap: 8px; padding: 12px 16px; border-right: 0; border-bottom: 1px solid var(--fish-border); }\n  .big-fish .memory-library-nav .fish-button { width: auto; padding: 9px 12px; white-space: nowrap; }\n  .big-fish .memory-nav-number, .big-fish .memory-nav-copy small { display: none; }\n  .big-fish .memory-library-content { padding: 20px 16px; }\n  .big-fish .memory-content-heading { padding-bottom: 16px; margin-bottom: 18px; }\n  .big-fish .memory-entry-card, .big-fish .memory-library-content .memory-operation, .big-fish .memory-library-content .memory-editor { padding: 16px !important; }\n}\n\n.big-fish .qq-history-sources { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 24px; }\n.big-fish .qq-history-sources .fish-button { display: grid; gap: 6px; padding: 16px; text-align: left; white-space: normal; }\n.big-fish .qq-history-sources span { color: var(--fish-muted); font-size: var(--fish-small); font-weight: 400; }\n.big-fish .qq-history-sources .fish-button[aria-pressed=true] { background: var(--fish-accent-soft); border-color: var(--fish-accent); color: var(--fish-text); }\n.big-fish .qq-history-review progress { display: block; width: 100%; margin: 18px 0; accent-color: var(--fish-accent); }\n.big-fish .qq-history-review h3 { margin-bottom: 18px; }\n.big-fish .qq-history-job { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 16px 0; border: 0; border-bottom: 1px solid var(--fish-border); border-radius: 0; background: transparent; color: var(--fish-text); text-align: left; cursor: pointer; }\n.big-fish .qq-history-job > span:first-child { display: grid; gap: 6px; min-width: 0; overflow-wrap: anywhere; }\n.big-fish .qq-history-job > span:last-child { flex-shrink: 0; }\n.big-fish .qq-history-job[aria-pressed=true] { color: var(--fish-link); }\n.big-fish .qq-history-job:focus-visible { outline: 2px solid var(--fish-accent); outline-offset: 2px; }\n.big-fish .qq-history-job:disabled { cursor: default; }\n.big-fish .qq-history-detail { margin-top: 24px; }\n.big-fish .qq-history-export { padding: 0; border: 0; border-radius: 0; background: transparent; }\n.big-fish .qq-history-export summary { cursor: pointer; }\n@container (max-width: 620px) { .big-fish .qq-history-sources { grid-template-columns: minmax(0, 1fr); } }\n\n.big-fish .memory-embedding > p { margin: 0 0 24px; }\n.big-fish .memory-card-head > div:first-child { flex: 1; min-width: 0; }\n.big-fish .fish-page-head-copy { flex: 1; }\n\n/* 页首统一展示中英文菜单路径，窄屏自然换行。 */\n.big-fish .fish-breadcrumb { min-width: 0; }\n.big-fish .fish-breadcrumb-title { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px 14px; }\n.big-fish .fish-breadcrumb-separator { color: var(--fish-muted); font-size: .65em; font-weight: 400; }\n.big-fish .fish-breadcrumb-current { font-size: .75em; font-weight: 700; }\n.big-fish .memory-page-toolbar { justify-content: flex-end; }\n";
if (typeof document !== 'undefined' && document.body) { try {
// 大肥鱼心情 · 右下角挂饰（浏览器端，纯 DOM）
// 挂饰 = 整张形象图直接当按钮，可拖动（拖不出屏幕）；面板会按屏幕边自动适配
;(function () {
  'use strict'
  var version = 'charm-shared-theme-palette'
  if (window.__feiyuMoodVersion === version && document.querySelectorAll('.fm-widget').length) return
  if (window.__feiyuMoodDispose) window.__feiyuMoodDispose()
  document.querySelectorAll('.fm-widget').forEach(function (node) { node.remove() })
  document.head.querySelectorAll('style').forEach(function (node) {
    if (node.textContent.indexOf('.fm-widget{') >= 0) node.remove()
  })
  window.__feiyuMoodInited = true
  window.__feiyuMoodVersion = version
  var controller = new AbortController()
  function listen(target, name, callback, capture) {
    target.addEventListener(name, callback, { signal: controller.signal, capture: Boolean(capture) })
  }

  var B = '/dsh-feiyu-mood'
  var dimColor = {
    happy: 'var(--fm-green)', calm: 'var(--fm-blue)', sweet: 'var(--fm-pink)',
    heartache: 'var(--fm-amber)', worry: 'var(--fm-amber)', sad: 'var(--fm-blue)', jealous: 'var(--fm-purple)'
  }

  function face(v, faces) {
    var tier = v >= 80 ? 'great' : v >= 62 ? 'good' : v >= 42 ? 'ok' : v >= 25 ? 'worry' : 'sad'
    var labels = { great: '欢喜', good: '开心', ok: '一般', worry: '心疼', sad: '难过' }
    if (faces && faces[tier]) return { img: faces[tier].url, label: labels[tier] }
    if (v >= 80) return { img: B + '/face-great.png', label: '欢喜' }
    if (v >= 62) return { img: B + '/face-good.png', label: '开心' }
    if (v >= 42) return { img: B + '/face-ok.png', label: '一般' }
    if (v >= 25) return { img: B + '/face-worry.png', label: '心疼' }
    return { img: B + '/face-sad.png', label: '难过' }
  }

  var css = [
    ':host{all:initial;display:block}',
    FISH_PALETTE_CSS,
    // 尺寸由设置页调整，--fm-scale 保存当前倍数。
    ':host{position:fixed;right:18px;bottom:18px;z-index:99990;--fm-scale:1;',
    'width:calc(180px * var(--fm-scale));height:calc(180px * var(--fm-scale));',
    'cursor:grab;user-select:none;background:transparent;border:0;padding:0;-webkit-user-drag:none;',
    'transition:filter .15s}',
    ':host(:not(:popover-open)){display:none}:host::backdrop{background:transparent;pointer-events:none}',
    ':host .fm-trigger{width:100%;height:100%;min-width:0;min-height:0;display:block;appearance:none;border:0;padding:0;margin:0;background:transparent;box-shadow:none;cursor:grab;touch-action:none}',
    ':host .fm-trigger:hover{filter:brightness(1.04)}',
    ':host .fm-trigger:active{cursor:grabbing}',
    ':host .fm-trigger>img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}',
    // 面板：基础定位（JS positionPanel 会按屏幕边适配再调）
    ':host .fm-panel{position:absolute;box-sizing:border-box;left:0;width:352px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);',
    'overflow:auto;background:var(--fm-glass-highlight),rgba(var(--fm-glass-color),var(--fm-glass-alpha,.65));color:var(--fm-text);border:1px solid var(--fm-glass-edge);',
    'backdrop-filter:blur(24px) saturate(180%) brightness(1.08);-webkit-backdrop-filter:blur(24px) saturate(180%) brightness(1.08);',
    'border-radius:24px;box-shadow:var(--fm-glass-shadow);padding:16px;display:none;',
    'font-size:14px;line-height:1.7;cursor:auto;',
    'font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}',
    ':host .fm-panel img{pointer-events:none;-webkit-user-drag:none}',
    ':host .fm-head{display:flex;align-items:center;gap:12px;margin-bottom:4px}',
    ':host .fm-face{width:64px;height:64px;object-fit:contain;flex:none}',
    ':host .fm-big{font-size:22px;font-weight:600;line-height:1.4}',
    ':host .fm-reason{color:var(--fm-muted);margin:6px 0 10px;overflow-wrap:anywhere}',
    ':host .fm-dim{display:flex;align-items:center;gap:8px;margin:4px 0}',
    ':host .fm-dimlabel{width:34px;flex:none;color:var(--fm-muted)}',
    ':host .fm-bar{flex:1;height:7px;border-radius:4px;background:var(--fm-soft);overflow:hidden}',
    ':host .fm-bar i{display:block;height:100%}',
    ':host .fm-val{width:28px;text-align:right;color:var(--fm-muted);flex:none}',
    ':host .fm-title{margin:0 0 12px;font-size:16px;font-weight:650;color:var(--fm-text)}',
    ':host .fm-note{color:var(--fm-muted);font-size:12px;margin-top:8px;overflow-wrap:anywhere}',
    ':host .fm-memory{white-space:pre-wrap;overflow-wrap:anywhere;max-height:50vh;overflow:auto;user-select:text}',
    // 开销卡片沿用色库中的统计配色。
    ':host .fm-panel[data-content=cost]{font-family:"HarmonyOS Sans SC",-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}',
    ':host .rice-stat{display:grid;gap:5px;min-width:0;margin-top:12px;padding:16px;border:1px solid var(--fm-border);border-radius:22px;background:rgba(var(--fm-glass-color),calc(var(--fm-glass-alpha,.65) * .35));box-shadow:var(--fm-shadow)}',
    ':host .rice-stat-label{color:var(--fm-muted);font-size:12.5px}',
    ':host .rice-stat-value{font-family:inherit;font-size:26px;line-height:1.15;overflow-wrap:anywhere}',
    ':host .rice-stat-cost{color:var(--fm-green);font-family:inherit;font-size:15px;font-weight:600}',
    ':host .rice-stat-sub{color:var(--fm-muted);font-size:12px;overflow-wrap:anywhere}',
    '@media(prefers-reduced-motion:reduce){:host,:host *{transition:none!important}}:host .fm-trigger:focus-visible{outline:2px solid var(--fm-accent);outline-offset:3px}'
  ].join('')

  function el(tag, cls, text) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (text != null) n.textContent = text
    return n
  }
  function elImg(src, cls, alt) {
    var n = document.createElement('img')
    n.src = src
    n.className = cls
    n.alt = alt || ''
    n.draggable = false
    return n
  }

  var widget = el('div', 'fm-widget')
  widget.setAttribute('popover', 'manual')
  var root = widget.attachShadow({ mode: 'open' })
  // 构造样式表留在 Shadow DOM 中，避免依赖宿主中的 style 标签。
  var sheet = new CSSStyleSheet()
  sheet.replaceSync(css)
  root.adoptedStyleSheets = [sheet]
  function syncTheme() {
    widget.setAttribute('data-theme', document.body.hasAttribute('data-ds-dark-theme') ? 'dark' : 'light')
  }
  syncTheme()
  var themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
  // 基础布局内联，避免宿主清理 head 样式后原图进入页面排版。
  Object.assign(widget.style, {
    position: 'fixed', right: '18px', bottom: '18px', zIndex: '99990',
    width: 'calc(180px * var(--fm-scale, 1))', height: 'calc(180px * var(--fm-scale, 1))',
  })
  var bodyImg = elImg(B + '/feiyu.png', '', '形象')
  Object.assign(bodyImg.style, { width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' })
  var trigger = el('button', 'fm-trigger')
  trigger.type = 'button'
  Object.assign(trigger.style, { width: '100%', height: '100%', padding: '0', border: '0', background: 'transparent', display: 'block', touchAction: 'none' })
  trigger.appendChild(bodyImg)
  root.appendChild(trigger)
  trigger.title = '点击展开或关闭挂饰弹出卡片，按住拖动换位置'

  // ⭐ 2026-10-31：**外面这个小挂件跟着心情换形象**（五档，和面板里那张脸同一套阈值）
  //   1 大笑 / 2 微笑 / 3 普通（原图 feiyu.png）/ 4 嘟嘴 / 5 哭
  //   ⚠ 3 档仍然用 feiyu.png 那个路径，别改成 feiyu-ok.png —— 老图不动，免得缓存和备份对不上
  function bodyFor(v, images) {
    var tier = v >= 80 ? 'great' : v >= 62 ? 'good' : v >= 42 ? 'ok' : v >= 25 ? 'worry' : 'sad'
    var defaults = { great: 'feiyu-great.png', good: 'feiyu-good.png', ok: 'feiyu.png', worry: 'feiyu-worry.png', sad: 'feiyu-sad.png' }
    return images && images[tier] ? images[tier].url : B + '/' + defaults[tier]
  }
  var 当前形象 = B + '/feiyu.png'
  function 换形象(v, images) {
    if (v == null || v === '') return
    var src = bodyFor(Number(v), images)
    if (src === 当前形象) return
    当前形象 = src
    bodyImg.src = src
  }
  // 五张先各自拉一遍，换档的时候不会空一下（本地端口，几十毫秒）
  ;[B + '/feiyu-great.png', B + '/feiyu-good.png', B + '/feiyu.png', B + '/feiyu-worry.png', B + '/feiyu-sad.png']
    .forEach(function (u) { var i = new Image(); i.src = u })

  try { 设缩放(取缩放()) } catch (e) {}
  setTransparency(readTransparency())

  var panel = el('div', 'fm-panel')
  panel.id = 'fish-mood-value-panel'
  Object.assign(panel.style, { display: 'none', position: 'absolute', overflow: 'auto', boxSizing: 'border-box' })
  root.appendChild(panel)
  panel.setAttribute('role', 'region')
  panel.setAttribute('aria-label', '挂饰弹出卡片')
  trigger.setAttribute('aria-controls', panel.id)
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-label', '展开挂饰弹出卡片')

  var open = false
  var data = null
  var panelMode = readPanelMode()
  var memorySelection = null
  var requestVersion = 0

  // 以挂饰为锚点定位，空间不足时夹入视口并允许卡片内部滚动。
  function positionPanel() {
    if (!open) return
    var rect = widget.getBoundingClientRect()
    var margin = 8
    var winW = window.innerWidth
    var winH = window.innerHeight
    panel.style.width = Math.min(352, Math.max(0, winW - 2 * margin)) + 'px'
    panel.style.maxHeight = Math.max(0, winH - 2 * margin) + 'px'
    var above = Math.max(0, rect.top - margin - 10)
    var below = Math.max(0, winH - rect.bottom - margin - 10)
    var useAbove = panel.offsetHeight <= above || above >= below
    panel.style.maxHeight = (useAbove ? above : below) + 'px'
    var pw = panel.offsetWidth
    var ph = panel.offsetHeight
    var left = Math.max(margin, Math.min(winW - pw - margin, rect.left + (rect.width - pw) / 2))
    var top = useAbove ? rect.top - ph - 10 : rect.bottom + 10
    top = Math.max(margin, Math.min(winH - ph - margin, top))
    panel.style.left = (left - rect.left) + 'px'
    panel.style.top = (top - rect.top) + 'px'
    panel.style.bottom = 'auto'
  }

  function readTransparency() {
    var stored
    try { stored = localStorage.getItem('fm-widget-transparency') } catch (e) {}
    var value = stored == null ? 35 : Number(stored)
    return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 35
  }
  function setTransparency(value) {
    var next = Number(value)
    next = Number.isFinite(next) ? Math.min(100, Math.max(0, next)) : 35
    widget.style.setProperty('--fm-glass-alpha', String((100 - next) / 100))
  }

  function readPanelMode() {
    var value
    try { value = localStorage.getItem('fm-widget-panel') } catch (e) {}
    return ['mood', 'cost', 'memory'].includes(value) ? value : 'mood'
  }

  function panelTitle() {
    return { mood: '今日心情', cost: '今日开销', memory: '随机记忆' }[panelMode]
  }

  function renderNotice(message) {
    panel.setAttribute('data-content', panelMode)
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', panelTitle()))
    panel.appendChild(el('div', 'fm-reason', message))
    positionPanel()
  }

  function renderMain(d) {
    var f = face(d.mood, d.charmFaces)
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', '今日心情'))
    if (d.label) panel.appendChild(el('div', 'fm-note', d.label))
    var head = el('div', 'fm-head')
    head.appendChild(elImg(f.img, 'fm-face', f.label))
    var htxt = el('div')
    htxt.appendChild(el('div', 'fm-big', (d.mood == null ? '--' : d.mood) + '  ' + f.label))
    var midnight = new Date()
    midnight.setHours(0, 0, 0, 0)
    var today = (d.timeline || []).filter(function (entry) { return new Date(entry.at).getTime() >= midnight.getTime() })
    htxt.appendChild(el('div', 'fm-reason', today.length ? d.lastReason || '今日已有心情变化。' : '今日暂无心情变化记录。'))
    head.appendChild(htxt)
    panel.appendChild(head)

    ;(d.dims || []).forEach(function (x) {
      var row = el('div', 'fm-dim')
      row.appendChild(el('span', 'fm-dimlabel', x.label))
      var bar = el('div', 'fm-bar')
      var fill = el('i')
      fill.style.width = (x.value || 0) + '%'
      fill.style.background = dimColor[x.key] || 'var(--fm-muted)'
      bar.appendChild(fill)
      row.appendChild(bar)
      row.appendChild(el('span', 'fm-val', String(x.value || 0)))
      panel.appendChild(row)
    })

    positionPanel()
  }

  function renderCost(report) {
    if (!Array.isArray(report.days) || !report.今天) throw new Error('用量数据格式不完整')
    var day = report.days.find(function (row) { return row.date === report.今天 }) || {}
    var formatTokens = function (value) {
      var number = Math.max(0, Number(value) || 0)
      if (number >= 1e6) return (number / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'
      if (number >= 1e3) return (number / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K'
      return Math.round(number).toLocaleString('zh-CN')
    }
    var cost = Math.max(0, Number(day.cost) || 0)
    var money = '¥' + (cost >= 100 ? cost.toFixed(2) : cost >= 1 ? cost.toFixed(3) : cost.toFixed(4))
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', '今日开销'))
    panel.appendChild(el('div', 'fm-note', report.今天 + ' · 北京时间 · 工作区估算'))
    var card = el('article', 'rice-stat')
    card.appendChild(el('span', 'rice-stat-label', '今天'))
    card.appendChild(el('strong', 'rice-stat-value', formatTokens(day.total)))
    card.appendChild(el('span', 'rice-stat-cost', '≈ ' + money))
    card.appendChild(el('span', 'rice-stat-sub', '输入 ' + formatTokens(day.input) + ' · 输出 ' + formatTokens(day.output)))
    card.appendChild(el('span', 'rice-stat-sub', '缓存 ' + formatTokens((day.cacheRead || 0) + (day.cacheWrite || 0)) + ' · RAG ' + formatTokens(day.ragTokens)))
    card.appendChild(el('span', 'rice-stat-sub', 'RAG 调用 ' + formatTokens(day.ragCalls) + ' 次'))
    panel.appendChild(card)
    if (day.ragUnpriced || day.ragUnknownTokens) panel.appendChild(el('div', 'fm-note', '部分 RAG 用量缺少定价或 Token，估算金额尚未计全。'))
    positionPanel()
  }

  function selectMemory(list, mood) {
    var slot = (mood.slots || []).find(function (item) { return item.id === mood.key })
    var sessions = new Set((slot && slot.sessions || []).concat(mood.key))
    var seen = new Set()
    var choices = []
    ;(list.sessions || []).forEach(function (library) {
      if (!sessions.has(library.id) && library.storeId !== mood.key) return
      ;(library.memories || []).forEach(function (memory, index) {
        var key = (library.storeId || library.id) + ':' + (memory.id || index)
        if (seen.has(key) || memory.已被取代 || !String(memory.text || '').trim()) return
        seen.add(key)
        choices.push({ text: memory.text, at: memory.at, title: slot && slot.label || library.title || '' })
      })
    })
    return choices.length ? choices[Math.floor(Math.random() * choices.length)] : null
  }

  function renderMemory(memory) {
    panel.innerHTML = ''
    panel.appendChild(el('div', 'fm-title', '随机记忆'))
    panel.appendChild(el('div', 'fm-memory', memory ? memory.text : '当前心情绑定范围暂无可展示记忆。'))
    if (memory) {
      panel.appendChild(el('div', 'fm-note', memory.title))
      if (memory.at) panel.appendChild(el('div', 'fm-note', memory.at))
    }
    positionPanel()
  }

  async function readJson(url) {
    var response = await fetch(url, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error('HTTP ' + response.status)
    var result = await response.json()
    if (result.ok === false) throw new Error(result.error || '读取失败')
    return result
  }

  async function load() {
    var current = ++requestVersion
    try {
      var next = await readJson(B + '/state')
      if (current !== requestVersion || controller.signal.aborted) return
      data = next
      换形象(next.mood, next.charmImages)
      if (!open) return
      if (panelMode === 'mood') return renderMain(next)
      if (panelMode === 'cost') {
        var report = await readJson('/dsh-qq-bridge/rice')
        if (current === requestVersion && !controller.signal.aborted) renderCost(report)
        return
      }
      if (!memorySelection || memorySelection.key !== next.key) {
        var list = await readJson('/dsh-fish-memory/list')
        if (current !== requestVersion || controller.signal.aborted) return
        memorySelection = { key: next.key, value: selectMemory(list, next) }
      }
      renderMemory(memorySelection.value)
    } catch (error) {
      if (open && current === requestVersion && !controller.signal.aborted) renderNotice('读取失败，点击挂饰关闭后可重新打开。')
    }
  }

  function toggle() {
    open = !open
    requestVersion++
    panel.style.display = open ? 'block' : 'none'
    trigger.setAttribute('aria-label', open ? '关闭挂饰弹出卡片' : '展开挂饰弹出卡片')
    trigger.setAttribute('aria-expanded', String(open))
    if (open) {
      memorySelection = null
      renderNotice('正在读取…')
      load()
    }
  }

  // 使用原生点击控制卡片，指针捕获仅负责拖动和屏蔽拖动后的 click。
  var pointer = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false, dragged = false
  listen(trigger, 'click', function (event) {
    event.stopPropagation()
    var wasDragged = moved
    moved = false
    if (wasDragged && event.detail !== 0) return
    toggle()
  })
  listen(trigger, 'pointerdown', function (event) {
    if (event.button !== 0 || pointer !== null) return
    pointer = event.pointerId
    sx = event.clientX; sy = event.clientY
    var rect = widget.getBoundingClientRect()
    ox = rect.left; oy = rect.top
    moved = false
    trigger.setPointerCapture(event.pointerId)
  })
  listen(trigger, 'pointermove', function (event) {
    if (pointer === null || event.pointerId !== pointer) return
    var dx = event.clientX - sx, dy = event.clientY - sy
    if (!moved && Math.abs(dx) <= 4 && Math.abs(dy) <= 4) return
    moved = true
    dragged = true
    var maxX = Math.max(0, window.innerWidth - widget.offsetWidth)
    var maxY = Math.max(0, window.innerHeight - widget.offsetHeight)
    widget.style.left = Math.min(maxX, Math.max(0, ox + dx)) + 'px'
    widget.style.top = Math.min(maxY, Math.max(0, oy + dy)) + 'px'
    widget.style.right = 'auto'
    widget.style.bottom = 'auto'
    positionPanel()
  })
  listen(trigger, 'pointerup', function (event) {
    if (event.pointerId !== pointer) return
    pointer = null
    if (moved) 存位置()
  })
  listen(trigger, 'pointercancel', function () { pointer = null; moved = true })
  listen(trigger, 'lostpointercapture', function () { pointer = null })

  // ⭐ 0.8.0：挂饰自己能多大（0.6 ~ 1.6 倍），记在浏览器本地
  function 取缩放() {
    var v = 1
    try { v = Number(localStorage.getItem('fm-widget-scale')) || 1 } catch (e) {}
    return Math.min(1.6, Math.max(0.6, v))
  }
  function 设缩放(v) {
    var s = Math.min(1.6, Math.max(0.6, Number(v) || 1))
    try { widget.style.setProperty('--fm-scale', String(s)) } catch (e) {}
    保持屏内()
  }

  // 调整尺寸后限制挂饰位置。
  function 保持屏内() {
    var rect = widget.getBoundingClientRect()
    var maxX = Math.max(0, window.innerWidth - widget.offsetWidth)
    var maxY = Math.max(0, window.innerHeight - widget.offsetHeight)
    if (dragged) {
      widget.style.left = Math.min(maxX, Math.max(0, rect.left)) + 'px'
      widget.style.top = Math.min(maxY, Math.max(0, rect.top)) + 'px'
      widget.style.right = 'auto'
      widget.style.bottom = 'auto'
      存位置()
    }
  }

  // ⭐ 0.8.2：拖过的位置要记住。
  //   · 只存**左上角坐标**（left/top）：挂饰能拖到屏幕中间，这时候 right/bottom 已经没意义了，
  //     统一成一套坐标，逻辑只剩一条。
  //   · 读回来先**夹进当前窗口**：窗口可能变小、屏幕可能换；而且收起态是 64px、
  //     大图还能放到 1.6 倍（288px），同一个坐标在不同形态下合法范围不一样。
  //     所以形态/尺寸一变就重新夹一次（下面 保持屏内() 已经在做）。
  //   · 没拖过的人**完全不写 inline 的 left/top**，CSS 的默认角落继续生效。
  var 存位置计时 = 0
  function 存位置() {
    if (!dragged) return
    // 拖动时每帧都写 localStorage 太浪费，攒到停手再写
    if (存位置计时) return
    存位置计时 = setTimeout(function () {
      存位置计时 = 0
      try {
        var r = widget.getBoundingClientRect()
        localStorage.setItem('fm-widget-pos', JSON.stringify({
          x: Math.round(r.left), y: Math.round(r.top),
        }))
      } catch (e) {}
    }, 200)
  }

  function 读位置() {
    var v = null
    try { v = JSON.parse(localStorage.getItem('fm-widget-pos') || 'null') } catch (e) { v = null }
    if (!v || typeof v !== 'object') return null
    var x = Number(v.x), y = Number(v.y)
    if (!isFinite(x) || !isFinite(y)) return null // 脏数据当没存过，别让挂饰消失
    return { x: x, y: y }
  }

  function 恢复位置() {
    var p = 读位置()
    if (!p) return
    dragged = true
    var maxX = Math.max(0, window.innerWidth - widget.offsetWidth)
    var maxY = Math.max(0, window.innerHeight - widget.offsetHeight)
    widget.style.left = Math.min(maxX, Math.max(0, p.x)) + 'px'
    widget.style.top = Math.min(maxY, Math.max(0, p.y)) + 'px'
    widget.style.right = 'auto'
    widget.style.bottom = 'auto'
  }

  // 顶层浮层按打开顺序叠放，挂饰移入当前模态框以保持可交互。
  function syncLayer(raise) {
    var modal = document.activeElement?.closest('dialog:modal') || Array.from(document.querySelectorAll('dialog:modal')).at(-1)
    var target = modal || document.body
    if (widget.parentNode !== target || raise) widget.hidePopover?.()
    if (widget.parentNode !== target) target.appendChild(widget)
    if (!widget.matches(':popover-open')) widget.showPopover?.()
  }
  document.body.appendChild(widget)
  syncLayer()
  var layerObserver = new MutationObserver(function () { syncLayer() })
  layerObserver.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
  listen(document, 'toggle', function (event) {
    if (event.target !== widget && event.newState === 'open') syncLayer(true)
  }, true)
  恢复位置()      // ⭐ 0.8.2：上次拖到哪儿就放哪儿（没拖过的照旧走 CSS 的默认角落）
  保持屏内()      // 形态定下来之后再夹一次（收起态 64px、大图能到 288px，合法范围不一样）
  load()

  // ⭐ 0.7.6（收起态那个数字以前不刷新，得点一下才变）：
  //   以前只有「点开面板」才 load() 一次，收起来的时候就再也不拉了 —— 数字一直是旧的。
  //   现在收起态也每 20 秒拉一次（就一个 GET，不花 token）；页面重新可见时也补一次。
  var pollTimer = setInterval(load, 20000)
  listen(window, 'fish-charm-updated', function (event) {
    if (!data) return load()
    data.charmImages = event.detail.images
    data.charmFaces = event.detail.faces
    换形象(data.mood, data.charmImages)
    if (open && panelMode === 'mood') renderMain(data)
  })
  listen(window, 'fish-charm-scale', function (event) {
    设缩放(event.detail)
    if (open) positionPanel()
  })
  listen(window, 'fish-charm-transparency', function (event) { setTransparency(event.detail) })
  function changePanelMode(event) {
    panelMode = event && ['mood', 'cost', 'memory'].includes(event.detail) ? event.detail : readPanelMode()
    memorySelection = null
    requestVersion++
    if (open) { renderNotice('正在读取…'); load() }
  }
  listen(window, 'fish-charm-panel', changePanelMode)
  listen(window, 'storage', function (event) {
    if (event.key === 'fm-widget-transparency') setTransparency(readTransparency())
    if (event.key === 'fm-widget-panel') changePanelMode()
    if (event.key === 'fish-charm-update') load()
    if (event.key === 'fm-widget-scale') {
      设缩放(取缩放())
      if (open) positionPanel()
    }
  })
  listen(document, 'visibilitychange', function () {
    if (!document.hidden) load()
  })

  // 窗口缩放时，把挂饰拉回屏幕内（拖过才管；没拖的 right/bottom 定位会自然跟随）
  listen(window, 'resize', function () {
    if (!dragged) { positionPanel(); return }
    var rect = widget.getBoundingClientRect()
    var maxX = window.innerWidth - widget.offsetWidth
    var maxY = window.innerHeight - widget.offsetHeight
    var x = Math.min(maxX < 0 ? 0 : maxX, Math.max(0, rect.left))
    var y = Math.min(maxY < 0 ? 0 : maxY, Math.max(0, rect.top))
    widget.style.left = x + 'px'
    widget.style.top = y + 'px'
    widget.style.right = 'auto'
    widget.style.bottom = 'auto'
    存位置()
    if (open) positionPanel()
  })
  window.__feiyuMoodDispose = function () {
    controller.abort()
    clearInterval(pollTimer)
    clearTimeout(存位置计时)
    widget.remove()
    themeObserver.disconnect()
    layerObserver.disconnect()
  }
})()

} catch (error) { delete window.__feiyuMoodVersion; console.warn('[大肥鱼] 挂饰初始化失败', error) } }
const BIGFISH_IMAGES = ["/dsh-big-fish-aio/bigfish/sticker-book.png","/dsh-big-fish-aio/bigfish/sticker-chat.png","/dsh-big-fish-aio/bigfish/sticker-gift.png","/dsh-big-fish-aio/bigfish/sticker-heart.png","/dsh-big-fish-aio/bigfish/sticker-read.png","/dsh-big-fish-aio/bigfish/sticker-update-failure.png","/dsh-big-fish-aio/bigfish/sticker-update-success.png","/dsh-big-fish-aio/bigfish/sticker-update.png","/dsh-big-fish-aio/bigfish/sticker-wave.png","/dsh-big-fish-aio/bigfish/sticker-welcome.png"];
const components = {};
const moduleLoader = { load({id, factory}) { components[id] = factory(require) } };
function FishStickers({ notify, mode = 'full', onOpenFiles }) {
  const React = require('react'), h = React.createElement
  const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
  const [data, setData] = React.useState(null), [busy, setBusy] = React.useState(false), [error, setError] = React.useState('')
  const [query, setQuery] = React.useState(''), [category, setCategory] = React.useState('')
  const fileRef = React.useRef(null), batchRef = React.useRef(null), tagList = React.useId()
  const [file, setFile] = React.useState(null), [tags, setTags] = React.useState(''), [importStatus, setImportStatus] = React.useState('')
  const [libraryOpen, setLibraryOpen] = React.useState(false), [selected, setSelected] = React.useState(null)
  const base = '/dsh-qq-bridge/stickers'
  const load = async (path = '', body) => {
    const response = await fetch(base + path, { cache: 'no-store', ...(body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) })
    const result = await response.json()
    if (!response.ok || !result.ok) throw new Error(result.说 || result.error || '表情库请求失败')
    setData(result); return result
  }
  React.useEffect(() => {
    load().catch(e => setError(e.message))
  }, [])
  React.useEffect(() => {
    if (!data?.settings.autoCollect && !data?.tagging?.pending) return
    const timer = setInterval(() => load().catch(e => setError(e.message)), 5000)
    return () => clearInterval(timer)
  }, [data?.settings.autoCollect, data?.tagging?.pending])
  const act = async (path, body) => {
    setBusy(true); setError('')
    try { await load(path, body); notify?.('表情库已更新', { tone: 'success' }); return true }
    catch (e) { setError(e.message); return false } finally { setBusy(false) }
  }
  const uploadFiles = async (files, batch = false) => {
    if (!files.length) return
    if (files.length > 500) { setError('一次最多选择 500 张表情'); return }
    setBusy(true); setError(''); let done = 0; const failed = []
    try {
      for (const [index, image] of files.entries()) {
        setImportStatus('正在导入 ' + (index + 1) + ' / ' + files.length + '…')
        try {
          if (!image.size || image.size > 8 * 1048576) throw new Error('单张图片须为 1 字节～8 MB')
          const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = () => reject(new Error('读取图片失败')); reader.readAsDataURL(image) })
          await load('/import', { base64, tags: batch ? '' : tags, scope: '' }); done++
        } catch (e) { failed.push(image.name + '：' + e.message) }
      }
      setImportStatus('导入完成：' + done + ' / ' + files.length + ' 张已入库，正在排队识别、命名和分类。' + (failed.length ? '失败 ' + failed.length + ' 张。' : ''))
      if (failed.length) setError(failed.join('\n'))
      if (!batch && done) { setFile(null); setTags(''); if (fileRef.current) fileRef.current.value = '' }
      if (done) notify?.('表情已入库，正在排队处理', { tone: 'success' })
    } finally { setBusy(false); if (batchRef.current) batchRef.current.value = '' }
  }
  const openFolder = async () => {
    setBusy(true); setError('')
    try {
      const response = await fetch('/dsh-qq-bridge/open-folder', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: 'stickers' }) })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.ok) throw new Error(result?.说 || '打开文件夹失败')
      notify?.('已打开本地文件夹', { tone: 'success' })
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const sw = (key, label, note) => h('div', { className: 'fish-form-row' }, h('div', { className: 'fish-form-label' }, label), h('div', { className: 'fish-control' },
    h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': label, checked: !!data.settings[key], disabled: busy, onChange: async e => { const value = e.target.checked, previous = data.settings[key]; setData(old => ({ ...old, settings: { ...old.settings, [key]: value } })); if (!await act('/settings', { [key]: value })) setData(old => ({ ...old, settings: { ...old.settings, [key]: previous } })) } }), h('p', { className: 'fish-muted' }, note)))
  const tagGroups = fishStickerTagGroups(data?.items || [])
  const activeTag = tagGroups.some(x => x.id === category) ? category : 'all'
  const filtered = (data?.items || []).filter(x => fishStickerInTag(x, activeTag) && [x.name,...x.tags,...x.scenes].join(' ').toLowerCase().includes(query.toLowerCase()))
  const preview = data?.items.find(x => x.id === selected)
  React.useEffect(() => { if (selected && !preview) setSelected(null) }, [selected, Boolean(preview)])
  if (!data) return h('p', { role: 'status' }, error || '正在读取表情库…')
  const 存储提示 = data.storage?.path ? '素材原图目录：' + data.storage.path : (data.storage?.error && !/工作区/.test(data.storage.error) ? data.storage.error : '素材原图目录暂不可用。')
  const tagPrefix = tags.match(/^.*[,，、;；]/)?.[0] || ''
  const 自动化卡 = h('section', { className: 'fish-card' }, h('h2', null, '表情包自动化'),
    sw('autoSend', '根据语境自动发送表情', '默认开启。每轮最多附加一张表情，已有图片时不追加。使用会话模型选择素材并消耗额度，无匹配或判断失败时不发送。遵守 QQ 试运行与收发开关，素材跨聊天共享。'),
    sw('autoCollect', '自动收藏收到的表情', '默认开启。自动收藏已启用映射中的 QQ 大表情、表情图片及 GIF，无需模型回复。按来源和内容去重，跨聊天共享，不扫描历史消息。'),
    sw('collectGroupStickers', '同时收藏群聊表情', '默认开启。需启用自动收藏，收藏绑定群成员的表情，无需 @；关闭后仅收藏私聊表情，已有素材仍共享。'),
    sw('collectAllImages', '同时收藏普通图片', '默认关闭，仅影响自动收藏。'),
    sw('autoTag', '自动给新表情打标签', '默认开启。自动收藏、手动导入和扫描均使用当前 DeepSeek 模型标注并消耗额度，保留手动标签。'),
    sw('autoClassify', '自动分类表情包', '默认开启。按视觉结果、标签与场景分类，保留手动分类。导入或扫描完成后自动执行。'),
    data.collection?.error ? h('p', { role: 'status', className: 'fish-message' }, data.collection.error) : null,
    h('label', null, '自动发送冷却（秒） ', h('input', { type: 'number', min: 10, max: 86400, 'aria-label': '自动发送冷却', defaultValue: data.settings.cooldownSeconds, disabled: busy, onBlur: e => act('/settings', { cooldownSeconds: Number(e.target.value) }) })),
    h('p', { className: 'fish-muted', role: data.storage?.error && !/工作区/.test(data.storage.error) ? 'status' : undefined }, 存储提示))

  const 素材库按钮 = h('button', { type: 'button', className: 'fish-button fish-primary', onClick: () => {
    if (typeof onOpenFiles === 'function') { onOpenFiles(); return }
    setLibraryOpen(true); load().catch(e => setError(e.message))
  } }, '打开表情包素材库')
  const 素材库弹窗 = h(FishStickerDialog, { open: libraryOpen, onClose: () => { setLibraryOpen(false); setSelected(null) }, title: '表情包素材库' },
    h('div', { className: 'fish-actions' },
      h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !!data.tagging?.pending || !data.items.some(x => !x.tags.length), onClick: () => act('/tag', { onlyUntagged: true }) }, '扫描并识别未分类表情包'),
      h(FishRefreshButton, { busy, onClick: () => load().catch(e => setError(e.message)), label: '刷新素材库' })),
    h('p', { className: 'fish-muted', role: 'status' }, data.tagging?.pending ? '正在处理 ' + data.tagging.pending + ' 张表情，可关闭窗口，任务继续运行。' : '扫描未分类素材，优先复用已有分类，识别原图格式并重命名文件；直接调用 DeepSeek，会产生模型用量。'),
    h('label', null, '搜索名称、标签和场景 ', h('input', { value: query, onChange: e => setQuery(e.target.value), 'aria-label': '搜索表情' })),
    h('div', { className: 'fish-actions fish-sticker-tags', role: 'group', 'aria-label': '表情标签筛选' }, ...tagGroups.map(tag => h('button', { type: 'button', key: tag.id, className: 'fish-button' + (activeTag === tag.id ? ' fish-primary' : ''), 'aria-pressed': activeTag === tag.id, onClick: () => setCategory(tag.id) }, tag.name + '（' + tag.count + '）'))),
    h('div', { className: 'fish-sticker-grid' }, ...filtered.map(item => h('article', { className: 'fish-sticker-tile', key: item.id },
      h('button', { className: 'fish-sticker-thumb', type: 'button', 'aria-label': '预览 ' + item.name, onClick: () => setSelected(item.id) }, h('img', { src: item.url, alt: '', loading: 'lazy', width: 144, height: 120 })),
      h('h3', null, item.name), h('p', { className: 'fish-muted' }, item.tags.length ? item.tags.join(' · ') : '未分类')))),
    filtered.length ? null : h('p', { className: 'fish-muted' }, data.items.length ? '无匹配表情。' : '素材库为空，可关闭窗口后导入表情包。'),
    error ? h('p', { className: 'fish-message', role: 'alert' }, error) : null)
  const 预览弹窗 = h(FishStickerDialog, { open: Boolean(preview) && libraryOpen, onClose: () => setSelected(null), title: '表情预览与编辑' },
    preview ? h(FishStickerCard, { key: preview.id, item: preview, busy, act, categories: data.categories }) : null,
    error ? h('p', { className: 'fish-message', role: 'alert' }, error) : null)

  if (mode === 'settings') {
    return h('div', { className: 'fish-settings-stack fish-stickers' },
      h('style', null, FISH_STICKER_CSS),
      自动化卡,
      素材库按钮,
      素材库弹窗,
      预览弹窗,
      !libraryOpen && error ? h('p', { className: 'fish-message', role: 'alert', style: { whiteSpace: 'pre-wrap' } }, error) : null)
  }

  if (mode === 'files') {
    return h('div', { className: 'fish-settings-stack fish-stickers' },
      h('style', null, FISH_STICKER_CSS),
      h('section', { id: 'fish-sticker-files-card', className: 'fish-card fish-sticker-files' },
        h('h2', null, '表情包'),
        h('p', { className: 'fish-muted', role: data.storage?.error && !/工作区/.test(data.storage.error) ? 'status' : undefined }, 存储提示),
        h('input', { ref: fileRef, type: 'file', accept: '.png,.jpg,.jpeg,.gif,.webp', hidden: true, style: { display: 'none' }, 'aria-label': '单张表情文件', onChange: e => { const f = e.target.files?.[0]; if (f) uploadFiles([f], false) } }),
        h('input', { ref: batchRef, type: 'file', multiple: true, accept: '.png,.jpg,.jpeg,.gif,.webp', hidden: true, style: { display: 'none' }, 'aria-label': '批量表情文件', onChange: e => uploadFiles(Array.from(e.target.files || []), true) }),
        h('div', { className: 'fish-actions' },
          h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: openFolder }, '打开本地文件夹'),
          h('button', { type: 'button', className: 'fish-button', onClick: () => { setLibraryOpen(true); load().catch(e => setError(e.message)) } }, '管理素材库（' + data.items.length + '）'),
          h('button', { type: 'button', className: 'fish-button', disabled: busy || !!data.storage?.error, onClick: () => fileRef.current?.click() }, '单张导入'),
          h('button', { type: 'button', className: 'fish-button', disabled: busy || !!data.storage?.error, onClick: () => batchRef.current?.click() }, '批量导入')),
        h('p', { className: 'fish-muted' }, '单张 / 批量导入会直接调用当前 DeepSeek 模型进行识别、命名和分类。'),
        importStatus ? h('p', { role: 'status', className: 'fish-muted' }, importStatus) : null,
        data.tagging?.pending ? h('p', { role: 'status', className: 'fish-muted' }, '正在识别 ' + data.tagging.pending + ' 张表情，处理完成后可在素材库中查看。') : null,
        !libraryOpen && error ? h('p', { className: 'fish-message', role: 'alert', style: { whiteSpace: 'pre-wrap' } }, error) : null),
      素材库弹窗,
      预览弹窗)
  }

  return h('div', { className: 'fish-settings-stack fish-stickers' },
    h('style', null, FISH_STICKER_CSS),
    h('section', { className: 'fish-card' }, h('h2', null, '表情包自动化'),
      sw('autoSend', '根据语境自动发送表情', '默认开启。每轮最多附加一张表情，已有图片时不追加。使用会话模型选择素材并消耗额度，无匹配或判断失败时不发送。遵守 QQ 试运行与收发开关，素材跨聊天共享。'),
      sw('autoCollect', '自动收藏收到的表情', '默认开启。自动收藏已启用映射中的 QQ 大表情、表情图片及 GIF，无需模型回复。按来源和内容去重，跨聊天共享，不扫描历史消息。'),
      sw('collectGroupStickers', '同时收藏群聊表情', '默认开启。需启用自动收藏，收藏绑定群成员的表情，无需 @；关闭后仅收藏私聊表情，已有素材仍共享。'),
      sw('collectAllImages', '同时收藏普通图片', '默认关闭，仅影响自动收藏。'),
      sw('autoTag', '自动给新表情打标签', '默认开启。自动收藏、手动导入和扫描均使用当前 DeepSeek 模型标注并消耗额度，保留手动标签。'),
      sw('autoClassify', '自动分类表情包', '默认开启。按视觉结果、标签与场景分类，保留手动分类。导入或扫描完成后自动执行。'),
      data.collection?.error ? h('p', { role: 'status', className: 'fish-message' }, data.collection.error) : null,
      h('label', null, '自动发送冷却（秒） ', h('input', { type: 'number', min: 10, max: 86400, 'aria-label': '自动发送冷却', defaultValue: data.settings.cooldownSeconds, disabled: busy, onBlur: e => act('/settings', { cooldownSeconds: Number(e.target.value) }) })),
      h('p', { className: 'fish-muted', role: data.storage?.error && !/工作区/.test(data.storage.error) ? 'status' : undefined }, 存储提示)),
    h('button', { type: 'button', className: 'fish-button fish-primary', onClick: () => { setLibraryOpen(true); load().catch(e => setError(e.message)) } }, '打开表情包素材库（' + data.items.length + '）'),
    h('section', { className: 'fish-card fish-sticker-import' }, h('h2', null, '单张导入'),
      h('label', null, '图片文件 ', h('input', { ref: fileRef, type: 'file', accept: '.png,.jpg,.jpeg,.gif,.webp', disabled: busy, onChange: e => setFile(e.target.files?.[0] || null) })),
      h('label', null, '标签 ', h('input', { 'aria-label': '导入标签', value: tags, list: tagList, placeholder: '选择已有标签或输入新标签，多个用逗号分隔', disabled: busy, onChange: e => setTags(e.target.value) })),
      h('datalist', { id: tagList }, ...tagGroups.filter(t => t.id.startsWith('tag:')).map(t => h('option', { key: t.id, value: tagPrefix + t.id.slice(4) }))),
      h('p', { className: 'fish-muted' }, '支持 PNG、JPEG、GIF、WebP，单张最多 8 MB。标签留空则自动识别；DeepSeek 自动生成“标签-图片描述”短名称、使用场景和分类。'),
      h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !file || !!data.storage?.error, onClick: () => uploadFiles([file]) }, '导入单张表情')),
    h('section', { className: 'fish-card' }, h('h2', null, '批量导入'),
      h('input', { ref: batchRef, type: 'file', multiple: true, accept: '.png,.jpg,.jpeg,.gif,.webp', hidden: true, style: { display: 'none' }, 'aria-label': '批量表情文件', onChange: e => uploadFiles(Array.from(e.target.files || []), true) }),
      h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !!data.storage?.error, onClick: () => batchRef.current?.click() }, '批量导入表情包')),
    importStatus ? h('p', { role: 'status', className: 'fish-muted' }, importStatus) : null,
    data.tagging?.pending ? h('p', { role: 'status', className: 'fish-muted' }, '正在识别 ' + data.tagging.pending + ' 张表情，处理完成后可在素材库中查看。') : null,
    h(FishStickerDialog, { open: libraryOpen, onClose: () => { setLibraryOpen(false); setSelected(null) }, title: '表情包素材库' },
      h('div', { className: 'fish-actions' },
        h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !!data.tagging?.pending || !data.items.some(x => !x.tags.length), onClick: () => act('/tag', { onlyUntagged: true }) }, '扫描并识别未分类表情包'),
        h(FishRefreshButton, { busy, onClick: () => load().catch(e => setError(e.message)), label: '刷新素材库' })),
      h('p', { className: 'fish-muted', role: 'status' }, data.tagging?.pending ? '正在处理 ' + data.tagging.pending + ' 张表情，可关闭窗口，任务继续运行。' : '扫描未分类素材，优先复用已有分类，识别原图格式并重命名文件；直接调用 DeepSeek，会产生模型用量。'),
      h('label', null, '搜索名称、标签和场景 ', h('input', { value: query, onChange: e => setQuery(e.target.value), 'aria-label': '搜索表情' })),
      h('div', { className: 'fish-actions fish-sticker-tags', role: 'group', 'aria-label': '表情标签筛选' }, ...tagGroups.map(tag => h('button', { type: 'button', key: tag.id, className: 'fish-button' + (activeTag === tag.id ? ' fish-primary' : ''), 'aria-pressed': activeTag === tag.id, onClick: () => setCategory(tag.id) }, tag.name + '（' + tag.count + '）'))),
      h('div', { className: 'fish-sticker-grid' }, ...filtered.map(item => h('article', { className: 'fish-sticker-tile', key: item.id },
        h('button', { className: 'fish-sticker-thumb', type: 'button', 'aria-label': '预览 ' + item.name, onClick: () => setSelected(item.id) }, h('img', { src: item.url, alt: '', loading: 'lazy', width: 144, height: 120 })),
        h('h3', null, item.name), h('p', { className: 'fish-muted' }, item.tags.length ? item.tags.join(' · ') : '未分类')))),
      filtered.length ? null : h('p', { className: 'fish-muted' }, data.items.length ? '无匹配表情。' : '素材库为空，可关闭窗口后导入表情包。'),
      error ? h('p', { className: 'fish-message', role: 'alert' }, error) : null),
    h(FishStickerDialog, { open: Boolean(preview) && libraryOpen, onClose: () => setSelected(null), title: '表情预览与编辑' },
      preview ? h(FishStickerCard, { key: preview.id, item: preview, busy, act, categories: data.categories }) : null,
      error ? h('p', { className: 'fish-message', role: 'alert' }, error) : null),
    !libraryOpen && error ? h('p', { className: 'fish-message', role: 'alert', style: { whiteSpace: 'pre-wrap' } }, error) : null)
}

function fishStickerInTag(item, tag) {
  return tag === 'all' || (tag === 'untagged' ? !item.tags.length : item.tags.includes(tag.slice(4)))
}
function fishStickerTagGroups(items) {
  const counts = new Map()
  for (const item of items) for (const tag of new Set(item.tags)) counts.set(tag, (counts.get(tag) || 0) + 1)
  return [{ id: 'all', name: '全部', count: items.length }, ...[...counts].sort(([a],[b]) => a.localeCompare(b, 'zh-CN')).map(([tag,count]) => ({ id: 'tag:' + tag, name: tag === '未分类' ? '未分类（标签）' : tag, count })), { id: 'untagged', name: '未分类', count: items.filter(x => !x.tags.length).length }]
}
function FishStickerDialog({ open, onClose, title, children }) {
  const React = require('react'), h = React.createElement, ref = React.useRef(null)
  React.useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])
  return h('dialog', { ref, className: 'fish-modal-card fish-sticker-dialog fish-stickers', 'aria-label': title,
    onCancel: e => { e.preventDefault(); onClose() }, onClose,
    onClick: e => { if (e.target !== e.currentTarget) return; const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose() } },
    h('header', { className: 'fish-sticker-dialog-header' }, h('h2', null, title), h('button', { type: 'button', className: 'fish-modal-close', onClick: onClose, 'aria-label': '关闭' + title }, '×')),
    h('div', { className: 'fish-sticker-dialog-body' }, children))
}
const FISH_STICKER_CSS = `
.big-fish .fish-stickers label{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin:12px 0}
.big-fish .fish-stickers .fish-form-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px 0}
.big-fish .fish-stickers label>input:not([role=switch]),.big-fish .fish-stickers label>select{flex:1 1 240px;min-width:0;max-width:100%}
.big-fish .fish-stickers .fish-muted,.big-fish .fish-stickers .fish-message{overflow-wrap:anywhere}
.big-fish .fish-stickers article{display:grid;gap:12px;margin-top:16px}
.big-fish .fish-stickers article label{margin:0}
.big-fish .fish-stickers .fish-actions{display:flex;flex-wrap:wrap;gap:12px}
.big-fish .fish-modal-card.fish-sticker-dialog{padding:0 0 18px;overflow:hidden;border:1px solid var(--fish-border);border-radius:24px;background:var(--fish-panel);box-shadow:var(--fish-shadow);color:var(--fish-text);font-family:var(--fish-font)}
.big-fish .fish-sticker-dialog[open]{display:flex;flex-direction:column}
.big-fish .fish-sticker-dialog-body{flex:1;min-height:0;overflow:auto;padding:0 24px 8px;overscroll-behavior:contain}
.big-fish .fish-sticker-dialog:not([open]){display:none}
.big-fish .fish-sticker-dialog::backdrop{background:var(--fish-sticker-backdrop);backdrop-filter:blur(3px)}
.big-fish .fish-sticker-dialog-header{display:flex;align-items:center;justify-content:space-between;gap:16px;flex:none;padding:24px 24px 16px}
.big-fish .fish-sticker-dialog-header h2{margin:0}
.big-fish .fish-sticker-tags{margin:16px 0}
.big-fish .fish-sticker-tags .fish-button{min-width:0;overflow-wrap:anywhere}
.big-fish .fish-sticker-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,160px),1fr));gap:16px}
.big-fish .fish-sticker-tile{min-width:0;border:1px solid var(--fish-border);border-radius:12px;padding:12px;background:var(--fish-surface)}
.big-fish .fish-sticker-tile h3,.big-fish .fish-sticker-tile p{margin:0;overflow-wrap:anywhere}
.big-fish .fish-sticker-thumb{width:100%;padding:4px;border:0;border-radius:8px;background:var(--fish-soft);cursor:zoom-in}
.big-fish .fish-sticker-thumb img{display:block;width:100%;height:120px;object-fit:contain}
.big-fish .fish-sticker-preview-image{display:block;width:100%;height:min(45dvh,400px);object-fit:contain;background:var(--fish-soft);border-radius:12px}
@media(max-width:520px){.big-fish .fish-sticker-dialog-header{padding:16px}.big-fish .fish-sticker-dialog-body{padding:0 16px 8px}.big-fish .fish-sticker-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.big-fish .fish-sticker-dialog-header h2{font-size:20px}}
`

function FishStickerCard({ item, busy, act, categories }) {
  const React = require('react'), h = React.createElement
  const [dirty,setDirty] = React.useState(false)
  const [name,setName] = React.useState(item.name), [tags,setTags] = React.useState(item.tags.join(',')), [scenes,setScenes] = React.useState(item.scenes.join(','))
  React.useEffect(() => { if (!dirty) { setName(item.name); setTags(item.tags.join(',')); setScenes(item.scenes.join(',')) } }, [dirty, item.name, item.tags.join(','), item.scenes.join(',')])
  return h('article', { className: 'qq-bind-detail' },
    h('img', { className: 'fish-sticker-preview-image', src: item.url, alt: item.name }),
    h('p', { className: 'fish-muted' }, '文件类型 · ' + (item.ext === 'jpg' ? 'JPEG' : item.ext.toUpperCase()) + (item.fileName ? ' · ' + item.fileName : '')),
    h('label', {className:'fish-form-row'}, '分类 ', h('select', { 'aria-label': item.id+' 分类', value:item.categorySource==='manual'?item.category:'',disabled:busy,onChange:e=>act('/edit',{id:item.id,category:e.target.value}) }, h('option',{value:''}, '自动归类 · '+(item.category || '未分类')), ...(categories || []).map(c=>h('option',{key:c,value:c},c)))),
    h('p', { className: 'fish-muted', role: 'status' }, '标签状态：' + ({pending:'等待处理',running:'识别中',complete:'已完成',error:'失败',cancelled:'已取消'}[item.tagStatus] || '未自动标注') + (item.tagError ? ' · '+item.tagError : '')),
    h('button', { type:'button',className:'fish-button',disabled:busy || ['pending','running'].includes(item.tagStatus),onClick:()=>act('/tag',{id:item.id}) }, '识别 / 重试标签'),
    h('p', { className: 'fish-muted' }, '共享素材（所有聊天可用）'),
    ...[['名称',name,setName],['标签',tags,setTags],['场景',scenes,setScenes]].map(([label,value,set]) => h('label', { key: label, className: 'fish-form-row' }, label, h('input', { 'aria-label': item.id + ' ' + label, value, disabled: busy, onChange: e => { setDirty(true); set(e.target.value) } }))),
    h('div', { className: 'fish-actions' }, h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: async () => { if (await act('/edit', { id: item.id, name, tags, scenes })) setDirty(false) } }, '保存素材描述'),
      h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { if (window.confirm('删除这张表情及其本地原文件？')) act('/remove', { id: item.id }) } }, '删除表情')))
}

function FishQQStorage({ kind, notify }) {
  const React = require('react'), h = React.createElement
  const [data,setData] = React.useState(null), [open,setOpen] = React.useState(false), [busy,setBusy] = React.useState(false), [error,setError] = React.useState(''), [preview,setPreview] = React.useState(null)
  const label = kind === 'images' ? '图片' : '文件', base = '/dsh-qq-bridge/media-storage'
  const load = async (path = '', body) => {
    const response = await fetch(base+path,{cache:'no-store',...(body?{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{})})
    if(!response.ok) throw new Error('存储管理接口不可用，请重新加载插件')
    const result = await response.json()
    if(!result.ok) throw new Error(result.说 || result.error || '读取存储失败')
    setData(result[kind]);setError('')
  }
  React.useEffect(() => { load().catch(e=>setError(e.message)) },[])
  React.useEffect(() => { if(!open)return;const timer=setInterval(()=>load().catch(e=>setError(e.message)),5000);return()=>clearInterval(timer) },[open])
  const remove = async item => {
    if(!window.confirm('删除归档副本「'+item.name+'」？DSH 会话附件不会被删除。'))return
    setBusy(true)
    try { await load('/remove',{kind,id:item.id,workspace:data.workspace});if(preview?.id===item.id)setPreview(null) }
    catch(e){setError(e.message)}finally{setBusy(false)}
  }
  const openFolder = async () => {
    setBusy(true); setError('')
    try {
      const response = await fetch('/dsh-qq-bridge/open-folder', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind }) })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.ok) throw new Error(result?.说 || '打开文件夹失败')
      notify?.('已打开本地文件夹', { tone: 'success' })
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  const size = bytes => bytes < 1048576 ? (bytes/1024).toFixed(1)+' KB' : (bytes/1048576).toFixed(1)+' MB'
  const items = data?.items || [], selected = items.find(x=>x.id===preview?.id)
  return h('div',{className:'fish-media-storage'},
    h('style',null,FISH_STICKER_CSS+'\n.big-fish .fish-media-storage p{overflow-wrap:anywhere}.big-fish .fish-stickers .fish-archive-file{display:flex;align-items:center;gap:12px;flex-wrap:wrap;border-bottom:1px solid var(--fish-border);padding:16px 0}.big-fish .fish-archive-name{flex:1 1 240px;min-width:0;overflow-wrap:anywhere}.big-fish .fish-archive-name p{margin:4px 0;overflow-wrap:anywhere}'),
    h('p',{className:'fish-muted'},data?.path?'存储目录：'+data.path:(data?.error && !/工作区/.test(data.error) ? data.error : '归档目录暂不可用。')),
    h('div',{className:'fish-actions'},
      h('button',{type:'button',className:'fish-button',disabled:busy,onClick:openFolder},'打开本地文件夹'),
      h('button',{type:'button',className:'fish-button',onClick:()=>{setPreview(null);setOpen(true);load().catch(e=>setError(e.message))}},'管理已存'+label+'（'+items.length+'）')),
    !open&&error?h('p',{className:'fish-message',role:'status'},error):null,
    h(FishStickerDialog,{open,onClose:()=>{setOpen(false);setPreview(null)},title:'已存'+label+'管理'},
      h('p',{className:'fish-muted'},'关闭存储仅停止新增归档。删除归档副本不影响 DSH 会话附件。'),
      h('div',{className:'fish-actions'},h(FishRefreshButton,{busy,onClick:()=>load().catch(e=>setError(e.message)),label:'刷新存储'}),selected?h('button',{type:'button',className:'fish-button',onClick:()=>setPreview(null)},'返回图片列表'):null),
      error||data?.error?h('p',{className:'fish-message',role:'alert'},error||data.error):null,
      selected?h('div',null,h('h3',null,selected.name),h('img',{className:'fish-sticker-preview-image',src:selected.url,alt:selected.name})):
        h('div',{className:kind==='images'?'fish-sticker-grid':undefined},...items.map(item=>h('article',{key:item.id,className:kind==='images'?'fish-sticker-tile':'fish-archive-file'},
          kind==='images'?h('button',{type:'button',className:'fish-sticker-thumb','aria-label':'预览已存图片 '+item.name,onClick:()=>setPreview(item)},h('img',{src:item.url,alt:'',loading:'lazy',width:144,height:120})):null,
          h('div',{className:'fish-archive-name'},h('h3',null,item.name),h('p',{className:'fish-muted'},size(item.size)+' · '+item.source+' · '+new Date(item.createdAt).toLocaleString())),
          h('div',{className:'fish-actions'},h('a',{href:item.url,download:item.name,className:'fish-button'},'下载'),h('button',{type:'button',className:'fish-button',disabled:busy,onClick:()=>remove(item)},'删除归档'))))),
      !items.length?h('p',{className:'fish-muted'},'尚无已存'+label+'。启用存储后，新接收内容自动归档。'):null))
}

function FishRefreshButton({ onClick, busy = false, disabled = false, label = '刷新', className = '', children, ...props }) {
  const React = require('react'), h = React.createElement
  const [pending, setPending] = React.useState(false)
  const inFlight = React.useRef(false)
  const refreshing = busy || pending
  return h('button', { ...props, type: 'button',
    className: 'fish-button fish-refresh-button' + (className ? ' ' + className : ''),
    disabled: disabled || refreshing, 'aria-busy': refreshing, 'aria-label': label,
    title: refreshing ? '正在' + label : label,
    onClick: async event => {
      if (disabled || busy || inFlight.current) return
      inFlight.current = true
      setPending(true)
      try { await onClick?.(event) }
      finally { inFlight.current = false; setPending(false) }
    } }, h(Glyph, { name: 'refresh', size: 18, className: 'fish-spin' }))
}

// 顶层 dialog 让弹窗避开滚动容器的裁剪和定位上下文。
function FishModal({ children, onCancel, ...props }) {
  const React = require('react'), ref = React.useRef(null)
  React.useLayoutEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  return React.createElement('dialog', { ...props, ref, role: 'presentation', onCancel: event => { event.preventDefault(); onCancel?.(event) } }, children)
}

function FishSwitch({ checked = false, disabled = false, onChange, className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('button', { ...props, type: 'button', role: 'switch', 'aria-checked': Boolean(checked), disabled,
    className: 'fish-switch' + (className ? ' ' + className : ''),
    onClick: () => {
      if (disabled) return
      // 保留各页现有的 checked 事件签名，复用即时保存与失败恢复逻辑。
      return onChange?.({ target: { checked: !checked }, currentTarget: { checked: !checked } })
    } },
    h('span', { className: 'fish-switch-thumb', 'aria-hidden': true }))
}

// 大肥鱼通用表单控件：输入框 / 下拉框 / 多行文本。
// 全局面板仍会统一修饰原生控件；这些组件给新页面提供一致的结构与图标位。
function FishInput({ icon, className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('span', { className: 'fish-input-box' + (className ? ' ' + className : '') },
    icon ? h('span', { className: 'fish-input-icon', 'aria-hidden': true }, icon) : null,
    h('input', { ...props, className: 'fish-input' + (icon ? ' fish-input-with-icon' : '') }))
}

function FishSelect({ children, className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('span', { className: 'fish-select-box' + (className ? ' ' + className : '') },
    h('select', { ...props, className: 'fish-select-input' }, children))
}

function FishTextarea({ className = '', ...props } = {}) {
  const React = require('react'), h = React.createElement
  return h('textarea', { ...props, className: 'fish-textarea-input' + (className ? ' ' + className : '') })
}

// 全局 select 浮层：接管原生下拉菜单，统一成手帐风格。
function FishSelectLayer() {
  const React = require('react'), h = React.createElement
  const [popup, setPopup] = React.useState(null)
  const popupRef = React.useRef(null)
  const selectRef = React.useRef(null)
  const lastClosed = React.useRef({ select: null, at: 0 })

  const close = (focus = true, toggle = false) => {
    const select = selectRef.current
    selectRef.current = null
    if (toggle && select) lastClosed.current = { select, at: Date.now() }
    if (select) {
      select.removeAttribute('aria-expanded')
      if (focus && typeof document !== 'undefined' && document.contains(select)) select.focus({ preventScroll: true })
    }
    setPopup(null)
  }

  const open = (select) => {
    if (!select || select.disabled || select.multiple) return
    if (selectRef.current === select) { close(true, true); return }
    const options = Array.from(select.options).map((option, index) => ({
      value: option.value,
      label: String(option.textContent || '').trim(),
      disabled: option.disabled,
      selected: index === select.selectedIndex,
    }))
    if (!options.length) return
    if (popupRef.current) {
      selectRef.current?.removeAttribute('aria-expanded')
    }
    const rect = select.getBoundingClientRect()
    const minWidth = select.dataset?.fishSelectCompact === 'true' ? 0 : 220
    const width = Math.min(Math.max(minWidth, Math.ceil(rect.width)), Math.max(0, window.innerWidth - 16))
    const left = Math.min(Math.max(8, rect.left), Math.max(8, window.innerWidth - width - 8))
    const below = Math.max(0, window.innerHeight - rect.bottom - 8)
    const above = Math.max(0, rect.top - 8)
    const wanted = Math.min(300, options.length * 42 + 14)
    const openUp = below < wanted && above > below
    const maxHeight = Math.min(300, openUp ? above : below)
    const top = openUp ? null : rect.bottom
    const bottom = openUp ? window.innerHeight - rect.top : null
    const selectedIndex = Math.max(0, select.selectedIndex)
    selectRef.current = select
    select.setAttribute('aria-expanded', 'true')
    select.setAttribute('aria-haspopup', 'listbox')
    setPopup({ select, options, active: selectedIndex, left, top, bottom, width, maxHeight })
  }

  const choose = (option) => {
    const select = selectRef.current
    if (!select || option.disabled) return
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
    if (setter) setter.call(select, option.value)
    else select.value = option.value
    select.dispatchEvent(new Event('input', { bubbles: true }))
    select.dispatchEvent(new Event('change', { bubbles: true }))
    close(true)
  }

  React.useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const onPointerDown = (event) => {
      const target = event.target
      if (popupRef.current && target instanceof Node && popupRef.current.contains(target)) return
      const select = target && target.closest ? target.closest('select') : null
      if (select && select.closest('.big-fish') && !select.disabled && !select.multiple) {
        event.preventDefault()
        event.stopPropagation()
        open(select)
        return
      }
      if (popupRef.current) close(false)
    }
    const onClick = (event) => {
      const target = event.target
      const select = target && target.closest ? target.closest('select') : null
      if (select) { event.preventDefault(); event.stopPropagation() }
    }
    const onMouseDown = (event) => {
      const target = event.target
      const select = target && target.closest ? target.closest('select') : null
      if (!select || !select.closest('.big-fish') || select.disabled || select.multiple) return
      event.preventDefault()
      event.stopPropagation()
      const closed = lastClosed.current
      if (closed.select === select && Date.now() - closed.at < 300) return
      if (!popupRef.current || selectRef.current !== select) open(select)
    }
    const onKeyDown = (event) => {
      const target = event.target
      if (!target || target.tagName !== 'SELECT' || !target.closest?.('.big-fish')) return
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        open(target)
      }
    }
    const onViewportChange = (event) => {
      if (!popupRef.current) return
      if (event?.target instanceof Node && popupRef.current.contains(event.target)) return
      close(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('scroll', onViewportChange, true)
    window.addEventListener('resize', onViewportChange)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('scroll', onViewportChange, true)
      window.removeEventListener('resize', onViewportChange)
    }
  }, [])

  React.useLayoutEffect(() => {
    if (popup) {
      popupRef.current?.showPopover?.()
      popupRef.current?.focus({ preventScroll: true })
    }
  }, [popup && popup.select])

  React.useEffect(() => {
    if (!popup) return
    const active = popupRef.current?.querySelector('.fish-select-option.is-active')
    active?.scrollIntoView({ block: 'nearest' })
  }, [popup && popup.active])

  if (!popup) return null
  const move = (step) => {
    if (!popup.options.length) return
    let next = popup.active
    for (let i = 0; i < popup.options.length; i++) {
      next = (next + step + popup.options.length) % popup.options.length
      if (!popup.options[next].disabled) break
    }
    setPopup(current => current ? { ...current, active: next } : current)
  }
  const onKeyDown = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); close(true); return }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); move(event.key === 'ArrowDown' ? 1 : -1); return }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(popup.options[popup.active]); return }
    if (event.key === 'Tab') close(false)
  }
  // 菜单须位于所属模态框内，避免被原生 dialog 的背景禁用规则拦截。
  return require('react-dom').createPortal(h('div', {
    ref: popupRef, popover: 'manual', className: 'fish-select-popup', role: 'listbox', tabIndex: -1,
    'data-compact': popup.select.dataset?.fishSelectCompact,
    'aria-label': popup.select.getAttribute('aria-label') || '选项',
    style: { left: popup.left + 'px', top: popup.top === null ? 'auto' : popup.top + 'px',
      bottom: popup.bottom === null ? 'auto' : popup.bottom + 'px', width: popup.width + 'px', maxHeight: popup.maxHeight + 'px' },
    onKeyDown, onPointerDown: event => event.stopPropagation(),
  }, ...popup.options.map((option, index) => h('button', {
    key: index, type: 'button', role: 'option', disabled: option.disabled,
    'aria-selected': option.selected ? 'true' : 'false',
    className: 'fish-select-option' + (index === popup.active ? ' is-active' : ''),
    onClick: () => choose(option),
    onMouseEnter: () => setPopup(current => current ? { ...current, active: index } : current),
  }, h('span', null, option.label)))), popup.select.closest('[aria-modal="true"], dialog[open]') || popup.select.closest('.big-fish'))
}

// 同一配置区域串行提交，输入框保留编辑过程，失焦才进入保存队列。
function useFishAutosave(save) {
  const React = require('react'), latest = React.useRef(save), state = React.useRef({ timer: null, pending: false, running: null })
  latest.current = save
  const flush = () => {
    const job = state.current
    clearTimeout(job.timer); job.pending = true
    if (job.running) return job.running
    job.running = (async () => {
      let saved
      while (job.pending) { job.pending = false; saved = await latest.current() }
      return saved
    })().catch(error => { if (typeof fishNotify === 'function') fishNotify('保存失败：' + error.message) }).finally(() => { job.running = null })
    return job.running
  }
  const schedule = () => { clearTimeout(state.current.timer); state.current.timer = setTimeout(() => { void flush() }, 0) }
  const textField = target => target.matches?.('textarea,input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):not([type=button]):not([type=submit])')
  return {
    flush,
    onClickCapture: event => { if (event.target.closest?.('button.fish-switch:not(:disabled)')) schedule() },
    onChangeCapture: event => { if (!textField(event.target)) schedule() },
    onBlurCapture: event => { if (textField(event.target)) schedule() },
  }
}

// 大肥鱼整合修改：供主界面直接挂载，更新入口统一到「更新与来源」。
// DSH「通到 QQ」· 网页半边
//
// 在 **DSH 设置** 左侧栏加一项「通到 QQ」，大肥鱼提供历史导入页。
// 绑定是核心：一行 = 一个聊天（私聊 或 群）→ 一间 DSH 会话，各回各的，不串。
//
// 注意：这里不碰会话、不发消息，只是往宿主那几条 /dsh-qq-bridge/* 路由上读写。

moduleLoader.load({
  id: 'dsh-qq-link',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const inject = ['slots']

    const B = '/dsh-qq-bridge'
    const get = (p) => fetch(B + p, { cache: 'no-store' }).then((r) => r.json()).catch(() => null)
    const post = (p, body) =>
      fetch(B + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) })
        .then((r) => r.json())
        .catch(() => null)

    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'

    const S = {
      wrap: { padding: '0 0 24px', fontSize: 'var(--fish-body)', lineHeight: 1.75, minWidth: 0 },
      h: { fontFamily: 'var(--fish-title)', fontSize: 20, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.5 },
      dim: { color: 'var(--fish-muted)', fontSize: 'var(--fish-small)' },
      card: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius)', padding: '24px', marginBottom: 8, minWidth: 0, background: 'var(--fish-panel)', boxShadow: 'var(--fish-shadow)' },
      row: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' },
      lab: { flex: '0 1 200px', paddingTop: 8, fontSize: 'var(--fish-label)', fontWeight: 550 },
      ctl: { flex: '1 1 260px', minWidth: 0 },
      hint: { color: 'var(--fish-muted)', fontSize: 'var(--fish-small)', marginTop: 8, lineHeight: 1.75 },
      input: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: '100%', maxWidth: '100%', boxSizing: 'border-box' },
      small: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: 136, maxWidth: '100%', boxSizing: 'border-box' },
      wide: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: '100%', boxSizing: 'border-box' },
      ta: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-body)', width: '100%', minHeight: 112, boxSizing: 'border-box', lineHeight: 1.75, fontFamily: 'inherit', resize: 'vertical' },
      ok: { color: 'var(--fish-success)', fontSize: 'var(--fish-small)' },
      warn: { color: 'var(--fish-warning)', border: '1px solid var(--fish-border)', background: 'var(--fish-soft)', borderRadius: 'var(--fish-radius-sm)', padding: 16, marginBottom: 16 },
      已同步: { margin: '8px 0 20px', fontSize: 'var(--fish-small)', color: 'var(--fish-success)' },
      未保存: { margin: '8px 0 20px', fontSize: 'var(--fish-small)', color: 'var(--fish-warning)', fontWeight: 550 },
      btn: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 16px', background: 'var(--fish-control-fill)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', cursor: 'pointer' },
      btnOn: { border: '1px solid var(--fish-action)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 16px', background: 'var(--fish-action)', color: 'var(--fish-on-accent)', fontSize: 'var(--fish-label)', cursor: 'pointer' },
      tabBar: { display: 'flex', gap: 8, overflowX: 'auto', margin: '16px 0 24px', paddingBottom: 16, borderBottom: '1px solid var(--fish-border)' },
      stack: { display: 'grid', gap: 20 },
      grid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, alignItems: 'start' },
      group: { borderTop: '1px solid var(--fish-border)', padding: '20px 0' },
      summary: { fontWeight: 600, fontSize: 16, cursor: 'pointer', padding: '8px 0 16px' },
      日志行: { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 'var(--fish-small)', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: '8px 0', borderBottom: '1px solid var(--fish-line)' },
      表头: {}, 表格行: {}, 空间表头: {}, 空间行: {},
      表头字: { fontSize: 'var(--fish-small)', color: 'var(--fish-muted)' },
      已勾: { border: '1px solid var(--fish-border)', background: 'var(--fish-soft)', borderRadius: 'var(--fish-radius-sm)', padding: '12px 16px', fontSize: 'var(--fish-small)' },
      清单: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius-sm)', marginTop: 12, maxHeight: 320, overflowY: 'auto' },
      会话行: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--fish-line)' },
      会话行勾上: { background: 'var(--fish-accent-soft)', fontWeight: 550 },
      tag: { display: 'inline-block', border: '1px solid var(--fish-border)', borderRadius: 20, padding: '2px 8px', fontSize: 'var(--fish-small)', marginRight: 8 }
    }

    const 提示 = (文本) => h('div', { style: S.hint }, 文本)
    const 行 = (标签, 控件, 说明) =>
      h('div', { className: 'fish-form-row', style: S.row }, h('div', { className: 'fish-form-label', style: S.lab }, 标签), h('div', { className: 'fish-control', style: S.ctl }, (['input', 'select', 'textarea', Switch].includes(控件?.type) ? React.cloneElement(控件, { 'aria-label': 标签 }) : 控件), 说明 ? 提示(说明) : null))
    const 按钮 = (文字, onClick, 亮, 关) =>
      h('button', { type: 'button', className: 亮 ? 'fish-primary' : '', style: 亮 ? S.btnOn : S.btn, onClick, disabled: !!关, title: 文字 }, 文字)
    const 勾 = (值, onChange, label = '切换设置', disabled = false) => h(Switch, {'aria-label': label, type: 'checkbox', role: 'switch', checked: !!值, disabled, onChange: (e) => onChange(e.target.checked) })
    const 短id = (id) => {
      const s = String(id)
      return s.length <= 8 ? s : s.slice(-8)
    }

    const 页签们 = ['连接', '绑定', '消息策略', '角色设定', 'QQ 账号', 'QQ 空间', '表情包', '语音转写', '语音发送', '图片与文件', '聊天记录']

    function QQAccountState() {
      const [state, setState] = React.useState(null)
      const [error, setError] = React.useState('')
      const refresh = async () => {
        try {
          const value = await post('/account/state', {})
          if (!value?.ok) throw new Error(value?.说 || '读取申请状态失败')
          setState(value); setError('')
        } catch (e) { setError(e.message) }
      }
      React.useEffect(() => {
        let active = true
        const load = async () => {
          try {
            const value = await post('/account/state', {})
            if (!value?.ok) throw new Error(value?.说 || '读取申请状态失败')
            if (active) { setState(value); setError('') }
          } catch (e) { if (active) setError(e.message) }
        }
        void load()
        const timer = setInterval(load, 5000)
        return () => { active = false; clearInterval(timer) }
      }, [])
      const labels = { pending: '待主人授权', processing: '处理中或待核验', approved: '已同意', rejected: '已拒绝', expired: '已过期', uncertain: '结果待 QQ 核验' }
      return h('section', { style: S.card },
        h('div', { className: 'fish-section-head' }, h('h3', null, '申请与邀请记录'), h(RefreshButton, { type: 'button', label: '刷新记录', onClick: refresh }, '刷新记录')),
        h('p', { style: S.dim }, '主人 QQ：' + (state?.owner || '未设置') + ' · 事件通道：' + (state?.channel || '读取中')),
        state?.setupError ? h('p', { role: 'status' }, state.setupError) : null,
        error ? h('p', { role: 'alert' }, error) : null,
        h('p', { style: S.dim }, '主人身份使用私聊映射中勾选“主人 QQ”的唯一 QQ 号，请由主人先发一条私聊消息完成来源核验。审批询问由机器人直接私聊发送。'),
        ...(state?.requests || []).slice().reverse().map(item => h('div', { key: item.id, className: 'fish-record', style: { padding: '16px 0', borderTop: '1px solid var(--fish-border)', overflowWrap: 'anywhere' } },
          h('strong', null, item.kind === 'friend' ? '好友申请 · ' + item.user : '群聊邀请 · ' + item.group),
          h('p', null, labels[item.status] || item.status, ' · 编号 ', h('code', null, item.id)),
          item.comment ? h('p', null, '对方留言：', item.comment) : null,
          item.status === 'pending' ? h('p', { style: S.dim }, item.notifiedAt ? '已询问主人，等待 QQ 私聊确认。' : '等待询问主人。') : null)),
        state && !state.requests?.length ? h('p', { style: S.dim }, '暂无申请记录。') : null)
    }

    function QQSpaceActions({ 配置, 脏, notify }) {
      const [busy, setBusy] = React.useState(false)
      // 旧的内联操作提示保留占位，实际消息已走 DSH Toast。
      const [message, setMessage] = React.useState('')
      const [images, setImages] = React.useState('')
      const [qq, setQQ] = React.useState('')
      const [tid, setTid] = React.useState('')
      const [result, setResult] = React.useState('')
      const imageList = images.split(/\r?\n/).map(x => x.trim()).filter(Boolean)
      const tell = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const run = async (path, body, read = false) => {
        setBusy(true)
        try {
          const r = await post(path, body)
          if (!r?.ok) throw new Error(r?.说 || '请求失败，请检查后端连接')
          if (read) setResult(r.说)
          tell(r.说 || '已完成', { tone: 'success' })
        } catch (e) { tell('操作失败：' + e.message, { holdMs: 6000 }) }
        finally { setBusy(false) }
      }
      const imageField = 行('图片地址（每行一张）', h('textarea', { style: S.ta, value: images, placeholder: 'https://example.com/photo.jpg', onChange: e => setImages(e.target.value) }),
        '已填写 ' + imageList.length + ' / ' + 9 + ' 张。支持 HTTP(S) 地址和本地图片路径；空间配图路径由 QQ 后端读取。')
      const blocked = busy || 脏
      if (配置.空间浏览开 === false) return null
      return h('section', { className: 'fish-card qq-space-browse', style: S.card },
        h('div', { className: 'qq-space-browse-head' },
          h('h2', null, '浏览动态与评论'),
          h('p', { className: 'fish-muted' }, '查看好友动态、说说正文和评论；此处只读，不会点赞或代发评论。')),
        h('div', { className: 'qq-space-browse-grid' },
          h('label', { className: 'qq-space-field' },
            h('span', null, '查看谁的空间'),
            h('input', { style: S.wide, value: qq, inputMode: 'numeric', placeholder: '留空查看机器人自己的空间', onChange: e => setQQ(e.target.value) })),
          h('label', { className: 'qq-space-field' },
            h('span', null, '说说 ID'),
            h('input', { style: S.wide, value: tid, inputMode: 'numeric', placeholder: '填写说说列表中的 tid', onChange: e => setTid(e.target.value) }))),
        h('div', { className: 'fish-actions qq-space-browse-actions' },
          按钮('查看好友动态', () => run('/space', { action: 'qq_space_feeds', args: { count: 20 } }, true), false, busy),
          按钮('查看说说列表', () => run('/space', { action: 'qq_space_list', args: { qq, num: 20 } }, true), false, busy),
          按钮('查看正文与评论', () => run('/space', { action: 'qq_space_detail', args: { qq, tid: Number(tid) } }, true), false, busy || !/^\d+$/.test(tid))),
        h('pre', { className: 'fish-feed-result', role: 'status' }, result || '选择操作后显示动态。'))
    }

    function Section({ page, onPageChange, guard, notify, help, hideHelp, laterHideHelp, confirm, editRole, openRoleWriter, openFileManager, embedded = false } = {}) {
      const [态, 设态] = React.useState(null)
      const [脏, 设脏] = React.useState(false)
      const [忙, 设忙] = React.useState(false)
      // 旧的内联提示状态保留占位：提示由全局通知显示，保持 hook 顺序与旧测试/宿主兼容。
      const [说, 设说] = React.useState('')
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [localPage, setLocalPage] = React.useState('连接')
      const 页 = page ?? localPage
      const 设页 = onPageChange ?? setLocalPage
      const [asr, 设asr] = React.useState(null)
      const [asr忙, 设asr忙] = React.useState(false)
      const [群规则行, 设群规则行] = React.useState(null) // 哪一行展开了群规则
      const [人设忙, 设人设忙] = React.useState(false)
      const [人设说, 设人设说] = React.useState('')
      const [历史绑定, 设历史绑定] = React.useState('')
      const [历史文件, 设历史文件] = React.useState(null)
      const [历史AI, 设历史AI] = React.useState('')
      const [历史日期, 设历史日期] = React.useState({ start: '', end: '' })
      const [历史任务, 设历史任务] = React.useState(null)
      const [历史列表, 设历史列表] = React.useState([])
      const [历史忙, 设历史忙] = React.useState(false)
      const [历史说, 设历史说] = React.useState('')
      const [历史控制] = React.useState({ stop: false, running: false })
      const [已存绑定, 设已存绑定] = React.useState([])
      // 新增状态放在 hook 列表末尾，避免影响旧测试和宿主的状态槽顺序。
      const [编辑行, 设编辑行] = React.useState(null)
      const [启动检查中, 设启动检查中] = React.useState(false)
      const [新建映射, 设新建映射] = React.useState(null)
      const [新建忙, 设新建忙] = React.useState(false)
      const [新建错误, 设新建错误] = React.useState('')
      const [新建查名忙, 设新建查名忙] = React.useState(false)
      const [新建查名说, 设新建查名说] = React.useState('')
      const [memoryGroups, setMemoryGroups] = React.useState(null)
      const [memoryBusy, setMemoryBusy] = React.useState(false)
      const [memoryError, setMemoryError] = React.useState('')
      const [historySource, setHistorySource] = React.useState('file')
      const loadMemoryGroups = async () => {
        try {
          const response = await fetch('/dsh-fish-memory/list', { cache: 'no-store' })
          const result = await response.json()
          if (!response.ok || !result.ok) throw Error(result.error || '无法读取记忆隔离设置')
          setMemoryGroups(result.qqIsolatedGroups || [])
          setMemoryError('')
        } catch (error) { setMemoryError(error.message) }
      }
      React.useEffect(() => { if (页 === '绑定') loadMemoryGroups() }, [页])
      const saveMemoryGroup = async (group, isolated) => {
        setMemoryBusy(true)
        try {
          const response = await fetch('/dsh-fish-memory/qq-settings', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ group: String(group), isolated }) })
          const result = await response.json()
          if (!response.ok || !result.ok) throw Error(result.error || '保存记忆隔离失败')
          setMemoryGroups(result.qqIsolatedGroups)
          告知('群聊记忆隔离已' + (isolated ? '开启' : '关闭') + '，原有记忆库保留', { tone: 'success' })
          return true
        } catch (error) { 告知(error.message); return false } finally { setMemoryBusy(false) }
      }
      const saveQueue = React.useRef(Promise.resolve())
      const saveRef = React.useRef(null)
      const autosave = typeof useFishAutosave === 'function' ? useFishAutosave(() => saveRef.current?.()) : {}
      const 总开关校验 = React.useRef(0)
      const 编辑快照 = React.useRef(null)
      const 最新配置 = React.useRef(null)
      const 新建计时 = React.useRef(null)
      最新配置.current = 态?.配置

      React.useEffect(() => {
        get('/history/jobs').then(r => r && r.ok && 设历史列表(r.jobs))
        return () => { 历史控制.stop = true; 总开关校验.current += 1 }
      }, [])

      React.useEffect(() => {
        拉()
        get('/asr-status').then((r) => r && 设asr(r)).catch(() => {})
      }, [])
      // 装依赖的时候每 2 秒看一眼进度（装完就停）
      React.useEffect(() => {
        if (!asr || !asr.进行中) return undefined
        const t = setInterval(() => {
          get('/asr-status').then((r) => { if (r) 设asr(r) }).catch(() => {})
        }, 2000)
        return () => clearInterval(t)
      }, [asr && asr.进行中])

      const 拉 = async () => {
        const s = await get('/state')
        if (s) { 设态(s); 设已存绑定(Array.isArray(s.配置?.绑定) ? s.配置.绑定 : []); 设编辑行(null); 编辑快照.current = null }
      }
      // 只刷新会话下拉需要的数据，不覆盖正在编辑的绑定草稿。
      const 刷新会话 = async () => {
        const s = await get('/state')
        if (!s) return
        设态(旧 => 旧 ? {
          ...旧,
          活着的会话: Array.isArray(s.活着的会话) ? s.活着的会话 : 旧.活着的会话,
          日志: Array.isArray(s.日志) ? s.日志 : 旧.日志,
          NapCat状态: s.NapCat状态 ?? 旧.NapCat状态,
          工作区列表: Array.isArray(s.工作区列表) ? s.工作区列表 : 旧.工作区列表,
          工作区错误: s.工作区错误 || '',
        } : 旧)
      }
      // ⭐ 1.1.2：人设「现在就生效」—— 不用等 QQ 那边来一条消息
      const 应用人设 = async () => {
        设人设忙(true)
        const r = await post('/persona-apply', {})
        设人设忙(false)
        if (!r || !r.ok) {
          告知('角色设定应用失败：' + ((r && r.说) || '请求未响应'), { holdMs: 6000 })
          return
        }
        const 行们 = Array.isArray(r.结果们) ? r.结果们 : []
        if (!行们.length) {
          告知('暂无可以应用角色设定的会话绑定')
          return
        }
        const 不顺 = 行们.filter((x) => !x.生效)
        告知((r.生效 ? '' + r.生效 + ' 个会话已应用' : '未应用到任何会话')
          + (不顺.length ? '；' + 不顺.map((x) => x.聊天 + '：' + x.说).join('；') : ''), { tone: r.生效 ? 'success' : undefined })
      }
      const 切换人设 = async (v, 字段 = '人设') => {
        if (人设忙 || 忙) return
        if (v && !String(配置[字段] || '').trim()) {
          告知('请先填写' + (字段 === '人设' ? '全局角色设定' : '特殊设定') + '，再打开开关', { holdMs: 6000 })
          return
        }
        const 开关键 = 字段 + '开'
        const 旧状态 = Boolean(配置[开关键])
        if (Boolean(v) === 旧状态) return
        const 下一份配置 = { ...((态 && 态.配置) || {}), [开关键]: Boolean(v) }
        改(开关键, Boolean(v))
        const 保存成功 = await 存(下一份配置)
        if (!保存成功) {
          改(开关键, 旧状态)
          return
        }
        await 应用人设()
      }
      const 改 = (k, v) => {
        设态((旧) => (旧 ? { ...旧, 配置: { ...(旧.配置 || {}), [k]: v } } : 旧))
        设脏(true)
      }
      // —— 绑定：整份数组替换（宿主那边会再规整一遍、并挡掉重复）——
      const 绑定们 = () => {
        const a = 态 && 态.配置 && 态.配置.绑定
        return Array.isArray(a) ? a : []
      }
      const 设绑定 = (下一份) => 改('绑定', 下一份)
      const 改绑定 = (i, 补) => 设绑定(绑定们().map((x, j) => {
        if (j === i) return { ...x, ...补 }
        return 补.主人QQ === true && x.主人QQ === true ? { ...x, 主人QQ: false } : x
      }))
      const 加绑定 = (类型 = '群') => {
        const 脏前 = 脏
        const 新行 = { 类型, 号码: '', 会话: '', 称呼: '', 门槛: false, 主人QQ: false, 沙箱环境: false, 开: false }
        // 群聊的收消息范围改为每条绑定自己说了算；新群默认仅点名（主动回应关闭）。
        if (类型 === '群') 新行.只听点名 = true
        const 下一份 = [...绑定们(), 新行]
        设绑定(下一份)
        编辑快照.current = { index: 下一份.length - 1, existed: false, row: null, dirtyBefore: 脏前, owners: 绑定们().filter(row => row.主人QQ === true).map(row => row.会话) }
        设编辑行(下一份.length - 1)
        void 刷新会话()
      }
      const 打开新建 = (类型) => {
        if (编辑行 != null) { 告知('请先完成当前的映射编辑'); return }
        设新建错误(''); 设新建查名说('')
        if (新建计时.current) { clearTimeout(新建计时.current); 新建计时.current = null }
        设新建映射({ 类型, 号码: '', 称呼: '', 门槛: false, 主人QQ: false, 沙箱环境: false, 主动: false, 记忆隔离: null, 开: true })
      }
      const 自动拉名称 = async (类型, 号码) => {
        if (!/^[1-9]\d*$/.test(号码)) return
        设新建查名忙(true)
        try {
          const r = await post('/lookup-name', { 类型, 号码 })
          if (!r || !r.ok) throw new Error('lookup failed')
          设新建映射(old => old && String(old.号码) === 号码 ? { ...old, 称呼: String(r.名称 || '') } : old)
          设新建查名说('')
        } catch (e) {
          设新建查名说('拉取失败，请自行填写 QQ 昵称/群名称')
        } finally { 设新建查名忙(false) }
      }
      const 安排拉名称 = (类型, 号码) => {
        if (新建计时.current) { clearTimeout(新建计时.current); 新建计时.current = null }
        设新建查名说('')
        if (!/^[1-9]\d*$/.test(号码)) return
        新建计时.current = setTimeout(() => {
          新建计时.current = null
          void 自动拉名称(类型, 号码)
        }, 450)
      }
      const 创建映射 = async () => {
        if (!新建映射 || 新建忙) return
        const 号码 = String(新建映射.号码 || '').trim()
        const 名称 = String(新建映射.称呼 || '').trim()
        if (!/^[1-9]\d*$/.test(号码)) { 设新建错误(新建映射.类型 === '群' ? '请填写有效的群号' : '请填写有效的 QQ 号'); return }
        if (!名称) { 设新建错误(新建映射.类型 === '群' ? '请填写群名' : '请填写 QQ 名'); return }
        设新建忙(true); 设新建错误('')
        try {
          if (新建映射.类型 === '群') {
            if (memoryGroups === null) throw Error('记忆隔离设置尚未读取，请稍后重试')
            const isolated = 新建映射.记忆隔离 ?? memoryGroups.includes(号码)
            if (isolated !== memoryGroups.includes(号码) && !await saveMemoryGroup(号码, isolated)) throw Error('记忆隔离设置保存失败，请重试')
          }
          const r = await post('/create-session', { 名称: 名称 + ' - ' + 号码 })
          if (!r || !r.ok) throw new Error((r && (r.说 || r.error)) || '创建会话失败')
          const 行 = { 类型: 新建映射.类型, 号码, 会话: r.会话, 称呼: 名称, 门槛: Boolean(新建映射.门槛), 主人QQ: 新建映射.类型 === '私聊' && 新建映射.主人QQ === true, 沙箱环境: 新建映射.沙箱环境 === true, 开: 新建映射.开 !== false }
          if (新建映射.类型 === '群') 行.只听点名 = !新建映射.主动
          const 下一份 = [...绑定们().map(row => 行.主人QQ && row.主人QQ === true ? { ...row, 主人QQ: false } : row), 行]
          设绑定(下一份)
          设新建映射(null); 设编辑行(null)
          await 存({ ...最新配置.current, 绑定: 下一份 })
          await 刷新会话()
        } catch (e) { 设新建错误(e.message) } finally { 设新建忙(false) }
      }
      const 删绑定 = (i) => {
        设绑定(绑定们().filter((_, j) => j !== i))
        设编辑行(old => old === null ? null : old === i ? null : old > i ? old - 1 : old)
        const 快照 = 编辑快照.current
        if (快照) {
          if (快照.index === i) 编辑快照.current = null
          else if (快照.index > i) 快照.index--
        }
        void 刷新会话()
      }
      const 开始编辑 = (i) => {
        const 目标 = 绑定们()[i]
        if (!目标) return
        编辑快照.current = { index: i, existed: true, row: { ...目标 }, dirtyBefore: 脏, owners: 绑定们().filter(row => row.主人QQ === true).map(row => row.会话) }
        设编辑行(i)
        void 刷新会话()
      }
      const 存 = async (覆盖配置, 自动 = false) => {
        设忙(true)
        const 开始配置 = 最新配置.current
        const 当前配置 = 覆盖配置 || 开始配置 || {}
        // 旧群没有 只听点名 时沿用全局「群里听所有人」。首次保存把当前有效值固化到每条群绑定，
        // 之后每条群都用「主动回应」自己的开关，不再需要在回复门槛里保留全局开关。
        const 待存 = Array.isArray(当前配置.绑定)
          ? { ...当前配置, 绑定: 当前配置.绑定.map(x => (x && (x.类型 || '群') === '群' && x.只听点名 == null)
              ? { ...x, 只听点名: !当前配置.群里听所有人 }
              : x) }
          : 当前配置
        const request = saveQueue.current.catch(() => {}).then(() => post('/save', 待存))
        saveQueue.current = request
        const s = await request
        设忙(false)
        if (s && s.ok) {
          const 有新编辑 = 最新配置.current !== 开始配置 && JSON.stringify(最新配置.current) !== JSON.stringify(当前配置)
          设态(old => 有新编辑 ? { ...s, 配置: old.配置 } : s)
          设已存绑定(Array.isArray(s.配置?.绑定) ? s.配置.绑定 : [])
          if (!自动) { 设编辑行(null); 编辑快照.current = null }
          设脏(有新编辑)
          设说('')
          告知(s.说 || '设置已保存', { tone: 'success' })
          void 刷新会话()
          return true
        }
        if (s?.启动检查失败) 改('总开关', false)
        设说('保存失败，修正后离开输入框重试')
        告知((s && s.说) || '保存失败', { holdMs: s?.启动检查失败 ? 14000 : 6000 })
        return false
      }
      saveRef.current = () => 脏 ? 存(undefined, true) : true
      React.useEffect(() => {
        if (!guard) return
        guard.current = { dirty: 脏, save: () => saveRef.current?.() }
        return () => { if (guard) guard.current = { dirty: false, save: null } }
      }, [脏, guard])
      const 装语音 = async () => {
        设asr忙(true)
        const r = await post('/asr-install', {})
        告知((r && r.说) || '任务已启动', { tone: 'success' })
        设asr忙(false)
        const s2 = await get('/asr-status')
        if (s2) 设asr(s2)
      }
      const 填语音命令 = async () => {
        const r = await get('/asr-status')
        if (r) 设asr(r)
        if (r && r.就绪 && r.命令) {
          改('语音转写', true)
          改('转写命令', r.命令)
          告知(String(配置.语音模型目录 || '').trim()
            ? '命令已填写，输入完成后失焦自动保存'
            : '请填写语音模型目录后重新生成命令')
        } else if (r && !r.就绪) 告知('请先安装语音依赖')
        else 告知('无法读取状态')
      }

      const 试一句 = async () => {
        设忙(true)
        const s = await post('/test-send', {})
        设忙(false)
        告知((s && s.说) || '请求未响应')
        await 拉()
      }

      if (!态) return h('div', { className: 'fish-module fish-qq', style: S.wrap, ...autosave }, h('div', { className: 'fish-section-title', style: S.h }, '连接与转发'), h('div', { style: S.dim }, '读取中…'))

      const 配置 = 态.配置 || {}
      const 目标们 = Array.isArray(态.活着的会话) ? 态.活着的会话 : []
      const 日志 = Array.isArray(态.日志) ? 态.日志 : []
      const 绑定 = 绑定们()

      const 会话选项 = (值, onChange) =>
        h('select', {'aria-label': '目标会话', style: S.wide, value: 值 || '', onChange: (e) => onChange(e.target.value) },
          h('option', { value: '' }, '请选择目标会话'),
          ...目标们.map((s) => h('option', { value: s.id }, (s.标题 || '…' + 短id(s.id)) + ' · ' + 短id(s.id))),
          值 && !目标们.some((s) => s.id === 值)
            ? h('option', { value: 值 }, '（当前：' + 短id(值) + '）')
            : null)

      // ── 绑定表格：私聊和群聊分开，一行一条；长会话名也不换行 ──
      const 私聊们 = 绑定.map((x, i) => ({ x, i })).filter(({ x }) => (x.类型 || '群') === '私聊')
      const 群们 = 绑定.map((x, i) => ({ x, i })).filter(({ x }) => (x.类型 || '群') === '群')
      const 私聊编辑中 = 编辑行 != null && 私聊们.some(({ i }) => i === 编辑行)
      const 群编辑中 = 编辑行 != null && 群们.some(({ i }) => i === 编辑行)
      const 点名开 = x => x.类型 === '群' && (x.只听点名 == null ? !配置.群里听所有人 : Boolean(x.只听点名))
      const 字段说明 = {
        '主人 QQ': '大肥鱼的主人，有且仅有一个 QQ 号可以绑定',
        '记忆隔离': '开启后使用独立群记忆库，关闭后使用普通群共享库。切换保留旧库，不自动迁移。私聊始终独立。',
        '沙箱环境': '允许此会话运行代码、处理工作区文件，仍可读取其他文件及联网。',
        '称呼': '用于向模型描述消息来源，主要用于图片提示。私聊填写对方名称，群聊可填写统称。',
        '回复门槛': '开启后，模型判断消息是否需要回复；未通过判断时不向 QQ 发送回复。',
        '主动回应': '关闭时仅接收 @大肥鱼、引用大肥鱼或命中点名关键词的消息，@全体不算。开启后接收普通群消息。',
      }
      const 会话名 = (id) => {
        if (!id) return '未选择会话'
        const 会话 = 目标们.find((s) => s.id === id)
        return 会话 ? (会话.标题 || '…' + 短id(会话.id)) : '…' + 短id(id)
      }
      const 状态标 = (开, 名称) => h('span', {
        className: 'qq-bind-mark', 'data-on': 开 ? 'true' : 'false', role: 'img',
        'aria-label': 名称 + (开 ? '：已开启' : '：未开启'),
      }, 开 ? '✓' : '✗')
      const 跳到回复门槛 = () => {
        if (typeof hideHelp === 'function') hideHelp()
        设页('消息策略')
        let 尝试 = 0
        const 滚动到卡片 = () => {
          const 目标 = typeof document !== 'undefined' ? document.getElementById('qq-reply-threshold') : null
          if (目标 && 目标.getClientRects().length) {
            目标.scrollIntoView({ behavior: 'smooth', block: 'center' })
            目标.classList.remove('fish-jump-flash')
            void 目标.offsetWidth
            目标.classList.add('fish-jump-flash')
            setTimeout(() => 目标.classList.remove('fish-jump-flash'), 1500)
            return
          }
          if (++尝试 < 20) setTimeout(滚动到卡片, 60)
        }
        setTimeout(滚动到卡片, 80)
      }
      const 表头格 = 文字 => {
        const 说明 = 字段说明[文字]
        const 帮助链接 = 文字 === '回复门槛' ? { text: '点击跳转回复门槛设置', onClick: 跳到回复门槛 } : null
        const 显示说明 = (e) => { if (typeof help === 'function') help(说明, e.currentTarget, 文字, 帮助链接) }
        const 稍后收起 = () => {
          if (typeof laterHideHelp === 'function') laterHideHelp()
          else if (typeof hideHelp === 'function') hideHelp()
        }
        const 立即收起 = () => { if (typeof hideHelp === 'function') hideHelp() }
        return h('div', { className: 说明 ? 'qq-bind-field-label' : undefined, style: S.表头字 }, 文字,
          说明 ? h('button', {
            type: 'button', className: 'qq-field-help',
            'aria-label': 文字 + '说明：' + 说明, 'data-help': 说明,
            onMouseEnter: 显示说明, onFocus: 显示说明, onClick: 显示说明,
            onMouseLeave: 稍后收起, onBlur: 稍后收起,
            onKeyDown: (e) => { if (e.key === 'Escape') 立即收起() },
          }, '?') : null)
      }

      const 绑定行 = (x, i, 类型) => {
        const 编辑 = 编辑行 === i
        const 是群 = 类型 === '群'
        const 本表编辑中 = 编辑行 != null && ((绑定[编辑行] && (绑定[编辑行].类型 || '群')) === 类型)
        const 请求删除 = async () => {
          if (typeof confirm !== 'function') { 删绑定(i); return }
          const ok = await confirm({
            title: '删除此映射？',
            description: (是群 ? '群 ' : '私聊 ') + String(x.号码 || '未填写') + ' → ' + 会话名(x.会话)
              + '。确认后会从当前草稿移除，确认后立即生效。',
            confirmText: '删除',
            cancelText: '取消',
            danger: true,
          })
          if (ok) 删绑定(i)
        }
        return h(React.Fragment, { key: i },
          h('div', { className: 'qq-bind-row ' + (是群 ? 'qq-bind-row-group' : 'qq-bind-row-private') + (编辑 ? ' qq-bind-editing' : '') },
            !编辑
              ? h('span', { className: 'qq-bind-read', title: String(x.号码 || '') }, String(x.号码 || '—'))
              : h('input', {
                  'aria-label': 是群 ? '群号' : 'QQ 号',
                  style: S.wide, value: String(x.号码 || ''), placeholder: 是群 ? '群号' : 'QQ 号',
                  onChange: (e) => 改绑定(i, { 号码: e.target.value.trim() }),
                }),
            !编辑
              ? h('span', { className: 'qq-bind-read', title: String(x.称呼 || '') }, String(x.称呼 || '—'))
              : h('input', {
                  'aria-label': '对方称呼', style: S.wide, value: String(x.称呼 || ''),
                  placeholder: 是群 ? '群成员' : '对方',
                  onChange: (e) => 改绑定(i, { 称呼: e.target.value }),
                }),
            !编辑
              ? h('span', { className: 'qq-bind-read qq-bind-session-read', title: 会话名(x.会话) }, 会话名(x.会话))
              : h('div', { className: 'qq-bind-session' }, 会话选项(x.会话, (v) => 改绑定(i, { 会话: v }))),
            是群 ? h('div', { className: 'qq-bind-cell qq-bind-center' },
              编辑 ? 勾(x.门槛, (v) => 改绑定(i, { 门槛: v }), '启用回复门槛') : 状态标(Boolean(x.门槛), '回复门槛')) : null,
            是群 ? h('div', { className: 'qq-bind-cell qq-bind-center' },
              编辑 ? 勾(!点名开(x), (v) => 改绑定(i, { 只听点名: !v }), '主动回应') : 状态标(!点名开(x), '主动回应')) : null,
            !是群 ? h('div', { className: 'qq-bind-cell qq-bind-center' },
              编辑 ? 勾(x.主人QQ === true, (v) => 改绑定(i, { 主人QQ: v }), '主人 QQ') : 状态标(x.主人QQ === true, '主人 QQ')) : null,
            是群 ? h('div', { className: 'qq-bind-cell qq-bind-center' },
              编辑 ? h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '隔离群聊记忆 ' + String(x.号码 || ''),
                checked: memoryGroups?.includes(String(x.号码)) || false, disabled: memoryBusy || memoryGroups === null,
                onChange: event => saveMemoryGroup(x.号码, event.target.checked) })
              : memoryGroups === null ? h('span', { 'aria-label': '记忆隔离状态未读取' }, '—')
              : 状态标(memoryGroups.includes(String(x.号码)), '记忆隔离')) : null,
            h('div', { className: 'qq-bind-cell qq-bind-center' },
              编辑 ? 勾(x.沙箱环境 === true, (v) => 改绑定(i, { 沙箱环境: v }), '沙箱环境') : 状态标(x.沙箱环境 === true, '沙箱环境')),
            h('div', { className: 'qq-bind-cell qq-bind-actions' },
              编辑
                ? [
                    null,
                    h('button', { key: 'cancel', type: 'button', className: 'fish-button fish-modal-cancel', disabled: 忙, onClick: () => { 设编辑行(null); 编辑快照.current = null } }, '完成'),
                  ]
                : [
                    h('button', { key: 'edit', type: 'button', className: 'fish-button', disabled: 忙, onClick: () => 开始编辑(i) }, '修改'),
                    h('button', { key: 'delete', type: 'button', className: 'fish-button', disabled: 忙, onClick: async () => { await 请求删除(); await new Promise(resolve => setTimeout(resolve, 0)); await autosave.flush?.() } }, '删除'),
                  ]),
            编辑 || 本表编辑中
              ? h('div', { className: 'qq-bind-cell', 'aria-hidden': true })
              : h('div', { className: 'qq-bind-cell qq-bind-center' },
                  勾(x.开 !== false, (v) => 改绑定(i, { 开: v }), '启用收发 ' + String(x.号码 || '')))),
          是群 && 编辑
            ? h('div', { className: 'qq-bind-detail' },
                h('div', { className: 'qq-bind-detail-head' }, '群规则'),
                h('p', { style: S.dim }, 点名开(x)
                  ? '当前仅接收点名消息，豁免名单中的 QQ 无需点名。'
                  : '当前接收普通群消息。关闭主动回应后可配置点名豁免名单。'),
                点名开(x) ? h('label', { className: 'qq-bind-extra' },
                  h('span', { className: 'qq-bind-extra-label' }, '点名豁免名单（QQ 号，以逗号或空格分隔）'),
                  h('input', {
                    'aria-label': '点名豁免名单',
                    style: { ...S.input, display: 'block', width: '100%', marginTop: 4, boxSizing: 'border-box' },
                    value: String(x.点名例外 || ''),
                    placeholder: '例如 3274796953',
                    onChange: (e) => 改绑定(i, { 点名例外: e.target.value }),
                  })) : null)
            : null)
      }

      const 加映射按钮 = (类型, 文字) => h('button', {
        type: 'button',
        className: 'fish-button' + (编辑行 != null ? ' qq-bind-add-disabled' : ''),
        'aria-disabled': 编辑行 != null || undefined,
        onClick: () => {
          if (编辑行 != null) { 告知('请先完成当前的映射编辑'); return }
          打开新建(类型)
        },
      }, 文字)

      const 私聊卡 = h('div', { style: S.card },
        h('div', { className: 'qq-bind-group-head' },
          h('h3', null, '私聊映射'),
          h('span', { className: 'fish-muted' }, 'QQ 号 → DSH 会话，一行一条。'),
          加映射按钮('私聊', '+ 添加私聊')),
        h('div', { className: 'qq-bind-scroll' },
          h('div', { className: 'qq-bind-table' + (私聊编辑中 ? ' qq-bind-hide-enable' : '') },
            h('div', { className: 'qq-bind-row qq-bind-row-private qq-bind-head' },
              表头格('QQ 号'), 表头格('称呼'), 表头格('目标会话'), 表头格('主人 QQ'), 表头格('沙箱环境'), 表头格('操作'),
              私聊编辑中 ? h('div', { 'aria-hidden': true, style: S.表头字 }) : 表头格('启用')),
            ...私聊们.map(({ x, i }) => 绑定行(x, i, '私聊')),
            私聊们.length ? null : h('div', { className: 'qq-bind-empty' }, '暂无私聊映射。')),
        ),
        h('div', { className: 'qq-bind-note' }, '输入框失焦自动保存，开关即时生效；点击完成结束编辑。'))

      const 群卡 = h('div', { style: S.card },
        memoryError ? h('div', { className: 'memory-feedback', role: 'alert' }, memoryError, h('button', { type: 'button', className: 'fish-button', onClick: loadMemoryGroups }, '重试记忆隔离设置')) : null,
        h('div', { className: 'qq-bind-group-head' },
          h('h3', null, '群聊映射'),
          h('span', { className: 'fish-muted' }, '群号 → DSH 会话；回复门槛与主动回应只对群生效。'),
          加映射按钮('群', '+ 添加群聊')),
        h('div', { className: 'qq-bind-scroll' },
          h('div', { className: 'qq-bind-table' + (群编辑中 ? ' qq-bind-hide-enable' : '') },
            h('div', { className: 'qq-bind-row qq-bind-row-group qq-bind-head' },
              表头格('群号'), 表头格('称呼'), 表头格('目标会话'), 表头格('回复门槛'), 表头格('主动回应'), 表头格('记忆隔离'), 表头格('沙箱环境'), 表头格('操作'),
              群编辑中 ? h('div', { 'aria-hidden': true, style: S.表头字 }) : 表头格('启用')),
            ...群们.map(({ x, i }) => 绑定行(x, i, '群')),
            群们.length ? null : h('div', { className: 'qq-bind-empty' }, '暂无群聊映射。')),
        ),
        h('div', { className: 'qq-bind-note' }, '回复门槛与主动回应仅适用于群聊；输入框失焦自动保存，开关即时生效。'))

      const 绑定提醒 = h('div', { className: 'qq-bind-reminder', role: 'note' },
        h('span', { className: 'qq-bind-reminder-icon', 'aria-hidden': true }, '!'),
        h('span', null, '添加映射时自动创建工作区会话，创建后可修改目标会话。'))

      const 页签 = h('div', { className: 'fish-subnav', style: S.tabBar },
        ...页签们.map((名) => h('button', { type: 'button', key: 名, 'aria-pressed': 页 === 名, style: 页 === 名 ? S.btnOn : S.btn, onClick: () => 设页(名) }, 名)))

      const 更新历史任务 = job => {
        设历史任务(job)
        设历史列表(old => old.some(item => item.id === job.id) ? old.map(item => item.id === job.id ? job : item) : [job, ...old])
      }
      const 历史请求 = async (path, body, memory = false, file = null) => {
        const response = await fetch((memory ? '/dsh-fish-memory' : B + '/history') + path, {
          method: 'POST', headers: file
            ? { 'content-type': 'application/octet-stream', 'x-qq-history-meta': encodeURIComponent(JSON.stringify(body)) }
            : { 'content-type': 'application/json' }, body: file || JSON.stringify(body),
        })
        let result
        try { result = await response.json() } catch { throw new Error(memory ? '记忆模块未加载，请重启 DSH 并检查大肥鱼插件状态' : '导入接口未返回 JSON') }
        if (!response.ok || !result.ok) throw new Error(result.说 || result.error || result.message || '请求失败')
        return result
      }
      const 确认历史 = async source => {
        if (历史控制.running) return
        历史控制.running = true
        设历史忙(true); 设历史说(source === 'file' ? '正在上传并读取记录…' : '正在读取记录…')
        try {
          if (脏) throw new Error('请等待绑定设置保存')
          const binding = 绑定[Number(历史绑定)]
          if (历史绑定 === '' || !binding) throw new Error('请选择 QQ 会话绑定')
          if (source === 'backend' && (!历史日期.start || !历史日期.end)) throw new Error('请选择开始日期和结束日期')
          if (source === 'backend' && 历史日期.start > 历史日期.end) throw new Error('开始日期不能晚于结束日期')
          if (source === 'file' && !历史文件) throw new Error('请选择 OneBot JSON 或 QQ 官方 TXT 文件')
          if (source === 'file' && /\.bak$/i.test(历史文件.name)) throw new Error('QQ .bak 是加密数据库备份，暂不能直接导入；需要原导出账号的数据库解密密钥，其他 QQ 账号的后端不能替代。请使用 OneBot JSON、QQ 官方 TXT，或读取原账号后端记录')
          if (source === 'file' && !/\.(json|txt)$/i.test(历史文件.name)) throw new Error('文件导入仅支持 OneBot JSON 或 QQ 官方 TXT')
          const r = await 历史请求(source === 'file' ? '/upload' : '/prepare', { source, type: binding.类型, number: binding.号码, session: binding.会话,
            aiQQ: 历史AI, startDate: source === 'backend' ? 历史日期.start : undefined,
            endDate: source === 'backend' ? 历史日期.end : undefined, filename: source === 'file' ? 历史文件.name : undefined }, false, source === 'file' ? 历史文件 : null)
          更新历史任务(r.job)
          setHistorySource('list'); 设历史文件(null)
          const list = await get('/history/jobs')
          if (list?.ok) 设历史列表(list.jobs)
          设历史说('记录已加入导入列表，可以开始分析。')
          告知('记录已加入导入列表。', { tone: 'success' })
        } catch (e) { 设历史说('失败：' + e.message); 告知('历史记录读取失败：' + e.message, { holdMs: 6000 }) }
        finally { 历史控制.running = false; 设历史忙(false) }
      }
      const 整理历史 = async 任务 => {
        if (!任务 || 历史控制.running) return
        更新历史任务(任务)
        历史控制.running = true; 历史控制.stop = false
        设历史忙(true)
        try {
          const res = await fetch('/dsh-fish-memory/list', { cache: 'no-store' })
          if (!res.ok) throw new Error('记忆模块未加载，请重启 DSH 并检查大肥鱼插件状态')
          const memory = await res.json()
          if (!memory.ok || !Array.isArray(memory.sessions)) throw new Error('鱼的记忆接口不兼容')
          if (memory.模式 !== 'session' && !任务.memoryStoreId) throw new Error('当前任务缺少独立目标记忆库，请重新读取聊天记录后导入')
          const target = memory.sessions.find(s => s.id === 任务.session)
          if (!memory.全局开关 || !target?.enabled) throw new Error('请在「鱼的记忆」启用总开关及目标会话记忆')
          let job = 任务
          while (!job.done && !历史控制.stop) {
            设历史说(`正在处理 ${job.completed + 1} / ${job.total} 段（消耗模型额度）…`)
            const analysis = await 历史请求('/analyze', { id: job.id })
            job = analysis.job; 更新历史任务(job)
            if (历史控制.stop) break
            if (analysis.done) { job = analysis.job; break }
            const pending = analysis.pending
            let receipt = { ok: true, added: 0, batch: null }
            if (pending.items.length) receipt = await 历史请求('/import/apply', { session: job.session, storeId: job.memoryStoreId, items: pending.items }, true)
            const committed = await 历史请求('/commit', { id: job.id, token: pending.token, result: receipt })
            job = committed.job; 更新历史任务(job)
          }
          更新历史任务(job)
          设历史说(job.done ? '处理完成，可在「鱼的记忆」核查结果。' : '已暂停，可从已保存进度继续。')
          告知(job.done ? '历史整理完成，可在「鱼的记忆」核查结果。' : '历史整理已暂停，进度已保存。', { tone: job.done ? 'success' : undefined, holdMs: 6000 })
          const list = await get('/history/jobs')
          if (list?.ok) 设历史列表(list.jobs)
        } catch (e) { 设历史说('失败：' + e.message + '；进度已保存，可重试。'); 告知('历史整理失败：' + e.message + '；进度已保存，可重试。', { holdMs: 7000 }) }
        finally { 历史控制.running = false; 设历史忙(false) }
      }
      const 历史页 = h('div', { className: 'qq-history-page', style: S.stack },
        h('section', { className: 'fish-card' },
          h('h2', null, '聊天记录'),
          h('p', { className: 'fish-muted' }, '选择来源，确认后在导入列表中开始或继续分析。'),
          h('nav', { className: 'qq-history-sources', 'aria-label': '聊天记录来源' },
            ...[['file', '导入文件', 'OneBot JSON / QQ 官方 TXT'], ['backend', '读取后端', '按日期读取 QQ 记录'], ['list', '导入列表', '查看记录、进度和完成状态']].map(([key, title, hint]) =>
              h('button', { key, type: 'button', className: 'fish-button', 'aria-label': title, 'aria-pressed': historySource === key, disabled: 历史忙,
                onClick: () => { setHistorySource(key); 设历史任务(null); 设历史说('') } }, h('strong', null, title), h('span', null, hint))))),
        historySource !== 'list' ? h('section', { className: 'fish-card' },
          h('h3', null, '选择目标与记录'),
          行('目标会话绑定', h('select', { style: S.wide, value: 历史绑定, disabled: 历史忙, 'aria-label': '历史导入绑定', onChange: e => { 设历史绑定(e.target.value); 设历史任务(null) } },
            h('option', { value: '' }, '请选择已保存的绑定'),
            ...绑定.map((b, i) => {
              const 称呼 = String(b.称呼 || '').trim() || (b.类型 === '群' ? '未命名群' : '未命名')
              return h('option', { key: i, value: String(i) }, `${b.类型} ${称呼} - ${b.号码}`)
            }))),
          行('AI 对应的 QQ 号（选填）', h('input', { style: S.input, value: 历史AI, disabled: 历史忙, 'aria-label': 'AI 对应的 QQ 号', onChange: e => 设历史AI(e.target.value) }),
            '指定 AI 身份对应的 QQ 号；留空则保留原发言人姓名。'),
          historySource === 'backend' ? h(React.Fragment, null,
            行('开始日期', h('input', { style: S.input, type: 'date', value: 历史日期.start, max: 历史日期.end || undefined, required: true, disabled: 历史忙, 'aria-label': '开始日期',
              onChange: e => { 设历史日期({ ...历史日期, start: e.target.value }); 设历史任务(null) } })),
            行('结束日期', h('input', { style: S.input, type: 'date', value: 历史日期.end, min: 历史日期.start || undefined, required: true, disabled: 历史忙, 'aria-label': '结束日期',
              onChange: e => { 设历史日期({ ...历史日期, end: e.target.value }); 设历史任务(null) } }),
              '按北京时间筛选，包含结束当天；仅覆盖当前账号的后端可见记录。'))
          : 行('聊天记录文件', h('input', { type: 'file', accept: '.json,.txt,.bak', disabled: 历史忙, 'aria-label': '聊天记录文件', onChange: e => 设历史文件(e.target.files?.[0] || null) }),
            '上传文件越大，整理记忆时通常会消耗更多 Token。'),
          按钮('确认', () => 确认历史(historySource), true, 历史忙),
          h('div', { role: 'status' }, 历史说)) : null,
        historySource === 'list' ? h('section', { className: 'fish-card qq-history-review' },
          h('h3', null, '导入列表'),
          !历史列表.length ? h('p', { className: 'fish-muted' }, '暂无导入记录。') : null,
          h('div', { className: 'qq-history-jobs' }, ...历史列表.map(job => h('button', {
            key: job.id, type: 'button', className: 'qq-history-job', 'aria-label': '导入记录 ' + job.filename,
            'aria-pressed': 历史任务?.id === job.id, disabled: 历史忙, onClick: () => { 设历史任务(job); 设历史说('') },
          }, h('span', null, h('strong', null, job.filename), h('small', { className: 'fish-muted' }, `${job.binding.类型} ${job.binding.号码} · ${job.count} 条 · ${job.completed}/${job.total} 段`)),
          h('span', { className: 'fish-muted' }, job.done ? '已完成' : 历史忙 && 历史任务?.id === job.id ? '分析中' : job.pending || job.completed ? '已暂停' : '待分析')))),
          历史任务 ? h('div', { className: 'qq-history-detail' },
            h('div', null, `目标：${历史任务.binding.类型} ${历史任务.binding.号码} → ${历史任务.session}；AI QQ：${历史任务.aiQQ || '未指定'}`),
            历史任务.dateRange ? h('div', null, `所选日期：${历史任务.dateRange.start} ～ ${历史任务.dateRange.end}（北京时间，含结束日）`) : null,
            h('div', null, `记录时间：${历史任务.start || '未知'} ～ ${历史任务.end || '未知'}`),
            h('p', { className: 'fish-muted' }, 历史任务.warning),
            h('progress', { value: 历史任务.completed, max: 历史任务.total, 'aria-label': '历史导入进度' }),
            按钮(历史任务.done ? '已完成' : 历史任务.completed || 历史任务.pending ? '继续分析' : '开始分析', () => 整理历史(历史任务), true, 历史忙 || 历史任务.done),
            历史忙 ? 按钮('中断分析', () => { 历史控制.stop = true; 设历史说('正在暂停，等待当前段保存…') }, false, false) : null,
          ) : null,
          h('div', { role: 'status', style: { whiteSpace: 'pre-wrap' } }, 历史说)) : null,
        h('details', { className: 'qq-history-export' }, h('summary', null, '如何导出 OneBot JSON'),
          h('p', { className: 'fish-muted' }, 'OneBot 没有统一导出按钮。通过后端 API 调试工具或 HTTP 调用 get_group_msg_history（group_id）或 get_friend_msg_history（user_id），将成功响应另存为 UTF-8 .json。一次响应只是一页；多页请合并 data.messages 为一个消息数组。JSON 无需备份密码，导出账号可与当前后端不同。')),
      )

      // ───────────── 总览 ─────────────
      const 总开关卡片 = h('div', { style: S.card },
        h('div', { style: { ...S.h, margin: '0 0 8px' } }, '大肥鱼，启动！'),
        行('总开关', 勾(配置.总开关, async v => {
          if (启动检查中 || 忙) return
          const 校验号 = ++总开关校验.current
          设启动检查中(true)
          const r = await post('/power', { 开: v, 配置: { ...配置, 总开关: v } })
          if (总开关校验.current !== 校验号) return
          设启动检查中(false)
          if (!r?.ok) {
            告知(r?.说 || '总开关切换失败，请确认 DSH 后端正在运行后重试。', { holdMs: 14000 })
            return
          }
          设态(r)
          设已存绑定(Array.isArray(r.配置?.绑定) ? r.配置.绑定 : [])
          设脏(false)
          if (r.用户) 设态(旧 => 旧 ? { ...旧, NapCat状态: { 用户: r.用户, 昵称: r.昵称 } } : 旧)
          告知(r.说 || (v ? '大肥鱼已启动' : '大肥鱼已停止'), { tone: 'success', holdMs: v ? 6000 : 3000 })
        }, '大肥鱼总开关', 启动检查中 || 忙), 启动检查中 ? '正在切换总开关…' : undefined),
        行('绑定工作区', h('select', { 'aria-label': '绑定工作区', style: S.input, value: 配置.工作区 || '', onFocus: 刷新会话, onChange: e => 改('工作区', e.target.value) },
          h('option', { value: '' }, '请选择工作区'),
          配置.工作区 && !(态.工作区列表 || []).some(w => w.id === 配置.工作区) ? h('option', { value: 配置.工作区, disabled: true }, '原绑定工作区已不可用，请重新选择') : null,
          ...(态.工作区列表 || []).map(w => h('option', { key: w.id, value: w.id, disabled: w.available === false }, w.title + ' · ' + w.path + (w.available === false ? '（目录不可用）' : '')))),
          '选择 QQ 绑定工作区'),
        态.工作区错误 ? h('p', { style: S.dim, role: 'alert' }, 态.工作区错误) : null,
      )
      const 总览卡片 = [
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '基础策略与通知'),
          行('试运行', 勾(配置.试运行, (v) => 改('试运行', v)), '默认关闭。启用后仅记录发送日志，不实际发送 QQ 消息。'),
          // ⭐ 1.5.0（issue #29）：戳一戳这类通知 —— 它们不是消息，拉历史拉不到，只能让 OneBot 主动推
          行('接收 QQ 通知', 勾(配置.收通知, (v) => 改('收通知', v)),
            '通知通过 OneBot HTTP 上报接收。'
            + '上报地址：'
            + 'http://127.0.0.1:<DSH 端口>' + B + '/notice。'
            + '申请审批由“QQ 账号”单独控制，消息仍通过轮询接收。'),
          行('上报口令（选填）', h('input', {'aria-label': '通知口令',
            style: S.wide,
            value: String(配置.通知口令 || ''),
            placeholder: '留空不校验口令',
            onChange: (e) => 改('通知口令', e.target.value),
          }), '填写后，上报地址须附带 ?token=口令。留空时普通通知沿用兼容模式，申请审批上报必须配置口令。'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '会话绑定（' + 绑定.length + ' 条）'),
          绑定.length === 0
            ? h('div', { style: S.dim }, '暂无绑定，请在「绑定」中添加 QQ 与 DSH 会话映射。')
            : h('div', null,
              ...绑定.map((x, i) => h('div', { key: i, style: { marginBottom: 4 } },
                (x.类型 === '群' ? '群 ' : '私聊 ') + String(x.号码 || '?')
                + ' → ' + (x.会话 ? 短id(x.会话) : '未选择会话')
                + (x.称呼 ? '　称呼：' + x.称呼 : '')
                + (x.类型 === '群' && x.门槛 ? '　回复门槛：已启用' : '')))),
          h('div', { style: { marginTop: 6 } }, 按钮('管理配置', () => 设页('绑定'))),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '最近 ' + 日志.length + ' 条日志（按时间升序）'),
          h('div', { style: { marginTop: 6, maxHeight: 220, overflowY: 'auto' } },
            日志.length === 0
              ? h('div', { style: S.dim }, '暂无日志。')
              : 日志.map((条, i) => h('div', { key: i, style: S.日志行 }, 条.时间 + '　' + 条.文本))),
        ),
      ]

      // ───────────── 绑定 ─────────────
      const 特殊设定卡片 = h('div', { style: S.card },
        h('div', { className: 'qq-role-head' },
          h('h2', { style: { ...S.h, margin: 0 } }, '特殊设定'),
          h('label', { className: 'qq-role-toggle', title: '启用或停用特殊设定' },
            h(Switch, {
              'aria-label': '启用特殊设定', type: 'checkbox', role: 'switch',
              checked: Boolean(配置.特殊设定开),
              disabled: 人设忙 || 忙 || (!配置.特殊设定开 && !String(配置.特殊设定 || '').trim()),
              onChange: (e) => 切换人设(e.target.checked, '特殊设定'),
            }))),
        h('p', { className: 'qq-role-desc' }, '全局生效，优先于会话独立设定。默认约束为“有且仅有一个大肥鱼”。'),
        h('textarea', {
          'aria-label': '特殊设定', maxLength: 20000,
          style: { ...S.input, display: 'block', width: '100%', height: 176, marginTop: 14, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' },
          value: String(配置.特殊设定 || ''),
          placeholder: '输入应用到所有 QQ 绑定会话的特殊设定。',
          onChange: (e) => 改('特殊设定', e.target.value),
        }),
      )
      const 绑定卡片 = [
        h('div', { style: S.card },
          h('div', { className: 'qq-role-head' },
            h('h2', { style: { ...S.h, margin: 0 } }, '全局角色设定'),
            h('label', { className: 'qq-role-toggle', title: String(配置.人设 || '').trim() || 配置.人设开 ? '启用或停用全局角色设定' : '请先填写全局角色设定' },
              h(Switch, {
                'aria-label': '启用角色设定', type: 'checkbox', role: 'switch',
                checked: Boolean(配置.人设开),
                disabled: 人设忙 || 忙 || (!配置.人设开 && !String(配置.人设 || '').trim()),
                onChange: (e) => 切换人设(e.target.checked),
              }))),
          h('p', { className: 'qq-role-desc' }, '未配置独立角色的会话使用全局设定。'),
          h('p', { className: 'qq-role-hint' }, '建议简洁描述，减少上下文占用。'),
          h('textarea', {'aria-label': '人设',
            style: { ...S.input, display: 'block', width: '100%', height: 88, marginTop: 14, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5, boxSizing: 'border-box' },
            value: String(配置.人设 || ''),
            placeholder: '输入角色身份、表达风格与交互要求。',
            onChange: (e) => 改('人设', e.target.value),
          }),
        ),
        h('div', { className: 'qq-binding-groups' }, 私聊卡, 群卡,
        新建映射 ? h(typeof FishModal === 'function' ? FishModal : 'div', { className: 'fish-modal', onMouseDown: (e) => { if (e.target === e.currentTarget && !新建忙) { 设新建映射(null); 设新建错误('') } } },
          h('div', { className: 'fish-modal-card qq-bind-add-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'qq-bind-add-title',
            onKeyDown: (e) => { if (e.key === 'Escape' && !新建忙) { 设新建映射(null); 设新建错误('') } } },
            h('span', { className: 'fish-kicker' }, 'BIND · 新建映射'),
            h('h2', { id: 'qq-bind-add-title' }, 新建映射.类型 === '群' ? '添加群聊映射' : '添加私聊映射'),
            h('div', { className: 'qq-bind-modal-fields' },
              h('label', { className: 'qq-bind-modal-field' },
                h('span', null, 新建映射.类型 === '群' ? '群号' : 'QQ 号'),
                h('input', { style: S.wide, value: 新建映射.号码, inputMode: 'numeric', placeholder: 新建映射.类型 === '群' ? '填写群号' : '填写 QQ 号', onChange: (e) => { const v = e.target.value.trim(); 设新建映射(old => ({ ...old, 号码: v })); 安排拉名称(新建映射.类型, v) } })),
              h('label', { className: 'qq-bind-modal-field' },
                h('span', null, 新建映射.类型 === '群' ? '群名' : 'QQ 昵称'),
                h('input', { style: S.wide, value: 新建映射.称呼, placeholder: 新建映射.类型 === '群' ? '填写或自动获取群名' : '填写或自动获取 QQ 昵称', onChange: (e) => 设新建映射(old => ({ ...old, 称呼: e.target.value })) })),
              新建查名说 ? h('div', { className: 'qq-bind-modal-lookup', role: 'status' }, 新建查名说) : null,
              新建映射.类型 === '群' ? h('div', { className: 'qq-bind-modal-toggles' },
                h('label', { className: 'qq-bind-modal-toggle' }, h('span', null, '启用回复门槛'), 勾(新建映射.门槛, (v) => 设新建映射(old => ({ ...old, 门槛: v })), '启用回复门槛')),
                h('label', { className: 'qq-bind-modal-toggle' }, h('span', null, '主动回应'), 勾(新建映射.主动, (v) => 设新建映射(old => ({ ...old, 主动: v })), '主动回应')),
                h('label', { className: 'qq-bind-modal-toggle' }, 表头格('记忆隔离'), h(Switch, {
                  type: 'checkbox', role: 'switch', 'aria-label': '记忆隔离',
                  checked: 新建映射.记忆隔离 ?? (memoryGroups?.includes(String(新建映射.号码)) || false), disabled: memoryGroups === null || 新建忙,
                  onChange: event => 设新建映射(old => ({ ...old, 记忆隔离: event.target.checked })) }))) : null,
              新建映射.类型 === '私聊' ? h('label', { className: 'qq-bind-modal-toggle' }, 表头格('主人 QQ'), 勾(新建映射.主人QQ === true, (v) => 设新建映射(old => ({ ...old, 主人QQ: v })), '主人 QQ')) : null,
              h('label', { className: 'qq-bind-modal-toggle' }, 表头格('沙箱环境'), 勾(新建映射.沙箱环境 === true, (v) => 设新建映射(old => ({ ...old, 沙箱环境: v })), '沙箱环境')),
              h('label', { className: 'qq-bind-modal-toggle' }, h('span', null, '启用收发'), 勾(新建映射.开 !== false, (v) => 设新建映射(old => ({ ...old, 开: v })), '启用收发'))),
            新建错误 ? h('p', { className: 'fish-modal-error', role: 'alert' }, 新建错误) : null,
            h('div', { className: 'fish-modal-actions' },
              h('button', { type: 'button', className: 'fish-button fish-primary', disabled: 新建忙, onClick: () => { void 创建映射() } }, 新建忙 ? '创建中…' : '创建并绑定'),
              h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: 新建忙, onClick: () => { 设新建映射(null); 设新建错误('') } }, '取消')))) : null),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '群聊频率与概率'),
          h('div', { style: S.dim },
            '以下设置控制群聊处理频率与回复概率。'),
          行('回复冷却时间（秒）', h('input', {'aria-label': '回复冷却秒',  type: 'number', min: 0, max: 300, style: S.small, value: String(配置.回复冷却秒 ?? 5), onChange: (e) => 改('回复冷却秒', Number(e.target.value)) }), '冷却期间的消息等待合并处理，默认 5 秒。'),
          行('每分钟处理上限（条）', h('input', {'aria-label': '每分钟最多条',  type: 'number', min: 1, max: 120, style: S.small, value: String(配置.每分钟最多条 ?? 4), onChange: (e) => 改('每分钟最多条', Number(e.target.value)) }), '超出限制的消息等待下一时间窗口，默认 4 条。'),
          行('单批合并上限（条）', h('input', {'aria-label': '合并最多条',  type: 'number', min: 1, max: 50, style: S.small, value: String(配置.合并最多条 ?? 8), onChange: (e) => 改('合并最多条', Number(e.target.value)) }), '合并时保留发言人标识，默认 8 条。'),
          行('私聊来源标识', h('select', {'aria-label': '私聊署名',  style: S.small, value: String(配置.私聊署名 || '关'), onChange: (e) => 改('私聊署名', e.target.value) },
            h('option', { value: '关' }, '无标识'), h('option', { value: '前缀' }, '[QQ] 前缀'), h('option', { value: '署名' }, '署名（对方：…）')),
            '区分 QQ 消息与 DSH 手动输入，默认启用。'),
          行('点名消息必回', h(Switch, {'aria-label': '点名必回',  type: 'checkbox', role: 'switch', checked: 配置.点名必回 !== false, onChange: (e) => 改('点名必回', Boolean(e.target.checked)) }), '默认启用；禁用后，点名消息也受回复概率限制。'),
          行('回复概率（%）', h('input', {'aria-label': '回复概率',  type: 'number', min: 0, max: 100, style: S.small, value: String(配置.回复概率 ?? 100), onChange: (e) => 改('回复概率', Number(e.target.value)) }), '默认 100%；未选中的消息不进入模型上下文。'),
          h('div', { style: { ...S.dim, marginTop: 4 } }, '合并窗口可在「消息收发」中配置，默认 3 秒。'),
        ),
      ]

      // ───────────── 消息 ─────────────
      const 消息卡片 = [
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, 'QQ 后端连接'),
          行('接口地址', h('input', {'aria-label': 'QQ 后端连接', style: S.wide, value: String(配置.NapCat || 'http://127.0.0.1:3000'), onChange: (e) => 改('NapCat', e.target.value) }), 'OneBot HTTP 地址'),
          行('接口令牌', h('input', {'aria-label': '令牌', type: 'password', style: S.wide, value: String(配置.令牌 || ''), onChange: (e) => 改('令牌', e.target.value) }), 'HTTP API 服务 -> 鉴权 -> 授权 Token'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '发送格式'),
          行('仅发送 [QQ] 标记内容', 勾(配置.只发标记内, (v) => 改('只发标记内', v)), '仅发送 [QQ]…[/QQ] 内的内容；转入消息会附带格式提示。'),
          行('仅转发 QQ 触发的回复', 勾(配置.只回QQ唤醒, (v) => 改('只回QQ唤醒', v)), '默认开启，仅转发 QQ 消息及获准自动触发的回复。'),
          行('包含自动触发的回复', 勾(配置.自动触发也发, (v) => 改('自动触发也发', v)), '默认开启，包含主动消息和定时任务；DSH 手动对话不转发。'),
          行('拆分长回复', 勾(配置.长回复拆段, (v) => 改('长回复拆段', v)), '默认按空行拆分；禁用后整段发送。'),
          行('按句拆分', 勾(配置.按句拆, (v) => 改('按句拆', v)), '按句末标点拆分，括号内标点除外；默认禁用。'),
          行('分段发送间隔（毫秒）', h('input', {'aria-label': '拆段间隔毫秒',  type: 'number', min: 0, max: 5000, style: S.small, value: String(配置.拆段间隔毫秒 ?? 450), onChange: (e) => 改('拆段间隔毫秒', Number(e.target.value)) }), '仅在启用拆分时生效，默认 450 毫秒。'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '接收与合并'),
          行('合并窗口（秒）', h('input', {'aria-label': '合并窗口秒',  type: 'number', min: 0, max: 60, style: S.small, value: String(配置.合并窗口秒 ?? 3), onChange: (e) => 改('合并窗口秒', Number(e.target.value)) }), '同一发言人的连续消息合并处理；0 为禁用，默认 3 秒。'),
          行('最长合并等待（秒）', h('input', {'aria-label': '合并最多秒',  type: 'number', min: 3, max: 300, style: S.small, value: String(配置.合并最多秒 ?? 20), onChange: (e) => 改('合并最多秒', Number(e.target.value)) }), '达到时限后处理已接收的消息，默认 20 秒。'),
          行('消息轮询间隔（毫秒）', h('input', {'aria-label': '轮询间隔毫秒',  type: 'number', min: 800, max: 30000, style: S.small, value: String(配置.轮询间隔毫秒 ?? 2000), onChange: (e) => 改('轮询间隔毫秒', Number(e.target.value)) }), '默认 2000 毫秒，输入框失焦后立即调整轮询间隔。'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, 'QQ 图片接收'),
          行('接收图片（QQ → DSH）', 勾(配置.收图, (v) => 改('收图', v)), '将 QQ 消息中的图片交给 DSH 理解，受图片页的单张大小上限约束。'),
          行('每条消息最多接收图片', h('input', {'aria-label': '收图最多', type: 'number', min: 1, max: 10, style: S.small, value: String(配置.收图最多 ?? 4), onChange: (e) => 改('收图最多', Number(e.target.value)) }), '接收最多 10 张，超出部分跳过。'),
          行('开启图片存储', 勾(配置.图片存储, v => 改('图片存储', v)), '默认关闭。开启后额外保存 QQ 接收图片的原图；关闭只停止新增归档，不影响 DSH 正常接收与理解图片。'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, 'DSH 生成文件转发'),
          行('发送文件（DSH → QQ）', 勾(配置.发文件, (v) => 改('发文件', v)), '默认关闭。启用后将回复中的生成文件上传至 QQ；图片语法单独处理。'),
          行('单文件上限（MB）', h('input', {'aria-label': '文件上限MB',  type: 'number', min: 1, max: 2048, style: S.small, value: String(配置.文件上限MB ?? 50), onChange: (e) => 改('文件上限MB', Number(e.target.value)) }), '超限时发送说明；同时受 QQ 后端限制。'),
          行('文件仅发送至私聊', 勾(配置.文件仅私聊 !== false, (v) => 改('文件仅私聊', v)), '默认关闭，不限制为私聊；启用后禁止向群聊上传文件。'),
          h('div', { style: S.dim }, '含空格的路径需使用尖括号：[报告](<D:\\我的 文档\\报告.docx>)。网页链接不作为文件处理。'),
        ),
        h('div', { className: 'qq-voice-card', style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 18px' } }, '语音转写'),
          行('转写语音（DSH → QQ）', 勾(配置.语音转写, (v) => 改('语音转写', v)), '使用指定命令转写语音，禁用时保留语音标记。'),
          // —— 一键装依赖 ——
          h('div', { className: 'fish-form-row qq-voice-env', style: { ...S.row, alignItems: 'flex-start' } },
            h('div', { className: 'fish-form-label', style: S.lab }, '语音识别环境'),
            h('div', { className: 'fish-control', style: S.ctl },
              h('div', { className: 'qq-voice-actions' },
                按钮(asr忙 ? '…' : (asr && asr.就绪 ? '重新安装' : '安装语音依赖'), 装语音, !(asr && asr.就绪), asr忙 || Boolean(asr && asr.进行中)),
                按钮('生成转写命令', 填语音命令, false, false)),
              h('div', { style: S.hint },
                asr && asr.就绪 && asr.模型就绪
                  ? '环境与模型已就绪：' + String(asr.python || '')
                  : asr && asr.就绪
                    ? '环境已就绪，模型未下载完成，可重新安装以继续下载。'
                  : '安装独立环境及 sherpa-onnx、numpy 和语音模型。'),
              // 进度
              asr && asr.步骤 && asr.步骤.length
                ? h('div', { style: { marginTop: 8 } },
                  ...asr.步骤.map((x, i) => h('div', { key: i, style: { fontSize: 'var(--fish-small)' } },
                    (x.态 === '完成' ? '' : x.态 === '失败' ? '失败：' : '⋯ ') + x.名 + (x.附 ? '（' + x.附 + '）' : ''))))
                : null,
              // —— 下载进度条（模型 230MB，得让人看见下了多少）——
              asr && asr.下载
                ? h('div', { style: { marginTop: 8 } },
                  h('div', { style: { height: 8, borderRadius: 6, background: 'var(--fish-line)', overflow: 'hidden' } },
                    h('div', {
                      style: {
                        height: '100%', width: String(asr.下载.百分比 || 0) + '%',
                        background: 'var(--dsw-alias-state-business-primary)', transition: 'width .4s',
                      },
                    })),
                  h('div', { style: { ...S.dim, marginTop: 4 } },
                    (asr.下载.文件 ? '正在下载 ' + asr.下载.文件 + '：' : '')
                    + '已下载 ' + Math.round((asr.下载.已收 || 0) / 1048576) + 'MB'
                    + (asr.下载.总 ? ' / ' + Math.round(asr.下载.总 / 1048576) + 'MB' : '')
                    + '（' + String(asr.下载.百分比 || 0) + '%）'
                    + (asr.下载.速度KB ? '　约 ' + (asr.下载.速度KB > 1024 ? (asr.下载.速度KB / 1024).toFixed(1) + 'MB/s' : asr.下载.速度KB + 'KB/s') : '')))
                : null,
              asr && asr.进行中 ? h('div', { style: { ...S.dim, marginTop: 4 } }, '正在安装，已用时 ' + String(asr.用时秒 || 0) + ' 秒（每 2 秒刷新一次）') : null,
              asr && asr.失败 ? h('div', { style: { color: 'var(--fish-danger)', fontSize: 'var(--fish-small)', marginTop: 4 } }, '失败：' + asr.失败) : null,
              asr && asr.日志
                ? h('div', { style: { marginTop: 8 } },
                  h('div', { style: S.dim }, '安装日志'),
                  h('div', { style: { ...S.日志行, maxHeight: 160, overflowY: 'auto', whiteSpace: 'pre-wrap', marginTop: 4 } }, String(asr.日志)))
                : null)),
          行('转写命令', h('input', {'aria-label': '转写命令',
            style: S.wide,
            placeholder: 'python D:\\asr_cli.py "{file}"',
            value: String(配置.转写命令 || ''),
            onChange: (e) => 改('转写命令', e.target.value),
          }), '命令须包含 {file}，向 stdout 输出转写文本；非零退出码视为失败。'),
          行('语音模型目录', h('input', {'aria-label': '语音模型目录',
            style: S.wide,
            placeholder: '安装依赖后自动填写',
            value: String(配置.语音模型目录 || ''),
            onChange: (e) => 改('语音模型目录', e.target.value),
          }), '安装时自动下载模型并填写目录；使用自备模型时可手动修改。'),
          行('超时（秒）', h('input', {'aria-label': '转写超时秒',  type: 'number', min: 5, max: 600, style: S.small, value: String(配置.转写超时秒 ?? 60), onChange: (e) => 改('转写超时秒', Number(e.target.value)) }), '超时后终止命令，默认 60 秒。'),
          h('div', { className: 'qq-voice-cost' },
            h('p', { className: 'qq-voice-cost-intro' }, '语音转写的本地性能开销如下'),
            h('table', { className: 'qq-voice-cost-table' },
              h('thead', null, h('tr', null, h('th', { scope: 'col' }, '项目'), h('th', { scope: 'col' }, '预计开销'))),
              h('tbody', null, ...[
                ['CPU', '当前默认使用 4 个推理线程，转写期间短暂占用 CPU'],
                ['内存', '每次识别进程可先预留约 0.5～1.5GB'],
                ['本地处理延迟', '可先按每条约 1～5 秒预留，另加下载及格式转换时间'],
                ['磁盘', '模型约 230MB，连同 Python 环境和依赖建议预留 1～2GB'],
                ['API 费用', '本地识别不产生 API 费用；转写文字交给 DeepSeek 后，对话用量照常计算'],
              ].map(([项目, 开销]) => h('tr', { key: 项目 }, h('th', { scope: 'row' }, 项目), h('td', null, 开销))))),
            h('p', { className: 'qq-voice-cost-note' },
              '每条语音独立启动 Python 并加载模型，完成后退出。连续语音将增加加载开销和消息处理等待。')),
        ),
      ]

      // ───────────── 门槛 ─────────────
      const 门槛卡片 = [
        h('div', { id: 'qq-reply-threshold', style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '回复门槛'),
          h('div', { style: S.dim },
            '回复门槛按绑定单独启用。'
            + '私聊不执行门槛判断。'),
          h('div', { style: { ...S.dim, marginTop: 6 } },
            '模型判断消息是否需要回复；未通过判断时不向 QQ 发送回复。'),
          行('未通过门槛时终止推理', 勾(配置.门槛真停轮, (v) => 改('门槛真停轮', v)), '默认仅阻止转发；启用后终止当前轮次，可能显示 tool call aborted。'),
          h('div', { style: { ...S.dim, marginTop: 6 } },
            '启用门槛会新增工具，目标会话的下一次请求可能重新计算上下文。'),
          行('点名关键词', h('input', {'aria-label': '点名关键词',
            style: S.wide,
            value: String(配置.点名关键词 || ''),
            placeholder: '留空仅识别 @ 和引用',
            onChange: (e) => 改('点名关键词', e.target.value),
          }), '正文匹配关键词时视为点名；多个关键词以逗号或空格分隔。'),
          // ⭐ 群聊接收范围已挪到「绑定」页每条群绑定自己的「主动回应」开关；
          //    旧配置里 只听点名 == null 的群会在保存时固化，不再需要这个全局开关。
          h('div', { style: { ...S.dim, marginTop: 8 } },
            '群聊接收范围由“绑定”中的“主动回应”控制，保存时同步旧配置。'),
          // ⭐ 1.4.1：被点名之后，同一个群后面紧跟着的几句也放进来（不然接话接不上前文）
          行('点名后续接收上限（条）', h('input', {'aria-label': '点名后接听条',  type: 'number', min: 0, max: 50, style: S.small, value: String(配置.点名后接听条 ?? 5), onChange: (e) => 改('点名后接听条', Number(e.target.value)) }),
            '点名后继续接收同群后续消息，默认 5 条；0 为禁用。'),
          行('点名后续接收时限（秒）', h('input', {'aria-label': '点名后接听秒',  type: 'number', min: 0, max: 600, style: S.small, value: String(配置.点名后接听秒 ?? 120), onChange: (e) => 改('点名后接听秒', Number(e.target.value)) }),
            '到期后恢复仅接收点名消息，默认 120 秒。'),
        ),
      ]

      // ───────────── 空间 ─────────────
      const 空间定时 = () => {
        const a = 配置.空间定时发
        return Array.isArray(a) ? a : []
      }
      const 设空间定时 = (下一份) => 改('空间定时发', 下一份)
      const 改空间定时 = (i, 补) => 设空间定时(空间定时().map((x, j) => (j === i ? { ...x, ...补 } : x)))
      const 加空间定时 = () => 设空间定时([...空间定时(), { 时: '09:30', 权: 1, 开: true }].slice(0, 12))
      const 删空间定时 = (i) => 设空间定时(空间定时().filter((_, j) => j !== i))

      const 空间卡片 = [
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '开关'),
          行('允许发布 QQ 空间动态', 勾(配置.允许发空间动态, (v) => 改('允许发空间动态', v)), '默认禁用发布，不影响查看动态。'),
          行('浏览动态与评论', 勾(配置.空间浏览开 !== false, (v) => 改('空间浏览开', v)), '关闭后隐藏手动浏览卡片；不影响定时发布和自动同步。'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '定时发布'),
          h('div', { style: S.dim }, '按宿主时区每分钟检查，定时提醒已绑定且打开的会话，由模型决定发布。可见范围以实际调用参数为准。需启用空间发布，独立于消息总开关和试运行。'),
          h('div', { className: 'fish-schedule-row fish-binding-head', style: { ...S.空间表头, marginTop: 10 } },
            h('div', { style: S.表头字 }, '时间'),
            h('div', { style: S.表头字 }, '提示可见范围'),
            h('div', { style: S.表头字 }, '启用'),
            h('div', { style: S.表头字 }, '')),
          空间定时().length === 0
            ? h('div', { style: { ...S.dim, margin: '8px 0' } }, '暂无条目，请添加。')
            : h('div', null, ...空间定时().map((x, i) => h('div', { key: i, className: 'fish-schedule-row', style: S.空间行 },
              h('input', {'aria-label': '发布时间 ' + (i + 1),
                type: 'time', style: S.wide, value: String(x.时 || '09:30'),
                onChange: (e) => 改空间定时(i, { 时: e.target.value }),
              }),
              h('select', {'aria-label': '可见范围 ' + (i + 1),
                style: S.wide, value: String(x.权 || 1),
                onChange: (e) => 改空间定时(i, { 权: Number(e.target.value) }),
              },
                h('option', { value: '1' }, '所有人'),
                h('option', { value: '4' }, '好友'),
                h('option', { value: '64' }, '仅自己')),
              h('div', null, 勾(x.开 !== false, (v) => 改空间定时(i, { 开: v }), '启用计划 ' + (i + 1))),
              h('div', null, 按钮('删除', () => 删空间定时(i), false, false))))),
          h('div', { style: { marginTop: 8 } },
            按钮('+ 添加条目', 加空间定时, false, false),
            h('span', { style: S.dim }, '　最多 12 条')),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '好友动态同步'),
          行('同步间隔（分钟）', h('input', {'aria-label': '空间看圈分',  type: 'number', min: 5, max: 1440, style: S.small, value: String(配置.空间看圈分 ?? 30), onChange: (e) => 改('空间看圈分', Number(e.target.value)) }), '5～1440，默认 30。'),
          行('启用同步', 勾(配置.空间看圈开, (v) => 改('空间看圈开', v)), '至少启用点赞或动态递送之一才会请求好友动态；空间任务不受消息转发总开关和试运行控制。'),
        ),
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '点赞 / 评论'),
          行('自动点赞', 勾(配置.空间点赞开, (v) => 改('空间点赞开', v)), '同步时点赞近期未处理动态，每次最多 3 条、每日最多 20 条。'),
          行('递送动态给模型（评论提醒）', 勾(配置.空间评论开, (v) => 改('空间评论开', v)), '将新动态转入会话。发表评论需会话具备相应工具，此开关不自动发表评论。'),
        ),
      ]

      const 角色编辑图标 = () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' },
        h('path', { d: 'M4 20h4l10-10-4-4L4 16v4Z' }), h('path', { d: 'm13 7 4 4' }))
      const 角色删除图标 = () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' },
        h('path', { d: 'M4 7h16' }), h('path', { d: 'M9 7V4h6v3' }), h('path', { d: 'm6 7 1 13h10l1-13' }), h('path', { d: 'M10 11v5M14 11v5' }))

      const 角色会话名 = id => {
        if (!id) return '未选择会话'
        const 会话 = 目标们.find(s => s.id === id)
        return 会话 ? (会话.标题 || '…' + 短id(会话.id)) : '…' + 短id(id)
      }
      const 编辑角色 = async (i, x, label) => {
        if (i < 0 || typeof editRole !== 'function') return
        const 文字 = await editRole({
          title: '编辑角色设定',
          description: label + ' · 目标会话：' + 角色会话名(x.会话),
          value: String((绑定[i] && 绑定[i].人设) || ''),
          placeholder: '留空表示继承全局角色设定。',
          confirmText: '保存',
          cancelText: '取消',
        })
        if (文字 !== null) 改绑定(i, { 人设: 文字 })
      }
      const 删除角色 = async (i, label) => {
        if (i < 0) return
        if (typeof confirm === 'function') {
          const ok = await confirm({
            title: '删除后本会话的角色设定将还原到全局角色设定，是否确认删除？',
            description: label + '。仅清除当前会话设定，保留聊天绑定。',
            confirmText: '删除',
            cancelText: '取消',
            danger: true,
          })
          if (!ok) return
        }
        改绑定(i, { 人设: '' })
      }
      const 映射角色 = 类型 => {
        const 行们 = 已存绑定.filter(x => x.类型 === 类型)
        const 标题 = 类型 === '群' ? '群聊角色设定' : '私聊角色设定'
        return h('section', { style: S.card, className: 'qq-role-card' },
          h('h3', null, 标题),
          行们.length ? h('div', { className: 'qq-role-table-wrap' },
            h('table', { className: 'qq-role-table' },
              h('thead', null, h('tr', null,
                h('th', null, 类型 === '群' ? '群号' : 'QQ 号'),
                h('th', null, '目标会话'),
                h('th', null, '角色设定文字'),
                h('th', { className: 'qq-role-col-icon' }, '编辑'),
                h('th', { className: 'qq-role-col-icon' }, '删除'))),
              h('tbody', null, ...行们.map(x => {
                const i = 绑定.findIndex(b => b.类型 === x.类型 && b.号码 === x.号码 && b.会话 === x.会话)
                const row = i >= 0 ? 绑定[i] : x
                const label = 类型 + ' ' + x.号码 + ' 的角色设定'
                const 文字 = String((row && row.人设) || '').trim()
                const 会话 = 角色会话名(x.会话)
                return h('tr', { key: JSON.stringify([x.类型, x.号码, x.会话]) },
                  h('td', { className: 'qq-role-number' }, String(x.号码 || '—')),
                  h('td', { className: 'qq-role-session', title: 会话 }, 会话),
                  h('td', { className: 'qq-role-text-cell' },
                    文字 ? h('span', { className: 'qq-role-text', title: 文字 }, 文字) : h('span', { className: 'qq-role-inherit' }, '继承全局角色设定')),
                  h('td', { className: 'qq-role-col-icon' },
                    h('button', { type: 'button', className: 'qq-role-icon', 'aria-label': '编辑 ' + label, title: i < 0 ? '请等待绑定设置保存' : '编辑角色设定', disabled: i < 0 || 忙, onClick: () => 编辑角色(i, x, label) }, 角色编辑图标())),
                  h('td', { className: 'qq-role-col-icon' },
                    h('button', { type: 'button', className: 'qq-role-icon qq-role-icon-danger', 'aria-label': '删除 ' + label, title: i < 0 ? '请等待绑定设置保存' : '删除角色设定', disabled: i < 0 || 忙, onClick: () => 删除角色(i, label) }, 角色删除图标())))
              }))))
            : h('p', { style: S.dim }, '暂无已保存的' + 类型 + '映射，请在「绑定」中添加。'))
      }

      const 代写按钮 = h('button', {
        type: 'button', className: 'fish-button fish-primary qq-role-writer-open',
        onClick: () => { if (typeof openRoleWriter === 'function') openRoleWriter(); else 告知('代写功能当前不可用') },
      }, '大肥鱼专业代写')

      const 文件接收卡片 = h('section', { style: S.card },
        h('h2', null, 'QQ 文件接收'),
        h('p', { style: S.dim, role: 'status' }, '文件接收通道：' + (态?.文件接收通道 || '等待宿主连接')),
        行('接收文件（QQ → DSH）', 勾(配置.收文件, v => 改('收文件', v)), '将 QQ 文件作为附件提交到对应绑定的 DSH 会话，默认关闭。遵守现有群聊接收规则；文件不会被自动执行。'),
        行('接收单文件上限（MB）', h('input', { type: 'number', min: 1, max: 100, style: S.small, value: String(配置.收文件上限MB ?? 20), onChange: e => 改('收文件上限MB', Number(e.target.value)) }), '默认 20 MB，最多 100 MB；下载过程中也会校验实际大小，超限跳过。'),
        行('每次最多接收文件', h('input', { type: 'number', min: 1, max: 10, style: S.small, value: String(配置.收文件最多 ?? 3), onChange: e => 改('收文件最多', Number(e.target.value)) }), '默认 3 个，最多 10 个；连续消息合并后共用此数量限制。'),
        行('开启文件存储', 勾(配置.文件存储, v => 改('文件存储', v)), '默认关闭。开启后额外保存 QQ 接收文件；关闭不删除已有归档，也不影响 DSH 文件附件处理。'),
        h('p', { style: S.dim }, '复用 NapCat / SnowLuma 连接接收文件，直链不可用时由后端传回内容，支持 Docker。归档在“文件管理”中查看，格式支持取决于 DSH、模型及工具。'))

      const 分区 = (...内容) => h('div', { className: 'fish-settings-stack' }, ...内容)
      const 页面 = {
        '连接': 分区(总开关卡片, 消息卡片[0], 总览卡片[0]),
        '绑定': 分区(绑定提醒, 绑定卡片[1]),
        '消息策略': 分区(消息卡片[1], 消息卡片[2], 绑定卡片[2], 门槛卡片[0]),
        '角色设定': 分区(代写按钮, 绑定卡片[0], 特殊设定卡片, 映射角色('私聊'), 映射角色('群')),
        'QQ 账号': 分区(h('section', { style: S.card },
          h('h2', null, 'QQ 账号操作权限'),
          h('p', { style: S.dim }, '保存后生效。账号资料操作按本轮可信 QQ 发言者核验主人身份，同时遵守各项操作权限、总开关和试运行设置。'),
          行('允许执行主人在群聊中的要求', 勾(配置.允许群聊主人指令, v => 改('允许群聊主人指令', v), '允许执行主人在群聊中的要求'), '默认关闭。开启后，主人可在已核验的绑定群聊中修改机器人昵称、签名和头像，各项仍需开启对应权限。多人混合消息请主人单独重发。'),
          行('允许修改 QQ 昵称', 勾(配置.允许改昵称, v => 改('允许改昵称', v), '允许修改 QQ 昵称'), '默认关闭。开启后可按主人要求修改机器人自己的 QQ 昵称。'),
          行('允许修改个性签名', 勾(配置.允许改签名, v => 改('允许改签名', v), '允许修改个性签名'), '开启后可按主人要求修改机器人自己的 QQ 个性签名。'),
          行('允许修改 QQ 头像', 勾(配置.允许改头像, v => 改('允许改头像', v), '允许修改 QQ 头像'), '支持图片直链或本地图片，最大 8 MB，使用原图字节上传以兼容 Docker 后端。'),
          行('好友申请先询问主人', 勾(配置.好友申请审批, v => 改('好友申请审批', v), '好友申请先询问主人'), '收到加机器人为好友的请求后私聊询问主人，只有主人明确同意对应编号后才接受。'),
          行('群聊邀请先询问主人', 勾(配置.群邀请审批, v => 改('群邀请审批', v), '群聊邀请先询问主人'), '仅处理邀请机器人入群的请求。收到后询问主人，等待对应编号的明确授权。'),
          h('p', { style: S.dim }, '单独回复“同意申请 编号”或“拒绝申请 编号”，每条授权仅处理一次，收到申请后 24 小时过期。后端结果不确定时请在 QQ 中核查。'),
          h('p', { style: S.dim }, '申请事件复用已核验账号的自动事件通道，关闭文件接收也能使用。若使用 HTTP 上报，请设置“连接”页的上报口令，并将后端上报地址设为 /dsh-qq-bridge/notice?token=口令。')),
          h(QQAccountState)),
        '图片与文件': 分区(消息卡片[3], h('section', { style: S.card },
          h('h2', null, 'DSH 生成图片转发'),
          h('p', { style: S.dim }, '仅将绑定 DSH 会话回复中生成的图片自动发送到 QQ。此转发功能不提供手动发送或图片上传。'),
          行('发送生成图片（DSH → QQ）', 勾(配置.发图, v => 改('发图', v)), '支持会话回复中的图片附件和 Markdown 图片，发送到该会话绑定的 QQ 聊天；遵守总开关、试运行和消息转发策略。每轮最多 4 张。'),
          行('单张图片上限（MB）', h('input', { 'aria-label': '图上限MB', type: 'number', min: 1, max: 30, style: S.small, value: String(配置.图上限MB ?? 5), onChange: e => 改('图上限MB', Number(e.target.value)) }), '读取会话已有生成图片进行转发；QQ 收图也共用此大小限制。')), 文件接收卡片, 消息卡片[4]),
        '表情包': typeof FishStickers === 'function' ? h(FishStickers, { mode: 'settings', notify: typeof notify === 'function' ? notify : undefined, onOpenFiles: openFileManager }) : h('p', null, '请在大肥鱼整合界面使用表情库'),
        '语音转写': 分区(消息卡片[5]),
        '语音发送': 分区(h('div', { className: 'qq-voice-send', style: S.card },
          h('h2', null, '语音发送'),
          行('发送语音（QQ → DSH）', 勾(false, () => {}, '发送语音（QQ → DSH）', true), '目前服务暂不可用'))),
        '聊天记录': 历史页,
        '历史导入': 历史页,
      }

      return h(
        'div',
        { className: 'fish-module fish-qq', style: S.wrap, ...autosave },

        onPageChange ? null : 页签,
        embedded ? null : (页 === '连接' ? h('div', { className: 'fish-test-action' }, 按钮('发送测试消息', 试一句, false, 忙 || 脏), h('span', { style: S.dim }, '会实际发送至首个绑定的 QQ 聊天，不受试运行限制。')) : null),
        页面[页] || null,
        h('div', { hidden: 页 !== 'QQ 空间' }, 分区(空间卡片[0], h(QQSpaceActions, { 配置, 脏, notify }), ...空间卡片.slice(1))),
      )
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('settings.section', () =>
        slots.register(
          { name: 'settings.section', id: 'qq-bridge', order: 54, label: () => '连接与转发' },
          Section,
        ),
      )
    }

    exports.Section = Section
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})

// 大肥鱼整合修改：供主界面直接挂载，更新入口由整合包统一提供。
// DSH 鱼的记忆 · 客户端半边（设置左侧栏一项「鱼的记忆」）
moduleLoader.load({
  id: 'dsh-fish-memory',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'
    const inject = ['slots']
    function MemoryDialog({ id = 'memory-dialog', title, subtitle, active = true, onClose, footer, children, className = '' }) {
      const ref = React.useRef(null)
      React.useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (active && !dialog.open) dialog.showModal()
        if (!active && dialog.open) dialog.close()
        return () => { if (dialog.open) dialog.close() }
      }, [active])
      React.useEffect(() => { ref.current?.querySelector('button')?.focus() }, [title])
      return h('dialog', {
        ref, className: 'memory-dialog' + (className ? ' ' + className : ''), 'aria-labelledby': id + '-title',
        onCancel: e => { e.preventDefault(); onClose() },
        onMouseDown: e => {
          if (e.target !== e.currentTarget) return
          const box = e.currentTarget.getBoundingClientRect()
          if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) onClose()
        },
      },
      h('header', { className: 'memory-dialog-head' },
        h('div', null, subtitle ? h('p', null, subtitle) : null, h('h2', { id: id + '-title' }, title)),
        h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭' + title, onClick: onClose, autoFocus: true }, '×')),
      h('div', { className: 'memory-dialog-body' }, children),
      footer ? h('footer', { className: 'memory-dialog-foot' }, footer) : null)
    }

    function EmbeddingSettings({ session, storeId, notify, indexOnly = false }) {
      const [status, setStatus] = React.useState(null)
      const autosave = typeof useFishAutosave === 'function' ? useFishAutosave(() => config ? post('/settings', { config, ...(key ? { key } : {}) }) : true) : {}
      const [config, setConfig] = React.useState(null)
      const [key, setKey] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const base = '/dsh-fish-memory/embedding'
      const refresh = async (saved = false) => {
        const response = await fetch(base + '/status' + (session ? '?session=' + encodeURIComponent(session) : ''), { cache: 'no-store' })
        const result = await response.json()
        if (!response.ok || !result.ok) throw Error(result.error || '无法读取语义召回状态')
        setStatus(result)
        setConfig(old => saved ? result.config : old || result.config)
        setError('')
      }
      React.useEffect(() => { refresh().catch(e => setError(e.message)) }, [session])
      React.useEffect(() => {
        if (!status?.running) return
        const timer = setInterval(() => refresh().catch(e => setError(e.message)), 1000)
        return () => clearInterval(timer)
      }, [status?.running, session])
      const post = async (path, body) => {
        setBusy(true); setError('')
        try {
          const response = await fetch(base + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
          const result = await response.json()
          if (!response.ok || !result.ok) throw Error(result.error || '操作失败')
          setKey('')
          await refresh(path === '/settings')
          notify?.('语义召回设置已更新', { tone: 'success' })
        } catch (e) { setError(e.message); notify?.((path === '/settings' ? '保存失败：' : '操作失败：') + e.message) } finally { setBusy(false) }
      }
      if (!config) return h('section', { className: indexOnly ? '' : 'fish-card' },
        h('p', { role: error ? 'alert' : 'status' }, error || '正在读取语义召回设置…'),
        error ? h('button', { type: 'button', className: 'fish-button', onClick: () => refresh().catch(e => setError(e.message)) }, '重试') : null)
      const field = (name, label, hint, options) => h('label', { className: 'memory-field', key: name },
        h('span', null, label),
        options ? h('select', { 'aria-label': label, value: config[name], disabled: busy, onChange: e => setConfig({ ...config, [name]: typeof config[name] === 'number' ? Number(e.target.value) : e.target.value }) }, ...options.map(value => h('option', { key: value, value }, value)))
        : h('input', { 'aria-label': label, type: typeof config[name] === 'number' ? 'number' : 'text', step: name === 'minSimilarity' ? 0.01 : 1, value: config[name], disabled: busy, onChange: e => setConfig({ ...config, [name]: typeof config[name] === 'number' ? Number(e.target.value) : e.target.value }) }),
        hint ? h('small', null, hint) : null)
      return h('section', { className: indexOnly ? 'memory-index' : 'fish-card memory-embedding', ...(indexOnly ? {} : autosave) },
        !indexOnly ? h(React.Fragment, null,
          h('div', { className: 'memory-card-head' },
            h('div', null, h('h3', null, 'RAG 语义召回')),
            h('label', { className: 'memory-switch' }, h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '启用语义召回', checked: config.enabled, disabled: busy, onChange: e => setConfig({ ...config, enabled: e.target.checked }) }), config.enabled ? '已开启' : '已关闭')),
          h('p', null, '按语义检索记忆，可匹配不同表述。例如，“忌口”可关联“不吃香菜”。记忆正文与查询将发送至云服务商，可能产生费用。QQ 来源隔离继续生效，服务异常时回退至关键词检索。'),
          h('div', { className: 'memory-form-grid' },
            field('model', 'Embedding 模型', null, ['text-embedding-v4', 'text-embedding-v3']),
            field('dimensions', '向量维度', '维度需与服务和现有索引一致。'),
            h('label', { className: 'memory-field memory-field-wide' }, h('span', null, '服务地址'), h('input', { 'aria-label': 'DashScope 完整服务地址', type: 'url', value: config.endpoint, disabled: busy, onChange: e => setConfig({ ...config, endpoint: e.target.value }) })),
            field('minSimilarity', '语义相似度门槛', '越高越严格，范围 0.5–0.99。'),
            field('topK', '候选条数上限', '最多 50 条，同时受单轮记忆预算限制。'),
            field('timeoutMs', '检索超时 / 毫秒', '超时回退关键词，不阻塞聊天。'),
            h('label', { className: 'memory-field memory-field-wide' }, h('span', null, '服务密钥'), h('input', { 'aria-label': 'Embedding 密钥', type: 'password', autoComplete: 'new-password', placeholder: status?.configured ? '已配置，留空保留现有密钥' : '输入服务密钥', value: key, disabled: busy || !status?.writable, onChange: e => setKey(e.target.value) }), h('small', null, status?.writable ? '密钥只写入宿主凭据，不会返回前端。' : '当前宿主不支持写入密钥，请使用宿主凭据或环境变量。'))),
          h('div', { className: 'memory-actions memory-save-row' },
            null,
            h('button', { type: 'button', className: 'fish-button', disabled: busy || !status?.writable || !status?.configured, onClick: () => { if (window.confirm('清除已保存的 Embedding 密钥？语义召回将无法使用该密钥。')) post('/settings', { config, clearKey: true }) } }, '清除密钥')),
          h('p', { className: 'memory-index-hint' }, '各记忆库的索引补齐与重建，统一从“记忆库 → 管理 → 语义索引”进入。')) : h(React.Fragment, null,
          h('p', { className: 'fish-muted' }, '索引仅影响语义检索。补齐和重建都会保留原始记忆正文。'),
          h('div', { className: 'memory-stats' }, ...[[status?.indexed ?? '—', '已索引'], [status?.missing ?? '—', '待补齐'], [status?.completed ?? 0, '本次完成']].map(([value, label]) => h('div', { key: label }, h('strong', null, value), h('span', null, label)))),
          status?.error ? h('p', { className: 'memory-feedback', role: 'status' }, '检索回退原因 · ' + status.error) : null,
          h('div', { className: 'memory-actions' },
            h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || status?.running || !config.enabled, onClick: () => post('/index', { session, storeId }) }, status?.running ? '正在补齐…' : '补齐缺失索引'),
            h('button', { type: 'button', className: 'fish-button', disabled: busy || status?.running || !config.enabled, onClick: () => post('/index', { session, storeId, rebuild: true }) }, '重建索引'),
            h('button', { type: 'button', className: 'fish-button', disabled: busy || !status?.running, onClick: () => post('/index', { stop: true }) }, '中断任务'),
            h(RefreshButton, { type: 'button', label: '刷新状态', onClick: () => refresh().catch(e => setError(e.message)) }, '刷新状态')),
          !config.enabled ? h('p', { className: 'memory-feedback' }, '语义召回尚未开启，请先到“RAG 语义召回”开启。') : null),
        error ? h('p', { role: 'alert', className: 'memory-feedback' }, error) : null)
    }

    const B = '/dsh-fish-memory'

    const get = (p) => fetch(B + p, { cache: 'no-store' }).then((r) => r.json())
    const rawPost = (p, body) =>
      fetch(B + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body || {}) }).then((r) => r.json())

    const fmt = (t) => {
      if (!t) return '（未标日期）'
      const d = new Date(t)
      const p = (n) => String(n).padStart(2, '0')
      return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
    }
    const rel = (t, now) => {
      if (!t) return '（未标日期）'
      const dayIdx = (x) => Math.floor((new Date(x).getTime() + 8 * 3600000) / 86400000)
      const days = dayIdx(now) - dayIdx(t)
      if (!isFinite(days)) return fmt(t)
      // ⚠注意：2026-09-22 修（反馈：「为什么还有今天的事儿」）：
      //   原来是 `if (days <= 0) return '今天 …'` —— **负数的（未来的）也被算成今天** ✗
      //   实测：一条日期在未来的记忆→ 页面显示「今天 12:00」✗✗
      //   → 今天 / 明天 / N 天后 分开写
      if (days === 0) return '今天 ' + fmt(t).slice(6)
      if (days === -1) return '明天 ' + fmt(t).slice(6)
      if (days < 0) {
        const 后 = -days
        if (后 < 30) return 后 + ' 天后'
        return fmt(t).slice(0, 5) + '（' + Math.floor(后 / 30) + ' 个月后）'
      }
      if (days === 1) return '昨天 ' + fmt(t).slice(6)
      if (days < 30) return days + ' 天前'
      // ⭐ 2026-09-21 晚：**跨年了就必须带年份** —— 不然「09-17」看不出是哪一年 ✗
      //   （反馈：的：「过了一年会怎么显示呢？我现在看没有年份，只有月份」）
      const 今年 = new Date(new Date(now).getTime() + 8 * 3600000).getUTCFullYear()
      const 那年 = new Date(new Date(t).getTime() + 8 * 3600000).getUTCFullYear()
      if (那年 !== 今年) {
        const 差 = 今年 - 那年
        if (差 === 1) return '去年 ' + fmt(t).slice(0, 5)
        return 那年 + '-' + fmt(t).slice(0, 5) + '（' + 差 + ' 年前）'
      }
      // ⚠注意：2026-09-22 修（反馈：「不是两个月前啊」）：
      //   原来是 `Math.round(days / 30)` —— **四舍五入**把 47 天说成了「2 个月」✗
      //   47 天明明才一个半月。→ 改成**只进不退**（floor），零头够 15 天就说「个多月」✓
      const 月 = Math.floor(days / 30)
      const 零头 = days - 月 * 30
      return fmt(t).slice(0, 5) + '（' + 月 + (零头 >= 15 ? ' 个多' : ' 个') + '月前）'
    }
    const impName = (v) => (v >= 1 ? '非常重要' : v >= 0.5 ? '重要' : '一般')

    // ---------- 提炼 / 扩词的进度放在**组件外面** ----------
    // 为什么：跑一轮要十几二十分钟，她中途切走再回来，进度不该消失
    // 注意：两个**各占一格** —— 共用一个格子的话，两个一起跑会互相盖，
    //   看起来就像「点了扩词，过一会儿自己取消了」✗（2026-09-20 踩到）
    const 进度 = { 扩词: { 状态: null, 说明: null }, 提炼: { 状态: null, 说明: null }, 订阅: new Set() }
    // ⭐ 2026-09-22（反馈「点了判断，但他没有弹进度条啊，他就卡着判着呢」）：
    //   「补标不淡」原来**只有一行字、没有进度条** —— 跑起来看不出它在动 ✗
    //   （其实一直在跑，日志里一批批都有；她以为卡死了）
    //   → 给它也配一条进度条（放在组件外面，切走再回来还在）
    // 注意：2026-09-22（她的反馈）：这条原来跟提炼/扩词挤在同一张卡里，
    //   点了重判得往上翻才看得见 失败：→ 挪到按钮行下面，并记下**是哪一种**：
    //   「补标不淡」还是「重判一遍」，进度条上写清楚
    const 补标进度 = { 已: 0, 总: 0, 在跑: false, 重判: false }
// ⭐⭐ 2026-09-23：**清洗补键**的进度（老数据补事实键）✓
//   跟 补标 分开一份 —— 两条进度条同时跑的时候不许互相盖 ✗
const 洗键进度 = { 已: 0, 总: 0, 在跑: false, 干跑: false }
    const 改进度 = (格, 状态, 说明) => {
      const s = 进度[格] || (进度[格] = { 状态: null, 说明: null })
      s.状态 = 状态
      s.说明 = 说明
      for (const f of 进度.订阅) {
        try {
          f()
        } catch (e) {}
      }
    }

    // 一次别画太多行 —— 库里 800 多条的时候，全画出来整个页面都会卡（连别的插件面板一起卡）✗
    const 一次最多画 = 200

    // 权重在页面上按百分比显示（0.55 → 55）
    const toPct = (v) => Math.round(Number(v) * 1000) / 10
    const fromPct = (v) => Math.round(Number(v) * 10) / 1000

    const S = {
      wrap: { padding: '0 0 24px', fontSize: 'var(--fish-body)', lineHeight: 1.75, minWidth: 0 },
      dim: { color: 'var(--fish-muted)' },
      h: { fontFamily: 'var(--fish-title)', fontSize: 20, margin: '28px 0 16px', fontWeight: 700, lineHeight: 1.5 },
      // ⚠注意：2026-09-23（她的反馈：「右边堆的东西太多，左边的文字成了竖着的一条」）：
      //   这一行**必须能换行** ✗
      //   原来没有 flexWrap —— 行里全是 flex:'none' 的牌子/列（日期、鲜活度、重要度、原文、改、删…），
      //   它们一多，那条 flex:1 的正文就被挤成**竖着的一条**（一个字一行）。
      //   清洗补键给两百多条补上键之后，行里又多一个牌子 → 立刻犯病。
      //   加 flexWrap：装不下就让牌子们**掉到下一行**，正文始终有地方
      //   （跟上面 nameBox 那条是同一个教训）
      // ⚠注意：2026-09-24（她说的「能搜到它的词和讲的是，移到下一条的那一格里面去了」）：
      //   分隔线**原来画在「行」上** —— 可每条下面还有一两行小字
      //   （「提炼前：…」「能搜到它的词：…」「讲的是：…」），
      //   它们在线的**下面** → 看着就像属于**下一条**了 ✗
      //   → 线挪到「整条」上（见 S.条），行自己不再画线
      row: { padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 10, rowGap: 2, alignItems: 'baseline' },
      // 「一整条」的分隔线：**连着下面那几行小字一起**框住
      条: { borderBottom: '1px solid var(--fish-line)' },
      btn: { padding: '8px 12px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-border)', background: 'var(--fish-control-fill)', color: 'inherit', cursor: 'pointer', fontSize: 'var(--fish-small)' },
      inp: { width: 88, padding: '8px 12px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-control-border)', background: 'transparent', color: 'inherit', fontSize: 'var(--fish-small)' },
      link: { color: 'var(--dsw-alias-label-secondary, var(--fish-info))', cursor: 'pointer', textDecoration: 'underline' },
      confirm: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '4px 0 8px 8px', padding: '6px 10px', borderRadius: 'var(--fish-radius-mid)', background: 'var(--fish-panel)', boxShadow: 'var(--fish-small-shadow)', border: '1px solid var(--fish-danger)', fontSize: 'var(--fish-small)' },
      // 注意：flexWrap：放大或窗口窄的时候要能换行，不然会横向撑出容器（右边就看不见了）✗
      nameBox: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', margin: '10px 0', padding: '12px 0', borderBottom: '1px solid var(--fish-line)', fontSize: 'var(--fish-small)' },
      editBox: { margin: 0, padding: 0, minWidth: 0 },
      askBox: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '8px 0', padding: '16px', borderRadius: 'var(--fish-radius-mid)', background: 'var(--fish-panel)', boxShadow: 'var(--fish-small-shadow)', border: '1px solid var(--fish-warning)', fontSize: 'var(--fish-small)' },
      barOut: { height: 10, borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-line)', overflow: 'hidden', border: '1px solid var(--fish-border)' },
      barIn: { height: '100%', background: 'var(--fish-accent)' },
      area: { width: '100%', boxSizing: 'border-box', padding: '12px 16px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-control-border)', background: 'transparent', color: 'inherit', fontSize: 'var(--fish-small)', lineHeight: 1.7, fontFamily: 'inherit', resize: 'vertical' },
      btnDanger: { padding: '8px 12px', borderRadius: 'var(--fish-radius-sm)', border: '1px solid var(--fish-danger)', background: 'var(--fish-soft)', color: 'inherit', cursor: 'pointer', fontSize: 'var(--fish-small)' },
      ok: { color: 'var(--fish-success)' },
      drop: { color: 'var(--fish-danger)' },
      warn: { color: 'var(--fish-warning)' },
    }

    const GROUPS = [
      ['weight', '权重', '设置召回评分权重。合计为 100%，修改一项后自动调整其余项。'],
      ['time', '遗忘速度', '数值越大，衰减越慢。衰减影响召回排序，不删除记忆。'],
      ['gate', '门槛与条数', '设置单轮记忆注入数量与字数上限。'],
    ]

    function Section({ page, onPageChange, notify, active = true } = {}) {
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [d, setD] = React.useState(null)
      const post = (p, body) => {
        const selected = d?.sessions?.find(s => s.id === body?.session)
        const target = d?.sessions?.find(s => s.id === body?.to)
        return rawPost(p, { ...body, ...(selected?.qq ? { storeId: selected.storeId } : {}), ...(target?.qq ? { toStoreId: target.storeId } : {}) })
      }
      const [err, setErr] = React.useState(null)
      const [open, setOpen] = React.useState(null) // 打开哪个会话（两级结构）
      const [params, setParams] = React.useState(null)
      const policyDirty = React.useRef(new Set())
      const policyQueue = React.useRef(Promise.resolve())
      const namesQueue = React.useRef(Promise.resolve())
      const saveNames = body => {
        const request = namesQueue.current.catch(() => {}).then(() => post('/names', body)).then(result => {
          if (result?.ok) 告知('记忆设置已保存', { tone: 'success' })
          return result
        })
        namesQueue.current = request
        return request
      }
      const [pin, setPin] = React.useState(null) // 她刚改的那一项权重
      const [editing, setEditing] = React.useState(null) // 正在打字的那格（原样显示她敲的字）
      const [notes, setNotes] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      const [confirm, setConfirm] = React.useState(null) // 正在等确认的删除（二次确认，手滑不了）
      const [showDeleted, setShowDeleted] = React.useState(false)
      const [selfDraft, setSelfDraft] = React.useState({}) // 每个会话「她自己叫什么」的草稿
      const [ownerDraft, setOwnerDraft] = React.useState({}) // 每个会话「怎么称呼对方」的草稿
      const [edit, setEdit] = React.useState(null) // 正在改的那条：{id, text, importance}
      const [imp, setImp] = React.useState(null) // 档案导入：扫描结果 + 勾选状态
      const [impBusy, setImpBusy] = React.useState(false)
      const [impNote, setImpNote] = React.useState(null)
      const [impOpen, setImpOpen] = React.useState(false)
      // 进度放在组件外面（见上面「进度」那段）—— 她切走再回来，进度不该消失
      const [exp, setExpState] = React.useState(进度.扩词.状态)
      const [expNote, setExpNoteState] = React.useState(进度.扩词.说明)
      const [rf, setRfState] = React.useState(进度.提炼.状态)
      const [rfNote, setRfNoteState] = React.useState(进度.提炼.说明)
      const [复制开, set复制开] = React.useState(false) // 「复制记忆到别的会话」展开没有
      const [复制到, set复制到] = React.useState('') // 复制到哪个会话
      const [搜词, set搜词] = React.useState('') // 记忆列表的检索词
      const setExp = (v) => 改进度('扩词', v, 进度.扩词.说明)
      const setExpNote = (v) => 改进度('扩词', 进度.扩词.状态, v)
      const setRf = (v) => 改进度('提炼', v, 进度.提炼.说明)
      const setRfNote = (v) => 改进度('提炼', 进度.提炼.状态, v)
      const [画全部, set画全部] = React.useState(false) // 记忆列表要不要一次画完（默认只画前 200）
      const [看记忆, set看记忆] = React.useState(true) // 常用记忆列表默认展开
      // ⭐ 2026-09-21：列表顺序。记忆库是 push 顺序（老的在前），而下面只画前 200 条 ——
      //   不翻过来的话，她永远看不到刚写进来的那条（851 条里画的是最老的 200 条）。
      //   '新' = 最新的在最上面（默认）；'旧' = 最早的在前（想从头翻的时候用）
      const [顺序, set顺序] = React.useState('新')
      // ⭐ 2026-09-24（反馈）：**「记了时间的」和「没记时间的」混在一坨了** ✗
      //   库里 850 条只有 188 条有日期 —— 混在一起排，「中间那一段」全是没日期的，排序就白排了。
      //   原话：「要么就是这样分类，记了时间的和没记时间的分开……
      //            不然的话记和没记的就全混在一起了，这个排序就没办法用了」
      //   她要的是**自己切**（不是固定的两块）→ 三种视图轮着切
      //     '全部' = 老样子；'有时间' = 只看有日期的；'没时间' = 只看没日期的
      const [看哪边, set看哪边] = React.useState('全部')
      // ⭐ 2026-09-22（她要的）：长期事实那个「收理的文件夹」展开没有（**默认收着**）
      const [看事实, set看事实] = React.useState(false)
      const [localPage, setLocalPage] = React.useState('记忆库')
      const requestedPage = page ?? localPage
      const memoryPage = ['语义召回', '召回与遗忘', '召回设置'].includes(requestedPage) ? 'RAG 语义召回' : ['记忆库', 'RAG 语义召回'].includes(requestedPage) ? requestedPage : '记忆库'
      const setMemoryPage = onPageChange ?? setLocalPage
      const [dialogView, setDialogView] = React.useState('memories')
      const openLibrary = (id, view = 'memories') => {
        setOpen(id); setDialogView(view); setEdit(null); set查重开(false); set生成开(false)
        set看记忆(true); set看事实(true); setShowDeleted(true); set加在谁(id); setNotes(null)
      }
      // ⭐⭐ 2026-09-22（反馈：「查重我们是不是还没找到按钮」）：
      //   去重一直有，但都是**自动**的（召回时、导入时）—— **库里已有的重复没人管** ✗
      //   这里补一个手动查重：列出来、挑、才合
      const [查重, set查重] = React.useState(null) // 查重结果：{组, 真重复组数, 汇总组数, 能少}
      const [查重选, set查重选] = React.useState({}) // 第几组 → 留哪条的 id
      // ⭐⭐ 2026-09-23（她真被坑过一次）：**哪几组要合**。
      //   原来「按我选的合」是**把每一组都合掉** —— 而每组默认都选中了，
      //   于是一点就把「汇总+明细」那 105 组也合了，**123 条记忆没了**（回收站还被清空）✗
      //   → 改成：**「汇总+明细」默认不参与**，要合得一组一组自己勾
      const [查重合, set查重合] = React.useState({}) // 第几组 → 要不要合
      const [查重开, set查重开] = React.useState(false) // 面板展开没有
      // ⭐⭐ 2026-09-22（她要的）：**批量删除**，但**必须二次确认**
      //   原话：「再出一个批量删除，但还是需要 2 次确认的」
      //   ① 勾选（每条行首一个框）② 点「批量删」→ 出一个确认条 ③ 点「确定删」才真删
      //   删掉的是**收进「已删」**（不是销毁），能找回来
      const [选中, set选中] = React.useState({}) // 勾了哪些 id
      const [批删问, set批删问] = React.useState(false) // 二次确认条出来了没
      // ⭐ 2026-09-22（反馈「回收站还没有批量删除，就批量清空」）：
      //   「已删掉的」那一栏原来只有「一条条清」和「全清空」→ 补一个**批量清掉**
      //   注意：这个是**真销毁**（不是收起来）→ 界面必须问两遍
      const [选中清, set选中清] = React.useState({}) // 「已删」里勾了哪些
      const [批清问, set批清问] = React.useState(false)
      // ⭐⭐ 2026-09-23（反馈「这里没有批量找回呀」）：批量找回的确认
      const [批回问, set批回问] = React.useState(false)
      const [mdl, setMdl] = React.useState(null) // DSH 里有哪些模型可选
      // ⭐⭐ 2026-09-22（她的第十件）：**从会话生成档案** —— 给别人用的功能
      //   用户导入自己的会话 → 模型读一遍 → 出一份档案 → 再走「从旧档案导入」变成条目
      //   注意：四步分开，因为**第三步调模型、花钱**，得一批一批停下来看
      const [生成开, set生成开] = React.useState(false) // 面板展开没有
      const [生成会话, set生成会话] = React.useState(null) // 这个工作区有哪些会话
      const [生成选, set生成选] = React.useState({}) // 勾了哪几个
      const [生成计划, set生成计划] = React.useState(null) // 算出来的：几批、多少字、多少 token
      const [生成条目, set生成条目] = React.useState([]) // 攒下来的条目
      const [生成进度, set生成进度] = React.useState(null) // {批号, 批数, 在跑, 模型}
      const [生成档, set生成档] = React.useState(null) // 存好了：{存到, 条数, 预览}
      const [生成备, set生成备] = React.useState(null) // 给模型用的备用模型（可选）
      const [生成诊断, set生成诊断] = React.useState(null) // 列表跟 DSH 对不上时，看这几个数
      // ⭐⭐ 2026-09-22（反馈：「点存档案的地方应该自定义」）：
      //   原来存到哪儿是我**写死的**（`.dsh\生成的档案.md`）失败：→ 能打、能选
      const [生成存到, set生成存到] = React.useState('')
      const [生成目录列, set生成目录列] = React.useState(null) // 文件夹选择器的列表
      const [生成选目录, set生成选目录] = React.useState(false)
      const [impDir, setImpDir] = React.useState(null) // 档案目录草稿
      const [impNames, setImpNames] = React.useState(null) // 「指她的名字」草稿
      const [impDirs, setImpDirs] = React.useState(null) // 文件夹选择器的列表
      const [找名字, set找名字] = React.useState(null) // 自动找出来的称呼候选
      const [看原文, set看原文] = React.useState({}) // 哪几条在对照「提炼前」的原文
      // ---- 2026-09-21 新加：后台手动加一条记忆 ----
      const [加内容, set加内容] = React.useState('')
      const [加时间, set加时间] = React.useState('') // 留空 = 现在
      const [加重要, set加重要] = React.useState('0.5') // 三档是快捷，也能自己填
      const [加词, set加词] = React.useState('') // 关键词，空格分开
      const [加在谁, set加在谁] = React.useState('') // 加到哪个会话（默认第一个开着的，没有就第一个）
      const set加结果 = result => {
        const text = result && result.文字
        if (text) 告知(text, result && result.ok ? { tone: 'success' } : { holdMs: 6000 })
      }

      // 「指她的名字」那一格：读出来、点一下加/减
      const 名字串 = () => (impNames !== null ? impNames : (imp.data && imp.data.用户名字 ? imp.data.用户名字 : []).join(','))
      const 名字们 = () => 名字串().split(/[,，]/).map((x) => x.trim()).filter(Boolean)
      const 已选名字 = (n) => 名字们().indexOf(n) >= 0
      const 点名字 = (n) => {
        const 有 = 名字们()
        const i = 有.indexOf(n)
        if (i >= 0) 有.splice(i, 1)
        else 有.push(n)
        setImpNames(有.join(','))
      }
      // 「这个不是名字」—— 昵称、旧事里的称呼…… 标了就存起来，以后不再出现、也不会被换掉
      const 标掉名字 = (n) => {
        const 现有 = 找名字 && Array.isArray(找名字.不是名字) ? 找名字.不是名字.slice() : []
        if (现有.indexOf(n) < 0) 现有.push(n)
        saveNames({ notNames: 现有 })
          .then(() => post('/names/scan', { session: open, dir: impDir !== null ? impDir : imp.data.dir }))
          .then((r) => {
            set找名字(r)
            const 剩 = 名字们().filter((x) => x !== n)
            setImpNames(剩.join(','))
          })
          .catch((e) => setExpNote('标不了：' + String((e && e.message) || e)))
      }

      // 一个候选名字块：点名字=加/减，点 ✕ = 标成「不是名字」✓
      const 一个名字块 = (x, 淡) =>
        React.createElement(
          'span',
          {
            key: x.name,
            style: Object.assign({}, S.btn, {
              cursor: 'pointer',
              opacity: 淡 ? 0.7 : 1,
              color: 已选名字(x.name) ? 'var(--fish-success)' : 'inherit',
            }),
          },
          React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  onClick: () => 点名字(x.name) }, (已选名字(x.name) ? '' : '') + x.name + ' ' + x.n),
          React.createElement(
            'span',
            {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
              style: Object.assign({}, S.dim, { marginLeft: 5, cursor: 'pointer' }),
              title: '标记为非称呼，后续不再识别或替换',
              onClick: (e) => {
                if (e && e.stopPropagation) e.stopPropagation()
                标掉名字(x.name)
              },
            },
            '✕',
          ),
        )

      const load = React.useCallback(() => {
        return get('/list')
          .then((x) => {
            setD(x)
            if (x && x.policy) setParams(old => Object.assign({}, x.policy, old ? Object.fromEntries([...policyDirty.current].map(key => [key, old[key]])) : {}))
            setErr(null)
          })
          .catch((e) => setErr(String((e && e.message) || e)))
      }, [])

      React.useEffect(() => {
        if (active) load()
      }, [load, active])

      // ---- 2026-09-21 新加：手动加一条（提交）----
      // 加到哪个会话：她选的；没选就挑第一个开着的，都没有就第一个
      // ⭐ 1.2.8（issue #8「手动加的记忆跑到别的会话去了」）：
      //   以前没选就**默默挑第一个开着的会话** —— 两个都开着时，她打开的是 B，记忆却加到了 A。
      //   现在优先用「你正打开的这个会话」，再退回第一个开着的。
      const 加哪个会话 = React.useCallback(() => {
        if (加在谁) return 加在谁
        if (open) return String(open)
        const 列 = (d && d.sessions) || []
        const 开着的 = 列.find((x) => x.enabled)
        return (开着的 || 列[0] || {}).id || ''
      }, [加在谁, open, d])

      const 提交一条 = React.useCallback(() => {
        const 内容 = 加内容.trim()
        if (!内容) {
          set加结果({ ok: false, 文字: '内容不能空' })
          return
        }
        const 会话 = 加哪个会话()
        if (!会话) {
          set加结果({ ok: false, 文字: '无可用目标会话' })
          return
        }
        const 重要 = Number(加重要)
        post('/add', {
          session: 会话,
          text: 内容,
          at: 加时间.trim(),
          importance: Number.isFinite(重要) ? 重要 : 0.5,
          tags: 加词.trim() ? 加词.trim().split(/[\s,，、]+/).filter(Boolean) : [],
        })
          .then((r) => {
            if (r && r.ok) {
              set加结果({ ok: true, 文字: '添加成功（当前库共 ' + r.count + ' 条）' })
              set加内容('')
              set加时间('')
              set加词('')
              load()
            } else {
              set加结果({ ok: false, 文字: (r && (r.error || r.message)) || '添加失败' })
            }
          })
          .catch((e) => set加结果({ ok: false, 文字: String((e && e.message) || e) }))
      }, [加内容, 加时间, 加重要, 加词, 加哪个会话, load])

      // 订阅外面那个「进度」—— 切走再回来也看得到还在跑
      React.useEffect(() => {
        const 同步 = () => {
          setExpState(进度.扩词.状态)
          setExpNoteState(进度.扩词.说明)
          setRfState(进度.提炼.状态)
          setRfNoteState(进度.提炼.说明)
        }
        进度.订阅.add(同步)
        同步()
        return () => {
          进度.订阅.delete(同步)
        }
      }, [])

      // 切回这个页面就重读一遍 —— 不然得手动按「刷新」才看得到别处刚发生的变化
      // 注意：但一定要**限流**：库里有 800 多条的时候，/list 要吐 1 MB 左右，
      //   每次切窗口都重读 + 重画一遍，整个页面（连带别的插件面板）都会卡住 ✗
      React.useEffect(() => {
        if (typeof window === 'undefined' || !window.addEventListener) return
        let 上次 = 0
        const 回来就重读 = () => {
          if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
          if ((进度.扩词.状态 && 进度.扩词.状态.running) || (进度.提炼.状态 && 进度.提炼.状态.running)) return // 正跑着提炼/扩词，别抢
          const 现在 = Date.now()
          if (现在 - 上次 < 10000) return // 10 秒内只读一次
          上次 = 现在
          load()
        }
        window.addEventListener('focus', 回来就重读)
        document.addEventListener('visibilitychange', 回来就重读)
        return () => {
          window.removeEventListener('focus', 回来就重读)
          document.removeEventListener('visibilitychange', 回来就重读)
        }
      }, [load])

      if (err && !d) return h('div', { className: 'memory-feedback', role: 'alert' }, h('p', null, '无法读取长期记忆：' + err), h('button', { type: 'button', className: 'fish-button', onClick: load }, '重试'))
      if (!d || !params) return React.createElement('div', { className: 'fish-module fish-memory', style: S.wrap }, '加载中…')

      const now = Date.now()
      const libraries = [...new Map((d.sessions || []).map(s => [s.storeId || s.id, s])).values()]
      const libraryTitle = s => s.qq && s.storeId?.endsWith('_shared') ? '普通群共享记忆' : s.title || s.id

      // ---- 第二级：某个会话的详情 ----
      const 详情视图 = (() => {
        if (!open) return null
        const s = (d.sessions || []).find((x) => x.id === open)
        if (!s) return React.createElement('div', { className: 'fish-module fish-memory', style: S.wrap }, '目标会话不存在')
        const tr = (s.traces || []).slice(-1)[0]
        const 删 = (id, action) => post('/delete', { session: open, id, action }).then(() => { setConfirm(null); load() })
        // ⭐⭐ 2026-09-23（反馈「过期条目没标作废」）：
        //   撤销「已被取代」—— 标错了、或者状态又变回来了
        //   （不删任何东西，只把那面小旗子摘掉，摘完它又能被想起来）
        const 撤销作废 = (id) => {
          setBusy(true)
          post('/delete', { session: open, action: 'unsupersede', id: id })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['撤销失败：' + ((r && r.message) || '？')])
                return
              }
              setNotes(['' + r.message])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['撤销失败：' + ((e && e.message) || e)])
            })
        }
        // 提炼改坏了 —— 退回原文（单条 / 全部）✓
        const 退原文 = (id) =>
          post('/refine/undo', id === '*' ? { session: open, all: true } : { session: open, id: id })
            .then((r) => {
              setConfirm(null)
              setExpNote('退回了 ' + ((r && r.退了) || 0) + ' 条原文')
              load()
            })
            .catch((e) => setExpNote('退不回：' + String((e && e.message) || e)))
        // 把这一份记忆复制到别的会话（新对话没有上下文，测起来最干净）✓
        const 复制过去 = () =>
          post('/copy-to', { session: open, to: 复制到 })
            .then((r) => {
              setConfirm(null)
              const 尾巴 = []
              if (r && r.复制了) 尾巴.push('新增 ' + r.复制了 + ' 条')
              else 尾巴.push('未添加任何条目')
              if (r && r.重复) 尾巴.push('重复跳过 ' + r.重复 + ' 条')
              if (r && r.保留) 尾巴.push('目标已有 ' + r.保留 + ' 条已保留')
              setExpNote(r && r.ok ? '' + 尾巴.join('，') + '；已启用目标会话记忆' : '失败：' + ((r && r.message) || '？'))
              load()
            })
            .catch((e) => setExpNote('失败：' + String((e && e.message) || e)))

        // 二次确认条（点「删」之后才出现，手滑不了）
        const 确认条 = (text, okLabel, action, id) =>
          React.createElement(
            'div',
            { style: S.confirm },
            React.createElement('span', { style: { flex: 1, minWidth: 0, overflowWrap: 'anywhere' } }, text),
            React.createElement('button', {type: 'button',  style: S.btnDanger, onClick: () => 删(id, action) }, okLabel),
            React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
          )

        // 改一条：文本框 + 重要度 + 存 / 算了
        const 改一条 = (m) =>
          React.createElement(
            'div',
            { className: 'memory-editor', style: S.editBox },
            React.createElement('textarea', {'aria-label': '记忆正文',
              style: S.area,
              rows: 3,
              value: edit.text,
              onChange: (e) => setEdit(Object.assign({}, edit, { text: e.target.value })),
            }),
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 6 } },
              React.createElement('span', { style: S.dim }, '重要度'),
              React.createElement(
                'select',
                {'aria-label': '重要度',
                  style: S.inp,
                  value: String(edit.importance),
                  onChange: (e) => setEdit(Object.assign({}, edit, { importance: Number(e.target.value) })),
                },
                React.createElement('option', { value: '0' }, '一般'),
                React.createElement('option', { value: '0.5' }, '重要'),
                React.createElement('option', { value: '1' }, '非常重要（长期保留）'),
              ),
              React.createElement('span', { style: Object.assign({}, S.dim, { flex: 1, fontSize: 'var(--fish-small)' }) }, '修改前自动备份'),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  disabled: !String(edit.text || '').trim(),
                  onClick: () =>
                    post('/edit', { session: open, id: m.id, text: edit.text, importance: edit.importance }).then(() => {
                      setEdit(null)
                      load()
                    }),
                },
                '保存修改',
              ),
              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setEdit(null) }, '取消'),
            ),
          )

        const 一条记忆 = (m) =>
          React.createElement(
            'div',
            // 注意：分隔线画在**整条**上（不是里面那个「行」）——
            //   这样下面那几行小字（能搜到它的词 / 讲的是）算在**这一条**里
            { key: m.id, className: 'memory-entry-card', style: S.条 },
            React.createElement(
              'div',
              { className: 'fish-record-row', style: S.row },
              // ⭐ 2026-09-22（她要的批量删除）：行首一个勾选框
              React.createElement('input', {'aria-label': '选择记忆：' + m.text,
                type: 'checkbox',
                checked: !!选中[m.id],
                title: '选择后可批量删除',
                onChange: () => set选中(Object.assign({}, 选中, { [m.id]: !选中[m.id] })),
              }),
              React.createElement('div', { style: Object.assign({}, S.dim, { width: 96, flex: 'none' }) }, rel(m.at, now)),
              React.createElement(
                // ⚠注意：正文这一格给个**下限**（flexBasis 260 / minWidth 200）✗
                //   光有 flex:1 是不够的：它允许被压到 0，右边牌子一多就成竖条。
                //   有了下限 + 上面那条 flexWrap，装不下时是**牌子换行**，不是正文变窄
                'div',
                { style: { flex: '1 1 260px', minWidth: 200, overflowWrap: 'anywhere', wordBreak: 'break-word' } },
                m.已被取代
                  ? React.createElement(
                      'span',
                      {
                        style: Object.assign({}, S.dim, { textDecoration: 'line-through', opacity: 1 }),
                        title: '条目已被取代（' + (m.已被取代.为什么 || '') + '），已停止召回，原文保留',
                      },
                      m.text,
                    )
                  : m.text,
              ),
              // ⭐⭐ 2026-09-23（反馈「过期条目没标作废」）：
              //   标了「已被取代」的，行里直接挂一个「已被取代」的牌子 + 一个撤销口
              m.已被取代
                ? React.createElement(
                    'div',
                    {
                      style: { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10, padding: '1px 6px', borderRadius: 8, background: 'var(--fish-soft)', color: 'var(--fish-warning)', overflowWrap: 'anywhere' },
                      title: (m.已被取代.为什么 || '') + '（' + rel(m.已被取代.作废于, now) + '），已停止注入，原文保留',
                    },
                    '已被取代',
                  )
                : null,
              m.已被取代
                ? React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }),
                      title: '撤销取代标记并恢复召回',
                      onClick: () => 撤销作废(m.id),
                    },
                    '恢复',
                  )
                : null,
              // ⭐⭐ 2026-09-23：**事实键** —— 注意：不挂在行里，改挂到下面那行小字
              //   行里每多一个固定宽的牌子，正文就被挤窄一分；
              //   键本来就是「附注」性质，跟「能搜到它的词」放一起正合适（见下面那条）
              React.createElement(
                'div',
                { style: Object.assign({}, S.dim, { whiteSpace: 'nowrap', flex: 'none', fontSize: 'var(--fish-small)' }), title: '鲜活度用于召回排序。长期事实不衰减，未标日期的条目使用配置值。' },
                // ⭐⭐ 2026-09-22（反馈：「没标时间的还是鲜活 100%」）：
                //   光显示百分比会骗人 —— 长期事实本来就不淡，写「100%」像在说「刚发生」✗
                //   → 长期事实写「**不淡**」✓
                //   ⭐ 2026-09-22 再改（发现流水账来问）：**没记时间的也会淡了**
                //     （从「记下来的那天」开始算）→ 它们照常显示百分比
                //     （原来显示「没记时间」，那是我上一版判错了 —— 它们并不是不淡）
                m.freshKind === 'fact' ? '长期'
                  : typeof m.activation === 'number' && isFinite(m.activation) ? '鲜活 ' + Math.round(m.activation * 100) + '%' : '—',
              ),
              React.createElement('div', { style: Object.assign({}, S.dim, { whiteSpace: 'nowrap', flex: 'none', fontSize: 'var(--fish-small)' }) }, impName(m.importance)),
              m.textBefore
                ? React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }),
                      title: '查看提炼前原文',
                      onClick: () => set看原文(Object.assign({}, 看原文, { [m.id]: !看原文[m.id] })),
                    },
                    看原文[m.id] ? '收起' : '原文',
                  )
                : null,
              m.textBefore
                ? React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10, color: 'var(--fish-warning)' }),
                      title: '恢复原文，可重新提炼',
                      onClick: () => setConfirm({ id: m.id, kind: 'refineundo' }),
                    },
                    '退回',
                  )
                : null,
              React.createElement(
                'div',
                {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }), onClick: () => setEdit({ id: m.id, text: m.text, importance: typeof m.importance === 'number' ? m.importance : 0.5 }) },
                '编辑',
              ),
              React.createElement('div', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)' }), onClick: () => setConfirm({ id: m.id, kind: 'delete' }) }, '删除'),
            ),
            m.qqSource ? React.createElement('div', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', overflowWrap: 'anywhere' }) },
              '来源：' + m.qqSource.type + ' ' + m.qqSource.chatId + ' · ' + ({ owner: '主人私聊', member: '群成员', peer: '私聊对象', manual: '人工记录（对象待核对）' }[m.qqSource.role] || '对象待核对') + ' · 发送者：' + ((m.qqSource.senders || []).join(', ') || '未确认')) : null,
            edit && edit.id === m.id ? 改一条(m) : null,
            confirm && confirm.id === m.id && confirm.kind === 'refineundo'
              ? React.createElement(
                  'div',
                  { style: S.confirm },
                  React.createElement('span', { style: { flex: 1 } }, '恢复提炼前原文并重置提炼状态？'),
                  React.createElement('button', {type: 'button',  style: S.btn, onClick: () => 退原文(m.id) }, '退回'),
                  React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                )
              : null,
            m.textBefore && 看原文[m.id]
              ? React.createElement(
                  'div',
                  {
                    style: Object.assign({}, S.dim, {
                      margin: '4px 0 8px',
                      fontSize: 'var(--fish-small)',
                      whiteSpace: 'pre-wrap',
                      // 注意：pre-wrap 只在空格/换行处断，长串（网址、长英文）照样横向撑破面板 —— 得补这两条
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                      borderLeft: '2px solid var(--fish-warning)',
                      paddingLeft: 8,
                    }),
                  },
                  '提炼前：' + m.textBefore,
                )
              : null,
            m.related && m.related.length
              ? React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { margin: '4px 0 8px', fontSize: 'var(--fish-small)', overflowWrap: 'anywhere', wordBreak: 'break-word' }) },
                  '检索词：' + m.related.join(' '),
                )
              : null,
            // ⭐⭐ 2026-09-23：**「这条讲的是哪件事」** —— 挂在这儿（第二行小字），不占行里的宽度
            //   ⚠注意：别用「事实键」这种我自己造的词 ——
            //     她说了「让人看不懂，写通俗一点的」✗
            m.事实键
              ? React.createElement(
                  'div',
                  { style: { margin: '4px 0 8px', fontSize: 'var(--fish-small)', overflowWrap: 'anywhere', wordBreak: 'break-word' } },
                  React.createElement('span', { style: S.dim }, '关联事实：'),
                  React.createElement(
                    'span',
                    {
                      style: { padding: '1px 6px', borderRadius: 8, background: 'var(--fish-soft)', color: 'var(--fish-info)', overflowWrap: 'anywhere' },
                      title:
                        '关联事实为「' + m.事实键 + '」。' +
                        '同一事实仅保留最新条目，旧条目可恢复。',
                    },
                    m.事实键,
                  ),
                )
              : null,
            confirm && confirm.id === m.id && confirm.kind === 'delete'
              ? 确认条('将此条目移入回收站？删除后可恢复。', '移入回收站', 'delete', m.id)
              : null,
          )

        const 已删 = s.deleted || []
        // ⭐⭐ 2026-09-24（她说的「那已被取代应该回回收站呀」）：
        //   被取代的**从主列表挪走**，收进「已删掉的」那一栏
        //   理由：它们已经不再被注入了，跟「收起来的」是一个性质，
        //         摆在主列表里只是占地方（还会挂个牌子把正文挤窄）
        //
        //   ⚠注意：但**不许挪进 `s.deleted`** —— 那是「她亲手删的」那一栏，
        //     「批量清掉」「把已删掉的清空」会**真销毁**它们 ✗
        //     被取代的是**自动标的**（几百条一起），
        //     不该被那两个按钮连坐销毁 —— 那正是丢 157 条那次的教训 ✗✗
        //   → 所以：**显示上**收进回收站，**数据上**还留在 memories 里，
        //     只是带一个「已被取代」的旗子
        const 被取代的 = (s.memories || []).filter((m) => m.已被取代)
        const 活着的 = (s.memories || []).filter((m) => !m.已被取代)

        // ---- 记忆列表的检索（几百条的时候靠翻是翻不到的）----
        // 正文、提炼前的原文、检索词、来源、id 都能搜
        const 关键字 = 搜词.trim().toLowerCase()
        const 搜过 = 关键字
          ? 活着的.filter((m) => {
              const 包 = (x) => String(x || '').toLowerCase().indexOf(关键字) >= 0
              return (
                包(m.text) ||
                包(m.textBefore) ||
                包(m.source) ||
                包(m.id) ||
                (Array.isArray(m.related) && 包(m.related.join(' ')))
              )
            })
          : 活着的

        // ⭐ 2026-09-24（反馈）：**把「记了时间的」和「没记时间的」分开**
        //   上一版它们混在一个列表里 —— 188 条有日期的排在上面，下面 662 条没日期的
        //   挤成「中间一坨」，看着就像排序坏了。原话：
        //   「还有中间没有记日期的，全卡在中间一坨了……不然的话记和没记的就全混在一起了，
        //     这个排序就没办法用了」
        //   她要**自己切** → 三种视图轮着切
        const 有时间 = (m) => !!m.at
        // ⭐⭐ 2026-09-22（她要的）：**「永远不淡」单独收成一栏**
        //   原话：「改了就会归纳到那个永远不会淡的那一行里去了，就是那一行，
        //              我们是**单独做一个收理的文件夹一样**的，不然的话那些就不需要露在外面」
        //   ⭐ 又说：「**外面都是会淡的，里面才是不会淡的**，就不用管里面了」
        //   ⚠注意：2026-09-22 再改（发现两条流水账被误标）：
        //     **「不会淡」的只有一类：长期事实**
        //     上一版我拿「鲜活度是不是钉住的」当判据 —— 那是**算分的副作用**，不是语义 ✗
        //     结果把 394 条**没抠到日期的流水账**错收进「不会淡的」里 ✗✗
        //     （一眼就看出不对）
        //     没记时间的现在**也会淡**（从「记下来的那天」开始算）→ 算「会淡的」✓
        const 不会淡 = (m) => m.category === 'stable_profile'
        const 过滤后 =
          看哪边 === '有时间'
            ? 搜过.filter(有时间)
            : 看哪边 === '没时间'
              ? 搜过.filter((m) => !有时间(m))
              : 看哪边 === '长期事实'
                ? 搜过.filter(不会淡)
                : 看哪边 === '会淡的'
                  ? 搜过.filter((m) => !不会淡(m))
                  : 搜过

        // ⭐ 排好序再画 —— 按**最左边那一列的日期**排 ✗✗
        //   上一版写的是 过滤后.slice().reverse()，那是把数组倒过来（谁先记谁在前翻个个儿），
        //   **根本没看日期**。所以补完日期顺序一点没变 —— 她一眼就看出来了 ✗
        // 这一版：有日期的按日期排，**没日期的排最后**（没日期 = 不知道啥时候的事，
        //   搁在中间会把有日期的顶散）✓
        // 注意：「没时间」那个视图里全是没日期的 → 保留类里原来的相对次序（谁先记谁在前），
        //   这样「旧的在前 / 新的在前」切一下还能看出入库先后来
        const 排序 = (m) => {
          const t = m.at ? new Date(m.at).getTime() : NaN
          return isFinite(t) ? t : null
        }
        const 排好 = 过滤后.slice().sort((a, b) => {
          const ta = 排序(a)
          const tb = 排序(b)
          if (ta === null && tb === null) return 0 // 都没日期：保持原来的相对次序
          if (ta === null) return 1 // 没日期的沉到最后
          if (tb === null) return -1
          return 顺序 === '旧' ? ta - tb : tb - ta
        })
        // 「没时间」那个视图里没有日期可比 —— 想按入库先后翻的时候还得能用
        const 画这个 = 看哪边 === '没时间' && 顺序 === '新' ? 排好.slice().reverse() : 排好
        const 有时间数 = 活着的.filter(有时间).length
        const 没时间数 = 活着的.length - 有时间数
        // ⭐ 2026-09-22：**不会淡的**单独收一栏（「全部」视图里才拆）
        //   ⭐ 判据 = 鲜活度钉住的那批（长期事实 + 没时间的）——
        //     原话：「外面都是会淡的，里面才是不会淡的」
        //   注意：2026-09-24：口径换成**活着的** —— 被取代的已经收进回收站了，
        //     不该还算在「会淡的/不会淡的」这些数里 ✗
        const 事实总数 = 活着的.filter(不会淡).length
        const 会淡总数 = 活着的.length - 事实总数

        // ⭐ 2026-09-21 晚：补日期 —— 正文里写着日期、当时却没抠出来的
        //   （老版本 抠日期 必须要四位数年份，而档案里写的是「09-17」「8月26日」）
        const 没日期的 = 活着的.filter((m) => !m.at).length
        const 补日期 = () => {
          setConfirm(null)
          setBusy(true)
          post('/backfill-dates', { session: s.id })
            .then((r) => {
              setBusy(false)
              setNotes([
                r && r.补了
                  ? '已补充 ' + r.补了 + ' 条日期' + (r.猜的 ? '（其中 ' + r.猜的 + ' 条年份按最近日期推定）' : '') + '，剩余 ' + r.还是没 + ' 条正文未包含日期'
                  : '正文无可识别日期',
              ])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['补日期失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐⭐ 2026-09-22（反馈）：**补标「永远不淡」** ——
        //   提炼原来只改重要度、不碰分类（0.7.6 才修好），
        //   所以实测库里 135 条该「永远不淡」的被标成了会淡的（重要的日子就在里面）。
        //   修好提炼只影响以后的，已经记下的那些得**单独补一遍**
        //   一条条问模型太慢 → 一批一批来，界面循环调（照「补日期」的样子）
        //   ⭐⭐ 2026-09-22 晚（反馈：「有好多那种就不该是长期事实的」）：
        //     现在判**所有没判过的**（不只「会淡的」）—— 该升的升、**该降的降**
        const 没判过的 = (s.memories || []).filter((m) => !m.stableChecked).length
        // ⭐ 2026-09-22（她要的批量删除）：勾了几条
        const 已选几条 = Object.keys(选中).filter((k) => 选中[k]).length
        // ⭐ 2026-09-22：判过几条（用来显示「重判一遍」）
        const 判过的 = (s.memories || []).filter((m) => m.stableChecked).length
        // ⭐ 2026-09-22（回收站的批量清掉）：勾了几条
        const 已选清几条 = Object.keys(选中清).filter((k) => 选中清[k]).length
        const 补不淡 = (重判) => {
          setConfirm(null)
          setBusy(true)
          let 累计判 = 0
          let 累计升 = 0
          let 累计降 = 0
          let 连着失败 = 0
          let 连着空 = 0
          let 头一趟 = true
          补标进度.在跑 = true
          补标进度.重判 = !!重判
          补标进度.已 = 0
          补标进度.总 = (s.memories || []).length
          补标进度.等 = 0
          const 跑 = () => {
            // 注意：重判：只在**第一趟**带这个参数（服务端会把所有「判过」标记清掉再从头判）
            const 体 = { session: s.id, 每批: 20 }
            if (重判 && 头一趟) 体.重判 = true
            头一趟 = false
            post('/backfill-stable', 体)
              .then((r) => {
                if (!r || !r.ok) {
                  // ⚠注意：2026-09-22（反馈：跑到一半「模型报错：429 status code (no body)」）：
                  //   限流是**暂时的**，不该直接放弃 —— 等一等再试同一批
                  //   指数退避：5s → 10s → 20s → 40s → 60s，最多 6 次
                  const 是限流 = /429|rate.?limit|too many|限流|超限/i.test(String((r && r.message) || ''))
                  if (是限流 && 连着失败 < 6) {
                    连着失败++
                    const 等 = Math.min(60000, 5000 * Math.pow(2, 连着失败 - 1))
                    补标进度.等 = Math.round(等 / 1000)
                    setNotes([
                      '模型请求受限（429），等待 ' + Math.round(等 / 1000) + ' 秒后重试（第 ' + 连着失败 + ' 次）',
                      '已保存进度，可继续处理',
                    ])
                    setTimeout(跑, 等)
                    return
                  }
                  补标进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '补标失败：' + ((r && r.message) || '？'),
                    '已保存进度，重试将继续处理',
                  ])
                  return
                }
                连着失败 = 0
                补标进度.等 = 0
                累计判 += r.判了 || 0
                累计升 += r.改成不淡 || 0
                累计降 += r.降成会淡 || 0
                补标进度.已 = 累计判
                if (r.共) 补标进度.总 = r.共
                // ⚠注意：2026-09-22 修（反馈「他就卡着判着呢」）：
                //   原来这里判「完了没」用的是 `判了 > 0` ——
                //   **一批回 0 条（模型没回东西）就被当成「判完了」直接停** ✗
                //   日志实锤：07:09:21「判了 0 条，还剩 665」之后就没动静了
                //   → 改成看**服务端的 done**；一批回 0 就**接着试下一批**
                //     连着 3 批都空才停（说明模型那边真出问题了），并说清楚
                连着空 = (r.判了 || 0) === 0 ? 连着空 + 1 : 0
                setNotes([
                  '判定中：已处理 ' + 累计判 + ' 条：' + 累计升 + ' 条标记为长期事实、' +
                    累计降 + ' 条转为普通记忆' + (r.done ? '' : '，剩余 ' + r.剩 + ' 条') +
                    (r.判了 === 0 && !r.done ? '（本批次无有效输出，继续下一批）' : ''),
                ])
                // 注意：每批之间**慢一点** —— 300ms 太急，容易撞限流（反馈就是 429 挂的）
                if (!r.done) {
                  if (连着空 >= 3) {
                    补标进度.在跑 = false
                    setBusy(false)
                    setNotes([
                      '连续 3 批无有效输出，已暂停（剩余 ' + r.剩 + ' 条）。',
                      '已保存进度，重试将继续处理',
                    ])
                    return
                  }
                  setTimeout(跑, 1500)
                } else {
                  补标进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '判定完成：共 ' + 累计判 + ' 条 —— ' + 累计升 + ' 条标记为长期事实，' +
                      累计降 + ' 条改为普通记忆',
                    '（已完成全部未判定条目）',
                  ])
                  load()
                }
              })
              .catch((e) => {
                补标进度.在跑 = false
                setBusy(false)
                setNotes(['补标失败：' + ((e && e.message) || e), '已保存进度，重试将继续处理'])
              })
          }
          跑()
        }

        // ⭐⭐ 2026-09-23（第三步）：**清洗补键** —— 给老记忆补「事实键」✓
        //
        //   为什么单独一步：提炼只影响**以后**导入的；
        //   老库里那些条目是导入时进来的，**本来就没有键** ——
        //   不补的话「同一个 key 只留最新一条」对老数据一点用都没有 ✗
        //
        //   ⚠注意：**只在设置页点按钮跑，不在对话里跑**（她的死规矩）：
        //     几百条要调几百次模型，挂在对话那一轮上会把那轮卡死。
        //   注意：先「干跑」看一眼，确认了再真洗 —— 这一步要改几百条，别一上来就动库
        // 注意：算「还剩几条要洗」要跟服务端的 `要洗` **同一个口径** ——
        //   洗过的（含判了留空的）不算，不然按钮上的数字永远不消 ✗
        const 没键的 = (s.memories || []).filter((m) => !m.已被取代 && !m.refinedSkip && !m.事实键 && !m.洗键过).length
        // 判了「留空」的那些（洗过、但没键）—— 单独报个数，免得她以为漏了
        const 判留空的 = (s.memories || []).filter((m) => !m.事实键 && m.洗键过).length
        // ⚠注意：撤回按钮上的数字要跟**它真能撤的**对得上 ✗
        //   原来用的是「所有带键的」—— 把她自己手工填的也算进去了，
        //   于是按钮写「撤掉这次标的（5）」、真撤只撤掉 2 条，数对不上（她会以为坏了）
        const 可撤的 = (s.memories || []).filter((m) => m.键来源 === '清洗补键' || m.洗键过).length
        const 洗键 = (干跑) => {
          setConfirm(null)
          setBusy(true)
          let 累计洗 = 0
          let 累计给 = 0
          let 累计空 = 0
          let 累计废 = 0
          let 连着失败 = 0
          let 连着空 = 0
          洗键进度.在跑 = true
          洗键进度.干跑 = !!干跑
          洗键进度.已 = 0
          洗键进度.总 = 没键的
          const 跑 = () => {
            // 注意：干跑：只跑**一批**就停 —— 让她看几个例子再决定，
            //   不许拿几百次模型调用去"试" ✗
            const 体 = { session: s.id, 每批: 8, 干跑: !!干跑 }
            post('/wash-keys', 体)
              .then((r) => {
                if (!r || !r.ok) {
                  const 是限流 = /429|rate.?limit|too many|限流|超限/i.test(String((r && r.message) || ''))
                  if (是限流 && 连着失败 < 6) {
                    连着失败++
                    const 等 = Math.min(60000, 5000 * Math.pow(2, 连着失败 - 1))
                    setNotes([
                      '模型请求受限（429），等待 ' + Math.round(等 / 1000) + ' 秒后重试（第 ' + 连着失败 + ' 次）',
                      '已保存进度，可继续处理',
                    ])
                    setTimeout(跑, 等)
                    return
                  }
                  洗键进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '清洗失败：' + ((r && r.message) || '？'),
                    '已保存进度，重试将继续处理',
                  ])
                  return
                }
                连着失败 = 0
                累计洗 += r.洗了 || 0
                累计给 += r.给了键 || 0
                累计空 += r.留空 || 0
                累计废 += r.作废了 || 0
                洗键进度.已 = 累计洗
                if (r.总数) 洗键进度.总 = 没键的
                // ⚠注意：「模型整批没回出东西」才算失败，**不许拿「给了键 === 0」当信号** ✗
                //   模型正常地把一批全判成留空时，给了键也是 0 ——
                //   原来按那个数，连着 3 批就误报「模型没回出键」停下来（实测踩到过）
                连着空 = (r.没回出东西 || 0) >= (r.洗了 || 0) ? 连着空 + 1 : 0
                if (干跑) {
                  // 干跑：把几个例子摆出来，让她看一眼标得对不对
                  洗键进度.在跑 = false
                  setBusy(false)
                  const 例 = (r.示例 || []).map((x) => '　「' + x.键 + '」　←　' + x.正文)
                  setNotes(
                    [
                      '试运行：处理 ' + (r.洗了 || 0) + ' 条，原文保留；已标注 ' + (r.给了键 || 0) + ' 条、无需标注 ' + (r.留空 || 0) + ' 条',
                      '标注结果（事实键 → 记忆正文）',
                    ]
                      .concat(例.length ? 例 : ['　（本批次无需标注）'])
                      .concat(['', '核对结果后可执行全部标注。此操作为可选项。']),
                  )
                  return
                }
                setNotes([
                  '标注中：已处理 ' + 累计洗 + ' 条，已标注 ' + 累计给 + ' 条、无需标注 ' + 累计空 + ' 条' +
                    (累计废 ? '、归档 ' + 累计废 + ' 条' : '') +
                    (r.done ? '' : '，剩余 ' + r.剩 + ' 条'),
                ])
                if (!r.done) {
                  if (连着空 >= 3) {
                    洗键进度.在跑 = false
                    setBusy(false)
                    setNotes([
                      '连续 3 批无输出，已暂停（剩余 ' + r.剩 + ' 条）。',
                      '已保存标注进度，重试将继续处理',
                      '（无需标注的批次将自动跳过）',
                    ])
                    return
                  }
                  setTimeout(跑, 1500)
                } else {
                  洗键进度.在跑 = false
                  setBusy(false)
                  setNotes([
                    '处理完成：共 ' + 累计洗 + ' 条，已标注 ' + 累计给 + ' 条、无需标注 ' + 累计空 + ' 条' +
                      (累计废 ? '，其中 ' + 累计废 + ' 条旧事实已归档，可恢复' : ''),
                    '无需标注的条目保持原状，可撤销自动标注。',
                  ])
                  load()
                }
              })
              .catch((e) => {
                洗键进度.在跑 = false
                setBusy(false)
                setNotes(['处理失败：' + ((e && e.message) || e), '已保存标注进度，重试将继续处理'])
              })
          }
          跑()
        }

        // 整份撤回（把这次自动标的全撤掉、顺手收起来的全放回来）✓
        const 撤销洗键 = () => {
          setConfirm(null)
          setBusy(true)
          post('/wash-keys/undo', { session: s.id })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['撤回失败：' + ((r && r.message) || '？')])
                return
              }
              setNotes([
                '已撤销 ' + (r.摘了 || 0) + ' 条自动标注，恢复 ' + (r.恢复 || 0) + ' 条归档条目',
                '（仅撤销自动标注，保留手动标注）',
              ])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['撤回失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐ 2026-09-22（反馈「回收站还没有批量删除，就批量清空」）：
        //   「已删掉的」那一栏补一个**批量清掉**
        //   注意：这个是**真销毁**（不是收起来）→ 界面必须问两遍
        // ⭐⭐ 2026-09-23（反馈：「那这里没有批量找回呀」）：
        //   「已删掉的」原来只有**批量清掉**，想全捞回来只能一条条点「找回来」✗
        //   → 补一个**批量找回**（勾了哪几条就捞哪几条）
        //   注意：`只合并` = 只捞「合并掉的」那批 —— 等于**一键撤销整次合并**
        //   注意：这个**不是销毁**，是往回捞，所以不用问两遍；但界面上还是先说一句捞几条
        const 批回 = (会话, 只合并) => {
          const ids = 只合并 ? [] : Object.keys(选中清).filter((k) => 选中清[k])
          if (!只合并 && !ids.length) {
            set批回问(false)
            return
          }
          setBusy(true)
          post('/delete', Object.assign({ session: 会话.id, action: 'restorebatch', ids: ids }, 只合并 ? { 只找回合并掉的: true } : {}))
            .then((r) => {
              setBusy(false)
              set批回问(false)
              if (!r || !r.ok) {
                setNotes(['批量恢复失败：' + ((r && r.message) || '？')])
                return
              }
              set选中清({})
              setNotes(['' + r.message + '（回收站剩余 ' + r.剩 + ' 条）'])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['批量恢复失败：' + ((e && e.message) || e)])
            })
        }
        const 批清 = (会话) => {
          const ids = Object.keys(选中清).filter((k) => 选中清[k])
          if (!ids.length) {
            set批清问(false)
            return
          }
          setBusy(true)
          post('/delete', { session: 会话.id, action: 'purgebatch', ids: ids })
            .then((r) => {
              setBusy(false)
              set批清问(false)
              if (!r || !r.ok) {
                setNotes(['批量删除失败：' + ((r && r.message) || '？')])
                return
              }
              set选中清({})
              setNotes(['' + r.message + '（回收站剩余 ' + r.剩 + ' 条）'])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['批量删除失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐⭐ 2026-09-22（反馈：「查重我们是不是还没做啊？我怎么没有找到按钮」）：
        //   去重一直有，但都是**自动**的 —— 召回时（注入前只留一条）、导入时。
        //   **库里已经存着的重复没人管** ✗
        //   注意：不能一键全合：「汇总+明细」那种一长一短，合了会丢信息
        //     → 真重复给「一键合」，汇总+明细只列出来让她自己挑
        const 去查重 = (会话) => {
          setBusy(true)
          // ⚠注意：面板在**记忆列表那一块里**（跟「补标不淡」的确认框一样），
          //   列表默认是折叠的 —— 不展开就看不见面板 ✗
          //   → 点查重时**顺手把列表展开**（按钮本身在标题行，永远看得见）
          set看记忆(true)
          post('/duplicates', { session: 会话.id })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['查重失败：' + ((r && r.message) || '？')])
                return
              }
              const 选 = {}
              const 勾 = {}
              ;(r.组 || []).forEach((g, i) => {
                // 默认留**最长**的那条 —— 「汇总+明细」时长的信息更全，别默认留短的 ✗
                选[i] = g.条们.reduce((a, b) => (b.长 > a.长 ? b : a), g.条们[0]).id
                // ⭐ 「真重复」默认勾上（合了安全）；「汇总+明细」默认**不勾**（合了会丢信息）✓
                勾[i] = g.类型 === '真重复'
              })
              set查重(r)
              set查重选(选)
              set查重合(勾)
              set查重开(true)
              if (!(r.组 || []).length) setNotes(['未发现重复记忆'])
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['查重失败：' + ((e && e.message) || e)])
            })
        }
        // 合掉：每组留一条，其余交给**服务端再验一遍**（不像的会被保住）✓
        //   ⚠注意：2026-09-22 修（反馈：「把一些别的对的事实给删了」）：
        //     原来客户端自己算好「删哪些」就发过去，服务端不验 ✗
        //     现在发的是「组」（留哪条、删哪些），**服务端自己再算一遍相似度**
        const 合重复 = (会话, 只合真重复) => {
          if (!查重) return
          const 组们 = []
          ;(查重.组 || []).forEach((g, i) => {
            if (只合真重复 && g.类型 !== '真重复') return
            // ⭐⭐ 2026-09-23：「按我选的合」**只合勾上的组** ——
            //   原来它把每一组都合掉（默认全选中），一点就丢掉 123 条 ✗
            if (!只合真重复 && !查重合[i]) return
            const 留 = 查重选[i] || g.条们[0].id
            const 删 = g.条们.filter((t) => t.id !== 留).map((t) => t.id)
            if (删.length) 组们.push({ 留: 留, 删: 删 })
          })
          if (!组们.length) {
            setNotes([
              只合真重复 ? '本批次无完全重复组' : '未选择合并组。汇总与明细组需手动选择。',
            ])
            return
          }
          setBusy(true)
          post('/duplicates/merge', { session: 会话.id, 组: 组们 })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['合并：' + ((r && r.message) || '？')])
                return
              }
              const 行 = ['' + r.message + '（剩下的：' + r.剩 + ' 条）', '已合并条目移入回收站，可恢复。']
              if (r.保住) {
                行.push('注意：有 ' + r.保住 + ' 条相似度不足，已保留：')
                ;(r.保住明细 || []).forEach((x) => 行.push('　　' + x.像度 + '  ' + x.text))
              }
              setNotes(行)
              set查重(null)
              set查重开(false)
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['合并失败：' + ((e && e.message) || e)])
            })
        }

        // ⭐⭐ 2026-09-22（她要的）：**批量删** —— 收进「已删」，不是销毁
        //   「还是需要 2 次确认的」→ 点按钮只出确认条，确认条上再点才删
        const 批删 = (会话) => {
          const ids = Object.keys(选中).filter((k) => 选中[k])
          if (!ids.length) {
            set批删问(false)
            return
          }
          setBusy(true)
          post('/delete', { session: 会话.id, action: 'batchdelete', ids: ids })
            .then((r) => {
              setBusy(false)
              set批删问(false)
              if (!r || !r.ok) {
                setNotes(['批量删失败：' + ((r && r.message) || '？')])
                return
              }
              set选中({})
              setNotes(['' + r.message + '（剩下的：' + r.剩 + ' 条）', '已删除条目移入回收站，可恢复。'])
              load()
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['批量删失败：' + ((e && e.message) || e)])
            })
        }

        // ═══════════════════════════════════════════════════════════
        // ⭐⭐ 2026-09-22（她的第十件）：**从会话生成档案** —— 给别人用的功能
        //
        //   ① 看这个工作区有哪些会话、勾几个
        //   ② 算要切几批、多少字（**不花钱**）
        //   ③ 一批一批跑（注意：这一步调模型、花钱）—— 跑完一批就把条目攒起来，
        //      下一批带上「已经记过的」，同一件事不会被收两遍
        //   ④ 存成档案文件 → 再走已有的「从旧档案导入」变成记忆条目
        // ═══════════════════════════════════════════════════════════════
        const 开生成 = () => {
          set生成开(true)
          set生成会话(null)
          set生成计划(null)
          set生成条目([])
          set生成档(null)
          set生成进度(null)
          post('/gen-sessions', { session: s.id })
            .then((r) => {
              if (!r || !r.ok) {
                setNotes(['读会话列表失败：' + ((r && r.message) || '？')])
                return
              }
              set生成会话(r.会话 || [])
              set生成诊断(r.诊断 || null)
              // 建议路径（服务端按这个会话的工作目录算的）—— 用户能改
              if (r.建议存到) set生成存到(String(r.建议存到))
              // ⚠注意：2026-09-22（反馈：「默认不该全选」）：
              //   原来我默认**全勾上** —— 那等于替用户决定「全都处理一遍」，
              //   而这一步后面是要**调模型、花钱**的 ✗
              //   → 默认**一个都不勾**，让用户自己挑
              set生成选({})
            })
            .catch((e) => setNotes(['读会话列表失败：' + ((e && e.message) || e)]))
        }

        const 勾的sid = () => Object.keys(生成选).filter((k) => 生成选[k])

        const 算生成 = () => {
          const sids = 勾的sid()
          if (!sids.length) {
            setNotes(['未选择会话'])
            return
          }
          setBusy(true)
          setNotes(['正在读取、去重与分段…'])
          post('/gen-plan', { session: s.id, sids: sids })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['预估失败：' + ((r && r.message) || '？')])
                return
              }
              set生成计划(r)
              set生成条目([])
              set生成档(null)
              setNotes([])
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['预估失败：' + ((e && e.message) || e)])
            })
        }

        const 跑生成 = () => {
          const sids = 勾的sid()
          if (!sids.length || !生成计划) return
          const 总批 = 生成计划.批数
          setBusy(true)
          set生成档(null)
          const 攒 = 生成条目.slice()
          let 连着空 = 0
          const 跑一批 = (批号) => {
            if (批号 > 总批) {
              setBusy(false)
              set生成进度(null)
              setNotes(['处理完成：' + 总批 + ' 批，提取 ' + 攒.length + ' 条。' + (攒.length ? '可保存为档案文件。' : '本轮未提取到条目，可重试或更换会话。输出长度已记录到诊断日志。')])
              return
            }
            set生成进度({ 批号, 批数: 总批, 在跑: true, 模型: (生成进度 && 生成进度.模型) || '' })
            post('/gen-run', {
              session: s.id,
              sids: sids,
              批号: 批号,
              // 注意：把前面攒的条目当「已记清单」传过去 —— 这是防重复的机制
              已记: 攒.map((x) => x.章 + '|' + x.日期 + '|' + x.话),
              provider: 生成备 ? 生成备.provider : undefined,
              model: 生成备 ? 生成备.model : undefined,
            })
              .then((r) => {
                if (!r || !r.ok) {
                  setBusy(false)
                  set生成进度(null)
                  setNotes(['第 ' + 批号 + ' 批失败：' + ((r && r.message) || '？'), '已保存 ' + 攒.length + ' 条，重试将继续处理'])
                  return
                }
                if (r.条目 && r.条目.length) {
                  r.条目.forEach((x) => 攒.push(x))
                  连着空 = 0
                } else {
                  连着空++
                }
                set生成条目(攒.slice())
                set生成进度({ 批号, 批数: 总批, 在跑: true, 模型: r.模型 || '' })
                if (r.done) {
                  setBusy(false)
                  set生成进度(null)
                  setNotes(['处理完成：' + 总批 + ' 批，提取 ' + 攒.length + ' 条。' + (攒.length ? '可保存为档案文件。' : '本轮未提取到条目，可重试或更换会话。输出长度已记录到诊断日志。')])
                  return
                }
                // 一批回 0 条不算失败，但也别无限跑 —— 连着 3 批空就停
                if (连着空 >= 3) {
                  setBusy(false)
                  set生成进度(null)
                  setNotes(['连续 3 批无输出，已暂停，可重试继续。'])
                  return
                }
                setTimeout(() => 跑一批(批号 + 1), 300)
              })
              .catch((e) => {
                setBusy(false)
                set生成进度(null)
                setNotes(['第 ' + 批号 + ' 批失败：' + ((e && e.message) || e), '重试将继续处理'])
              })
          }
          跑一批(1)
        }

        const 存生成 = () => {
          if (!生成条目.length) {
            setNotes(['暂无条目'])
            return
          }
          setBusy(true)
          post('/gen-save', { session: s.id, 条目: 生成条目, 来源: (生成计划 && 生成计划.天数 + ' 天') || '', 存到: 生成存到 })
            .then((r) => {
              setBusy(false)
              if (!r || !r.ok) {
                setNotes(['存失败：' + ((r && r.message) || '？')])
                return
              }
              set生成档(r)
              setNotes(['档案存到：' + r.存到, '共 ' + r.条数 + ' 条' + (r.去掉重复 ? '（去掉了 ' + r.去掉重复 + ' 条重复）' : '')])
            })
            .catch((e) => {
              setBusy(false)
              setNotes(['存失败：' + ((e && e.message) || e)])
            })
        }

        // ---- 用 DSH 自己的模型给记忆扩词 ----
        // 「直接用我们 deepseek 的可不可以」→ 可以 插件能调宿主模型，不用外部 key
        const 没扩的 = (s.memories || []).filter((m) => !m.related || !m.related.length).length
        // 要提炼的：档案导入进来的、还没提炼过的
        const 没提炼的 = (s.memories || []).filter((m) => String(m.source || '').indexOf('档案导入') === 0 && !m.refined).length
        const 扩词区 = () => {
          const 小件 = []
          小件.push(h('h3', { key: 'h' }, '提炼与扩词'))
          小件.push(h('div', { className: 'memory-methods', key: 'd' },
            h('div', null, h('strong', null, '扩词'), h('p', null, '补充关键词，帮助相关问题找到记忆。保留原始正文。')),
            h('div', null, h('strong', null, '提炼'), h('p', null, '把导入的档案整理成独立记忆。修改前保存原文，可撤销。'))))

          // ---- 选模型 ----
          const 当前 = mdl && mdl.选中的 ? mdl.选中的 : (mdl && mdl.默认) || null
          const 当前串 = 当前 ? 当前.provider + ' / ' + 当前.model : '（未读取）'
          小件.push(
            React.createElement(
              'div',
              { key: 'pick', style: S.nameBox },
              React.createElement('div', { style: { flex: 'none', width: 100 } }, '处理模型'),
              mdl
                ? React.createElement(
                    'select',
                    {'aria-label': '处理模型',
                      style: Object.assign({}, S.inp, { width: 300 }),
                      value: 当前 ? 当前.provider + '|' + 当前.model : '',
                      onChange: (e) => {
                        const v = String(e.target.value || '')
                        const i = v.indexOf('|')
                        const 选 = i > 0 ? { provider: v.slice(0, i), model: v.slice(i + 1) } : null
                        saveNames({ llmModel: 选 }).then(() => {
                          setMdl(Object.assign({}, mdl, { 选中的: 选 }))
                        })
                      },
                    },
                    React.createElement('option', { value: '' }, '（用会话自己的：' + (mdl.默认 ? mdl.默认.provider + '/' + mdl.默认.model : '？') + '）'),
                    (mdl.providers || []).map((p) =>
                      React.createElement(
                        'optgroup',
                        { key: p.id, label: p.name + '（' + (p.models || []).length + ' 个）' },
                        (p.models || []).map((m) =>
                          React.createElement('option', { key: p.id + '|' + m.id, value: p.id + '|' + m.id }, m.name + '　（' + p.id + '）'),
                        ),
                      ),
                    ),
                  )
                : React.createElement('span', { style: S.dim }, '使用当前会话模型，也可读取列表后指定。'),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () => {
                    setExpNote('读取中…')
                    post('/models', { session: open })
                      .then((r) => {
                        setMdl(r)
                        setExpNote(
                          r && r.ok
                            ? 'DSH 里有 ' + (r.providers || []).length + ' 个 provider，共 ' +
                              (r.providers || []).reduce((a, p) => a + (p.models || []).length, 0) + ' 个模型。现在用：' + 当前串
                            : '失败：' + ((r && r.message) || '？'),
                        )
                      })
                      .catch((e) => setExpNote('失败：' + String((e && e.message) || e)))
                  },
                },
                '读取模型列表',
              ),
            ),
          )

          // ⚠⚠注意：2026-09-22（她的反馈，原话）：
          //   「他那个就是重判的进度条跟那个提炼的是在一起呀。我发现我得往下翻
          //     才能看到进度条，那就不对呀。重判应该有个单独的进度条吧？如果你
          //     点了的话，它就会弹出来；如果没点，它就没有。」
          //   她说得对 —— 补标/重判的进度条原来**跟「模型与扩词」「提炼」挤在
          //   同一张卡里**，点了重判得往上翻才看得见，没点的人还会以为那条是
          //   自己点出来的 ✗
          //   → 搬走：谁点的，进度条就跟在谁的按钮旁边（下面那个按钮行里）✓
          // ---- 进度条 ----
          if (exp && exp.总) {
            const 已 = Math.max(0, exp.总 - exp.剩)
            const 百 = exp.总 ? Math.round((已 / exp.总) * 100) : 0
            小件.push(
              React.createElement(
                'div',
                { key: 'bar', style: { margin: '8px 0' } },
                React.createElement(
                  'div',
                  { style: S.barOut },
                  React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                  (exp.模式 || '扩词') + '：' + 已 + ' / ' + exp.总 + ' 条（' + 百 + '%）' + (exp.剩 ? '　剩余 ' + exp.剩 + ' 条' : '　已完成'),
                ),
              ),
            )
          }
          // 提炼的进度条（跟扩词各一条，不互相盖）✓
          if (rf && rf.总) {
            const 已 = Math.max(0, rf.总 - rf.剩)
            const 百 = rf.总 ? Math.round((已 / rf.总) * 100) : 0
            小件.push(
              React.createElement(
                'div',
                { key: 'rfbar', style: { margin: '8px 0' } },
                React.createElement(
                  'div',
                  { style: S.barOut },
                  React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                  '提炼：' + 已 + ' / ' + rf.总 + ' 条（' + 百 + '%）' + (rf.剩 ? '　剩余 ' + rf.剩 + ' 条' : '　已完成'),
                ),
              ),
            )
          }

          小件.push(
            React.createElement(
              'div',
              { key: 'b', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '8px 0' } },
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  disabled: !!(exp && exp.running),
                  onClick: () => {
                    setExpNote('测试中…')
                    post('/llm-check', { session: open })
                      .then((r) => {
                        setExpNote(
                          r && r.ok
                            ? '模型通了（' + r.provider + ' / ' + r.model + '，' + r.ms + 'ms）→ 它回了「' + String(r.text || '').slice(0, 20) + '」'
                            : '失败：不通：' + ((r && r.message) || '？'),
                        )
                      })
                      .catch((e) => setExpNote('失败：' + String((e && e.message) || e)))
                  },
                },
                '检查模型连接',
              ),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btnDanger,
                  disabled: !!(exp && exp.running) || 没扩的 === 0,
                  onClick: () => {
                    let 累计 = 0
                    let 空批 = 0 // 连着几批一条词都没扩出来
                    let 每批 = 6 // 空批就把批量减半 —— 输入越少、思考越少，越不容易被截断
                    const 跑 = () => {
                      post('/expand', { session: open, 每批: 每批 })
                        .then((r) => {
                          if (!r || !r.ok) {
                            setExp({ running: false, 累计: 累计, 总: s.memories.length, 剩: r ? r.剩 : 0 })
                            setExpNote('失败：' + ((r && r.message) || '？'))
                            load()
                            return
                          }
                          累计 += r.改了
                          setExp({ running: !r.done, 累计: 累计, 总: r.总数, 剩: r.剩, 模型: r.provider + '/' + r.model })
                          // 注意：一批没扩出词就收手的话，模型偶发抽风会让它看起来「自己取消」✗
                          //   空批就把**批量减半**（输入少 → 思考少 → 不容易被截断），
                          //   连着空三批才停，并说清楚原因
                          if (r.改了 > 0) {
                            空批 = 0
                            每批 = 6
                          } else {
                            空批++
                            每批 = Math.max(1, Math.floor(每批 / 2))
                          }
                          setExpNote(
                            r.改了
                              ? '本批次扩词 ' + r.改了 + ' 条，还剩 ' + r.剩 + ' 条（' + r.ms + 'ms/批，' + r.provider + '/' + r.model + '）'
                              : '本批次无有效关键词，下一批缩减至 ' + 每批 + ' 条后重试（剩余 ' + r.剩 + ' 条）',
                          )
                          if (!r.done && (r.改了 > 0 || 空批 < 3)) setTimeout(跑, 400)
                          else {
                            setExp({ running: false, 累计: 累计, 总: r.总数, 剩: r.剩 })
                            if (空批 >= 3) {
                              setExpNote('连续 ' + 空批 + ' 批无有效关键词（已缩减至 ' + 每批 + ' 条仍无输出），已暂停，可重试扩词')
                            }
                            load()
                          }
                        })
                        .catch((e) => {
                          setExp({ running: false, 累计: 累计, 总: s.memories.length, 剩: 没扩的 })
                          setExpNote('失败：' + String((e && e.message) || e))
                        })
                    }
                    setExp({ running: true, 累计: 0, 总: s.memories.length, 剩: 没扩的 })
                    setExpNote('开始…')
                    跑()
                  },
                },
                exp && exp.running ? '扩词中…' : '开始扩词',
              ),
              React.createElement('span', { style: S.dim }, '扩词：待处理 ' + 没扩的 + ' / ' + (s.memories || []).length + ' 条'),
            ),
          )

          // ---- 提炼（导入进来的档案原文 → 真正的记忆）----
          小件.push(
            React.createElement(
              'div',
              { key: 'rf', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '4px 0 8px' } },
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btnDanger,
                  disabled: !!(rf && rf.running) || 没提炼的 === 0,
                  onClick: () => {
                    let 累计 = 0
                    let 跳 = 0
                    let 词 = 0
                    let 日 = 0
                    let 重 = 0
                    let 没解 = 0
                    const 跑 = () => {
                      post('/refine', { session: open, 每批: 6 })
                        .then((r) => {
                          if (!r || !r.ok) {
                            setRf({ running: false, 累计: 累计, 总: s.memories.length, 剩: r ? r.剩 : 0, 模式: '提炼' })
                            setRfNote('失败：' + ((r && r.message) || '？'))
                            load()
                            return
                          }
                          累计 += r.改了
                          跳 += r.跳过 || 0
                          词 += r.出了词的 || 0
                          日 += r.出了日期的 || 0
                          重 += r.出了重要度 || 0
                          没解 += r.没解析出来 || 0
                          setRf({ running: !r.done, 累计: 累计, 总: 累计 + r.剩, 剩: r.剩, 模式: '提炼' })
                          setRfNote(
                            '本批次改写 ' + r.改了 + ' 条、跳过 ' + (r.跳过 || 0) + ' 条，还剩 ' + r.剩 + ' 条（' +
                              r.ms + 'ms/批，' + r.provider + '/' + r.model + '）',
                          )
                          if (!r.done) setTimeout(跑, 400)
                          else {
                            setRf({ running: false, 累计: 累计, 总: 累计, 剩: 0, 模式: '提炼' })
                            // 检索词是提炼顺手出的，所以跑完这趟通常不用再单独跑扩词
                            setRfNote(
                              '提炼完成：改写 ' + 累计 + ' 条，跳过 ' + 跳 + ' 条' +
                                (词 ? '；其中 ' + 词 + ' 条已生成检索词，无需扩词' : '（本批次无检索词，可执行扩词）') +
                                (日 ? '；' + 日 + ' 条已提取日期' : '') +
                                (重 ? '；' + 重 + ' 条已判定重要度' : '') +
                                (没解 ? '；有 ' + 没解 + ' 条无有效输出，可重试跳过条目' : ''),
                            )
                            load()
                          }
                        })
                        .catch((e) => {
                          setRf({ running: false, 累计: 累计, 总: s.memories.length, 剩: 没提炼的, 模式: '提炼' })
                          setRfNote('失败：' + String((e && e.message) || e))
                        })
                    }
                    setRf({ running: true, 累计: 0, 总: 没提炼的, 剩: 没提炼的, 模式: '提炼' })
                    setRfNote('开始提炼…')
                    跑()
                  },
                },
                rf && rf.running ? '提炼中…' : '开始提炼',
              ),
              React.createElement('span', { style: S.dim }, '提炼：待处理 ' + 没提炼的 + ' 条'),
            ),
          )
          // 提炼改坏了能退回 —— 单条的在下面每条记忆上，这里是整批
          {
            const 提炼过的 = (s.memories || []).filter((m) => m.textBefore).length
            if (提炼过的 > 0) {
              小件.push(
                React.createElement(
                  'div',
                  { key: 'undo', style: { margin: '2px 0 6px' } },
                  confirm && confirm.kind === 'refineundoall'
                    ? React.createElement(
                        'div',
                        { style: S.confirm },
                        React.createElement('span', { style: { flex: 1 } }, '把提炼过的 ' + 提炼过的 + ' 条恢复为原文并重置提炼状态？'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => 退原文('*') }, '全退回'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                      )
                    : React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          disabled: !!(rf && rf.running),
                          title: '将全部已提炼条目恢复为原文',
                          onClick: () => setConfirm({ id: '*', kind: 'refineundoall' }),
                        },
                        '退回全部原文（' + 提炼过的 + ' 条）',
                      ),
                ),
              )
            }
          }
          // 被「跳过」的（没改写过的）能放回队列重跑 ——
          // 模型偶尔整批回不出东西，那种不该永远躺着
          {
            const 跳过的 = (s.memories || []).filter((m) => m.refinedSkip && !m.textBefore).length
            if (跳过的 > 0) {
              小件.push(
                React.createElement(
                  'div',
                  { key: 'retry', style: { margin: '0 0 6px', fontSize: 'var(--fish-small)' } },
                  React.createElement(
                    'button',
                    {type: 'button',
                      style: S.btn,
                      disabled: !!(rf && rf.running),
                      title: '重新处理无有效输出的条目',
                      onClick: () =>
                        post('/refine/retry', { session: open })
                          .then((r) => {
                            setRfNote('放回了 ' + ((r && r.放回) || 0) + ' 条，可重新开始提炼')
                            load()
                          })
                          .catch((e) => setRfNote('放不回：' + String((e && e.message) || e))),
                    },
                    '重试跳过条目（' + 跳过的 + ' 条）',
                  ),
                ),
              )
            }
          }
          if (expNote) 小件.push(React.createElement('div', { key: 'n', style: Object.assign({}, S.ok, { fontSize: 'var(--fish-small)', margin: '4px 0' }) }, expNote))
          if (rfNote) 小件.push(React.createElement('div', { key: 'n2', style: Object.assign({}, S.ok, { fontSize: 'var(--fish-small)', margin: '4px 0' }) }, rfNote))

          // ---- 复制记忆到别的会话 ----
          // 新开一个空对话把记忆复制过去 —— 那边一点历史都没有，测起来最干净
          {
            const 别的 = (d.sessions || []).filter((x) => x.id !== open)
            if (别的.length) {
              小件.push(
                React.createElement(
                  'div',
                  { key: 'copy', style: { marginTop: 14 } },
                  React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.h, { cursor: 'pointer' }), onClick: () => set复制开(!复制开) },
                    (复制开 ? '▾ ' : '▸ ') + '复制记忆到别的会话',
                  ),
                  复制开
                    ? React.createElement(
                        'div',
                        null,
                        React.createElement(
                          'div',
                          { style: S.nameBox },
                          React.createElement('div', { style: { flex: 'none', width: 76 } }, '复制到'),
                          React.createElement(
                            'select',
                            {'aria-label': '复制到',  style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 150 }), value: 复制到, onChange: (e) => set复制到(e.target.value) },
                            React.createElement('option', { value: '' }, '（选一个会话）'),
                            别的.map((x) =>
                              React.createElement('option', { key: x.id, value: x.id }, (x.title || x.id.slice(0, 18)) + '（' + x.count + ' 条）'),
                            ),
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',
                              style: S.btnDanger,
                              disabled: !复制到 || !!(exp && exp.running) || !!(rf && rf.running),
                              onClick: () => setConfirm({ id: '*', kind: 'copyto' }),
                            },
                            '复制过去（' + (s.memories || []).length + ' 条）',
                          ),
                        ),
                        confirm && confirm.kind === 'copyto'
                          ? React.createElement(
                              'div',
                              { style: S.confirm },
                              React.createElement('span', { style: { flex: 1 } }, '将当前库的 ' + (s.memories || []).length + ' 条记忆复制到目标会话？保留已有内容并跳过重复条目。'),
                              React.createElement('button', {type: 'button',  style: S.btnDanger, onClick: 复制过去 }, '确认复制'),
                              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                            )
                          : null,
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) },
                          '选择目标会话后复制。操作将启用目标会话记忆，仅补充缺失条目。',
                        ),
                      )
                    : null,
                ),
              )
            }
          }
          return 小件
        }

        // ---- 从旧档案导入 ----
        // 原则（照 AAAAGENT 的「导入旧聊天」）：
        //   ① 先扫出候选，挑完再落库 —— 不直接写进库
        //   ② 已遗忘的内容不能因为再导一次就复活
        //   ③ 猜不到日期就 null，绝不编
        const 扫描 = () => {
          setImpBusy(true)
          setImpNote(null)
          post('/import/scan', { session: open })
            .then((r) => {
              setImpBusy(false)
              if (!r || !r.ok) {
                setImpNote('扫不了：' + ((r && r.message) || '？'))
                return
              }
              // 默认只勾「记忆卡 / 总档案」这种明显是记忆的 ——
              // 同一个文件夹里还有我自己的工程笔记，那个不能导 ✗
              //
              // ⚠注意：2026-09-24 修（反馈：「别人导入会踩什么坑」时发现的）：
              //   原来**只认「记忆卡 / 总档案」两个词** —— 别人的档案叫
              //   `my_memories.md`、`关于我.md`、`profile.txt` → **一个都不勾**，
              //   扫完看着一片空白，很容易以为没扫到 ✗
              //   → 分三层：先认像记忆的名字；一个都没认出来就**勾上有内容的**（排除明显的笔记/说明）；
              //     实在拿不准就全勾上（她还能自己取消）✓
              const 像记忆 = /记忆卡|总档案|记忆|档案|回忆|自传|memory|memoir|profile|about|diary|journal/i
              const 像笔记 = /笔记|notes?|log|readme|说明|索引|目录|index|changelog|todo|草稿|draft|脚本|script/i
              const 文件们 = r.files || []
              const files = {}
              const 第一批 = 文件们.filter((f) => 像记忆.test(f.name))
              if (第一批.length) {
                for (const f of 文件们) files[f.name] = 像记忆.test(f.name)
              } else {
                const 第二批 = 文件们.filter((f) => f.候选 > 0 && !像笔记.test(f.name))
                if (第二批.length) {
                  for (const f of 文件们) files[f.name] = f.候选 > 0 && !像笔记.test(f.name)
                } else {
                  // 实在认不出来 → 有内容的都勾上，让她自己取消（总比一个都不勾好）
                  for (const f of 文件们) files[f.name] = f.候选 > 0
                }
              }
              setImp({ data: r, files: files, off: {}, open: {} })
              setImpOpen(true)
              // ⭐ 扫到 0 条时把**原因**显示出来 —— 静默的「0 条」最坑人 ✗
              if (r.提示) setImpNote(r.提示)
            })
            .catch((e) => {
              setImpBusy(false)
              setImpNote('扫不了：' + String((e && e.message) || e))
            })
        }

        const 选中条目 = () => {
          if (!imp) return []
          return (imp.data.items || []).filter((it) => imp.files[it.file] && imp.off[it.key] !== true)
        }

        const 导入 = () => {
          const 要导 = 选中条目()
          if (!要导.length) return
          setImpBusy(true)
          setImpNote(null)
          post('/import/apply', { session: open, storeId: s.storeId, items: 要导 })
            .then((r) => {
              setImpBusy(false)
              setImpNote(
                r && r.ok
                  ? '导进去了 ' + r.added + ' 条' + (r.重复 ? '（跳过重复 ' + r.重复 + ' 条）' : '') + (r.近似 ? '（跳过相似条目 ' + r.近似 + ' 条）' : '') + (r.删过 ? '（跳过已删除条目 ' + r.删过 + ' 条）' : '')
                  : '导不了：' + ((r && r.message) || '？'),
              )
              setImp(null)
              load()
            })
            .catch((e) => {
              setImpBusy(false)
              setImpNote('导不了：' + String((e && e.message) || e))
            })
        }

        const 导入区 = () => {
          const 小件 = []
          小件.push(React.createElement('div', { key: 'h', style: S.h }, '从旧档案导入'))
          小件.push(
            React.createElement(
              'div',
              { key: 'd', style: S.dim },
              '准备 .md 或 .txt 档案，扫描后先预览并选择条目，再写入当前记忆库。',
            ),
          )
          小件.push(h('details', { className: 'memory-import-guide', key: 'how' },
            h('summary', null, '档案准备建议'),
            h('ul', null,
              h('li', null, '一个文件一个主题，每行记录一件事。'),
              h('li', null, '有日期时保留日期，不确定时留空。'),
              h('li', null, '只导入预览中勾选的内容，导入后可整批撤销。'),
              h('li', null, '需要改写正文时，可到“整理与修复”执行提炼。'))))
          小件.push(
            React.createElement(
              'div',
              { key: 'b', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '8px 0' } },
              React.createElement('button', {type: 'button',  style: S.btn, disabled: impBusy, onClick: 扫描 }, impBusy ? '扫描中…' : '扫描档案'),
              imp ? React.createElement('span', { style: S.dim }, '目录：' + imp.data.dir) : null,
              imp && imp.data.selfName
                ? React.createElement('span', { style: S.dim }, '（人称：「' + imp.data.selfName + '」→「我」）')
                : React.createElement('span', { style: S.warn, fontSize: 'var(--fish-small)' }, '未设置库内称呼，导入时将保留原有人称。可先到“库内称呼”设置。'),
            ),
          )
          // 只导哪些文件 —— 同一个文件夹里常常还堆着别的文档，得能挑
          if (imp && imp.data && (imp.data.files || []).length) {
            小件.push(
              React.createElement(
                'div',
                {
                  key: 'files',
                  style: {
                    margin: '0 0 8px',
                    padding: '6px 10px',
                    borderRadius: 'var(--fish-radius-sm)',
                    background: 'var(--fish-soft)',
                    border: '1px solid var(--fish-border)',
                    fontSize: 'var(--fish-small)',
                  },
                },
                React.createElement('div', { style: S.dim }, '选择导入文件，默认选中记忆卡和总档案。'),
                React.createElement(
                  'div',
                  { style: { display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4 } },
                  (imp.data.files || []).map((f) =>
                    React.createElement(
                      'label',
                      {
                        key: f.name,
                        style: { cursor: 'pointer', display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', opacity: imp.files[f.name] ? 1 : 0.5 },
                      },
                      React.createElement('input', {'aria-label': f.name,
                        type: 'checkbox',
                        checked: !!imp.files[f.name],
                        onChange: (e) =>
                          setImp(Object.assign({}, imp, { files: Object.assign({}, imp.files, { [f.name]: e.target.checked }) })),
                      }),
                      f.name + '（' + f.候选 + ' 条）',
                    ),
                  ),
                ),
              ),
            )
          }
          if (impNote) 小件.push(React.createElement('div', { key: 'n', style: Object.assign({}, S.ok, { margin: '6px 0' }) }, impNote))

          // 导过几批 + 撤销 —— 注意：必须在 `if (!imp)` **之前**：
          // 导入完 imp 就清空了，放后面的话撤销按钮根本看不到 ✗
          const 批次 = s.importBatches || []
          if (批次.length) {
            小件.push(
              React.createElement(
                'div',
                { key: 'bt', style: { marginTop: 4 } },
                React.createElement('div', { style: { fontWeight: 600, margin: '8px 0 2px' } }, '导过 ' + 批次.length + ' 批'),
                批次.map((b) =>
                  React.createElement(
                    'div',
                    { key: b.id, style: Object.assign({}, S.row, S.条) },
                    React.createElement('div', { style: { flex: 1 } }, (b.at ? rel(b.at, Date.now()) : '（日期未知）') + '　' + b.n + ' 条'),
                    React.createElement(
                      'div',
                      {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                        style: Object.assign({}, S.drop, { flex: 'none', fontSize: 'var(--fish-small)', cursor: 'pointer' }),
                        onClick: () => {
                          setImpBusy(true)
                          post('/import/undo', { session: open, batch: b.id }).then((r) => {
                            setImpBusy(false)
                            setImpNote(
                              r && r.ok
                                ? '已撤销导入：移入回收站 ' + r.撤了 + ' 条（可在回收站恢复）'
                                : '撤销失败：' + ((r && r.message) || '？'),
                            )
                            load()
                          })
                        },
                      },
                      '撤销本次导入',
                    ),
                  ),
                ),
              ),
            )
          }

          if (!imp) return 小件

          // 档案目录（能选也能打）+ 档案里指她的名字
          const 现在目录 = impDir !== null ? impDir : imp.data.dir
          const 列目录 = (p) => {
            post('/dirs', { path: p || '' })
              .then((r) => {
                setImpDirs(r)
                if (r && r.ok && r.path) setImpDir(r.path)
              })
              .catch((e) => setExpNote('列不了目录：' + String((e && e.message) || e)))
          }
          // 注意：拆成两行、输入框用弹性宽度 ——
          //   原来四个控件挤一行，加起来 880px 撑破了 780px 的容器（放大之后更糟）✗
          小件.push(
            React.createElement(
              'div',
              { key: 'cfg', style: S.nameBox },
              React.createElement('div', { style: { flex: 'none', width: 92 } }, '档案目录'),
              React.createElement('input', {'aria-label': '档案目录',
                style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 130 }),
                value: 现在目录,
                onChange: (e) => setImpDir(e.target.value),
              }),
              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => 列目录(现在目录) }, '选文件夹'),
            ),
          )
          小件.push(
            React.createElement(
              'div',
              { key: 'cfg2', style: Object.assign({}, S.nameBox, { marginTop: -4 }) },
              React.createElement('div', { style: { flex: 'none', width: 92 } }, 'AI 名称'),
              React.createElement('input', {'aria-label': '选填，可自动识别',
                style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 130 }),
                placeholder: '选填，可自动识别',
                value: 名字串(),
                onChange: (e) => setImpNames(e.target.value),
              }),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () =>
                    post('/names/scan', { session: open, dir: 现在目录 })
                      .then((r) => set找名字(r))
                      .catch((e) => setExpNote('识别称呼失败：' + String((e && e.message) || e))),
                },
                '自动识别',
              ),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () =>
                    saveNames({
                      archiveDir: 现在目录,
                      userNames: 名字们(),
                    }).then(() => {
                      setImpDir(null)
                      setImpNames(null)
                      扫描()
                    }),
                },
                '保存并重扫',
              ),
            ),
          )
          // 自动找出来的候选 —— 点一下加进上面那格，再点一下减掉
          if (找名字) {
            小件.push(
              React.createElement(
                'div',
                { key: 'names', style: { margin: '0 0 8px', padding: '6px 10px', borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-soft)', border: '1px solid var(--fish-border)', fontSize: 'var(--fish-small)' } },
                找名字.ok === false
                  ? React.createElement('div', { style: S.drop }, '失败：' + (找名字.message || '识别失败'))
                  : React.createElement(
                      'div',
                      null,
                      React.createElement('div', null, 'AI 专用称呼，可选择添加：'),
                      React.createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0' } },
                        (找名字.候选 || []).map((x) => 一个名字块(x)),
                      ),
                      (找名字.互称 || []).length
                        ? React.createElement(
                            'div',
                            null,
                            React.createElement('div', { style: Object.assign({}, S.dim, { marginTop: 4 }) }, '共用称呼，添加后将「' + 找名字.互称[0].name + '」全换成称呼，一般别加：'),
                            React.createElement(
                              'div',
                              { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '6px 0' } },
                              (找名字.互称 || []).map((x) => 一个名字块(x, true)),
                            ),
                          )
                        : null,
                      React.createElement(
                        'div',
                        { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) },
                        '数字为出现次数。仅选择有效称呼，留空不影响导入。',
                      ),
                    ),
              ),
            )
          }
          // 现在扫的是哪个目录 —— 用文字再写一遍，不靠输入框
          小件.push(
            React.createElement(
              'div',
              { key: 'nowdir', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '2px 0 6px' }) },
              '现在扫的是：' + imp.data.dir + '　（' + (imp.data.files || []).length + ' 个文件，' + (imp.data.items || []).length + ' 条候选）',
            ),
          )
          // 文件夹选择器
          if (impDirs) {
            小件.push(
              React.createElement(
                'div',
                { key: 'dirs', style: { margin: '0 0 8px', padding: '6px 10px', borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-soft)', border: '1px solid var(--fish-border)', fontSize: 'var(--fish-small)' } },
                impDirs.ok === false
                  ? React.createElement('div', { style: S.drop }, '失败：' + (impDirs.message || '列不了'))
                  : React.createElement(
                      'div',
                      null,
                      React.createElement(
                        'div',
                        { style: Object.assign({}, S.dim, { marginBottom: 4 }) },
                        impDirs.path ? '「' + impDirs.path + '」的子文件夹：' : '选一个盘：',
                      ),
                      React.createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
                        impDirs.parent
                          ? React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: S.link, onClick: () => 列目录(impDirs.parent) }, '↑ 上一级')
                          : null,
                        (impDirs.dirs || []).map((d) =>
                          React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  key: d.path, style: S.link, onClick: () => 列目录(d.path) }, '📁 ' + d.name),
                        ),
                        (impDirs.dirs || []).length === 0 && !impDirs.parent
                          ? React.createElement('span', { style: S.dim }, '（无子文件夹）')
                          : null,
                      ),
                      React.createElement(
                        'div',
                        { style: Object.assign({}, S.dim, { marginTop: 4 }) },
                        '核对后保存并重新扫描',
                      ),
                    ),
              ),
            )
          }

          // 文件勾选
          小件.push(
            React.createElement(
              'div',
              { key: 'files', style: S.nameBox },
              React.createElement('div', { style: { flex: 'none', width: 100 } }, '已扫描文件'),
              React.createElement(
                'div',
                { style: { flex: 1 } },
                (imp.data.files || []).map((f) =>
                  React.createElement(
                    'label',
                    { key: f.name, style: { display: 'block', cursor: 'pointer' } },
                    React.createElement('input', {'aria-label': f.name,
                      type: 'checkbox',
                      checked: !!imp.files[f.name],
                      onChange: (e) => setImp(Object.assign({}, imp, { files: Object.assign({}, imp.files, { [f.name]: e.target.checked }) })),
                    }),
                    ' ' + f.name + '　' + f.候选 + ' 条',
                    /记忆卡|总档案/.test(f.name) ? null : React.createElement('span', { style: S.dim }, '（请核对并选择条目）'),
                  ),
                ),
              ),
            ),
          )

          // 按小节分组（只列勾了的文件）
          const 组 = {}
          for (const it of imp.data.items || []) {
            if (!imp.files[it.file]) continue
            const k = it.file + '｜' + (it.section || '（无分节）')
            if (!组[k]) 组[k] = { file: it.file, section: it.section || '（无分节）', items: [] }
            组[k].items.push(it)
          }
          const 组们 = Object.keys(组)
          const 选中 = 选中条目()
          const 字数 = 选中.reduce((a, it) => a + String(it.改后 || it.text).length, 0)

          小件.push(
            React.createElement(
              'div',
              { key: 'secbar', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', margin: '10px 0 4px' } },
              React.createElement('span', { style: { fontWeight: 600 } }, '按小节挑'),
              React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setImp(Object.assign({}, imp, { off: {} })) }, '全选'),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () => {
                    const off = {}
                    for (const it of imp.data.items || []) if (imp.files[it.file] && it.importance < 1) off[it.key] = true
                    setImp(Object.assign({}, imp, { off: off }))
                  },
                },
                '仅保留长期事实',
              ),
              React.createElement(
                'button',
                {type: 'button',
                  style: S.btn,
                  onClick: () => {
                    const off = {}
                    for (const it of imp.data.items || []) if (imp.files[it.file]) off[it.key] = true
                    setImp(Object.assign({}, imp, { off: off }))
                  },
                },
                '全不选',
              ),
            ),
          )

          for (const k of 组们) {
            const g = 组[k]
            const 开 = !!imp.open[k]
            const 选了几条 = g.items.filter((it) => imp.off[it.key] !== true).length
            小件.push(
              React.createElement(
                'div',
                { key: 'sec' + k, style: { margin: '2px 0' } },
                React.createElement(
                  'div',
                  { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'baseline' } },
                  React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 1 }), onClick: () => setImp(Object.assign({}, imp, { open: Object.assign({}, imp.open, { [k]: !开 }) })) },
                    (开 ? '▾ ' : '▸ ') + g.section,
                  ),
                  React.createElement('div', { style: Object.assign({}, S.dim, { width: 90, flex: 'none' }) }, 选了几条 + ' / ' + g.items.length + ' 条'),
                  React.createElement(
                    'div',
                    {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                      style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)' }),
                      onClick: () => {
                        const 全选这节 = 选了几条 < g.items.length
                        const off = Object.assign({}, imp.off)
                        for (const it of g.items) if (全选这节) delete off[it.key]
                        else off[it.key] = true
                        setImp(Object.assign({}, imp, { off: off }))
                      },
                    },
                    '全选本节',
                  ),
                ),
                开
                  ? g.items.map((it) =>
                      React.createElement(
                        'div',
                        { key: it.key, style: { margin: '2px 0 6px 18px', fontSize: 'var(--fish-small)' } },
                        React.createElement(
                          'label',
                          { style: { cursor: 'pointer' } },
                          React.createElement('input', {'aria-label': it.改后 || it.text,
                            type: 'checkbox',
                            checked: imp.off[it.key] !== true,
                            onChange: (e) => setImp(Object.assign({}, imp, { off: Object.assign({}, imp.off, { [it.key]: !e.target.checked }) })),
                          }),
                          ' ',
                          React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, it.file + ' 第 ' + it.line + ' 行　'),
                          String(it.改后 || it.text),
                          it.at ? React.createElement('span', { style: Object.assign({}, S.ok, { fontSize: 'var(--fish-small)' }) }, '　[' + it.at.slice(0, 10) + ']') : null,
                          it.改后 && it.改后 !== it.text
                            ? React.createElement('div', { style: Object.assign({}, S.dim, { marginLeft: 18, fontSize: 'var(--fish-small)' }) }, '原文：' + it.text)
                            : null,
                        ),
                      ),
                    )
                  : null,
              ),
            )
          }

          小件.push(
            React.createElement(
              'div',
              { key: 'go', style: Object.assign({}, S.askBox, { marginTop: 10 }) },
              React.createElement('div', { style: { flex: 1 } }, '已选 ' + 选中.length + ' 条，共约 ' + 字数 + ' 字' + (选中.length ? '（单轮最多注入 6 条）' : '')),
              React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: impBusy || !选中.length, onClick: 导入 }, impBusy ? '导入中…' : '导入选中的'),
            ),
          )
          return 小件
        }

        return (() => {
          const mode = edit ? 'edit' : 生成开 ? 'generate' : 查重 && 查重开 ? 'duplicates' : dialogView
          const titles = { memories: '记忆条目', add: '新增记忆', names: '库内称呼', organize: '整理与修复', archive: '档案导入与生成', generate: '从会话生成档案', duplicates: '重复记忆检查', trash: '回收站', recall: '召回诊断', index: '语义索引', edit: '编辑记忆' }
          const go = view => { setDialogView(view); setEdit(null); set查重开(false); set生成开(false); setConfirm(null); set批删问(false) }
          const tasks = [
            ['add', '新增记忆', '手动记录事实、时间和关键词'],
            ['names', '库内称呼', '设置 AI 与对方在当前库中的称呼'],
            ['organize', '整理与修复', '补日期、事实键、去重、提炼和扩词'],
            ['archive', '档案导入与生成', '从文件导入，或将会话整理成档案'],
            ['trash', '回收站', '恢复已删除、已合并或被取代的记忆'],
            ['recall', '召回诊断', '查看本轮命中结果与未选中的原因'],
            ['index', '语义索引', '补齐或重建当前库的向量索引'],
          ]
          const navigation = [['memories', '记忆条目', '查看、搜索和编辑已保存的记忆'], ...tasks]
          const hint = navigation.find(([view]) => view === mode)?.[2]
          let content
          if (mode === 'memories') content = h('div', { className: 'memory-records' },
            h('div', { className: 'memory-actions' }, 已选几条 > 0
              ? React.createElement(
                  'button',
                  {type: 'button',
                    style: S.btnDanger,
                    title: '将所选条目移入回收站，操作前需确认。',
                    onClick: () => set批删问(true),
                  },
                  '批量删除（' + 已选几条 + '）',
                )
              : null,
已选几条 > 0
              ? React.createElement(
                  'button',
                  {type: 'button',  style: S.btn, onClick: () => { set选中({}); set批删问(false) } },
                  '取消勾选',
                )
              : null),
            h('div', { className: 'memory-filter' }, React.createElement('input', {'aria-label': '搜索正文、原文、关键词或来源',
                    style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 140 }),
                    placeholder: '搜索正文、原文、关键词或来源',
                    value: 搜词,
                    onChange: (e) => set搜词(e.target.value),
                  }),
搜词
                    ? React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set搜词('') }, '清除')
                    : null,
React.createElement(
                    'button',
                    {type: 'button',
                      style: S.btn,
                      title:
                        '切换筛选：全部 → 已标日期 → 未标日期 → ' +
                        '长期事实 → 普通记忆 → 全部。' +
                        '全部视图中，长期事实单独分组。',
                      onClick: () =>
                        set看哪边(
                          看哪边 === '全部'
                            ? '有时间'
                            : 看哪边 === '有时间'
                              ? '没时间'
                              : 看哪边 === '没时间'
                                ? '长期事实'
                                : 看哪边 === '长期事实'
                                  ? '会淡的'
                                  : '全部',
                        ),
                    },
                    '筛选：' +
                      (看哪边 === '全部'
                        ? '全部'
                        : 看哪边 === '有时间'
                          ? '已标日期（' + 有时间数 + '）'
                          : 看哪边 === '没时间'
                            ? '未标日期（' + 没时间数 + '）'
                            : 看哪边 === '长期事实'
                              ? '长期事实（' + 事实总数 + '）'
                              : '普通记忆（' + 会淡总数 + '）'),
                  ),
React.createElement(
                    'button',
                    {type: 'button',
                      style: S.btn,
                      title: '按条目日期排序，未标日期的条目置后。',
                      onClick: () => set顺序(顺序 === '新' ? '旧' : '新'),
                    },
                    '日期：' + (顺序 === '新' ? '新的在前' : '老的在前'),
                  )),
            React.createElement(
            'div',
            { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
            '已标日期 ' + 有时间数 + ' 条 · 未标日期 ' + 没时间数 + ' 条' +
              (看哪边 === '全部' ? '' : '（当前筛选：' + (看哪边 === '有时间' ? '已标日期' : '未标日期') + '）'),
          ), 批删问 && 已选几条 > 0
                  ? React.createElement(
                      'div',
                      { style: S.confirm },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '删除所选 ' + 已选几条 + ' 条？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '条目将移入回收站，可恢复。操作前自动备份。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 批删(s) }, busy ? '删除中…' : '确认删除（' + 已选几条 + ' 条）'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set批删问(false) }, '取消'),
                    )
                  : null, 搜词 || 看哪边 !== '全部'
                  ? React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '0 0 6px' }) },
                      '共 ' + 过滤后.length + ' 条 / 共 ' + s.memories.length + ' 条' +
                        (看哪边 === '有时间' ? '（仅已标日期）' : 看哪边 === '没时间' ? '（仅未标日期）' : '') +
                        (过滤后.length === 0 ? '，可更换关键词或筛选范围' : ''),
                    )
                  : null, React.createElement(
                  'div',
                  { style: { marginTop: 10 } },
                  过滤后.length === 0
                    ? React.createElement(
                        'div',
                        { style: S.dim },
                        搜词 ? '（无匹配“' + 搜词 + '”的条目）' : '（当前范围无记忆）',
                      )
                    : (() => {
                        // ⭐⭐ 2026-09-22（她要的）：**「全部」视图里，不会淡的收进一个折叠的分组**
                        //   原话：「那一行，我们是单独做一个收理的文件夹一样的，
                        //              不然的话那些就不需要露在外面」
                        //   ⭐ 又说：「**外面都是会淡的，里面才是不会淡的**，就不用管里面了」
                        //   → 外面只列**会淡的**；不会淡的（长期事实 + 没时间的）
                        //     塞进「▸ 不会淡的（N 条）」里，点开才看
                        const 上 = 画这个.slice(0, 画全部 ? 画这个.length : 一次最多画)
                        // 注意：搜的时候**不许折叠** —— 不然搜到了却看不见 ✗
                        //   （自检逮到的：搜「衣服」时匹配的那条是长期事实，被收进分组里了）
                        if (看哪边 !== '全部' || 搜词) return 上.map(一条记忆)
                        const 会淡的 = 上.filter((m) => !不会淡(m))
                        const 不淡的 = 上.filter(不会淡)
                        return [
                          ...会淡的.map(一条记忆),
                          不淡的.length
                            ? React.createElement(
                                'div',
                                { key: '事实组' },
                                React.createElement(
                                  'div',
                                  {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                    style: Object.assign({}, S.h, { cursor: 'pointer', marginTop: 14 }),
                                    onClick: () => set看事实(!看事实),
                                  },
                                  (看事实 ? '▾ ' : '▸ ') + '长期事实（' + 不淡的.length + ' 条）',
                                ),
                                React.createElement(
                                  'div',
                                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginBottom: 4 }) },
                                  '长期事实不参与时间衰减。' +
                                    '普通记忆参与衰减，未标日期时从录入时间计算。',
                                ),
                                看事实 ? 不淡的.map(一条记忆) : null,
                              )
                            : null,
                        ]
                      })(),
                ), 过滤后.length > 一次最多画
                  ? React.createElement(
                      'div',
                      { style: { margin: '6px 0 0', fontSize: 'var(--fish-small)' } },
                      画全部
                        ? React.createElement('span', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: S.link, onClick: () => set画全部(false) }, '收起（仅显示前 ' + 一次最多画 + ' 条）')
                        : React.createElement(
                            'span',
                            {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: S.link, onClick: () => set画全部(true) },
                            '另有 ' + (过滤后.length - 一次最多画) + ' 条未显示，显示全部可能影响性能。',
                          ),
                    )
                  : null)
          else if (mode === 'add') content = React.createElement(
                'div',
                { className: 'memory-editor', style: S.editBox },
                React.createElement(
                  'div',
                  { className: 'memory-editor-row', style: Object.assign({}, S.nameBox, { margin: '0 0 8px' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '目标会话'),
                  React.createElement(
                    'select',
                    {'aria-label': '目标会话',
                      style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 160 }),
                      value: 加在谁 || open || '',
                      onChange: (e) => set加在谁(e.target.value),
                    },
                    (((d && d.sessions) || []).map((x) => React.createElement(
                      'option',
                      { key: x.id, value: x.id },
                      (x.title || ('…' + String(x.id).slice(-6))) + (x.enabled ? '' : '（记忆未启用）'),
                    ))),
                  ),
                  React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '默认使用当前记忆库入口'),
                ),
                React.createElement('textarea', {'aria-label': '输入记忆正文。AI 名称和对方称呼将按库内设置归一化。',
                  style: Object.assign({}, S.area, { minHeight: 54 }),
                  placeholder: '输入记忆正文。AI 名称和对方称呼将按库内设置归一化。',
                  value: 加内容,
                  onChange: (e) => set加内容(e.target.value),
                }),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.nameBox, { margin: '8px 0 0' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '时间'),
                  React.createElement('input', {'aria-label': '发生时间，留空使用当前时间',
                    style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 150 }),
                    placeholder: '发生时间，留空使用当前时间',
                    value: 加时间,
                    onChange: (e) => set加时间(e.target.value),
                  }),
                  React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '格式：2026-09-19 或 2026-09-19 14:30'),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.nameBox, { margin: '6px 0 0' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '重要'),
                  ['0', '0.5', '1'].map((v) =>
                    React.createElement(
                      'button',
                      {type: 'button',
                        key: v,
                        style: Object.assign({}, S.btn, String(加重要) === v ? { borderColor: 'var(--fish-info)', color: 'var(--fish-info)' } : null),
                        onClick: () => set加重要(v),
                      },
                      v === '0' ? '0 一般' : v === '0.5' ? '0.5 重要' : '1 非常重要',
                    ),
                  ),
                  React.createElement('input', {'aria-label': '记忆重要度',
                    style: Object.assign({}, S.inp, { width: 88 }),
                    value: 加重要,
                    onChange: (e) => set加重要(e.target.value),
                  }),
                  React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '也能自己填 0~1'),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.nameBox, { margin: '6px 0 0' }) },
                  React.createElement('div', { style: { flex: 'none', width: 80 } }, '关键词'),
                  React.createElement('input', {'aria-label': '关键词，以空格分隔（选填）',
                    style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 150 }),
                    placeholder: '关键词，以空格分隔（选填）',
                    value: 加词,
                    onChange: (e) => set加词(e.target.value),
                  }),
                ),
                React.createElement(
                  'div',
                  { className: 'memory-editor-actions' },
                  React.createElement('button', {type: 'button', className: 'fish-primary', style: { ...S.btn, background: 'var(--fish-action)', color: 'var(--fish-on-accent)' }, onClick: 提交一条 }, '保存记忆'),
                ),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                  '保存后可在“整理与修复”中补充检索词。',
                ),
              )
          else if (mode === 'edit') content = 改一条(edit)
          else if (mode === 'names') content = React.createElement(
            'div',
            { style: { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--fish-border)', background: 'var(--fish-soft)' } },
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 } },
              React.createElement('span', { style: { flex: 'none', width: 96, fontSize: 'var(--fish-small)' } }, 'AI 名称'),
              React.createElement('input', {'aria-label': '库内 AI 名称',
                style: Object.assign({}, S.inp, { width: 160 }),
                placeholder: '库内 AI 名称',
                value: selfDraft[open] !== undefined ? selfDraft[open] : s.selfName || s.titleName || '',
                onChange: (e) => setSelfDraft(Object.assign({}, selfDraft, { [open]: e.target.value })),
                onBlur: () =>
                    saveNames({
                      session: open,
                      selfName: (selfDraft[open] !== undefined ? selfDraft[open] : s.selfName) || '',
                      ownerName: (ownerDraft[open] !== undefined ? ownerDraft[open] : s.ownerName) || '',
                    }).then(async result => {
                      if (!result || result.ok === false) throw Error(result?.error || '保存称呼失败')
                      await load()
                      setSelfDraft(old => old[open] === selfDraft[open] ? {} : old)
                      setOwnerDraft(old => old[open] === ownerDraft[open] ? {} : old)
                    }).catch(error => { setErr(error.message); 告知(error.message) }),
              }),
              s.selfName
                ? null
                : (s.titleName ? React.createElement('span', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) }, '默认使用会话标题，失焦后保存。') : null),
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 8 } },
              React.createElement('span', { style: { flex: 'none', width: 96, fontSize: 'var(--fish-small)' } }, '对方称呼'),
              React.createElement('input', {'aria-label': '库内对方称呼',
                style: Object.assign({}, S.inp, { width: 160 }),
                placeholder: '库内对方称呼',
                value: ownerDraft[open] !== undefined ? ownerDraft[open] : s.ownerName || '',
                onChange: (e) => setOwnerDraft(Object.assign({}, ownerDraft, { [open]: e.target.value })),
                onBlur: () =>
                    saveNames({
                      session: open,
                      selfName: (selfDraft[open] !== undefined ? selfDraft[open] : s.selfName) || '',
                      ownerName: (ownerDraft[open] !== undefined ? ownerDraft[open] : s.ownerName) || '',
                    }).then(async result => {
                      if (!result || result.ok === false) throw Error(result?.error || '保存称呼失败')
                      await load()
                      setSelfDraft(old => old[open] === selfDraft[open] ? {} : old)
                      setOwnerDraft(old => old[open] === ownerDraft[open] ? {} : old)
                    }).catch(error => { setErr(error.message); 告知(error.message) }),
              }),
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 } },
              null,
              React.createElement(
                'span',
                { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', flex: 1, lineHeight: 1.5 }) },
                'AI 名称归一为“我”，对方称呼归一为“你”，同时处理已有条目。',
              ),
            ),
          )
          else if (mode === 'organize') content = h('div', { className: 'memory-stack' },
            h('section', { className: 'memory-operation' }, h('h3', null, '检查与修复'), h('p', { className: 'fish-muted' }, '修改前确认并自动备份。'), h('div', { className: 'memory-actions' }, 没日期的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title: '从正文补齐缺失日期，保留已有日期，操作前自动备份。',
                          onClick: () => setConfirm({ id: '*', kind: 'backfill' }),
                        },
                        '补日期（' + 没日期的 + '）',
                      )
                    : null,
没判过的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '调用模型识别长期事实，' +
                            '跳过已判定条目，操作前自动备份。',
                          onClick: () => setConfirm({ id: '*', kind: 'stable' }),
                        },
                        '补标长期事实（' + 没判过的 + '）',
                      )
                    : null,
判过的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '重置判定标记并重新识别长期事实。' +
                            '适用于判据调整后，会调用模型，操作前自动备份。',
                          onClick: () => setConfirm({ id: '*', kind: 'restable' }),
                        },
                        '重判一遍（' + 判过的 + '）',
                      )
                    : null,
没键的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '为旧记忆生成事实键。\n' +
                            '同一属性的不同记录将关联为同一事实，' +
                            '保留最新条目，旧条目归档并可恢复。\n' +
                            '此操作需逐条调用模型。\n' +
                            '建议先试运行 8 条，核对后执行全部。',
                          onClick: () => setConfirm({ id: '*', kind: 'washkeys' }),
                        },
                        '标注事实键（' + 没键的 + '）',
                      )
                    : null,
可撤的 > 0
                    ? React.createElement(
                        'button',
                        {type: 'button',
                          style: S.btn,
                          title:
                            '撤销本次自动标注并恢复关联归档条目。\n' +
                            '保留手动标注。',
                          onClick: () => setConfirm({ id: '*', kind: 'unwashkeys' }),
                        },
                        '撤销本次标注（' + 可撤的 + '）',
                      )
                    : null, React.createElement(
              'button',
              {type: 'button',
                style: S.btn,
                title:
                  '检查库内重复条目。' +
                  '完全重复可直接合并，汇总与明细需手动选择。合并前自动备份。',
                onClick: () => 去查重(s),
              },
              '查重',
            )), 没键的 > 0
                  ? React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '4px 0 0' }) },
                      '事实键用于关联同一事实的不同记录。' +
                        '关联后保留最新条目，旧条目归档并可恢复。',
                    )
                  : null,
判留空的 > 0
                  ? React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '4px 0 0' }) },
                      '（另外 ' + 判留空的 + ' 条无需标注或无法判定。' +
                        '原文保留，后续跳过）',
                    )
                  : null,
confirm && confirm.kind === 'stable'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '使用模型判断 ' + 没判过的 + ' 条是否属于长期事实？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '使用 DSH 模型，每批 20 条，跳过已判定条目。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 补不淡(false) }, busy ? '判定中…' : '开始'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
confirm && confirm.kind === 'restable'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '把 ' + 判过的 + ' 条判定标记并重新识别？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '将重新调用模型（共 ' +
                            (s.memories || []).length + ' 条，每批 20 条），操作前自动备份。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 补不淡(true) }, busy ? '判定中…' : '重判'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
confirm && confirm.kind === 'washkeys'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '所选 ' + 没键的 + ' 条旧记忆生成事实键？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '生成事实键并关联相同事实，保留最新条目，' +
                            '旧条目归档并可恢复。' +
                            '使用 DSH 模型，每批 8 条，不向会话发送消息。操作前自动备份。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btn, disabled: busy, onClick: () => 洗键(true) }, busy ? '处理中…' : '试运行 8 条'),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 洗键(false) }, busy ? '处理中…' : '全部开始'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
confirm && confirm.kind === 'unwashkeys'
                  ? React.createElement(
                      'div',
                      { style: S.askBox },
                      React.createElement(
                        'div',
                        { style: { flex: 1 } },
                        '撤销本次自动标注的 ' + 可撤的 + ' 条自动标注并恢复关联归档条目？',
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                          '恢复操作前状态，保留手动标注。' +
                            '记忆本身一条都不会被删。',
                        ),
                      ),
                      React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: 撤销洗键 }, busy ? '撤销中…' : '撤销'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null,
洗键进度.在跑 && 洗键进度.总 > 0
                  ? (() => {
                      const 百 = Math.round((洗键进度.已 / 洗键进度.总) * 100)
                      return React.createElement(
                        'div',
                        { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                        React.createElement(
                          'div',
                          { style: { fontSize: 'var(--fish-small)', marginBottom: 4 } },
                          '正在标注事实键' + (洗键进度.干跑 ? '（试运行）' : '') + '　处理中',
                        ),
                        React.createElement(
                          'div',
                          { style: { fontSize: 'var(--fish-small)', color: 'var(--fish-warning)' } },
                          '已处理 ' + 洗键进度.已 + ' / ' + 洗键进度.总 + ' 条（' + 百 + '%）' +
                            '　剩余 ' + Math.max(0, 洗键进度.总 - 洗键进度.已) + ' 条（每批 8 条）',
                        ),
                      )
                    })()
                  : null,
补标进度.在跑 && 补标进度.总 > 0
                  ? (() => {
                      const 百 = Math.round((补标进度.已 / 补标进度.总) * 100)
                      return React.createElement(
                        'div',
                        { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                        React.createElement(
                          'div',
                          { style: { fontSize: 'var(--fish-small)', marginBottom: 4 } },
                          '⭐ ' + (补标进度.重判 ? '重判一遍' : '补标长期事实') + '　处理中',
                        ),
                        React.createElement(
                          'div',
                          { style: S.barOut },
                          React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                        ),
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                          '已判 ' + 补标进度.已 + ' / ' + 补标进度.总 + ' 条（' + 百 + '%）' +
                            '　剩余 ' + Math.max(0, 补标进度.总 - 补标进度.已) + ' 条' +
                            (补标进度.等 ? '　请求受限，等待 ' + 补标进度.等 + ' 秒' : '（每批 20 条）'),
                        ),
                      )
                    })()
                  : null, confirm && confirm.kind === 'backfill'
                  ? React.createElement(
                      'div',
                      { style: S.confirm },
                      React.createElement('span', { style: { flex: 1 } }, '补齐 ' + 没日期的 + ' 条缺失日期的记忆？保留已有日期并自动备份。'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: 补日期 }, '补'),
                      React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm(null) }, '取消'),
                    )
                  : null),
            h('section', { className: 'memory-operation' }, 扩词区()))
          else if (mode === 'archive') content = h('div', { className: 'memory-stack' }, h('div', { className: 'memory-callout' }, h('div', null, h('strong', null, '从已有会话生成档案'), h('p', null, '先预览会话和用量，再分批生成，可继续导入当前记忆库。')), h('button', { type: 'button', className: 'fish-button', onClick: () => 开生成() }, '选择会话')), ...导入区().slice(1))
          else if (mode === 'generate') content = React.createElement(
                      'div',
                      { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                      [
                        React.createElement(
                          'div',
                          { key: 'h', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                          React.createElement('b', null, '从会话生成档案'),
                          React.createElement(
                            'span',
                            { style: S.dim },
                            '从会话提取九章长期档案，保存后可扫描导入记忆库。',
                          ),
                          React.createElement('div', { style: { flex: 1 } }),
                          React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set生成开(false) }, '收起'),
                        ),

                        // ① 选会话
                        React.createElement(
                          'div',
                          { key: 's', style: { marginTop: 8 } },
                          React.createElement('div', { style: S.dim }, '① 选会话' + (生成会话 ? '（当前工作区共 ' + 生成会话.length + ' 个）' : '（读取中…）')),
                          生成会话 && 生成会话.length
                            ? React.createElement(
                                'div',
                                { style: { margin: '4px 0 0 8px', maxHeight: 260, overflow: 'auto' } },
                                生成会话.map((x) =>
                                  React.createElement(
                                    'label',
                                    { key: x.sid, style: { display: 'block', fontSize: 'var(--fish-small)', cursor: 'pointer', padding: '2px 0' } },
                                    React.createElement('input', {'aria-label': x.标题 || x.sid,
                                      type: 'checkbox',
                                      checked: !!生成选[x.sid],
                                      onChange: () => set生成选(Object.assign({}, 生成选, { [x.sid]: !生成选[x.sid] })),
                                    }),
                                    // ⚠注意：2026-09-22（反馈：「不显示名字」）：
                                    //   光有 `session-a1b2c3d4-…` 这种**没法挑** —— 得显示标题
                                    ' ',
                                    React.createElement('span', { style: x.标题 ? null : S.dim }, x.标题 || '（未命名）'),
                                    React.createElement(
                                      'span',
                                      { style: Object.assign({}, S.dim, { marginLeft: 6 }) },
                                      (x.话数 ? x.话数 + ' 句　' : '') + x.MB + ' MB　' + x.sid.slice(0, 12) + '…',
                                    ),
                                  ),
                                ),
                              )
                            : 生成会话
                              ? React.createElement(
                                  'div',
                                  { style: Object.assign({}, S.dim, { marginTop: 4 }) },
                                  '暂无可用会话，已排除归档、子代理和空白会话。',
                                )
                              : null,
                          // 注意：默认一个都不勾 —— 让用户自己挑（后面是要花钱的）✓
                          生成会话 && 生成会话.length
                            ? React.createElement(
                                'div',
                                { style: { marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                                React.createElement(
                                  'button',
                                  {type: 'button',
                                    style: S.btn,
                                    onClick: () => {
                                      const 勾 = {}
                                      生成会话.forEach((x) => {
                                        勾[x.sid] = true
                                      })
                                      set生成选(勾)
                                    },
                                  },
                                  '全选',
                                ),
                                React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set生成选({}) }, '全不选'),
                                React.createElement('span', { style: S.dim }, '勾了 ' + 勾的sid().length + ' 个'),
                              )
                            : null,
                          // 注意：诊断：列表跟 DSH 对不上时，这几个数能看出卡在哪一道
                          // 注意：2026-11-03：诊断只在**一个会话都没列出来**时才显示。
                          //   有列表的时候它就是一大坨内部数字，挤在勾选框下面很难看。
                          生成诊断 && 生成会话 && 生成会话.length === 0
                            ? React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { marginTop: 4, fontSize: 'var(--fish-small)' }) },
                                '磁盘上 ' + 生成诊断.文件夹里 + ' 个会话文件　归档 ' + 生成诊断.归档 + ' 个　可挑 ' + 生成诊断.筛完剩 + ' 个',
                                (生成诊断.被我筛掉的 || []).length
                                  ? React.createElement(
                                      'div',
                                      { style: { marginTop: 2 } },
                                      '筛掉的：' +
                                        (生成诊断.被我筛掉的 || [])
                                          .map((x) => (x.标题 || x.sid) + '（' + x.因 + '）')
                                          .join('　'),
                                    )
                                  : null,
                              )
                            : null,
                          React.createElement(
                            'div',
                            { style: { marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8 } },
                            React.createElement(
                              'button',
                              {type: 'button',  style: S.btn, disabled: busy || 勾的sid().length === 0, onClick: () => 算生成() },
                              '预估处理用量',
                            ),
                            React.createElement(
                              'span',
                              { style: S.dim },
                              !勾的sid().length ? '请选择会话' : '（仅读取、去重与分段，不调用模型）',
                            ),
                          ),
                        ),

                        // ② 计划
                        生成计划
                          ? React.createElement(
                              'div',
                              { key: 'p', style: { marginTop: 8 } },
                              React.createElement(
                                'div',
                                { style: S.dim },
                                '预估结果：' + 生成计划.批数 + ' 批　' + 生成计划.天数 + ' 天　' +
                                  生成计划.总字.toLocaleString() + ' 字，估算约 ' + 生成计划.token.toLocaleString() + ' token',
                              ),
                              React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { marginTop: 2 }) },
                                '（每批最多 ' + 生成计划.每批字上限.toLocaleString() + ' 字；已排除非聊天记录 ' +
                                  生成计划.挑出来 + ' 条）',
                              ),
                              React.createElement(
                                'div',
                                { style: { marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                                React.createElement(
                                  'button',
                                  {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 跑生成() },
                                  busy ? '处理中…' : '开始生成（消耗模型额度）',
                                ),
                                React.createElement(
                                  'span',
                                  { style: S.dim },
                                  '按批提取并保存进度，后续批次参考已有条目以减少重复。',
                                ),
                              ),
                              (生成计划.会话 || []).length
                                ? React.createElement(
                                    'div',
                                    { style: Object.assign({}, S.dim, { marginTop: 4, fontSize: 'var(--fish-small)' }) },
                                    '会话情况：' +
                                      生成计划.会话
                                        .map((x) => (x.标题 || x.sid.slice(0, 12)) + '（独有 ' + x.独有 + '／副本 ' + x.副本 + '）')
                                        .join('　'),
                                  )
                                : null,
                            )
                          : null,

                        // ③ 进度
                        生成进度 && 生成进度.在跑
                          ? (() => {
                              const 百 = Math.round(((生成进度.批号 - 1) / 生成进度.批数) * 100)
                              return React.createElement(
                                'div',
                                { key: 'bar', style: { marginTop: 8 } },
                                React.createElement(
                                  'div',
                                  { style: S.barOut },
                                  React.createElement('div', { style: Object.assign({}, S.barIn, { width: 百 + '%' }) }),
                                ),
                                React.createElement(
                                  'div',
                                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                                  '第 ' + 生成进度.批号 + ' / ' + 生成进度.批数 + ' 批（' + 百 + '%）' +
                                    '　已提取 ' + 生成条目.length + ' 条' +
                                    (生成进度.模型 ? '　' + 生成进度.模型 : ''),
                                ),
                              )
                            })()
                          : null,

                        // ④ 存到哪儿 —— ⚠注意：2026-09-22（反馈：「选了文件夹点了过后
                        //   再想换的话就会卡住，就没有那个选项了，就不能再修改了」）
                        //   两个毛病：
                        //     ① 这块原来在 `生成条目.length` 里面 —— **跑完才出现** ✗
                        //        → 挪到外面，面板一开就能设
                        //     ② 再点「选文件夹」时**不重新读目录**（`if (!生成目录列)`）——
                        //        看到的还是上次那份，像卡住 失败：→ 每次打开都重读
                        React.createElement(
                          'div',
                          { key: 'save', style: { marginTop: 8 } },
                          React.createElement(
                            'div',
                            { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                            React.createElement('b', null, '保存位置'),
                            React.createElement('span', { style: S.dim }, '指定输出文件，可直接修改路径或选择文件夹。'),
                          ),
                          React.createElement(
                            'div',
                            { style: Object.assign({}, S.nameBox, { marginTop: 6 }) },
                            React.createElement('div', { style: { flex: 'none', width: 72 } }, '存到'),
                            React.createElement('input', {'aria-label': '输出文件完整路径（如 D:\\档案\\生成的档案.md）',
                              style: Object.assign({}, S.inp, { flex: 1, width: 'auto', minWidth: 140 }),
                              value: 生成存到,
                              placeholder: '输出文件完整路径（如 D:\\档案\\生成的档案.md）',
                              onChange: (e) => set生成存到(e.target.value),
                            }),
                            React.createElement(
                              'button',
                              {type: 'button',
                                style: S.btn,
                                onClick: () => {
                                  const 要开 = !生成选目录
                                  set生成选目录(要开)
                                  // 注意：每次打开都**重读一遍**（原来只在第一次读，再打开看到的是旧的）
                                  if (要开) {
                                    // 从当前路径所在的目录开始（拿不到就从盘符列表开始）
                                    const 起点 = /[\\/]/.test(生成存到) ? 生成存到.replace(/[\\/][^\\/]*$/, '') : ''
                                    post('/dirs', { path: 起点 })
                                      .then((r) => set生成目录列(r))
                                      .catch((e) => setNotes(['列不了目录：' + ((e && e.message) || e)]))
                                  }
                                },
                              },
                              生成选目录 ? '收起' : '选文件夹',
                            ),
                          ),
                          // 文件夹选择器（跟「从旧档案导入」那个是同一个接口）
                          生成选目录 && 生成目录列
                            ? React.createElement(
                                'div',
                                { style: { margin: '4px 0 0', padding: '6px 10px', borderRadius: 'var(--fish-radius-sm)', background: 'var(--fish-soft)', border: '1px solid var(--fish-border)', fontSize: 'var(--fish-small)' } },
                                React.createElement(
                                  'div',
                                  { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 4 } },
                                  React.createElement('span', { style: S.dim }, 生成目录列.path ? '当前：' + 生成目录列.path : '选一个盘'),
                                  React.createElement('div', { style: { flex: 1 } }),
                                  // 注意：选择器里也放一个「收起」—— 别只能靠上面那个按钮
                                  React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set生成选目录(false) }, '收起'),
                                ),
                                生成目录列.ok === false
                                  ? React.createElement('div', { style: S.drop }, '失败：' + (生成目录列.message || '列不了'))
                                  : React.createElement(
                                      'div',
                                      null,
                                      React.createElement(
                                        'div',
                                        { style: Object.assign({}, S.dim, { marginBottom: 4 }) },
                                        生成目录列.path
                                          ? '「' + 生成目录列.path + '」的子文件夹：'
                                          : '选一个盘：',
                                      ),
                                      React.createElement(
                                        'div',
                                        { style: { display: 'flex', flexWrap: 'wrap', gap: 10 } },
                                        生成目录列.parent
                                          ? React.createElement(
                                              'span',
                                              {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                                style: S.link,
                                                onClick: () =>
                                                  post('/dirs', { path: 生成目录列.parent }).then((r) => set生成目录列(r)).catch(() => {}),
                                              },
                                              '↑ 上一级',
                                            )
                                          : null,
                                        (生成目录列.dirs || []).map((d) =>
                                          React.createElement(
                                            'span',
                                            {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                              key: d.path,
                                              style: S.link,
                                              onClick: () =>
                                                post('/dirs', { path: d.path }).then((r) => set生成目录列(r)).catch(() => {}),
                                            },
                                            '📁 ' + d.name,
                                          ),
                                        ),
                                      ),
                                      // 「就用这个文件夹」—— 把路径拼成 <文件夹>\生成的档案.md
                                      生成目录列.path
                                        ? React.createElement(
                                            'div',
                                            { style: { marginTop: 6 } },
                                            React.createElement(
                                              'button',
                                              {type: 'button',
                                                style: S.btn,
                                                onClick: () => {
                                                  const p = String(生成目录列.path).replace(/[\\/]+$/, '')
                                                  set生成存到(p + '\\生成的档案.md')
                                                  set生成选目录(false)
                                                },
                                              },
                                              '使用此文件夹',
                                            ),
                                            React.createElement(
                                              'span',
                                              { style: Object.assign({}, S.dim, { marginLeft: 8 }) },
                                              '保存为“生成的档案.md”',
                                            ),
                                          )
                                        : React.createElement(
                                            'div',
                                            { style: Object.assign({}, S.dim, { marginTop: 6 }) },
                                            '请选择磁盘和目标文件夹。',
                                          ),
                                    ),
                              )
                            : null,
                        ),

                        // 攒下来的条目 + 存文件
                        // 注意：2026-10-26：原来只在「条目 > 0」时渲染 —— 0 条时界面上只留一句
                        //   「点『存成档案文件』」，按钮根本不存在，用户只能到处找 ✗
                        //   → 算过计划就画出来；0 条时按钮置灰、旁边写明为什么。
                        生成计划
                          ? React.createElement(
                              'div',
                              { key: 'r', style: { marginTop: 8 } },
                              React.createElement(
                                'div',
                                { style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                                React.createElement('b', null, '已提取 ' + 生成条目.length + ' 条'),
                                React.createElement(
                                  'button',
                                  {type: 'button',
                                    style: S.btn,
                                    disabled: busy || !!(生成进度 && 生成进度.在跑) || !生成条目.length,
                                    onClick: () => 存生成(),
                                  },
                                  '存成档案文件',
                                ),
                                React.createElement(
                                  'span',
                                  { style: S.dim },
                                  生成条目.length
                                    ? '保存为 Markdown 后，返回“档案导入与生成”扫描并选择条目。'
                                    : '暂无可保存条目。若输出截断，可查看诊断日志。',
                                ),
                              ),
                              生成条目.length
                                ? React.createElement(
                                    'div',
                                    { style: Object.assign({}, S.dim, { marginTop: 4, maxHeight: 200, overflow: 'auto', fontSize: 'var(--fish-small)', whiteSpace: 'pre-line' }) },
                                    生成条目.slice(0, 40).map((x) => x.章 + '|' + x.日期 + '|' + x.话).join('\n') +
                                      (生成条目.length > 40 ? '\n…（还有 ' + (生成条目.length - 40) + ' 条）' : ''),
                                  )
                                : null,
                            )
                          : null,

                        // 存好了
                        生成档
                          ? React.createElement(
                              'div',
                              { key: 'ok', style: { marginTop: 8 } },
                              React.createElement('div', null, '档案存到：' + 生成档.存到),
                              React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { marginTop: 2 }) },
                                '共 ' + 生成档.条数 + ' 条' + (生成档.去掉重复 ? '（去掉了 ' + 生成档.去掉重复 + ' 条重复）' : ''),
                              ),
                            )
                          : null,
                      ],
                    )
          else if (mode === 'duplicates') content = React.createElement(
                      'div',                      { style: Object.assign({}, S.editBox, { marginTop: 8 }) },
                      [
                        React.createElement(
                          'div',
                          { key: '头', style: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                          React.createElement('b', null, '查重：'),
                          React.createElement('span', null, (查重.组 || []).length + ' 组、能少 ' + 查重.能少 + ' 条'),
                          React.createElement(
                            'span',
                            { style: S.dim },
                            '（真重复 ' + 查重.真重复组数 + ' 组 / 汇总+明细 ' + 查重.汇总组数 + ' 组）',
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',  style: S.btn, disabled: busy || !查重.真重复组数, onClick: () => 合重复(s, true) },
                            '一键合真重复（' + 查重.真重复组数 + ' 组）',
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',
                              style: S.btn,
                              disabled: busy || !(查重.组 || []).some((g, i) => 查重合[i]),
                              onClick: () => 合重复(s, false),
                            },
                            '合并所选组（' + (查重.组 || []).filter((g, i) => 查重合[i]).length + ' 组、少 ' +
                              (查重.组 || []).reduce((a, g, i) => a + (查重合[i] ? g.条们.length - 1 : 0), 0) + ' 条）',
                          ),
                          React.createElement(
                            'button',
                            {type: 'button',
                              style: S.btn,
                              title: '选择汇总与明细组，合并可能丢失细节。',
                              onClick: () => {
                                const 全 = {}
                                ;(查重.组 || []).forEach((g, i) => {
                                  全[i] = true
                                })
                                set查重合(全)
                              },
                            },
                            '全选汇总与明细组',
                          ),
                          React.createElement('button', {type: 'button',  style: S.btn, onClick: () => { set查重(null); set查重开(false) } }, '收起'),
                        ),
                        React.createElement(
                          'div',
                          { key: '说明', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 4 }) },
                          '完全重复组默认选中；' +
                            '汇总与明细组默认不选，' +
                            '需核对细节后手动选择。' +
                            '合并条目移入回收站，可恢复。',
                        ),
                      ]
                        .concat(
                          (查重.组 || []).slice(0, 60).map((g, i) =>
                            React.createElement(
                              'div',
                              {
                                key: 'g' + i,
                                style: { marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--fish-line)' },
                              },
                              [
                                React.createElement(
                                  'div',
                                  {
                                    key: 'h',
                                    style: { fontSize: 'var(--fish-small)', marginBottom: 4, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
                                  },
                                  // ⭐⭐ 2026-09-23：每组一个「要合」的勾 —— 不勾的组「按我勾的合」不会碰
                                  React.createElement('input', {'aria-label': '合并第 ' + (i + 1) + ' 组',
                                    key: 'c',
                                    type: 'checkbox',
                                    checked: !!查重合[i],
                                    title: '选择后参与合并',
                                    onChange: () => set查重合(Object.assign({}, 查重合, { [i]: !查重合[i] })),
                                  }),
                                  '第 ' + (i + 1) + ' 组 · ' + g.条们.length + ' 条 · ',
                                  React.createElement('b', { style: g.类型 === '真重复' ? S.ok : S.warn }, g.类型),
                                  查重合[i]
                                    ? null
                                    : React.createElement(
                                        'span',
                                        { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)' }) },
                                        '（不参与）',
                                      ),
                                ),
                              ].concat(
                                g.条们.map((t) =>
                                  React.createElement(
                                    'label',
                                    {
                                      key: t.id,
                                      style: { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'flex-start', padding: '3px 0', cursor: 'pointer' },
                                    },
                                    [
                                      React.createElement('input', {'aria-label': '保留记忆：' + t.text,
                                        key: 'r',
                                        type: 'radio',
                                        name: '查重组' + i,
                                        checked: 查重选[i] === t.id,
                                        onChange: () => set查重选(Object.assign({}, 查重选, { [i]: t.id })),
                                      }),
                                      React.createElement(
                                        'span',
                                        { key: 't', style: { flex: 1, minWidth: 0, overflowWrap: 'anywhere' } },
                                        t.text,
                                      ),
                                      React.createElement(
                                        'span',
                                        { key: 'n', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', overflowWrap: 'anywhere' }) },
                                        t.长 + ' 字',
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        )
                        .concat(
                          (查重.组 || []).length > 60
                            ? [
                                React.createElement(
                                  'div',
                                  { key: '更多', style: Object.assign({}, S.dim, { marginTop: 8 }) },
                                  '（显示前 60 组，处理后可再次检查）',
                                ),
                              ]
                            : [],
                        ),
                    )
          else if (mode === 'trash') content = React.createElement(
                  'div',
                  { style: { marginTop: 6 } },
                  // ⭐⭐ 2026-09-22（反馈「你放在最下面的呀，你改到最上面去，
                  //     谁那么多条？如果有100条，我得翻到最下面才能全选吗？」）：
                  //   工具条原来在**列表最下面** —— 68 条就得翻到底才能点「全选」✗
                  //   → 挪到**最上面**，跟标题挨着
                  // ⭐⭐ 2026-09-23（反馈「点『清空』之后提示在最下面，看都看不到」）：
                  //   确认条原来渲染在**列表下面** —— 68 条就得翻到底才看得见那两句问话 ✗
                  //   （跟 0.9.7 修过的「工具条在最下面」是同一个毛病）
                  //   → 改成**就地替换工具条**：两样都在最上面，点了「清空」，
                  //     工具条那一格立刻变成确认条，不用滚
                  已删.length > 0 && confirm && confirm.kind === 'purgeall'
                    ? 确认条('将回收站中的 ' + 已删.length + ' 条永久删除？此操作不可恢复。', '清空回收站', 'purgeall', '*')
                    : null,
                  // ⭐⭐ 2026-09-23（反馈「这里没有批量找回呀」）：批量找回的确认
                  //   注意：这个**不是销毁**（是往回捞），所以文案跟「清掉」正好相反
                  已删.length > 0 && !(confirm && confirm.kind === 'purgeall') && 批回问
                    ? React.createElement(
                        'div',
                        { style: S.confirm },
                        React.createElement(
                          'div',
                          { style: { flex: 1 } },
                          批回问.只合并
                            ? '恢复因合并删除的 ' + 已删.filter((m) => m.合并掉的 === true).length + ' 条？'
                            : '将所选 ' + 已选清几条 + ' 条恢复？',
                          React.createElement(
                            'div',
                            { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                            '恢复后重新参与召回，仍可再次删除。',
                          ),
                        ),
                        React.createElement('button', {type: 'button',  style: S.btn, disabled: busy, onClick: () => 批回(s, 批回问.只合并) }, busy ? '恢复中…' : '确认恢复'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set批回问(false) }, '取消'),
                      )
                    : null,
                  已删.length > 0 && !(confirm && confirm.kind === 'purgeall') && !批回问 && 批清问 && 已选清几条 > 0
                    ? React.createElement(
                        'div',
                        { style: S.confirm },
                        React.createElement(
                          'div',
                          { style: { flex: 1 } },
                          '永久删除所选 ' + 已选清几条 + ' 条？',
                          React.createElement(
                            'div',
                            { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2 }) },
                            '永久删除后无法从回收站恢复，备份可能仍保留副本。',
                          ),
                        ),
                        React.createElement('button', {type: 'button',  style: S.btnDanger, disabled: busy, onClick: () => 批清(s) }, busy ? '删除中…' : '确认删除（' + 已选清几条 + ' 条）'),
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => set批清问(false) }, '取消'),
                      )
                    : null,
                  已删.length > 0 && !(confirm && confirm.kind === 'purgeall') && !批回问 && !(批清问 && 已选清几条 > 0)
                    ? React.createElement(
                        'div',
                        { style: { margin: '8px 0', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } },
                        // ⭐ 一键全选
                        React.createElement(
                          'button',
                          {type: 'button',
                            style: S.btn,
                            title: '全选或取消当前列表',
                            onClick: () => {
                              if (已选清几条 === 已删.length) {
                                set选中清({})
                                set批清问(false)
                                return
                              }
                              const 全 = {}
                              for (const m of 已删) 全[m.id] = true
                              set选中清(全)
                            },
                          },
                          已选清几条 === 已删.length && 已删.length > 0 ? '取消全选' : '全选（' + 已删.length + '）',
                        ),
                        // ⭐ 批量清掉（勾了几条就显示几条）—— 点了**不直接清**，先问一遍
                        已选清几条 > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',  style: S.btnDanger, onClick: () => set批清问(true) },
                              '批量永久删除（' + 已选清几条 + '）',
                            )
                          : null,
                        // ⭐⭐ 2026-09-23（反馈「这里没有批量找回呀」）：**批量找回**
                        已选清几条 > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',
                                style: S.btn,
                                title: '恢复所选回收站条目',
                                onClick: () => set批回问({ 只合并: false }),
                              },
                              '批量恢复（' + 已选清几条 + '）',
                            )
                          : null,
                        // ⭐ 一键撤销整次合并：把「合并掉的」那批全捞回来
                        已删.filter((m) => m.合并掉的 === true).length > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',
                                style: S.btn,
                                title: '恢复全部已合并条目，撤销本次合并',
                                onClick: () => set批回问({ 只合并: true }),
                              },
                              '撤销合并：全部恢复（' + 已删.filter((m) => m.合并掉的 === true).length + '）',
                            )
                          : null,
                        已选清几条 > 0
                          ? React.createElement(
                              'button',
                              {type: 'button',  style: S.btn, onClick: () => { set选中清({}); set批清问(false); set批回问(false) } },
                              '取消勾选',
                            )
                          : null,
                        React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setConfirm({ id: '*', kind: 'purgeall' }) }, '把「已删掉的」清空'),
                      )
                    : null,
                  已删.length === 0
                    ? React.createElement('div', { style: S.dim }, '（空的）')
                    : 已删.map((m) =>
                        React.createElement(
                          'div',
                          { key: m.id, style: S.条 },
                          React.createElement(
                            'div',
                            { className: 'fish-record-row', style: S.row },
                            // ⭐ 批量清掉：行首一个勾选框（跟上面那栏一样）
                            React.createElement('input', {'aria-label': '选择已删记忆：' + m.text,
                              type: 'checkbox',
                              checked: !!选中清[m.id],
                              title: '选择后可批量永久删除',
                              onChange: () => set选中清(Object.assign({}, 选中清, { [m.id]: !选中清[m.id] })),
                            }),
                            React.createElement('div', { style: Object.assign({}, S.dim, { width: 108, flex: 'none' }) }, '收于 ' + rel(m.deletedAt, now)),
                            React.createElement('div', { style: Object.assign({}, S.dim, { flex: 1, minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }) }, m.text),
                            React.createElement('div', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)', marginRight: 10 }), onClick: () => 删(m.id, 'restore') }, '恢复'),
                            React.createElement('div', {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },  style: Object.assign({}, S.drop, { flex: 'none', fontSize: 'var(--fish-small)', cursor: 'pointer' }), onClick: () => setConfirm({ id: m.id, kind: 'purge' }) }, '永久删除'),
                          ),
                          confirm && confirm.id === m.id && confirm.kind === 'purge'
                            ? 确认条('永久删除后无法恢复，备份可能仍保留副本。', '确认删除', 'purge', m.id)
                            : null,
                        ),
                      ),
                  // ⭐⭐ 2026-09-24（她说的「那已被取代应该回回收站呀」）：
                  //   **被取代的**从主列表挪出来，收在回收站里（就在这一栏下面）✓
                  //   注意：放在 `showDeleted ?` **里面** —— 跟回收站一起折叠
                  //     （放外面的话，回收站收起来了它们还杵在那儿，看着像两栏）
                  //
                  //   ⚠注意：它们**不在 `s.deleted` 里** —— 所以上面那排
                  //     「全选 / 批量清掉 / 把已删掉的清空」**碰不到它们**，
                  //     这是故意的：被取代是自动标的（可能几百条），
                  //     不该被「清空」连坐销毁（丢 157 条那次的教训）✗✗
                  被取代的.length
                    ? React.createElement(
                        'div',
                        null,
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.h, { marginTop: 16 }) },
                          '被取代的（' + 被取代的.length + '）',
                        ),
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginBottom: 4 }) },
                          '同一事实的旧条目已归档，停止注入并保留原文。',
                        ),
                        React.createElement(
                          'div',
                          { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginBottom: 4 }) },
                          '清空回收站不影响已取代条目，可单独恢复。',
                        ),
                        被取代的.map((m) =>
                          React.createElement(
                            'div',
                            { key: m.id, style: S.条 },
                            React.createElement(
                              'div',
                              { className: 'fish-record-row', style: S.row },
                              React.createElement(
                                'div',
                                { style: Object.assign({}, S.dim, { width: 108, flex: 'none' }) },
                                m.已被取代 && m.已被取代.作废于 ? '收于 ' + rel(m.已被取代.作废于, now) : '已归档',
                              ),
                              React.createElement(
                                'div',
                                { style: { flex: '1 1 260px', minWidth: 200, overflowWrap: 'anywhere', wordBreak: 'break-word' } },
                                React.createElement(
                                  'span',
                                  { style: Object.assign({}, S.dim, { textDecoration: 'line-through', opacity: 1 }) },
                                  m.text,
                                ),
                              ),
                              React.createElement(
                                'div',
                                {role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.currentTarget.click() } },
                                  style: Object.assign({}, S.link, { flex: 'none', fontSize: 'var(--fish-small)' }),
                                  title: '恢复此条目并重新参与召回',
                                  onClick: () => 撤销作废(m.id),
                                },
                                '恢复',
                              ),
                            ),
                            m.已被取代 && m.已被取代.为什么
                              ? React.createElement(
                                  'div',
                                  {
                                    style: Object.assign({}, S.dim, {
                                      margin: '4px 0 8px',
                                      fontSize: 'var(--fish-small)',
                                      overflowWrap: 'anywhere',
                                      wordBreak: 'break-word',
                                    }),
                                  },
                                  '归档原因：' + m.已被取代.为什么,
                                )
                              : null,
                          ),
                        ),
                      )
                    : null,
                  // 注意：工具条和两个确认条**都在上面**了（见前面那段）——
                  //   原来「批量清掉」和「清空」的确认条渲染在这儿（列表最下面），
                  //   条数一多就看不见 失败：→ 挪走了，这里不再重复
                )
          else if (mode === 'index') content = h(EmbeddingSettings, { session: s.id, storeId: s.storeId, notify, indexOnly: true })
          else if (mode === 'recall') content = tr ? React.createElement(
                'div',
                null,
                React.createElement('div', { style: S.h }, '最近一次召回'),
                React.createElement('div', { style: S.dim }, '线索：「' + String(tr.query || '').slice(0, 50) + '」'),
                tr.semantic ? React.createElement('div', { style: S.dim }, '语义：缺失向量 ' + tr.semantic.missing + '；耗时 ' + tr.semantic.latencyMs + 'ms；回退 ' + (tr.semantic.fallback || '无')) : null,
                (() => {
                  // 注意：按分数排再显示 —— 老记录是按**入库顺序**存的，
                  //   直接取前 12 条全是 0 分的老条目，看不出到底挑中了什么 ✗
                  //   （反馈：「这里为什么只有这些，该显示最近标中的」）
                  const 排好 = (tr.rows || []).slice().sort((a, b) => (b.P || 0) - (a.P || 0) || (b.C || 0) - (a.C || 0))
                  const 进去的 = 排好.filter((r) => !r.omission)
                  return React.createElement(
                    'div',
                    null,
                    React.createElement(
                      'div',
                      { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', margin: '2px 0 4px' }) },
                      进去的.length
                        ? '已注入 ' + 进去的.length + ' 条（优先显示）'
                        : '本轮无匹配记忆',
                    ),
                    排好.slice(0, 20).map((r, i) => {
                      const origin = r.storeId ? d.sessions.find(x => x.storeId === r.storeId) || s : s
                      const mm = origin.memories.find((x) => x.id === r.id) || (origin.deleted || []).find((x) => x.id === r.id)
                      const why = r.resident ? '常驻事实' : r.omission
                        ? { hard_gate: '无匹配线索', below_threshold: '评分未达阈值', limit: '超过条数上限', budget: '超过字数上限', duplicate: '重复条目', fact_cap: '超过长期事实上限' }[r.omission] || r.omission
                        : { assembled: '已注入', consumed: '疑似使用', invalidated: '已失效' }[r.status] || '已注入'
                      const 色 = r.omission
                        ? S.drop
                        : r.status === 'consumed'
                          ? S.ok
                          : S.dim
                      return React.createElement(
                        'div',
                        { key: i, style: Object.assign({}, S.row, S.条) },
                        React.createElement(
                          'div',
                          { style: { flex: 1 } },
                          (r.omission ? '　' : '') + String((mm && mm.text) || r.id).slice(0, 60),
                          r.storeId ? React.createElement('button', {type: 'button',  style: S.btn, onClick: () => setOpen(origin.id) }, '原库：' + r.storeId) : null,
                        ),
                        React.createElement('div', { style: Object.assign({}, S.dim, { width: 54 }) }, 'C ' + r.C + (r.vectorMissing ? ' / 向量缺失' : '') + (r.semantic !== null && r.semantic !== undefined ? ' / cos ' + r.semantic.toFixed(3) + ' / R ' + r.R : '')),
                        React.createElement('div', { style: Object.assign({}, S.dim, { width: 54 }) }, 'P ' + r.P),
                        React.createElement('div', { style: Object.assign({}, 色, { width: 96 }) }, why + (r.timeHit ? ' ⭐' : '')),
                      )
                    }),
                  )
                })(),
                React.createElement(
                  'div',
                  { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 6 }) },
                  '已注入表示纳入本轮上下文；疑似使用基于回复词项匹配推测；已失效表示条目已删除或修改。',
                ),
              ) : h('div', { className: 'memory-empty' }, '暂无召回记录，接收新消息后生成。')
          return h(MemoryDialog, { className: 'memory-library-dialog', title: libraryTitle(s), subtitle: '记忆库 · ' + titles[mode], active, onClose: () => setOpen(null), footer: h('span', null, s.count + ' 条记忆 · ' + (s.qq ? 'QQ 来源库' : '会话记忆库')) },
            h('div', { className: 'memory-library-workspace' },
              h('nav', { className: 'memory-library-nav', 'aria-label': '记忆库工具' },
                ...navigation.map(([view, title, hint], index) =>
                  h('button', { key: view, type: 'button', className: 'fish-button', title: hint, 'aria-label': title,
                    'aria-current': (mode === view || mode === 'edit' && view === 'memories' || mode === 'generate' && view === 'archive' || mode === 'duplicates' && view === 'organize') ? 'page' : undefined,
                    onClick: () => go(view) },
                    h('span', { className: 'memory-nav-number', 'aria-hidden': true }, String(index + 1).padStart(2, '0')),
                    h('span', { className: 'memory-nav-copy' }, h('strong', null, title), h('small', null, hint))))),
              h('div', { className: 'memory-library-content' },
                h('header', { className: 'memory-content-heading' }, h('h3', null, titles[mode]), hint ? h('p', null, hint) : null),
                ['edit', 'generate', 'duplicates'].includes(mode) ? h('button', { type: 'button', className: 'fish-button', onClick: () => go(mode === 'edit' ? 'memories' : mode === 'generate' ? 'archive' : 'organize') }, '返回' + (mode === 'edit' ? '记忆条目' : mode === 'generate' ? '档案导入与生成' : '整理与修复')) : null,
                notes?.length ? h('div', { className: 'memory-feedback', role: 'status' }, notes.join('\n')) : null,
                content)))
        })()
      })()
      // ---- 第一级：会话列表 + 参数 ----
      const spec = (d.spec || []).slice()
      const byKey = {}
      for (const s of spec) byKey[s.key] = s
      const WK = spec.filter((s) => s.group === 'weight').map((s) => s.key)

      const setOne = (k, native) => {
        policyDirty.current.add(k)
        // 函数式更新 —— 连着改两格不会互相覆盖
        setParams((prev) => Object.assign({}, prev, { [k]: native }))
        if (WK.indexOf(k) >= 0) setPin(k)
        setNotes(null)
      }

      const wSum = WK.length ? Math.round(WK.reduce((a, k) => a + toPct(params[k] || 0), 0) * 10) / 10 : 0

      // 2026-09-21 修版式：原来五个东西挤在一行里（标签写死 110px ＋ 一整句长提示），
      // flexWrap 一装不下就拆散成「一行一个」；而 9 个字的标签在 110px 盒子里还会自己折行
      // —— 她看到那个孤零零的「活」就是「没写时间的算多鲜活」的尾巴。
      // 现在拆两行：① 标签＋数字＋单位＋范围（短，不会挤）② 提示独占一行，自己换行。
      // 单位没写就不占位（原来会留一个空的 20px 盒子）。
      const oneRow = (s) => {
        const isW = s.group === 'weight'
        const lo = isW ? toPct(s.min) : s.min
        const hi = isW ? toPct(s.max) : s.max
        const cur = isW ? toPct(params[s.key]) : params[s.key]
        const typing = editing && editing.key === s.key
        const unit = isW ? '%' : s.unit || ''
        const head = [
          React.createElement('span', { key: 'lbl', style: { flex: '0 0 auto' } }, s.label),
          React.createElement('input', {'aria-label': s.label,
            key: 'inp',
            type: 'number',
            style: S.inp,
            min: lo,
            max: hi,
            step: isW ? 0.1 : s.step,
            value: typing ? editing.text : String(cur),
            onChange: (e) => {
              const t = e.target.value
              setEditing({ key: s.key, text: t })
              const n = Number(t)
              if (t !== '' && isFinite(n)) setOne(s.key, isW ? fromPct(n) : n)
            },
            onBlur: () => { setEditing(null); save(Object.assign({}, params, { pin })) },
          }),
        ]
        if (unit) head.push(React.createElement('span', { key: 'unit', style: S.dim }, unit))
        head.push(React.createElement('span', { key: 'rng', style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', opacity: 1 }) }, '（' + lo + ' ~ ' + hi + '）'))
        return React.createElement(
          'div',
          { key: s.key, className: 'memory-policy-field' },
          React.createElement('div', { className: 'memory-policy-input' }, head),
          s.tip
            ? React.createElement('div', { style: Object.assign({}, S.dim, { fontSize: 'var(--fish-small)', marginTop: 2, lineHeight: 1.5 }) }, s.tip)
            : null,
        )
      }

      const save = (body) => {
        setBusy(true)
        setNotes(null)
        const request = policyQueue.current.catch(() => {}).then(() => post('/policy', body))
        policyQueue.current = request
        return request.then((r) => {
            if (!r || r.ok === false) throw Error(r?.error || '保存召回设置失败')
            if (r && r.policy) {
              setParams(old => Object.fromEntries(Object.entries(r.policy).map(([key, value]) => {
                if (!body.reset && old[key] !== body[key]) return [key, old[key]]
                policyDirty.current.delete(key)
                return [key, value]
              })))
              setD(old => ({ ...old, policy: r.policy }))
            }
            setNotes(null)
            告知(['召回设置已保存', ...(r.notes || [])].join('\n'), { tone: 'success' })
            setBusy(false)
          })
          .catch((e) => {
            setBusy(false)
            告知('保存失败：' + ((e && e.message) || e))
          })
      }

      const blocks = GROUPS.map(([gid, name, hint]) => {
        const rows = spec.filter(item => item.group === gid)
        if (!rows.length) return null
        return h('section', { className: 'memory-policy-group', key: gid }, h('div', { className: 'memory-policy-head' }, h('h4', null, name), h('p', null, hint), gid === 'weight' ? h('span', { className: 'memory-badge' }, '合计 ' + wSum + '%') : null), h('div', { className: 'memory-policy-fields' }, ...rows.map(oneRow)))
      })

      return h(
        'div',
        { className: 'fish-module fish-memory memory-page' },
        onPageChange
          ? null
          : h(
              'nav',
              { className: 'fish-subnav', 'aria-label': '长期记忆页面' },
              ...['记忆库', 'RAG 语义召回'].map((name) =>
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'fish-button' + (memoryPage === name ? ' fish-primary' : ''),
                    key: name,
                    'aria-current': memoryPage === name ? 'page' : undefined,
                    onClick: () => setMemoryPage(name),
                  },
                  name,
                ),
              ),
            ),
        h(
          'div',
          { className: 'memory-page-toolbar' },
          onPageChange ? null : h('h2', null, memoryPage),
          h(RefreshButton, { type: 'button', label: '刷新', disabled: busy, onClick: load }, '刷新'),
        ),
        err ? h('div', { className: 'memory-feedback', role: 'alert' }, err) : null,
        memoryPage === '记忆库'
          ? h(
              React.Fragment,
              null,
              h(
                'section',
                { className: 'fish-card memory-summary' },
                h(
                  'div',
                  null,
                  h('h3', null, '长期记忆'),
                  h('p', null, '按 QQ 来源管理记忆，私聊独立，普通群共享，指定群单独隔离。'),
                ),
                h(
                  'div',
                  { className: 'memory-switch' },
                  h(Switch, {
                    type: 'checkbox',
                    role: 'switch',
                    'aria-label': '启用长期记忆',
                    checked: d.全局开关 !== false,
                    disabled: busy,
                    onChange: async () => {
                      setBusy(true)
                      try {
                        const r = await post('/global', { on: d.全局开关 === false })
                        if (!r.ok) throw Error(r.error || r.message || '保存失败')
                        load()
                      } catch (e) {
                        告知(e.message)
                      } finally {
                        setBusy(false)
                      }
                    },
                  }),
                  h('span', null, d.全局开关 !== false ? '已开启' : '已关闭'),
                ),
              ),
              h(
                'div',
                { className: 'memory-stats' },
                ...[
                  [libraries.length, '记忆库'],
                  [libraries.reduce((sum, s) => sum + s.count, 0), '记忆条目'],
                  [(d.sessions || []).length, '关联入口'],
                ].map(([value, label]) =>
                  h('div', { key: label }, h('strong', null, value), h('span', null, label)),
                ),
              ),
              h(
                'section',
                { className: 'fish-card memory-libraries' },
                h(
                  'div',
                  { className: 'memory-card-head' },
                  h(
                    'div',
                    null,
                    h('h3', null, '工作区记忆库'),
                    h('p', null, '相同存储库合并展示，可管理条目、档案与语义索引。'),
                  ),
                ),
                !libraries.length
                  ? h(
                      'div',
                      { className: 'memory-empty' },
                      '暂无记忆库，绑定会话并接收消息后生成。',
                    )
                  : h(
                      'div',
                      { className: 'memory-library-list' },
                      ...libraries.map((s) =>
                        h(
                          'article',
                          { key: s.storeId || s.id, className: 'memory-library-row' },
                          h(
                            'div',
                            { className: 'memory-library-copy' },
                            h(
                              'div',
                              { className: 'memory-library-title' },
                              h('strong', null, libraryTitle(s)),
                              h(
                                'span',
                                { className: 'memory-badge' },
                                s.qq
                                  ? s.storeId?.endsWith('_shared')
                                    ? '群共享'
                                    : s.storeId?.includes('_group_')
                                      ? '群独立'
                                      : '私聊独立'
                                  : d.模式 === 'workspace'
                                    ? '工作区共享'
                                    : '会话独立',
                              ),
                            ),
                            h(
                              'p',
                              null,
                              s.count +
                                ' 条记忆 · ' +
                                (d.sessions || []).filter((x) => (x.storeId || x.id) === (s.storeId || s.id))
                                  .length +
                                ' 个入口 · ' +
                                (s.lastTrace ? '最近召回 ' + rel(s.lastTrace, now) : '暂无召回记录'),
                            ),
                          ),
                          h(
                            'div',
                            { className: 'memory-actions' },
                            h(
                              'button',
                              {
                                type: 'button',
                                className: 'fish-button',
                                onClick: () => openLibrary(s.id),
                              },
                              '管理',
                            ),
                          ),
                        ),
                      ),
                    ),
              ),
            )
          : null,
        h(
          'div',
          { className: 'memory-stack', hidden: memoryPage !== 'RAG 语义召回' },
          h(EmbeddingSettings, { notify }),
          h(
            'section',
            { className: 'fish-card' },
            h(
              'div',
              { className: 'memory-card-head' },
              h(
                'div',
                null,
                h('h3', null, '召回与遗忘'),
                h('p', null, '设置关键词召回、记忆预算与淡忘速度，和语义召回共同生效。'),
              ),
            ),
            ...blocks,
            h(
              'div',
              { className: 'memory-actions memory-save-row' },
              null,
              h(
                'button',
                {
                  type: 'button',
                  className: 'fish-button',
                  disabled: busy,
                  onClick: () => save({ reset: true }),
                },
                '恢复默认',
              ),
            ),
          ),
        ),
        notes?.length && !open
          ? h('div', { className: 'memory-feedback', role: 'status' }, notes.join('\n'))
          : null,
        详情视图,
      )

    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('settings.section', () =>
        slots.register(
          {
            name: 'settings.section',
            id: 'memory',
            order: 51,
            label: () => '长期记忆',
          },
          () => React.createElement('div', null, null, React.createElement(Section)),
        ),
      )
    }

    exports.Section = Section
    exports.MemoryDialog = MemoryDialog
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})

/**
 * dsh-feiyu-mood —— 浏览器半端（设置里的一页「心情」）
 * ============================================================================
 * 自注册脚本（和 dsh-bili-scroll 一样的约定）：
 *
 *     moduleLoader.load({ id: '<包名>', factory: (require) => ({ inject, apply }) })
 *
 * 这一页要满足的想法（主人 2026-10-19）：
 *   · 心情插件**也能给别人用** ⇒ 名字得能改（它叫什么叫什么、你叫什么叫什么）
 *   · 目标会话、基线、下限、注入开关、自动判断开关，都在面板里改，不用去翻 config.json
 *   · 改完**立刻生效**（宿主那边是原地改 cfg，不用重启）
 *
 * ⭐ 0.6.0：设置页分四个页签（心情 / 会话绑定 / 判断与注入 / 挂饰）。
 *    一份心情可以绑好几个会话 —— 这些会话共用一份心情、一条时间线、每天的额度；
 *    分页签只是把「看」和「改」分开，切页签不动任何设置。
 *
 * ⭐ 0.7.0：「会话绑定」页签顶上多了**模式切换**，二选一：
 *    · 会话模式：跟以前一样，按点名的会话绑；
 *    · 工作区模式：按工作区绑 —— 那个工作区下所有会话都归这一份，新开的自动进来。
 *    名字那栏的文案也改清楚了：那只是「这份叫什么」，不是称呼（称呼在「判断与注入」）。
 * ============================================================================
 */
moduleLoader.load({
  id: 'dsh-feiyu-mood',
  factory: (require) => {
    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'

    const API = '/dsh-feiyu-mood'

    // 四个页签（默认第一个）
    const 页签 = [
      ['mood', '心情'],
      ['bind', '会话绑定'],
      ['judge', '判断与注入'],
      ['charm', '挂饰'],
    ]

    // 心情值与表情分档：用的就是挂饰那五张图（assets/face-*.png，448×352）
    const faceImg = (v, faces) => {
      const m = Number(v)
      const tier = !Number.isFinite(m) ? 'ok' : m >= 80 ? 'great' : m >= 62 ? 'good' : m >= 42 ? 'ok' : m >= 25 ? 'worry' : 'sad'
      return faces?.[tier]?.url || API + '/face-' + tier + '.png'
    }

    const getJson = async (url) => {
      const res = await fetch(url, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    }
    const postJson = async (url, body) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      return res.json()
    }

    function updatePortraitOutline(img) {
      const button = img.parentElement
      if (!img.naturalWidth || !img.naturalHeight) return
      button.style.setProperty('--portrait-ratio', String(img.naturalWidth / img.naturalHeight))
      const svg = button.querySelector('svg')
      svg.replaceChildren()
      button.dataset.outline = 'fallback'
      try {
        const scale = Math.min(1, 192 / Math.max(img.naturalWidth, img.naturalHeight))
        const width = Math.max(1, Math.round(img.naturalWidth * scale))
        const height = Math.max(1, Math.round(img.naturalHeight * scale))
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.drawImage(img, 0, 0, width, height)
        const pixels = context.getImageData(0, 0, width, height).data
        const opaque = (x, y) => x >= 0 && y >= 0 && x < width && y < height && pixels[(y * width + x) * 4 + 3] >= 40
        // Marching Squares 按左上、右上、右下、左下取样，连接透明边界的中点。
        const cases = [[], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 1], [2, 3]], [[0, 2]], [[0, 3]],
          [[3, 0]], [[0, 2]], [[3, 0], [1, 2]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], []]
        const neighbors = new Map()
        for (let y = 0; y <= height; y++) {
          for (let x = 0; x <= width; x++) {
            const mask = (opaque(x - 1, y - 1) ? 8 : 0) | (opaque(x, y - 1) ? 4 : 0)
              | (opaque(x, y) ? 2 : 0) | (opaque(x - 1, y) ? 1 : 0)
            if (!cases[mask].length) continue
            const points = [[2 * x, 2 * y - 1], [2 * x + 1, 2 * y], [2 * x, 2 * y + 1], [2 * x - 1, 2 * y]]
            for (const [from, to] of cases[mask]) {
              const start = points[from].join(',')
              const end = points[to].join(',')
              if (!neighbors.has(start)) neighbors.set(start, [])
              if (!neighbors.has(end)) neighbors.set(end, [])
              neighbors.get(start).push(end)
              neighbors.get(end).push(start)
            }
          }
        }
        const visited = new Set()
        const paths = []
        for (const start of neighbors.keys()) {
          if (visited.has(start)) continue
          const points = []
          let current = start
          let previous = null
          while (current && !visited.has(current)) {
            visited.add(current)
            points.push(current)
            const next = neighbors.get(current).find(point => point !== previous)
            previous = current
            current = next
          }
          paths.push('M' + points.join('L') + 'Z')
        }
        if (!paths.length) return
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', paths.join(' '))
        svg.setAttribute('viewBox', '0 0 ' + 2 * width + ' ' + 2 * height)
        svg.replaceChildren(path)
        button.dataset.outline = 'contour'
      } catch {
        // 图片像素不可读取时仍保留可见的上传反馈。
      }
    }

    const CSS = `
.big-fish [data-fm-wrap]{display:flex;flex-direction:column;gap:24px;min-width:0;padding-bottom:24px}
.big-fish [data-fm-hero]{display:flex;align-items:center;gap:24px;padding:24px;background:var(--fish-panel);border:1px solid var(--fish-border);border-radius:var(--fish-radius);box-shadow:var(--fish-shadow);flex-wrap:wrap}
.big-fish [data-fm-face]{width:112px;height:auto;aspect-ratio:448/352;object-fit:contain;flex:none}
.big-fish [data-fm-big]{font:700 32px/1.4 var(--fish-title)}
.big-fish [data-fm-sub],.big-fish [data-fm-note]{font-size:14px;line-height:1.75;color:var(--fish-muted);overflow-wrap:anywhere}
.big-fish [data-fm-sec]{display:flex;flex-direction:column;gap:16px;padding:8px 0 24px;border-bottom:1px solid var(--fish-border)}
.big-fish [data-fm-h]{font:700 20px/1.5 var(--fish-title);margin-bottom:4px}
.big-fish [data-fm-row]{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:8px 0}
.big-fish [data-fm-grow]{flex:1 1 220px;min-width:0}
.big-fish [data-fm-label]{font-size:16px}
.big-fish [data-fm-input]{padding:8px 12px;border-radius:var(--fish-radius-sm);border:1px solid var(--fish-control-border);background:var(--fish-surface);color:var(--fish-text);font-size:14px;max-width:100%;min-width:0}
.big-fish [data-fm-num]{width:104px}
.big-fish [data-fm-btn],.big-fish [data-fm-pick]{padding:8px 16px;border-radius:var(--fish-radius-sm);border:1px solid var(--fish-border);background:var(--fish-control-fill);color:var(--fish-text);font-size:14px;cursor:pointer}
.big-fish [data-fm-msg]{font-size:14px;min-height:24px;color:var(--fish-text)}
.big-fish [data-fm-tabs]{display:flex;gap:8px;overflow-x:auto;padding-bottom:16px;border-bottom:1px solid var(--fish-border)}
.big-fish [data-fm-tab]{padding:8px 16px;border-radius:var(--fish-radius-sm);border:1px solid transparent;background:transparent;color:var(--fish-muted);font-size:14px;white-space:nowrap;flex:none}
.big-fish [data-fm-on]{background:var(--fish-accent-soft);border-color:var(--fish-border);color:var(--fish-action);font-weight:600}
.big-fish [data-fm-pane]{display:flex;flex-direction:column;gap:24px;min-width:0}
.big-fish [data-fm-slot]{display:flex;flex-direction:column;gap:16px;padding:24px;border:1px solid var(--fish-border);border-radius:var(--fish-radius);box-shadow:var(--fish-shadow);background:var(--fish-panel)}
.big-fish [data-fm-sess]{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:8px 0}
.big-fish [data-fm-sessname]{flex:1;min-width:0;font-size:14px;overflow-wrap:anywhere}
.big-fish [data-fm-faces]{display:flex;gap:24px;flex-wrap:wrap}
.big-fish [data-fm-faces] img{width:84px;height:auto;aspect-ratio:448/352;object-fit:contain;display:block}
.big-fish [data-fm-quote]{font-size:16px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere;padding:24px;border-radius:var(--fish-radius-sm);background:var(--fish-soft)}
.big-fish [data-fm-quote][data-fm-dim]{color:var(--fish-muted)}
.big-fish [data-fm-tl]{display:flex;flex-direction:column;max-height:400px;overflow:auto}
.big-fish [data-fm-tlrow]{display:grid;grid-template-columns:136px 40px 48px minmax(0,1fr);gap:12px;padding:16px 0;border-bottom:1px solid var(--fish-line);font-size:14px;line-height:1.75}
.big-fish [data-fm-time]{color:var(--fish-muted)}
.big-fish [data-fm-mood]{font-weight:600}
.big-fish [data-fm-delta]{color:var(--fish-action)}
.big-fish [data-fm-reason]{overflow-wrap:anywhere}
.big-fish [data-fm-ver]{display:flex;align-items:center;gap:16px;padding:16px;border-radius:var(--fish-radius-sm);background:var(--fish-soft)}
@container(max-width:520px){.big-fish [data-fm-tlrow]{grid-template-columns:minmax(0,1fr) 40px 48px}.big-fish [data-fm-reason]{grid-column:1/-1}.big-fish [data-fm-slot]{padding:16px}}
`

    function Panel({ page, onPageChange, notify, Dialog } = {}) {
      const [cfg, setCfg] = React.useState(null)
      const configDraft = React.useRef({})
      const configQueue = React.useRef(Promise.resolve())
      const editConfig = patch => { Object.assign(configDraft.current, patch); setCfg(old => ({ ...old, ...patch })) }
      const [st, setSt] = React.useState(null)
      const [sessions, setSessions] = React.useState([])
      const [工作区们, set工作区们] = React.useState([])   // 工作区模式的下拉清单
      const [看哪份, set看哪份] = React.useState('')      // 多份心情时看的是哪一份
      const 看哪份Ref = React.useRef('')
      const keyNow = () => (看哪份Ref.current ? '?key=' + encodeURIComponent(看哪份Ref.current) : '')
      const [models, setModels] = React.useState([])
      const [busy, setBusy] = React.useState('')
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [localPage, setLocalPage] = React.useState('mood')
      const 页 = page ?? localPage
      const [historyOpen, setHistoryOpen] = React.useState(false)
      const [historyDay, setHistoryDay] = React.useState('')
      const [scale, setScale] = React.useState(() => {
        try { return Math.min(160, Math.max(60, Math.round((Number(localStorage.getItem('fm-widget-scale')) || 1) * 100))) } catch { return 100 }
      })
      const [transparency, setTransparency] = React.useState(() => {
        try {
          const stored = localStorage.getItem('fm-widget-transparency')
          const value = stored == null ? 35 : Number(stored)
          return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 35
        } catch { return 35 }
      })
      const [popupMode, setPopupMode] = React.useState(() => {
        try {
          const value = localStorage.getItem('fm-widget-panel')
          return ['mood', 'cost', 'memory'].includes(value) ? value : 'mood'
        } catch { return 'mood' }
      })
      const uploading = React.useRef(false)
      const uploadInputRef = React.useRef(null)
      const uploadTargetRef = React.useRef(null)
      const set页 = onPageChange ?? setLocalPage       // 页签：mood / bind / judge / charm

      const flash = (t, options) => 告知(t, options)

      const load = React.useCallback(async () => {
        try {
          const [c, s] = await Promise.all([getJson(API + '/config'), getJson(API + '/state' + keyNow())])
          if (c && c.config) setCfg({ ...c.config, ...configDraft.current })
          if (s && s.ok) {
            setSt(s)
            if (看哪份Ref.current && !s.slots.some(slot => slot.id === 看哪份Ref.current)) {
              看哪份Ref.current = s.key
              set看哪份(s.key)
            }
          }
        } catch (e) {
          flash('读取失败：' + (e && e.message), { holdMs: 6000 })
        }
      }, [])

      React.useEffect(() => {
        load()
        getJson(API + '/sessions').then((r) => setSessions((r && r.sessions) || [])).catch(() => {})
        getJson(API + '/workspaces').then((r) => set工作区们((r && r.workspaces) || [])).catch(() => {})
        getJson(API + '/models').then((r) => setModels((r && r.providers) || [])).catch(() => {})
        const t = setInterval(() => { getJson(API + '/state' + keyNow()).then((s) => s && s.ok && setSt(s)).catch(() => {}) }, 20000)
        return () => clearInterval(t)
      }, [load])

      // ⭐ 0.7.5（最小化的时候心情以前不刷新，得点一下才变）：
      //   页面在后台时浏览器会把定时器节流到一分钟以上，切回来那一瞬间还显示旧值。
      //   所以「重新可见 / 重新获得焦点」时立刻拉一次 —— 不用她点任何东西。
      React.useEffect(() => {
        const 立刻刷 = () => {
          if (document.hidden) return
          getJson(API + '/state' + keyNow()).then((s) => { if (s && s.ok) setSt(s) }).catch(() => {})
        }
        document.addEventListener('visibilitychange', 立刻刷)
        window.addEventListener('focus', 立刻刷)
        return () => {
          document.removeEventListener('visibilitychange', 立刻刷)
          window.removeEventListener('focus', 立刻刷)
        }
      }, [])

      const patch = async (p, label) => {
        editConfig(p)
        try {
          const request = configQueue.current.catch(() => {}).then(() => postJson(API + '/config', p))
          configQueue.current = request
          const r = await request
          for (const key of Object.keys(p)) if (configDraft.current[key] === p[key]) delete configDraft.current[key]
          if (r && r.config) setCfg({ ...r.config, ...configDraft.current })
          await load()
          flash((label || '设置') + ' 已保存', { tone: 'success' })
        } catch (e) { flash('保存失败：' + (e && e.message)) }
      }

      /* ⭐ 一份心情可以绑好几个会话（或一个工作区）：这里照这份清单画
         （没配置过就当成「第一份」；id 尽量沿用宿主给的 st.key，别凭空造一个） */
      const 模式 = cfg?.模式 === 'memory' ? 'memory' : cfg?.模式 === 'workspace' ? 'workspace' : 'session'
      const 份列表 = (() => {
        const raw = 模式 === 'memory' ? (st?.slots || []) : Array.isArray(cfg && cfg.slots) && cfg.slots.length
          ? cfg.slots
          : [{ id: String((st && st.key) || ''), label: '', selfName: '', ownerName: '', 工作区: '', sessions: [] }]
        return raw.map((s) => ({
          id: String((s && s.id) || ''),
          label: String((s && s.label) || ''),
          selfName: String((s && s.selfName) || ''),
          ownerName: String((s && s.ownerName) || ''),
          工作区: String((s && s.工作区) || (s && s.workspace) || ''),
          sessions: Array.isArray(s && s.sessions)
            ? s.sessions.map((x) => String(x || ''))
            : ((s && s.session) ? [String(s.session)] : []),
        }))
      })()
      const 会话名 = (id) => {
        const hit = (sessions || []).find((x) => x.id === id)
        return (hit && hit.title) || String(id)
      }
      const 份标题 = (sl) => sl.label
        || (sl.sessions || []).map(会话名).filter(Boolean).join('、')
        || (sl.工作区 ? String(sl.工作区) : '')
        || '（未绑定会话）'
      const 已绑 = new Set()
      份列表.forEach((p) => p.sessions.forEach((s) => 已绑.add(s)))
      const 可加会话 = (sessions || []).filter((x) => !已绑.has(x.id))

      const 改份 = (i, 变) => patch({ slots: 份列表.map((x, j) => (j === i ? { ...x, ...变 } : x)) }, '绑定')

      const 切份 = (e) => {
        const v = e.target.value
        set看哪份(v)
        看哪份Ref.current = v
        getJson(API + '/state?key=' + encodeURIComponent(v)).then((x) => { if (x && x.ok) setSt(x) }).catch(() => {})
      }

      const onReset = async () => {
        setBusy('reset')
        try {
          await postJson(API + '/reset', { key: 看哪份 || (st && st.key) || '' })
          await load()
          flash('已重置当前实例')
        } catch (e) { flash('重置失败：' + (e && e.message)) }
        setBusy('')
      }

      if (!cfg) return h('div', { 'data-fm-wrap': '' }, h('div', { 'data-fm-note': '' }, '读取中…'))

      const sw = (key, label) => h(Switch, {
        type: 'checkbox', role: 'switch', 'aria-label': label,
        checked: Boolean(cfg[key]),
        onChange: (e) => patch({ [key]: e.target.checked }, label),
      })

      const formRow = (label, control, note) => h('div', { key: label, className: 'fish-form-row mood-form-row' },
        h('div', { className: 'fish-form-label' }, label),
        h('div', { className: 'fish-control' }, control, note ? h('p', { className: 'fish-muted' }, note) : null))
      const numInput = (key, label, note, min, max) => formRow(label,
        h('input', { 'data-fm-input': '', 'data-fm-num': '', type: 'number', min, max, 'aria-label': label,
          value: String(cfg[key] ?? ''),
          onChange: e => editConfig({ [key]: e.target.value }),
          onBlur: () => patch({ [key]: Math.max(min, Math.min(Number(cfg[key]) || 0, max)) }, label),
        }), note)
      const changeScale = value => {
        const next = Math.min(160, Math.max(60, Number(value) || 100))
        setScale(next)
        try { localStorage.setItem('fm-widget-scale', String(next / 100)) } catch {}
        window.dispatchEvent(new CustomEvent('fish-charm-scale', { detail: next / 100 }))
      }
      const changePopupMode = value => {
        if (!['mood', 'cost', 'memory'].includes(value)) return
        setPopupMode(value)
        try { localStorage.setItem('fm-widget-panel', value) } catch {}
        window.dispatchEvent(new CustomEvent('fish-charm-panel', { detail: value }))
      }
      const changeTransparency = value => {
        const next = Math.min(100, Math.max(0, Number(value)))
        if (!Number.isFinite(next)) return
        setTransparency(next)
        try { localStorage.setItem('fm-widget-transparency', String(next)) } catch {}
        window.dispatchEvent(new CustomEvent('fish-charm-transparency', { detail: next }))
      }
      const applyCharmImages = result => {
        setSt(old => ({ ...old, charmImages: result.images, charmFaces: result.faces }))
        window.dispatchEvent(new CustomEvent('fish-charm-updated', { detail: { images: result.images, faces: result.faces } }))
        try { localStorage.setItem('fish-charm-update', JSON.stringify({ images: result.images, faces: result.faces })) } catch {}
      }
      const choosePortrait = (tier, kind) => {
        if (uploading.current) return
        uploadTargetRef.current = { tier, kind }
        uploadInputRef.current?.click()
      }
      const resetCharm = async (tier, kind) => {
        if (uploading.current) return
        uploading.current = true
        setBusy('reset-' + kind + '-' + tier)
        try {
          const response = await fetch(API + '/charm-image?tier=' + tier + '&kind=' + kind, { method: 'DELETE' })
          const result = await response.json()
          if (!response.ok || !result.ok) throw new Error(result.error || '恢复失败')
          applyCharmImages(result)
          flash('当前图片已恢复默认', { tone: 'success' })
        } catch (error) { flash(error.message) }
        finally { uploading.current = false; setBusy('') }
      }
      const uploadCharm = async (tier, kind, input) => {
        const file = input.files?.[0]
        if (!file || uploading.current) return
        uploading.current = true
        setBusy('upload-' + kind + '-' + tier)
        try {
          if (!file.size || file.size > 4 * 1024 * 1024) throw new Error('请选择不超过 4 MB 的图片')
          const bitmap = await createImageBitmap(file)
          bitmap.close()
          const response = await fetch(API + '/charm-image?tier=' + tier + '&kind=' + kind, { method: 'POST', body: file })
          const result = await response.json()
          if (!response.ok || !result.ok) throw new Error(result.error || '上传失败')
          applyCharmImages(result)
          flash('挂饰图片已更新', { tone: 'success' })
        } catch (error) { flash('上传失败，' + error.message) }
        finally { uploading.current = false; setBusy(''); input.value = '' }
      }
      const dayOf = value => {
        const date = new Date(value)
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
      }
      const history = (st?.timeline || []).slice().reverse().filter(item => !historyDay || dayOf(item.at) === historyDay)
      const historyDialog = historyOpen && Dialog ? h(Dialog, { id: 'mood-history', title: '心情变化记录', subtitle: st?.label || st?.name,
        active: 页 === 'mood', onClose: () => setHistoryOpen(false) },
        h('div', { className: 'mood-history-toolbar' },
          h('label', { className: 'mood-history-date' }, '日期', h('input', { type: 'date', 'aria-label': '筛选记录日期', value: historyDay, onChange: e => setHistoryDay(e.target.value) })),
          h('button', { type: 'button', className: 'fish-button', onClick: () => setHistoryDay('') }, '全部日期'),
          h('span', { role: 'status', className: 'fish-muted' }, history.length + ' 条记录')),
        history.length ? h('div', { 'data-fm-tl': '' }, ...history.map((item, index) => h('div', { key: item.at + '-' + index, 'data-fm-tlrow': '' },
          h('time', { 'data-fm-time': '' }, new Date(item.at).toLocaleString()),
          h('span', { 'data-fm-mood': '' }, String(item.mood)),
          h('span', { 'data-fm-delta': '' }, (item.delta > 0 ? '+' : '') + (item.delta ?? 0)),
          h('span', { 'data-fm-reason': '' }, item.reason || '—', item.kind === 'decay' ? '（自然衰减）' : '',
            item.minor ? '（低于单次显著变化阈值）' : '', item.conf != null && item.kind !== 'decay' ? '（置信度 ' + item.conf + '）' : ''))))
          : h('p', { className: 'fish-muted' }, '所选日期暂无记录。')) : null

      /* ── 页签 1：心情（当前心情 / 它会听到的话 / 心情变化记录） ── */
      const 心情页 = (() => {
        const 项 = []
        if (st && st.multi) {
          项.push(h('div', { key: 'pick', 'data-fm-sec': '' },
            h('div', { 'data-fm-h': '' }, '当前心情实例'),
            h('div', { 'data-fm-note': '' },
              '共 ' + (st.slots || []).length + ' 个心情实例，各自保存状态、时间线和注入次数。此选择仅切换查看对象。'),
            h('select', {'aria-label': '选择心情',
              'data-fm-input': '', value: 看哪份 || (st.key || ''),
              onChange: 切份,
            },
              (st.slots || []).map((sl) => h('option', { key: sl.id, value: sl.id }, 份标题(sl))))))
        }
        项.push(h('div', { key: 'hero', 'data-fm-hero': '' },
          h('img', { 'data-fm-face': '', src: faceImg(st && st.mood, st?.charmFaces), alt: '' }),
          h('div', { 'data-fm-grow': '' },
            h('div', { 'data-fm-big': '' }, (st && st.mood != null ? st.mood : '—')
              + (st && st.moodLabel ? '　' + st.moodLabel : '')),
            h('div', { 'data-fm-sub': '' },
              ((st && st.lastReason) || '暂无心情变化记录。已绑定会话完成对话且判定有变化后生成记录。'),
              (st && st.updatedAt ? '（' + new Date(st.updatedAt).toLocaleString() + '）' : ''),
              (st && st.lastReason
                ? (st.injectMode === 'off'
                  ? '　· 上下文注入已关闭'
                  : (st.injectable ? '　· 满足注入条件' : '　· 当前不注入'))
                : ''))),
          h('button', {type: 'button',  'data-fm-btn': '', disabled: busy === 'reset', onClick: onReset }, '重置当前实例')))
        项.push(h('div', { key: 'reset-note', 'data-fm-note': '' }, '重置会将当前实例恢复到心情基线，并清空情绪维度、时间线及注入记录。'))
        项.push(h('div', { key: 'dimensions', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '七维情绪'),
          h('div', { className: 'fish-dimensions' },
            [['happy', '开心'], ['calm', '踏实'], ['sweet', '甜蜜'], ['heartache', '心疼'], ['worry', '担心'], ['sad', '难过'], ['jealous', '吃醋']].map(([key, label]) => {
              const dimension = (st?.dims || []).find(item => item.key === key)
              const value = Number(dimension?.value)
              const available = dimension && Number.isFinite(value)
              return h('div', { key }, h('div', { className: 'fish-dimension-label' }, h('span', null, label), h('span', null, available ? value + ' / 100' : '暂无数据')),
                h('div', { className: 'fish-dimension-track', 'aria-hidden': true }, h('span', { style: { width: available ? Math.max(0, Math.min(100, value)) + '%' : '0%' } })))
            }))))
        项.push(h('div', { key: 'preview', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '上下文注入内容'),
          (st && st.injectPreview && st.injectPreview.state === 'off')
            ? h('div', { 'data-fm-note': '' }, '已关闭上下文注入。心情判断与记录仍由自动判断开关控制。')
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'pending')
            ? h('div', {},
              h('div', { 'data-fm-note': '' }, '以下为下一次生成回复时可注入的上下文预览。'),
              h('div', { 'data-fm-quote': '' }, st.injectPreview.text || '（暂无可注入内容）'))
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'minor')
            ? h('div', { 'data-fm-note': '' }, '本次变化未达到显著变化或累计变化阈值，仅更新状态和时间线。')
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'blocked')
            ? h('div', {},
              h('div', { 'data-fm-note': '' },
                '当前实例今日已注入 ' + (st.injectPreview.said != null ? st.injectPreview.said : st.saidToday)
                + ' 次（上限 ' + (st.injectPreview.cap != null ? st.injectPreview.cap : st.injectPerDay)
                + '）。每日次数按宿主本地时间在零点重新统计，超限后已处理的变化不会自动补发。'),
              st.lastInjectedText
                ? h('div', {},
                  h('div', { 'data-fm-note': '' },
                    '最近一次实际注入内容'
                    + (st.lastInjectedAt ? '（' + new Date(st.lastInjectedAt).toLocaleString() + '）' : '')
                    + '，仅供历史参考。'),
                  h('div', { 'data-fm-quote': '', 'data-fm-dim': '' }, st.lastInjectedText))
                : null)
            : null,
          (st && st.injectPreview && st.injectPreview.state === 'said')
            ? h('div', {},
              h('div', { 'data-fm-note': '' },
                '最近一次注入内容'
                + (st.lastInjectedAt ? '（' + new Date(st.lastInjectedAt).toLocaleString() + '）' : '')
                + (st.injectPreview.replay
                  ? '。以下内容由记录重建，可能与原文存在差异。'
                  : '。同一条状态更新仅注入一次。')),
              h('div', { 'data-fm-quote': '', 'data-fm-dim': st.lastInjectedText ? undefined : '' },
                st.lastInjectedText || '（暂无实际注入记录）'))
            : null))
        项.push(h('div', { key: 'timeline', className: 'fish-actions' },
          h('button', { type: 'button', className: 'fish-button', onClick: () => { setHistoryDay(''); setHistoryOpen(true) } }, '查看心情变化记录'),
          h('span', { className: 'fish-muted' }, (st?.timeline?.length || 0) + ' 条记录')))
        return h('div', { 'data-fm-pane': '' }, ...项)
      })()

      /* ── 页签 2：绑定（会话模式按会话绑 / 工作区模式按工作区绑，二选一） ── */
      const 工作区显示 = (name) => {
        const 命中 = (工作区们 || []).find((w) => w.name === name)
        return (命中 && (命中.path || 命中.name)) || String(name || '')
      }
      const 刷新工作区 = () => {
        return getJson(API + '/workspaces').then((r) => set工作区们((r && r.workspaces) || [])).catch(() => {})
      }
      const 绑定页 = (() => {
        const 项 = []
        const 模式钮 = (id, 名) => h('button', {type: 'button',
          key: id,
          'data-fm-pick': '',
          'data-fm-on': 模式 === id ? '' : undefined,
          'aria-pressed': 模式 === id,
          onClick: () => {
            if (模式 !== id) patch({ 模式: id }, '模式')
            if (id === 'workspace') 刷新工作区()
          },
        }, 名)
        项.push(h('div', { key: 'mode', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '心情归属模式'),
          h('div', { 'data-fm-note': '' },
            '按已核验 QQ 记忆库分组，私聊与隔离群独立、普通群共享，自动同步映射及隔离设置。'
            + '会话模式为每个已绑定会话分配独立心情。'
            + '工作区模式按会话存储目录分组，包含该目录下后续新增的顶层会话。'),
          h('div', { 'data-fm-row': '' },
            模式钮('memory', '跟随记忆库（默认）'),
            模式钮('session', '会话模式'),
            模式钮('workspace', '工作区模式'))))
        if (模式 === 'memory') {
          项.push(h('div', { key: 'memory-note', 'data-fm-note': '' }, '同一写入库对应一个心情实例，共享心情值、情绪维度、时间线及每日注入次数。可切换会话模式或工作区模式自定义归属。'))
          份列表.forEach(sl => 项.push(h('div', { key: sl.id, 'data-fm-sec': '' },
            h('div', { 'data-fm-h': '' }, sl.label),
            h('div', { 'data-fm-note': '' }, '记忆库 ' + sl.id),
            ...sl.sessions.map(sid => h('div', { key: sid, 'data-fm-sess': '' }, 会话名(sid))))))
          if (!份列表.length) 项.push(h('div', { key: 'empty', role: 'status', 'data-fm-note': '' }, '尚无已核验的 QQ 映射，请启用 QQ 映射并接收消息后查看。'))
          return h('div', { 'data-fm-pane': '' }, ...项)
        }
        项.push(h('div', { key: 'h', 'data-fm-h': '' }, 模式 === 'workspace' ? '工作区绑定' : '会话绑定'))
        项.push(h('div', { key: 'note', 'data-fm-note': '' },
          模式 === 'workspace'
            ? '每个实例绑定一个工作区目录，目录内顶层会话共享状态。两种模式分别保存绑定。'
            : '每个实例绑定一个会话，独立维护状态、时间线和每日注入次数。'
              + '一个会话仅归属一个实例，重复绑定时保留列表中靠前的归属。'))
        份列表.forEach((sl, i) => {
          const 标题 = '实例 ' + (i + 1)
          const 这块工作区 = (工作区们 || []).find((w) => w.name === (sl.工作区 || ''))
          // 会话模式：这一份绑的会话，能删能加
          const 会话块 = h('div', {},
            sl.sessions.length
              ? sl.sessions.map((sid) => h('div', { key: sid, 'data-fm-sess': '' },
                h('span', { 'data-fm-sessname': '', title: sid }, 会话名(sid)),
                h('button', {type: 'button',
                  'data-fm-btn': '', style: { padding: '2px 8px', fontSize: 'var(--fish-small)', flex: '0 0 auto' },
                  onClick: () => 改份(i, { sessions: sl.sessions.filter((x) => x !== sid) }),
                }, '移除')))
              : h('div', { 'data-fm-note': '' }, '尚未绑定会话，请通过下方列表添加。'),
            h('div', { style: { marginTop: '6px' } },
              h('select', {'aria-label': '添加绑定会话',
                'data-fm-input': '', value: '', disabled: sl.sessions.length > 0,
                onChange: (e) => {
                  const v = e.target.value
                  if (v) 改份(i, { sessions: [v] })
                },
              },
                h('option', { value: '' }, '+ 添加会话'),
                ((sessions || []).filter((x) => !已绑.has(x.id))).map((x) => h('option', { key: x.id, value: x.id }, x.title || x.id)))))
          // 工作区模式：这一份只填一个工作区（工作区里所有会话都归它）
          const 工作区块 = h('div', {},
            h('div', { 'data-fm-row': '' },
              h('select', {'aria-label': '绑定工作区',
                'data-fm-input': '', 'data-fm-grow': '', value: sl.工作区 || '',
                onChange: (e) => 改份(i, { 工作区: e.target.value }),
              },
                h('option', { value: '' }, '（未选择工作区）'),
                (工作区们 || []).map((w) => h('option', { key: w.name, value: w.name },
                  (w.path ? w.path + (w.title ? '（' + w.title + '）' : '') : w.name)
                  + ' · ' + (w.sessions || 0) + ' 个会话')),
                sl.工作区 && !(工作区们 || []).some((w) => w.name === sl.工作区)
                  ? h('option', { value: sl.工作区 }, sl.工作区 + '（当前未发现此目录）')
                  : null),
              h(RefreshButton, { type: 'button', label: '刷新工作区', onClick: 刷新工作区 }, '刷新')),
            h('div', { 'data-fm-note': '' },
              sl.工作区
                ? (这块工作区
                  ? '当前工作区目录包含 ' + (这块工作区.sessions || 0) + ' 个会话目录，其中已打开的顶层会话可挂载此实例。'
                  : '当前未发现此工作区目录。目录及会话出现后按已保存的目录标识匹配。')
                : '请选择用于匹配会话的工作区目录。'))
          项.push(h('div', { key: 'slot' + i, 'data-fm-slot': '' },
            h('div', { 'data-fm-row': '' },
              h('div', { 'data-fm-grow': '', style: { fontWeight: 600, fontSize: 'var(--fish-small)' } },
                标题 + (模式 === 'workspace'
                  ? (sl.工作区 ? ' · ' + 工作区显示(sl.工作区) : ' · 未选择工作区')
                  : (sl.sessions.length ? ' · ' + sl.sessions.length + ' 个会话' : ' · 未绑定会话'))),
              h('button', {type: 'button',
                'data-fm-btn': '', style: { padding: '2px 8px', fontSize: 'var(--fish-small)' },
                onClick: () => patch({ slots: 份列表.filter((_, j) => j !== i) }, '删除心情实例'),
              }, '移除')),
            h('div', { 'data-fm-row': '' },
              h('div', { 'data-fm-grow': '' },
                h('div', { 'data-fm-label': '', style: { fontSize: 'var(--fish-small)' } },
                  '实例显示名称')),
              h('input', {'aria-label': '心情名称',
                'data-fm-input': '', value: sl.label || '', placeholder: '用于区分心情实例',
                onChange: (e) => {
                  const v = e.target.value
                  editConfig({ slots: 份列表.map((x, j) => (j === i ? { ...x, label: v } : x)) })
                },
                onBlur: () => patch({ slots: 份列表 }, '名字'),
              })),
            模式 === 'workspace' ? 工作区块 : 会话块))
        })
        项.push(份列表.length < 6
          ? h('div', { key: 'add', 'data-fm-row': '' },
            h('button', {type: 'button',
              'data-fm-btn': '',
              onClick: () => patch({ slots: [...份列表, { id: '', label: '', selfName: '', ownerName: '', 工作区: '', sessions: [] }] }, '添加心情实例'),
            }, '+ 添加心情实例'))
          : h('div', { key: 'max', 'data-fm-note': '' }, '界面最多可配置 6 个自定义实例。'))
        项.push(h('div', { key: 'tip', 'data-fm-note': '' },
          模式 === 'workspace'
            ? '工作区列表优先显示可解析的路径，其余显示会话存储目录标识。'
            : '会话列表排除归档、空白及子代理会话。绑定保存后即时生效。'))
        return h('div', { 'data-fm-pane': '' }, ...项)
      })()

      /* ── 页签 3：判断与注入（称呼 / 模型 / 开关 / 数值） ── */
      const 判断页 = (() => {
        const 项 = []
        项.push(h('section', { key: 'names', className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '称呼与身份'),
          h('p', { className: 'fish-muted' }, '用于心情判断及原因中的人称归一化，实例设置优先于全局设置。'),
          模式 === 'memory' ? h('p', { className: 'fish-muted' }, '跟随记忆库时，对方称呼使用 QQ 映射称呼，群聊按实际参与者区分。') : null,
          ...[
            ['ownerName', '对方称呼', '用户', '用于判断对方发言及变化原因中的指代。'],
            ['selfName', 'AI 名称', '伙伴', '用于指定具有心情状态的 AI 名称。'],
            ['selfAliases', 'AI 昵称及别名', '小鱼,大肥鱼', '以逗号分隔多个称呼。判断提示词将这些词标记为对 AI 的称呼，辅助识别句子中的指代。'],
            ['selfPronoun', 'AI 第一人称称谓', '我', '用于指定判断原因中 AI 的第一人称，默认使用「我」，最多 8 个字符。'],
          ].map(([key, label, placeholder, note]) => formRow(label,
            h('input', { 'data-fm-input': '', 'aria-label': label, placeholder, value: cfg[key] || '',
              onChange: e => editConfig({ [key]: e.target.value }), onBlur: () => patch({ [key]: cfg[key] }, label) }), note))))
        项.push(h('section', { key: 'model', className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '心情判断模型'),
          h('p', { className: 'fish-muted' }, '每次自动判断单独调用一次模型。提供方与型号均已指定时使用所选模型，否则使用当前会话模型。'),
          formRow('模型提供方', h('select', { 'data-fm-input': '', 'aria-label': '模型提供方', value: cfg.judgeProvider || '',
            onChange: e => { const provider = e.target.value; patch({ judgeProvider: provider, judgeModel: models.find(p => p.id === provider)?.models?.[0]?.id || '' }, '判断模型') } },
            h('option', { value: '' }, '（使用会话模型）'),
            ...models.map(p => h('option', { key: p.id, value: p.id }, p.name || p.id)),
            cfg.judgeProvider && !models.some(p => p.id === cfg.judgeProvider) ? h('option', { value: cfg.judgeProvider }, cfg.judgeProvider) : null)),
          formRow('模型型号', h('select', { 'data-fm-input': '', 'aria-label': '模型型号', disabled: !cfg.judgeProvider, value: cfg.judgeModel || '',
            onChange: e => patch({ judgeModel: e.target.value }, '判断模型') },
            h('option', { value: '' }, '（使用会话模型）'),
            ...(models.find(p => p.id === cfg.judgeProvider)?.models || []).map(m => h('option', { key: m.id, value: m.id }, m.name || m.id)),
            cfg.judgeModel && !(models.find(p => p.id === cfg.judgeProvider)?.models || []).some(m => m.id === cfg.judgeModel) ? h('option', { value: cfg.judgeModel }, cfg.judgeModel) : null))))
        项.push(h('section', { key: 'switch', className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '自动判断与注入'),
          formRow('自动判断心情', sw('autoJudge', '自动判断心情'), '启用后，在已绑定会话结束对话回合时调用模型判断变化。关闭后停止自动判断，自然衰减仍按时间计算。'),
          formRow('上下文注入方式', h('select', { 'data-fm-input': '', 'aria-label': '心情注入方式', value: cfg.injectMode || 'event',
            onChange: e => patch({ injectMode: e.target.value }, '上下文注入方式') },
            h('option', { value: 'off' }, '关闭注入'), h('option', { value: 'label' }, '仅注入心情状态'), h('option', { value: 'event' }, '注入心情状态与变化原因')),
            '同一次状态更新最多注入一次。注入还需满足置信度、变化阈值及每日次数限制。'),
          numInput('injectConfidence', '注入置信度阈值', '判断模型返回的置信度达到此值才允许注入。低于阈值仍可更新心情和时间线。范围 0–100，默认 60。', 0, 100)))
        项.push(h('div', { key: 'num', 'data-fm-sec': '' },
          h('div', { 'data-fm-h': '' }, '数值与注入阈值'),
          numInput('moodBase', '心情基线', '自然衰减的目标值，也是重置后的心情值。范围 30–100，默认 70。', 30, 100),
          numInput('moodFloor', '判定更新下限', '模型判定更新心情时使用的最小值。范围 0–100，默认 0。自然衰减仍向心情基线收敛。', 0, 100),
          numInput('decayHalfHours', '心情偏差半衰期（小时）', '心情与基线差值减半所需时间，范围 1–168 小时，默认 12。七维情绪独立向零衰减，半衰期固定为 90 分钟。', 1, 168),
          h('div', { 'data-fm-note': '' }, '下列变化阈值控制上下文注入资格。低于阈值的有效变化仍会更新状态和时间线。'),
          numInput('sigMood', '心情显著变化阈值', '按模型返回的原始心情变化绝对值比较。范围 1–30，默认 3。已记录且未达单次阈值的小变化按原始绝对值累计，累计达到此值也可获得注入资格。实际心情变化按原始值的三分之一取整。心情值达到 85 时正向变化减半，不高于 40 时负向变化减半。', 1, 30),
          numInput('sigDim', '情绪显著变化阈值', '任一情绪维度的判定变化绝对值达到此值，即视为显著变化。范围 1–100，默认 5。当前模型输出会被限制在每维每次 ±10，设置超过 10 时无法由单次情绪变化触发。', 1, 100),
          numInput('injectPerDay', '每日注入次数上限',
            '当前实例今日已注入 ' + String((st && st.saidToday) || 0) + ' 次，共享此实例的会话合并计数。按宿主本地时间每日零点重新统计。范围 0–50，默认 6，设为 0 时停止注入。', 0, 50)))
        return h('div', { 'data-fm-pane': '' }, ...项)
      })()

      /* ── 页签 4：挂饰 ── */
      const 调整挂饰 = h('section', { className: 'fish-card mood-scale-card', 'data-fm-sec': '', 'aria-label': '调整挂饰' },
        h('h2', { 'data-fm-h': '' }, '调整挂饰'),
        h('div', { className: 'mood-charm-sliders' },
          formRow('挂饰大小', h('div', { className: 'mood-scale' },
            h('input', { type: 'range', min: 60, max: 160, step: 5, 'aria-label': '挂饰大小', value: scale, onInput: e => changeScale(e.currentTarget.value) }),
            h('output', null, scale + '%'))),
          formRow('卡片透明度', h('div', { className: 'mood-scale' },
            h('input', { type: 'range', min: 0, max: 100, step: 5, 'aria-label': '卡片透明度', value: transparency, onInput: e => changeTransparency(e.currentTarget.value) }),
            h('output', null, transparency + '%')))),
        formRow('挂饰弹出卡片', h('select', { 'data-fm-input': '', 'data-fish-select-compact': 'true', 'aria-label': '挂饰弹出卡片', value: popupMode,
          onChange: e => changePopupMode(e.target.value) },
          h('option', { value: 'mood' }, '展示今日心情'),
          h('option', { value: 'cost' }, '展示今日开销'),
          h('option', { value: 'memory' }, '随机展示记忆'))))
      const 挂饰页 = h('div', { 'data-fm-pane': '' },
        h('section', { className: 'fish-card', 'data-fm-sec': '' },
          h('h2', { 'data-fm-h': '' }, '五档心情挂饰'),
          h('p', { className: 'fish-muted' }, '每档分别配置全身像与半身像。支持 PNG、JPEG、GIF 或 WebP 图片，单张不超过 4 MB。上传成功后立即更新挂饰，图片保存在本机用户数据目录。'),
          h('input', { ref: uploadInputRef, type: 'file', hidden: true, accept: 'image/png,image/jpeg,image/gif,image/webp',
            'aria-label': '选择挂饰图片', disabled: !!busy, onChange: e => {
              const target = uploadTargetRef.current
              if (target) return uploadCharm(target.tier, target.kind, e.currentTarget)
            } }),
          h('div', { className: 'mood-charm-grid' }, ...[
            ['great', '≥ 80 欢喜', 'feiyu-great.png'], ['good', '62–79 开心', 'feiyu-good.png'], ['ok', '42–61 一般', 'feiyu.png'], ['worry', '25–41 心疼', 'feiyu-worry.png'], ['sad', '< 25 难过', 'feiyu-sad.png'],
          ].map(([tier, label, file]) => h('div', { key: tier, className: 'mood-charm-card' },
            h('strong', null, label),
            ...[['body', '全身像', st?.charmImages?.[tier], API + '/' + file], ['face', '半身像', st?.charmFaces?.[tier], API + '/face-' + tier + '.png']].map(([kind, title, image, fallback]) =>
              h('div', { key: kind, className: 'mood-charm-portrait' },
                h('div', { className: 'mood-portrait-stage' },
                  h('button', { type: 'button', className: 'mood-portrait-upload', disabled: !!busy,
                    'aria-label': '上传' + label + title, onClick: () => choosePortrait(tier, kind) },
                    h('img', { src: image?.url || fallback, alt: label + ' ' + title, onLoad: e => updatePortraitOutline(e.currentTarget) }),
                    h('svg', { className: 'mood-portrait-outline', 'aria-hidden': true, focusable: 'false' }),
                    h('span', { className: 'mood-portrait-plus', 'aria-hidden': true }, '+'))),
                h('span', null, title),
                h('div', { className: 'mood-portrait-caption' },
                  h('small', { className: 'fish-muted' }, image?.custom ? '自定义' : '默认图片'),
                  image?.custom ? h('button', { type: 'button', className: 'mood-portrait-reset', disabled: !!busy,
                    'aria-label': '恢复' + label + title + '默认图片', onClick: () => resetCharm(tier, kind) }, '恢复默认') : null),
                busy === 'upload-' + kind + '-' + tier || busy === 'reset-' + kind + '-' + tier
                  ? h('small', { role: 'status' }, busy.startsWith('reset-') ? '恢复中…' : '上传中…') : null)))))),
        调整挂饰)



      return h('div', { 'data-fm-wrap': '', className: 'fish-mood ' + (['bind', 'judge'].includes(页) ? 'mood-settings' : '') },
        historyDialog,
        !cfg.autoJudge ? h('div', { role: 'status', 'data-fm-note': '' }, '自动判断已关闭，可在「判断与注入」页面启用。')
          : !st?.mountedSessions ? h('div', { role: 'status', 'data-fm-note': '' }, '当前实例尚未挂载到已打开的会话，请检查绑定配置及目标会话状态。') : null,
        onPageChange ? null : h('div', { 'data-fm-tabs': '', role: 'tablist', 'aria-label': '心情页面' },
          页签.map(([id, 名]) => h('button', {type: 'button',
            key: id, role: 'tab', 'aria-selected': 页 === id, tabIndex: 页 === id ? 0 : -1, onKeyDown: e => { const i = 页签.findIndex(item => item[0] === id); const next = e.key === 'ArrowRight' ? (i + 1) % 页签.length : e.key === 'ArrowLeft' ? (i + 页签.length - 1) % 页签.length : e.key === 'Home' ? 0 : e.key === 'End' ? 页签.length - 1 : null; if (next !== null) { e.preventDefault(); set页(页签[next][0]); e.currentTarget.parentElement.querySelectorAll('[role=tab]')[next].focus() } }, 'data-fm-tab': '', 'data-fm-on': 页 === id ? '' : undefined,
            onClick: () => set页(id),
          }, 名))),
        页 === 'mood' ? 心情页 : null,
        页 === 'bind' ? 绑定页 : null,
        页 === 'judge' ? 判断页 : null,
        页 === 'charm' ? 挂饰页 : null,
      )
    }

    return { Section: function MoodSection(props) { return h('div', null, h('style', null, CSS), h(Panel, props)) } }
  },
})

// DSH「主动搭话」· 网页半边
//
// 只干一件事：在 **DSH 设置** 左侧栏加一项「主动搭话」，
// 把那 7 组设置全摆出来，外加两个安全的试法（演练 / 真发一次）和一份最近掷骰记录。
//
// 注意：这里**不碰会话、不发消息**，只是往宿主那几条 /dsh-speak-up/* 路由上读写。
//   真正的掷骰和 followup 都在宿主半边（lib/host.js），这样只有一份逻辑。
//
// 注意：槽位名 'settings.section' 跟 dsh-write / dsh-fish-memory 用的是同一个，
//   是在这个环境里已经跑通的路子（不确定换 DSH 版本会不会变，见 README）。

moduleLoader.load({
  id: 'dsh-speak-up',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    const React = require('react')
    const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
    const inject = ['slots']

    const B = '/dsh-speak-up'
    const get = (p) => fetch(B + p, { cache: 'no-store' }).then((r) => r.json()).catch(() => null)
    const post = (p, body) =>
      fetch(B + p, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body || {}),
      })
        .then((r) => r.json())
        .catch(() => null)

    const h = React.createElement
    const RefreshButton = typeof FishRefreshButton === 'function' ? FishRefreshButton : 'button'

    // 样式贴着主题变量走，换皮肤/换深浅色都跟着变（照 dsh-write 的做法）
    const S = {
      wrap: { display: 'grid', gap: 24, padding: '0 0 24px', fontSize: 'var(--fish-body)', lineHeight: 1.75, minWidth: 0 },
      h: { fontFamily: 'var(--fish-title)', fontSize: 20, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.5 },
      dim: { color: 'var(--fish-muted)', fontSize: 'var(--fish-small)' },
      card: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius)', padding: '24px', marginBottom: 0, display: 'grid', gap: 16, minWidth: 0, background: 'var(--fish-panel)', boxShadow: 'var(--fish-shadow)' },
      row: { display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' },
      lab: { flex: '0 1 200px', paddingTop: 8, fontSize: 'var(--fish-label)', fontWeight: 550 },
      ctl: { flex: '1 1 260px', minWidth: 0 },
      hint: { color: 'var(--fish-muted)', fontSize: 'var(--fish-small)', marginTop: 8, lineHeight: 1.75 },
      input: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: '100%', maxWidth: '100%', boxSizing: 'border-box' },
      small: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: 136, maxWidth: '100%', boxSizing: 'border-box' },
      wide: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', width: '100%', boxSizing: 'border-box' },
      ta: { border: '1px solid var(--fish-control-border)', borderRadius: 'var(--fish-radius-sm)', padding: '12px', background: 'var(--fish-surface)', color: 'var(--fish-text)', fontSize: 'var(--fish-body)', width: '100%', minHeight: 112, boxSizing: 'border-box', lineHeight: 1.75, fontFamily: 'inherit', resize: 'vertical' },
      ok: { color: 'var(--fish-success)', fontSize: 'var(--fish-small)' },
      warn: { color: 'var(--fish-warning)', border: '1px solid var(--fish-border)', background: 'var(--fish-soft)', borderRadius: 'var(--fish-radius-sm)', padding: 16, marginBottom: 16 },
      已同步: { margin: '8px 0 20px', fontSize: 'var(--fish-small)', color: 'var(--fish-success)' },
      未保存: { margin: '8px 0 20px', fontSize: 'var(--fish-small)', color: 'var(--fish-warning)', fontWeight: 550 },
      btn: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 16px', background: 'var(--fish-control-fill)', color: 'var(--fish-text)', fontSize: 'var(--fish-label)', cursor: 'pointer' },
      btnOn: { border: '1px solid var(--fish-action)', borderRadius: 'var(--fish-radius-sm)', padding: '8px 16px', background: 'var(--fish-action)', color: 'var(--fish-on-accent)', fontSize: 'var(--fish-label)', cursor: 'pointer' },
      tabBar: { display: 'flex', gap: 8, overflowX: 'auto', margin: '16px 0 24px', paddingBottom: 16, borderBottom: '1px solid var(--fish-border)' },
      stack: { display: 'grid', gap: 20 },
      grid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 20, alignItems: 'start' },
      group: { borderTop: '1px solid var(--fish-border)', padding: '20px 0' },
      summary: { fontWeight: 600, fontSize: 16, cursor: 'pointer', padding: '8px 0 16px' },
      日志行: { fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 'var(--fish-small)', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: '8px 0', borderBottom: '1px solid var(--fish-line)' },
      表头: {}, 表格行: {}, 空间表头: {}, 空间行: {},
      表头字: { fontSize: 'var(--fish-small)', color: 'var(--fish-muted)' },
      已勾: { border: '1px solid var(--fish-border)', background: 'var(--fish-soft)', borderRadius: 'var(--fish-radius-sm)', padding: '12px 16px', fontSize: 'var(--fish-small)' },
      清单: { border: '1px solid var(--fish-border)', borderRadius: 'var(--fish-radius-sm)', marginTop: 12, maxHeight: 320, overflowY: 'auto' },
      会话行: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--fish-line)' },
      会话行勾上: { background: 'var(--fish-accent-soft)', fontWeight: 550 },
      tag: { display: 'inline-block', border: '1px solid var(--fish-border)', borderRadius: 20, padding: '2px 8px', fontSize: 'var(--fish-small)', marginRight: 8 }
    }

    // ---------- 小控件 ----------

    const 提示 = (文本) => h('div', { style: S.hint }, 文本)
    const 行 = (标签, 控件, 说明) =>
      h(
        'div',
        { className: 'fish-form-row', style: S.row },
        h('div', { className: 'fish-form-label', style: S.lab }, 标签),
        h('div', { className: 'fish-control', style: S.ctl }, (['input', 'select', 'textarea', Switch].includes(控件?.type) ? React.cloneElement(控件, { 'aria-label': 标签 }) : 控件), 说明 ? 提示(说明) : null),
      )
    const 按钮 = (文字, onClick, 亮, 关) =>
      h(
        'button',
        { type: 'button', className: 亮 ? 'fish-primary' : '', style: 亮 ? S.btnOn : S.btn, onClick, disabled: !!关, title: 文字 },
        文字,
      )
    const 勾 = (值, onChange) =>
      h(Switch, {'aria-label': '设置值',  type: 'checkbox', role: 'switch', checked: !!值, onChange: (e) => onChange(e.target.checked) })
    const 数 = (值, onChange, 步, 标签 = '设置值') =>
      h('input', {'aria-label': 标签,
        type: 'number',
        value: 值 === undefined || 值 === null ? '' : 值,
        step: 步 || 1,
        style: S.small,
        onChange: (e) => onChange(e.target.value),
      })
    /** 会话 id 的后 8 位 —— 前面那截（session- 和 uuid 开头）全都一样，只有尾巴分得出谁是谁。 */
    const 短id = (id) => {
      const s = String(id)
      return s.length <= 8 ? s : s.slice(-8)
    }

    /** 标题拿不到就明说「（还没起名）」，**绝不留空白**（空白会让人以为坏了）。 */
    const 题 = (s) => (s && typeof s.标题 === 'string' && s.标题.trim() !== '' ? s.标题 : '（未命名）')

    /** 逗号/空格/顿号都能当分隔（照抄老版输入框的行为）。 */
    const 拆id = (文) => String(文 || '').split(/[\s,;，、]+/).filter((x) => x !== '')

    // ---------- 设置页 ----------

    function Section({ guard, notify } = {}) {
      const [态, 设态] = React.useState(null)
      const 告知 = (text, options) => { if (typeof notify === 'function') notify(text, options) }
      const [忙, 设忙] = React.useState(false)
      // 次要路径（手填 id）的草稿：null = 没动过，直接显示配置里那份
      const [手填, 设手填] = React.useState(null)
      // 「改了但还没按保存」——填了不按保存等于没填，这个标志就是让这件事写在脸上
      const [脏, 设脏] = React.useState(false)
      const [同步话, 设同步话] = React.useState('')
      const handRef = React.useRef(手填)
      handRef.current = 手填
      const saveRef = React.useRef(null)
      const autosave = typeof useFishAutosave === 'function' ? useFishAutosave(() => saveRef.current?.()) : {}
      const queueRef = React.useRef(Promise.resolve())
      const draftRef = React.useRef({})

      React.useEffect(() => {
        if (!guard) return
        guard.current = { dirty: 脏, save: () => saveRef.current?.() }
        return () => { if (guard) guard.current = { dirty: false, save: null } }
      }, [脏, guard])

      const 拉 = React.useCallback(
        () => get('/state').then((r) => { if (r && r.ok) 设态(旧 => 旧 ? { ...r, 配置: { ...r.配置, ...draftRef.current } } : r); else 告知('无法读取宿主状态，请检查插件加载情况。', { holdMs: 6000 }) }),
        [],
      )

      React.useEffect(() => { 拉() }, [拉])

      if (!态 || !态.配置) {
        return h('div', { className: 'fish-module fish-speak', style: S.wrap, ...autosave }, h('div', { className: 'fish-section-title', style: S.h }, '主动搭话'), h('div', { style: S.dim }, '读取中…'))
      }

      const 配置 = 态.配置
      /** 改「要点保存」的字段（数字/文案/开关）→ 置脏。 */

      const 改 = (k, v) => {
        设同步话('')
        draftRef.current[k] = v
        设态((旧) => ({ ...旧, 配置: { ...旧.配置, [k]: v } }))
        设脏(true)
      }

      /** 勾上的会话列表（组件里以本地状态为准，不等刷新，点一下立刻变色）。 */
      const 目标们 = Array.isArray(配置.目标会话) ? 配置.目标会话 : []
      // ⭐ 2026-10-23：会话 id 有两种写法（`xxx` / `session-xxx`）。host 那边现在统一存带前缀的，
      //    这里比较也要先洗一遍 —— 否则会出现「面板说已勾 1 个，框却是空的 / 点一下变 2 / 取消不掉」。
      const 会话键 = (v) => {
        const s = String(v == null ? '' : v).trim()
        return s.startsWith('session-') ? s.slice('session-'.length) : s
      }
      const 已勾 = (id) => 目标们.map(会话键).indexOf(会话键(id)) >= 0

      /**
       * 勾上/取消 → **立刻自动保存**（她原话：「有打勾不就完了嘛」）。
       * 注意：这是踩过坑改的：最早那版是「填进输入框 → 再按下面的『保存设置』」，
       *   结果她填了没按保存（按钮在另一张卡片里、页面上也没有任何"还没保存"的提示），
       *   host 一直报「还没配目标会话」。勾选这类核心设置就该点一下就落盘。
       * 注意：自动存只把「目标会话」这一个补丁发上去（host 的 /save 是合并语义），
       *   所以不会覆盖她在别的字段里还没保存的改动。
       */
      const 切换 = (id, 勾上) => {
        设手填(null)
        设脏(Object.keys(draftRef.current).length > 0)
        const 键 = 会话键(id)
        const 下一个 = 勾上
          ? (目标们.map(会话键).indexOf(键) >= 0 ? 目标们 : [...目标们, String(id)])
          : 目标们.filter((x) => 会话键(x) !== 键)
        设态((旧) => ({ ...旧, 配置: { ...旧.配置, 目标会话: 下一个 } }))
        自动存({ 目标会话: 下一个 })
      }

      const 自动存 = (补丁) => {
        const 回滚 = Object.fromEntries(Object.keys(补丁).map(key => [key, 配置[key]]))
        设忙(true)
        设同步话('保存中…')
        const task = queueRef.current.then(async () => {
          const r = await post('/save', 补丁)
          if (r && r.ok) {
            设态(旧 => ({ ...r, 配置: { ...r.配置, ...draftRef.current } }))
            设同步话('已保存')
            告知(r.说 || '设置已保存', { tone: 'success' })
          } else {
            设同步话('保存失败，请重试')
            告知(r?.说 || '保存失败，设置未生效', { holdMs: 6000 })
            设态(旧 => ({ ...旧, 配置: { ...旧.配置, ...回滚, ...draftRef.current } }))
            await 拉()
          }
        }).finally(() => 设忙(false))
        queueRef.current = task.catch(() => {})
        return task
      }

      const 改开关 = (k, v) => {
        设态(旧 => ({ ...旧, 配置: { ...旧.配置, [k]: v } }))
        return 自动存({ [k]: v })
      }

      const 存 = async () => {
        设忙(true)
        await queueRef.current
        // 手填框里还有没提交的草稿 → 存的时候一起带上
        const 手填快照 = handRef.current
        const 要存 = { ...draftRef.current, ...(手填快照 === null ? {} : { 目标会话: 拆id(手填快照) }) }
        const r = await post('/save', 要存)
        if (r && r.ok) {
          const 剩余草稿 = { ...draftRef.current }
          for (const key of Object.keys(要存)) {
            if (剩余草稿[key] === 要存[key]) delete 剩余草稿[key]
          }
          draftRef.current = 剩余草稿
          设态({ ...r, 配置: { ...r.配置, ...剩余草稿 } })
          const 有新手填 = handRef.current !== 手填快照
          if (!有新手填) 设手填(null)
          设脏(Object.keys(剩余草稿).length > 0 || 有新手填)
          设同步话('已保存')
          告知(r.说 || '已保存', { tone: 'success' })
          设忙(false)
          return true
        }
        告知((r && r.说) || '保存失败', { holdMs: 6000 })
        设同步话('保存失败 ✗')
        设忙(false)
        return false
      }
      saveRef.current = () => 脏 || 手填 !== null ? 存() : true

      const 掷 = async (模式) => {
        if (脏 && !await 存()) return
        await queueRef.current
        设忙(true)
        const r = await post('/roll', { 模式 })
        if (r && r.ok) 设态((旧) => ({ ...旧, 日志: r.日志 }))
        告知((r && r.说) || '执行完成')
        设忙(false)
      }

      const 新建小屋 = async () => {
        if (!window.confirm('新建会话并加入目标列表？')) return
        设忙(true)
        const r = await post('/new-session', { 设为目标: true })
        if (r && r.ok) {
          设手填(null)
          设脏(Object.keys(draftRef.current).length > 0)
          // 同样只刷服务端那份，别把她在别的字段里还没保存的改动抹掉
          设态((旧) => ({
            ...旧,
            配置: { ...旧.配置, 目标会话: r.配置 ? r.配置.目标会话 : 旧.配置.目标会话 },
            日志: r.日志,
            目标情况: r.目标情况,
            目标活着: r.目标活着,
            活着的会话: r.活着的会话,
          }))
        }
        告知((r && r.说) || '做完了')
        设忙(false)
      }

      const 会话们 = Array.isArray(态.活着的会话) ? 态.活着的会话 : []
      const 日志 = Array.isArray(态.日志) ? 态.日志 : []
      const 目标情况 = Array.isArray(态.目标情况) ? 态.目标情况 : []
      const 目标活着数 = 目标情况.filter((x) => x.活着).length
      const 手填文本 = 手填 === null ? 目标们.join(', ') : 手填

      /** 清单里的一行：`☐ 标题 · …后8位 · 状态`，整行点一下就勾/取消（勾选立刻自动保存）。 */
      const 会话行 = (s) =>
        h(
          'label',
          {
            key: s.id,
            style: { ...S.会话行, ...(已勾(s.id) ? S.会话行勾上 : null) },
            title:
              String(s.id) +
              (s.标题来源 ? '｜标题来源：' + String(s.标题来源) : '') +
              (s.有agent ? '' : '（会话未打开，触发时将跳过）') +
              (s.归档 ? '（会话已归档，请移出目标列表）' : ''),
          },
          h('input', {'aria-label': 题(s),
            type: 'checkbox',
            checked: 已勾(s.id),
            disabled: 忙,
            onChange: (e) => 切换(s.id, e.target.checked),
          }),
          h(
            'span',
            { style: { marginLeft: 8, ...(s.有agent ? null : S.dim) } },
            题(s),
          ),
          h('span', { style: { ...S.dim, marginLeft: 8, whiteSpace: 'nowrap' } }, '…' + 短id(s.id) + ' · ' + String(s.状态 || '?')),
        )

      return h(
        'div',
        { className: 'fish-module fish-speak', style: S.wrap, ...autosave },

        h('div', { className: 'fish-section-title', style: S.h }, '主动搭话'),
        h(
          'div',
          { style: S.dim },
          '按设定间隔执行本地随机检测，' +
            '命中后向目标会话提交触发文案，沿用其角色、历史、工具与记忆。',
        ),

        // —— 总开关 + 试运行 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '开关'),
          行('总开关', 勾(配置.总开关, (v) => 改开关('总开关', v)), '即时保存。关闭后停止投递，并拦截尚未发出的搭话 QQ 消息。'),
          行(
            '试运行',
            React.cloneElement(勾(配置.试运行, (v) => 改开关('试运行', v)), { disabled: 忙 }),
            '默认关闭。启用后仅记录触发结果，不发送消息。',
          ),
        ),

        // —— 骰子 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '触发频率与安静时段'),
          h('div', { style: S.dim },
            '按 0–100 随机值判断。触发阈值 = 时段基础值 × 时机因子 + 累积加成。'),
          行('检测间隔（分钟）', 数(配置.间隔分钟, (v) => 改('间隔分钟', v)), '范围 1–1440 分钟，默认 30。失焦保存，下一轮生效。'),
          行(
            '搭话冷却（分钟）',
            数(配置.搭话冷却分钟, (v) => 改('搭话冷却分钟', v)),
            '实际回复后的冷却时间，默认 20 分钟。' +
              '未产生回复不计入冷却。0 为禁用冷却。' +
              '手动操作不受冷却限制。',
          ),
          行(
            '未命中加成（百分点）',
            数(配置.没中加成, (v) => 改('没中加成', v)),
            '每次未命中后增加的百分点，默认 10。0 为禁用。',
          ),
          行(
            '加成上限（百分点）',
            数(配置.加成上限, (v) => 改('加成上限', v)),
            '累积加成上限，默认 40。',
          ),
          h('div', { style: S.dim },
            '命中后清零（含试运行），连续未命中时累加至上限。',
          ),
          h('div', { style: { ...S.dim, marginTop: 2 } },
            '仅影响定时检测，手动演练与发送不改变累积次数。',
          ),
          h('div', { style: { ...S.dim, marginTop: 2 } },
            '未命中次数仅保存在内存，重启 DSH 后清零。',
          ),
          行(
            '安静时段（起 / 止，小时）',
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } }, React.cloneElement(数(配置.安静起, (v) => 改('安静起', v)), { 'aria-label': '安静开始小时', min: 0, max: 23 }), h('span', { style: S.dim }, ' 点 ~ '), React.cloneElement(数(配置.安静止, (v) => 改('安静止', v)), { 'aria-label': '安静结束小时', min: 0, max: 23 }), h('span', { style: S.dim }, ' 点')),
            '使用配置时区，留空采用宿主时区。默认 1:00–8:00 暂停检测，含起点、不含终点，支持跨午夜。',
          ),
          // 注意：这条她特意提过两次，所以从上面那句里拎出来单独成一行、用红字（不新造颜色，复用 S.未保存）
          h('div', { style: S.未保存 }, '起止时间相同表示禁用安静时段。'),
        ),

        // —— 时机因子 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '对话间隔因子'),
          行(
            '短间隔：阈值 ×0.15',
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } }, 数(配置.近阈值分钟, (v) => 改('近阈值分钟', v), 1, '近阈值分钟'), h('span', { style: S.dim }, ' 分钟内 → ×'), 数(配置.近因子, (v) => 改('近因子', v), 0.05, '近因子')),
            '距上次回复不足此时长时降低触发概率，默认 20 分钟、倍率 0.15。',
          ),
          行(
            '长间隔：阈值 ×1.5',
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } }, 数(配置.远阈值分钟, (v) => 改('远阈值分钟', v), 1, '远阈值分钟'), h('span', { style: S.dim }, ' 分钟以上 → ×'), 数(配置.远因子, (v) => 改('远因子', v), 0.1, '远因子')),
            '距上次回复超过此时长时提高触发概率，默认 360 分钟、倍率 1.5。',
          ),
          h('div', { style: S.dim }, '其余间隔倍率为 1，最终阈值限制在 0–100。'),
        ),

        // —— 峰谷分时（贵的时候少开口，便宜的时候多开口）——
        // 注意：时段是**写死的**（不给格子填），这里只有两个命中线数字 —— 她的要求。
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '峰谷时段阈值'),
          h('div', { style: S.dim }, '时段固定，分别设置基础触发阈值。'),
          行(
            '峰时命中线（%）',
            数(配置.峰时命中线, (v) => 改('峰时命中线', v)),
            '随机值低于阈值时触发。' +
              '工作日 9:00–12:00、14:00–18:00 的基础阈值，默认 20。',
          ),
          行(
            '谷时命中线（%）',
            数(配置.谷时命中线, (v) => 改('谷时命中线', v)),
            '其余时段及周末的基础阈值，默认 60。',
          ),
          行(
            '峰谷与安静时段时区',
            h('input', {'aria-label': '峰谷时区',
              style: S.input,
              placeholder: '留空 = 本机时区；北京填 Asia/Shanghai',
              value: String(配置.峰谷时区 || ''),
              onChange: (e) => 改('峰谷时区', e.target.value),
            }),
            '按指定时区计算时段，北京时间使用 Asia/Shanghai。' +
              '支持 IANA 时区标识，无效值回退至宿主时区。',
          ),
          h('div', { style: { ...S.dim, marginTop: 4 } },
            '最终阈值 = 时段基础值 × 时机因子 + 累积加成，范围 0–100。',
          ),
          h('div', { style: S.未保存 }, '两个阈值相同表示全天使用同一基础阈值。'),
          h('div', { style: S.未保存 },
            '安静时段优先，当前为 ' +
              String(配置.安静起) + '~' + String(配置.安静止) +
              ' 点，此时暂停检测。',
          ),
        ),

        // —— 目标会话（勾选清单；手填只是次要路径）——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '目标会话'),
          h('div', { style: S.dim }, '可选择多个目标。每次命中后，从已打开且空闲的会话中随机选择一个。'),
          h('div', { style: { ...S.dim, marginTop: 2, fontWeight: 600 } }, '选择后立即保存'),
          h('div', { style: { marginTop: 4 } },
            目标们.length
              ? h('div', { style: S.已勾 },
                  '已勾 ' + 目标们.length + ' 个' +
                    (目标情况.length
                      ? '：' + 目标情况.map((x) => (x.标题 ? x.标题 : '…' + 短id(x.id)) + (x.活着 ? '' : '（未打开）')).join('、')
                      : '') +
                    (目标情况.length ? '。其中 ' + 目标活着数 + ' 个已打开' + (目标活着数 === 0 ? '，触发时跳过，请先打开会话' : '') : ''),
                )
              : h('div', { style: { ...S.dim, color: 'var(--fish-danger)' } }, '未选择目标会话，命中后不发送。'),
          ),

          会话们.length
            ? h('div', { style: { marginTop: 8 } },
                h('div', { style: S.dim }, '绑定工作区内的会话，选择后立即保存。'),
                h('div', { style: S.清单 }, 会话们.map(会话行)),
                h('div', { style: { ...S.dim, marginTop: 4 } },
                  '已归档或工作区外的会话不列出，也不会触发搭话。旧目标可在手填框中移除。' +
                    '未命名会话显示短 ID；' +
                    '未打开的会话在触发时跳过。',
                ),
              )
            : h('div', { style: { ...S.dim, marginTop: 8 } }, '暂无可选会话。绑定 QQ 工作区后刷新清单。'),

          h('div', { className: 'fish-actions' },
            h(RefreshButton, { type: 'button', label: '刷新清单', title: '刷新清单', disabled: 忙, onClick: 拉 }, '刷新清单'),
            按钮('新建并选中会话', 新建小屋, false, 忙 || !态.工作区),
          ),

          // 次要路径：手填 / 粘贴 id（她要求「不再是主路径」，但留着）
          h('div', { style: { marginTop: 10, borderTop: '1px solid var(--dsw-alias-border-l2)', paddingTop: 8 } },
            h('div', { style: S.dim }, '手动填写会话 ID，以逗号分隔，失焦后保存。'),
            h('div', { style: { marginTop: 4 } },
              h('input', {'aria-label': 'session-xxxxxxxx-…, session-yyyyyyyy-…',
                type: 'text',
                style: S.input,
                value: 手填文本,
                placeholder: 'session-xxxxxxxx-…, session-yyyyyyyy-…',
                onChange: (e) => { 设手填(e.target.value); 设脏(true); 设同步话('') },
              }),
            ),
            h('div', { style: { marginTop: 6 } }, null),
          ),
        ),

        // —— 文案 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '触发文案'),
          行(
            '触发文案',
            h('textarea', {'aria-label': '触发文案',
              style: S.ta,
              value: 配置.触发文案 === undefined ? '' : String(配置.触发文案),
              onChange: (e) => 改('触发文案', e.target.value),
            }),
            '填写 AI 第一人称文案。系统将自动标记为主动意图，无需补充来源说明。',
          ),
        ),

        // —— 角色（做不到的地方，老实写在这儿）——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '触发消息的角色'),
          行(
            '角色',
            h('select', {'aria-label': '角色',
              style: S.input,
              value: 配置.角色,
              onChange: (e) => 改('角色', e.target.value),
            },
              h('option', { value: 'user' }, 'user（当前支持）'),
              h('option', { value: 'developer' }, 'developer（当前不支持）'),
            ),
            '选择 developer 时拒绝发送并记录原因，详见 README。',
          ),
        ),

        // —— 动作 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '手动操作'),
          h('div', { className: 'fish-actions' },
            null,
            按钮('演练一次（仅预览）', () => 掷('演练'), false, 忙),
            按钮('发送一次（跳过等待）', () => 掷('真发'), false, 忙),
            h(RefreshButton, { type: 'button', label: '刷新', title: '刷新', disabled: 忙, onClick: 拉 }, '刷新'),
          ),
          h('div', { style: { marginTop: 6 } },
            h('div', { style: S.dim },
              '数字、时区、触发文案和角色在输入框失焦后自动保存。'),
            h('div', { style: S.dim },
              '“演练一次”跳过时段、概率和因子，仅预览结果。' +
                '“发送一次”跳过等待、概率与试运行，仍受总开关、安静时段和工作区限制，执行前保存草稿。'),
          ),
        ),

        // —— 记录 ——
        h('div', { style: S.card },
          h('div', { style: { ...S.h, margin: '0 0 8px' } }, '最近 ' + 日志.length + ' 条记录（新的在最下面）'),
          h('div', { style: S.dim }, '每轮检测均记录结果，包括未命中。'),
          h('div', { style: { marginTop: 6, maxHeight: 260, overflowY: 'auto' } },
            日志.length === 0
              ? h('div', { style: S.dim }, '暂无运行记录，启用后可在这里查看每次判断。')
              : 日志.map((条, i) => h('div', { key: i, style: S.日志行 }, 条.时间 + '　' + 条.文本)),
          ),
        ),

        h('div', { style: S.dim },
          '随机检测不调用模型，仅实际发送后消耗模型额度。',
        ),

        h('details', { className: 'fish-diagnostics' }, h('summary', null, '诊断信息'),
          h('p', null, '模块版本 ' + String(态.版本 || '?')),
          h('p', null, '配置文件：' + String(态.配置文件 || '未知'))),
      )
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      if (slots === undefined) return
      slots.inject('settings.section', () =>
        slots.register(
          { name: 'settings.section', id: 'speak-up', order: 53, label: () => '主动搭话' },
          Section,
        ),
      )
    }

    exports.Section = Section
    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})

const META = {"name":"dsh-big-fish-aio","version":"1.0.0","upstreamCompatibility":[{"name":"通到 QQ","author":"Yuuyuko-uu","url":"https://github.com/Yuuyuko-uu/dsh-qq-link","version":"1.5.1","commit":"fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb","modulePath":"modules/qq"},{"name":"鱼的记忆","author":"Yuuyuko-uu","url":"https://github.com/Yuuyuko-uu/dsh-fish-memory","version":"1.5.2","commit":"5124cc1fa5a3149e8a68cf1d858e24b5bf2a2eea","modulePath":"modules/memory"},{"name":"鱼的心情","author":"Yuuyuko-uu","url":"https://github.com/Yuuyuko-uu/dsh-feiyu-mood","version":"0.9.0","commit":"02fddcaae0763651ecd65af5f644fe61f19de4bd","modulePath":"modules/mood"},{"name":"主动搭话","author":"Yuuyuko-uu","url":"https://github.com/Yuuyuko-uu/dsh-speak-up","version":"0.3.0","commit":"e3bc6362208c693bb833ecf463ec6a20df4b6419","modulePath":"modules/speak"}]};
const FISH_LOG = { pending: null, focus: null, listeners: new Set() }
function fishOpenUpdateLog(target) {
  if (!target?.ok) return
  if (typeof document !== 'undefined' && !document.activeElement?.closest('dialog')) FISH_LOG.focus = document.activeElement
  FISH_LOG.pending = { target }
  FISH_LOG.listeners.forEach(listener => listener(FISH_LOG.pending))
}
const fishUpdateTarget = value => value?.targetId || (value?.ok ? [value.channel, value.channel === 'beta' ? '' : value.latest, value.latestCommit || ''].join(':') : null)
const fishUpdateLabel = value => value?.channel === 'beta' ? String(value.latestCommit || '').slice(0, 8) || '未知提交' : 'v' + (value?.latest || '未知')

function fishInstalledLogTarget(info) {
  const version = info.packageVersion || info.version || META.version
  const channel = info.installedChannel || info.channel || 'github'
  return { ok: true, channel, current: version, latest: version, releaseId: 'v' + version,
    latestCommit: info.installedCommit || null, targetId: [channel, channel === 'beta' ? '' : version, info.installedCommit || ''].join(':') }
}
async function fishViewInstalledLog() {
  const info = await request('/dsh-big-fish-aio/version')
  fishOpenUpdateLog(fishInstalledLogTarget(info))
}
function fishAwaitUpdateLog(value) {
  try {
    const storage = window.sessionStorage
    if (value === true) storage?.setItem('big-fish:await-update-log', String(Date.now()))
    if (value === false) storage?.removeItem('big-fish:await-update-log')
    const at = Number(storage?.getItem('big-fish:await-update-log'))
    return at > 0 && Date.now() - at < 65000
  } catch { return false }
}

async function fishInstallUpdate(update, { notify = fishNotify, onVersionInfo } = {}) {
  const channel = update.channel
  fishSetInstallOutcome('idle')
  let latest
  try { latest = await request('/dsh-big-fish-aio/update?channel=' + channel + '&refresh=1') }
  catch (error) { fishSetInstallOutcome('failure'); throw error }
  if (fishUpdateTarget(latest) !== fishUpdateTarget(update)) {
    fishSetUpdateResult(latest)
    notify('安装目标已变化，已刷新版本，请再次点击立即更新确认。')
    return false
  }
  if (latest.switchRequired && !await fishAskConfirm({ title: '切换项目拉取方式？', description: '是否切换项目拉取方式，可能会因为网络问题拉取失败', confirmText: '切换并更新' })) return false
  const operationId = 'update-' + Date.now() + '-' + Math.random().toString(36).slice(2)
  const notice = notify('正在检查整合包更新…', { progress: 0 })
  let monitoring = true, progressTimer
  const poll = async () => {
    try {
      const status = await request('/dsh-big-fish-aio/install-status')
      if (monitoring && status.operationId === operationId) notice?.update({ text: status.message, progress: status.progress })
    } catch {}
    if (monitoring) progressTimer = setTimeout(poll, 500)
  }
  fishAwaitUpdateLog(true)
  标记更新后重开()
  try {
    const installation = request('/dsh-big-fish-aio/install?channel=' + channel, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ confirmSourceChange: true, operationId, expectedTarget: fishUpdateTarget(latest) }) })
    void poll()
    await installation
    fishSetInstallOutcome('success')
    notice?.update({ text: '安装已完成，正在重载大肥鱼页面。', progress: 100, tone: 'success' })
    fishSetUpdateResult({ ...latest, installedChannel: channel, hasUpdate: false, commitUpdate: false, sourceChanged: false, switchRequired: false })
    try { onVersionInfo?.(await request('/dsh-big-fish-aio/version')) } catch {}
    return true
  } catch (error) {
    fishAwaitUpdateLog(false)
    清除更新后重开()
    notice?.update({ text: error.message, progress: undefined })
    if (error.data?.targetChanged) { fishSetUpdateResult(error.data.update); notify('安装目标已变化，已刷新版本，请再次点击立即更新确认。'); return false }
    fishSetInstallOutcome('failure')
    throw error
  } finally { monitoring = false; clearTimeout(progressTimer) }
}

function UpdateLogHost({ readiness } = {}) {
  const [opened, setOpened] = React.useState(null)
  const active = React.useRef(null)
  React.useEffect(() => {
    let pending = FISH_LOG.pending
    const pump = () => {
      if (!pending || readiness?.getSnapshot?.()?.syncing || document.visibilityState === 'hidden' || document.querySelector('dialog[open], [aria-modal="true"]')) return
      active.current = pending.target.channel; setOpened(pending); pending = null; FISH_LOG.pending = null
    }
    const receive = value => {
      if (active.current === value.target.channel) { FISH_LOG.pending = null; return }
      pending = value; pump()
    }
    FISH_LOG.listeners.add(receive)
    const unsubscribe = readiness?.subscribe?.(pump)
    const observer = new MutationObserver(pump)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] })
    document.addEventListener('visibilitychange', pump)
    pump()
    return () => { FISH_LOG.listeners.delete(receive); unsubscribe?.(); observer.disconnect(); document.removeEventListener('visibilitychange', pump) }
  }, [readiness])
  return opened ? h(UpdateLog, { initial: opened, onClose: () => {
    active.current = null; setOpened(null)
    const previous = FISH_LOG.focus
    requestAnimationFrame(() => { if (previous?.isConnected) previous.focus({ preventScroll: true }) })
  } }) : null
}

function UpdateLog({ initial, onClose }) {
  const [target, setTarget] = React.useState(initial.target)
  const [releaseId, setReleaseId] = React.useState(initial.target.releaseId || null)
  const [data, setData] = React.useState(null), [error, setError] = React.useState(''), [loading, setLoading] = React.useState(false)
  const [history, setHistory] = React.useState([]), [historyError, setHistoryError] = React.useState('')
  const [category, setCategory] = React.useState(null), [retry, setRetry] = React.useState(0)
  const selection = React.useRef(0)
  const content = React.useRef(null)
  React.useEffect(() => { content.current?.scrollTo(0, 0) }, [releaseId, category])
  React.useEffect(() => {
    const receive = value => {
      if (value.target.channel !== target.channel) return
      setTarget(value.target); setReleaseId(value.target.releaseId); setRetry(value => value + 1)
    }
    FISH_LOG.listeners.add(receive)
    return () => FISH_LOG.listeners.delete(receive)
  }, [target.channel, fishUpdateTarget(target)])
  React.useEffect(() => {
    const controller = new AbortController(), id = ++selection.current
    setLoading(true); setError(''); setData(null)
    request('/dsh-big-fish-aio/changelog?channel=' + target.channel + (releaseId ? '&releaseId=' + encodeURIComponent(releaseId) : '') + (retry ? '&refresh=1' : ''), { signal: controller.signal })
      .then(result => {
        if (controller.signal.aborted || id !== selection.current) return
        if (result.status !== 'ready') { setError(result.message || '更新日志暂不可用'); return }
        setData(result.changelog); setCategory(result.changelog.sections.find(section => section.items.length)?.id || null)
      }).catch(error => { if (!controller.signal.aborted && id === selection.current) setError('更新日志读取失败：' + error.message) })
      .finally(() => { if (!controller.signal.aborted && id === selection.current) setLoading(false) })
    return () => controller.abort()
  }, [target.channel, releaseId, retry])
  React.useEffect(() => {
    const controller = new AbortController()
    setHistoryError('')
    request('/dsh-big-fish-aio/releases?channel=' + target.channel + (retry ? '&refresh=1' : ''), { signal: controller.signal })
      .then(result => { if (!controller.signal.aborted) { setHistory(result.releases || []); if (result.status !== 'ready') setHistoryError(result.message) } })
      .catch(error => { if (!controller.signal.aborted) setHistoryError(error.message) })
    return () => controller.abort()
  }, [target.channel, retry])
  const close = () => {
    const targetId = fishUpdateTarget(target)
    FISH_UPDATE.dismissed.add(targetId)
    onClose()
    void request('/dsh-big-fish-aio/reminder', { method: 'POST', headers: { 'content-type': 'application/json' },
      signal: AbortSignal.timeout(10000), body: JSON.stringify({ targetId }) })
      .catch(error => fishNotify('关闭提醒的状态暂未保存：' + error.message))
  }
  const sections = data?.sections.filter(section => section.items.length) || []
  const active = sections.find(section => section.id === category)
  const offset = sections.slice(0, sections.indexOf(active)).reduce((sum, section) => sum + section.items.length, 0)
  const sources = { mirror: '国内镜像', github: 'GitHub 正式版', beta: '私有内测' }
  const currentRelease = target.releaseId || 'v' + target.latest
  return h('div', { className: 'big-fish fish-release-host' }, h(FishModal, { className: 'fish-modal', onCancel: event => { event.preventDefault(); void close() } },
    h('section', { className: 'fish-modal-card fish-release-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-release-title',
      onKeyDown: event => {
        if (event.key === 'Escape') { event.preventDefault(); void close(); return }
        if (event.key !== 'Tab') return
        const controls = Array.from(event.currentTarget.querySelectorAll('button, a[href], input, select, textarea, [tabindex]'))
          .filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length)
        const edge = event.shiftKey ? controls[0] : controls.at(-1)
        if (event.target === edge) { event.preventDefault(); (event.shiftKey ? controls.at(-1) : controls[0])?.focus() }
      } },
      h('header', { className: 'fish-release-head' },
        h('div', null, h('h2', { id: 'fish-release-title' }, '更新日志'), h('span', { className: 'fish-muted' }, '版本说明')),
        h('button', { type: 'button', className: 'fish-modal-close', onClick: close, 'aria-label': '关闭更新日志', autoFocus: true }, '×')),
      h('div', { className: 'fish-release-columns' },
        h('aside', { className: 'fish-release-nav' },
          h('div', { className: 'fish-release-version' },
            h('strong', null, data?.version ? 'v' + data.version : releaseId || currentRelease),
            data?.publishedAt ? (Number.isFinite(Date.parse(data.publishedAt)) ? h('time', { dateTime: data.publishedAt }, new Date(data.publishedAt).toLocaleDateString()) : h('span', { className: 'fish-muted' }, '待发布草稿')) : null),
          h('div', { className: 'fish-release-categories' },
            h('span', { className: 'fish-kicker' }, '更新分类'),
            h('nav', { 'aria-label': '更新日志分类' }, ...sections.map(section => h('button', { type: 'button', key: section.id, className: 'fish-button fish-release-category', 'aria-pressed': category === section.id, onClick: () => setCategory(section.id) },
              h('span', null, section.title), h('span', { className: 'fish-release-count' }, String(section.items.length).padStart(2, '0')))))),
          h('div', { className: 'fish-release-history' },
            h('label', { htmlFor: 'fish-release-version' }, '历史版本'),
            h(FishSelect, { id: 'fish-release-version', 'aria-label': '历史版本', value: releaseId || currentRelease, onChange: event => setReleaseId(event.target.value) },
              h('option', { value: currentRelease }, currentRelease + ' · 当前安装'),
              ...history.filter(item => item.releaseId !== currentRelease).map(item => h('option', { key: item.releaseId, value: item.releaseId }, item.title))),
            historyError ? h('div', { className: 'fish-release-history-error', role: 'status' }, h('span', null, historyError), h('button', { type: 'button', className: 'fish-button', onClick: () => setRetry(value => value + 1) }, '重试')) : null,
            h('small', { className: 'fish-muted' }, sources[target.channel] + ' · 已安装 ' + fishUpdateLabel(target)))),
        h('main', { ref: content, className: 'fish-release-content', 'aria-busy': loading },
          loading ? h('p', { role: 'status' }, '正在读取更新日志…') : null,
          error ? h('div', { role: 'status' }, h('p', null, error), h('button', { type: 'button', className: 'fish-button', onClick: () => setRetry(value => value + 1) }, '重试')) : null,
          data ? h('header', { className: 'fish-release-content-head' }, h('h3', null, data.title || 'v' + data.version), data.summary ? h('p', { className: 'fish-release-summary' }, data.summary) : null) : null,
          active ? h('section', { 'aria-label': active.title },
            h('div', { className: 'fish-release-section-head' }, h('h4', null, active.title), h('span', { className: 'fish-muted' }, active.items.length + ' 项')),
            h('ol', { start: offset + 1 }, ...active.items.map((item, index) => h('li', { key: item.id },
              h('span', { className: 'fish-release-number', 'aria-hidden': true }, String(offset + index + 1).padStart(2, '0')),
              h('div', null, h('h5', null, item.title),
                item.description ? h('p', { className: 'fish-release-description' }, item.description) : null,
                ...(item.links || []).filter(link => { try { const url = new URL(link.url); return url.protocol === 'https:' && !url.username && !url.password } catch { return false } }).map(link => h('a', { key: link.url, href: link.url, target: '_blank', rel: 'noopener noreferrer' }, link.label))))))) : data ? h('p', null, '此版本暂无更新条目') : null))),
    h('style', null, FISH_THEME_CSS)))
}

let openUpdatesRequested = false
let showUpdates = null
let installArtwork = 'idle'
try {
  const saved = window.sessionStorage?.getItem('big-fish:update-artwork')
  if (['success', 'failure'].includes(saved)) installArtwork = saved
  const reopening = Number(window.localStorage?.getItem('big-fish-aio.reopen-after-update'))
  if (reopening > 0 && Date.now() - reopening < 65000) fishAwaitUpdateLog(true)
} catch {}
const FISH_UPDATE = { installOutcome: installArtwork, result: null, listeners: new Set(), dismissed: new Set() }
function fishSetUpdateResult(result) {
  result = { ...result, installOutcome: FISH_UPDATE.installOutcome }
  FISH_UPDATE.result = result
  for (const listener of FISH_UPDATE.listeners) listener(result)
}

function fishSetInstallOutcome(outcome) {
  FISH_UPDATE.installOutcome = outcome
  try { window.sessionStorage?.setItem('big-fish:update-artwork', outcome) } catch {}
  if (FISH_UPDATE.result) fishSetUpdateResult(FISH_UPDATE.result)
}

function UpdateNotifier() {
  React.useEffect(() => {
    let stopped = false, running = false, checkedAt = 0, active = null, timer, failures = 0
    const queued = new Set()
    let logTimer, logActive, logRunning = false
    const checkInstalled = async () => {
      if (stopped || logRunning) return
      clearTimeout(logTimer)
      logRunning = true
      const controller = new AbortController()
      logActive = controller
      const timeout = setTimeout(() => controller.abort(), 10000)
      try {
        const info = await request('/dsh-big-fish-aio/version', { signal: controller.signal })
        const target = info.postUpdate
        if (!stopped && target && !FISH_UPDATE.dismissed.has(fishUpdateTarget(target)) && !queued.has(fishUpdateTarget(target))) {
          queued.add(fishUpdateTarget(target))
          fishSetInstallOutcome('success')
          fishAwaitUpdateLog(false)
          fishOpenUpdateLog(target)
        }
      } catch {} finally {
        clearTimeout(timeout); logActive = null; logRunning = false
        if (!stopped && fishAwaitUpdateLog()) logTimer = setTimeout(checkInstalled, 1000)
      }
    }
    const schedule = delay => {
      clearTimeout(timer)
      timer = setTimeout(() => check(true), delay * (.95 + Math.random() * .1))
    }
    const check = async (scheduled = false) => {
      if (stopped || running || (!scheduled && checkedAt && Date.now() - checkedAt < (failures ? Math.min(30, 2 ** failures) : 5) * 60000)) return
      running = true; checkedAt = Date.now()
      const controller = new AbortController()
      active = controller
      const timeout = setTimeout(() => controller.abort(), 65000)
      try {
        const result = await request('/dsh-big-fish-aio/update', { signal: controller.signal })
        if (stopped) return
        if (!result.ok) throw Error(result.error || '检查更新失败')
        failures = 0
        fishSetUpdateResult(result)
      } catch (error) {
        if (!stopped) { failures++; fishNotify('自动检查更新失败：' + error.message) }
      } finally {
        clearTimeout(timeout); active = null; running = false
        if (!stopped) schedule((failures ? Math.min(30, 2 ** failures) : 30) * 60000)
      }
    }
    const onVisible = () => { if (document.visibilityState !== 'hidden') { void check(); void checkInstalled() } }
    void check()
    void checkInstalled()
    window.addEventListener('focus', onVisible)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true; active?.abort(); logActive?.abort(); clearTimeout(timer); clearTimeout(logTimer)
      window.removeEventListener('focus', onVisible)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
  return null
}

const types = ['object', 'array', 'string', 'number', 'integer', 'boolean', 'null']
const annotations = ['title', 'description', 'default', 'examples']

// shortcut: 支持下列 JSON Schema 子集，扩展规范时同时扩展注册检查和运行时校验。
function checkSchema(schema, depth = 0) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema) || depth > 12 || !types.includes(schema.type)) throw Error('Schema 必须声明受支持的 type，嵌套不超过 12 层')
  const fields = { object: ['properties', 'required', 'additionalProperties'], array: ['items'], string: ['minLength', 'maxLength'] }
  const allowed = ['type', 'enum', ...annotations, ...(fields[schema.type] || [])]
  for (const key of Object.keys(schema)) if (!allowed.includes(key)) throw Error('不支持的 Schema 字段 ' + key)
  if (schema.enum !== undefined && (!Array.isArray(schema.enum) || !schema.enum.length || schema.enum.some(v => v !== null && typeof v === 'object'))) throw Error('enum 仅支持非空标量列表')
  if (schema.type === 'object') {
    if (!schema.properties || typeof schema.properties !== 'object' || Array.isArray(schema.properties) || schema.additionalProperties !== false) throw Error('object 必须声明 properties 和 additionalProperties=false')
    if (schema.required !== undefined && (!Array.isArray(schema.required) || schema.required.some(k => typeof k !== 'string' || !Object.hasOwn(schema.properties, k)))) throw Error('required 必须引用已声明字段')
    for (const value of Object.values(schema.properties)) checkSchema(value, depth + 1)
  }
  if (schema.type === 'array') checkSchema(schema.items, depth + 1)
  for (const key of ['minLength', 'maxLength']) if (schema[key] !== undefined && (!Number.isSafeInteger(schema[key]) || schema[key] < 0)) throw Error(key + ' 必须是非负整数')
  if (schema.minLength > schema.maxLength) throw Error('minLength 不能超过 maxLength')
}

function validateValue(schema, value, path = 'input') {
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
  if (schema.type === 'integer' ? !Number.isSafeInteger(value) : type !== schema.type) throw Error(path + ' 必须是 ' + schema.type)
  if (type === 'number' && !Number.isFinite(value)) throw Error(path + ' 必须是有限数值')
  if (schema.enum && !schema.enum.includes(value)) throw Error(path + ' 不在 enum 范围内')
  if (type === 'string') {
    const length = [...value].length
    if (length < (schema.minLength ?? 0) || length > (schema.maxLength ?? Infinity)) throw Error(path + ' 长度不符合要求')
  }
  if (type === 'object') {
    for (const key of schema.required || []) if (!Object.hasOwn(value, key)) throw Error(path + '.' + key + ' 为必填字段')
    for (const [key, item] of Object.entries(value)) {
      if (!Object.hasOwn(schema.properties, key)) throw Error(path + '.' + key + ' 未声明')
      validateValue(schema.properties[key], item, path + '.' + key)
    }
  }
  if (type === 'array') value.forEach((item, i) => validateValue(schema.items, item, path + '[' + i + ']'))
}

// 手动接入只声明 HTTP 数据，不接收或执行用户填写的 JavaScript。
function httpManifest(value) {
  if (!value || !Array.isArray(value.operations)) throw Error('请填写接口清单')
  return {
    schemaVersion: value.schemaVersion, id: value.id, title: value.title, description: value.description, version: value.version,
    operations: value.operations.map(operation => {
      let url, headers
      try {
        url = new URL(operation.url)
        if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw Error()
      } catch { throw Error('目标地址必须是 HTTP(S) URL，认证信息请放在请求头中') }
      const supplied = operation.headers ?? {}
      if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied)) throw Error('请求头必须是 JSON 对象')
      try {
        for (const [name, content] of Object.entries(supplied)) {
          if (typeof content !== 'string' || /^(host|connection|content-length|transfer-encoding|upgrade|content-type)$/i.test(name)) throw Error()
        }
        headers = new Headers(supplied)
        headers.set('Content-Type', 'application/json')
      } catch { throw Error('请求头无效，Content-Type 由平台统一设置') }
      return {
        id: operation.id, title: operation.title, description: operation.description, readOnly: operation.readOnly,
        inputSchema: operation.inputSchema, outputSchema: operation.outputSchema, example: operation.example,
        async handler(input, { signal }) {
          let response
          try {
            response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(input), signal, redirect: 'error' })
          } catch { throw Error('远端 API 网络请求失败，请检查地址、认证和网络') }
          if (!response.ok) {
            await response.body?.cancel()
            throw Error('远端 API 返回 HTTP ' + response.status)
          }
          const chunks = []; let size = 0
          if (response.body) for await (const chunk of response.body) {
            size += chunk.byteLength
            if (size > 1048576) throw Error('远端 API 响应超过 1 MB')
            chunks.push(Buffer.from(chunk))
          }
          let result
          try { result = JSON.parse(Buffer.concat(chunks).toString('utf8')) }
          catch { throw Error('远端 API 未返回有效 JSON') }
          if (!result || result.ok !== true || !Object.hasOwn(result, 'data')) throw Error('远端 API 返回业务失败或结果不符合 ok/data 规范')
          return result.data
        },
      }
    }),
  }
}


function nativeApiReference(value) {
  if (!value || Array.isArray(value) || value.schemaVersion !== 1 || value.transport !== 'dsh' || typeof value.id !== 'string' || !/^[a-z][a-z0-9_]{0,23}$/.test(value.id)) throw Error('原生接入文件须包含 schemaVersion=1、transport=dsh 和有效的提供方 ID')
  for (const key of Object.keys(value)) if (!['schemaVersion', 'transport', 'id'].includes(key)) throw Error('原生接入文件包含不支持的字段 ' + key)
  return value
}

// 文件只携带原生提供方引用或 HTTP 清单，禁止导入可执行代码。
function parseHttpApiImport(text, { origin = '', token = '' } = {}) {
  if (new TextEncoder().encode(text).length > 65536) throw Error('接入文件不能超过 64 KB')
  let definition
  try { definition = JSON.parse(text.replace(/^\uFEFF/, '')) } catch { throw Error('请选择有效的 JSON 接入文件') }
  if (definition?.transport !== undefined) return { definition: nativeApiReference(definition), needsOrigin: false, needsToken: false }
  const rootKeys = ['schemaVersion', 'id', 'title', 'description', 'version', 'operations']
  const operationKeys = ['id', 'title', 'description', 'readOnly', 'url', 'headers', 'inputSchema', 'outputSchema', 'example']
  const idPattern = /^[a-z][a-z0-9_]{0,23}$/
  if (!definition || Array.isArray(definition) || definition.schemaVersion !== 1 || !Array.isArray(definition.operations) || !definition.operations.length) throw Error('请选择 big-fish-api.json 接入清单，文件须包含 schemaVersion=1 和 operations')
  for (const key of Object.keys(definition)) if (!rootKeys.includes(key)) throw Error('接入文件包含不支持的字段 ' + key)
  for (const key of ['id', 'title', 'description', 'version']) if (typeof definition[key] !== 'string' || !definition[key].trim()) throw Error('接入文件缺少提供方字段 ' + key)
  if (!idPattern.test(definition.id)) throw Error('提供方 ID 格式错误')
  let needsOrigin = false, needsToken = false
  const ids = new Set()
  const operations = definition.operations.map((operation, index) => {
    try {
      if (!operation || typeof operation !== 'object' || Array.isArray(operation)) throw Error('接口必须是对象')
      for (const key of Object.keys(operation)) if (!operationKeys.includes(key)) throw Error('不支持的接口字段 ' + key)
      for (const key of ['id', 'title', 'description', 'url']) if (typeof operation[key] !== 'string' || !operation[key].trim()) throw Error('缺少字段 ' + key)
      if (!idPattern.test(operation.id) || ids.has(operation.id)) throw Error('接口 ID 无效或重复')
      ids.add(operation.id)
      if (typeof operation.readOnly !== 'boolean') throw Error('readOnly 必须是布尔值')
      checkSchema(operation.inputSchema); checkSchema(operation.outputSchema)
      if (operation.inputSchema.type !== 'object') throw Error('请求 Schema 根类型必须为 object')
      validateValue(operation.inputSchema, operation.example ?? {}, 'example')
      let url = operation.url
      if (url.startsWith('{{DSH_ORIGIN}}/')) {
        needsOrigin = true
        const base = new URL(origin || 'https://placeholder.invalid')
        if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.pathname !== '/' || base.search || base.hash) throw Error('DSH 地址只填写协议、主机与端口')
        url = base.origin + url.slice('{{DSH_ORIGIN}}'.length)
      }
      if (/\{\{|\}\}/.test(url)) throw Error('地址仅支持 {{DSH_ORIGIN}} 占位符')
      const supplied = operation.headers ?? {}
      if (!supplied || typeof supplied !== 'object' || Array.isArray(supplied)) throw Error('headers 必须是对象')
      const headers = Object.fromEntries(Object.entries(supplied).map(([key, value]) => {
        if (typeof value !== 'string') throw Error('请求头值必须是字符串')
        if (value.includes('{{API_TOKEN}}')) needsToken = true
        const content = value.replaceAll('{{API_TOKEN}}', token.trim() || 'IMPORT_TOKEN')
        if (/\{\{|\}\}/.test(content)) throw Error('请求头仅支持 {{API_TOKEN}} 占位符')
        return [key, content]
      }))
      return { ...operation, url, headers, example: operation.example ?? {} }
    } catch (error) { throw Error('接口 ' + (index + 1) + ' · ' + error.message) }
  })
  const resolved = { ...definition, operations }
  httpManifest(resolved)
  const missingOrigin = needsOrigin && !origin.trim(), missingToken = needsToken && !token.trim()
  return { definition: missingOrigin || missingToken ? definition : resolved, needsOrigin, needsToken }
}

const PLATFORM_PLUGIN_PROMPT = "# 给 DSH 开发插件的 prompt\n\n复制下文，将「业务需求」替换为你要做的功能后交给 DSH 中的 AI。\n\n---\n\n请为当前 DSH 开发一个可独立安装的插件，通过 DSH 原生接口注册接入「大肥鱼开放平台」，让用户导入时无需填写地址或 Token。插件原生支持会话级别隔离，用户通过开放平台卡片开启或关闭，插件面板展示当前状态。\n\n## 业务需求\n\n【在这里填写插件名称、界面和需要开放的能力。例如开发备忘录，提供新建、修改、查询、完成四项能力。】\n\n## 开发与交付要求\n\n1. 先查阅当前宿主的插件规范与可用 API，再实现业务、独立界面、持久化与必要校验。插件和大肥鱼安装在同一 DSH。使用可选的 `ctx.inject(['bigFishOpenPlatform'], callback)` 注册能力，大肥鱼未安装或停用时，插件本身仍能独立运行。\n2. 一个插件只创建一个提供方，所有接口放在同一个 operations 数组。接口通过 handler 直接调用插件内部业务方法，不通过 HTTP 绕回自己的路由。handler 成功直接返回符合 outputSchema 的业务数据，失败抛出错误，由平台包装统一响应。查询标记 readOnly=true，处理器只读数据，写操作标记 false。向业务方法传递 execution.signal、execution.isolation，新建记录时另行传递 execution.isOwner。在存储层落实会话校验、来源保存、并发一致性和幂等约束。\n3. 使用注入回调收到的 platformCtx.effect 管理 register 返回的注销函数。平台停用、重载或插件卸载时移除接口及模型工具，重新启用时自动注册。不要在宿主插件的必需 inject 数组中加入 bigFishOpenPlatform，也不要仅在加载时检查一次服务是否存在。\n4. 交付真实文件 big-fish-api.json，严格遵循下方三字段结构。它只引用已安装插件的提供方 ID，必须与原生清单 id 一致。接口名称、说明、版本、Schema、示例和处理器全部在插件注册清单中提供。导入时用户无需编辑这些内容。\n5. 原生接入文件只包含 schemaVersion、transport、id。不得生成 url、headers、Authorization、Token 或地址占位符。不得要求用户创建、查询或粘贴任何接入 Token，不得以删除 HTTP 鉴权代替原生注册。插件若另有供外部客户端使用的 HTTP 接口，可保留其独立鉴权，但不用于这次大肥鱼接入。第三方业务凭据在插件自身的配置中管理，不写入接入文件、示例或日志。\n6. BIG_FISH_API.md 面向不懂技术的用户，正文控制在 30 行以内。只写三步操作和首次测试顺序，并说明面板的「导出 API 配置」入口。步骤为“在同一 DSH 安装并启用插件和大肥鱼 → 在插件面板点击导出 API 配置，然后在大肥鱼的 + 接入 API 中导入 big-fish-api.json，点击确认接入 → 开启卡片接入和目标会话授权”。明确写出“无需填写地址或 Token”。开发参考另放 README。\n7. 新建示例使用有效的合成业务数据。修改、完成等需要真实记录 ID 的示例可留清晰的占位 ID，但必须说明先用新建/查询获取 ID。验证 JSON 可解析、原生提供方实际注册、输入示例符合 Schema，以及无 Token 的正常调用、关闭接入、未授权会话、隔离开关、跨会话查询及写入拒绝、参数错误、取消和卸载/重载路径。按用户授权范围验证，用户要求不测试时只交付待验证项目并说明实际范围。\n8. OpenAPI 3.1 由平台根据同一清单自动生成。inputSchema 对应管理入口请求体，outputSchema 对应平台成功响应中的 data。平台调用地址采用 POST /dsh-big-fish-aio/open-platform/invoke/{providerId}/{operationId}，模型工具名为 big_fish_{providerId}_{operationId}。管理调用复用 DSH 本人登录态，模型调用还须通过接入开关与会话授权。平台响应包含 ok、data 或 error、requestId、durationMs，业务调用返回 HTTP 200 时仍需检查 ok。OpenAPI 描述文档与用户导入的三字段引用文件各有用途，用户导入时选择 big-fish-api.json。\n\n## big-fish-api.json 的严格结构\n\n根据真实插件替换 my_plugin，直接写入 JSON 文件，不只输出 Markdown 代码块。不要把完整接口清单、JavaScript、OpenAPI 文档或用户数据放进这个引用文件。\n\n```json\n{\n  \"schemaVersion\": 1,\n  \"transport\": \"dsh\",\n  \"id\": \"my_plugin\"\n}\n```\n\n## 插件内的原生注册清单\n\n在 apply 中创建真实清单，通过可选注入注册。下面的 store.read 示意插件自身的存储方法，请替换为实际实现。它必须先按 access 过滤再返回 {items:[...]}，每项仅包含 id、text 和记录原有的布尔 isOwner。\n\n```js\nexport function apply(ctx) {\n  // 在这里初始化插件自身的界面、存储和业务能力。\n  const manifest = {\n    schemaVersion: 1,\n    id: 'my_plugin',\n    title: '我的插件',\n    description: '插件的业务用途',\n    version: '1.0.0',\n    supportsSessionIsolation: true,\n    operations: [{\n      id: 'read',\n      title: '查询记录',\n      description: '读取记录，返回 items。',\n      readOnly: true,\n      inputSchema: { type: 'object', properties: {}, required: [], additionalProperties: false },\n      outputSchema: {\n        type: 'object',\n        properties: {\n          items: {\n            type: 'array',\n            items: {\n              type: 'object',\n              properties: { id: { type: 'string' }, text: { type: 'string' }, isOwner: { type: 'boolean' } },\n              required: ['id', 'text', 'isOwner'],\n              additionalProperties: false,\n            },\n          },\n        },\n        required: ['items'],\n        additionalProperties: false,\n      },\n      example: {},\n      async handler(input, execution) {\n        if (!execution.isolation || typeof execution.isOwner !== 'boolean') {\n          throw Error('请更新大肥鱼以提供可信调用上下文')\n        }\n        const { signal, isolation } = execution\n        signal.throwIfAborted()\n        isolation.assertCurrent()\n        const result = await store.read(input, { signal, access: isolation })\n        signal.throwIfAborted()\n        isolation.assertCurrent()\n        return result\n      },\n    }],\n  }\n  ctx.inject(['bigFishOpenPlatform'], platformCtx => {\n    platformCtx.effect(() => platformCtx.bigFishOpenPlatform.register(manifest))\n  })\n}\n```\n\n提供方和接口 ID 均以小写字母开头，只含小写字母、数字和下划线，长度 1–24。更新时保留 ID。引用文件与管理请求体各不超过 64 KB。输入 Schema 根类型必须是 object，每个对象声明 properties 和 additionalProperties=false，数组声明 items。Schema 只支持 type、properties、required、additionalProperties、items、标量 enum、字符串 minLength/maxLength，以及 title/description/default/examples 注释。支持的 type 为 object、array、string、number、integer、boolean、null，嵌套最多 12 层，integer 必须为安全整数。default 只作说明，业务自行处理默认值。不使用 $ref、oneOf、format、minimum 等未支持字段。outputSchema 描述 handler 直接返回的成功业务数据。\n\n调用限时 15 秒，平台不自动重试。将 execution.signal 传给内部异步操作和外部请求，存储层在原子提交前检查取消与授权变化。写入超时后先核对结果，再决定是否使用同一业务幂等键重试。\n\n## 可切换的会话级别隔离\n\n- 只有存储层完整实现这些规则后，注册清单才声明 `supportsSessionIsolation: true`。平台为该提供方默认开启隔离，用户在卡片配置中即时切换。隔离开关只由开放平台卡片管理，插件面板通过 `getSessionIsolation(providerId)` 展示当前状态。插件不创建第二套隔离配置，不提供修改该设置的开关或写入入口。\n- 平台向原生处理器提供 `execution.isolation`，包含只读的 `enabled`、可信 `sessionId` 和 `assertCurrent()`。调用来源和权限由平台确定，模型输入 Schema 不包含归属、隔离开关、主人标识或任意会话选择参数。QQ 主人与普通会话执行相同规则。\n- 新记录始终保存 `execution.isolation.sessionId`。开启隔离时，查询先按相同 `sessionId` 过滤再搜索、排序、计数和分页。按 ID 读取、修改、完成和删除也必须检查归属，越权统一返回未找到。同一会话内判断幂等键，即使关闭隔离也继续按会话判断。\n- 关闭隔离时，获授权会话共享读写全部数据。保留每条记录的原始归属，关闭期间的新记录继续标记实际调用会话，重新开启后恢复按归属访问。修改内容与归属分别控制，普通业务更新不能修改归属。\n- 在任务进入队列、异步读取后、返回结果前以及原子写入发布前调用 `assertCurrent()` 并检查取消信号。切换隔离、撤销授权及停用会取消在途平台调用。发布前检查与原子发布应避免异步间隙，已提交写入的结果需要由用户查询确认。\n- 独立面板必须使用宿主登录鉴权，按本机独立范围处理数据。旧数据的未知归属进入本机待整理范围，保留原数据，避免自动归入第一个调用的会话。其他 HTTP 入口缺少可信会话上下文时，开启隔离后拒绝其访问会话数据。平台暂未提供 HTTP 远端的隔离上下文协议，通用 HTTP 清单保持既有契约。\n- 缺少 `execution.isolation` 时提示升级平台并拒绝会话业务调用。平台未加载时，独立面板按开启隔离处理。平台服务提供 `getSessionIsolation(providerId)` 读取当前开关，插件使用同一配置来源。\n- 页面接口测试默认使用 `@local` 本机范围，开启隔离时只访问本机记录。会话隔离通过实际 QQ 会话验证。平台兼容本人登录管理请求中的可选 `X-Big-Fish-Session` 请求头，指定会话须属于绑定工作区且已授权。业务 JSON 仅包含业务参数。\n\n## 主人数据标记 isOwner\n\n平台在处理器第二个参数中提供布尔值 `execution.isOwner`。`true` 表示本轮数据由主人 QQ 产生，`false` 表示非主人或来源未核验。平台复用可信 QQ 桥接来源，根据当前宿主消息的发送者与配置的主人 QQ 比较。群聊中仅当本轮已核验消息的发送者集合只有主人一人时为 true，多发送者混合消息为 false。本人登录后的平台页面调用按手工录入处理，传入 true。\n\n`sessionId` 只决定会话归属与隔离。`isOwner` 独立标记数据来源，不能通过会话 ID、会话标题、模型输入或客户端自行提交的字段推定。开启隔离时主人仍只读写本会话，来源标记不会扩大权限。\n\n插件新建数据时将 `execution.isOwner` 原样保存为记录的布尔字段，返回记录时包含 `isOwner`。查询返回记录原有标记，修改与完成保留记录最初的来源标记，查询、修改、完成和删除继续按会话校验。插件自身已登录面板手工新建记录默认写入 `isOwner: true`。原生调用缺少布尔 isOwner 时提示升级并拒绝，不能将来源未知的调用自行标为主人。旧记录缺少该字段时，如采用默认 true，必须在文档说明这是历史兼容值，无法还原旧记录实际发送者。业务输入 Schema 与导出配置不包含可由模型指定的 isOwner 字段。平台在存储层调用 assertCurrent() 及返回前复核消息来源和主人配置，变化时拒绝继续提交。\n\n新建业务调用可采用 `store.create(input, { signal: execution.signal, access: execution.isolation, isOwner: execution.isOwner })`，由存储方法保存可信归属和来源。查询、修改与完成使用已保存记录的来源标记。\n\n## 面板导出 API 配置\n\n在插件面板的「刷新」按钮左侧提供「导出 API 配置」按钮，一键下载 `big-fish-api.json`，并显示提示“请在大肥鱼 → 开放平台 → + 接入 API → 导入 JSON 中导入”。导出内容与交付文件及实际注册提供方 ID 一致，使用本文的 schemaVersion、transport、id 三字段原生引用格式。导出文件不包含 Token、业务数据、会话授权、isOwner 或 JavaScript。复用插件已鉴权的面板入口读取当前接入文件，文件读取或校验失败时显示错误。\n\n## 最终回复\n\n用简短中文给出插件目录、安装方法、big-fish-api.json 和 BIG_FISH_API.md 的实际文件路径，以及已完成的验证。用户的下一步是启用同一 DSH 内的两个插件、选择接入文件并确认、开启接入和会话授权，并按需调整会话级别隔离开关。\n";
const OPEN_PLATFORM_PATH = '/dsh-big-fish-aio/open-platform'
async function platformRequest(path, body) {
  const response = await fetch(OPEN_PLATFORM_PATH + path, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
  const result = await response.json()
  if (!response.ok || result.ok === false) throw Error(result.error?.message || '开放平台请求失败')
  return result
}

function PlatformCode({ value, title = 'JSON Schema' }) {
  return h('div', { className: 'platform-code-block' },
    h('div', { className: 'platform-code-head' }, h('span', null, title), h('span', null, 'JSON')),
    h('pre', { tabIndex: 0 }, h('code', { className: 'language-json' }, JSON.stringify(value, null, 2))))
}

function platformSchemaRows(schema, path = '$', required = true) {
  return [{ path, schema, required },
    ...Object.entries(schema.properties || {}).flatMap(([key, value]) => platformSchemaRows(value, path + '.' + key, Boolean(schema.required?.includes(key)))),
    ...(schema.items ? platformSchemaRows(schema.items, path + '[]') : [])]
}

function PlatformSchema({ schema }) {
  return h('div', { className: 'platform-schema' },
    h('div', { className: 'fish-table-wrap' }, h('table', { className: 'fish-table' },
      h('thead', null, h('tr', null, ...['字段', '类型', '必填', '说明'].map(label => h('th', { key: label }, label)))),
      h('tbody', null, ...platformSchemaRows(schema).map(({ path, schema: value, required }) => h('tr', { key: path },
        h('td', null, h('code', null, path)), h('td', null, value.type), h('td', null, path.endsWith('[]') ? '每项' : required ? '是' : '否'),
        h('td', null, value.description || (path === '$' ? 'JSON 根节点' : value.type === 'object' ? '对象字段见下方' : '—'), value.enum ? ' · 可选值 ' + value.enum.join(' / ') : '')))))),
    h(PlatformCode, { value: schema }))
}

function PlatformOperation({ provider, operation }) {
  const [input, setInput] = React.useState(JSON.stringify(operation.example, null, 2))
  const [result, setResult] = React.useState(null)
  const [busy, setBusy] = React.useState(false)
  const test = async () => {
    setBusy(true); setResult(null)
    try {
      const body = JSON.parse(input)
      const response = await fetch(operation.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setResult({ status: response.status, body: await response.json() })
    } catch (error) { setResult({ body: { ok: false, error: { message: error.message } } }) }
    finally { setBusy(false) }
  }
  return h('article', { className: 'platform-operation' },
    h('header', { className: 'platform-operation-head' }, h('span', { className: 'platform-method' }, 'POST'), h('h3', null, operation.title), h('span', { className: 'memory-badge' }, operation.readOnly ? '只读' : '写入'), h('code', null, operation.id)),
    h('div', { className: 'platform-operation-body' },
      h('div', { className: 'platform-operation-intro' },
        h('p', { className: 'fish-muted' }, operation.description),
        h('code', { className: 'platform-path' }, operation.endpoint),
        h('p', { className: 'fish-muted' }, '会话工具名 ', h('code', null, operation.toolName))),
      h('section', { className: 'platform-section' }, h('h3', null, '请求参数'), h(PlatformSchema, { schema: operation.inputSchema })),
      h('section', { className: 'platform-section' }, h('h3', null, '成功数据'), h(PlatformSchema, { schema: operation.outputSchema })),
      h('section', { className: 'platform-section' }, h('h3', null, '测试调用'),
        h('label', { className: 'memory-field' }, '请求 JSON', h('textarea', { value: input, rows: 4, spellCheck: false, onChange: event => setInput(event.target.value) })),
        !operation.readOnly ? h('p', { className: 'fish-muted' }, '此测试将写入数据，请核对参数。') : null,
        h('div', { className: 'memory-actions' }, h('button', { className: 'fish-button', type: 'button', disabled: busy || !provider.enabled, onClick: test }, busy ? '调用中…' : '测试调用'),
          !provider.enabled ? h('span', { className: 'fish-muted' }, '开启接入后可测试') : null)),
      result ? h('div', { role: 'status', className: 'platform-response' }, h('strong', null, (result.body.ok ? '调用成功' : '调用失败') + (result.status ? ' · HTTP ' + result.status : '')),
        h(PlatformCode, { value: result.body, title: '响应结果' })) : null))
}

function PlatformProvider({ provider, sessions, onRefresh, notify }) {
  const Switch = typeof FishSwitch === 'function' ? FishSwitch : 'input'
  const [selectedId, setSelectedId] = React.useState(null)
  const selectedOperation = provider.operations.find(operation => operation.id === selectedId)
  const detailRef = React.useRef(null)
  React.useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0
  }, [selectedOperation?.id, provider.sessionIsolation])
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const dialogRef = React.useRef(null)
  const saving = React.useRef(false)
  React.useEffect(() => {
    const dialog = dialogRef.current
    if (open) dialog.showModal()
    else if (dialog.open) dialog.close()
  }, [open])
  const save = async (enabled, selected, sessionIsolation) => {
    if (saving.current) return
    saving.current = true
    setBusy(true)
    try {
      const catalog = await platformRequest('/connect', { providerId: provider.id, enabled, sessionIds: selected, ...(sessionIsolation !== undefined ? { sessionIsolation } : {}) })
      onRefresh(catalog)
      notify('接入设置已保存。')
    } catch (error) { notify(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  const remove = async () => {
    if (saving.current) return
    saving.current = true
    setBusy(true)
    try {
      const confirmed = await fishAskConfirm({
        title: '删除接入？',
        description: '移除「' + provider.title + '」的接入卡片并撤销所有会话授权。接口配置和插件数据保留，重新导入后需要重新授权。',
        confirmText: '删除接入', danger: true,
      })
      if (!confirmed) return
      const catalog = await platformRequest('/remove', { providerId: provider.id })
      setOpen(false)
      onRefresh(catalog)
      notify('接入已删除。')
    } catch (error) { notify(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  return h(React.Fragment, null,
    h('article', { className: 'fish-card platform-provider-card' },
      h('button', { type: 'button', className: 'platform-provider-open', 'aria-haspopup': 'dialog', onClick: () => { setSelectedId(null); setOpen(true) } },
      h('span', { className: 'platform-provider-title' }, provider.title),
      h('span', { className: 'platform-provider-description' }, provider.description),
      h('span', { className: 'platform-provider-meta' }, h('span', null, provider.id + ' · v' + provider.version),
        h('span', null, provider.operations.length + ' 个接口'))),
      h(Switch, { type: 'checkbox', role: 'switch', className: 'platform-provider-toggle', 'aria-label': '启用' + provider.title + '接入', checked: provider.enabled, disabled: busy,
        onChange: event => save(event.target.checked, provider.sessionIds) })),
    h('dialog', { ref: dialogRef, className: 'memory-dialog platform-provider', 'aria-labelledby': 'platform-provider-' + provider.id,
      onCancel: event => { event.preventDefault(); setOpen(false) }, onClose: () => setOpen(false) },
      h('header', { className: 'memory-dialog-head' },
        h('div', null, h('p', null, provider.id + ' · v' + provider.version), h('h2', { id: 'platform-provider-' + provider.id }, provider.title)),
        h('div', { className: 'platform-provider-actions' },
          h('button', { type: 'button', className: 'fish-button fish-danger', disabled: busy, onClick: remove }, '删除'),
          h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭' + provider.title, disabled: busy, onClick: () => setOpen(false), autoFocus: true }, '×'))),
      h('div', { className: 'platform-provider-workspace' },
        h('aside', { className: 'platform-provider-sidebar', 'aria-label': '接入设置与接口列表' },
          h('p', { className: 'platform-provider-description' }, provider.description),
          h('section', { className: 'platform-provider-settings' },
            h('label', { className: 'platform-session-option' }, h('span', null, '开启接入'),
              h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '开启' + provider.title + '接入', checked: provider.enabled, disabled: busy,
                onChange: event => save(event.target.checked, provider.sessionIds) }))),
          h('fieldset', { className: 'platform-sessions', disabled: busy, 'aria-busy': busy }, h('legend', null, '允许调用的会话'),
            ...sessions.map(session => h('label', { key: session.id, className: 'platform-session-option' },
              h('span', null, session.title),
              h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '授权' + session.title, checked: provider.sessionIds.includes(session.id), disabled: busy,
                onChange: event => save(provider.enabled, event.target.checked ? [...provider.sessionIds, session.id] : provider.sessionIds.filter(id => id !== session.id)) }))),
            !sessions.length ? h('p', { className: 'fish-muted' }, '绑定工作区内暂无 QQ 映射会话。') : null),
          provider.supportsSessionIsolation ? h('section', { className: 'platform-isolation' },
            h('label', { className: 'platform-session-option' }, h('span', null, '会话级别隔离'),
              h(Switch, { type: 'checkbox', role: 'switch', 'aria-label': '会话级别隔离', checked: provider.sessionIsolation, disabled: busy,
                onChange: event => save(provider.enabled, provider.sessionIds, event.target.checked) }))) : null,
          h('nav', { className: 'platform-provider-operations', 'aria-label': '接口列表' },
            h('h3', null, '接口列表 · ' + provider.operations.length),
            ...provider.operations.map(operation => h('button', { key: operation.id, type: 'button',
              'aria-current': selectedId === operation.id ? 'true' : undefined, 'aria-controls': 'platform-detail-' + provider.id,
              onClick: () => setSelectedId(operation.id) },
              h('span', { className: 'platform-operation-choice' }, h('strong', null, operation.title), h('span', { className: 'memory-badge' }, operation.readOnly ? '只读' : '写入')),
              h('code', null, operation.id))))),
        h('section', { id: 'platform-detail-' + provider.id, ref: detailRef, className: 'platform-provider-detail', 'aria-label': '接口详情', tabIndex: 0 },
          open && selectedOperation ? h(PlatformOperation, { key: selectedOperation.id + ':' + provider.sessionIsolation, provider, operation: selectedOperation })
            : h('div', { className: 'platform-provider-empty' }, h('h3', null, '选择一个接口'), h('p', null, '选择接口以查看参数、返回结构及测试调用。'))))))
}

function PlatformAddApi({ onClose, onCreated, apiOrigin = '' }) {
  const emptySchema = JSON.stringify({ type: 'object', properties: {}, required: [], additionalProperties: false }, null, 2)
  const newOperation = () => ({ id: '', title: '', description: '', url: '', readOnly: false,
    headers: '{}', inputSchema: emptySchema, outputSchema: emptySchema, example: '{}' })
  const [form, setForm] = React.useState({ id: '', title: '', description: '', version: '1.0.0', operations: [newOperation()] })
  const [active, setActive] = React.useState(0)
  const [view, setView] = React.useState('base')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  const [pendingImport, setPendingImport] = React.useState(null)
  const [nativeReference, setNativeReference] = React.useState(null)
  const [importOrigin, setImportOrigin] = React.useState(apiOrigin)
  const [importToken, setImportToken] = React.useState('')
  const ref = React.useRef(null)
  const saving = React.useRef(false)
  const fileRef = React.useRef(null)
  React.useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  const fillImport = definition => {
    setForm({ id: definition.id, title: definition.title, description: definition.description, version: definition.version,
      operations: definition.operations.map(operation => ({ ...operation,
        ...Object.fromEntries(['headers', 'inputSchema', 'outputSchema', 'example'].map(key => [key, JSON.stringify(operation[key] ?? {}, null, 2)])) })) })
    setNativeReference(null); setActive(0); setView('base'); setPendingImport(null); setImportToken(''); setError('')
  }
  const importFile = async event => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || saving.current) return
    saving.current = true; setBusy(true); setError('')
    try {
      if (file.size > 65536) throw Error('接入文件不能超过 64 KB')
      const text = await file.text(), parsed = parseHttpApiImport(text, { origin: apiOrigin })
      if (parsed.definition.transport === 'dsh') {
        setNativeReference(parsed.definition); setPendingImport(null); setImportToken('')
      } else if (parsed.needsToken || (parsed.needsOrigin && !apiOrigin)) {
        setNativeReference(null); setPendingImport({ text, ...parsed }); setImportOrigin(apiOrigin); setImportToken('')
      } else fillImport(parsed.definition)
    } catch (error) { setError(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  const completeImport = () => {
    try {
      if (pendingImport.needsOrigin && !importOrigin.trim()) throw Error('请填写插件所在 DSH 的地址')
      if (pendingImport.needsToken && !importToken.trim()) throw Error('请粘贴一次插件 Token')
      fillImport(parseHttpApiImport(pendingImport.text, { origin: importOrigin, token: importToken }).definition)
    } catch (error) { setError(error.message) }
  }
  const changeProvider = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const changeOperation = (key, value) => setForm(current => ({ ...current,
    operations: current.operations.map((operation, index) => index === active ? { ...operation, [key]: value } : operation) }))
  const addOperation = () => {
    setForm(current => ({ ...current, operations: [...current.operations, newOperation()] }))
    setActive(form.operations.length); setView('base')
  }
  const removeOperation = () => {
    setForm(current => ({ ...current, operations: current.operations.filter((_, index) => index !== active) }))
    setActive(Math.min(active, form.operations.length - 2)); setView('base')
  }
  const jsonFields = [['inputSchema', '请求 Schema（JSON）', 'input'], ['outputSchema', '返回 Schema（JSON）', 'output'],
    ['example', '请求示例（JSON）', 'examples'], ['headers', '认证请求头（JSON，选填）', 'examples']]
  const idPattern = /^[a-z][a-z0-9_]{0,23}$/
  const submit = async event => {
    event.preventDefault()
    if (saving.current || pendingImport) return
    saving.current = true; setBusy(true); setError('')
    try {
      if (nativeReference) {
        onCreated(await platformRequest('/apis', nativeReference))
        return
      }
      const operations = [], ids = new Set()
      for (const [index, operation] of form.operations.entries()) {
        let targetView = 'base'
        try {
          for (const [key, label] of [['title', '接口名称'], ['id', '接口 ID'], ['description', '接口说明'], ['url', '目标地址']]) {
            if (!operation[key].trim()) throw Error('请填写' + label)
          }
          if (!idPattern.test(operation.id.trim())) throw Error('接口 ID 须以小写字母开头，使用小写字母、数字或下划线，最长 24 位')
          if (ids.has(operation.id.trim())) throw Error('接口 ID 重复，请使用不同的 ID')
          ids.add(operation.id.trim())
          let url
          try { url = new URL(operation.url.trim()) } catch { throw Error('请填写有效的 HTTP(S) 目标地址') }
          if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.hash) throw Error('目标地址须使用 HTTP(S)，认证信息请放在请求头中')
          const parsed = {}
          for (const [key, label, tab] of jsonFields) {
            targetView = tab
            try { parsed[key] = JSON.parse(operation[key]) } catch { throw Error(label + ' 格式错误') }
          }
          operations.push({ id: operation.id.trim(), title: operation.title.trim(), description: operation.description.trim(),
            readOnly: operation.readOnly, url: operation.url.trim(), ...parsed })
        } catch (error) {
          setActive(index); setView(targetView)
          throw Error('接口 ' + (index + 1) + ' · ' + error.message)
        }
      }
      const catalog = await platformRequest('/apis', {
        schemaVersion: 1, id: form.id.trim(), title: form.title.trim(), description: form.description.trim(), version: form.version.trim(), operations,
      })
      onCreated(catalog)
    } catch (error) { setError(error.message) }
    finally { saving.current = false; setBusy(false) }
  }
  const field = (data, change, key, label, props = {}) => h('label', { key, className: 'memory-field' }, label,
    h('input', { required: true, disabled: busy, ...props, value: data[key], onChange: event => change(key, event.target.value) }))
  const idProps = { pattern: '[a-z][a-z0-9_]{0,23}', maxLength: 24, title: '小写字母开头，使用小写字母、数字或下划线，最长 24 位' }
  const operation = form.operations[active]
  return h('dialog', { ref, className: 'memory-dialog platform-add-api', 'aria-labelledby': 'platform-add-api-title',
    onCancel: event => { event.preventDefault(); if (!saving.current) onClose() } },
    h('header', { className: 'memory-dialog-head' }, h('div', null, h('p', null, 'DSH 原生注册 / HTTP POST · 接入规范 v1'), h('h2', { id: 'platform-add-api-title' }, '接入 API')),
      h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭接入 API', disabled: busy, onClick: onClose }, '×')),
    h('form', { id: 'platform-add-api-form', className: 'memory-dialog-body platform-api-form', onSubmit: submit },
      h('div', { className: 'platform-import-bar' },
        h('input', { ref: fileRef, type: 'file', accept: '.json,application/json', hidden: true, disabled: busy, onChange: importFile, 'aria-label': '选择 API 接入 JSON 文件' }),
        h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => fileRef.current.click() }, '导入 JSON'),
        h('span', { className: 'fish-muted' }, '选择 AI 生成的 big-fish-api.json，自动填入全部接口。')),
      pendingImport ? h('section', { className: 'platform-import-setup' },
        h('h3', null, '补充连接信息'), h('p', { className: 'fish-muted' }, pendingImport.definition.title + ' · ' + pendingImport.definition.operations.length + ' 个接口，统一填写一次即可。'),
        pendingImport.needsOrigin ? field({ origin: importOrigin }, (_, value) => setImportOrigin(value), 'origin', '插件所在 DSH 地址', { type: 'url', placeholder: 'http://127.0.0.1:端口' }) : null,
        pendingImport.needsToken ? field({ token: importToken }, (_, value) => setImportToken(value), 'token', '插件 Token（只粘贴值）', { type: 'password', autoComplete: 'off' }) : null,
        h('div', { className: 'memory-actions' }, h('button', { type: 'button', className: 'fish-button fish-primary', onClick: completeImport, disabled: busy }, '填入表单'),
          h('button', { type: 'button', className: 'fish-button', onClick: () => { setPendingImport(null); setImportToken(''); setError('') }, disabled: busy }, '取消导入'))) : null,
      nativeReference ? h('section', { className: 'platform-import-setup' },
        h('h3', null, 'DSH 原生接口'), h('code', null, nativeReference.id),
        h('p', { className: 'fish-muted' }, '引用同一 DSH 中已启用的插件，无需地址或 Token。接入后需启用并授权会话。'),
        h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { setNativeReference(null); setError('') } }, '取消导入')) : null,
      h('fieldset', { className: 'platform-api-manual', disabled: busy || Boolean(nativeReference), hidden: Boolean(nativeReference) },
      h('section', { className: 'platform-api-provider' }, h('h3', null, '提供方信息'),
        h('div', { className: 'platform-api-fields' }, field(form, changeProvider, 'title', '名称', { autoFocus: true }),
          field(form, changeProvider, 'id', '提供方 ID', idProps), field(form, changeProvider, 'version', '版本'), field(form, changeProvider, 'description', '提供方说明'))),
      h('div', { className: 'platform-api-workspace' },
        h('aside', { className: 'platform-api-sidebar' },
          h('div', { className: 'platform-api-list-head' }, h('h3', null, '接口列表'), h('span', { className: 'fish-muted' }, form.operations.length + ' 个')),
          h('nav', { className: 'platform-api-list', 'aria-label': '接口列表' },
            ...form.operations.map((item, index) => h('button', { key: index, type: 'button', 'aria-label': '编辑接口 ' + (index + 1),
              'aria-pressed': active === index, disabled: busy, onClick: () => setActive(index) },
              h('strong', null, item.title || '接口 ' + (index + 1)), h('span', null, item.id || '未填写 ID')))),
          h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: addOperation }, '+ 添加接口')),
        h('section', { className: 'platform-api-editor', 'aria-label': '当前接口编辑器' },
          h('div', { className: 'platform-api-editor-head' },
            h('nav', { className: 'platform-api-tabs', 'aria-label': '接口填写内容' },
              ...[['base', '基本信息'], ['input', '请求 Schema'], ['output', '返回 Schema'], ['examples', '示例与认证']].map(([key, label]) =>
                h('button', { key, type: 'button', className: 'fish-button', 'aria-pressed': view === key, disabled: busy, onClick: () => setView(key) }, label))),
            h('button', { type: 'button', className: 'fish-button fish-danger', disabled: busy || form.operations.length === 1, onClick: removeOperation }, '移除此接口')),
          h('div', { className: 'platform-api-pane' },
            view === 'base' ? h('div', { className: 'platform-api-base' },
              h('div', { className: 'platform-api-fields' }, field(operation, changeOperation, 'title', '接口名称'), field(operation, changeOperation, 'id', '接口 ID', idProps)),
              field(operation, changeOperation, 'description', '接口说明'),
              field(operation, changeOperation, 'url', '目标地址', { type: 'url', placeholder: 'https://your-service.example/api/action' }),
              h('label', { className: 'platform-api-readonly' }, h('input', { type: 'checkbox', disabled: busy, checked: operation.readOnly, onChange: event => changeOperation('readOnly', event.target.checked) }), '此接口只读'),
              h('p', { className: 'fish-muted' }, '发送 POST JSON，远端成功结果须为 {"ok":true,"data":…}。'))
            : h('div', { className: 'platform-api-json' },
              ...jsonFields.filter(([, , tab]) => tab === view).map(([key, label]) => h('label', { key, className: 'memory-field' }, label,
                h('textarea', { required: true, disabled: busy, spellCheck: false, value: operation[key], onChange: event => changeOperation(key, event.target.value) }))),
              h('p', { className: 'fish-muted' }, view === 'examples' ? '认证请求头仅保存在本机配置中。无需认证时填写 {}。' : 'Schema 遵循 v1 规范。返回 Schema 描述成功结果中的 data。'))))))),
    h('footer', { className: 'memory-dialog-foot' },
      error ? h('p', { role: 'alert', className: 'memory-feedback' }, error) : null,
      h('div', { className: 'platform-api-actions' }, h('span', { className: 'fish-muted' }, nativeReference ? '从已安装插件载入接口，接入开关与会话授权保持当前设置。' : form.operations.length + ' 个接口将保存到同一张卡片，创建后开启接入并授权会话。'),
        h('button', { form: 'platform-add-api-form', type: 'submit', className: 'fish-button fish-primary', disabled: busy || Boolean(pendingImport) }, busy ? '接入中…' : '确认接入'))))
}

const PLATFORM_GUIDE_EXAMPLE = {
  openapi: '3.1.0',
  info: { title: '大肥鱼开放平台', version: '1.0.0' },
  paths: {
    '/dsh-big-fish-aio/open-platform/invoke/my_plugin/read': {
      post: {
        operationId: 'big_fish_my_plugin_read', tags: ['我的插件'], summary: '查询记录', description: '读取记录，返回 items。',
        'x-big-fish-read-only': true, 'x-big-fish-session-isolation': true,
        parameters: [{ in: 'header', name: 'X-Big-Fish-Session', required: false,
          description: '已登录管理请求可指定已授权会话，省略时使用 @local。模型会话由宿主确定。', schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': {
          schema: { type: 'object', properties: {}, required: [], additionalProperties: false }, example: {},
        } } },
        responses: { 200: { description: '检查 ok，成功读取 data，失败读取 error。', content: { 'application/json': {
          schema: {
            type: 'object', required: ['ok', 'requestId', 'durationMs'],
            properties: {
              ok: { type: 'boolean' },
              data: { type: 'object', required: ['items'], additionalProperties: false, properties: {
                items: { type: 'array', items: { type: 'object', required: ['id', 'text', 'isOwner'], additionalProperties: false,
                  properties: { id: { type: 'string' }, text: { type: 'string' }, isOwner: { type: 'boolean' } } } },
              } },
              error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } },
              requestId: { type: 'string' }, durationMs: { type: 'integer' },
            },
          },
          example: { ok: true, data: { items: [{ id: 'note-1', text: '明天买牛奶', isOwner: true }] }, requestId: '00000000-0000-4000-8000-000000000001', durationMs: 3 },
        } } } },
      },
    },
  },
}

function PlatformGuideTable({ label, rows, columns = ['字段', '类型', '要求', '作用与约束', '示例'] }) {
  return h('div', { className: 'fish-table-wrap platform-guide-table', role: 'region', 'aria-label': label, tabIndex: 0 },
    h('table', { className: 'fish-table' },
      h('caption', null, label),
      h('thead', null, h('tr', null, ...columns.map(column => h('th', { key: column, scope: 'col' }, column)))),
      h('tbody', null, ...rows.map((row, index) => h('tr', { key: index },
        ...row.map((cell, column) => column === 0
          ? h('th', { key: column, scope: 'row' }, h('code', null, cell))
          : h('td', { key: column }, cell)))))))
}

function PlatformGuide({ onClose }) {
  const ref = React.useRef(null)
  const query = PLATFORM_GUIDE_EXAMPLE.paths[OPEN_PLATFORM_PATH + '/invoke/my_plugin/read'].post
  React.useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  return h('dialog', { ref, className: 'memory-dialog platform-guide', 'aria-labelledby': 'platform-guide-title', onCancel: event => { event.preventDefault(); onClose() } },
    h('header', { className: 'memory-dialog-head' }, h('div', null, h('p', null, '开发参考 · 接入规范 v1'), h('h2', { id: 'platform-guide-title' }, '接入规范与 OpenAPI')),
      h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭接入规范与 OpenAPI', onClick: onClose, autoFocus: true }, '×')),
    h('div', { className: 'memory-dialog-body platform-guide-body' },
      h('div', { className: 'platform-guide-sections' },
        h('section', null, h('h3', null, '接入文件与注册'),
          h(PlatformGuideTable, { label: 'big-fish-api.json · 原生引用文件', rows: [
            ['schemaVersion', 'integer', '必填', '接入文件规范版本，固定为 1', '1'],
            ['transport', 'string', '必填', '同一 DSH 内通过原生服务注册', 'dsh'],
            ['id', 'string', '必填', '匹配已安装插件的提供方 ID', 'my_plugin'],
          ] }),
          h(PlatformCode, { title: 'big-fish-api.json', value: { schemaVersion: 1, transport: 'dsh', id: 'my_plugin' } }),
          h(PlatformGuideTable, { label: '注册与接入流程', columns: ['调用／操作', '作用', '实现要求'], rows: [
            ['ctx.inject(["bigFishOpenPlatform"], callback)', '服务就绪后注册，启停时随依赖重建', '使用可选服务注入，插件自身可独立运行'],
            ['platformCtx.effect(() => service.register(manifest))', '持有并回收 register 返回的注销函数', 'service 为 platformCtx.bigFishOpenPlatform'],
            ['getSessionIsolation(providerId)', '读取平台当前隔离开关', '插件面板只展示状态，平台不可用时按开启隔离处理'],
            ['导出 API 配置', '下载本插件的三字段引用文件', '按钮放在插件面板刷新按钮左侧，复用面板鉴权'],
            ['导入 JSON → 确认接入', '引用已注册的接口与 Schema', '同一 DSH 启用插件和大肥鱼，无需填写地址或 Token'],
            ['开启接入 → 授权会话', '让目标会话获得模型工具', '默认关闭接入、授权为空，只允许绑定工作区内的 QQ 映射会话'],
          ] }),
          h('p', { className: 'fish-muted' }, '文件最大 64 KB，仅含上述三字段。完整插件代码可使用「AI 开发 prompt」生成。')),
        h('section', null, h('h3', null, '提供方与接口字段'),
          h(PlatformGuideTable, { label: '原生 manifest · 一个插件注册一个提供方', rows: [
            ['schemaVersion', 'integer', '必填', '注册清单规范版本', '1'],
            ['id', 'string', '必填', '提供方唯一标识，升级保留', 'my_plugin'],
            ['title', 'string', '必填', '卡片名称与接口分组名称', '我的插件'],
            ['description', 'string', '必填', '说明插件对外提供的能力', '查询插件记录'],
            ['version', 'string', '必填', '提供方自身的接口版本', '1.0.0'],
            ['supportsSessionIsolation', 'boolean', '可选', '存储层实现隔离后设为 true，平台显示隔离开关并提供 isolation 上下文', 'true'],
            ['operations', 'array', '必填', '同一提供方全部接口，数组非空', '[{ id: "read", … }]'],
            ['operations[].id', 'string', '必填', '提供方内唯一，组成调用路径与工具名', 'read'],
            ['operations[].title', 'string', '必填', '接口列表名称与 OpenAPI summary', '查询记录'],
            ['operations[].description', 'string', '必填', '向模型说明接口用途与调用条件', '读取记录，返回 items'],
            ['operations[].readOnly', 'boolean', '必填', 'true 表示查询，处理器应只读数据，写入填 false', 'true'],
            ['operations[].inputSchema', 'object', '必填', '业务参数 Schema，根类型为 object', '{ type: "object", … }'],
            ['operations[].outputSchema', 'object', '必填', 'handler 成功返回的数据 Schema，对应响应 data', '{ type: "object", … }'],
            ['operations[].example', '输入数据', '可选', '符合 inputSchema 的请求示例，省略时按空对象校验', '{}'],
            ['operations[].handler', 'function', '必填', '接收 input、execution，返回成功数据，失败抛错', 'async (input, execution) => data'],
          ] }),
          h('p', { className: 'fish-muted' }, '提供方与接口 ID 均匹配 ^[a-z][a-z0-9_]{0,23}$。handler 直接调用插件业务方法，原生引用文件只负责导入。'),
          h(PlatformGuideTable, { label: '外部 HTTP 清单 · 手动接入时的接口字段', rows: [
            ['operations[].url', 'string', '必填', 'HTTP(S) 目标地址，平台禁止重定向', 'https://api.example.com/notes/read'],
            ['operations[].headers', 'object', '可选', '静态认证请求头，默认空对象，Content-Type 由平台填写，禁用 Host 和连接控制头', '{}'],
          ] }),
          h('p', { className: 'fish-muted' }, 'HTTP 清单根字段为 schemaVersion、id、title、description、version、operations。接口的名称、Schema 和 example 沿用上表，平台将 url 与 headers 映射为调用处理器。')),
        h('section', null, h('h3', null, 'Schema 数据格式'),
          h(PlatformGuideTable, { label: '注册校验支持的 JSON Schema 子集', rows: [
            ['type', 'string', '必填', '支持 object、array、string、number、integer、boolean、null', 'object'],
            ['properties', 'object', 'object 必填', '为每个对象字段声明子 Schema', '{ text: { type: "string" } }'],
            ['required', 'string[]', '可选', '必填字段名须已在 properties 中声明', '["text"]'],
            ['additionalProperties', 'boolean', 'object 必填', '固定 false，拒绝未声明字段', 'false'],
            ['items', 'object', 'array 必填', '数组每一项的 Schema', '{ type: "string" }'],
            ['enum', '标量数组', '可选', '允许值列表非空，每个选项为标量', '["todo", "done"]'],
            ['minLength', 'integer', 'string 可选', '最少 Unicode 码点数，非负整数', '1'],
            ['maxLength', 'integer', 'string 可选', '最多 Unicode 码点数，不小于 minLength', '2000'],
            ['title', 'string', '可选注释', '字段显示名称', '备忘内容'],
            ['description', 'string', '可选注释', '向开发者与模型解释字段', '需要保存的文本'],
            ['default', '数据值', '可选注释', '默认值说明，实际补值由业务处理', 'todo'],
            ['examples', 'array', '可选注释', '字段示例，区别于接口的请求 example', '["明天买牛奶"]'],
          ] }),
          h('p', { className: 'fish-muted' }, '输入和成功数据均校验，嵌套最多 12 层。integer 须为安全整数，number 须为有限数值。$ref、oneOf、format、minimum 等字段会被拒绝。')),
        h('section', null, h('h3', null, '执行上下文与会话权限'),
          h(PlatformGuideTable, { label: 'handler(input, execution) · 第二个参数由平台提供', rows: [
            ['signal', 'AbortSignal', '平台提供', '向后续异步操作传递取消与 15 秒超时', 'execution.signal'],
            ['requestId', 'string', '平台提供', '关联本次调用的 UUID', 'execution.requestId'],
            ['source', 'string', '平台提供', '区分模型调用与已登录管理调用', 'model / test'],
            ['sessionId', 'string', '按调用来源', '模型调用来自宿主，管理调用可用已授权会话请求头指定', 'execution.sessionId'],
            ['isOwner', 'boolean', '平台提供', '已核验本轮只有主人发言为 true，非主人、混合或未知来源为 false，管理页手工调用为 true', 'execution.isOwner'],
            ['isolation', '冻结对象', '声明隔离能力后', '可信存储访问上下文，缺少时拒绝会话业务调用', 'execution.isolation'],
            ['isolation.enabled', 'boolean', '上下文提供', '平台卡片隔离开关，默认开启', 'true'],
            ['isolation.sessionId', 'string', '上下文提供', '新建记录保存的归属，本机管理范围为 @local', 'session-demo-001'],
            ['isolation.assertCurrent()', 'function', '存储层调用', '复核授权、消息来源、隔离设置与取消状态', '排队、读取后、返回前、原子提交前'],
          ] }),
          h(PlatformGuideTable, { label: '存储层权限矩阵', columns: ['场景', '可访问范围', '实现要求'], rows: [
            ['隔离开启', '当前 isolation.sessionId 的记录', '先过滤再搜索、排序、计数与分页，按 ID 读取、修改、完成和删除均校验归属'],
            ['隔离关闭', '获授权会话共享读写记录', '保留所有原归属，新记录继续写入实际 sessionId，再开启时恢复隔离'],
            ['QQ 主人', '遵守同一套隔离规则', 'isOwner 记录来源，访问范围由会话隔离决定'],
            ['面板／页面测试', '@local 本机范围', '已登录面板手工新建 isOwner=true，隔离关闭时采用共享范围'],
            ['旧记录未知归属', '@local 本机待整理范围', '保留原数据，采用明确的历史兼容策略'],
            ['调用上下文缺失', '拒绝会话业务调用', '缺少 isolation 或布尔 isOwner 时提示升级'],
            ['授权或隔离变化', '中止在途操作', '检查 signal 与 assertCurrent()，原子提交前再次复核'],
            ['其他 HTTP 入口', '按远端自身的认证和权限处理', '通用 HTTP 清单仅转发业务参数，未传递原生 isolation、isOwner 协议'],
          ] }),
          h('p', { className: 'fish-muted' }, '模型参数仅填写业务内容。归属从 execution.isolation.sessionId 取得，来源从 execution.isOwner 取得，幂等键始终按会话区分。')),
        h('section', null, h('h3', null, '记录格式与数据示例'),
          h(PlatformGuideTable, { label: '示例插件内部记录 · 与模型请求体分开定义', rows: [
            ['id', 'string', '业务定义', '记录主键，读取与修改时校验会话归属', 'note-1'],
            ['text', 'string', '业务定义', '示例业务字段，遵循插件自身 Schema', '明天买牛奶'],
            ['sessionId', 'string', '隔离实现要求', '创建时保存可信会话，修改时保留原归属', 'session-demo-001'],
            ['isOwner', 'boolean', '来源实现要求', '新建保存平台值，手工新建默认 true，查询返回原标记，修改与完成保留创建时标记', 'true'],
            ['idempotencyKey', 'string', '业务可选', '同一会话内相同键与内容只提交一次，相同键对应不同内容时拒绝', 'note-demo-001'],
          ] }),
          h(PlatformCode, { title: '插件持久化记录示例', value: {
            id: 'note-1', text: '明天买牛奶', sessionId: 'session-demo-001', isOwner: true, idempotencyKey: 'note-demo-001',
          } }),
          h('p', { className: 'fish-muted' }, '示例查询只返回 id、text、isOwner。旧记录缺少 isOwner 时若按 true 兼容，应说明该值无法还原历史发送者。')),
        h('section', null, h('h3', null, 'OpenAPI 文档字段'),
          h(PlatformGuideTable, { label: '平台依据同一份原生清单生成 OpenAPI 3.1', rows: [
            ['openapi', 'string', '文档版本', 'OpenAPI 描述格式版本', '3.1.0'],
            ['info.title', 'string', '文档信息', '平台接口文档标题', '大肥鱼开放平台'],
            ['info.version', 'string', '文档信息', '接口文档的版本标识', '1.0.0'],
            ['paths', 'object', '路径集合', '按调用路径收录已注册接口', '/…/invoke/my_plugin/read'],
            ['paths[path].post', 'object', '操作定义', '声明该路径使用 POST JSON 调用', '{ operationId, … }'],
            ['post.operationId', 'string', '操作标识', '与模型工具名对应', 'big_fish_my_plugin_read'],
            ['post.tags', 'string[]', '接口分组', '来自提供方 title', '["我的插件"]'],
            ['post.summary', 'string', '接口名称', '来自 operations[].title', '查询记录'],
            ['post.description', 'string', '接口说明', '来自 operations[].description', '读取记录，返回 items'],
            ['post.x-big-fish-read-only', 'boolean', '平台扩展', '对应接口 readOnly 标记', 'true'],
            ['post.x-big-fish-session-isolation', 'boolean', '平台扩展', '文档生成时的当前隔离开关状态', 'true'],
            ['post.parameters', 'array', '支持隔离时', '描述可选的已登录管理请求头', '[{ in, name, … }]'],
            ['parameters[].in', 'string', '参数位置', '会话选择放在 HTTP 请求头', 'header'],
            ['parameters[].name', 'string', '参数名', '平台校验目标会话属于已授权绑定工作区', 'X-Big-Fish-Session'],
            ['parameters[].required', 'boolean', '是否必填', '省略时，适配隔离的接口使用本机 @local 范围', 'false'],
            ['parameters[].description', 'string', '参数说明', '解释管理用途与默认范围', '指定已授权会话'],
            ['parameters[].schema', 'object', '参数类型', '请求头的类型约束', '{ type: "string" }'],
            ['post.requestBody.required', 'boolean', '请求体要求', '无业务参数时传空对象', 'true'],
            ['requestBody.content.application/json.schema', 'object', '输入格式', '映射原生 inputSchema', '{ type: "object", … }'],
            ['requestBody.content.application/json.example', '输入数据', '请求示例', '映射原生 example', '{}'],
            ['post.responses.200.description', 'string', '状态说明', '业务执行结果用 ok 区分成功与失败', '检查 ok、data、error'],
            ['responses.200.content.application/json.schema', 'object', '响应格式', '统一外层包裹 outputSchema 对应的 data', '{ properties: { ok, data, … } }'],
            ['responses.200.content.application/json.example', '响应数据', '文档示例', '本页为单个接口提供合成成功结果', '{ ok: true, data: … }'],
          ] }),
          h(PlatformCode, { title: 'my_plugin/read · 单个接口 OpenAPI 示例', value: PLATFORM_GUIDE_EXAMPLE })),
        h('section', null, h('h3', null, '调用与响应格式'),
          h(PlatformGuideTable, { label: '平台 HTTP 管理接口 · 路径前缀 /dsh-big-fish-aio/open-platform', columns: ['方法与相对路径', '功能', '输入／结果'], rows: [
            ['GET /catalog', '读取接口目录、接入状态与有效会话授权', '返回 providers、sessions、workspaceId'],
            ['GET /openapi.json', '生成全部已注册接口的 OpenAPI 3.1 文档', '返回 openapi、info、paths'],
            ['POST /apis', '导入原生引用或外部 HTTP 清单', '原生引用为 schemaVersion、transport、id'],
            ['POST /connect', '保存接入、会话授权与隔离设置', 'providerId、enabled、sessionIds，可选 sessionIsolation'],
            ['POST /remove', '移除卡片并撤销授权，保留配置与业务数据', 'providerId，恢复需重新导入和授权'],
            ['POST /invoke/{providerId}/{operationId}', '调用指定处理器', '业务参数 → 统一响应'],
          ] }),
          h(PlatformGuideTable, { label: '查询接口调用约定', columns: ['项目', '值／限制', '说明'], rows: [
            ['Method', 'POST', '管理入口与模型工具共用同一处理器'],
            ['Path', OPEN_PLATFORM_PATH + '/invoke/my_plugin/read', '路径由 providerId 与 operationId 组成'],
            ['Content-Type', 'application/json', '请求体为 inputSchema 描述的对象'],
            ['管理鉴权', 'DSH 本人登录态及同源校验', '原生导入无需额外填写 Token'],
            ['模型权限', '接入开启 + 会话授权', '仅授权绑定工作区内的 QQ 映射会话'],
            ['请求体大小', '最多 64 KB', '参数错误返回 ok=false'],
            ['执行时限', '15 秒', '传递 signal，写入超时后核对结果再重试'],
            ['业务结果', 'HTTP 200', '成功与业务失败均需读取 ok'],
            ['管理报文错误', '4xx 或 503', '读取 error.message，可能没有 requestId 与 durationMs'],
            ['外部 HTTP API', 'POST JSON，远端成功返回 {ok:true,data:…}', '沿用远端认证，远端响应上限 1 MB'],
          ] }),
          h(PlatformGuideTable, { label: '响应外层及示例接口成功数据', rows: [
            ['ok', 'boolean', '始终返回', '本次调用是否成功', 'true / false'],
            ['data', 'outputSchema 对应类型', '成功时', 'handler 直接返回的业务数据', '{ items: […] }'],
            ['error', 'object', '失败时', '平台或管理入口的错误详情', '{ code, message }'],
            ['error.code', 'string', '业务调用失败时', '当前平台统一业务错误代码', 'CALL_FAILED'],
            ['error.message', 'string', '失败时', '错误原因，管理报文错误也提供此字段', '此会话未获接口授权或已离开绑定工作区'],
            ['requestId', 'string', '业务结果必有', '本次调用的 UUID', '00000000-0000-4000-8000-000000000001'],
            ['durationMs', 'integer', '业务结果必有', '调用耗时，单位毫秒', '3'],
            ['data.items', 'array', '本示例成功时', '查询返回的可见记录', '[{ id, text, isOwner }]'],
            ['data.items[].id', 'string', '本示例每项必有', '记录 ID', 'note-1'],
            ['data.items[].text', 'string', '本示例每项必有', '记录内容', '明天买牛奶'],
            ['data.items[].isOwner', 'boolean', '本示例每项必有', '记录创建时保存的来源标记', 'true'],
          ] }),
          h('div', { className: 'platform-guide-examples' },
            h(PlatformCode, { title: '请求体 · application/json', value: query.requestBody.content['application/json'].example }),
            h(PlatformCode, { title: '成功响应 · HTTP 200', value: query.responses[200].content['application/json'].example }),
            h(PlatformCode, { title: '失败响应 · HTTP 200', value: {
              ok: false, error: { code: 'CALL_FAILED', message: '此会话未获接口授权或已离开绑定工作区' },
              requestId: '00000000-0000-4000-8000-000000000002', durationMs: 1,
            } }))))))
}

function PlatformPrompt({ onClose, notify }) {
  const dialogRef = React.useRef(null)
  const textRef = React.useRef(null)
  React.useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => { if (dialog.open) dialog.close() }
  }, [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PLATFORM_PLUGIN_PROMPT)
      notify('Prompt 已复制。')
    } catch {
      textRef.current?.focus()
      textRef.current?.select()
      notify('复制失败，已选中全文，请手动复制。')
    }
  }
  return h('dialog', { ref: dialogRef, className: 'memory-dialog platform-prompt', 'aria-labelledby': 'platform-prompt-title',
    onCancel: event => { event.preventDefault(); onClose() } },
    h('header', { className: 'memory-dialog-head' }, h('h2', { id: 'platform-prompt-title' }, 'AI 开发 prompt'),
      h('button', { type: 'button', className: 'fish-modal-close', 'aria-label': '关闭 AI 开发 prompt', onClick: onClose, autoFocus: true }, '×')),
    h('div', { className: 'memory-dialog-body platform-prompt-body' },
      h('p', { className: 'fish-muted' }, '复制后填写业务需求，交给 DSH 中的 AI 生成插件。'),
      h('textarea', { ref: textRef, readOnly: true, spellCheck: false, value: PLATFORM_PLUGIN_PROMPT, 'aria-label': 'AI 开发 prompt 全文' })),
    h('footer', { className: 'memory-dialog-foot' },
      h('button', { type: 'button', className: 'fish-button fish-primary', onClick: copy }, '复制 Prompt')))
}

function OpenPlatform({ notify }) {
  const [catalog, setCatalog] = React.useState(null)
  const [error, setError] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [guideOpen, setGuideOpen] = React.useState(false)
  const [promptOpen, setPromptOpen] = React.useState(false)
  const [apiOpen, setApiOpen] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const refreshInFlight = React.useRef(false)
  const refresh = async () => {
    if (refreshInFlight.current) return
    refreshInFlight.current = true
    setRefreshing(true)
    try { setCatalog(await platformRequest('/catalog')); setError('') }
    catch (error) { setError(error.message) }
    finally { refreshInFlight.current = false; setRefreshing(false) }
  }
  React.useEffect(() => { refresh() }, [])
  const providers = (catalog?.providers || []).filter(provider => (provider.title + provider.description + provider.operations.map(operation => operation.title).join(' ')).toLowerCase().includes(query.toLowerCase()))
  return h('div', { className: 'platform-page' },
    h('div', { className: 'platform-toolbar' },
      h(FishRefreshButton, { onClick: refresh, busy: refreshing, label: '刷新接口目录' }),
      h('button', { className: 'fish-button', type: 'button', onClick: () => setGuideOpen(true) }, '接入规范与 OpenAPI'),
      h('button', { className: 'fish-button', type: 'button', onClick: () => setPromptOpen(true) }, 'AI 开发 prompt'),
      h('button', { className: 'fish-button fish-primary platform-add-button', type: 'button', onClick: () => setApiOpen(true) }, '+ 接入 API')),
    apiOpen ? h(PlatformAddApi, { apiOrigin: catalog?.apiOrigin || '', onClose: () => setApiOpen(false), onCreated: value => { setCatalog(value); setQuery(''); setApiOpen(false); notify('API 已载入，可在卡片配置接入与会话授权。') } }) : null,
    guideOpen ? h(PlatformGuide, { onClose: () => setGuideOpen(false) }) : null,
    promptOpen ? h(PlatformPrompt, { onClose: () => setPromptOpen(false), notify }) : null,
    error ? h('p', { role: 'alert', className: 'memory-feedback' }, error) : null,
    catalog?.warning ? h('p', { role: 'alert', className: 'memory-feedback' }, catalog.warning) : null,
    h('label', { className: 'memory-field' }, '搜索接口', h('input', { type: 'search', value: query, onChange: event => setQuery(event.target.value), placeholder: '插件名称、功能或接口名称' })),
    h('div', { className: 'platform-providers' }, ...providers.map(provider => h(PlatformProvider, { key: provider.id, provider, sessions: catalog.sessions, onRefresh: setCatalog, notify }))),
    catalog && !providers.length ? h('div', { className: 'memory-empty' }, '无匹配接口。') : null)
}

const FISH_TOAST = { items: [], serial: 0, listeners: new Set() }
function fishNotify(text, options = {}) {
  const value = String(text ?? '').trim()
  if (!value) return
  const id = ++FISH_TOAST.serial
  const normalize = value => typeof value === 'number' && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : undefined
  const publish = () => FISH_TOAST.listeners.forEach(listener => listener())
  FISH_TOAST.items = [{ id, text: value, tone: options.tone, actions: options.actions, progress: normalize(options.progress) }, ...FISH_TOAST.items]
  publish()
  return {
    update(patch) {
      FISH_TOAST.items = FISH_TOAST.items.map(item => item.id === id ? { ...item, ...patch,
        ...(Object.hasOwn(patch, 'progress') ? { progress: normalize(patch.progress) } : {}) } : item)
      publish()
    },
    close() { fishToastDone(id) },
  }
}
function fishToastDone(id) {
  FISH_TOAST.items = FISH_TOAST.items.filter(item => item.id !== id)
  FISH_TOAST.listeners.forEach(listener => listener())
}
function FishNotice({ item }) {
  const [hover, setHover] = React.useState(false), [focus, setFocus] = React.useState(false)
  const [closing, setClosing] = React.useState(false)
  const remaining = React.useRef(5000)
  const controlled = item.progress !== undefined
  const paused = !controlled && (hover || focus)
  React.useEffect(() => {
    if (!closing) return
    const timer = setTimeout(() => fishToastDone(item.id), 180)
    return () => clearTimeout(timer)
  }, [closing, item.id])
  React.useEffect(() => {
    if (closing || paused) return
    if (controlled && item.progress < 100) { remaining.current = 5000; return }
    const started = Date.now(), timer = setTimeout(() => setClosing(true), remaining.current)
    return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (Date.now() - started)) }
  }, [paused, closing, item.id, item.progress])
  return h('article', { className: 'fish-notice-card' + (closing ? ' is-closing' : ''), 'data-tone': item.tone || 'info', role: 'status',
    onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    onFocusCapture: () => setFocus(true), onBlurCapture: event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false) } },
    h('div', { className: 'fish-notice-text' }, item.text),
    h('button', { type: 'button', className: 'fish-notice-close', 'aria-label': '关闭通知', onClick: () => setClosing(true) }, '×'),
    item.actions?.length ? h('div', { className: 'fish-notice-actions' }, ...item.actions.map((action, index) =>
      h('button', { type: 'button', key: index, onClick: () => { action.onClick?.(); setClosing(true) } }, action.label))) : null,
    h('i', { className: 'fish-notice-progress', 'aria-hidden': controlled ? undefined : true, role: controlled ? 'progressbar' : undefined,
      'aria-label': controlled ? '任务进度' : undefined, 'aria-valuemin': controlled ? 0 : undefined, 'aria-valuemax': controlled ? 100 : undefined, 'aria-valuenow': item.progress,
      style: controlled ? { animation: 'none', transform: 'scaleX(' + item.progress / 100 + ')' } : { animationPlayState: paused || closing ? 'paused' : 'running' } }))
}
function NotificationHost() {
  const [items, setItems] = React.useState(FISH_TOAST.items), ref = React.useRef(null)
  const positions = React.useRef(new Map())
  const [mount] = React.useState(() => {
    const node = document.createElement('div')
    node.style.display = 'contents'
    return node
  })
  const { createPortal } = require('react-dom')
  React.useLayoutEffect(() => {
    const attach = () => {
      const modal = document.activeElement?.closest('dialog:modal') || [...document.querySelectorAll('dialog:modal')].at(-1)
      const target = modal || document.body, notice = ref.current
      if (mount.parentNode !== target) { notice?.hidePopover?.(); target.appendChild(mount) }
      if (FISH_TOAST.items.length && notice?.isConnected && !notice.matches(':popover-open')) notice.showPopover?.()
    }
    attach()
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
    document.addEventListener('focusin', attach, true)
    return () => { observer.disconnect(); document.removeEventListener('focusin', attach, true); mount.remove() }
  }, [mount])
  React.useEffect(() => {
    const update = () => setItems(FISH_TOAST.items)
    FISH_TOAST.listeners.add(update); update()
    return () => FISH_TOAST.listeners.delete(update)
  }, [])
  React.useLayoutEffect(() => {
    if (items.length) ref.current?.showPopover?.()
    else ref.current?.hidePopover?.()
  }, [items.length])
  React.useLayoutEffect(() => {
    const stack = ref.current
    const observer = new ResizeObserver(() => {
      positions.current = new Map(Array.from(stack.querySelectorAll('.fish-notice-slot'), slot => [slot.dataset.noticeId, slot.offsetTop]))
    })
    observer.observe(stack)
    return () => observer.disconnect()
  }, [])
  React.useLayoutEffect(() => {
    const stack = ref.current
    if (!stack) return
    if (items[0] && !positions.current.has(String(items[0].id))) stack.scrollTop = 0
    const next = new Map(), stackTop = stack.getBoundingClientRect().top
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    for (const slot of stack.querySelectorAll('.fish-notice-slot')) {
      const id = slot.dataset.noticeId, top = slot.offsetTop, previous = positions.current.get(id)
      if (reduced) slot.getAnimations().forEach(animation => animation.cancel())
      else if (previous !== undefined && previous !== top) {
        // 连续插入时从当前视觉位置续接，避免打断下移后跳动。
        const shift = slot.getBoundingClientRect().top - stackTop + stack.scrollTop - top
        slot.getAnimations().forEach(animation => animation.cancel())
        slot.animate([{ transform: 'translateY(' + (previous - top + shift) + 'px)' }, { transform: 'translateY(0)' }],
          { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' })
      }
      next.set(id, top)
    }
    positions.current = next
  }, [items])
  return createPortal(h('div', { ref, popover: 'manual', className: 'big-fish-notice fish-notice-stack', 'aria-label': '全局通知' },
    h('style', null, FISH_THEME_CSS), ...items.map(item => h('div', { key: item.id, className: 'fish-notice-slot', 'data-notice-id': item.id }, h(FishNotice, { item })))), mount)
}

const React = require('react')
const h = React.createElement
const QQ = components['dsh-qq-link'].Section
const Memory = components['dsh-fish-memory'].Section
const Mood = components['dsh-feiyu-mood'].Section
const Speak = components['dsh-speak-up'].Section
const PANEL_ID = 'big-fish-aio'
const tabs = ['总览', 'QQ 互通', '长期记忆', '鱼的心情', '主动搭话', '开放平台', '文件管理', '运行日志', '吃大米饭', '更新与来源']
const UPDATES_TAB = tabs.length - 1
const FILE_MANAGER_TAB = tabs.indexOf('文件管理')
const TAB_ICONS = ['home', 'qq', 'memory', 'mood', 'speak', 'link', 'folder', 'log', 'rice', 'update']
const TAB_STAMPS = ['封面', '连接', '收藏', '观测', '问候', '接入', '归档', '回声', '米粒', '来处']
const DESCRIPTIONS = [
  '',
  '配置 QQ 连接、会话映射与消息策略。',
  '管理长期记忆、语义检索与召回策略。',
  '查看心情状态、情绪维度及变化记录，配置实例归属、判断模型和上下文注入。',
  '配置主动消息的触发时机、概率与目标会话。',
  '接入插件接口并管理会话授权。',
  '统一管理 QQ 图片、QQ 文件和表情包素材。',
  '查看 QQ 互通的实时运行日志。',
  '查看工作区 Token 用量、估算费用与限额。',
  '管理更新渠道，查看版本与项目来源。',
]
const submenus = {
  1: ['连接', '绑定', '消息策略', '角色设定', 'QQ 账号', 'QQ 空间', '表情包', '语音转写', '语音发送', '图片与文件', '聊天记录'].map(x => [x, x]),
  2: ['记忆库', 'RAG 语义召回'].map(x => [x, x]),
  3: [['mood', '心情'], ['bind', '会话绑定'], ['judge', '判断与注入'], ['charm', '挂饰']],
}
const TAB_ENGLISH = ['OVERVIEW', 'QQ LINK', 'MEMORY', 'MOOD', 'PROACTIVE MESSAGES', 'OPEN PLATFORM', 'FILE MANAGER', 'RUNTIME LOGS', 'TOKEN USAGE', 'UPDATES & SOURCES']
const SUBMENU_ENGLISH = {
  1: ['CONNECTION', 'BINDINGS', 'MESSAGE POLICIES', 'ROLES', 'QQ ACCOUNT', 'QQ SPACE', 'STICKERS', 'SPEECH TO TEXT', 'TEXT TO SPEECH', 'IMAGES & FILES', 'CHAT HISTORY'],
  2: ['LIBRARY', 'RAG SEMANTIC RECALL'],
  3: ['MOOD STATUS', 'BINDINGS', 'ASSESSMENT & CONTEXT', 'CHARMS'],
}
const css = FISH_THEME_CSS

// ── 更新后自动重开插件页：更新会重载插件并关掉页面，用 localStorage 记住“刚更新过” ──
const REOPEN_KEY = 'big-fish-aio.reopen-after-update'
const 标记更新后重开 = () => {
  try { if (typeof window !== 'undefined') window.localStorage.setItem(REOPEN_KEY, String(Date.now())) } catch {}
}
const 清除更新后重开 = () => {
  try { if (typeof window !== 'undefined') window.localStorage.removeItem(REOPEN_KEY) } catch {}
}
const 需要更新后重开 = () => {
  try {
    if (typeof window === 'undefined') return false
    const at = Number(window.localStorage.getItem(REOPEN_KEY) || 0)
    return at > 0 && Date.now() - at < 5 * 60000
  } catch { return false }
}
function 挂载更新后重开(ctx, readiness) {
  let stopped = false, timer = null, attempts = 0
  const open = () => {
    timer = null
    if (stopped || !需要更新后重开()) return
    if (readiness?.getSnapshot?.()?.syncing) return
    try {
      const layout = ctx.get('layout')
      if (typeof layout?.selectPanel === 'function') {
        layout.selectPanel(PANEL_ID)
        清除更新后重开()
        return
      }
    } catch {}
    if (++attempts < 10) timer = setTimeout(open, 250)
  }
  const schedule = () => {
    if (!stopped && timer === null && 需要更新后重开()) timer = setTimeout(open, 0)
  }
  const unsubscribe = readiness?.subscribe?.(schedule)
  // 不在槽位注册事务里改变布局；等重载提交后的下一轮事件再切页。
  schedule()
  return () => { stopped = true; clearTimeout(timer); unsubscribe?.() }
}

const FISH_HELP = { current: null, serial: 0, timer: null, listeners: new Set() }
function fishHideHelp() {
  if (FISH_HELP.timer) { clearTimeout(FISH_HELP.timer); FISH_HELP.timer = null }
  if (!FISH_HELP.current) return
  FISH_HELP.current = null
  FISH_HELP.listeners.forEach(fn => fn())
}
function fishScheduleHelpHide(delay = 160) {
  if (!FISH_HELP.current) return
  if (FISH_HELP.timer) clearTimeout(FISH_HELP.timer)
  FISH_HELP.timer = setTimeout(() => { FISH_HELP.timer = null; fishHideHelp() }, delay)
}
function fishCancelHelpHide() {
  if (!FISH_HELP.timer) return
  clearTimeout(FISH_HELP.timer)
  FISH_HELP.timer = null
}
function fishShowHelp(text, anchor, label, link) {
  if (!text || !anchor || typeof window === 'undefined') return
  fishCancelHelpHide()
  const rect = anchor.getBoundingClientRect()
  const width = Math.min(340, Math.max(200, window.innerWidth - 24))
  const left = Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12))
  const placement = rect.bottom + 190 > window.innerHeight && rect.top > 190 ? 'above' : 'below'
  FISH_HELP.current = {
    id: ++FISH_HELP.serial,
    text,
    label: label || '字段说明',
    link: link || null,
    anchor,
    left,
    top: placement === 'above' ? rect.top - 8 : rect.bottom + 8,
    width,
    placement,
  }
  FISH_HELP.listeners.forEach(fn => fn())
}
const FISH_CONFIRM = { current: null, serial: 0, listeners: new Set() }
function fishFinishConfirm(ok) {
  const item = FISH_CONFIRM.current
  if (!item) return
  FISH_CONFIRM.current = null
  FISH_CONFIRM.listeners.forEach(fn => fn())
  item.resolve(Boolean(ok))
}
function fishAskConfirm(options = {}) {
  if (FISH_CONFIRM.current) fishFinishConfirm(false)
  return new Promise(resolve => {
    FISH_CONFIRM.current = {
      id: ++FISH_CONFIRM.serial,
      title: options.title || '确认操作？',
      description: options.description || '',
      confirmText: options.confirmText || '确认',
      cancelText: options.cancelText || '取消',
      danger: options.danger === true,
      resolve,
    }
    FISH_CONFIRM.listeners.forEach(fn => fn())
  })
}
function FishConfirmHost() {
  const [item, setItem] = React.useState(FISH_CONFIRM.current)
  React.useEffect(() => {
    const update = () => setItem(FISH_CONFIRM.current)
    FISH_CONFIRM.listeners.add(update)
    update()
    return () => FISH_CONFIRM.listeners.delete(update)
  }, [])
  if (!item) return null
  return h(FishModal, { className: 'fish-modal fish-confirm' },
    h('div', {
      className: 'fish-modal-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-confirm-title', 'aria-describedby': 'fish-confirm-desc',
      onKeyDown: (e) => { if (e.key === 'Escape') fishFinishConfirm(false) },
    },
    h('span', { className: 'fish-kicker' }, 'CONFIRM · 操作确认'),
    h('h2', { id: 'fish-confirm-title' }, item.title),
    h('p', { id: 'fish-confirm-desc', className: 'fish-modal-desc' }, item.description),
    h('div', { className: 'fish-modal-actions' },
      h('button', { type: 'button', className: 'fish-button fish-modal-cancel', autoFocus: true, onClick: () => fishFinishConfirm(false) }, item.cancelText),
      h('button', { type: 'button', className: 'fish-button ' + (item.danger ? 'fish-danger' : 'fish-primary'), onClick: () => fishFinishConfirm(true) }, item.confirmText))))
}

const FISH_TEXT = { current: null, serial: 0, listeners: new Set() }
function fishFinishText(value) {
  const item = FISH_TEXT.current
  if (!item) return
  FISH_TEXT.current = null
  FISH_TEXT.listeners.forEach(fn => fn())
  item.resolve(value === null || value === undefined ? null : String(value))
}
function fishAskText(options = {}) {
  if (FISH_TEXT.current) fishFinishText(null)
  return new Promise(resolve => {
    FISH_TEXT.current = {
      id: ++FISH_TEXT.serial,
      title: options.title || '编辑文字',
      description: options.description || '',
      value: options.value == null ? '' : String(options.value),
      placeholder: options.placeholder || '',
      confirmText: options.confirmText || '保存',
      cancelText: options.cancelText || '取消',
      maxLength: options.maxLength || 20000,
      resolve,
    }
    FISH_TEXT.listeners.forEach(fn => fn())
  })
}
function FishTextHost() {
  const [item, setItem] = React.useState(FISH_TEXT.current)
  const [text, setText] = React.useState('')
  React.useEffect(() => {
    const update = () => setItem(FISH_TEXT.current)
    FISH_TEXT.listeners.add(update)
    update()
    return () => FISH_TEXT.listeners.delete(update)
  }, [])
  React.useEffect(() => { setText(item?.value || '') }, [item && item.id])
  if (!item) return null
  return h(FishModal, { className: 'fish-modal' },
    h('div', { className: 'fish-modal-card qq-text-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-text-title', 'aria-describedby': 'fish-text-desc',
      onKeyDown: (e) => { if (e.key === 'Escape') fishFinishText(text) } },
    h('span', { className: 'fish-kicker' }, 'EDIT · 角色设定'),
    h('h2', { id: 'fish-text-title' }, item.title),
    item.description ? h('p', { id: 'fish-text-desc', className: 'fish-modal-desc' }, item.description) : null,
    h('textarea', { className: 'qq-text-modal-input', 'aria-label': '角色设定内容', autoFocus: true, maxLength: item.maxLength, value: text, placeholder: item.placeholder,
      onBlur: () => fishFinishText(text), onChange: (e) => setText(e.target.value) }),
    h('div', { className: 'fish-modal-actions' },
      h('button', { type: 'button', className: 'fish-button fish-modal-cancel', onClick: () => fishFinishText(text) }, '关闭'),
      null)))
}

const FISH_WRITER = { open: false, serial: 0, listeners: new Set() }
function fishOpenRoleWriter() {
  FISH_WRITER.open = true
  FISH_WRITER.serial++
  FISH_WRITER.listeners.forEach(fn => fn())
}
function FishRoleWriterHost() {
  const [open, setOpen] = React.useState(FISH_WRITER.open)
  const [need, setNeed] = React.useState('')
  const [result, setResult] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState('')
  React.useEffect(() => {
    const update = () => setOpen(Boolean(FISH_WRITER.open))
    FISH_WRITER.listeners.add(update)
    update()
    return () => FISH_WRITER.listeners.delete(update)
  }, [])
  const close = () => {
    if (busy) return
    FISH_WRITER.open = false
    FISH_WRITER.listeners.forEach(fn => fn())
    setNeed(''); setResult(''); setError('')
  }
  const generate = async () => {
    if (!need.trim() || busy) return
    setBusy(true); setError(''); setResult('')
    try {
      const response = await fetch('/dsh-qq-bridge/role-draft', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 需求: need.trim() }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.ok) throw new Error(data?.说 || '生成失败')
      setResult(String(data.文字 || '').trim())
    } catch (e) { setError(String((e && e.message) || e)) }
    finally { setBusy(false) }
  }
  const copy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
      fishNotify('角色设定已复制', { tone: 'success' })
    } catch (e) { fishNotify('复制失败，请手动选择文本', { holdMs: 6000 }) }
  }
  if (!open) return null
  return h(FishModal, { className: 'fish-modal' },
    h('div', { className: 'fish-modal-card qq-role-writer-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-writer-title',
      onKeyDown: (e) => { if (e.key === 'Escape') close() } },
    h('span', { className: 'fish-kicker' }, 'AI · 专业代写'),
    h('h2', { id: 'fish-writer-title' }, '大肥鱼专业代写'),
    h('p', { className: 'fish-modal-desc' }, '输入需求后生成角色设定，此操作消耗 DeepSeek Token。'),
    h(FishTextarea, { className: 'qq-role-writer-input', 'aria-label': '角色设定需求', autoFocus: true, value: need, placeholder: '例如：想要一个嘴硬心软、说话简短、会默默关心人的角色。', onChange: (e) => setNeed(e.target.value) }),
    h('div', { className: 'fish-modal-actions' },
      h('button', { type: 'button', className: 'fish-button fish-primary', disabled: busy || !need.trim(), onClick: generate }, busy ? '生成中…' : '生成角色设定'),
      h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: busy, onClick: close }, '关闭')),
    error ? h('p', { className: 'fish-modal-error', role: 'alert' }, error) : null,
    result ? h('div', { className: 'qq-role-writer-result' },
      h('div', { className: 'qq-role-writer-result-head' }, h('strong', null, '生成结果'), h('button', { type: 'button', className: 'fish-button', onClick: copy }, '一键复制')),
      h('pre', { className: 'qq-role-writer-result-text' }, result)) : null))
}

function FishHelpHost() {
  const [item, setItem] = React.useState(FISH_HELP.current)
  const cardRef = React.useRef(null)
  React.useEffect(() => {
    const update = () => setItem(FISH_HELP.current)
    FISH_HELP.listeners.add(update)
    update()
    return () => FISH_HELP.listeners.delete(update)
  }, [])
  React.useEffect(() => {
    if (!item) return
    const hide = () => fishHideHelp()
    const outside = (e) => {
      if (cardRef.current && cardRef.current.contains(e.target)) return
      if (item.anchor && item.anchor !== e.target && !item.anchor.contains(e.target)) fishHideHelp()
    }
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    document.addEventListener('pointerdown', outside, true)
    return () => {
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
      document.removeEventListener('pointerdown', outside, true)
    }
  }, [item && item.id])
  if (!item) return null
  return h('div', {
    ref: cardRef,
    className: 'fish-help-popover', 'data-placement': item.placement, role: 'tooltip',
    style: { left: item.left + 'px', top: item.top + 'px', width: item.width + 'px' },
    onMouseEnter: fishCancelHelpHide,
    onMouseLeave: () => fishScheduleHelpHide(120),
  },
  h('span', { className: 'fish-help-label' }, item.label),
  h('p', null, item.text, item.link ? ' ' : null,
    item.link ? h('button', {
      type: 'button', className: 'fish-help-link',
      onClick: (e) => {
        e.preventDefault()
        const action = item.link.onClick
        fishHideHelp()
        if (typeof action === 'function') action()
      },
    }, item.link.text) : null))
}

// 线性图标统一走这一份，保证侧栏、状态卡和页头图章的手感一致。
const ICONS = {
  home: { paths: ['M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.6v-5.6H10V21H5a1 1 0 0 1-1-1Z'] },
  qq: { paths: ['M5 5.5h14A1.5 1.5 0 0 1 20.5 7v8.5A1.5 1.5 0 0 1 19 17h-7l-4.6 3.6V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z'], dots: [[7.6, 11.2, 1], [12, 11.2, 1], [16.4, 11.2, 1]] },
  memory: { paths: ['M12 6.2C10 4.9 7.5 4.5 4 4.8v14c3.5-.3 6 .1 8 1.4 2-1.3 4.5-1.7 8-1.4v-14c-3.5-.3-6 .1-8 1.4Z', 'M12 6.2v14'] },
  mood: { paths: ['M12 20s-7-4.2-7-9.4A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 7 3.6C19 15.8 12 20 12 20Z', 'M7.4 12.1h2.2l1.2-2 1.8 4 1.3-2h2.7'] },
  speak: { paths: ['M4 5.5h16v10H9l-5 4Z', 'M18 2.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z'], dots: [[8.2, 10.5, 1], [12, 10.5, 1], [15.8, 10.5, 1]] },
  update: { paths: ['M20 12a8 8 0 1 1-2.4-5.7', 'M20 4v4h-4', 'M12 8.4v3.8l2.4 1.4'] },
  refresh: { paths: ['M3 12a9 9 0 0 1 15.36-6.36L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15.36 6.36L3 16', 'M3 21v-5h5'] },
  link: { paths: ['M9.4 14.6 14.6 9.4', 'M8.1 11.9 6.5 13.5a3.4 3.4 0 0 0 4.8 4.8l1.6-1.6', 'M15.9 12.1l1.6-1.6a3.4 3.4 0 0 0-4.8-4.8l-1.6 1.6'] },
  send: { paths: ['M4 11.5 20 4l-4.5 16-4-6.5Z', 'M11.5 13.5 20 4'] },
  layers: { paths: ['M12 3 21 8l-9 5-9-5Z', 'M3 12l9 5 9-5', 'M3 16l9 5 9-5'] },
  folder: { paths: ['M3 7.2A1.2 1.2 0 0 1 4.2 6h5l2 2.4h8.6A1.2 1.2 0 0 1 21 9.6v8.2a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 17.8Z', 'M3 10h18'] },
  log: { paths: ['M4 5h16v14H4Z', 'm8 9 3 3-3 3', 'M13 15h4'] },
  heart: { paths: ['M12 20s-7-4.2-7-9.4A3.6 3.6 0 0 1 12 7a3.6 3.6 0 0 1 7 3.6C19 15.8 12 20 12 20Z'] },
  spark: { paths: ['M12 3.2l1.7 5 5 1.7-5 1.7-1.7 5-1.7-5-5-1.7 5-1.7Z', 'M18.8 16.2l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z'] },
  rice: { paths: ['M4 11h16a8 8 0 0 1-16 0Z', 'M3 21h18', 'M9 8c0-1.5 1-2.5 1-4', 'M15 8c0-1.5 1-2.5 1-4'] },
  pin: { paths: ['M12 21s6-5.4 6-10a6 6 0 1 0-12 0c0 4.6 6 10 6 10Z'], dots: [[12, 11, 2]] },
  sparkle: { paths: ['M12 2.5l1.2 3.6 3.6 1.2-3.6 1.2L12 12.1 10.8 8.5 7.2 7.3l3.6-1.2Z'] },
}

function Glyph({ name, size = 22, className = '' }) {
  const icon = ICONS[name] || ICONS.spark
  return h('svg', {
    className: 'fish-glyph' + (className ? ' ' + className : ''), width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true, focusable: 'false',
  },
  ...icon.paths.map((d, i) => h('path', { key: 'p' + i, d })),
  ...(icon.dots || []).map(([cx, cy, r], i) => h('circle', { key: 'd' + i, cx, cy, r, fill: 'currentColor', stroke: 'none' })))
}

function FishIcon({ size = 24 }) {
  return h('img', {
    src: '/dsh-feiyu-mood/logo.png', width: size, height: size,
    className: 'fish-logo-img', alt: '', 'aria-hidden': true, decoding: 'async', style: { display: 'block' },
  })
}

function Wave({ className = '' }) {
  return h('svg', { className: 'fish-hero-wave ' + className, viewBox: '0 0 1200 190', preserveAspectRatio: 'none', 'aria-hidden': true, focusable: 'false' },
    h('path', { className: 'fish-wave-back', d: 'M0 94C130 44 260 42 388 80S648 160 802 130 1050 58 1200 96V190H0Z' }),
    h('path', { className: 'fish-wave-front', d: 'M0 134C150 94 284 98 432 128S704 178 864 148 1084 100 1200 128V190H0Z' }),
    h('path', { className: 'fish-wave-foam', d: 'M0 108C160 62 300 64 456 98S720 154 880 126 1090 84 1200 108' }))
}

function Bubbles({ className = '' }) {
  return h('svg', { className: 'fish-bubbles ' + className, viewBox: '0 0 220 220', fill: 'none', 'aria-hidden': true, focusable: 'false' },
    h('circle', { cx: 42, cy: 158, r: 26 }),
    h('circle', { cx: 94, cy: 196, r: 10 }),
    h('circle', { cx: 150, cy: 172, r: 5 }),
    h('circle', { cx: 186, cy: 118, r: 16 }),
    h('circle', { cx: 158, cy: 74, r: 4 }),
    h('path', { d: 'M24 148c2-8 8-12 16-13M176 108c1-6 6-9 12-10' }))
}

function Sparkle({ className = '' }) {
  return h('svg', { className: 'fish-sparkle ' + className, viewBox: '0 0 40 40', fill: 'none', 'aria-hidden': true, focusable: 'false' },
    h('path', { d: 'M20 3Q23 17 34 20Q23 23 20 37Q17 23 6 20Q17 17 20 3Z' }),
    h('path', { d: 'M33 4Q34 10 39 11Q34 12 33 18Q32 12 27 11Q32 10 33 4Z' }))
}

async function request(path, options) {
  const response = await fetch(path, { cache: 'no-store', ...options })
  let data
  try { data = await response.json() } catch { throw new Error('接口未返回有效 JSON（HTTP ' + response.status + '）') }
  if (!response.ok || !data.ok) throw Object.assign(new Error(data.error || data.说 || '接口请求失败：' + response.status), { data })
  return data
}
const button = (label, onClick, primary = false, disabled = false) => h('button', { type: 'button', className: 'fish-button' + (primary ? ' fish-primary' : ''), onClick, disabled }, label)
const link = (url, label) => h('a', { href: url, target: '_blank', rel: 'noreferrer' }, label)

// 总览的每日一句：从最近一条未被取代的记忆里取一小段，再按心情基调选语气。
// 同一天、同一份数据会得到同一句；换一天会换模板。没有记忆/心情时用通用句。
function 记忆片段(text) {
  let t = String(text || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_#>~“”"「」『』]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  t = t.replace(/^[，,。；;：:\s-]+/, '')
  const first = t.split(/[。！？!?；;]/)[0].trim()
  if (first.length < 4) return ''
  return first.length > 30 ? first.slice(0, 30).replace(/[，,、\s]+$/, '') + '…' : first
}
function 最近记忆(memory) {
  const all = []
  for (const session of (memory?.sessions || [])) {
    for (const item of (session?.memories || [])) {
      if (!item || !item.text || item.已被取代) continue
      const text = 记忆片段(item.text)
      if (!text) continue
      all.push({
        text,
        id: item.id || '',
        time: Date.parse(item.at || '') || 0,
        importance: Number(item.importance) || 0,
      })
    }
  }
  all.sort((a, b) => (b.time - a.time) || (b.importance - a.importance))
  return all[0] || null
}
function 每天一句({ memory, mood } = {}) {
  const 记忆 = 最近记忆(memory)
  const 分值 = Number(mood?.mood)
  const dims = Object.fromEntries((mood?.dims || []).map(d => [d.key, Number(d.value) || 0]))
  let tone = '平静'
  if (Number.isFinite(分值) && (分值 >= 66 || dims.happy >= 60 || dims.sweet >= 60)) tone = '明亮'
  else if (Number.isFinite(分值) && (分值 <= 38 || dims.sad >= 55 || dims.worry >= 55 || dims.heartache >= 55)) tone = '低落'
  const today = new Date()
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000)
  const memo = 记忆?.text || ''
  const withMemo = {
    明亮: [
      `当前心情良好。相关记忆：「${memo}」。`,
      `当前状态积极。相关记忆：「${memo}」。`,
      `当前心情稳定向好。相关记忆：「${memo}」。`,
      `心情与记忆摘要：「${memo}」。`,
    ],
    低落: [
      `当前心情偏低。相关记忆：「${memo}」。`,
      `当前情绪需要关注。相关记忆：「${memo}」。`,
      `当前状态偏低。相关记忆：「${memo}」。`,
      `心情与记忆摘要：「${memo}」。`,
    ],
    平静: [
      `当前心情平稳。相关记忆：「${memo}」。`,
      `当前状态正常。相关记忆：「${memo}」。`,
      `当前心情无显著变化。相关记忆：「${memo}」。`,
      `心情与记忆摘要：「${memo}」。`,
    ],
  }
  const plain = {
    明亮: [
      '当前心情良好。',
      '当前心情稳定向好。',
      '当前状态积极。',
    ],
    低落: [
      '当前心情偏低。',
      '当前情绪需要关注。',
      '当前状态偏低。',
    ],
    平静: [
      '当前心情平稳。',
      '当前状态正常。',
      '当前心情无显著变化。',
    ],
  }
  const pool = memo ? (withMemo[tone] || withMemo.平静) : (plain[tone] || plain.平静)
  const seed = tone + '|' + memo + '|' + String(mood?.moodLabel || '')
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  // 日期每加一天，索引正好加一：同样的记忆/心情下，相邻两天不会撞同一句。
  return pool[(dayNumber + hash) % pool.length]
}

function Overview({ navigate, notify }) {
  const [state, setState] = React.useState({})
  const [welcomeImage] = React.useState(() => BIGFISH_IMAGES[Math.floor(Math.random() * BIGFISH_IMAGES.length)])
  const refresh = async () => {
    const results = await Promise.allSettled([request('/dsh-qq-bridge/state'), request('/dsh-fish-memory/list'), request('/dsh-feiyu-mood/state'), request('/dsh-speak-up/state')])
    const errors = results.filter(r => r.status === 'rejected').map(r => r.reason.message)
    setState({ qq: results[0].value, memory: results[1].value, mood: results[2].value, speak: results[3].value })
    if (errors.length && typeof notify === 'function') notify('读取部分模块状态失败：' + errors.join('；'), { holdMs: 7000 })
  }
  React.useEffect(() => { void refresh() }, [])
  const qq = state.qq, memory = state.memory, mood = state.mood
  const libraries = [...new Map((memory?.sessions || []).map(s => [s.storeId || s.id, s])).values()]
  const connected = Boolean(qq?.NapCat状态?.用户 && !qq?.NapCat状态?.错)
  const moodValue = mood ? String(mood.mood ?? '—') + (mood.moodLabel ? ' · ' + mood.moodLabel : '') : '—'
  const stats = [
    { label: 'QQ 后端', value: !qq ? '—' : qq.NapCat状态?.错 ? '未连接' : qq.NapCat状态?.用户 ? '已连接' : '未连接', hint: qq?.NapCat状态?.昵称 || '配置 NapCat / SnowLuma 连接', icon: 'link', tone: connected ? 'mint' : 'blue' },
    { label: '消息转发', value: !qq ? '—' : qq.配置?.总开关 ? qq.配置?.试运行 ? '试运行' : '已开启' : '已关闭', hint: '沿用原插件的收发开关与绑定策略', icon: 'send', tone: 'blue' },
    { label: '长期记忆', value: !memory ? '—' : memory.全局开关 ? '已开启' : '已关闭', hint: '按会话与 QQ 来源隔离，按需语义召回', icon: 'memory', tone: 'gold' },
    { label: '记忆条目', value: memory ? String(libraries.reduce((n, s) => n + (s.count || 0), 0)) : '—', hint: memory ? libraries.length + ' 个记忆库' : '等待宿主记忆服务', icon: 'layers', tone: 'gold' },
    { label: '鱼的心情', value: moodValue, hint: '按会话或工作区绑定，保留情绪时间线', icon: 'heart', tone: 'rose' },
    { label: '主动搭话', value: !state.speak ? '—' : state.speak.配置?.总开关 ? state.speak.配置?.试运行 ? '试运行' : '已开启' : '已关闭', hint: '复用目标会话的人格、历史、工具和记忆', icon: 'spark', tone: 'mint' },
  ]
  return h('div', { className: 'fish-overview' },
    h('section', { className: 'fish-hero' },
      h('div', { className: 'fish-hero-copy' },
        h('span', { className: 'fish-kicker fish-kicker-light' }, h('span', { className: 'fish-kicker-dot' }), 'BIG FISH · QQ陪伴手帐'),
        h('h1', null, 'QQ 互通与', h('span', { className: 'fish-mark' }, '长期记忆'), '管理。'),
        h('p', { className: 'fish-hero-lead' }, '统一管理 QQ 消息、长期记忆、心情与主动消息。'),
        h('p', { className: 'fish-hero-quote' }, '“' + 每天一句({ memory, mood }) + '”')),
      h('figure', { className: 'fish-welcome', 'aria-hidden': true },
        h('span', { className: 'fish-tape fish-welcome-tape' }),
        h('img', { src: welcomeImage, alt: '', width: 1254, height: 1254, decoding: 'async' }),
        h('figcaption', null, '大肥鱼 · QQ 陪伴助手')),
      h(Wave), h(Bubbles, { className: 'fish-hero-bubbles' }), h(Sparkle, { className: 'fish-hero-spark' })),
    h('section', { className: 'fish-board' },
      h('header', { className: 'fish-section-head' },
        h('div', null, h('span', { className: 'fish-kicker' }, 'TODAY · 今日状态'), h('h2', null, '运行状态')),
        h('span', { className: 'fish-section-note' }, '连接、记忆与心情状态')),
      h('div', { className: 'fish-stats' }, ...stats.map(({ label, value, hint, icon, tone }) => h('article', { className: 'fish-card fish-stat', 'data-tone': tone, key: label },
        h('span', { className: 'fish-stat-icon', 'aria-hidden': true }, h(Glyph, { name: icon, size: 20 })),
        h('div', { className: 'fish-stat-copy' },
          h('span', { className: 'fish-stat-label' }, label),
          h('div', { className: 'fish-value' }, value),
          h('span', { className: 'fish-stat-hint' }, hint)))))),
    h('section', { className: 'fish-board fish-chapters' },
      h('header', { className: 'fish-section-head' },
        h('div', null, h('span', { className: 'fish-kicker' }, 'CHAPTERS · 功能 ALL IN ONE'), h('h2', null, '功能入口')),
        h('span', { className: 'fish-section-note' }, '点击进入对应功能区')),
      h('div', { className: 'fish-grid' },
        h('article', { className: 'fish-card fish-feature fish-feature-character', 'data-fish-feature': 'qq', 'data-index': '01' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '01'), '连接'),
            h('h2', null, 'QQ 互通'),
            h('p', { className: 'fish-muted' }, '统一设置后端连接、私聊与群聊绑定、回复策略。历史记录按段整理后，写进目标会话的记忆。'),
            h('div', { className: 'fish-actions' }, button('打开 QQ 手帐 →', () => navigate(1), true))),
          h('figure', { className: 'fish-feature-sticker', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-chat.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))),
        h('article', { className: 'fish-card fish-feature fish-feature-character', 'data-fish-feature': 'memory', 'data-index': '02' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '02'), '记忆'),
            h('h2', null, '长期记忆'),
            h('p', { className: 'fish-muted' }, '浏览与编辑记忆，整理档案，配置遗忘与召回。Qwen 语义检索按需启用，保留原有来源隔离。'),
            h('div', { className: 'fish-actions' }, button('翻翻记忆口袋 →', () => navigate(2), true))),
          h('figure', { className: 'fish-feature-sticker', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-read.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))),
        h('article', { className: 'fish-card fish-feature fish-feature-light', 'data-fish-feature': 'mood', 'data-index': '03' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '03'), '心情'),
            h('h2', null, '鱼的心情'),
            h('p', { className: 'fish-muted' }, '自动判断心情、查看情绪时间线，管理会话或工作区绑定与挂饰。'),
            h('div', { className: 'fish-actions' }, button('查看心情状态 →', () => navigate(3)))),
          h('figure', { className: 'fish-feature-sticker fish-feature-sticker-small', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-heart.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))),
        h('article', { className: 'fish-card fish-feature fish-feature-light', 'data-fish-feature': 'speak', 'data-index': '04' },
          h('div', { className: 'fish-feature-copy' },
            h('span', { className: 'fish-feature-tag' }, h('b', null, '04'), '搭话'),
            h('h2', null, '主动搭话'),
            h('p', { className: 'fish-muted' }, '设置触发间隔、时段和目标，支持演练与实际发送。'),
            h('div', { className: 'fish-actions' }, button('设置主动搭话 →', () => navigate(4)))),
          h('figure', { className: 'fish-feature-sticker fish-feature-sticker-small', 'aria-hidden': true },
            h('span', { className: 'fish-tape fish-feature-tape' }),
            h('img', { src: '/dsh-big-fish-aio/bigfish/sticker-wave.png', alt: '', width: 1254, height: 1254, decoding: 'async' }))))))
}

function Rice({ notify, active = true } = {}) {
  const [data, setData] = React.useState(null)
  const [busy, setBusy] = React.useState(false)
  const latestLoad = React.useRef(0)
  const [error, setError] = React.useState('')
  const [range, setRange] = React.useState(7)
  const [tip, setTip] = React.useState(null)
  const [thresholdOpen, setThresholdOpen] = React.useState(false)
  const [thresholds, setThresholds] = React.useState({ dailyLimit: '', lowBalance: '' })
  const [thresholdBusy, setThresholdBusy] = React.useState(false)
  const [thresholdError, setThresholdError] = React.useState('')
  const closeThresholds = () => { if (!thresholdBusy) setThresholdOpen(false) }
  const saveThresholds = async event => {
    event.preventDefault()
    if (thresholdBusy) return
    setThresholdBusy(true); setThresholdError('')
    try {
      const result = await request('/dsh-qq-bridge/rice-thresholds', { method: 'POST', body: JSON.stringify({ dailyLimit: Number(thresholds.dailyLimit), lowBalance: Number(thresholds.lowBalance) }) })
      setData(old => ({ ...old, thresholds: result.thresholds }))
      notify?.('鱼粮阈值已保存')
    } catch (error) { setThresholdError(error.message) }
    finally { setThresholdBusy(false) }
  }
  const load = async () => {
    const id = ++latestLoad.current
    setBusy(true); setError('')
    try {
      const value = await request('/dsh-qq-bridge/rice')
      if (id === latestLoad.current) setData(value)
    } catch (e) {
      if (id !== latestLoad.current) return
      setError(e.message)
      if (typeof notify === 'function') notify('读取 Token 用量失败：' + e.message, { holdMs: 7000 })
    } finally { if (id === latestLoad.current) setBusy(false) }
  }
  React.useEffect(() => { if (active) void load() }, [active])
  const fmt = (n) => {
    const v = Math.max(0, Number(n) || 0)
    if (v >= 1e6) return (v / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'
    if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.?0+$/, '') + 'K'
    return Math.round(v).toLocaleString('zh-CN')
  }
  const money = (n) => {
    const v = Math.max(0, Number(n) || 0)
    return '¥' + (v >= 100 ? v.toFixed(2) : v >= 1 ? v.toFixed(3) : v.toFixed(4))
  }
  const dayKey = (d) => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
  const zero = () => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0, cost: 0,
    ragCalls: 0, ragDocumentCalls: 0, ragQueryCalls: 0, ragFailed: 0, ragPending: 0,
    ragTokens: 0, ragUnknownTokens: 0, ragUnpriced: 0, ragCost: 0 })
  const add = (a, b) => {
    const out = zero()
    for (const key of Object.keys(out)) out[key] = (a[key] || 0) + (b[key] || 0)
    return out
  }
  const ragMoney = value => '¥' + (Number(value) || 0).toFixed(6)
  const days = data?.days || []
  const byDay = new Map(days.map(d => [d.date, d]))
  const today = data?.今天 || dayKey(new Date())
  const todayTotal = byDay.get(today) || zero()
  const sumRange = (n) => {
    if (!n) return data?.全部 || zero()
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - n + 1)
    const from = dayKey(start), to = dayKey(end)
    let out = zero()
    for (const d of days) if (d.date >= from && d.date <= to) out = add(out, d)
    return out
  }
  const series = React.useMemo(() => {
    const end = new Date(); const start = new Date()
    if (range) start.setDate(end.getDate() - range + 1)
    else {
      const first = days[0]?.date
      if (!first) return []
      start.setTime(new Date(first + 'T00:00:00').getTime())
    }
    const out = []; const d = new Date(start)
    while (d <= end) { out.push(byDay.get(dayKey(d)) || { date: dayKey(d), ...zero() }); d.setDate(d.getDate() + 1) }
    return out
  }, [days, range])
  const chart = React.useMemo(() => {
    const W = 760, H = 230, pad = 34
    const max = Math.max(1, ...series.map(x => x.total))
    const pts = series.map((x, i) => [pad + (series.length <= 1 ? 0 : i * (W - pad * 2) / (series.length - 1)), H - pad - (x.total / max) * (H - pad * 2)])
    const line = pts.map(p => p.join(',')).join(' ')
    const area = pts.length ? ('M' + pts[0][0] + ',' + (H - pad) + ' L' + line.replace(/ /g, ' L') + ' L' + pts[pts.length - 1][0] + ',' + (H - pad) + ' Z') : ''
    return { W, H, pad, max, pts, line, area }
  }, [series])
  const heat = React.useMemo(() => {
    const now = new Date()
    const year = now.getFullYear(), month = now.getMonth()
    const leading = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < leading; i++) cells.push({ key: 'blank-' + i, blank: true })
    for (let day = 1; day <= daysInMonth; day++) {
      const key = dayKey(new Date(year, month, day))
      const x = byDay.get(key)
      cells.push({ key, total: x?.total || 0, sessions: x?.sessions || [] })
    }
    const max = Math.max(1, ...cells.map(x => x.total || 0))
    return {
      label: year + '年' + (month + 1) + '月',
      cells: cells.map(x => x.blank ? x : ({ ...x, level: x.total <= 0 ? 0 : Math.min(4, Math.ceil(x.total / max * 4)) })),
    }
  }, [days])
  const sessions = data?.会话 || []
  const showTip = (event, date) => {
    const width = typeof window !== 'undefined' ? Math.min(300, window.innerWidth - 28) : 300
    const height = 250
    const x = Math.max(10, Math.min((event.clientX || 0) + 14, (typeof window !== 'undefined' ? window.innerWidth : 1200) - width - 10))
    const y = Math.max(10, Math.min((event.clientY || 0) + 14, (typeof window !== 'undefined' ? window.innerHeight : 900) - height - 10))
    setTip({ date, x, y })
  }
  const tipDay = tip ? byDay.get(tip.date) : null
  return h('div', { className: 'rice-page' },
    h('div', { className: 'fish-toolbar rice-toolbar' },
      h('div', null, h('span', { className: 'fish-kicker' }, 'RICE · 每日用量'), h('h2', null, '吃大米饭')),
      h('div', { className: 'fish-actions' },
        h('button', { type: 'button', className: 'fish-button rice-threshold-button', disabled: !data, onClick: () => {
          setThresholds({ dailyLimit: data?.thresholds?.dailyLimit || '', lowBalance: data?.thresholds?.lowBalance || '' }); setThresholdError(''); setThresholdOpen(true)
        } }, '阈值设定'),
        h(FishRefreshButton, { busy, onClick: load, label: '刷新用量' }))),
    thresholdOpen ? h(FishModal, { className: 'fish-modal', onClick: event => { if (event.target === event.currentTarget) closeThresholds() }, onKeyDown: event => { if (event.key === 'Escape') { event.preventDefault(); closeThresholds() } } },
      h('form', { className: 'fish-modal-card rice-threshold-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'rice-threshold-title', onSubmit: saveThresholds },
        h('span', { className: 'fish-kicker' }, 'RICE · 鱼粮管理'),
        h('h2', { id: 'rice-threshold-title' }, '阈值设定'),
        h('p', { className: 'fish-modal-desc' }, '金额单位为人民币（元），留空或填 0 关闭对应功能。保存后立即生效。'),
        [['dailyLimit', '每日鱼粮上限', '按北京时间统计当前工作区每日估算花费（含 RAG）。达到 80% 时私信提醒主人；达到上限自动关闭总开关，次日不会自动开启。'],
          ['lowBalance', '提醒补充鱼粮', 'DeepSeek 账户人民币余额（含赠金）低于此金额时私信主人续费。不受主动搭话及总开关影响，余额恢复后再次不足才会重新提醒。']].map(([key, label, help], i) =>
          h('label', { className: 'rice-threshold-field', key }, h('strong', null, label + '（人民币元）'),
            h(FishInput, { icon: '¥', type: 'number', min: '0', max: '1000000000', step: 'any', inputMode: 'decimal', autoFocus: i === 0, 'aria-label': label + '（人民币元）', 'aria-describedby': 'rice-help-' + key, disabled: thresholdBusy, value: thresholds[key], placeholder: '0.00', onChange: event => setThresholds({ ...thresholds, [key]: event.target.value }) }),
            h('span', { className: 'fish-muted', id: 'rice-help-' + key }, help))),
        h('p', { className: 'fish-muted' }, '请先在 QQ 私聊映射中勾选主人 QQ 并连接 QQ 后端。试运行不发送私信。每分钟及会话用量更新时检查，已发起的模型请求可能继续计费。'),
        thresholdError ? h('p', { className: 'fish-modal-error', role: 'alert' }, thresholdError) : null,
        h('div', { className: 'fish-modal-actions' }, h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: thresholdBusy, onClick: closeThresholds }, '关闭'),
          h('button', { type: 'submit', className: 'fish-button fish-primary', disabled: thresholdBusy }, thresholdBusy ? '保存中…' : '保存')))) : null,
    h('p', { className: 'fish-muted' }, '统计当前绑定工作区（' + (data?.工作区?.path || '读取中…') + '）的会话与 RAG 用量。RAG 按实际请求记录，含索引构建和查询，缓存复用不新增调用。'),
    error ? h('p', { className: 'fish-modal-error', role: 'alert' }, error) : null,
    h('div', { className: 'rice-stats' },
      [['今天', todayTotal], ['近 7 天', sumRange(7)], ['近 30 天', sumRange(30)], ['全部', data?.全部 || zero()]].map(([label, v]) =>
        h('article', { key: label, className: 'fish-card rice-stat' },
          h('span', { className: 'rice-stat-label' }, label),
          h('strong', { className: 'rice-stat-value' }, fmt(v.total)),
          h('span', { className: 'rice-stat-cost' }, '≈ ' + money(v.cost || 0)),
          h('span', { className: 'rice-stat-sub' }, '输入 ' + fmt(v.input) + ' · 输出 ' + fmt(v.output)),
          h('span', { className: 'rice-stat-sub' }, '缓存 ' + fmt(v.cacheRead + v.cacheWrite) + ' · RAG ' + fmt(v.ragTokens))))),
    h('div', { className: 'rice-grid' },
      h('section', { className: 'fish-card rice-chart-card' },
        h('div', { className: 'fish-section-head' },
          h('div', null, h('span', { className: 'fish-kicker' }, 'TREND'), h('h3', null, '用量趋势')),
          h('div', { className: 'fish-subnav rice-range' }, ...[7, 30, 0].map(n => h('button', { key: n, type: 'button', className: 'fish-button' + (range === n ? ' fish-primary' : ''), onClick: () => setRange(n) }, n ? '近 ' + n + ' 天' : '全部')))),
        series.length ? h('svg', { className: 'rice-line', viewBox: '0 0 ' + chart.W + ' ' + chart.H, role: 'img', 'aria-label': 'Token 用量趋势' },
          [0, 1, 2, 3].map(i => h('line', { key: i, x1: chart.pad, x2: chart.W - chart.pad, y1: chart.pad + i * (chart.H - chart.pad * 2) / 3, y2: chart.pad + i * (chart.H - chart.pad * 2) / 3, className: 'rice-gridline' })),
          chart.area ? h('path', { d: chart.area, className: 'rice-area' }) : null,
          chart.pts.length ? h('polyline', { points: chart.line, className: 'rice-polyline' }) : null,
          ...chart.pts.map((p, i) => h('circle', {
            key: 'hit-' + i, cx: p[0], cy: p[1], r: 10, className: 'rice-hit',
            onMouseEnter: e => showTip(e, series[i].date), onMouseLeave: () => setTip(null),
          })),
          h('text', { x: chart.pad, y: 18, className: 'rice-axis' }, fmt(chart.max)),
          h('text', { x: chart.W - chart.pad, y: chart.H - 4, textAnchor: 'end', className: 'rice-axis' }, series[series.length - 1]?.date?.slice(5) || ''))
        : h('p', { className: 'fish-muted' }, '暂无 Token 记录。')),
      h('section', { className: 'fish-card rice-heat-card' },
        h('div', { className: 'fish-section-head' }, h('div', null, h('span', { className: 'fish-kicker' }, 'HEATMAP'), h('h3', null, heat.label)),
          h('span', { className: 'fish-muted rice-heat-legend' }, '少 ', ...[0, 1, 2, 3, 4].map(l => h('i', { key: l, className: 'rice-heat-dot', 'data-level': l })), ' 多')),
        h('div', { className: 'rice-heat', role: 'img', 'aria-label': '本月 Token 用量热力图' },
          ...heat.cells.map(x => x.blank
            ? h('span', { key: x.key, className: 'rice-heat-cell rice-heat-blank' })
            : h('span', {
                key: x.key, className: 'rice-heat-cell', 'data-level': x.level, title: x.key + ' · ' + fmt(x.total),
                onMouseEnter: e => showTip(e, x.key), onMouseLeave: () => setTip(null),
              }))))),
    h('section', { className: 'fish-card rice-table-card' },
      h('div', { className: 'fish-section-head' }, h('div', null, h('span', { className: 'fish-kicker' }, 'SESSIONS'), h('h3', null, '每个会话的用量')), h('span', { className: 'fish-muted' }, sessions.length + ' 个会话')),
      sessions.length ? h('div', { className: 'rice-table-wrap' },
        h('table', { className: 'rice-table' },
          h('thead', null, h('tr', null, ...['会话', '今日', '全部', '输入', '输出', '缓存', 'Qwen RAG', '金额'].map(x => h('th', { key: x }, x)))),
          h('tbody', null,
            ...sessions.map(s => h('tr', { key: s.id },
              h('td', null, h('span', { className: 'rice-session-title' }, s.title || s.id.slice(-12)), h('span', { className: 'rice-session-id' }, s.id.slice(-8))),
              h('td', null, fmt(s.今天?.total)),
              h('td', null, fmt(s.全部?.total)),
              h('td', null, fmt(s.全部?.input)),
              h('td', null, fmt(s.全部?.output)),
              h('td', null, fmt((s.全部?.cacheRead || 0) + (s.全部?.cacheWrite || 0))),
              h('td', null, fmt(s.全部?.ragTokens)),
              h('td', null, money(s.全部?.cost || 0))))
          )
        )
      ) : h('p', { className: 'fish-muted' }, '当前工作区暂无可统计会话。')),
    tip ? h('div', { className: 'rice-tooltip', role: 'tooltip', style: { left: tip.x + 'px', top: tip.y + 'px' } },
      h('div', { className: 'rice-tip-date' }, tip.date),
      h('div', { className: 'rice-tip-total' }, fmt(tipDay?.total || 0), h('span', null, ' TOKEN')),
      h('div', { className: 'rice-tip-cost' }, '≈ ' + money(tipDay?.cost || 0)),
      h('div', { className: 'rice-stat-sub' }, 'Qwen RAG ' + fmt(tipDay?.ragCalls) + ' 次 · 估算 ' + ragMoney(tipDay?.ragCost)),
      h('div', { className: 'rice-tip-label' }, '会话细分'),
      (tipDay?.sessions || []).length
        ? [...tipDay.sessions].slice(0, 6).map((s, i) => {
            const pct = tipDay.total ? Math.round(s.total / tipDay.total * 100) : 0
            return h('div', { key: s.id || i, className: 'rice-tip-row' },
              h('div', { className: 'rice-tip-row-head' }, h('span', null, s.title || s.id.slice(-8)), h('strong', null, fmt(s.total)), h('em', null, pct + '%')),
              h('div', { className: 'rice-tip-bar' }, h('i', { style: { width: Math.max(2, pct) + '%' } })))
          })
        : h('div', { className: 'rice-tip-empty' }, '当日无记录')) : null)
}

function UpdateArtwork({ outcome = 'idle' }) {
  const [ready, setReady] = React.useState({})
  const [shown, setShown] = React.useState('idle')
  React.useEffect(() => { if (outcome === 'idle' || ready[outcome]) setShown(outcome) }, [outcome, ready])
  return h('div', { className: 'fish-update-stickers', 'data-outcome': shown },
    ...[['idle', 'sticker-update'], ['success', 'sticker-update-success'], ['failure', 'sticker-update-failure']].map(([state, file]) =>
      h('img', { key: state, 'data-artwork': state, src: '/dsh-big-fish-aio/bigfish/' + file + '.png', alt: '', width: 1254, height: 1254, decoding: 'async',
        onLoad: async event => {
          const image = event.currentTarget
          try { await image.decode?.(); setReady(current => ({ ...current, [state]: true })) } catch {}
        } })))
}

function Updates({ notify, versionInfo, onVersionInfo } = {}) {
  const initialChannel = versionInfo?.channel || FISH_UPDATE.result?.channel || null
  const [update, setUpdate] = React.useState(FISH_UPDATE.result?.channel === initialChannel ? FISH_UPDATE.result : null)
  const [busy, setBusy] = React.useState(false)
  const tell = typeof notify === 'function' ? notify : () => {}
  const [channel, setChannel] = React.useState(initialChannel)
  const [betaOpen, setBetaOpen] = React.useState(false)
  const [token, setToken] = React.useState('')
  const [betaError, setBetaError] = React.useState('')
  const requestId = React.useRef(0)
  const installing = React.useRef(false)
  const check = async (force = true) => {
    if (!channel) return
    const id = ++requestId.current
    setBusy(true)
    try {
      const result = await request('/dsh-big-fish-aio/update?channel=' + channel + (force ? '&refresh=1' : ''))
      if (id === requestId.current) {
        setUpdate(result)
        if (result.ok) fishSetUpdateResult(result)
      }
    } catch (e) { if (id === requestId.current) { setUpdate(null); tell('检查更新失败：' + e.message, { holdMs: 6000 }) } }
    finally { if (id === requestId.current) setBusy(false) }
  }
  const install = async () => {
    installing.current = true; setBusy(true)
    try { await fishInstallUpdate(update, { notify: tell, onVersionInfo }) }
    catch (error) { tell('安装未完成：' + error.message) }
    finally { installing.current = false; setBusy(false) }
  }
  React.useEffect(() => {
    let active = true
    if (!channel) request('/dsh-big-fish-aio/version').then(info => {
      if (active) { setChannel(info.channel); onVersionInfo?.(info) }
    }).catch(e => { if (active) tell('读取更新来源失败：' + e.message) })
    return () => { active = false; requestId.current++ }
  }, [])
  React.useEffect(() => {
    const receive = result => {
      if (result.channel !== channel) return
      setUpdate(result)
      if (!installing.current) {
        requestId.current++
        setBusy(false)
      }
    }
    FISH_UPDATE.listeners.add(receive)
    const known = FISH_UPDATE.result
    if (known?.ok && known.channel === channel) receive(known)
    else void check(false)
    return () => FISH_UPDATE.listeners.delete(receive)
  }, [channel])
  const canUpdate = Boolean(update?.ok && (update.hasUpdate || update.sourceChanged))
  const installedBeta = versionInfo?.installedChannel === 'beta'
  const installedVersion = versionInfo?.version || versionInfo?.displayVersion || META.version
  const installedCommit = installedBeta ? versionInfo?.installedCommit : null
  const status = !update ? (busy ? '正在检查…' : '暂未取得更新信息')
    : update.error ? '检查失败，可重试'
    : update.hasUpdate ? '有新版本 v' + update.latest
    : '已是最新版本'
  const changeChannel = async next => {
    setBusy(true)
    try {
      if (next === 'beta') {
        const confirmed = await fishAskConfirm({ title: '内测版使用提示', description: '此版本仅作为内部测试使用，未受邀请请勿使用', confirmText: '确认切换' })
        if (!confirmed) return
        const info = await request('/dsh-big-fish-aio/version')
        if (!info.betaConfigured) {
          setToken(''); setBetaError(''); setBetaOpen(true)
          return
        }
      }
      await request('/dsh-big-fish-aio/channel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ channel: next }) })
      setUpdate(null); setChannel(next)
    } catch (e) { tell('切换渠道失败：' + e.message) }
    finally { setBusy(false) }
  }
  const connectBeta = async e => {
    e.preventDefault()
    if (busy || !token.trim()) return
    setBusy(true); setBetaError('')
    try {
      await request('/dsh-big-fish-aio/beta', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: token.trim() }) })
      setToken(''); setBetaOpen(false); setUpdate(null)
      if (channel === 'beta') await check(true)
      else setChannel('beta')
    } catch (e) { setBetaError(e.message) }
    finally { setBusy(false) }
  }
  return h('div', { className: 'fish-updates' },
    betaOpen ? h(FishModal, { className: 'fish-modal' },
      h('form', { className: 'fish-modal-card', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fish-beta-title', 'aria-describedby': 'fish-beta-desc', onSubmit: connectBeta,
        onKeyDown: e => { if (e.key === 'Escape' && !busy) { setBetaOpen(false); setToken('') } } },
        h('span', { className: 'fish-kicker' }, 'BETA · 内测鉴权'),
        h('h2', { id: 'fish-beta-title' }, '连接内测仓库'),
        h('p', { id: 'fish-beta-desc', className: 'fish-modal-desc' }, '仅支持 RabbitStudio 私有内测仓库 dsh-big-fish-aio-demo 的 main 分支。请输入拥有该仓库 Contents 读取权限的 GitHub Token，服务端会验证连接并安全保存在本机。'),
        h('label', { className: 'fish-beta-label', htmlFor: 'fish-beta-token' }, 'GitHub Token'),
        h('input', { id: 'fish-beta-token', type: 'password', autoComplete: 'off', autoFocus: true, spellCheck: false, maxLength: 255, value: token, disabled: busy,
          onChange: e => setToken(e.target.value) }),
        betaError ? h('p', { className: 'fish-modal-error', role: 'alert' }, betaError) : null,
        h('div', { className: 'fish-modal-actions' },
          h('button', { type: 'button', className: 'fish-button fish-modal-cancel', disabled: busy, onClick: () => { setBetaOpen(false); setToken('') } }, '取消'),
          h('button', { type: 'submit', className: 'fish-button fish-primary', disabled: busy || !token.trim() }, busy ? '验证连接中…' : '验证并连接')))) : null,
    h('section', { className: 'fish-card fish-update-card' },
      h('div', { className: 'fish-update-body' },
        h('span', { className: 'fish-kicker' }, 'UPGRADE · 版本更新'),
        h('div', { className: 'fish-update-heading' },
          h('div', null,
            h('h2', null, '大肥鱼版本更新'),
            h('p', { className: 'fish-update-desc fish-muted' }, '正式版可使用国内镜像或 GitHub 仓库，内测版需要私有仓库授权。')),
          h('div', { className: 'fish-update-badges' },
            h('p', { className: 'fish-update-status fish-installed-version', 'aria-label': '当前安装版本', title: installedCommit || undefined },
              '当前版本 v' + installedVersion + (installedCommit ? ' · ' + installedCommit.slice(0, 8) : '')),
            h('p', { className: 'fish-update-status', role: 'status', 'aria-live': 'polite', title: update?.error || undefined }, h('span', { className: 'fish-update-dot' }), status))),
        h('div', { className: 'fish-update-controls' },
          h('label', { className: 'fish-channel-field', htmlFor: 'fish-update-channel' },
            h('span', null, '更新渠道'),
            h(FishSelect, {
              id: 'fish-update-channel', 'aria-label': '更新渠道', value: channel || 'mirror', disabled: busy || !channel,
              onChange: e => { void changeChannel(e.target.value) },
            }, h('option', { value: 'mirror' }, '国内镜像'), h('option', { value: 'github' }, 'GitHub 仓库'), h('option', { value: 'beta' }, '内测版'))),
          channel === 'beta' ? h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { setToken(''); setBetaError(''); setBetaOpen(true) } }, '更新 Token') : null,
          h('div', { className: 'fish-update-operations' },
            h('button', {
              type: 'button',
              className: 'fish-button fish-update-check' + (canUpdate && !busy ? ' fish-gold' : ''),
              disabled: busy || !channel || Boolean(canUpdate && update?.canInstall === false),
              'aria-label': busy ? (canUpdate ? '正在安装更新' : '正在检查更新') : (canUpdate ? '立即更新' : '检查更新'),
              onClick: canUpdate ? install : () => check(true),
            }, busy
              ? h(Glyph, { name: 'update', size: 18, className: 'fish-spin' })
              : (canUpdate ? '立即更新' : '检查更新')),
            h('button', { type: 'button', className: 'fish-button', disabled: busy, onClick: () => { void fishViewInstalledLog().catch(error => tell('读取本地更新日志失败：' + error.message)) } }, '更新日志'))),
        update?.error ? h('p', { className: 'fish-update-note fish-muted' }, '检查更新失败：' + update.error) : null,
        channel === 'beta' && update?.commitUpdate ? h('p', { className: 'fish-update-note fish-muted' }, '目标提交 ' + String(update.latestCommit || '').slice(0, 8) + '，立即更新将安装此提交。') : null,
        update?.devCopy ? h('p', { className: 'fish-update-note fish-muted' }, '当前是本地开发副本，自动安装已禁用。请在项目目录执行 git pull，再运行 npm run build 并重载 DSH。') : null),
      h('figure', { className: 'fish-update-art', 'aria-hidden': true },
        h('span', { className: 'fish-tape fish-update-tape' }),
        h(UpdateArtwork, { outcome: update?.installOutcome || FISH_UPDATE.installOutcome || 'idle' }))),
    h('section', { className: 'fish-card fish-sources' },
      h('header', { className: 'fish-section-head fish-sources-head' },
        h('div', null,
          h('span', { className: 'fish-kicker' }, 'PROVENANCE · 项目来源'),
          h('h2', null, '原作者、项目来源与版本对应'),
          h('p', { className: 'fish-source-link' }, '本项目仓库：', link('https://github.com/RabbitStudioChino/dsh-big-fish-aio', 'RabbitStudioChino/dsh-big-fish-aio ↗'))),
        h('span', { className: 'fish-section-note' }, '固定记录整合基线，不随上游最新版本变化')),
      h('div', { className: 'fish-table-wrap' }, h('table', { className: 'fish-table' },
        h('thead', null, h('tr', null,
          ...['项目名称', '原作者仓库'].map(x => h('th', { key: x, scope: 'col' }, x)),
          h('th', { scope: 'col' }, '整合时的原仓库版本'))),
        h('tbody', null, ...META.upstreamCompatibility.map(item => h('tr', { key: item.url },
          h('td', null, h('span', { className: 'fish-source-name' }, item.name)),
          h('td', null, link(item.url, item.url.replace('https://github.com/', ''))),
          h('td', null, item.version, h('div', { className: 'fish-muted', title: item.commit }, item.commit.slice(0, 7))))))))))
}

function FileManager({ notify } = {}) {
  return h('div', { className: 'fish-file-manager' },
    typeof FishStickers === 'function' ? h(FishStickers, { notify, mode: 'files' }) : h('p', { className: 'fish-muted' }, '表情包管理组件不可用'),
    h('section', { className: 'fish-card' },
      h('h2', null, 'QQ 图片'),
      h('p', { className: 'fish-muted' }, '管理 QQ 接收图片的本地归档；删除归档副本不会影响 DSH 会话附件。'),
      typeof FishQQStorage === 'function' ? h(FishQQStorage, { kind: 'images', notify }) : h('p', { className: 'fish-muted' }, '图片存储管理组件不可用')),
    h('section', { className: 'fish-card' },
      h('h2', null, 'QQ 文件'),
      h('p', { className: 'fish-muted' }, '管理 QQ 接收文件的本地归档；文件不会被自动执行。'),
      typeof FishQQStorage === 'function' ? h(FishQQStorage, { kind: 'files', notify }) : h('p', { className: 'fish-muted' }, '文件存储管理组件不可用')))
}

function RunLog({ notify } = {}) {
  const [lines, setLines] = React.useState([])
  const [error, setError] = React.useState('')
  const terminalRef = React.useRef(null)
  React.useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const result = await request('/dsh-qq-bridge/logs')
        if (!active) return
        setLines(Array.isArray(result.日志) ? result.日志 : [])
        setError('')
      } catch (e) {
        if (active) setError(e.message)
      }
    }
    void load()
    const timer = setInterval(load, 1200)
    return () => { active = false; clearInterval(timer) }
  }, [])
  React.useEffect(() => {
    const node = terminalRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [lines])
  return h('div', { className: 'fish-run-log' },
    h('section', { className: 'fish-terminal-card' },
      h('div', { className: 'fish-terminal-head' },
        h('span', { className: 'fish-terminal-live' }, h('i', { 'aria-hidden': true }), 'LIVE'),
        h('span', { className: 'fish-terminal-title' }, 'QQ 互通 · 实时日志'),
        h('span', { className: 'fish-terminal-count' }, lines.length + ' 行')),
      h('div', { ref: terminalRef, className: 'fish-terminal', role: 'log', 'aria-label': 'QQ 互通实时日志', 'aria-live': 'polite' },
        lines.length
          ? lines.map((line, i) => h('div', { className: 'fish-terminal-line', key: i },
            h('span', { className: 'fish-terminal-time' }, line.时间),
            h('span', { className: 'fish-terminal-prompt', 'aria-hidden': true }, '›'),
            h('span', { className: 'fish-terminal-text' }, line.文本)))
          : h('div', { className: 'fish-terminal-empty' }, error || '等待日志…')),
      error && lines.length ? h('p', { className: 'fish-terminal-error', role: 'status' }, '日志连接中断：' + error) : null))
}

const LOCATION_KEY = 'big-fish:last-location-v2'
function readSavedLocation() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const raw = window.localStorage.getItem(LOCATION_KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (!saved || !Number.isInteger(saved.tab) || saved.tab < 0 || saved.tab >= tabs.length) return null
    const defaults = { 1: '连接', 2: '记忆库', 3: 'mood' }
    const sub = { ...defaults }
    for (const id of [1, 2, 3]) {
      const key = saved.subpage && saved.subpage[id]
      if (typeof key === 'string' && (submenus[id] || []).some(pair => Array.isArray(pair) && pair[0] === key)) sub[id] = key
    }
    return { tab: saved.tabLabel ? Math.max(0, tabs.indexOf(saved.tabLabel)) : saved.tab === 8 ? UPDATES_TAB : saved.tab === 5 ? tabs.indexOf('吃大米饭') : saved.tab, subpage: sub }
  } catch (error) { return null }
}

function Page() {
  const savedLocation = readSavedLocation()
  const initialTab = openUpdatesRequested ? UPDATES_TAB : (savedLocation?.tab ?? 0)
  const [tab, setTab] = React.useState(initialTab)
  const [visited, setVisited] = React.useState([initialTab])
  const [subpage, setSubpage] = React.useState(savedLocation?.subpage || { 1: '连接', 2: '记忆库', 3: 'mood' })
  const [qqStatus, setQQStatus] = React.useState(null)
  const [versionInfo, setVersionInfo] = React.useState(null)
  const [updateAvailable, setUpdateAvailable] = React.useState(Boolean(FISH_UPDATE.result?.hasUpdate))
  React.useEffect(() => {
    const receive = result => setUpdateAvailable(Boolean(result?.hasUpdate))
    FISH_UPDATE.listeners.add(receive)
    receive(FISH_UPDATE.result)
    return () => FISH_UPDATE.listeners.delete(receive)
  }, [])
  const navRef = React.useRef(null), workspaceRef = React.useRef(null), contentRef = React.useRef(null), highlightRef = React.useRef(null)
  const enterAnimation = React.useRef(null)
  const qqGuard = React.useRef({ dirty: false, save: null })
  const speakGuard = React.useRef({ dirty: false, save: null })
  const navigateRef = React.useRef(null)
  const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // 立即换内容，再由 useLayoutEffect 做一次淡入；不再先把旧内容淡成空白。
  const animateChange = change => change()
  const activeGuard = () => tab === 1 ? qqGuard.current : tab === 4 ? speakGuard.current : null
  const requestLeave = async action => {
    const guard = activeGuard()
    if (guard?.dirty && typeof guard.save === 'function') {
      const saved = await guard.save()
      if (saved !== false) action()
      return
    }
    action()
  }
  const navigate = id => {
    if (id === tab) return
    requestLeave(() => animateChange(() => { setTab(id); setVisited(old => old.includes(id) ? old : [...old, id]) }))
  }
  const selectSubpage = (id, key) => {
    const current = subpage[id]
    if (id === tab && key === current) return
    requestLeave(() => animateChange(() => {
      setTab(id); setVisited(old => old.includes(id) ? old : [...old, id])
      setSubpage(old => ({ ...old, [id]: key }))
    }))
  }
  const flashJumpTarget = (id) => {
    let tries = 0
    const tick = () => {
      const el = typeof document !== 'undefined' ? document.getElementById(id) : null
      if (el && el.getClientRects().length) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.remove('fish-jump-flash')
        void el.offsetWidth
        el.classList.add('fish-jump-flash')
        setTimeout(() => el.classList.remove('fish-jump-flash'), 1500)
        return
      }
      if (++tries < 50) setTimeout(tick, 80)
    }
    setTimeout(tick, 50)
  }
  const openFileManager = () => {
    navigate(FILE_MANAGER_TAB)
    flashJumpTarget('fish-sticker-files-card')
  }
  navigateRef.current = navigate
  React.useEffect(() => {
    let active = true
    const loadVersion = () => request('/dsh-big-fish-aio/version')
      .then(info => { if (active && info && info.version) setVersionInfo(info) })
      .catch(() => {})
    void loadVersion()
    const onFocus = () => { void loadVersion() }
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') window.addEventListener('focus', onFocus)
    const timer = setInterval(loadVersion, 30000)
    return () => {
      active = false
      clearInterval(timer)
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') window.removeEventListener('focus', onFocus)
    }
  }, [])
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(LOCATION_KEY, JSON.stringify({ tab, tabLabel: tabs[tab], subpage }))
      }
    } catch (error) {}
  }, [tab, subpage])
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return undefined
    const onBeforeUnload = (event) => {
      const dirty = Boolean(qqGuard.current?.dirty || speakGuard.current?.dirty)
      if (!dirty) return undefined
      event.preventDefault()
      event.returnValue = '当前配置未保存，是否刷新？'
      return event.returnValue
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [tab])
  React.useEffect(() => {
    openUpdatesRequested = false
    showUpdates = () => navigateRef.current?.(UPDATES_TAB)
    return () => { showUpdates = null; enterAnimation.current?.cancel() }
  }, [])
  React.useEffect(() => {
    let active = true
    const refresh = () => request('/dsh-qq-bridge/state').then(s => { if (active) setQQStatus(s.NapCat状态) }).catch(() => { if (active) setQQStatus({ 错: '无法读取连接状态' }) })
    void refresh()
    const timer = setInterval(refresh, 15000)
    return () => { active = false; clearInterval(timer) }
  }, [])
  React.useLayoutEffect(() => {
    const nav = navRef.current, highlight = highlightRef.current
    if (!nav || !highlight) return
    const update = () => {
      const selected = nav.querySelector('[role=tab][aria-selected=true]')
      if (selected) { highlight.style.transform = 'translateY(' + selected.offsetTop + 'px)'; highlight.style.height = selected.offsetHeight + 'px' }
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update); observer.observe(nav)
    return () => observer.disconnect()
  }, [tab])
  React.useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return
    if (workspaceRef.current) workspaceRef.current.scrollTop = 0
    if (reducedMotion()) return
    enterAnimation.current?.cancel()
    if (node.animate) enterAnimation.current = node.animate([{ opacity: .35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' })
    return () => enterAnimation.current?.cancel()
  }, [tab, subpage])
  const subIndex = (submenus[tab] || []).findIndex(([key]) => key === subpage[tab])
  const subTitle = submenus[tab]?.[subIndex]?.[1]
  const englishPath = TAB_ENGLISH[tab] + (subTitle ? ' > ' + SUBMENU_ENGLISH[tab][subIndex] : '')
  const render = [
    () => h(Overview, { navigate, notify: fishNotify }),
    () => h(QQ, { page: subpage[1], onPageChange: key => selectSubpage(1, key), guard: qqGuard, notify: fishNotify, help: fishShowHelp, hideHelp: fishHideHelp, laterHideHelp: fishScheduleHelpHide, confirm: fishAskConfirm, editRole: fishAskText, openRoleWriter: fishOpenRoleWriter, openFileManager }),
    () => h(Memory, { page: subpage[2], onPageChange: key => selectSubpage(2, key), notify: fishNotify, active: tab === 2 }),
    () => h(Mood, { page: subpage[3], onPageChange: key => selectSubpage(3, key), notify: fishNotify, Dialog: components['dsh-fish-memory'].MemoryDialog }),
    () => h(Speak, { guard: speakGuard, notify: fishNotify }), () => h(OpenPlatform, { notify: fishNotify }), () => h(FileManager, { notify: fishNotify }), () => h(RunLog, { notify: fishNotify }), () => h(Rice, { notify: fishNotify, active: tab === tabs.indexOf('吃大米饭') }), () => h(Updates, { notify: fishNotify, versionInfo, onVersionInfo: setVersionInfo }),
  ]
  const connected = Boolean(qqStatus?.用户 && !qqStatus?.错)
  const connection = !qqStatus ? '正在读取 QQ 连接…' : qqStatus?.错 ? 'QQ 连接读取失败' : connected ? 'QQ 已连接 · ' + (qqStatus.昵称 || '伙伴') + ' · ' + qqStatus.用户 : 'QQ 未连接'
  return h('div', { className: 'big-fish' }, h('style', null, css),
    h('div', { className: 'fish-frame' },
      h(FishTextHost),
      h(FishRoleWriterHost),
      h(FishHelpHost),
      h(FishConfirmHost),
      h(FishSelectLayer),
      h('aside', { className: 'fish-binder' },
        h('div', { className: 'fish-rings', 'aria-hidden': true }, ...[0, 1, 2, 3, 4, 5, 6].map(i => h('span', { key: i }))),
        h('header', { className: 'fish-brand' },
          h('span', { className: 'fish-logo' }, h(FishIcon, { size: 30 })),
          h('span', { className: 'fish-brand-text' },
            h('span', { className: 'fish-brand-name' }, '大肥鱼'),
            h('span', { className: 'fish-brand-sub' }, 'QQ陪伴手帐')),
          h('button', {
            type: 'button', className: 'fish-version-pin',
            title: '大肥鱼 v' + (versionInfo?.version || META.version) + ' · 查看更新与来源',
            'aria-label': updateAvailable ? '发现新版本，查看更新与来源' : '查看更新与来源',
            onClick: () => navigate(UPDATES_TAB),
          }, updateAvailable ? h('span', { className: 'fish-update-dot', 'aria-hidden': true }) : null,
          (versionInfo?.installedChannel === 'beta' ? '内测' : 'v' + (versionInfo?.displayVersion || META.version)))),
        h('nav', { ref: navRef, className: 'fish-nav', 'aria-label': '大肥鱼功能', role: 'tablist', 'aria-orientation': 'vertical' },
          h('span', { ref: highlightRef, className: 'fish-nav-highlight', 'aria-hidden': true }),
          ...tabs.map((label, id) => {
            const items = submenus[id]
            const selected = subpage[id]
            return h('div', { key: label, className: 'fish-nav-group' },
              h('button', {
                type: 'button', role: 'tab', id: 'fish-tab-' + id, 'aria-label': label, 'aria-selected': tab === id, 'aria-controls': 'fish-panel-' + id,
                tabIndex: tab === id ? 0 : -1, className: 'fish-tab', onClick: () => navigate(id), onKeyDown: e => {
                  const next = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? (id + 1) % tabs.length : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? (id + tabs.length - 1) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null
                  if (next !== null) { e.preventDefault(); navigate(next); e.currentTarget.closest('[role=tablist]').querySelectorAll('[role=tab]')[next].focus() }
                },
              }, h('span', { className: 'fish-tab-icon', 'aria-hidden': true }, h(Glyph, { name: TAB_ICONS[id], size: 19 })), h('span', { className: 'fish-tab-label' }, label), h('span', { className: 'fish-tab-no', 'aria-hidden': true }, String(id + 1).padStart(2, '0'))),
              items && tab === id ? h('div', { className: 'fish-submenu', role: 'group', 'aria-label': label + '子菜单' },
                ...items.map(([key, name]) => h('button', { key, type: 'button', 'aria-current': selected === key ? 'page' : undefined, onClick: () => selectSubpage(id, key) }, name))) : null)
          })),
        h('div', { className: 'fish-binder-foot' },
          h('div', { className: 'fish-sidebar-note', role: 'status', title: qqStatus?.错 || connection },
            h('span', { className: 'fish-connection-dot', 'data-connected': connected, 'aria-hidden': true }), h('span', null, connection)))),
      h('main', { className: 'fish-workspace' },
        h('div', { className: 'fish-paper' },
          h('span', { className: 'fish-tape fish-tape-corner fish-tape-left', 'aria-hidden': true }),
          h('span', { className: 'fish-tape fish-tape-corner fish-tape-right', 'aria-hidden': true }),
          h('span', { className: 'fish-fade fish-fade-top', 'aria-hidden': true }),
          h('span', { className: 'fish-fade fish-fade-bottom', 'aria-hidden': true }),
          h('div', { ref: workspaceRef, className: 'fish-scroll' },
            h('div', { ref: contentRef, className: 'fish-content' + (tab === 0 ? ' fish-overview-content' : ' fish-flat') },
              tab === 0 ? null : h('header', { className: 'fish-page-head' },
                h('div', { className: 'fish-page-head-copy' },
                  h('nav', { className: 'fish-breadcrumb', 'aria-label': '页面路径' },
                    h('span', { className: 'fish-kicker', lang: 'en' }, englishPath),
                    h('h1', { className: 'fish-breadcrumb-title' }, h('span', null, tabs[tab] === '开放平台' ? '大肥鱼开放平台' : tabs[tab]),
                      subTitle ? h(React.Fragment, null, h('span', { className: 'fish-breadcrumb-separator', 'aria-hidden': true }, '>'), h('span', { className: 'fish-breadcrumb-current', 'aria-current': 'page' }, subTitle)) : null)),
                  h('p', { className: 'fish-page-desc' }, tabs[tab] === '开放平台' ? h('strong', null, DESCRIPTIONS[tab]) : DESCRIPTIONS[tab])),
                h('div', { className: 'fish-page-stamp', 'aria-hidden': true },
                  h(Glyph, { name: TAB_ICONS[tab], size: 30 }),
                  h('span', { className: 'fish-page-stamp-no' }, String(tab + 1).padStart(2, '0')),
                  h('span', { className: 'fish-page-stamp-label' }, TAB_STAMPS[tab]))),
              ...visited.map(id => h('section', { key: id, id: 'fish-panel-' + id, role: 'tabpanel', 'aria-labelledby': 'fish-tab-' + id, className: 'fish-panel', hidden: tab !== id }, render[id]()))))))))
}


return {
  inject: ['slots'],
  apply(ctx) {
    const slots = ctx.get('slots')
    if (!slots) return
    const readiness = ctx.get('modules')?.entries?.state
    slots.inject('sidebar.panellist', () => slots.register({ name: 'sidebar.panellist', id: PANEL_ID, order: 20, label: () => '大肥鱼' }, FishIcon))
    slots.inject('main', () => {
      const unregister = slots.register({ name: 'main', key: PANEL_ID }, Page)
      const stopReopen = 挂载更新后重开(ctx, readiness)
      return () => { stopReopen(); unregister?.() }
    })
    slots.inject('shell.overlay', () => slots.register({ name: 'shell.overlay', id: 'big-fish-update-notice' }, () => h(React.Fragment, null,
      h(NotificationHost),
      h(UpdateLogHost, { readiness }),
      h(UpdateNotifier, { open: () => {
        openUpdatesRequested = true
        ctx.get('layout')?.selectPanel(PANEL_ID)
        showUpdates?.()
      } }))))
  },
}

} });
