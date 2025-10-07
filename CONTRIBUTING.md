# Contributing to 100B Jobs

Thank you for your interest in contributing to 100B Jobs! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/100B-jobs.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit and push
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup

The frontend uses vanilla JavaScript with Web Components and requires no build step.

```bash
# Open index.html in your browser or use a local server
# Recommended: Use VS Code Live Server extension
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:3001`

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
npm test

# Run all tests
npm run test:all

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- Bug fixes
- New features
- Documentation improvements
- Test coverage improvements
- Performance optimizations
- UI/UX enhancements

### Before Starting Work

1. Check existing issues and pull requests to avoid duplication
2. For major changes, open an issue first to discuss your proposal
3. Make sure you have the latest code from the main branch

## Coding Standards

### JavaScript Style

- Use ES6+ features (const, let, arrow functions, template literals)
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Follow existing code style

### File Organization

- Place components in `/components`
- Place modules in `/module`
- Place utilities in `/utils`
- Keep files focused on a single responsibility

### Web Components

When creating new web components:

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    // Component rendering logic
  }
}

customElements.define('my-component', MyComponent);
```

### CSS

- Use Material Design principles
- Prefer CSS custom properties for theming
- Use semantic class names
- Support dark mode with `prefers-color-scheme`
- Ensure responsive design

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Test Structure

```javascript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = functionToTest(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

### Test Coverage

- Aim for at least 80% code coverage
- Test edge cases and error handling
- Test both success and failure paths

## Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new features
4. Run linter and fix any issues
5. Ensure your branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
Describe the tests you added/modified

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors/warnings
```

### Review Process

- PRs require at least one review
- Address all review comments
- Keep PRs focused and reasonably sized
- Be responsive to feedback

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

- `feat(search): add fuzzy search functionality`
- `fix(api): resolve pagination offset bug`
- `docs(readme): update installation instructions`

## Issue Reporting

### Bug Reports

Include:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser/environment details
- Screenshots if applicable
- Error messages/console logs

### Feature Requests

Include:

- Clear use case
- Proposed solution
- Alternative solutions considered
- Mockups/wireframes if applicable

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed

## Community

- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback
- Celebrate contributions

## Questions?

If you have questions, feel free to:

- Open a discussion issue
- Reach out to maintainers
- Check existing documentation

Thank you for contributing to 100B Jobs!
