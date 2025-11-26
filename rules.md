# Project Rules: badalien.works

## 1.0 Architecture & Philosophy

- **1.1 Project Structure:** This is a monorepo managed by **Turborepo** and **pnpm**.
    
- **1.2 Framework:** All web applications (`main`, `consult`, `creative`) will be built using **Next.js**.
    
- **1.3 Rendering Strategy:** Default to **Static Site Generation (SSG)** for all pages for maximum performance and SEO. Use Server-Side Rendering (SSR) or Client-Side Rendering (CSR) only when a page has truly dynamic, user-specific data.
    
- **1.4 API Routes:** API functionality (like the contact form backend) will be implemented using **Next.js API Routes**.
    

## 2.0 Technology Stack

- **2.1 Language:** **JavaScript**. Use modern ES6+ syntax.
    
- **2.2 UI Library:** **React** (via Next.js).
    
- **2.3 Styling:** **Tailwind CSS**. All styling must be done using utility classes. Do not write custom CSS files. Encapsulate complex or reused class combinations into shared UI components.
    
- **2.4 Deployment:** All applications will be deployed to **Vercel**.
    

## 3.0 Code & Component Standards

- **3.1 Component Structure:** All React components must be functional components using React Hooks.
    
- **3.2 File Naming:** Use `PascalCase` for component files (e.g., `NavigationBar.jsx`).
    
- **3.3 Component Granularity:** Components should be small and focused on a single responsibility.
    
- **3.4 Shared Components:** Any component used in more than one application (e.g., `NavigationBar`, `Footer`, `Button`) **MUST** be placed in the `packages/ui` directory and imported into the applications.
    
- **3.5 State Management:** For simple component-level state, use the `useState` and `useReducer` hooks. For complex global state shared across an application, use `React Context`. Do not introduce a heavy state management library like Redux unless absolutely necessary.
    
- **3.6 Brand Assets:**
    
    - The primary logo (`bad-alien-logo-trans.png`) should be a reusable `Image` component from Next.js for optimization.
        
    - Colors and fonts must be configured in `tailwind.config.js` and referenced by their theme names (e.g., `bg-primary`, `text-accent`) not by hardcoded values (e.g., `bg-[#1A202C]`).
        

## 4.0 Tooling & Quality

- **4.1 Linting:** All code must pass **ESLint** rules before being committed.
    
- **4.2 Formatting:** All code will be automatically formatted by **Prettier** on save.
    
- **4.3 Git Commits:** Use conventional commit messages (e.g., `feat: add contact form`, `fix: navbar responsive bug`, `docs: update roadmap`). If I provide text to comment, you must take whatever I provide and use that, nothing else.
    

## 5.0 AI Collaboration Protocol

- **5.1 One Step at a Time:** The project must follow the `roadmap.md` tasks sequentially. Announce the task number and objective before you begin. **Do not move to the next task without explicit user approval.**
    
- **5.2 Explain the "Why":** Before generating code for a task, provide a brief, clear rationale. Explain what the code will do and why it's a necessary step in the context of the project.
    
- **5.3 Present Options:** For any significant architectural or implementation decision that is not already specified in these rules, you must present at least two viable alternatives. Briefly explain the pros and cons of each and recommend one. Await user selection before proceeding.
    
- **5.4 Constant Check-in:** After providing a code block or explanation, you must pause and ask for feedback or approval (e.g., "How does this look?", "Are you ready to move to the next step?"). This ensures a tight feedback loop.