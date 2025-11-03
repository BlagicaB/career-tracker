# Career & Job Tracker

## Overview

A comprehensive career management platform designed to help job seekers track applications, manage networking contacts, monitor skills development, and set career goals. The platform offers a centralized, efficient, and visually clear hub for managing all aspects of a job search and career development process, inspired by Linear's productivity aesthetic. Key capabilities include AI-powered job application package creation with company research and resume analysis, job application tracking, resume and cover letter management (including PDF upload with text extraction), networking CRM with camera scanning for contacts, skills inventory, and a goal tracker.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18+ and TypeScript, utilizing Vite for development and Wouter for routing. UI components are constructed using Radix UI primitives, styled with Tailwind CSS and `shadcn/ui` (New York style variant) for a consistent, accessible design. A custom, theme-able color system supports light/dark modes. State management for server data is handled by TanStack Query, while local component state uses React hooks. The design system emphasizes typography (Inter, JetBrains Mono), consistent spacing, and a responsive grid layout.

### Backend Architecture

The backend uses Node.js with Express.js and TypeScript, designed with a RESTful API architecture. It features a storage abstraction layer, currently implemented with in-memory storage (`MemStorage`), but designed for easy migration to database-backed solutions. Data validation is enforced using Zod. Authentication is planned to be session-based with a PostgreSQL session store.

### Database Schema

The core database schema, defined using Drizzle ORM for PostgreSQL, includes tables for `users`, `applications`, `resumes`, `coverLetters`, and `jobFolders`. These tables track user information, job application details, resume and cover letter content, and comprehensive AI-powered job application packages. UUID primary keys, timestamp fields, and text arrays for tagging are consistently used.

### State Management

Client-side state relies on TanStack Query for server state management, configured with `Infinity` stale time and manual refetch control. A centralized `apiRequest` helper manages HTTP calls, including credential handling, JSON serialization, and error management.

### Routing Strategy

Client-side routing is handled by Wouter, supporting routes for Dashboard, Job Search, Applications, Job Folders, Networking, Skills, Goals, Resumes, and Cover Letters. Navigation is via a top bar with active route highlighting and a responsive design.

## External Dependencies

### Database & Infrastructure
- **Neon Serverless PostgreSQL**: Primary database.
- **Drizzle ORM & Drizzle Kit**: Type-safe database queries, schema management, and migrations.

### UI Component Libraries
- **Radix UI**: Accessible UI primitives.
- **Lucide React**: Icon library.
- **shadcn/ui**: React components for UI.

### Form Management
- **React Hook Form**: Form state management.
- **Zod**: Schema validation.

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework.
- **class-variance-authority, tailwind-merge, clsx**: Utilities for styling.

### AI & Integration Services
- **OpenAI API** (via Replit AI Integrations): GPT-4o for resume analysis, company research, and business card OCR.
- **qr-scanner**: QR code scanning.

### Additional Libraries
- **pdfjs-dist**: PDF parsing for resume upload and text extraction.
- **date-fns**: Date manipulation.
- **cmdk**: Command menu.
- **nanoid**: Unique ID generation.
- **ws**: WebSocket client.

### Google Fonts
- **Inter**: Primary UI font.
- **JetBrains Mono**: Monospace font.