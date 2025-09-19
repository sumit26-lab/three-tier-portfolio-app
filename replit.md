# Deepali Bhatnagar Portfolio

## Overview

This is a professional portfolio website for Deepali Bhatnagar, an Assistant Professor and Business Development Professional. The application is built as a full-stack web application featuring a portfolio showcasing her education, experience, projects, and skills, along with an integrated articles/blog system. The site serves as both a professional showcase and a platform for sharing academic and professional insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system following "New York" style
- **State Management**: TanStack Query for server state management
- **Design System**: Professional color palette with navy/blue theme, Inter and Playfair Display fonts

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with dedicated routes for articles and user management
- **Storage Layer**: Abstracted storage interface supporting both in-memory (development) and database implementations
- **Development Setup**: Integrated Vite development server with HMR support

### Database & ORM
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Configured for Neon Database (serverless PostgreSQL)
- **Schema**: Defined schemas for users and articles with proper TypeScript types
- **Migrations**: Drizzle Kit for database migrations and schema management

### Component Architecture
- **Design Pattern**: Modular component structure with separation of concerns
- **Portfolio Sections**: Hero, Education, Experience, Projects, Skills, Contact components
- **Article System**: Dedicated components for article listing, detail view, and management
- **UI Components**: Comprehensive design system with buttons, cards, forms, and navigation
- **Responsive Design**: Mobile-first approach with grid layouts and responsive navigation

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, @assets/)
- **Development Features**: Runtime error overlay, hot module replacement

### Content Management
- **Articles System**: Full CRUD operations for articles with categories, tags, and publishing status
- **Portfolio Content**: Static content for education, experience, projects, and skills
- **Image Assets**: Professional headshot and design assets integration
- **Contact System**: Contact form with professional contact information display

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **Build Tools**: Vite, esbuild for production builds
- **Development**: tsx for TypeScript execution, @replit integrations

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS, Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts (Inter, Playfair Display) via CDN

### Backend Infrastructure
- **Database**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Validation**: Zod for runtime type validation and schema generation
- **Session Management**: connect-pg-simple for PostgreSQL session store

### Data Management
- **API Client**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Date Handling**: date-fns for date formatting and manipulation
- **Utilities**: clsx and tailwind-merge for conditional styling

### Development and Quality
- **Replit Integration**: Development banner, cartographer, runtime error modal
- **Source Maps**: @jridgewell/trace-mapping for debugging support
- **Type Safety**: Comprehensive TypeScript configuration with strict mode