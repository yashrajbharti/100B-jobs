# 100B Jobs

**Author:** Yash Raj

## Overview

100B Jobs is a full-stack hiring platform built from scratch to help founders evaluate and hire top candidates from a large pool of applicants. The project was developed as part of the Mercor "100B Jobs" assignment challenge.

This app is designed to simulate a real-world hiring decision system after a $100M seed round, where the goal is to filter, evaluate, and select the top 5 candidates using both custom logic and AI-driven scoring (currently under development).

![Low fi](./design/Low%20Fidelity.png)

## Stack

- **Frontend:** HTML, CSS5, and JavaScript using Web Components
- **Backend:** Node.js with Express
- **Persistence:** Local JSON file for structured data storage (can scale to SQL)
- **AI Scoring:** Planned integration with llama3

## Features

### Frontend

- Fully modular architecture using Web Components
- Search and filter functionality with query string syncing
- Pagination using limit and offset (default: 50)
- Dynamic SEO titles based on page state
- Material UI Web Components for consistent look and feel
- Skeleton loading and empty search states for enhanced UX
- Individual candidate profile pages (via `?id=...` query param)
- CSS5 dynamics - view transitions, OS based themes - @media prefers rulesets

### Backend API

- `POST /upload` - Uploads and evaluates candidates, adds `score`, `top`, and `index`
- `GET /candidates` - Paginated list of candidates (name, email, skills)
- `GET /candidates/:id` - Full candidate JSON by `index`
- `GET /candidates/top` - Ranked list of candidates by score (name, email, skills, top, score)
- `GET /candidates/search?q=` - Search by name, email, or skill (paginated)

All list endpoints accept optional `limit` and `offset` query parameters.

### Scoring Logic

- **Skills Score (0-7):** Simulated (will be AI-driven)
- **Experience Score (0-3):** Based on number of work experiences
- **Final Score:** Combined, max 10
- Top 5 candidates are tagged with a `top` key (`#1` to `#5`)

## How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

This runs the Express server at `http://localhost:3001`

### Frontend Logic

No build system is required. Open `index.html` directly in the browser or use "Go Live" from a code editor.

### Uploading Data

Navigate to `http://localhost:3001` to access the `/upload` page:

- Upload your JSON file of candidates
- Add a job description
- Click "Upload and Evaluate"
- The backend processes each candidate and stores the results

## Notes

- Candidate evaluations are handled server-side to reduce frontend load
- Data is stored in `candidates.json` and served via API endpoints
- Easily extendable to use SQL for large datasets or production use
- Designed with accessibility and performance best practices

## Future Enhancements

- Integrate Ollama locally for real AI-based JD-candidate scoring
- Add more filters (e.g., location, degree, salary)
- Expand scoring logic to include university tier, GPA, etc.
- Auth + role-based views for hiring teams
- Candidate shortlisting pipeline

## Credits

Built and designed by Yash Raj as part of the Mercor "100B Jobs" challenge.
