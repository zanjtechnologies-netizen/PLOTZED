# PLOTZED
Plotzed is a full-stack real estate automation platform designed to streamline client lead management, property insights, and marketing workflows. It integrates data scraping, CRM, and Meta Ads tracking to automate lead collection from social media and listing platforms, helping agencies convert prospects faster.
# Plotzed Real Estate - Web Application

Modern, secure, and scalable web application for Plotzed Real Estate Developers.

## 🚀 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation

### Backend
- NestJS with TypeScript
- PostgreSQL database
- Redis for caching
- TypeORM for database operations
- JWT authentication

### Integrations
- Razorpay for payments
- Google Maps for location services
- AWS S3 for file storage
- reCAPTCHA for security
- SendGrid for emails

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/plotzed/webapp.git
cd plotzed-webapp
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. Setup environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Update with your values

# Frontend
cp frontend/.env.example frontend/.env
# Update with your values
```

4. Start development servers:
```bash
# Start PostgreSQL & Redis
docker-compose up -d postgres redis

# Run migrations
cd backend && npm run migration:run

# Start backend
npm run start:dev

# In another terminal, start frontend
cd frontend && npm run dev
```

## 🌿 Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Urgent fixes

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build process or auxiliary tool changes

Example: `feat: add property booking system`

## 🚀 Deployment

- **Frontend**: Cloudflare Pages
- **Backend**: AWS EC2 with PM2
- **Database**: AWS RDS PostgreSQL

## 📖 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Security Checklist](./docs/SECURITY_CHECKLIST.md)

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Submit a pull request to `develop`

## 📄 License

Proprietary - Plotzed Real Estate Developers

## 📞 Support

For support, email: plotzedrealestate@gmail.com
Phone: +91 7708594263