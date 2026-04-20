# SkillBridge — Developer Skill Gap Analyzer

A developer-facing skill tracking and JD gap analysis tool. Track your skills, paste job descriptions, and instantly see what you're missing.

---

## Problem Statement

Junior developers struggle to understand **which skills to prioritize** when preparing for job applications. They either learn randomly or blindly follow roadmaps. SkillBridge solves this by letting you track your skills and run your actual target job descriptions against your profile to surface real gaps.

**Who is the user?** Final-year CS students and junior developers preparing for placements.  
**What problem does it solve?** Bridges the gap between "what you know" and "what companies want."  
**Why does it matter?** Most rejections are due to missing a handful of specific skills, not overall lack of knowledge.

---

## Features

- **Auth** — Email/password login and signup via Firebase
- **Skill Registry** — Add, edit, delete skills with proficiency levels (CRUD)
- **JD Analyzer** — Paste any job description, get an instant gap report
- **Analytics** — Breakdown by category, top and weak skills
- **Portfolio** — Public-facing profile with your top skills
- **Tasks** — Auto-generated learning tasks from your gaps
- **Activity Heatmap** — GitHub-style streak tracker

---

## Tech Stack

- React 18 (functional components, hooks, lazy loading, context)
- React Router v6
- Firebase (Auth + Firestore)
- JetBrains Mono / Inter fonts

---

## Setup

### 1. Clone and install

```bash
cd skillbridge
npm install
```

### 2. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Go to **Project Settings → Your apps → Web app**
4. Copy the config object

### 3. Add your Firebase config

Open `src/services/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

### 4. Enable Firebase services

In Firebase Console:
- **Authentication → Sign-in method → Email/Password → Enable**
- **Firestore Database → Create database → Start in test mode**

### 5. Run the app

```bash
npm start
```

App opens at `http://localhost:3000`

---

## Folder Structure

```
src/
  components/   # Reusable UI components
  context/      # AuthContext, SkillsContext (global state)
  hooks/        # useLocalStorage, useDebounce
  pages/        # Dashboard, Skills, Analyze, Analytics, Portfolio, Tasks
  services/     # firebase.js, userService.js (all Firestore calls)
  styles.css    # Global variables and animations
```

---

## Deployment

```bash
npm run build
# Deploy /build folder to Vercel or Netlify
```
