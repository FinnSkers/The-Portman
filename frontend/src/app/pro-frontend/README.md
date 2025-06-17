# Portman - Modern Portfolio Builder

A modern SaaS application that transforms your CV into a stunning professional portfolio website. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 📄 CV Parsing and Analysis
- 💼 Professional Portfolio Generation
- 🎨 Customizable Templates
- 🔄 AI-powered Content Enhancement
- 📱 Responsive and Mobile-friendly
- ♿ Accessible UI (WCAG 2.1 AA compliant)
- ✨ Beautiful Animations and Micro-interactions

## Tech Stack

- **Frontend**:
  - Next.js (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion for animations
  - Three.js with React Three Fiber for 3D effects
  - Lottie for vector animations
  - Swiper for carousels
  - React Hook Form + Zod for form handling and validation

- **Backend** (connected to):
  - FastAPI (Python)
  - SQLAlchemy
  - AI/ML for CV parsing and analysis


  Summary of Our Implementation
We've successfully built a modern, beautiful portfolio SaaS application frontend with Next.js, TypeScript, Tailwind CSS, and various animation/UI libraries. Here's what we've accomplished:

Home Page:

Hero section with animations and 3D effects
Logo marquee
Features showcase
Portfolio templates preview
Pricing section
How it works section
Authentication:

Login page with form validation
Registration page with form validation
API integration for auth services
Dashboard:

Dashboard layout with sidebar navigation
Dashboard overview with stats and getting started guide
CV Upload and Management:

CV upload form with drag-and-drop functionality
File validation and progress indicators
Success states and guidance
Portfolio Creation:

Template selection interface
Portfolio customization options
Publishing workflow
UI Components:

Reusable UI components (buttons, inputs, file upload)
Layout components (headers, footers)
Animation-enhanced components
API Services:

API client for connecting to backend
Service modules for auth, CV, and portfolio features
Documentation:

Comprehensive README with project structure and setup instructions

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Folder Structure

```
frontend/
├── public/              # Static files
│   ├── images/          # Images and assets
│   └── animations/      # Lottie animation files
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── cv/          # CV upload and management
│   │   ├── home/        # Landing page sections
│   │   ├── layout/      # Layout components
│   │   ├── portfolio/   # Portfolio components
│   │   └── ui/          # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and services
│   │   ├── api/         # API clients
│   │   └── utils/       # Helper functions
│   └── styles/          # Global styles
└── __tests__/          # Tests
```

## API Integration

The frontend connects to a FastAPI backend with the following endpoints:

- Auth: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`
- CV: `/cv/upload`, `/cv/{id}`, `/cv/{id}/analyze`
- Portfolio: `/portfolio/generate`, `/portfolio/{id}`

## Development

### Code Style and Linting

The project uses ESLint and Prettier for code consistency.

```bash
# Run linting
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm run test
```

## Accessibility

This project aims for WCAG 2.1 AA compliance and includes:

- Semantic HTML
- Appropriate ARIA attributes
- Keyboard navigation support
- Sufficient color contrast
- Responsive design for all devices

## License

[MIT](LICENSE)
