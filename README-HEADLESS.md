# Laundromat Headless WordPress Backend

## Quick Start

### 1. Start Docker containers

```bash
docker-compose up -d
```

This will start:
- WordPress at http://localhost:8080
- phpMyAdmin at http://localhost:8081

### 2. Complete WordPress Installation

1. Open http://localhost:8080
2. Select language and complete setup
3. Create admin account

### 3. Activate Theme

1. Go to **Appearance > Themes**
2. Activate **Laundromat Headless** theme

### 4. Install Polylang (for bilingual support)

1. Go to **Plugins > Add New**
2. Search for "Polylang"
3. Install and activate
4. Go to **Languages** and add:
   - English (en)
   - Greek (el)

### 5. Add Content

After activating the theme, you'll see new menu items:
- **Locations** - Add your laundromat locations
- **Tips** - Add laundry tips
- **Instructions** - Add usage instructions
- **FAQs** - Add frequently asked questions
- **Services** - Add your services
- **Contact Settings** - Set contact info (phone, email, social links)

## REST API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/wp-json/wp/v2/locations` | Get all locations |
| `/wp-json/wp/v2/tips` | Get all tips |
| `/wp-json/wp/v2/instructions` | Get all instructions |
| `/wp-json/wp/v2/faqs` | Get all FAQs |
| `/wp-json/wp/v2/services` | Get all services |
| `/wp-json/laundromat/v1/settings` | Get contact settings |
| `/wp-json/laundromat/v1/contact` | POST - Submit contact form |
| `/wp-json/laundromat/v1/categories` | Get content categories |

### Adding language filter

Add `?lang=en` or `?lang=el` to filter by language (requires Polylang).

## Frontend Integration

The static HTML site automatically loads data from WordPress when available:

1. **api.js** - Main API wrapper (already included in all HTML files)
2. **tips-data.js** - Loads tips/instructions from API
3. **location-section.js** - Loads locations from API
4. **contact.js** - Submits form to WordPress

### Configuration

Edit `assets/js/api.js` to change the API base URL:

```javascript
const CONFIG = {
    API_BASE: 'http://localhost:8080/wp-json',
    // ...
};
```

For production, update this to your WordPress URL.

## Content Categories

Create these categories in **Tips > Categories**:
- Tips and tricks
- Useful resources
- Company news

## File Structure

```
laundromat-wp/
├── docker-compose.yml          # Docker setup
├── wp-content/
│   ├── themes/
│   │   └── laundromat/
│   │       ├── style.css       # Theme header
│   │       ├── functions.php   # Main theme file
│   │       ├── index.php       # Redirect to admin
│   │       └── inc/
│   │           ├── cpt.php           # Custom Post Types
│   │           ├── meta-boxes.php    # Admin meta boxes
│   │           ├── rest-api.php      # REST API + CORS
│   │           └── options-page.php  # Contact Settings
│   └── plugins/                # Plugins directory
└── assets/
    └── js/
        └── api.js              # Frontend API wrapper
```

## Development

### View logs
```bash
docker-compose logs -f wordpress
```

### Stop containers
```bash
docker-compose down
```

### Reset everything
```bash
docker-compose down -v
```

## Production Deployment

1. Export WordPress content via **Tools > Export**
2. Deploy WordPress to your server
3. Import content
4. Update `api.js` API_BASE URL to production WordPress URL
5. Configure CORS in `inc/rest-api.php` if needed
