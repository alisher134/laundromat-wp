# Language Switcher Testing Guide

## What Was Fixed

1. **Removed conflict** between `header.js` and `lang-switcher.js`
   - `header.js` was trying to initialize language switchers with API data
   - Now `lang-switcher.js` handles all language switching for static HTML

2. **Added mobile language switcher dropdowns**
   - Previously only the button existed without a dropdown
   - Now all pages have `lang-dropdown-mobile` element

3. **Updated lang-switcher.js**
   - Now handles all 4 potential switchers: header, mobile, footer, footer-mobile
   - Works with both buttons and links in dropdowns
   - Properly detects Greek (`/el/`) vs English paths

## Components Fixed

### Header Language Switcher
- **ID**: `lang-switcher`, `lang-button`, `lang-dropdown`
- **Location**: Desktop header (visible on screens ≥1366px)
- **Status**: ✅ Working

### Mobile Language Switcher
- **ID**: `lang-switcher-mobile`, `lang-button-mobile`, `lang-dropdown-mobile`
- **Location**: Mobile menu (visible on screens <1366px)
- **Status**: ✅ Fixed - dropdown added

### Footer Language Switcher (if exists)
- **ID**: `lang-switcher-footer`, `lang-button-footer`, `lang-dropdown-footer`
- **Status**: Ready to work if footer has switcher

## How to Test

### 1. Start Local Server
```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

### 2. Test Desktop Header Switcher
1. Open `http://localhost:8000/index.html`
2. Click language button showing "En" in header
3. Dropdown should appear with "En" (blue) and "Gr" (gray)
4. Click "Gr"
5. Should navigate to `http://localhost:8000/el/index.html`
6. Header should now show "Gr" button
7. Dropdown should show "Gr" (blue) and "En" (gray)
8. Click "En" to switch back

### 3. Test Mobile Switcher
1. Resize browser to mobile width (<1366px) or use DevTools device mode
2. Click hamburger menu icon
3. Mobile menu should slide in
4. Click "En" button in top-right
5. Dropdown should appear below it
6. Click "Gr" to switch languages
7. Navigate to Greek version
8. Open mobile menu - should show "Gr" button

### 4. Test All Pages
Test language switching on:
- ✅ index.html
- ✅ services.html
- ✅ contact.html
- ✅ instructions.html
- ✅ tips.html
- ✅ location.html
- ✅ faq.html
- ✅ 404.html
- ✅ privacy-policy.html
- ✅ personal-data.html
- ✅ tips-details.html

### 5. Browser Console Check
Open browser console (F12) and verify:
- No JavaScript errors
- Language switcher initializes on page load
- Dropdown toggles properly
- Navigation works correctly

## Expected Behavior

### English Pages
- Button shows: `En`
- Dropdown shows: `En` (active/blue), `Gr` (inactive/gray)
- Clicking "Gr" navigates to `/el/[page].html`

### Greek Pages
- Button shows: `Gr`
- Dropdown shows: `Gr` (active/blue), `En` (inactive/gray)
- Clicking "En" navigates to `/[page].html`

### Dropdown Interaction
- Click button → dropdown appears
- Click outside → dropdown closes
- Click language option → navigates and closes dropdown

## Troubleshooting

### Dropdown doesn't appear
- Check browser console for errors
- Verify `lang-switcher.js` is loaded after `header.js`
- Verify dropdown element exists in HTML

### Clicking language doesn't navigate
- Check browser console for JavaScript errors
- Verify button text is exactly "En" or "Gr" (case-sensitive)
- Check network tab to see if navigation is attempted

### Mobile switcher not working
- Verify mobile menu is open
- Check that `lang-dropdown-mobile` element exists
- Test on actual mobile device or DevTools device emulation

## File Checklist

All files should have:
- ✅ `<script src="./assets/js/lang-switcher.js"></script>` (EN)
- ✅ `<script src="../assets/js/lang-switcher.js"></script>` (Greek)
- ✅ `lang-switcher` with button and dropdown (header)
- ✅ `lang-switcher-mobile` with button and dropdown (mobile menu)
- ✅ Correct button text (En/Gr)
- ✅ Dropdown with swapped languages based on current page
