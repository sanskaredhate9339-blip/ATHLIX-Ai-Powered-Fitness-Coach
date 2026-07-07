# 🏋️ Athlix – AI Fitness Coach

Athlix is an AI-powered fitness coaching Progressive Web App (PWA) that helps users build healthier habits through personalized workout plans, AI food recognition, exercise form analysis, nutrition tracking, and progress analytics—all in one modern platform.

Designed for beginners and experienced athletes alike, Athlix combines artificial intelligence with an intuitive user experience to provide a complete digital fitness companion.

---

## ✨ Features

### 🤖 AI Workout Planner
- Generates personalized workout plans based on fitness goals, experience, available equipment, and workout schedule.
- Supports Push/Pull/Legs, Bro Split, Upper/Lower, and Full Body programs.
- Includes exercises, sets, reps, rest periods, and exercise tips.

### 🍽️ AI Food Recognition
- Upload a meal photo using the camera or gallery.
- AI detects the food and estimates:
  - Calories
  - Protein
  - Carbohydrates
  - Fat
  - Healthy Score
- Automatically saves meals to the nutrition log.

### 💬 AI Fitness Coach
- ChatGPT-style AI assistant.
- Answers fitness, nutrition, recovery, and workout questions.
- Provides personalized recommendations based on the user's profile.

### 📷 Exercise Form Analysis
- Real-time pose detection using the device camera.
- Supports exercises such as Squats, Push-ups, Lunges, Deadlifts, and more.
- Detects posture mistakes and provides corrective feedback.

### 📚 Exercise Library
- Browse exercises by muscle group.
- Search and filter exercises.
- Includes instructions, difficulty, equipment, benefits, and video demonstrations.

### 📊 Progress Tracking
- Track:
  - Weight
  - BMI
  - Calories
  - Macronutrients
  - Workout Completion
  - Habit Streaks
- Interactive charts and weekly/monthly analytics.

### ✅ Habit Tracker
- Track daily habits such as:
  - Workout
  - Water Intake
  - Protein Goal
  - Sleep
  - Meditation
  - Walking
- Maintain streaks and monitor consistency.

### 📱 Progressive Web App
- Install directly from the browser.
- Offline support.
- Push notifications.
- Fast and responsive across desktop, tablet, and mobile devices.

---

# 🛠 Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | User Interface |
| TypeScript | Type-safe development |
| Vite | Fast build tool |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible UI components |
| Framer Motion | Smooth animations |
| React Hook Form | Form handling |
| Zod | Form validation |
| Recharts | Analytics & charts |
| React Webcam | Camera access |
| React Dropzone | Image upload |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Supabase Storage | Image & avatar storage |
| Supabase Realtime | Live updates |

---

## AI & Machine Learning

| Technology | Purpose |
|------------|---------|
| OpenAI GPT-4o | Workout planning & AI coach |
| OpenAI Vision | Food image recognition |
| MediaPipe Pose | Real-time pose detection |
| TensorFlow.js MoveNet | Exercise tracking fallback |
| Web Speech API | Voice feedback |

---

## Deployment

| Technology | Purpose |
|------------|---------|
| Vercel | Application Hosting |
| Vite PWA | Progressive Web App |
| Workbox | Offline caching & service worker |

---

# 📁 Project Structure

```text
src/
│
├── components/
├── features/
├── pages/
├── layouts/
├── hooks/
├── contexts/
├── providers/
├── services/
├── api/
├── lib/
├── utils/
├── store/
├── types/
├── assets/
└── styles/
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/your-username/athlix.git
cd athlix
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env` file.

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

## Start the development server

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

---

# 📌 Core Modules

- Authentication & User Onboarding
- Dashboard
- AI Workout Generator
- Nutrition Tracker
- AI Food Scanner
- Exercise Library
- AI Fitness Chat
- Exercise Form Analysis
- Habit Tracker
- Weight Tracker
- Progress Analytics
- Notifications
- User Profile & Settings

---

# 🎯 Future Enhancements

- Apple Health Integration
- Google Fit Integration
- Smartwatch Support
- Barcode Food Scanner
- QR Meal Scanner
- Social Challenges
- Achievement System
- Workout Sharing
- AI Voice Coach
- PDF Progress Reports

---

# 👨‍💻 Developed By

**Sanskar**

Athlix is a modern AI-powered fitness platform built to provide users with intelligent coaching, accurate nutrition tracking, and data-driven fitness insights through a clean, responsive Progressive Web App.

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
