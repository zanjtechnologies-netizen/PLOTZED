# Contributing to Plotzed Real Estate Web App

## Branch Strategy

### Main Branches
- **main**: Production-ready code only
- **develop**: Integration branch for features

### Supporting Branches
- **feature/**: New features (`feature/property-listing`)
- **bugfix/**: Bug fixes (`bugfix/payment-error`)
- **hotfix/**: Urgent production fixes (`hotfix/security-patch`)
- **release/**: Release preparation (`release/v1.0.0`)

## Workflow

### 1. Starting New Work

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes
# ...

# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat: add property search functionality"
```

### 3. Pushing Changes

```bash
# Push to remote
git push origin feature/your-feature-name
```

### 4. Creating Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Set base: `develop`, compare: `feature/your-feature-name`
4. Add description and reviewers
5. Wait for approval

### 5. After Merge

```bash
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name
```

## Commit Message Guidelines

Format: `<type>(<scope>): <subject>`

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat(listings): add advanced search filters
fix(payment): resolve razorpay webhook issue
docs(readme): update installation steps
style(frontend): format code with prettier
refactor(backend): optimize database queries
test(api): add integration tests for leads
chore(deps): update dependencies
```

## Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No console.logs in production code
- [ ] Environment variables are not hardcoded
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

## Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

## Questions?

Contact the development team or create an issue.