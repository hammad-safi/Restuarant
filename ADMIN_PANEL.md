# Admin Panel Setup Guide

## Overview
Your restaurant admin panel has been successfully set up with a complete dashboard and management system. The admin panel is built with Next.js, React, and TypeScript with Tailwind CSS styling.

## Admin Panel Structure

### Routes & Pages

```
/admin
├── /dashboard          - Main dashboard with stats and recent orders
├── /orders            - Orders management and tracking
├── /menu              - Menu items management
├── /gallery           - Gallery and photo management
├── /deals             - Special deals and promotions
├── /billing           - Invoice management and payment tracking
└── /settings          - Brand configuration and contact information
```

### Shared Components

Located in `components/admin/`:

- **AdminSidebar.tsx** - Navigation sidebar with responsive design
- **AdminHeader.tsx** - Top header with notifications and user menu
- **AdminLayout.tsx** - Layout wrapper for admin pages

## Features

### Dashboard (`/admin/dashboard`)
- Quick statistics cards (Orders, Revenue, Pending Orders)
- Recent orders table with status tracking
- Visual trend charts
- Kitchen performance metrics

### Orders Management (`/admin/orders`)
- Filter orders by status (All, Pending, Confirmed, Delivered)
- View order details (Customer, Items, Amount, Status)
- Change order status
- Print orders
- Mobile-responsive order cards

### Menu Management (`/admin/menu`)
- View all menu items with images
- Category tags (Burgers, Deals, Sides, Chicken)
- Toggle item availability
- Edit and delete items
- Pagination support
- Add new items (FAB button)

### Gallery (`/admin/gallery`)
- Upload photos with drag & drop
- Filter by category (Food, Interior, Events)
- Delete photos
- Storage statistics
- Responsive grid layout

### Deals Management (`/admin/deals`)
- Create and manage special promotional offers
- View active/inactive deals
- Edit and delete deals
- Quick action buttons

### Billing Management (`/admin/billing`)
- Invoice preview and generation
- Print and download invoice as PDF
- Send invoice via WhatsApp
- Payment status tracking
- Cash received and change calculation
- Recent invoices history

### Settings (`/admin/settings`)
- Brand name and tagline
- Logo upload
- Primary brand color
- Contact information (Phone, WhatsApp, Address)
- Social media links (Instagram, Facebook, TikTok)

## Styling & Design System

### Color Palette
- **Primary:** `#af101a` (Red)
- **Primary Container:** `#d32f2f`
- **Surface:** `#f7f9ff`
- **Secondary:** `#5d5d6f`
- **Tertiary:** `#705300`

### Typography
- **Headlines:** Inter font with various sizes (xl, lg, md)
- **Body:** Inter font (14px, 16px)
- **Labels:** Inter font bold and semi-bold (12px)

### Components
- Cards with shadows and borders
- Toggle switches
- Status badges
- Filter buttons
- Modal-ready forms
- Responsive tables

## Responsive Design

All admin pages are fully responsive:
- **Desktop (lg):** Full sidebar navigation (260px) + content area
- **Tablet (md):** Responsive grid layouts, adjusted spacing
- **Mobile:** Stacked layouts, hidden sidebar, bottom navigation ready

## Getting Started

### Access the Admin Panel
Navigate to: `http://localhost:3000/admin`

This will automatically redirect you to the dashboard.

### Navigation
- Use the sidebar (desktop) to navigate between different admin sections
- Each navigation item is highlighted when active
- Material Icons are used throughout for consistency

### Customization

To customize the admin panel:

1. **Colors:** Edit the Tailwind config in `tailwind.config.js`
2. **Components:** Modify files in `components/admin/`
3. **Pages:** Edit page files in `app/admin/[section]/`
4. **Icons:** Change Material Icons in the components

## Data Integration

The admin panel currently displays:
- Mock/sample data
- Static content from the HTML templates

To connect real data:
1. Create API routes in `app/api/`
2. Fetch data in client components using `useEffect` or server components
3. Update state management as needed
4. Connect to your backend/database

## Features to Implement

- User authentication/login
- Real-time data updates
- Database integration
- File upload handling
- Search and filtering functionality
- Export functionality (CSV, PDF)
- Admin user roles and permissions
- Activity logging

## File Structure

```
app/
├── admin/
│   ├── layout.tsx
│   ├── page.tsx (redirects to dashboard)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── orders/
│   │   └── page.tsx
│   ├── menu/
│   │   └── page.tsx
│   ├── gallery/
│   │   └── page.tsx
│   ├── deals/
│   │   └── page.tsx
│   ├── billing/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
components/
└── admin/
    ├── AdminSidebar.tsx
    ├── AdminHeader.tsx
    └── AdminLayout.tsx
```

## Next Steps

1. **Set up authentication** - Implement login/logout functionality
2. **Connect database** - Link to MongoDB, PostgreSQL, or your preferred database
3. **API integration** - Create API endpoints for data fetching
4. **Add forms** - Implement form submissions for creating/editing items
5. **Real-time updates** - Add WebSocket or polling for live data
6. **Testing** - Add unit and integration tests
7. **Deployment** - Deploy to production

## Troubleshooting

### Sidebar not showing
- Ensure you're on a desktop/larger screen or adjust responsive breakpoints
- Check that `AdminSidebar` component is properly imported

### Navigation not highlighting
- Verify the pathname matches the route in `usePathname()` hook
- Check that `isActive()` function logic is correct

### Styling issues
- Ensure Tailwind CSS is properly configured in your project
- Check that custom colors from the Tailwind config are being used
- Verify that Material Icons are properly loaded

## Support

For more information:
- Check the individual page components for specific implementations
- Review Tailwind CSS documentation: https://tailwindcss.com
- Material Icons: https://fonts.google.com/icons
- Next.js documentation: https://nextjs.org/docs
