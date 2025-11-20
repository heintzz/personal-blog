# Personal Blog

A full-stack blogging platform built with Next.js, featuring a secure admin dashboard for content management, user authentication via Supabase, and a public-facing blog interface. Powered by AI-driven article summarization using Google's Gemini AI.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [File Structure](#file-structure)
- [API Routes](#api-routes)
- [Features](#features)
- [LLM Integration](#llm-integration)
- [Bonus Features & Future Improvements](#bonus-features--future-improvements)
- [Deployment](#deployment)

---

## Project Overview

This is a comprehensive blogging platform that combines a powerful admin dashboard with a clean public interface. Built with modern web technologies, it enables content creators to manage articles effortlessly while providing readers with an intuitive browsing experience. The platform leverages Google's Gemini AI to automatically generate article summaries, enhancing SEO and user engagement.

### Key Highlights

- **Secure admin dashboard** for complete content management
- **Full authentication system** with Supabase
- **Rich text editor** using TipTap for enhanced writing
- **AI-powered article summarization** using Gemini AI
- **REST API** for programmatic content access
- **Tag-based categorization** for better content organization
- **Publication status management** (draft, published)
- **PostgreSQL database** with Prisma ORM for robust data handling
- **Production-ready** and deployed on Vercel

---

## Technology Stack

### Frontend

- **Next.js** - React framework with server-side rendering and API routes
- **React** - UI library for interactive components
- **Tailwind CSS** - Utility-first CSS framework for styling
- **TypeScript** - Type-safe JavaScript development (if used)

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Node.js** - JavaScript runtime

### Database & ORM

- **PostgreSQL** - Relational database for data storage
- **Prisma** - Modern ORM for database interactions and migrations

### Authentication

- **Supabase** - Backend-as-a-service for user authentication and storage management

### Editor & Content

- **TipTap** - Headless rich-text editor for article composition

### AI/ML

- **Google Gemini AI** (`gemini-2.0-flash-lite`) - LLM for article summarization

### Deployment

- **Vercel** - Hosting platform optimized for Next.js

---

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following:

- Node.js (v16 or higher)
- npm or yarn package manager
- Git
- PostgreSQL database (or use Supabase's managed database)
- Supabase account for authentication
- Google Gemini API key

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/heintzz/personal-blog
   cd personal-blog
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file by copying the example file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values in the `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_PASSWORD=your_supabase_password
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_PASSWORD=your_database_password
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run database migrations:**

   Apply the Prisma schema to your database:

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

### Database Setup

To set up your database:

- Create a PostgreSQL database
- Update the `DATABASE_URL` in your `.env.local` file with your database connection string
- Run migrations: `npx prisma migrate dev`

---

### ⚠️ Demo Credentials

To explore the admin dashboard, use the following credentials to log in at `/auth/login`:

- **Email**: `mhasnanr@gmail.com`
- **Password**: `personalblogdemo`

---

## File Structure

```
.
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── jsconfig.json             # JS configuration
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── prisma.config.js          # Prisma configuration
├── README.md                 # Project README
├── prisma/
│   ├── schema.prisma         # Prisma schema for database models
│   └── migrations/           # Database migration history
├── public/                   # Static assets (images, svgs, etc.)
└── src/
    ├── proxy.js               # Proxy configuration to protect the routes
    ├── app/
    │   ├── admin/             # Admin-only routes and components
    │   │   ├── layout.js      # Admin layout
    │   │   ├── articles/
    │   │   │   ├── [id]/
    │   │   │   │   └── edit/
    │   │   │   └── new/
    │   │   ├── dashboard/
    │   │   └── settings/
    │   ├── api/                # API routes
    │   │   ├── blogs/
    │   │   │   ├── [id]/
    │   │   │   │   └── status/
    │   │   │   └── summary/
    │   │   ├── gemini/
    │   │   │   └── summarize/
    │   │   └── tags/
    │   ├── auth/
    │   │   └── login/
    │   ├── blogs/              # Public view
    │   │   └── [id]/
    │   ├── components/         # Reusable React components
    │   │   ├── AdminSidebar.jsx
    │   │   ├── ArticleContent.jsx
    │   │   ├── LogoutButton.jsx
    │   │   ├── MainMenu.jsx
    │   │   ├── StatusBadge.jsx
    │   │   ├── TipTapEditor.jsx
    │   │   └── TopBar.jsx
    │   ├── hooks/              # Custom React hooks
    │   │   └── AdminHeaderContext.js
    │   ├── globals.css         # Global CSS styles
    │   └── layout.js           # Root layout
    └── lib/
        ├── prisma.js           # Prisma client initialization
        └── supabase/           # Supabase client and helper functions
            ├── actions.js
            ├── client.js
            ├── server.js
            └── storage.js
```

### Directory Explanations

**prisma/** - Contains the database schema and migration files for Prisma ORM.

**src/app/admin/** - Admin dashboard pages for managing articles and viewing analytics.

**src/app/api/** - RESTful API endpoints for blogs, tags, and AI summarization.

**src/app/auth/** - Authentication-related pages (login, no signup in this app).

**src/app/blogs/** - Public-facing blog pages for readers.

**src/app/components/** - Reusable React components used throughout the application.

**src/app/hooks/** - Custom React hooks for managing state and side effects.

**src/lib/** - Utility functions, Prisma client initialization, and Supabase configuration.

---

## API Routes

- `GET /api/blogs`: Retrieves a list of all blog posts.
- `POST /api/blogs`: Creates a new blog post.
- `GET /api/blogs/summary`: Retrieves a summary of blog posts (e.g., counts).
- `GET /api/blogs/[id]`: Retrieves a single blog post by its ID.
- `PUT /api/blogs/[id]`: Updates a blog post by its ID.
- `DELETE /api/blogs/[id]`: Deletes a blog post by its ID.
- `PUT /api/blogs/[id]/status`: Updates the publication status of a blog post.
- `GET /api/tags`: Retrieves a list of all tags.
- `POST /api/tags`: Creates a new tag.
- `POST /api/gemini/summarize`: Generates a summary for provided article content using Gemini AI.

---

## Features

### Core Features Implemented

✅ **Admin Dashboard** - Secure interface for content creators to manage articles

✅ **User Authentication** - Secure login via Supabase with session management

✅ **Full CRUD Operations** - Complete article management (Create, Read, Update, Delete)

✅ **Rich Text Editor** - TipTap-powered editor for enhanced article composition

✅ **Publication Status Management** - Articles can be drafted or published with status tracking

✅ **Public Blog Interface** - Clean, reader-friendly blog page for viewing published articles

✅ **Tag-Based Categorization** - Organize articles with tags for better discoverability

✅ **AI Article Summarization** - Automatic generation of article summaries using Gemini AI

✅ **REST API** - Comprehensive API endpoints for programmatic content access

✅ **Responsive Design** - Mobile-friendly interface for all devices

✅ **Database Migrations** - Managed schema evolution with Prisma

---

## LLM Integration

This project integrates **Google's Gemini AI** (`gemini-2.0-flash-lite` model) to provide automated article summarization.

### How It Works

When an article is created or updated, the `/api/gemini/summarize` endpoint processes the article content and generates a concise summary. This summary is:

- **Concise** - Limited to 150 characters for use in meta descriptions and preview cards
- **Automatic** - Generated without manual intervention
- **SEO-optimized** - Improves search engine visibility and click-through rates
- **User-friendly** - Provides quick context for readers browsing articles

### Implementation Details

- **API Endpoint:** `POST /api/gemini/summarize`
- **Input:** Article content (text or HTML)
- **Output:** AI-generated summary (≤150 characters)
- **Model Used:** `gemini-2.0-flash-lite`
- **Configuration:** Set your `GEMINI_API_KEY` in `.env.local`

### Future AI Enhancements

- Title generation assistance
- Keyword extraction for better tagging
- Content tone analysis
- Writing style recommendations

---

## Bonus Features & Future Improvements

### Planned Enhancements

- **Search Functionality** - Full-text search to find articles easily
- **User Roles & Permissions** - Support multiple roles (contributor, editor, admin) with granular permissions
- **Comments & Engagement** - Allow readers to comment on articles with admin moderation
- **Analytics Dashboard** - Track article views, engagement metrics, and reader demographics
- **Email Notifications** - Notify author of new comments or engagement
- **Related Articles** - Recommend similar articles based on tags and content
- **Social Media Integration** - Share articles on Twitter, LinkedIn, Facebook
- **Newsletter Feature** - Allow readers to subscribe for email updates
- **Draft Collaboration** - Enable multiple authors to work on drafts
- **Version History** - Track and restore previous article versions

### Advanced Features

- **Multi-language Support** - Internationalization (i18n) for global audience
- **Author Profiles** - Display author information and bio
- **Article Scheduling** - Schedule posts to publish at specific times
- **Image Optimization** - Automatic image compression and responsive sizing
- **CDN Integration** - Serve static assets via CDN for faster loading
- **Dark Mode** - Complete dark theme implementation
- **PWA Support** - Offline reading and installable app capability
- **Advanced Caching** - Implement Redis caching for improved performance

---

## Live Demo

🚀 **Visit the deployed application:**  
[GUEST] - [https://heintzz-blog.vercel.app](https://heintzz-blog.vercel.app)  
[ADMIN] - [https://heintzz-blog.vercel.app/auth/login](https://heintzz-blog.vercel.app/auth/login)

---

## Getting Help

- **Next.js Documentation** - [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Documentation** - [prisma.io/docs](https://prisma.io/docs)
- **Supabase Documentation** - [supabase.com/docs](https://supabase.com/docs)
- **Gemini AI Documentation** - [ai.google.dev/docs](https://ai.google.dev/docs)
- **Tailwind CSS Documentation** - [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to improve this project.

## License

This project is open source and available under the MIT License.

---

**Created by [heintzz](https://github.com/heintzz)**
