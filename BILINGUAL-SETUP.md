# Bilingual Setup (English/Greek)

## Overview

The website now supports both English (default) and Greek translations with a language switcher in the header.

## Structure

```
laundromat-wp/
├── *.html              # English pages (default)
├── el/                 # Greek translations directory
│   ├── *.html         # Greek pages
└── assets/
    └── js/
        └── lang-switcher.js  # Language switching functionality
```

## How It Works

### Language Switcher

- **Location**: Header navigation on all pages
- **Button**: Shows current language (En or Gr)
- **Dropdown**: Click to see available languages
- **Switching**: Click a language to navigate to that version

### File Organization

- **English pages**: Root directory (e.g., `/index.html`, `/services.html`)
- **Greek pages**: `el/` subdirectory (e.g., `/el/index.html`, `/el/services.html`)

### Technical Implementation

1. **HTML Structure**:
   - Each page has identical structure
   - `<html lang="en">` for English, `<html lang="el">` for Greek
   - Asset paths use relative paths (`./assets/` for EN, `../assets/` for Greek)

2. **Language Switcher Component**:
   ```html
   <div class="relative" id="lang-switcher">
     <button id="lang-button">
       <span>En</span> <!-- or Gr for Greek pages -->
     </button>
     <ul id="lang-dropdown">
       <li><button>En</button></li>
       <li><button>Gr</button></li>
     </ul>
   </div>
   ```

3. **JavaScript** (`assets/js/lang-switcher.js`):
   - Toggles dropdown on button click
   - Detects current language from URL path
   - Navigates to corresponding page in target language
   - Preserves current page when switching (e.g., services.html → el/services.html)

### Active Language Indication

- **English pages**: "En" button shown with blue background in dropdown
- **Greek pages**: "Gr" button shown with blue background in dropdown
- Inactive language has gray text with hover effect

## Adding New Pages

When adding a new page to the site:

1. **Create English version** in root:
   ```bash
   # Create new-page.html in root
   ```

2. **Copy to Greek directory**:
   ```bash
   cp new-page.html el/new-page.html
   ```

3. **Update Greek version**:
   - Change `<html lang="en">` to `<html lang="el">`
   - Update asset paths: `./assets/` → `../assets/`
   - Update button text: `<span>En</span>` → `<span>Gr</span>`
   - Swap dropdown order (Gr first with active style)
   - Translate content to Greek

4. **Include language switcher script**:
   ```html
   <script src="./assets/js/lang-switcher.js"></script>  <!-- English -->
   <script src="../assets/js/lang-switcher.js"></script>  <!-- Greek -->
   ```

## Content Translation Status

Currently, the Greek pages have:
- ✅ Correct file structure and paths
- ✅ Language attribute set to `el`
- ✅ Working language switcher
- ⚠️ **English content** (translation pending)

### To Complete Translation

For each page in `el/` directory, translate:
- Page titles (`<title>`)
- Navigation labels
- Headings and body text
- Button labels
- Form labels and placeholders
- Footer content
- Meta descriptions

## Testing

### Local Testing

1. **Start local server**:
   ```bash
   # Using VS Code Live Server or:
   python3 -m http.server 8000
   ```

2. **Test language switching**:
   - Open `http://localhost:8000/index.html`
   - Click language switcher, select "Gr"
   - Should navigate to `http://localhost:8000/el/index.html`
   - Header should show "Gr" as active language
   - Click "En" to switch back

3. **Test all pages**:
   - Verify switcher works on every page
   - Check that navigation links stay within language version
   - Confirm asset paths load correctly (CSS, JS, images)

## URL Structure

- **English**: `/index.html`, `/services.html`, etc.
- **Greek**: `/el/index.html`, `/el/services.html`, etc.

The language switcher automatically:
- Adds `/el/` prefix when switching to Greek
- Removes `/el/` prefix when switching to English
- Maintains the current page filename

## Troubleshooting

### Language Switcher Not Working

If the language switcher isn't functioning:

1. **Check Script Loading Order**
   - `lang-switcher.js` must load AFTER `header.js`
   - Verify in browser DevTools → Network tab

2. **Check Console Errors**
   - Open browser console (F12)
   - Look for JavaScript errors
   - Verify lang-switcher.js loaded successfully

3. **Verify HTML Structure**
   - Header must have: `id="lang-switcher"`, `id="lang-button"`, `id="lang-dropdown"`
   - Mobile menu must have: `id="lang-switcher-mobile"`, `id="lang-button-mobile"`, `id="lang-dropdown-mobile"`

4. **Check Dropdown HTML**
   - Each switcher needs both button AND dropdown elements
   - Dropdown must have button/link elements inside

See **LANGUAGE-SWITCHER-TEST.md** for detailed testing instructions.

## Browser Support

The language switcher works in all modern browsers that support:
- ES6 JavaScript (arrow functions, const/let)
- DOM manipulation
- classList API

## Future Enhancements

Potential improvements:
- [ ] Store language preference in localStorage
- [ ] Add hreflang tags for SEO
- [ ] Implement language detection from browser settings
- [ ] Add more language options
- [ ] Create translation management system
