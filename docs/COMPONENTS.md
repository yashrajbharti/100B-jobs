# Components Documentation

This document provides detailed information about all Web Components used in the 100B Jobs platform.

## Table of Contents

- [Overview](#overview)
- [Component Architecture](#component-architecture)
- [Component Reference](#component-reference)
  - [CandidateCard](#candidatecard)
  - [SearchBar](#searchbar)
  - [PaginationComponent](#paginationcomponent)
  - [SkillsComponent](#skillscomponent)
  - [TimelineComponent](#timelinecomponent)
  - [AdvancedTimelineComponent](#advancedtimelinecomponent)
  - [CandidateDetails](#candidatedetails)
  - [UserProfile](#userprofile)
- [Creating New Components](#creating-new-components)
- [Testing Components](#testing-components)

## Overview

100B Jobs uses native Web Components (Custom Elements) for building reusable UI components. Each component is self-contained with its own styles and behavior, using Shadow DOM for encapsulation.

## Component Architecture

### Base Structure

All components follow this pattern:

```javascript
export class ComponentName extends HTMLElement {
  constructor() {
    super();
    // Initialize Shadow DOM
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Called when component is added to DOM
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    // Called when component is removed from DOM
    this.cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Called when observed attribute changes
    this.render();
  }

  static get observedAttributes() {
    // List attributes to watch for changes
    return ['attribute-name'];
  }

  render() {
    // Update component UI
    this.shadowRoot.innerHTML = `...`;
  }
}

customElements.define('component-name', ComponentName);
```

### Shadow DOM

Components use Shadow DOM for:

- **Style Encapsulation**: Styles don't leak out
- **Markup Encapsulation**: Internal structure is hidden
- **Composition**: Slot-based content projection

## Component Reference

### CandidateCard

Displays a candidate's summary information in a card format.

**File**: `components/candidate-card.mjs`

**Tag**: `<candidate-card>`

**Attributes**:

- `name` (string): Candidate's full name
- `email` (string): Email address
- `link` (string): URL to candidate detail page
- `skills` (string): Comma-separated list of skills
- `data-top` (string, optional): Top ranking badge (e.g., "#1")

**Example**:

```html
<candidate-card
  name="John Doe"
  email="john@example.com"
  link="/candidate.html?id=1"
  skills="JavaScript, React, Node.js"
  data-top="#1">
</candidate-card>
```

**Features**:

- Material Design styling
- Skill chips with color coding
- Top candidate badge overlay
- Ripple effect on hover
- Responsive layout

**Events**: None (navigates via link)

---

### SearchBar

Provides search functionality with debouncing.

**File**: `components/search-bar.mjs`

**Tag**: `<search-bar>`

**Attributes**: None

**Example**:

```html
<search-bar></search-bar>
```

**Features**:

- 1200ms debounce for performance
- Custom search icon
- Clear button support
- Accessible label
- Custom styling for light/dark themes

**Events**:

- `search`: Fired when user types (after debounce)

  ```javascript
  searchBar.addEventListener('search', (e) => {
    console.log('Search query:', e.detail); // string
  });
  ```

**Usage**:

```javascript
import { SearchBar } from './components/search-bar.mjs';

customElements.define('search-bar', SearchBar);

// Listen for search events
document.querySelector('search-bar')
  .addEventListener('search', (e) => {
    performSearch(e.detail);
  });
```

---

### PaginationComponent

Handles pagination UI and logic.

**File**: `components/pagination-component.mjs`

**Tag**: `<pagination-component>`

**Attributes**:

- `current` (number): Current page number (1-based)
- `per-page` (number): Results per page
- `total` (number): Total number of results

**Example**:

```html
<pagination-component
  current="1"
  per-page="50"
  total="500">
</pagination-component>
```

**Features**:

- Previous/Next navigation
- Page number display
- Calculates offset automatically
- Disabled state for boundary pages
- Material Design buttons

**Events**:

- `page-change`: Fired when page changes

  ```javascript
  pagination.addEventListener('page-change', (e) => {
    console.log(e.detail); // { offset: number, limit: number }
  });
  ```

**Behavior**:

- Disables "Previous" on first page
- Disables "Next" on last page
- Calculates offset: `(current - 1) * perPage`
- Smooth scroll to top on page change

---

### SkillsComponent

Displays candidate skills as colored chips.

**File**: `components/skills-component.mjs`

**Tag**: `<skills-component>`

**Attributes**:

- `skills` (string): Comma-separated list of skills

**Example**:

```html
<skills-component skills="JavaScript, Python, Docker, Kubernetes"></skills-component>
```

**Features**:

- Color mapping from `utils/colorMap.mjs`
- Material Design chips
- Responsive wrapping
- Custom colors per skill
- Fallback color for unknown skills

**Styling**:

Each skill chip has:

- Custom background color
- Contrasting text color
- Rounded corners
- Padding and spacing

---

### TimelineComponent

Displays work experience in timeline format.

**File**: `components/timeline-component.mjs`

**Tag**: `<timeline-component>`

**Attributes**:

- `experience` (string): JSON-encoded array of experience objects

**Example**:

```html
<timeline-component
  experience='[{"company":"Tech Corp","position":"Developer","start":"2020-01-01","end":"2024-01-01"}]'>
</timeline-component>
```

**Experience Object Structure**:

```typescript
interface Experience {
  company: string;
  position: string;
  description?: string;
  start: string; // ISO date
  end: string;   // ISO date or "Present"
}
```

**Features**:

- Chronological display
- Date formatting
- Company and position highlighting
- Description text
- Visual timeline connector
- Responsive layout

---

### AdvancedTimelineComponent

Enhanced timeline with additional features.

**File**: `components/advanced-timeline-component.mjs`

**Tag**: `<advanced-timeline-component>`

**Attributes**: Similar to TimelineComponent

**Example**:

```html
<advanced-timeline-component
  experience='[...]'>
</advanced-timeline-component>
```

**Additional Features**:

- Duration calculation
- Gap analysis
- Overlapping job detection
- More detailed styling
- Animation effects

---

### CandidateDetails

Comprehensive candidate information display.

**File**: `components/candidate-details.mjs`

**Tag**: `<candidate-details>`

**Attributes**:

- `candidate` (string): JSON-encoded candidate object

**Example**:

```html
<candidate-details
  candidate='{"name":"John Doe","email":"john@example.com",...}'>
</candidate-details>
```

**Sections Displayed**:

- Basic information
- Skills
- Work experience
- Education
- Projects
- Certifications
- Score and ranking

**Features**:

- Tabbed interface (optional)
- Print-friendly layout
- Export functionality
- Responsive design

---

### UserProfile

Displays user profile header.

**File**: `components/user-profile.mjs`

**Tag**: `<user-profile>`

**Attributes**:

- `name` (string): User's name
- `email` (string): Email address
- `avatar` (string, optional): Avatar URL

**Example**:

```html
<user-profile
  name="John Doe"
  email="john@example.com"
  avatar="https://example.com/avatar.jpg">
</user-profile>
```

**Features**:

- Avatar display
- Fallback initials
- Contact information
- Material Design styling

---

## Creating New Components

### Step 1: Create Component File

Create a new file in `/components`:

```javascript
// components/my-component.mjs
export class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        /* Component styles */
      </style>
      <div>
        <!-- Component markup -->
      </div>
    `;
  }
}

// Register the component
customElements.define('my-component', MyComponent);
```

### Step 2: Import and Use

```javascript
// In your main script
import './components/my-component.mjs';

// Use in HTML
<my-component></my-component>
```

### Best Practices

1. **Use Shadow DOM**: For style encapsulation
2. **Reactive Attributes**: Use `attributeChangedCallback` for reactivity
3. **Custom Events**: Emit events for parent communication
4. **Accessibility**: Add ARIA attributes and keyboard support
5. **Performance**: Debounce expensive operations
6. **Error Handling**: Gracefully handle missing attributes
7. **Documentation**: Document all attributes and events

### Component Template

```javascript
export class NewComponent extends HTMLElement {
  // Define which attributes to observe
  static get observedAttributes() {
    return ['attribute-name'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Getters for attributes
  get attributeName() {
    return this.getAttribute('attribute-name');
  }

  // Event listeners
  attachEventListeners() {
    this.shadowRoot.querySelector('.button')
      ?.addEventListener('click', this.handleClick.bind(this));
  }

  removeEventListeners() {
    this.shadowRoot.querySelector('.button')
      ?.removeEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event) {
    // Emit custom event
    this.dispatchEvent(new CustomEvent('custom-event', {
      detail: { data: 'value' },
      bubbles: true,
      composed: true, // Cross shadow DOM boundary
    }));
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        /* Styles */
      </style>
      <div>
        <!-- Markup -->
      </div>
    `;
  }
}

customElements.define('new-component', NewComponent);
```

## Testing Components

### Unit Testing

```javascript
// __tests__/my-component.test.mjs
import { describe, it, expect, beforeEach } from '@jest/globals';
import '../components/my-component.mjs';

describe('MyComponent', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('my-component');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('should render with default attributes', () => {
    expect(element.shadowRoot).toBeTruthy();
  });

  it('should update when attribute changes', () => {
    element.setAttribute('name', 'Test');
    expect(element.shadowRoot.textContent).toContain('Test');
  });

  it('should emit custom events', (done) => {
    element.addEventListener('custom-event', (e) => {
      expect(e.detail).toBeDefined();
      done();
    });
    
    element.shadowRoot.querySelector('.button').click();
  });
});
```

### Integration Testing

Test components in combination:

```javascript
describe('Component Integration', () => {
  it('should work with other components', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <search-bar></search-bar>
      <candidate-card name="Test"></candidate-card>
    `;
    
    // Test interactions
  });
});
```

## Component Communication

### Parent to Child

Use attributes:

```javascript
// Parent
const child = document.createElement('child-component');
child.setAttribute('data', 'value');
```

### Child to Parent

Use custom events:

```javascript
// Child
this.dispatchEvent(new CustomEvent('data-change', {
  detail: { value: 'new value' },
  bubbles: true,
  composed: true,
}));

// Parent
child.addEventListener('data-change', (e) => {
  console.log(e.detail.value);
});
```

### Sibling Communication

Use a shared event bus or parent mediator:

```javascript
// Event bus
const eventBus = new EventTarget();

// Component A
eventBus.dispatchEvent(new CustomEvent('message', { detail: 'hello' }));

// Component B
eventBus.addEventListener('message', (e) => {
  console.log(e.detail);
});
```

## Styling Components

### CSS Custom Properties

Use for theming:

```css
:host {
  --primary-color: var(--md-sys-color-primary, #6750a4);
  color: var(--primary-color);
}
```

### Responsive Design

```css
@media (max-width: 768px) {
  :host {
    font-size: 14px;
  }
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :host {
    background: #1a1c1e;
  }
}
```

## Performance Tips

1. **Debounce Updates**: For rapid attribute changes
2. **Event Delegation**: Use single event listener
3. **Lazy Rendering**: Render only when visible
4. **Memoization**: Cache computed values
5. **Virtual DOM**: For large lists (consider lit-html)

## Accessibility

1. **Semantic HTML**: Use proper elements
2. **ARIA Attributes**: Add when needed
3. **Keyboard Navigation**: Support tab/enter/space
4. **Focus Management**: Handle focus states
5. **Screen Readers**: Test with NVDA/JAWS

Example:

```html
<button
  role="button"
  aria-label="Search candidates"
  tabindex="0">
  Search
</button>
```
