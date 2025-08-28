# TRANEX Sports Website

A modern, responsive website for TRANEX Sports, specializing in elite sports performance equipment including flywheel training systems and fencing equipment.

## 🏃‍♂️ Features

- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Product Catalog**: Detailed product pages with image galleries
- **Shopping Cart**: Full cart functionality with local storage
- **User Authentication**: Supabase-powered user management
- **Multi-language Support**: English and Arabic with RTL support
- **Theme Switching**: Light/dark mode toggle
- **Performance Analytics**: Real-time tracking and data visualization
- **SEO Optimized**: Meta tags, OpenGraph, and structured data

## 🏗️ Project Structure

```
tranex_website/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page-specific components
│   ├── styles/             # CSS stylesheets
│   ├── scripts/            # JavaScript modules
│   ├── utils/              # Utility functions
│   └── assets/             # Images, icons, and media
├── config/                 # Configuration files
├── index.html              # Homepage
├── about.html              # About page
├── contact.html            # Contact page
├── store.html              # Store page
├── product-details.html    # Product details page
├── services.html           # Services page
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Modern web browser
- Supabase account (for backend functionality)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tranex_website
   ```

2. **Start local server**
   ```bash
   # Using Python (recommended)
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🔧 Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Update `config/supabase.js`:

```javascript
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### 3. Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `config/database-schema.sql`
3. Run the SQL script to create all tables and sample data

### 4. Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your site URL and redirect URLs
3. Set up email templates if needed

## 📱 Pages Overview

### Homepage (`index.html`)
- Hero section with sports equipment showcase
- Features highlighting TRANEX Sports benefits
- Equipment showcase grid
- About preview section
- Call-to-action for consultation

### Product Details (`product-details.html`)
- Image gallery with thumbnails
- Product information and pricing
- Configuration options (resistance, color)
- Detailed specifications
- Customer reviews
- Related products

### Store (`store.html`)
- Product catalog with filtering
- Category-based organization
- Search functionality
- Shopping cart integration

### About (`about.html`)
- Company story and mission
- Team information
- Values and principles
- Company achievements

### Contact (`contact.html`)
- Contact form with validation
- Company information
- Location details
- FAQ section

### Services (`services.html`)
- Service offerings overview
- Process explanation
- Technology solutions
- Consultation booking

## 🎨 Customization

### Colors and Themes

The website uses CSS custom properties for easy theming:

```css
:root {
  --primary: #3b82f6;      /* Primary brand color */
  --accent: #8b5cf6;       /* Accent color */
  --text: #1f2937;         /* Main text color */
  --muted: #6b7280;        /* Muted text color */
  --bg: #ffffff;           /* Background color */
  --surface: #f9fafb;      /* Surface color */
  --border: #e5e7eb;       /* Border color */
}
```

### Adding New Products

1. **Database**: Add product to Supabase `products` table
2. **Images**: Place product images in `src/assets/images/`
3. **Content**: Update product details in the HTML
4. **Styling**: Add custom CSS if needed

### Language Support

The website supports English and Arabic:

- Use `data-en` and `data-ar` attributes for translatable content
- JavaScript automatically switches between languages
- RTL support for Arabic text

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure form submissions
- **Authentication**: Supabase Auth integration

## 📊 Performance Features

- **Lazy Loading**: Images load as needed
- **Optimized Assets**: Compressed images and minified CSS/JS
- **Caching**: Local storage for cart and preferences
- **Responsive Images**: Different sizes for different devices
- **Code Splitting**: Modular JavaScript architecture

## 🧪 Testing

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Device Testing

- Desktop (1920x1080, 1366x768)
- Tablet (768x1024, 1024x768)
- Mobile (375x667, 414x896)

## 🚀 Deployment

### Static Hosting

1. **Netlify**:
   - Connect your Git repository
   - Build command: `none` (static site)
   - Publish directory: `.`

2. **Vercel**:
   - Import your Git repository
   - Framework preset: `Other`
   - Build command: `none`

3. **GitHub Pages**:
   - Enable GitHub Pages in repository settings
   - Source: `main` branch

### Environment Variables

Set these in your hosting platform:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📈 Analytics and Monitoring

- **Google Analytics**: Track user behavior
- **Supabase Analytics**: Monitor database performance
- **Error Tracking**: Console error logging
- **Performance Monitoring**: Core Web Vitals tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary to TRANEX Sports. All rights reserved.

## 🆘 Support

For technical support or questions:

- **Email**: tech@tranex.com
- **Documentation**: [docs.tranex.com](https://docs.tranex.com)
- **Issues**: Create an issue in this repository

## 🔄 Updates and Maintenance

### Regular Tasks

- **Weekly**: Check for broken links and images
- **Monthly**: Update product information and pricing
- **Quarterly**: Review and update content
- **Annually**: Major design and feature updates

### Monitoring

- **Uptime**: 99.9% target
- **Performance**: Core Web Vitals > 90
- **Security**: Regular dependency updates
- **Backup**: Daily database backups

---

**Built with ❤️ by TRANEX Sports Team**
