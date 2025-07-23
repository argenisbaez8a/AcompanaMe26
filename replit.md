# AcompañaMe - Mental Health Support Application

## Overview

MindCare is a comprehensive mental health support application that helps users track their mood, access wellness exercises, and get educational resources about mental health. The app is built as a full-stack TypeScript application with React frontend and Express backend, designed with a mobile-first approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage with fallback to PostgreSQL
- **API Design**: RESTful API with JSON responses

### Database Schema
The application uses three main tables:
- **users**: Stores user profile information (id, name, age, gender, guardianEmail, guardianName, createdAt)
- **mood_entries**: Tracks daily mood entries (id, userId, mood 1-5 scale, notes, date)
- **exercise_sessions**: Records meditation and breathing exercise sessions (id, userId, type, duration, completedAt)

## Key Components

### User Management
- User registration and profile creation through onboarding flow
- Simple localStorage-based session management
- User profile management with demographics

### Mood Tracking System
- 5-point mood scale (1=Very Bad, 5=Excellent) with emoji representations
- Optional notes for each mood entry
- Visual mood history with color-coded entries
- Pattern analysis for detecting concerning trends

### Wellness Exercises
- **Breathing Exercise**: 4-7-8 breathing technique with guided timer
- **Meditation**: 5-minute guided mindfulness sessions
- Session tracking with duration and completion status
- Progress visualization and statistics

### Educational Resources
- Depression awareness and myth-busting information
- Emergency contact resources and crisis helplines
- Mental health center directory
- Pattern alerts for concerning mood trends
- Critical support alert popup for severe declining patterns (3+ entries from regular to very bad)
- Contact suggestions for friends, family, and guardians in crisis situations
- **Email notification system**: Automatically sends alerts to guardians when critical patterns are detected

### Email Notification System
- **Guardian Contact Management**: Users can optionally provide guardian/parent email during onboarding
- **Critical Pattern Detection**: System monitors mood entries for concerning patterns (3+ low mood entries)
- **Automatic Email Alerts**: When critical patterns are detected and user dismisses the alert, an email is automatically sent to the registered guardian
- **Professional Email Templates**: Comprehensive emails include pattern details, recommendations, and crisis resources
- **SendGrid Integration**: Uses SendGrid API for reliable email delivery
- **User-Controlled Notifications**: Emails are only sent when user acknowledges the alert by closing it

### Mobile-First Design
- Responsive design optimized for mobile devices
- Bottom navigation for easy thumb navigation
- Toast notifications for user feedback
- Accessible UI components with proper ARIA labels

## Data Flow

1. **User Registration**: New users complete onboarding → Profile stored in database → Session created in localStorage
2. **Mood Tracking**: User selects mood + notes → Data sent to `/api/mood-entries` → Stored in database → UI updated
3. **Exercise Sessions**: User completes exercise → Session data sent to `/api/exercise-sessions` → Progress updated
4. **Pattern Analysis**: System analyzes recent mood entries → Displays alerts for concerning patterns → Suggests resources

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Radix UI components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Data Fetching**: TanStack Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date formatting
- **Icons**: Lucide React icons

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Database Provider**: Neon Database serverless driver
- **Session Storage**: connect-pg-simple for PostgreSQL sessions
- **Email Service**: SendGrid API for email notifications (@sendgrid/mail)

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across client and server
- **Database Migrations**: Drizzle Kit for schema management
- **Development**: Hot module replacement, error overlay

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Requirements
- Node.js environment with ES modules support
- PostgreSQL database (configured via DATABASE_URL)
- Neon Database connection for serverless deployment

### Production Configuration
- Static file serving from `dist/public`
- API routes under `/api` prefix
- Error handling middleware for API errors
- Request logging for API endpoints

### Development Workflow
- `npm run dev`: Starts development server with HMR
- `npm run build`: Builds both frontend and backend
- `npm run start`: Runs production build
- `npm run db:push`: Applies database schema changes

The application follows a conventional full-stack TypeScript pattern with clear separation between client and server code, shared type definitions, and a focus on user experience and mental health support features.