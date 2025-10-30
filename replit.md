# Career & Job Tracker

## Overview

A comprehensive career management platform designed to help job seekers track applications, manage networking contacts, monitor skills development, and set career goals. Built with a Linear-inspired productivity aesthetic, the application prioritizes information clarity, efficient workflows, and scannable layouts for rapid information retrieval.

The platform follows a utility-focused design approach with minimal decoration, consistent data presentation, and quick navigation between different tracking modules. It serves as a centralized hub for managing all aspects of a job search and career development process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI System**
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui component library (New York style variant) for consistent design patterns
- Custom CSS variables for theme-able color system supporting light/dark modes

**Design System**
- Typography: Inter for UI elements, JetBrains Mono for numerical/monospace data
- Spacing: Tailwind units (2, 4, 6, 8, 12, 16) for consistent rhythm
- Layout: Fixed navigation bar with responsive grid systems
- Interactive states: Custom elevation system using CSS variables (--elevate-1, --elevate-2)

**Component Architecture**
- Atomic design pattern with reusable components in `/client/src/components/`
- Feature-based page components in `/client/src/pages/`
- Shared UI components from shadcn in `/client/src/components/ui/`
- Custom hooks in `/client/src/hooks/` for cross-cutting concerns

### Backend Architecture

**Runtime & Framework**
- Node.js with Express.js for HTTP server
- TypeScript throughout for type safety
- ESM module system

**API Design**
- RESTful API architecture with routes prefixed under `/api`
- Storage abstraction layer via `IStorage` interface
- Current implementation uses in-memory storage (`MemStorage`)
- Designed for easy migration to database-backed storage

**Data Layer**
- Drizzle ORM configured for PostgreSQL (Neon serverless)
- Schema-first approach with TypeScript types generated from Drizzle schemas
- Zod integration via drizzle-zod for runtime validation

**Development Workflow**
- Vite middleware mode for development with HMR
- Custom logging middleware for API request tracking
- Express middleware for JSON body parsing with raw body preservation

### Database Schema

**Core Tables** (defined in `/shared/schema.ts`)

1. **users** - User authentication
   - UUID primary key with auto-generation
   - Username/password fields
   - Unique constraint on username

2. **applications** - Job application tracking
   - Company, role, location, status, priority fields
   - Date tracking (applied date, next follow-up)
   - Salary and offer amount tracking
   - Job type categorization
   - Foreign key references to resumes and cover letters
   - Rich metadata (job URL, referral source, notes)

3. **resumes** - Resume document management
   - Title, upload date, file size
   - Tag-based organization (array field)
   - Content storage for full text

4. **coverLetters** - Cover letter management
   - Title, company, role association
   - Creation and modification timestamps
   - Tag-based organization
   - Content storage for full text

**Schema Patterns**
- UUID primary keys for all tables
- Timestamp fields for audit trails
- Text arrays for flexible tagging
- Nullable fields for optional metadata

### State Management

**Client-Side State**
- TanStack Query for server state with custom query client configuration
- Stale time set to Infinity with manual refetch control
- Custom query functions with 401 handling strategies
- Local component state via React hooks for UI-only state

**Data Fetching**
- Centralized `apiRequest` helper for HTTP calls
- Credential inclusion for session-based auth
- JSON serialization/deserialization handling
- Error handling with response status checking

### Routing Strategy

**Client-Side Routes** (via Wouter)
- `/` - Dashboard with metrics overview
- `/job-search` - Job search and discovery
- `/applications` - Application tracking table
- `/networking` - Contact management
- `/skills` - Skills inventory and tracking
- `/goals` - Goal setting and progress
- `/resumes` - Resume management
- `/cover-letters` - Cover letter management

**Navigation**
- Top navigation bar with icon-based menu items
- Active route highlighting
- Responsive design for mobile/tablet/desktop

### Authentication & Session

**Current State**
- User schema defined but authentication not implemented
- Session middleware prepared (connect-pg-simple installed)
- Cookie-based session strategy planned

**Planned Approach**
- Session-based authentication with PostgreSQL session store
- Credentials included in all API requests
- 401 handling in query client for unauthorized states

## External Dependencies

### Database & Infrastructure
- **Neon Serverless PostgreSQL** - Primary database with WebSocket support
- **Drizzle ORM** (v0.39.1) - Type-safe database queries and migrations
- **Drizzle Kit** - Schema management and migrations

### UI Component Libraries
- **Radix UI** - Comprehensive set of accessible primitives (accordion, dialog, dropdown, select, etc.)
- **Lucide React** - Icon library for consistent iconography
- **date-fns** (v3.6.0) - Date formatting and manipulation

### Form Management
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Validation resolver integration
- **Zod** - Schema validation library

### Styling & Design
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Conflicting class name resolution
- **clsx** - Conditional class name construction

### Development Tools
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety across the stack
- **PostCSS** - CSS processing with Autoprefixer
- **ESBuild** - Production bundle building for server

### Additional Libraries
- **cmdk** - Command menu interface component
- **embla-carousel-react** - Carousel/slider functionality
- **nanoid** - Unique ID generation
- **ws** - WebSocket client for Neon database connection

### Google Fonts
- **Inter** - Primary UI font family
- **JetBrains Mono** - Monospace font for numerical data