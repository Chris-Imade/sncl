# Super Nylon Conglomerate Limited - Website

A modern, dynamic website for Super Nylon Conglomerate Limited with a Sanity.io-powered gallery.

## 🚀 Features

- **Dynamic Gallery**: Content managed through Sanity.io CMS
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Clean and professional design
- **Fast Loading**: Optimized images via Sanity CDN
- **Easy Content Management**: Update gallery items without code changes

## 📁 Project Structure

```
sncl-main/
├── index.html              # Homepage
├── about-us.html           # About Us page
├── gallery.html            # Dynamic gallery page
├── contact-us.html         # Contact page
├── gallery.js              # Gallery manager
├── gallery-styles.css      # Gallery styles
├── css/                    # Stylesheets
├── js/                     # JavaScript libraries
├── images/                 # Static images
├── fonts/                  # Web fonts
└── sncl-studio/            # Sanity CMS (not deployed with website)
```

## 🛠️ Development Setup

### 1. Run Local Website

```bash
npm run dev
```

Open: http://localhost:8000

### 2. Run Sanity Studio (for content management)

```bash
cd sncl-studio
npm run dev
```

Open: http://localhost:3333

## 📝 Managing Gallery Content

### Local Studio

```bash
cd sncl-studio
npm run dev
```

Access at: http://localhost:3333

### Production Studio

Access at: https://sncl.sanity.studio/

### Adding Gallery Items

1. Open Sanity Studio (local or production)
2. Click "Gallery Item" → "Create"
3. Fill in:
   - Title (required)
   - Description
   - Image (required)
   - Category (Farm/Events/Products/Community)
   - Featured (optional)
4. Click "Publish"
5. Changes appear on website instantly

## 🎨 Gallery Features

- **Category Badges**: Color-coded by type (Farm, Events, Products, Community)
- **Featured Items**: Yellow badge for highlighted content
- **Image Optimization**: Automatic via Sanity CDN
- **Modal View**: Click images for detailed view
- **Responsive Grid**: 3 columns (desktop), 2 (tablet), 1 (mobile)

## 🔧 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **CMS**: Sanity.io
- **Styling**: Bootstrap 5 + Custom CSS
- **Hosting**: Cloudflare Pages
- **CDN**: Sanity CDN for images

## 🚀 Deployment

See `DEPLOYMENT_SUCCESS.md` for deployment instructions.

## 📞 Support

- Sanity Docs: https://www.sanity.io/docs
- Cloudflare Docs: https://developers.cloudflare.com/pages

## 📄 License

Copyright © 2025 Super Nylon Conglomerate Limited. All Rights Reserved.
