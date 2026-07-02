# Contributing to Design Context Pro

Thank you for your interest in contributing to Design Context Pro! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, Node version, Figma version, etc.
- **Screenshots**: If applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case**: Why this enhancement would be useful
- **Possible implementation**: If you have ideas on how to implement it

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Fill in the PR template
- Follow the TypeScript/React code style
- Include tests if applicable
- Update the README.md if you change functionality
- Ensure the build passes
- Link any relevant issues

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Figma Desktop App (for plugin development)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/design-context-pro.git
cd design-context-pro

# Install dependencies
npm run install:all

# Build all projects
npm run build:all
```

### Running Tests

```bash
# Run plugin tests
cd figma-plugin
npm test

# Run server tests
cd web-app/server
npm test

# Run client tests
cd web-app/client
npm test
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types when possible
- Use meaningful variable and function names

### React

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing component structure

### Naming Conventions

- **Files**: Use PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces/Types**: PascalCase with descriptive names

### Commit Messages

Follow the conventional commits specification:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(plugin): add property documentation support

Added ability to document component properties with types
and descriptions in the Figma plugin UI.

Closes #123
```

## Project Structure

```
design-context-pro/
├── figma-plugin/          # Figma plugin
├── web-app/
│   ├── client/            # React frontend
│   └── server/            # Express backend
├── docs/                  # Additional documentation
└── README.md
```

## Questions?

Feel free to open an issue with the `question` label if you need help or clarification.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
