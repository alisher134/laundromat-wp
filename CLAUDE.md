# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS website for a laundromat business, designed for future WordPress theme conversion. Multi-page site with advanced spring-physics animations and bilingual support (EN/GR).

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (watch for CSS changes)
npm run dev

# Production build (minified CSS)
npm run build
```

**Local Server Required**: Header/footer components load via XHR, so you need a local server:
- VS Code Live Server extension (recommended)
- `python3 -m http.server 8000`

## Architecture

### Technology Stack
- HTML5 (9 pages)
- Tailwind CSS v4.0-alpha (configured in `src/globals.css`)
- Vanilla JavaScript (~4200 lines across 27 modules)
- Keen Slider 6.8.6 (carousels)

### Key Architectural Patterns

**Spring Physics Animation System**: Custom physics-based animations using Hooke's Law in `assets/js/utils/spring.js`. Provides smooth scroll-triggered effects with configurable stiffness, damping, and mass. Used throughout services, locations, and tips sections.

**Component Loading**: Header and footer are separate HTML files in `includes/` loaded dynamically via JavaScript into placeholder divs. Active page highlighting is automatic.

**IIFE Module Pattern**: Each JS file uses `(function() { ... })()` for scope isolation. No bundler - scripts are directly included in HTML pages.

**Data Attributes**: Animations depend on data attributes (`data-service-card`, `data-location-index`, `data-state`). Preserve these when modifying HTML.

### JavaScript Module Organization
```
assets/js/
├── main.js              # Hero preloader, section animations
├── header.js            # Header scroll effects, theme switching
├── header-hero.js       # Hero entrance animations
├── mobile-menu.js       # Hamburger menu for <1366px screens
├── *-section.js         # Section-specific animations
├── *-page.js            # Full page logic
├── config/              # Data & spring physics configurations
└── utils/               # Spring class, scroll handlers, breakpoints
```

### CSS Architecture
- Tailwind v4 uses `@source` directives in `src/globals.css`
- Custom theme variables for brand colors (`#3a6d90`, `#87bce0`, `#488ebe`)
- Custom keyframe animations in `assets/css/animations.css`

## Critical Implementation Notes

**Preserve When Modifying**:
- All `data-*` attributes (trigger animations)
- HTML structure (animations depend on DOM hierarchy)
- CSS class names (Tailwind utilities)
- IIFE pattern in JS files
- Spring physics configuration values in `config/spring-configs.js`

**Animation Behaviors**:
- Preloader blocks scroll for 3 seconds intentionally
- Header theme switches at 90vh scroll threshold
- Spring animations require `requestAnimationFrame` for 60fps
- FAQ accordion state managed via `data-state` attributes
- Keen Slider requires specific HTML structure

## Responsive Breakpoints
- Mobile: default (320px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1280px+)
- Navigation breakpoint: 1366px (hamburger vs full nav)

## Code Style

Prettier configured with:
- Semicolons enabled
- Single quotes (JS/HTML), double quotes (JSX)
- 124 character line width
- Tailwind class sorting plugin

## WordPress Conversion Context

See `claude-code-prompt.md` for detailed WordPress theme conversion requirements including:
- Custom Post Types: services, locations, instructions, tips, faqs, reviews
- ACF field specifications
- Polylang bilingual setup
- Docker Compose configuration
- Data mapping from HTML to WordPress
