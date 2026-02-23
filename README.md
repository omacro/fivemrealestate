# Five M Real Estate — Website

Premium website for Five M Enterprises (fivemrealestate.com), a luxury commercial and resort real estate development firm led by Mike Belitz.

## 🏗 Pages

- **Home** (`index.html`) — Cinematic hero, stats, featured projects, testimonial, CTA
- **Portfolio** (`portfolio.html`) — Detailed showcase of all 4 major projects
- **About** (`about.html`) — Company story, mission/values, executive team
- **Contact** (`contact.html`) — Contact form + interactive meeting scheduler

## 🎨 Design

- **Porsche-inspired:** Dark, cinematic, minimal, technologically advanced
- **Color palette:** Deep blacks (#0a0a0a) with gold accent (#c9a84c)
- **Typography:** Space Grotesk (headings) + Inter (body) via Google Fonts
- **Animations:** Scroll reveal, parallax, counter animations, smooth transitions
- **Responsive:** Mobile-first design, hamburger menu, fluid typography
- **Details:** Film grain overlay, glass-morphism nav, subtle hover states

## 📁 Structure

```
fivem-website/
├── index.html          # Home page
├── portfolio.html      # Portfolio/Projects page
├── about.html          # About page
├── contact.html        # Contact + Scheduler page
├── css/
│   └── style.css       # All styles (~28KB)
├── js/
│   └── main.js         # All JavaScript (~13KB)
├── assets/
│   ├── logo.png        # Generated logo
│   └── images/
│       ├── hero-home.jpg
│       ├── hero-portfolio.jpg
│       ├── windsor-project.jpg
│       ├── colorado-commercial.jpg
│       ├── socal-beachfront.jpg
│       ├── costa-rica.jpg
│       └── about-bg.jpg
└── README.md
```

## 🚀 How to Preview

### Option 1: Direct file
Open `index.html` in any browser (double-click or drag into browser window).

### Option 2: Local server (recommended)
```bash
cd fivem-website

# Python
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```
Then visit `http://localhost:8080`

### Option 3: VS Code Live Server
Install the "Live Server" extension, right-click `index.html`, select "Open with Live Server."

## 🌐 How to Deploy

### Netlify (easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire `fivem-website` folder onto the deploy area
3. Done! Get a custom domain in settings.

### Vercel
```bash
npx vercel deploy .
```

### GitHub Pages
1. Push to a GitHub repo
2. Go to Settings → Pages → Source: main branch
3. Site will be live at `username.github.io/repo-name`

### Traditional Hosting
Upload all files via FTP to your web host's `public_html` directory.

## ✏️ Customization

### Update contact info
Edit the contact details in all 4 HTML files (search for `info@fivemrealestate.com` and `(303) 555-0100`).

### Replace images
Drop new images into `assets/images/` and update the `src` attributes in HTML files.

### Connect the contact form
The form currently simulates submission. To make it functional:
- Use [Formspree](https://formspree.io) — add `action="https://formspree.io/f/YOUR_ID"` to the form tag
- Or use [Netlify Forms](https://docs.netlify.com/forms/setup/) — add `data-netlify="true"` to the form tag

### Connect the scheduler
The built-in scheduler is a UI prototype. To connect a real booking system:
- Replace the scheduler widget with a [Cal.com](https://cal.com) embed
- Or connect to [Calendly](https://calendly.com) embed

## 📋 Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, animations, clamp()
- **Vanilla JavaScript** — No frameworks, no dependencies
- **Google Fonts** — Space Grotesk + Inter
- **Zero dependencies** — No npm, no build step, just files

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile Safari / Chrome (iOS/Android)
