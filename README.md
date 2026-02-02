# 🚀 Momentum

**An intelligent habit-building platform that helps users build real consistency — not just tick checkboxes.**

Momentum is a backend API built with NestJS that understands user behavior, tracks streaks intelligently, detects when consistency is dropping, and adjusts reminders dynamically. It's not just a tracker — it's a **coach**.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Database](#️-database)
- [Background Jobs](#-background-jobs)
- [Development](#-development)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### 🎯 Core Features

- **User Management**: Secure authentication with cookie-based sessions
- **Flexible Habit Creation**: Support for multiple frequency types:
  - Daily habits
  - Interval-based habits (every N days)
  - Custom day scheduling (specific weekdays)
- **Habit Completion Tracking**: Log habit completions with timestamps
- **Advanced Streak Engine**:
  - Maintains current streak count
  - Tracks longest streak achieved
  - Intelligent streak reset and recovery logic
  - Frequency-aware streak validation

### 🤖 Intelligence Layer

- **Daily Automated Evaluation**: Cron jobs that run daily to evaluate habit status
- **Smart Reminder Escalation**:
  - Missed 1 day → gentle nudge
  - Missed 2 days → stronger reminder
  - Missed 3+ days → motivational message with streak recovery strategy
- **Behavior-Aware Decision Rules**: Context-sensitive notifications based on user patterns

### 📊 Analytics

- Success rate calculation
- Daily completion summaries
- Strongest habit identification
- Weakest habit identification
- Trend performance overview

### 🔔 Notifications

- Email notifications
- Push notifications (planned)
- WhatsApp integration (planned)
- Background queue execution with BullMQ

---

## 🛠️ Tech Stack

| Category              | Technology                          |
| --------------------- | ----------------------------------- |
| **Framework**         | NestJS 11                           |
| **Language**          | TypeScript 5.7                      |
| **Database**          | PostgreSQL 17.2                     |
| **ORM**               | Drizzle ORM 0.45                    |
| **Cache/Queue**       | Redis 7.4 + BullMQ 5.67             |
| **Authentication**    | Cookie Session                      |
| **Validation**        | Class Validator + Class Transformer |
| **API Documentation** | Swagger/OpenAPI                     |
| **Task Scheduling**   | @nestjs/schedule (Cron)             |
| **Package Manager**   | pnpm                                |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Docker** and **Docker Compose** (for local development)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd momentum
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/momentum
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=momentum
POSTGRES_PORT=5432

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3000
NODE_ENV=development
```

Create a `docker.env` file for Docker services:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=momentum
PGADMIN_DEFAULT_EMAIL=admin@momentum.com
PGADMIN_DEFAULT_PASSWORD=admin
```

4. **Start Docker services**

```bash
docker compose up -d
```

This will start:

- PostgreSQL (port 5432)
- pgAdmin (port 8080)
- Redis (port 6379)
- Redis Commander (port 8081)

5. **Run database migrations**

```bash
pnpm run db:push
```

6. **Start the development server**

```bash
pnpm run start:dev
```

The API will be available at `http://localhost:3000`

---

## 📚 API Documentation

Once the server is running, access the interactive Swagger API documentation at:

```
http://localhost:3000/api
```

### Main Endpoints

#### � Users

- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/me` - Get current user profile
- `POST /users/logout` - Logout user

#### 📌 Habits

- `POST /habits` - Create a new habit
- `GET /habits` - Get all user habits
- `GET /habits/:habitId` - Get specific habit
- `PATCH /habits/:habitId` - Update habit
- `DELETE /habits/:habitId` - Delete habit
- `POST /habits/:habitId/completed` - Mark habit as completed
- `GET /habits/:habitId/logs` - Get habit completion logs

#### 🏆 Streaks

- `GET /streak/:habitId` - Get streak information for a habit

#### 📊 Analytics

- `GET /analytics/summary` - Get user analytics summary

---

## 📁 Project Structure

```
momentum/
├── src/
│   ├── analytics/          # Analytics module
│   ├── database/           # Database configuration and schemas
│   │   └── schemas/        # Drizzle ORM schemas
│   ├── guards/             # Authentication guards
│   ├── habits/             # Habits module
│   │   ├── dtos/           # Data transfer objects
│   │   └── pipes/          # Custom pipes
│   ├── interceptors/       # Global interceptors
│   ├── middleware/         # Custom middleware
│   ├── notification/       # Notification module
│   ├── streak/             # Streak tracking module
│   ├── users/              # User management module
│   ├── app.module.ts       # Root application module
│   └── main.ts             # Application entry point
├── drizzle/                # Database migrations
├── test/                   # E2E tests
├── docker-compose.yml      # Docker services configuration
└── drizzle.config.ts       # Drizzle ORM configuration
```

---

## � Environment Variables

| Variable            | Description                          | Default       |
| ------------------- | ------------------------------------ | ------------- |
| `DATABASE_URL`      | PostgreSQL connection string         | -             |
| `POSTGRES_USER`     | PostgreSQL username                  | `postgres`    |
| `POSTGRES_PASSWORD` | PostgreSQL password                  | -             |
| `POSTGRES_DB`       | PostgreSQL database name             | `momentum`    |
| `POSTGRES_PORT`     | PostgreSQL port                      | `5432`        |
| `REDIS_HOST`        | Redis host                           | `localhost`   |
| `REDIS_PORT`        | Redis port                           | `6379`        |
| `PORT`              | Application port                     | `3000`        |
| `NODE_ENV`          | Environment (development/production) | `development` |

---

## �️ Database

### Database Management Tools

- **pgAdmin**: Access at `http://localhost:8080`
  - Email: `admin@momentum.com`
  - Password: `admin`

- **Drizzle Studio**: Run `pnpm run db:studio` to access the visual database explorer

### Database Commands

```bash
# Generate migrations
pnpm run db:generate

# Run migrations
pnpm run db:migrate

# Push schema changes directly (development)
pnpm run db:push

# Open Drizzle Studio
pnpm run db:studio
```

---

## ⚙️ Background Jobs

Momentum uses **BullMQ** with Redis for background job processing:

- **Daily Streak Evaluation**: Runs daily to check and reset broken streaks
- **Smart Notifications**: Processes notification queues based on user behavior
- **Analytics Aggregation**: Periodic calculation of user statistics

### Redis Management

Access **Redis Commander** at `http://localhost:8081` to monitor queues and cached data.

---

## 💻 Development

### Available Scripts

```bash
# Development
pnpm run start:dev          # Start in watch mode
pnpm run start:debug        # Start in debug mode

# Building
pnpm run build              # Build for production
pnpm run start:prod         # Run production build

# Code Quality
pnpm run lint               # Lint and fix code
pnpm run format             # Format code with Prettier

# Testing
pnpm run test               # Run unit tests
pnpm run test:watch         # Run tests in watch mode
pnpm run test:cov           # Run tests with coverage
pnpm run test:e2e           # Run end-to-end tests
```

### Development Workflow

1. Make your changes
2. Run linting: `pnpm run lint`
3. Run tests: `pnpm run test`
4. Test the API using Swagger UI at `/api`
5. Commit your changes

---

## 🎯 Core Value Proposition

✅ Helps users stay consistent  
✅ Detects missed habits intelligently  
✅ Encourages recovery instead of punishment  
✅ Learns user behavior over time

**Momentum focuses on:**

- Behavior awareness
- Smart coaching
- Real accountability
- Long-term consistency

---

## � Future Enhancements

- [ ] **AI Recommendation Engine**: Suggests optimal activity times based on historical data
- [ ] **Leaderboard/Community Mode**: Social features for motivation
- [ ] **Habit Buddy System**: Pair users for mutual accountability
- [ ] **Premium Subscription Tier**: Advanced features and analytics
- [ ] **Offline-Capable Sync**: Mobile app with offline support
- [ ] **Mobile-First Companion App**: Native iOS/Android applications
- [ ] **Advanced Analytics Dashboard**: Detailed insights and visualizations
- [ ] **Integration with Wearables**: Sync with fitness trackers
- [ ] **Gamification**: Badges, achievements, and rewards

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the UNLICENSED license.

---

## 👨‍💻 Author

**Momentum** — Designed & Engineered with intention.

Built to help people build meaningful habits and keep them.

---

## � Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database powered by [PostgreSQL](https://www.postgresql.org/)
- Queue management by [BullMQ](https://docs.bullmq.io/)
- ORM by [Drizzle](https://orm.drizzle.team/)

---

**Made with ❤️ for building better habits**
