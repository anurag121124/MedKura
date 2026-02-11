# MedKura Report Management & Status Tracking System

Production-ready full-stack application for managing medical reports. Built with React and Spring Boot using PostgreSQL.

## Features
- JWT-based authentication (register + login)
- Upload medical reports with metadata and secure storage
- Status workflow: UPLOADED -> PROCESSING -> COMPLETED
- Per-user report access control
- Clean architecture with DTOs, services, and centralized error handling

## Architecture (5-10 lines)
- React SPA consumes REST APIs from Spring Boot.
- Spring Boot follows Controller -> Service -> Repository layers.
- DTOs isolate API contracts from persistence models.
- JWT-based security protects report endpoints.
- Files are stored on the backend filesystem with metadata in PostgreSQL.
- Validation and centralized exception handling ensure robust APIs.
- Status changes are recorded with timestamps for auditability.

## Setup (Local)

### Backend
1. Create a PostgreSQL database and user.
2. Update settings in backend/src/main/resources/application.yml if needed.
3. Run:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend
1. Run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend runs on http://localhost:5173 and backend on http://localhost:8080.

## Setup (Docker)
```bash
docker compose up --build
```
Frontend is exposed on http://localhost:4173.

## Database Schema
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL,
  summary TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  report_date DATE NOT NULL
);
```

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/reports
- GET /api/reports
- GET /api/reports/{id}
- PATCH /api/reports/{id}/status

## Screenshots
Add screenshots of the Login, Reports List, Upload, and Report Detail pages here.

## Notes
- File uploads are stored under backend storage path.
- Summary generation is mocked when status changes to COMPLETED.
