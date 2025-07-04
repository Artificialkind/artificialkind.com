# Artificialkind Website

Company website for Artificialkind - Supercharging the Humankind with Artificial Entities.

🌐 **Live Site**: [https://artificialkind.com](https://artificialkind.com)

## Overview

This is a static website that was originally built with WordPress and has been modernized to use vanilla JavaScript, removing jQuery dependencies and improving security and performance.

## Setup Instructions

### Prerequisites
- Node.js (for running tests)
- Python 3 (for local development server)
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/artificialkind.com.git
cd artificialkind.com
```

2. Install dependencies (only needed for running tests):
```bash
npm install
```

### Development

Start the local development server:
```bash
npm run dev
```

Or directly with Python:
```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

### Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Verification

To verify the website is working correctly:
1. Open `http://localhost:8000/tests/pages/verify-fix.html` in your browser
2. Check that all status indicators show green checkmarks
3. Verify the website preview shows content properly

Additional test pages are available in `/tests/pages/`:
- `debug.html` - Comprehensive debugging interface
- `test-local.html` - Manual test checklist
- `visual-check.html` - Visual regression testing

## Technical Details

### Architecture
- **Pure vanilla JavaScript** - No jQuery or other dependencies
- **Modular design** - Separate modules for navigation, animations, accessibility, and preloader
- **CSS-based fallbacks** - Preloader auto-hides after 3 seconds if JavaScript fails
- **Modern browser features** - Uses Intersection Observer for scroll animations
- **Accessible** - Full keyboard navigation and screen reader support

### File Structure
```
artificialkind.com/
├── index.html          # Main website
├── css/               # Stylesheets
│   ├── min-style.css  # Main styles
│   ├── mobile-menu-fix.css # Mobile menu styles
│   └── scroll-to-top.css # Scroll button styles
├── js/                # JavaScript modules
│   ├── main.js        # Main initialization
│   ├── navigation.js  # Menu and navigation
│   ├── animations.js  # Scroll animations
│   ├── preloader.js   # Loading screen
│   └── accessibility.js # A11y features
├── imgs/              # Images and assets
├── fonts/             # Web fonts
├── tests/             # Test files
│   ├── unit/          # Unit tests
│   └── pages/         # Test HTML pages
├── package.json       # NPM configuration
└── README.md          # This file
```

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Performance
- No jQuery = 90KB+ savings
- Lazy loading for images
- CSS animations for better performance
- Minimal JavaScript footprint

## Deployment

This is a static website designed to be hosted on GitHub Pages.

### GitHub Pages Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select `main` branch and `/ (root)` folder
   - Click Save

2. **Custom Domain (optional)**:
   - Add a `CNAME` file to the repository root with your domain
   - Configure DNS records at your domain registrar:
     - A records pointing to GitHub Pages IPs
     - Or CNAME record pointing to `[username].github.io`

3. **Deployment**:
   - Any push to `main` branch automatically deploys
   - Changes typically appear within minutes
   - Check Actions tab for deployment status

### Local Testing for GitHub Pages

To test the site exactly as it will appear on GitHub Pages:
```bash
# Install Jekyll (if not already installed)
gem install bundler jekyll

# Serve locally with GitHub Pages gem
bundle exec jekyll serve
```

Or use the simpler Python server for basic testing:
```bash
python3 -m http.server 8000
```

## Troubleshooting

### Preloader stays visible
- Check browser console for JavaScript errors
- Ensure all JS files are loading correctly
- The preloader has a CSS fallback that hides it after 3 seconds

### Images not loading
- Verify image paths are correct
- Check that images exist in the `imgs/` directory
- Modern browsers use native lazy loading with `loading="lazy"`

### Tests failing
- Ensure `npm install` has been run
- Tests require Node.js environment
- Unit tests use Jest framework

## Contributing

While this is a company website, we welcome bug reports and suggestions:

1. **Report Issues**: Use GitHub Issues for bug reports
2. **Testing**: Run all tests before submitting changes
3. **Code Style**: Follow existing patterns and conventions
4. **Documentation**: Update README for any structural changes

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit with descriptive messages
6. Push to your fork
7. Open a Pull Request

## License

© Artificialkind 2018-2025. All rights reserved.