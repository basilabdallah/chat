# Contributing to Creative Chat

Thank you for your interest in contributing to Creative Chat! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug:

1. **Check existing issues** to see if it's already reported
2. **Create a new issue** with:
   - Clear title describing the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser/OS information
   - Console errors (if any)

### Suggesting Features

Have an idea for a new feature?

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Clear title
   - Detailed description of the feature
   - Use cases and benefits
   - Mockups or examples (if applicable)
   - Technical considerations

### Improving Documentation

Documentation improvements are always welcome!

- Fix typos
- Clarify confusing sections
- Add examples
- Update outdated information
- Translate to other languages

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- Git
- A Supabase account
- Code editor (VS Code recommended)

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/your-username/creative-chat-app.git
   cd creative-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.local.example .env.local
   # Add your Supabase credentials
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

### Code Style

We follow these conventions:

- **TypeScript**: Use type annotations
- **Components**: Functional components with hooks
- **Naming**: 
  - Components: PascalCase (`MessageList.tsx`)
  - Files: camelCase or kebab-case
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **Formatting**: Run `npm run lint` before committing

### Project Structure

```
app/          → Pages and routing
components/   → Reusable UI components
hooks/        → Custom React hooks
store/        → State management
lib/          → Utilities and configs
types/        → TypeScript types
```

## 📝 Making Changes

### Branch Naming

Create descriptive branch names:

- `feature/add-dark-mode`
- `fix/message-deletion-bug`
- `docs/update-setup-guide`
- `refactor/optimize-queries`

### Commit Messages

Write clear commit messages:

```
feat: add dark mode toggle
fix: resolve message deletion issue
docs: update setup instructions
refactor: optimize database queries
style: fix button padding
test: add message component tests
```

### Testing Your Changes

Before submitting:

- [ ] Code runs without errors
- [ ] All existing features still work
- [ ] New features work as expected
- [ ] No console errors or warnings
- [ ] Code follows project style
- [ ] Documentation updated (if needed)

## 🚀 Submitting Changes

### Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing patterns
   - Test thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### PR Guidelines

**Title**: Clear and descriptive
```
Add dark mode toggle functionality
Fix: Resolve message deletion bug
Docs: Update deployment guide
```

**Description**: Include:
- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots (if UI changes)
- Related issues (if any)

**Example PR Description**:
```markdown
## Changes
- Added dark mode toggle to user menu
- Created useDarkMode hook
- Updated Tailwind config for dark mode
- Added dark mode styles to all components

## Why
Users requested a dark mode option for better viewing at night.

## Testing
1. Click user menu in sidebar
2. Toggle "Dark Mode" switch
3. Verify all pages display correctly
4. Check that preference persists on refresh

## Screenshots
[Add screenshots here]

Fixes #123
```

## 🎯 Contribution Areas

### Easy Tasks (Good First Issues)

- Documentation improvements
- UI polish and animations
- Adding tests
- Fixing typos
- Improving error messages

### Medium Tasks

- New UI components
- Adding settings page
- Implementing search
- Adding file uploads
- Creating notifications

### Advanced Tasks

- Adding voice/video calls
- Implementing message threading
- Creating mobile app
- Adding end-to-end encryption
- Building admin dashboard

## 🔍 Code Review

All submissions require review. We'll check:

- Code quality and style
- Functionality
- Tests (if applicable)
- Documentation
- Performance impact
- Security implications

## 🐛 Debugging Tips

### Common Issues

**Changes not appearing**
- Clear browser cache
- Restart dev server
- Check for console errors

**Database issues**
- Verify Supabase connection
- Check RLS policies
- Review SQL queries

**Type errors**
- Run `npm run build` to check
- Update type definitions
- Check imports

### Useful Commands

```bash
# Check for linting errors
npm run lint

# Build for production
npm run build

# Type check
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next
```

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Docs
- [README.md](README.md) - Project overview
- [FEATURES.md](FEATURES.md) - Feature details
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Mentioned in the project

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 💬 Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues and PRs

## 🎉 Thank You!

Every contribution, no matter how small, is valued and appreciated. Thank you for helping make Creative Chat better!

---

**Happy Contributing! 🚀**
