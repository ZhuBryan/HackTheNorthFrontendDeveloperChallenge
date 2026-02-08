# Hack the North Events Hub 2026

This event dashboard application allows hackers to discover workshops, activities, and tech talks while maintaining secure access control for private hacker-only sessions.

🔗 **Live Demo**: https://hack-the-north-frontend-developer-c.vercel.app/
🔗 **Writeup**: Included in this README (down below)

## Accomplishments

### Core Requirements (100% Implemented)
- **Dynamic Event Feed**: Fetches events in real-time from the HTN API.
- **Chronological Sorting**: Automatically orders events by `start_time`.
- **Secure Access Control**: Protects `private` events behind a hardcoded authentication layer.
- **Related Events Navigation**: Smoothly link and navigate between dependent events with visual highlighting.

### Bonus Features
- **Real-time Search**: Instant filtering by event name, description, or speaker names.
- **Type Filtering**: Category-specific views (Workshop, Activity, Tech Talk).
- **Skeleton Loading**: High-fidelity shimmer effects for zero-layout-shift loading.
- **Unique Aesthetic**: A custom "Cave" themed UI with bioluminescent accents and poly-geometric design.
- **Accessibility**: Full ARIA support, semantic HTML, and keyboard navigation.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/ZhuBryan/HackTheNorthFrontendDeveloperChallenge.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Credentials
- **Username**: `hacker`
- **Password**: `htn2026`

---

# 📝 Challenge Writeup (Part 2)

## 1. Development Process

### Planning Phase
I identified the core tasks early on: API integration, authentication state, and the event dashboard UI. I chose **Vite + React + TypeScript** for speed, type safety, and the industry standard development experience. I opted for cutsom CSS with CSS Variables to achieve a unique, high-fidelity visual identity without the "standardized" look of component libraries.

### Implementation Strategy
I centralized logic in `api.ts` with error handling and type-safe fetches. To manage State, I used a combination of `useState`, `useEffect`, and `useMemo` to handle data lifecycle and complex filtering without performance hits. In order to match what Hack the North's website currently looks like, I implemented a cavern like theme using `clip-path` polygons and CSS gradients, ensuring every interactive element (buttons, cards) maintained the jagged, adventurous aesthetic. 

### Challenges Encountered
Jumping between events can be jarring. I solved this by implementing a `scrollIntoView` system with a temporal "Pulse Highlight" that guides the user's eye to the target card.I I handled cases where the `permission` field might be missing by defaulting to `public`, ensuring no session is accidentally hidden from the general public.

### Code Highlights
- **Reactive Search Engine**: A multi-field search filter that combines results from event names, descriptions, and nested speaker arrays.
- **Bioluminescent Design System**: A custom color palette defined in `index.css` using HSL/Hex variables for consistency across the app. (Personally I like how it looks)

---

## 2. Future Product Vision

If this were to scale to thousands of hackers:

### Step 1: Infrastructure & Scale
- **Server Side Rendering (SSR)**: Migrate to Next.js for better SEO and performance.
- **Global CDNs**: Serve assets from the edge to reduce latency for international hackers.
- **Real Auth**: Migrate from hardcoded credentials to a robust Auth0 or NextAuth setup with JWTs.

### Phase 2: Engagement Features
- **My Schedule**: Allow hackers to "star" events and build a personal itinerary.
- **Live Notifications**: WebSocket integration for "Starting Soon" alerts.
- **Calendar Sync**: One-click `.ics` exports for Google/Apple calendars.

### Phase 3: Analytics & Ops
- **Heatmaps**: Track which event categories are most popular to optimize future schedules.
- **Load Balancing**: Ensure the API can handle the "1 minute before start" traffic spike.

---

## 3. Final Reflections

I took this project as an exercise in balancing **technical requirement** with **high-fidelity design**. By focusing on a unique visual theme while maintaining strict adherence to the functional requirements (sorting, permissions, related events), I've tried to make an event list a good experience for the hackers.

I really like the handcrafted, artsy vibe of HTN's website right now, especially the interactivity of so many elements and small easter eggs throughout. I'd love for the chance to contribute to this years Hack the North website, thanks for taking the time to look this over!

---

**Contact**: bryan.zhu89@gmail.com
**Submission Date**: February 8, 2026
