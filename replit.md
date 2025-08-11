# Social Media Video Prompt Generator

## Overview

This is a full-stack web application built with React and Express that generates AI-powered video prompts for social media content. The application allows users to select video categories (tutorial, product demo, storytelling) and input keywords to generate creative, tailored video prompts using OpenAI's GPT-4o model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API with centralized route registration
- **Validation**: Zod schemas for request/response validation
- **Error Handling**: Centralized error middleware with structured responses

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migration System**: Drizzle Kit for schema migrations
- **Storage Implementation**: DatabaseStorage class with full CRUD operations
- **Tables**: Users table (ready for authentication) and Prompts table for storing generated content

### Authentication and Authorization
- **Current State**: Basic user schema defined but not implemented
- **Prepared Infrastructure**: User table with username/password fields and timestamps
- **Session Management**: connect-pg-simple package included for PostgreSQL-backed sessions
- **Database Relations**: One-to-many relationship between users and prompts established

## Key Components

### Frontend Components
- **Home Page**: Main prompt generation interface with category selection and keyword input
- **History Page**: Complete prompt history display with copy functionality and search
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, toasts, and data display components
- **Navigation**: Simple navigation between prompt generator and history pages
- **Form Management**: Integrated form validation with real-time error handling
- **Loading States**: Custom loading spinner and proper loading state management
- **Toast Notifications**: User feedback system for success/error states

### Backend Services
- **OpenAI Integration**: GPT-4o powered prompt generation service
- **Database Storage**: Full CRUD operations for prompt persistence
- **API Endpoints**: Prompt generation (/api/generate-prompts) and history retrieval (/api/prompts)
- **Validation Layer**: Request validation using shared Zod schemas
- **Logging**: Structured request/response logging for API calls

### Shared Types and Validation
- **Schema Definitions**: Centralized Zod schemas for type safety across frontend and backend
- **Type Generation**: Automatic TypeScript types generated from database schema
- **Request/Response Types**: Strongly typed API contracts

## Data Flow

1. **User Input**: User selects category and enters keywords through React Hook Form
2. **Client Validation**: Zod schema validates input before API call
3. **API Request**: TanStack React Query manages HTTP request to Express backend
4. **Server Validation**: Backend validates request using shared Zod schema
5. **AI Generation**: OpenAI service generates 3 creative video prompts
6. **Database Storage**: Each generated prompt is saved to PostgreSQL database
7. **Response Handling**: Structured response with prompts, generation time, and success status
8. **UI Update**: Frontend displays generated prompts with copy functionality and user feedback
9. **History Access**: Users can view all previously generated prompts via /history page

## External Dependencies

### AI Services
- **OpenAI API**: GPT-4o model for creative prompt generation
- **Configuration**: Environment variable-based API key management

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Environment variable-based connection string

### Development Tools
- **Replit Integration**: Development environment with cartographer plugin
- **Vite Plugins**: Runtime error overlay and development enhancements

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Type Checking**: TypeScript compilation validation

### Environment Configuration
- **Development**: tsx for TypeScript execution with hot reloading
- **Production**: Node.js execution of bundled JavaScript
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Static Asset Serving
- **Development**: Vite dev server with middleware integration
- **Production**: Express static file serving from dist/public

The application follows a modern full-stack architecture with strong type safety, comprehensive error handling, and a focus on developer experience through hot reloading and structured logging.

## Recent Updates (2025-01-25)

### Features Added
- **Speech-to-Text Integration**: German speech recognition functionality added to video content textarea with microphone button
- **PIN Security System**: PIN-protected access to history page (PIN: 55555) with custom dialog component  
- **Enhanced UI**: Improved hover effects for microphone button (white to black on hover), updated copyright to 2025
- **Project Documentation**: Comprehensive README.md created with German documentation and technical specifications

### Technical Improvements
- Fixed CSS gradient border clickability issues across form elements
- Implemented visual feedback animations for speech recognition (red pulse during recording)
- Added error handling for browsers without speech recognition support
- Enhanced user experience with tooltip instructions and proper loading states

### GitHub Repository Preparation
- Created detailed README.md with installation, usage, and deployment instructions
- Project ready for GitHub backup and version control

## Recent Updates (2025-01-26)

### Features Added
- **Translation Functionality**: Added English translation feature for generated prompts with dedicated copy button
- **Fallback API System**: Implemented dual OpenAI API key system (OPENAI_API_KEY primary, REPLIT_APP_VPG fallback)
- **Enhanced UI**: Separate copy buttons for original and translated content with visual feedback

### Technical Improvements
- Automatic API key switching on failures for improved reliability
- Comprehensive error handling for translation requests
- Optimized user experience with individual copy functionality for translations
- Enhanced logging system for API key fallback monitoring
- **JSON Export Feature**: Added JSON format copy button for structured data export
- **History Page Translation**: Extended translation functionality to history page with consistent UI patterns
- **UI Improvements**: Footer styling updated with consistent gray background and gray-white text
- **GitHub Link Removal**: Cleaned up footer by removing GitHub reference for production readiness