# TecJob NestJS & MongoDB Authentication Backend

Enterprise-grade NestJS REST API connected to MongoDB via Mongoose for the **TecJob** recruitment portal.

## 🚀 Features

- **Framework**: NestJS 12 (TypeScript, Express)
- **Database**: MongoDB via `@nestjs/mongoose` and `mongoose`
- **Schemas**:
  - `User`: Full profile for Job Seekers and Employers/Recruiters with indexed lowercase emails, phone, bcrypt password hashing, and verification status.
  - `Otp`: 6-digit verification code with 10-minute TTL, bcrypt hashed codes, attempts limiter (max 4), and 60-second resend cooldown.
- **Security & Authentication**:
  - NIST-grade password hashing with `bcryptjs` (12 salt rounds)
  - JWT Access Token generation (`@nestjs/jwt` + `@nestjs/passport`)
  - Strict input validation via `class-validator` and `class-transformer`
  - Role-Based Access Control (RBAC) with `@Roles()` decorator and `RolesGuard`
  - CORS enabled for Next.js frontend (`http://localhost:3000`)
- **Email Verification**:
  - Automated 6-digit OTP email delivery via `nodemailer`
  - 1-Click magic link verification endpoint (`GET /api/auth/verify-email`)

---

## 📁 Project Structure

```text
Backend/
├── src/
│   ├── main.ts                       # Server bootstrap, CORS, ValidationPipe
│   ├── app.module.ts                 # Root AppModule (Config, Mongoose, Auth, Users, Mail)
│   ├── users/
│   │   ├── schemas/user.schema.ts    # MongoDB User Schema (seeker & employer)
│   │   ├── users.service.ts          # Mongoose DB operations
│   │   └── users.module.ts
│   ├── auth/
│   │   ├── schemas/otp.schema.ts     # MongoDB OTP Schema with TTL
│   │   ├── dto/                      # RegisterDto, LoginDto, VerifyOtpDto, ResendOtpDto
│   │   ├── strategies/jwt.strategy.ts# Passport JWT Bearer validation
│   │   ├── auth.service.ts           # Auth business logic, bcrypt & OTP flow
│   │   ├── auth.controller.ts        # REST endpoints under /api/auth/*
│   │   └── auth.module.ts
│   ├── mail/
│   │   ├── mail.service.ts           # HTML Email & OTP delivery
│   │   └── mail.module.ts
│   └── common/
│       ├── decorators/               # @Roles(), @CurrentUser()
│       └── guards/                   # JwtAuthGuard, RolesGuard
├── .env                              # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
└── package.json
```

---

## 🛠️ Getting Started

### 1. MongoDB Setup
Make sure MongoDB is running locally:
```bash
# Default local connection
mongodb://127.0.0.1:27017/tecjob
```
Or use a free **MongoDB Atlas** cloud URI in `.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tecjob?retryWrites=true&w=majority
```

### 2. Run the NestJS Server

```bash
cd Backend
npm run start:dev
```

Server runs on: **http://localhost:5000**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers new seeker/employer, hashes password, saves to MongoDB, sends OTP |
| `POST` | `/api/auth/login` | Verifies password with bcrypt, enforces email verification, returns JWT |
| `POST` | `/api/auth/verify-otp` | Validates 6-digit OTP, marks user verified in MongoDB, issues JWT token |
| `POST` | `/api/auth/resend-otp` | Generates new OTP with 60s cooldown limit |
| `GET` | `/api/auth/verify-email` | 1-Click magic link verify handler (redirects to dashboard) |
| `POST` | `/api/auth/forgot-password`| Initiates password recovery |
| `GET` | `/api/auth/me` | Protected route (requires `Bearer <JWT_TOKEN>`) returning profile |

