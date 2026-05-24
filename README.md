# Kinase - Landing Page

A modern, responsive landing page built with React, TypeScript, and Vite. Featuring dynamic sections for courses, testimonials, payment schedules, and more.

## Features

- ⚡ **Vite** for fast development and optimized builds
- 🎨 **Tailwind CSS** for modern, responsive design
- ✨ **Framer Motion** for smooth animations
- 🔐 **Supabase Integration** for backend services
- 📧 **Email Support** via Resend
- 📱 **Fully Responsive** design
- ✅ **Type-Safe** with TypeScript

## Project Structure

```
src/
├── components/      # Reusable UI components (Navbar, Footer)
├── sections/        # Page sections (Hero, Features, Courses, etc.)
├── api/            # API integration functions
├── assets/         # Images and static assets
├── lib/            # Utility functions and helpers
├── types.ts        # Shared interfaces and types
└── App.tsx         # Main application component
```

**For detailed structure documentation**, see [STRUCTURE.md](./STRUCTURE.md)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_CONTACT_EMAIL=your-email@yourdomain.com
```

See [api/README.md](./api/README.md) for email API setup.

## API Documentation

The project includes serverless functions for email handling:

- **POST /api/send-email** - Send lead notification emails
  - See [api/README.md](./api/README.md) for full documentation
  - Includes validation, sanitization, and email templates

## ESLint Configuration

This project uses ESLint with type-aware rules for production quality. The configuration is already optimized in `eslint.config.js`.
