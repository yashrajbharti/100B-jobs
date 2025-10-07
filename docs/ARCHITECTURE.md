# Architecture Documentation

This document describes the technical architecture of the 100B Jobs platform.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Performance Considerations](#performance-considerations)

## Overview

100B Jobs is a full-stack hiring platform built with a modular, component-based architecture. The application uses vanilla JavaScript with Web Components on the frontend and Node.js/Express on the backend.

### Key Architectural Principles

1. **Component-Based**: Modular Web Components for reusability
2. **Separation of Concerns**: Clear separation between UI, business logic, and data
3. **Progressive Enhancement**: Works without JavaScript, enhanced with JS
4. **Performance First**: Minimal dependencies, optimized loading
5. **Accessibility**: WCAG 2.1 compliant, semantic HTML

## Technology Stack

### Frontend

- **HTML5**: Semantic markup
- **CSS5**: Modern CSS with custom properties, view transitions
- **JavaScript ES6+**: Native modules, no build step
- **Web Components**: Custom elements with Shadow DOM
- **Material Web Components**: Google's Material Design implementation

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **CORS**: Cross-origin resource sharing
- **Body Parser**: Request body parsing middleware

### Development

- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server with hot reload

## Project Structure

```
100B-jobs/
├── api/                    # API utility functions
│   ├── getCandidateById.mjs
│   └── getCandidates.mjs
├── backend/               # Backend server
│   ├── server.js         # Express server
│   ├── package.json      # Backend dependencies
│   ├── candidates.json   # Data persistence
│   └── public/          # Static files for upload page
├── components/           # Web Components
│   ├── candidate-card.mjs
│   ├── search-bar.mjs
│   ├── pagination-component.mjs
│   ├── skills-component.mjs
│   ├── timeline-component.mjs
│   ├── advanced-timeline-component.mjs
│   ├── candidate-details.mjs
│   └── user-profile.mjs
├── module/              # Application modules
│   ├── loadData.mjs
│   ├── loadCard.mjs
│   ├── loadPagination.mjs
│   ├── loadSkills.mjs
│   ├── loadTimeline.mjs
│   ├── loadAdvancedTimeline.mjs
│   ├── loadCandidateDetails.mjs
│   ├── loadDetailedProfile.mjs
│   └── loadUserProfile.mjs
├── utils/               # Utility functions
│   ├── search.mjs
│   ├── filter.mjs
│   ├── paginate.mjs
│   ├── history.mjs
│   ├── count.mjs
│   ├── dateFormat.mjs
│   └── colorMap.mjs
├── styles/             # Global styles
│   ├── style.css
│   ├── material.css
│   ├── candidate.css
│   ├── vt-index.css
│   └── vt-app.css
├── data/              # Sample data
│   ├── data.json
│   └── sample.json
├── docs/              # Documentation
├── fonts/             # Local fonts
├── index.html         # Main listing page
└── candidate.html     # Candidate detail page
```

## Frontend Architecture

### Web Components

The frontend uses native Web Components for encapsulation and reusability.

#### Component Lifecycle

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    // Initialize state
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Component mounted to DOM
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    // Component removed from DOM
    this.cleanup();
  }

  render() {
    // Update component UI
  }
}
```

#### Key Components

**CandidateCard**: Displays candidate summary

- Attributes: name, email, skills, link, data-top
- Shadow DOM for style encapsulation
- Material Design chips for skills

**SearchBar**: Search input with debouncing

- Custom "search" event emission
- 1200ms debounce for API efficiency
- Shadow DOM styling

**PaginationComponent**: Handles pagination

- Emits "page-change" events
- Calculates page ranges
- Responsive design

**SkillsComponent**: Displays skills with colors

- Maps skills to brand colors
- Material chips with custom styling
- Handles overflow gracefully

**TimelineComponent**: Work experience timeline

- Chronological display
- Date formatting
- Company/role highlighting

### Modules

Modules contain business logic and orchestrate component interactions.

**loadData.mjs**: Core data loading logic

- Fetches candidates from API
- Handles search/filter/pagination
- Updates URL query parameters
- Manages loading states

**loadCard.mjs**: Candidate card rendering

- Iterates candidate data
- Creates card components
- Handles empty states

**loadPagination.mjs**: Pagination setup

- Calculates total pages
- Updates pagination component
- Syncs with URL state

### State Management

#### URL-Based State

Application state is stored in URL query parameters:

- `search`: Search query
- `filter`: Active filters
- `limit`: Results per page
- `offset`: Pagination offset
- `id`: Selected candidate (detail page)

Benefits:

- Shareable URLs
- Browser back/forward support
- No complex state library needed

```javascript
// utils/history.mjs
export const addQueryToPage = (key, value) => {
  const params = new URLSearchParams(window.location.search);
  params.set(key, value);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
};
```

#### Local State

Components maintain internal state when needed:

- Form inputs
- UI toggles
- Loading indicators

### Styling Strategy

#### Material Design Theme

Uses Material Design Web Components with custom theming:

```css
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-background: #1a1c1e;
  /* ... */
}
```

#### Dark Mode Support

Automatic theme switching using `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-background: #1a1c1e;
    --md-sys-color-on-background: #e3e2e6;
  }
}
```

#### View Transitions

CSS View Transitions for smooth page transitions:

```css
@view-transition {
  navigation: auto;
}
```

## Backend Architecture

### Express Server

Simple Express server with RESTful API design.

```
server.js
├── Middleware
│   ├── CORS
│   ├── Body Parser
│   └── Static Files
├── Routes
│   ├── POST /upload
│   ├── GET /candidates
│   ├── GET /candidates/:id
│   ├── PATCH /upload/top5
│   └── DELETE /candidates
└── Data Layer
    └── File-based JSON storage
```

### Data Persistence

Currently uses JSON file storage (`candidates.json`):

```javascript
const loadCandidates = () => {
  const filePath = path.join(__dirname, 'candidates.json');
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};
```

**Migration Path**: Easy migration to SQL/NoSQL database:

- Replace file operations with database queries
- Keep API interface unchanged
- Add connection pooling
- Implement proper transactions

### API Design

RESTful endpoints with consistent response format:

```json
{
  "length": 100,
  "data": [/* array of items */]
}
```

Error responses:

```json
{
  "message": "Error description"
}
```

## Data Flow

### Listing Page Flow

```
User Action
    ↓
Event Handler (utils/)
    ↓
Update URL State (history.mjs)
    ↓
Load Data (module/loadData.mjs)
    ↓
Fetch API (api/getCandidates.mjs)
    ↓
Backend API
    ↓
Database/File
    ↓
Response to Frontend
    ↓
Render Components
    ↓
Update UI
```

### Search Flow

```
User Types → Debounce (1200ms) → Add to URL → Load Data → API Call → Update Results
```

### Detail Page Flow

```
User Clicks Card → Navigate to candidate.html?id=X → Load Candidate → API Call → Render Details
```

## Design Patterns

### Module Pattern

Each module exposes a single default function:

```javascript
// module/loadData.mjs
export const loadData = async () => {
  // Implementation
};
```

### Observer Pattern

Components emit custom events for decoupling:

```javascript
// Component emits event
this.dispatchEvent(new CustomEvent('search', {
  detail: input.value,
  bubbles: true,
  composed: true,
}));

// Parent listens for event
searchBar.addEventListener('search', (e) => {
  handleSearch(e.detail);
});
```

### Factory Pattern

Component creation:

```javascript
const createCandidateCard = (candidate) => {
  const card = document.createElement('candidate-card');
  card.setAttribute('name', candidate.name);
  card.setAttribute('email', candidate.email);
  return card;
};
```

## Performance Considerations

### Frontend Optimization

1. **No Build Step**: Direct browser execution
2. **Native Modules**: ES6 import/export
3. **Code Splitting**: Load only what's needed
4. **Debouncing**: Reduce API calls (1200ms)
5. **Shadow DOM**: CSS scoping without overhead
6. **View Transitions**: Smooth navigation
7. **Local Fonts**: No external font requests

### Backend Optimization

1. **Streaming**: Use Node.js streams for large files
2. **Pagination**: Limit results per request
3. **Filtering**: Server-side filtering reduces payload
4. **Caching**: Future: Add Redis for caching

### Future Optimizations

- Implement virtual scrolling for large lists
- Add service worker for offline support
- Use IndexedDB for client-side caching
- Compress API responses with gzip
- Add CDN for static assets
- Implement request batching

## Security Considerations

### Current Implementation

- Input validation needed
- SQL injection not applicable (JSON file)
- XSS prevention via Shadow DOM
- CORS configured for development

### Production Recommendations

1. Add authentication (JWT)
2. Implement rate limiting
3. Validate all inputs
4. Sanitize user data
5. Add CSRF protection
6. Use HTTPS only
7. Implement proper CORS
8. Add request signing

## Scalability

### Current Limitations

- File-based storage
- Single server instance
- No caching layer
- Limited to local deployment

### Scaling Strategy

1. **Database Migration**: PostgreSQL/MongoDB
2. **Horizontal Scaling**: Multiple server instances
3. **Load Balancing**: Nginx/HAProxy
4. **Caching Layer**: Redis
5. **CDN**: CloudFront/Cloudflare
6. **Microservices**: Split into services
7. **Message Queue**: RabbitMQ for async tasks
8. **Container Orchestration**: Kubernetes

## Testing Strategy

See [TESTING.md](TESTING.md) for detailed testing documentation.

## Deployment

### Development

```bash
# Frontend: Open index.html directly
# Backend
cd backend
npm run dev
```

### Production

1. Set environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates
5. Configure logging
6. Set up monitoring

## Future Architecture Changes

1. **TypeScript**: Add type safety
2. **GraphQL**: Replace REST API
3. **Real-time**: WebSocket for live updates
4. **PWA**: Add service worker
5. **SSR**: Server-side rendering for SEO
6. **Microservices**: Split monolith
7. **Event-Driven**: Event sourcing pattern
