Project Plan: Naturalization Practice Hub (Technical Expansion)

1. Project Overview

Project Name: Naturalization Practice Hub

Objective: Develop a high-performance, accessible, and scalable web platform using Next.js (App Router) for users to practice for the U.S. naturalization test. The platform will be server-side rendered (SSR) for fast performance and statically generated (SSG) for content pages, providing a seamless multi-language experience.

Core Value Proposition: To provide a personalized, on-demand, and accessible learning path for naturalization candidates, removing language barriers and building confidence through interactive quizzes and detailed progress tracking.

Target Audience:

Prospective U.S. citizens preparing for the naturalization interview and civics test.

Users who are non-native English speakers and require study materials in Spanish, Chinese, Arabic, French, Vietnamese, etc.

Libraries, immigration centers, and tutors seeking a reliable resource for their clients.

2. Project Scope & Features

In Scope

Architecture: Next.js 14+ (App Router), TypeScript, server-side rendering, and static site generation.

Authentication: Secure user account creation and login (Email/Password, Google, and one other social provider) using NextAuth.js.

Internationalization (i18n): Fully internationalized UI and content using next-intl, with internationalized routing (e.g., /en/quiz, /es/quiz).

Launch Languages: English, Spanish, and Chinese (Mandarin, simplified).

Quiz Engine:

Practice mode (e.g., 10 random questions by category: Civics, History).

Full Mock Test mode (simulating the official 100-question test format).

Instant feedback (correct/incorrect) and final score calculation.

User Dashboard:

Secure, protected route (/dashboard).

Visualization of score history (e.g., line chart with recharts).

Breakdown of performance by category.

List of past quiz attempts.

Content & Data:

A database of all official civics questions.

Verified translations for all questions and UI elements for the 3 launch languages.

Admin Panel:

Basic, secure (role-based) interface.

CRUD (Create, Read, Update, Delete) functionality for questions.

CRUD functionality for translations associated with each question.

Static Pages: Landing Page (Marketing), About Us, FAQ, Resources (links to official USCIS forms).

Responsiveness: Mobile-first, fully responsive design using Tailwind CSS.

Out of Scope (for v1.0)

AI-Driven Features: AI-generated questions, AI-based oral interview practice/simulation.

Offline Functionality: No Progressive Web App (PWA) features for offline quizzes in the initial release.

Native Mobile Apps: No iOS or Android app development.

Community Features: User forums, real-time chat, or user-to-user messaging.

Payment Integration: All features will be free at launch.

3. Technology Stack

Layer

Technology

Justification

Framework

Next.js 14+ (App Router)

Chosen for its hybrid SSR/SSG capabilities, file-based routing, built-in API (Route Handlers), and React Server Components.

Language

TypeScript

For end-to-end type safety, from frontend components to backend API routes and database models.

UI

React 18+ (Server & Client Components)

The core of Next.js. We will strategically use Server Components for data fetching and Client Components for interactivity.

Styling

Tailwind CSS

A utility-first CSS framework for rapid, responsive, and consistent UI development.

UI Components

shadcn/ui

A set of accessible, unstyled components (built on Radix UI) that we can easily theme with Tailwind.

Backend API

Next.js Route Handlers

We will not build a separate backend. All API logic (submitting quizzes, fetching data) will be handled by type-safe Route Handlers in /app/api/.

Database

PostgreSQL (via Neon)

A robust, scalable, and relational database perfect for storing user data, questions, and quiz attempts. (Changed from Supabase/Neon to just Neon).

ORM

Prisma

Provides a type-safe database client and declarative schema management, integrating perfectly with TypeScript and Next.js.

Auth

NextAuth.js (v5 / Auth.js)

The standard for Next.js authentication. Integrates seamlessly with the App Router, provides multiple providers, and connects to our DB via the Prisma adapter.

i18n

next-intl

The premier i18n library for the Next.js App Router, handling internationalized routing, locale detection, and message formatting.

State (Client)

Zustand

For minimal, lightweight global client state (e.g., managing the active quiz state) without boilerplate. React Context will be used for simpler state.

Hosting

Vercel

The platform built for Next.js. Provides seamless CI/CD, global CDN, and serverless functions for our API routes.

Testing

Jest & React Testing Library (Unit/Integration), Playwright (E2E)

A comprehensive testing suite to ensure component logic and user flows are correct.

4. Architecture & Data Models

4.1 Folder Structure (App Router)

/
├── app/
│   ├── [locale]/                # (Handles i18n routing via next-intl)
│   │   ├── (marketing)/         # (Route group for public pages)
│   │   │   ├── about/page.tsx
│   │   │   └── faq/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/         # (Route group for protected pages)
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── quiz/page.tsx
│   │   │   ├── quiz/[category]/page.tsx
│   │   │   ├── results/[attemptId]/page.tsx
│   │   │   └── layout.tsx         # (Will contain auth check logic)
│   │   ├── admin/                 # (Protected for 'ADMIN' role)
│   │   │   ├── questions/page.tsx
│   │   │   └── layout.tsx
│   │   └── page.tsx               # (The homepage)
│   │   └── layout.tsx             # (Root layout, contains <html> and <body>)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # (NextAuth.js handler)
│   │   └── quiz/submit/route.ts       # (Quiz submission API)
├── components/
│   ├── ui/                      # (shadcn/ui components: Button, Card, etc.)
│   ├── auth/                    # (LoginButton, UserProfileIcon, etc.)
│   ├── quiz/                    # (QuizCard.tsx, ResultsChart.tsx, etc.)
│   └── layout/                  # (Navbar.tsx, Footer.tsx, LanguageSwitcher.tsx)
├── lib/
│   ├── auth.ts                  # (NextAuth.js config)
│   ├── db.ts                    # (Prisma client instance)
│   ├── i18n.ts                  # (next-intl config)
├── messages/
│   ├── en.json                  # (English translations)
│   ├── es.json                  # (Spanish translations)
│   ├── zh.json                  # (Chinese translations)
├── prisma/
│   └── schema.prisma            # (Database models)
└── middleware.ts                # (Handles auth and i18n routing)


4.2 Data Models (Prisma Schema)

// This is a simplified schema.prisma file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String         @id @default(cuid())
  name              String?
  email             String?        @unique
  emailVerified     DateTime?
  image             String?
  languagePreference String         @default("en")
  role              UserRole       @default(USER)
  accounts          Account[]
  sessions          Session[]
  quizAttempts      QuizAttempt[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

enum UserRole {
  USER
  ADMIN
}

// --- App-Specific Models ---

model Question {
  id          String        @id @default(cuid())
  // The "master" text, usually in English
  masterText  String
  category    String        // e.g., "Civics", "History", "Government"
  // The correct answer, stored as an index or specific string
  correctAnswer String
  // The options, stored as a JSON array of strings
  options     Json

  translations QuestionTranslation[]
  userAnswers  UserAnswer[]
}

model QuestionTranslation {
  id                String   @id @default(cuid())
  languageCode      String   // "es", "zh", etc.
  translatedText    String
  // Translated options, same structure as parent
  translatedOptions Json

  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  questionId String

  @@unique([questionId, languageCode])
}

model QuizAttempt {
  id          String       @id @default(cuid())
  score       Int
  completedAt DateTime     @default(now())
  
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  userAnswers UserAnswer[]
}

model UserAnswer {
  id            String   @id @default(cuid())
  selectedAnswer String
  isCorrect     Boolean

  quizAttempt   QuizAttempt @relation(fields: [quizAttemptId], references: [id], onDelete: Cascade)
  quizAttemptId String
  question      Question    @relation(fields: [questionId], references: [id], onDelete: Cascade)
  questionId    String
}


5. Project Milestones (Phase-Based Plan)

This plan outlines the logical order of development, focusing on feature-complete milestones rather than strict time blocks.

Phase 1: Foundation & Project Setup

Goal: Set up the project, development environment, and all core service integrations.

Tasks:

Initialize Next.js project (npx create-next-app) with TypeScript, Tailwind, ESLint.

Initialize Git repository and push to GitHub.

Set up Vercel project and link to repo for CI/CD.

Set up Neon PostgreSQL database (production & development branches).

Install and configure Prisma; define schema.prisma with all models.

Connect to Neon: Add DATABASE_URL to .env file.

Install and configure NextAuth.js (v5) with Prisma adapter and provider (e.g., Google).

Install and configure next-intl with [locale] routing and messages files (en, es, zh).

Install shadcn/ui and set up the global theme.

Deliverable: A deployable application skeleton. Users can see the homepage (with language switching) but cannot log in. The database connection is established, but no tables exist yet.

Phase 2: Core UI & Authentication Flow

Goal: Build the complete user authentication flow and all static/dashboard page shells.

Tasks:

Run npx prisma migrate dev to create all tables in the database.

Build custom Login and Sign Up pages.

Implement middleware.ts to handle auth (protected routes) and i18n.

Create the (dashboard) route group and protect it.

Build the main Navbar (with Language Switcher and dynamic Login/Profile button).

Build the Footer component.

Build the static marketing/content pages: Landing Page (/), About, FAQ.

Build the (empty) User Dashboard page shell (/dashboard).

Deliverable: Users can sign up, log in, and log out. Protected routes (like /dashboard) are inaccessible to logged-out users. The site structure is fully navigable.

Phase 3: The Quiz Engine (Core Feature)

Goal: Implement the core value proposition: taking a quiz.

Tasks:

Write a script (or manually) to bulk-import all official questions and translations into the Neon database.

Build the Quiz selection page (/quiz) for users to pick a category or full test.

Build the main Quiz component (QuizCard.tsx):

Fetch questions (Server Component).

Manage state (current question, answers) as a Client Component (using Zustand or useReducer).

Create the /api/quiz/submit Route Handler to:

Receive answers.

Calculate the score.

Save QuizAttempt and UserAnswer records to the database.

Build the dynamic Results page (/results/[attemptId]) to display the score and review correct/incorrect answers.

Deliverable: A logged-in user can start, complete, and submit a full quiz, and see their score on a results page. This is the Minimum Viable Product (MVP).

Phase 4: User Value (Dashboard) & Admin Panel

Goal: Visualize user progress to encourage retention and allow admins to manage content.

Tasks:

Build the User Dashboard UI:

Fetch the user's QuizAttempt history.

Implement recharts to create a line graph for "Score Over Time."

Add a "Performance by Category" component.

Implement Role-Based Access Control (RBAC) (e.g., check for UserRole.ADMIN in middleware.ts and on Server Actions).

Build the Admin UI (/admin/questions) for CRUD (Create, Read, Update, Delete) operations on Question and QuestionTranslation models (using Next.js Server Actions).

Perform thorough UI/UX polishing and ensure full mobile responsiveness across all pages.

Deliverable: Users can see their progress, providing a reason to return. An Admin can add/edit questions without needing a new code deploy.

Phase 5: Testing, Polish & Launch

Goal: Ensure quality and deploy the application for public use.

Tasks:

Write Jest/RTL unit tests for critical logic (e.g., score calculation).

Write Playwright (E2E) tests for the main user flows (e.g., Sign Up -> Take Quiz -> View Dashboard).

Final code review and refactoring.

Set up all production environment variables (including NEXTAUTH_SECRET) in Vercel.

Run the final production migration: npx prisma migrate deploy.

Deploy the main branch to the production domain on Vercel.

Monitor for initial bugs and user feedback.

Deliverable: A stable, tested, and publicly accessible v1.0 of the Naturalization Practice Hub.

6. Risks & Mitigation

Risk

Mitigation

Inaccurate Translations

Mitigation: Initially, use professionally sourced translations. Add a "Report an error" button to each question, allowing users to submit corrections, which admins can review.

Complex i18n Configuration

Mitigation: The next-intl library for App Router has specific setup requirements. We will follow the documentation precisely and build a small i18n routing proof-of-concept in Phase 1.

Client vs. Server Component Confusion

Mitigation: Establish clear team guidelines: "Use Server Components by default. Only use Client Components ('use client') for interactivity (e.g., buttons, state management)." All data fetching should be done in Server Components where possible.

Data Entry Bottleneck

Mitigation: Do not plan to enter 100+ questions and translations by hand. A one-off bulk import script (JS/TS) will be written in Phase 3 to populate the database from a CSV or JSON file.

Schema Evolution

Mitigation: All database changes, even minor ones, MUST go through a prisma migrate workflow. No manual changes to the production database will be allowed.

7. Next Steps

Finalize MVP: Confirm the three launch languages and source the complete official question set.

Acquire Data: Obtain the verified translations for all 100+ questions and UI text in the 3 launch languages. This is a critical prerequisite for Phase 3.

Design: Create high-fidelity wireframes in Figma for the Landing Page, Quiz Interface, and User Dashboard.

Begin Phase 1: Start the project setup as outlined. (You have already started this by creating the Neon DB).