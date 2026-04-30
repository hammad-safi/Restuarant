# 🍔 ZAIQA EXPRESS - Fast Food Restaurant Website

A modern, responsive Next.js website for an authentic Pakistani fast food restaurant. Built with TypeScript, Tailwind CSS, and custom Material Design colors.

## 🚀 Features

- ✅ **Responsive Design** - Mobile-first approach, works on all devices
- ✅ **Modern UI/UX** - Custom Tailwind CSS with Pakistani branding colors
- ✅ **Multiple Pages** - Home, Menu, Deals, Contact, Order
- ✅ **SEO Optimized** - Meta tags, structured data, fast loading
- ✅ **WhatsApp Integration** - Direct order placement via WhatsApp
- ✅ **Mobile Navigation** - Bottom nav bar for mobile users
- ✅ **Fast Performance** - Optimized images and code splitting
- ✅ **Accessibility** - WCAG compliant components

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── globals.css             # Global styles and Tailwind directives
│   ├── page.tsx                # Home page
│   ├── menu/
│   │   └── page.tsx            # Menu page with all items
│   ├── deals/
│   │   └── page.tsx            # Promotions and deals page
│   ├── contact/
│   │   └── page.tsx            # Contact and inquiry form
│   └── order/
│       └── page.tsx            # Online ordering page
├── components/
│   ├── Header.tsx              # Main navigation header
│   ├── Footer.tsx              # Footer with links
│   ├── MobileNav.tsx           # Mobile bottom navigation
│   └── WhatsAppFAB.tsx         # WhatsApp floating action button
├── tailwind.config.js          # Tailwind configuration with custom colors
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🎨 Customization

### Colors
All custom colors are defined in `tailwind.config.js`. Modify the `colors` object to match your brand:

```javascript
colors: {
  primary: '#af101a',           // Main red color
  secondary: '#785900',          // Brown color
  'secondary-container': '#fdc003', // Yellow
  // ... more colors
}
```

### Fonts
- **Headlines & Display**: Epilogue (Bold, used for h1-h6)
- **Body Text**: Be Vietnam Pro (Regular & Bold)
- **Icons**: Material Symbols Outlined

### Spacing & Sizing
Custom spacing values defined in `tailwind.config.js`:
- `gutter`: 20px
- `sm`: 12px
- `base`: 8px
- `md`: 24px
- `lg`: 48px
- `xl`: 64px

## 📱 Pages Overview

### Home (`/`)
- Hero banner with CTA buttons
- Featured deals section
- Value proposition with images
- Newsletter signup

### Menu (`/menu`)
- Full menu items with images
- Price in PKR
- Category navigation (sticky)
- "Add to Cart" functionality
- Rating and deal badges

### Deals (`/deals`)
- Flash deal countdown timer
- Bento-style promotion cards
- Special offers and bundles
- Deal category filters

### Contact (`/contact`)
- Contact information cards (phone, email, WhatsApp)
- Contact form
- Embedded map
- Social media links

### Order (`/order`)
- Order form with customer details
- Meal selection dropdown
- WhatsApp order integration
- Featured food images

## 🔗 Integration Points

### WhatsApp Integration
WhatsApp links are configured in `WhatsAppFAB` component. Update the phone number:

```typescript
href="https://wa.me/923456789000?text=Hello%20Zaiqa%20Express"
```

Replace `923456789000` with your actual WhatsApp business number.

### Contact Form
Update the form action endpoint in `app/contact/page.tsx` for form submissions.

### Map Integration
Replace map images with a real interactive map (Google Maps, Mapbox) in:
- `app/contact/page.tsx`

## 📊 Component API

### Header
- Shows navigation for desktop
- Auto-highlights active page using Next.js router

### MobileNav
- Sticky bottom navigation for mobile only (hidden on md and above)
- Shows 4 main sections: Menu, Deals, Cart, WhatsApp
- Active state styling

### WhatsAppFAB
- Fixed position floating action button
- Expandable on hover with text
- Links directly to WhatsApp business

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **AWS**: Use AWS Amplify
- **Firebase**: Use Firebase Hosting
- **Digital Ocean**: Use App Platform

## 📈 Performance Optimization

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting by route
- ✅ CSS-in-JS with Tailwind (no extra CSS files)
- ✅ Lazy loading for images
- ✅ SEO-friendly meta tags

## 🔐 Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=923456789000
NEXT_PUBLIC_BUSINESS_EMAIL=hello@zaiqaexpress.pk
NEXT_PUBLIC_BUSINESS_PHONE=+92213456789
```

## 📝 License

This project is proprietary and confidential.

## 👨‍💻 Developer Notes

- Uses Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- No external UI library (all custom components)
- Responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)

## 🤝 Support

For questions or issues, contact the development team at [support@zaiqaexpress.pk](mailto:support@zaiqaexpress.pk)

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Production Ready ✅
