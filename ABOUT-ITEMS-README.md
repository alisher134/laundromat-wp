# About Items - WordPress Integration Guide

The "About Laundromat" slider on the homepage is now fully editable from WordPress admin. This feature allows you to manage the cards shown in the slider without touching any code.

## ✅ What Was Implemented

### 1. Custom Post Type: "About Items"
- **Location in Admin**: WordPress Admin → About Items
- **Menu Icon**: Info icon (ℹ️)
- **REST API Endpoint**: `/wp-json/wp/v2/about_items`

### 2. Fields (Similar to Services UI)
Each About Item has the following fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Title** | Text | Main heading | "365 days" |
| **Secondary Title** | Text | Detailed subtitle | "Open 365 days, 07:00–00:00" |
| **Description** | Textarea | Short tagline | "Laundry that fits your life..." |
| **Icon Image** | Featured Image | Icon uploaded to Media Library | PNG 100x100px |

### 3. Features
- ✅ Clean, user-friendly admin interface
- ✅ Live SVG preview in admin
- ✅ REST API integration
- ✅ Polylang/multilingual support
- ✅ Automatic slider initialization
- ✅ Fallback to static content if API unavailable
- ✅ Responsive design maintained
- ✅ All existing animations preserved

## 🚀 Quick Start

### Step 1: Create About Items in WordPress
1. Go to **WordPress Admin → About Items → Add New**
2. Create your slider items with title, secondary title, and description

### Step 2: Upload Icon Images
1. Download or create icon images (PNG, 100x100px recommended)
2. Go to **WordPress Admin → Media → Add New**
3. Upload your icon images

### Step 3: Assign Icons to Items
1. Go to **About Items** in the left sidebar
2. You should see 3 items: "365 days", ">60 min", "low prices"
3. Click each item to edit
4. In the "Featured Image" box (right sidebar), click "Set featured image"
5. Select your uploaded icon
6. Click "Update"

### Step 4: Test the Frontend
1. Open your homepage (index.html or /)
2. Scroll to the "About Laundromat" section
3. The slider should show items from WordPress with icons
4. Check browser console for confirmation: `[About Section] Loaded X items from API`

## ➕ Adding New About Items

### Method 1: WordPress Admin (Recommended)

1. **Prepare your icon image**
   - Format: PNG with transparent background
   - Size: 100x100px (or any square size)
   - Download from Flaticon, Icons8, or create your own

2. Go to **WordPress Admin → About Items → Add New**

3. Fill in the fields:
   - **Title**: Enter the main heading (e.g., "24/7 support")
   - **Secondary Title**: Add detail (e.g., "Customer support available 24/7")
   - **Description**: Add a tagline (e.g., "We're here when you need us")

4. Add the icon image:
   - In the right sidebar, find "Featured Image" box
   - Click "Set featured image"
   - Upload your icon or select from Media Library
   - Click "Set featured image"

5. Click **Publish**

### Method 2: REST API

```javascript
// First, upload the icon image to Media Library and note its ID
// Then create a new about item via API
const response = await fetch('http://localhost:8080/wp-json/wp/v2/about_items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    title: 'eco-friendly',
    status: 'publish',
    featured_media: 123, // The attachment ID of your uploaded icon
    meta: {
      secondary_title: 'Environmentally conscious cleaning',
      description: 'Sustainable laundry solutions'
    }
  })
});
```

## 🎨 Icon Image Guidelines

### Requirements
- **Format**: PNG with transparent background
- **Size**: 100x100px to 500x500px (square)
- **File size**: Under 50KB
- **Color**: Blue (#3A6D90) or brand colors
- **Background**: Transparent (no white/colored background)

### Where to Get Icons
- **Flaticon**: https://www.flaticon.com/ (best variety)
- **Icons8**: https://icons8.com/icons (great quality)
- **The Noun Project**: https://thenounproject.com/ (simple, clean)
- **Convert SVG to PNG**: https://cloudconvert.com/svg-to-png

### Recommended Icon Sizes
- **Minimum**: 100x100px (acceptable but may look pixelated on retina displays)
- **Recommended**: 200x200px (crisp on all screens)
- **Maximum**: 500x500px (overkill, increases file size)

## 🌍 Multilingual Support (Polylang)

### Adding Translations
1. Create an About Item in English
2. Click the language flag icon in the About Items list
3. Click "+" next to the language you want to translate to
4. Fill in the translated content
5. Use the same SVG icon or a culturally appropriate one

### API Usage with Languages
```javascript
// English items
const enItems = await LaundroAPI.getAboutItems(); // Uses auto-detected language

// Greek items
LaundroAPI.setLanguage('el');
const grItems = await LaundroAPI.getAboutItems();
```

## 🔧 Technical Details

### File Structure
```
wp-content/themes/laundromat/
├── inc/
│   ├── cpt.php              # Custom Post Type registration
│   ├── meta-boxes.php       # Admin UI for About Items
│   └── rest-api.php         # REST API enhancements
└── functions.php            # Theme hooks

assets/js/
├── api.js                   # LaundroAPI.getAboutItems() method
└── about-section.js         # Dynamic slider rendering
```

### REST API Response
```json
{
  "id": 123,
  "title": {
    "rendered": "365 days"
  },
  "icon_image_url": "http://localhost:8080/wp-content/uploads/2026/01/icon-365.png",
  "meta": {
    "secondary_title": "Open 365 days, 07:00–00:00",
    "description": "Laundry that fits your life, not the other way around"
  },
  "lang": "en"
}
```

### JavaScript API
```javascript
// Fetch all about items
const items = await LaundroAPI.getAboutItems();

// Returns array of objects:
// [
//   {
//     id: 1,
//     title: "365 days",
//     secondaryTitle: "Open 365 days, 07:00–00:00",
//     description: "Laundry that fits your life...",
//     iconImageUrl: "http://localhost:8080/wp-content/uploads/2026/01/icon-365.png"
//   }
// ]
```

### How It Works
1. Page loads → `about-section.js` executes
2. Calls `LaundroAPI.getAboutItems()`
3. Fetches data from `/wp-json/wp/v2/about_items?lang=en`
4. Clears existing static HTML
5. Generates cards dynamically with fetched data
6. Initializes Keen Slider
7. Falls back to static HTML if API fails

## 🐛 Troubleshooting

### Slider shows old static content
**Cause**: API not available or JavaScript error

**Solution**:
1. Check browser console for errors
2. Verify API endpoint works: Visit `http://localhost:8080/wp-json/wp/v2/about_items`
3. Check that `api.js` loads before `about-section.js` in HTML

### Icons not showing
**Cause**: Featured image not set or image URL broken

**Solution**:
1. Edit the About Item
2. Check if "Featured Image" is set in right sidebar
3. If not, click "Set featured image" and select an icon
4. Verify image appears in Media Library
5. Check that image URL is accessible (click image in Media Library)

### Slider not initializing
**Cause**: KeenSlider not loaded or DOM not ready

**Solution**:
1. Verify KeenSlider CDN is accessible
2. Check for console errors
3. Ensure slider container `#about-slider` exists in HTML

### Items not appearing in correct language
**Cause**: Language detection or Polylang not configured

**Solution**:
1. Check `LaundroAPI.getLanguage()` in console
2. Verify Polylang is active and configured
3. Ensure items are translated in WordPress admin

## 📝 Best Practices

### Content Guidelines
- **Titles**: Keep under 15 characters for best display
- **Secondary Titles**: 1 line, specific detail
- **Descriptions**: 1-2 lines, emotional benefit
- **Icons**: Simple, recognizable, brand-colored

### Performance
- Limit to 3-5 items for optimal slider UX
- Use optimized SVG (remove unnecessary metadata)
- Publish only items you want visible (use draft for others)

### Order
Items display in **post date** order (newest first). To reorder:
1. Edit the item
2. Change "Published on" date
3. Update

Or use a plugin like "Simple Custom Post Order"

## 🎉 Success!

Your About section is now fully manageable from WordPress! No more code editing required to update the homepage slider content.

**Next Steps**:
- Add more items
- Translate to other languages
- Customize SVG icons for your brand
- Share with content editors
