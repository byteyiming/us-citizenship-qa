# Naturalization Practice Hub

[![Next.js](https://img.shields.io/badge/Next.js-16-blue?logo=nextdotjs&style=for-the-badge)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-blue?logo=react&style=for-the-badge)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com/)

A free, open-source, and multi-lingual web app to help aspiring U.S. citizens practice for the civics portion of the naturalization test using interactive quizzes and flashcards.

**[➡️ Visit the Live Demo](https://us-citizenship-qa.vercel.app/en)**

## 💡 Project Origin: Solving a Real Problem


This project wasn't just an academic exercise; it was built to solve a real-world problem for a friend.

While preparing for the U.S. naturalization exam, my friend, who is not a native English speaker, struggled to find good study resources. The tools available were often expensive, poorly designed, or lacked high-quality translations in his native language.

Recognizing this gap, I decided to build the **Naturalization Practice Hub**. The mission was to create a 100% free, accessible, and user-friendly platform that provides all the official civics questions in multiple languages (currently **English**, **Spanish**, and **Chinese**) to help people like my friend study with confidence.

## ✨ Core Features

* **🌐 Full Internationalization (i18n):** Built from the ground up with i18n support using `next-intl`. The entire UI and all question data are available in English, Spanish, and Chinese, with internationalized routing (e.g., `/en/quiz`, `/es/quiz`, `/zh/quiz`).
* **🧠 Dual Study Modes:**
    * **Quiz Mode:** Features two formats: a "Practice Mode" (10 random questions from a chosen category with instant feedback) and an "Official Test Mode" that simulates the real USCIS test (20 balanced questions, 12+ required to pass).
    * **Flashcard Mode:** A clean, interactive interface to review all questions one by one. Users can click to flip the card and see the answer.
* **💡 Shared User State:** Uses **Zustand** for lightweight, client-side state management. Your "Starred" questions and "Last Missed" questions from a quiz are automatically available in the Flashcard viewer, allowing for targeted review.
* **💾 Smart Persistence:** User answers-in-progress and starred/missed questions are saved to `localStorage`, so your progress is never lost on a page refresh.
* **📱 Mobile-First & Accessible:** Fully responsive design built with **Tailwind CSS**, ensuring a great experience on any device.
* **✅ Data Integrity:** Includes a Node.js script to validate and minify all question JSON files, ensuring data consistency and smaller bundle sizes.
* **🤖 SEO Ready:** Automatically generates a `sitemap.xml` and `robots.txt` for better search engine visibility.

## 🛠️ Tech Stack

This project is built with a hyper-modern stack, focusing on performance, type safety, and an excellent developer experience.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [**Next.js 16**](https://nextjs.org/) | (App Router) For Server-Side Rendering (SSR) & Static Site Generation (SSG). |
| **Language** | [**TypeScript 5**](https://www.typescriptlang.org/) | Provides end-to-end type safety. |
| **UI Library** | [**React 19**](https://react.dev/) | Utilizes Server Components (for data fetching) and Client Components (for interactivity). |
| **Styling** | [**Tailwind CSS 4**](https://tailwindcss.com/) | A utility-first CSS framework for rapid, responsive UI development. |
| **i18n** | [**`next-intl`**](https://next-intl.dev/) | The standard for i18n in the Next.js App Router. |
| **State (Client)** | [**Zustand**](https://zustand.surge.sh/) | For minimal, fast, and scalable global client-side state management. |
| **Data** | **Static JSON** | Questions are stored in static JSON files, dynamically loaded by locale. |
| **Linting** | **ESLint** | Configured with `eslint-config-next` for Next.js-specific rules. |

## 🚀 Running Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **(Optional) Validate Data:**
    You can run the data-check script to ensure all question JSONs are valid:
    ```bash
    npm run data:check
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

## 📈 Future Roadmap (from `project.plan.md`)

This v1.0 release establishes the core MVP. The original project plan includes several exciting features for future development:

* [ ] **User Authentication:** Add `NextAuth.js` to allow users to sign up and save their progress.
* [ ] **Database Integration:** Migrate from static JSON files to a PostgreSQL database (e.g., Neon) using `Prisma` as the ORM.
* [ ] **User Dashboard:** Build a protected `/dashboard` route where users can track their quiz history, view score charts, and see their performance by category.
* [ ] **Admin Panel:** Create a secure admin interface for adding, editing, and verifying questions and translations without needing to deploy new code.
