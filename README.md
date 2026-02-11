# MedKura Report Management & Status Tracking System

Production-ready full-stack application for managing medical reports. Built with React and Spring Boot using PostgreSQL.

**[📖 Full Setup Guide →](SETUP.md)**

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

See [SETUP.md](SETUP.md) for detailed instructions for both backend and frontend.

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
  first_name VARCHAR(255),
  last_name VARCHAR(255),
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

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### Reports
- POST /api/reports
- GET /api/reports
- GET /api/reports/{id}
- PATCH /api/reports/{id}/status
- POST /api/reports/{id}/summary (bonus feature for summary generation)

## Screenshots
- Login and registration pages
- Reports list with status filtering
- Upload report workflow
- Report detail page with metadata and summary
- AI summary generation modal

*Screenshots to be added in `/docs/screenshots/` directory*

## Notes
- File uploads are stored under backend storage path.
- Summary generation is auto-triggered when status changes to COMPLETED.
- Extra feature: On-demand summary generation via `POST /api/reports/{id}/summary`.
- Use `pnpm` for frontend to match lockfile; `npm` also works.
- Hibernate auto-generates/updates schema on startup (configured with `ddl-auto: update`).
- JWT tokens expire after 2 hours by default (configurable in `application.yml`).
