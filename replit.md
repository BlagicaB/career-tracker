# Career & Job Tracker

## Overview

A comprehensive career management platform designed to help job seekers track applications, manage networking contacts, monitor skills development, and set career goals. Built with a Linear-inspired productivity aesthetic, the application prioritizes information clarity, efficient workflows, and scannable layouts for rapid information retrieval.

The platform follows a utility-focused design approach with minimal decoration, consistent data presentation, and quick navigation between different tracking modules. It serves as a centralized hub for managing all aspects of a job search and career development process.

## Recent Changes (November 2, 2025)

**AI-Powered Job Folders Feature Added**
- Implemented comprehensive Job Folders feature for organizing job application materials
- Created JobFolder data model with job details, AI research fields, hiring manager info, interview notes
- Built AI-powered company research using OpenAI GPT-4o (conducts research based on general knowledge)
- Added resume analysis feature comparing resume content against job requirements
- Created JobFolders page with grid view of all job application packages
- Built AddJobFolderDialog for creating new folders with job details
- Implemented JobFolderDetail component with tabbed interface (Research, Hiring Manager, Resume Analysis, Interview Notes)
- Added EditHiringManagerDialog for managing hiring manager contact information
- Company research generates: summary, history, current state, challenges, culture analysis
- Resume analysis provides: match score, strengths, gaps, recommendations
- All API endpoints include proper Zod validation and error handling
- End-to-end tests passed successfully validating all core workflows
- Note: Production enhancement would integrate real-time web search API for company research

**Camera Scanning Features (October 31, 2025)**
- Implemented QR code scanning for quick contact entry using qr-scanner library
- Integrated OpenAI vision API (gpt-4o) for business card OCR via Replit AI Integrations
- Created CameraScanner component supporting both QR and business card modes
- Updated AddContactDialog with three input modes: Manual Entry, Scan QR Code, Scan Card
- Added /api/scan/business-card endpoint with Zod validation for OCR processing
- Implemented proper error handling with res.ok checks and validation for empty results
- UI shows processing state with disabled controls during OCR operations
- Auto-fills contact form fields from successful scans (vCard format or JSON for QR, extracted data for business cards)

**Backend Persistence Completed (October 30, 2025)**
- Implemented complete in-memory storage (MemStorage) for all entities
- Created RESTful API routes with Zod validation for all CRUD operations
- Added validation to all PATCH endpoints to prevent invalid data persistence
- All entities (applications, resumes, cover letters, contacts, skills, goals) now persist properly

**Frontend Integration Completed (October 30, 2025)**
- Connected all pages to backend APIs using TanStack Query
- Implemented create/edit dialogs for all entities
- Added proper loading states and empty states
- Implemented cache invalidation after mutations
- Dashboard now displays real-time statistics from backend data

**Features Fully Functional**
- ✅ Job Folders - AI-powered job application packages with company research and resume analysis
- ✅ Job Applications tracking with status, priority, salary info
- ✅ Resume management with tagging and application linking
- ✅ Cover Letter management with company/role association
- ✅ Networking/Contacts CRM with status tracking and camera scanning
- ✅ Skills inventory with proficiency levels and categories
- ✅ Goals tracker with progress and status management
- ✅ Dashboard with live metrics and recent activity
- ✅ QR code and business card scanning for rapid contact entry

**Testing**
- End-to-end tests completed successfully for all features including camera scanning
- All CRUD operations verified working correctly
- Data flow confirmed from frontend → API → storage → database
- Manual contact entry flow tested with unique data generation

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

5. **jobFolders** - AI-powered job application packages
   - Job details: company, role, location, description, salary range, URL
   - Foreign keys to resumes and cover letters
   - AI-generated company research fields (summary, history, current state, challenges, culture)
   - Resume analysis (JSON-stringified match score, strengths, gaps, recommendations)
   - Hiring manager info (name, title, LinkedIn, background)
   - Interview notes and questions
   - Application status workflow (researching, applied, interviewing, offer, rejected)
   - Created timestamp

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
- `/job-folders` - AI-powered job application packages with research and analysis
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

### AI & Integration Services
- **OpenAI API** (via Replit AI Integrations) - GPT-4o for resume analysis, company research, business card OCR
- **qr-scanner** - QR code scanning for contact entry

### Additional Libraries
- **cmdk** - Command menu interface component
- **embla-carousel-react** - Carousel/slider functionality
- **nanoid** - Unique ID generation
- **ws** - WebSocket client for Neon database connection

### Google Fonts
- **Inter** - Primary UI font family
- **JetBrains Mono** - Monospace font for numerical data

## AI Features

### Job Folders AI Assistant

**Resume Analysis** (`analyzeResumeForJob`)
- Compares resume content against job description using OpenAI GPT-4o
- Generates match score (0-100) indicating candidate fit
- Identifies strengths that align with job requirements
- Highlights skill gaps and areas for improvement
- Provides actionable recommendations for application success
- Results saved to job folder for reference

**Company Research** (`conductCompanyResearch`)
- Uses AI synthesis to generate comprehensive company insights
- Analyzes company history and founding story
- Describes current business focus and market position
- Identifies challenges and opportunities in the industry
- Synthesizes company culture and values information
- Currently uses GPT-4o general knowledge (production would integrate web search API)
- All research fields saved to job folder

### Business Card OCR
- Uses OpenAI GPT-4o vision model for text extraction from business card images
- Extracts: name, title, company, email, phone, LinkedIn, address
- Auto-populates contact form fields after successful scan
- Includes validation and error handling for failed extractions