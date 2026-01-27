# Laundromat Static Site

Static HTML/CSS/JS website for a laundromat business with bilingual support (EN/GR), designed for WordPress theme conversion.

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Open the site

**Important:** Header/footer components load via XHR, so you need a local server.

**Option 1 - VS Code Live Server (recommended):**
1. Install "Live Server" extension in VS Code
2. Open any HTML file
3. Click "Go Live" in the bottom right corner

**Option 2 - Python server:**
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

### 4. Production build

```bash
npm run build
```

## Project Structure

```
laundromat-wp/
├── index.html              # Homepage
├── services.html           # Services page
├── tips.html               # Tips archive
├── tips-details.html       # Single tip page
├── instructions.html       # Instructions page
├── faq.html                # FAQ page
├── contact.html            # Contact page
├── location.html           # Locations page
├── privacy-policy.html     # Privacy policy
├── personal-data.html      # Personal data page
├── 404.html                # Error page
│
├── el/                     # Greek language pages
│   └── [same structure]
│
├── includes/               # Shared components
│   ├── header.html
│   └── footer.html
│
├── assets/
│   ├── css/
│   │   ├── output.css      # Compiled Tailwind CSS
│   │   └── animations.css  # Custom keyframe animations
│   ├── js/                 # 27 JavaScript modules
│   │   ├── main.js         # Entry point, component loading
│   │   ├── header.js       # Header scroll effects
│   │   ├── api.js          # WordPress REST API integration
│   │   ├── config/         # Data & spring physics configs
│   │   └── utils/          # Spring class, scroll handlers
│   ├── images/
│   └── videos/
│
├── src/
│   └── globals.css         # Tailwind CSS source
│
├── public/
│   └── hero-background.png
│
└── wp-content/             # WordPress theme (for conversion)
    └── themes/laundromat/
```

## Technology Stack

- HTML5 (10 pages + Greek translations)
- Tailwind CSS v4.0-alpha
- Vanilla JavaScript (~4200 lines across 27 modules)
- Keen Slider 6.8.6 (carousels)
- Spring-physics animation system (Hooke's Law)

## WordPress Conversion

This project includes infrastructure for WordPress theme conversion:

- **Docker setup:** `docker-compose.yml` for local WordPress development
- **Theme template:** `wp-content/themes/laundromat/`
- **Conversion guide:** See `claude-code-prompt.md` for detailed specs
- **Setup instructions:** See `WP-SETUP.md` for Docker and database setup

### WordPress Docker Setup

```bash
# Start WordPress containers
docker-compose up -d

# Access WordPress admin
# URL: http://localhost:8080/wp-admin
```

## Key Features

- Bilingual support (English/Greek) via `/el/` directory
- Spring-physics animations with configurable stiffness/damping
- Responsive design (mobile-first, breakpoint at 1366px for navigation)
- Dynamic header/footer loading
- Keen Slider carousels for locations and reviews

## Important Notes

**Preserve when modifying:**
- All `data-*` attributes (trigger animations)
- HTML structure (animations depend on DOM hierarchy)
- CSS class names (Tailwind utilities)
- IIFE pattern in JS files

**Responsive breakpoints:**
- Mobile: default (320px+)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)
- Wide: `xl:` (1280px+)
- Navigation: 1366px (hamburger vs full nav)

## Code Style

Prettier configured with:
- Semicolons enabled
- Single quotes (JS/HTML)
- 124 character line width
- Tailwind class sorting plugin

## Documentation

- `CLAUDE.md` - Developer guidance for Claude Code
- `claude-code-prompt.md` - WordPress conversion specifications
- `WP-SETUP.md` - WordPress Docker setup instructions
- `ABOUT-ITEMS-README.md` - About Items WordPress integration guide
