# 🛰️ Project Overview: Halo

## Project Summary

**Halo** is a lightweight, futuristic Chrome Extension that acts as a user's *ambient second brain*. It provides a persistent, minimal sidebar across all websites, allowing users to quickly capture notes, tasks, and reminders without losing browsing context. Halo is designed to enhance focus, creativity, and retention by keeping thoughts easily accessible at all times.

## Key Goals

- Deliver an always-available, non-intrusive **sidebar** UI.
- Allow users to **capture notes and tasks instantly**, optionally tied to their current URL.
- Focus on **local-first storage** for privacy and speed (no required signups initially).
- Build with a clean, elegant, accessible frontend (WCAG-compliant).
- Ship a **functional MVP within 1–2 weeks**.

## Target User

- Knowledge workers, creators, developers, researchers, and power internet users.
- Users who juggle many tabs, ideas, and projects.
- Users who want a *private, fast, seamless* thought capture tool — not a heavy productivity app.

## Tech Stack

| Layer         | Tech                                 |
|:--------------|:-------------------------------------|
| Frontend      | Next.js (for extension popup + sidebar UI) |
| Extension     | Chrome Manifest V3                   |
| State Mgmt    | Local Storage API (chrome.storage.local) |
| Styling       | TailwindCSS + Shadcn UI Components    |
| Authentication (future) | Optional OAuth for syncing notes |
| Deployment    | Packaged as Chrome Extension         |

## MVP Feature List

- [x] Floating sidebar available on all pages (positionable left/right).
- [x] Add note instantly from sidebar.
- [x] Add simple task from sidebar (with checkbox toggle).
- [x] Link notes/tasks to current URL optionally.
- [x] View existing notes/tasks related to the page/domain.
- [x] Store all data locally (chrome.storage.local or IndexedDB).
- [x] Simple onboarding screen on first install.
- [x] Keyboard shortcut to open/close sidebar (e.g., `Alt + Space`).

## Stretch Goals (Post-MVP)

- [ ] AI-assisted note suggestions based on page content.
- [ ] Reminder notifications for unfinished tasks.
- [ ] Customizable themes (sidebar width, colors).
- [ ] Account signup for cross-device sync.
- [ ] Collaboration: share notes/tasks with others.

## Design Principles

- **Minimalism:** Sidebar should be compact, elegant, and feel "part of the web."
- **Speed:** Adding a note or task should feel instant.
- **Ambient Presence:** Halo should "float" gently with the user.
- **Privacy:** All data is private by default and stored locally.
- **Accessibility:** Full WCAG 2.1 AA compliance.
