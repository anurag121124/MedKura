# MedKura Setup Guide

This guide provides step-by-step instructions to set up and run the MedKura Report Management & Status Tracking System locally.

## Prerequisites

- **Java 21** or higher (for backend)
- **Node.js 18+** and pnpm or npm (for frontend)
- **PostgreSQL 12+** (local or cloud-hosted, e.g., Neon)
- **Git** (to clone the repository)

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine.
2. Create a new database:
   ```bash
   createdb medkura_db
   ```
3. Create a user and grant privileges:
   ```bash
   createuser medkura_user --password
   psql -d medkura_db -c "GRANT ALL PRIVILEGES ON DATABASE medkura_db TO medkura_user;"
   ```
4. Note your credentials for the next step.

### Option 2: Cloud Database (Neon)

1. Sign up at [Neon](https://neon.tech).
2. Create a new project and database.
3. Copy the connection string (JDBC format) from the dashboard.

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Update application.yml

Edit `src/main/resources/application.yml` and replace the database connection details:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/medkura_db  # or your Neon URL
    username: medkura_user                             # or neondb_owner
    password: your_password                            # your actual password
  jpa:
    hibernate:
      ddl-auto: update  # Auto-creates/updates schema on startup
```

### 3. Build and run the backend

Using Maven:
```bash
mvn clean install
mvn spring-boot:run
```

Or using your IDE's Run button (if configured).

**Backend will be available at:** `http://localhost:8080`

The application will automatically create/update the database tables on first run via Hibernate DDL.

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
pnpm install
# or npm install
```

### 3. Create environment file (optional)

Create `.env.local` if you need a custom API base URL:
```
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Start the development server
```bash
pnpm dev
# or npm run dev
```

**Frontend will be available at:** `http://localhost:5173`

## Troubleshooting

### Backend won't start: "column first_name does not exist"
- **Cause:** Existing database schema mismatch.
- **Solution:** Delete the database, recreate it, and restart the backend. Hibernote will auto-generate the correct schema.

### CORS errors in browser console
- **Cause:** Frontend and backend on different ports.
- **Solution:** Ensure backend is running on port 8080 and frontend on port 5173. Check `VITE_API_BASE_URL` in `.env.local`.

### "Cannot find module @/components/ui/button"
- **Cause:** Alias not configured or shadcn UI components not imported.
- **Solution:** Ensure `vite.config.js` includes the alias:
  ```javascript
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
  ```

### Port already in use
- **Backend (8080):** Kill the process: `lsof -ti:8080 | xargs kill -9`
- **Frontend (5173):** Specify a different port: `pnpm dev -- --port 3000`

## Docker Setup (Optional)

If you have Docker and Docker Compose installed:

```bash
docker compose up --build
```

- Frontend will be on `http://localhost:4173`
- Backend will be on `http://localhost:8080`
- PostgreSQL will be running in a container

## Testing the Application

1. Open the frontend at `http://localhost:5173`.
2. Register a new account with email and password.
3. Upload a medical report (PDF or image).
4. View the report list and details.
5. Update the report status or use "Generate AI summary" to create a summary.

## Key Features to Test

| Feature | Path |
|---------|------|
| Register | `/register` |
| Login | `/login` |
| View reports | `/` |
| Upload report | `/upload` |
| Report details | `/reports/{id}` |
| Generate summary | Report detail page → "Generate AI summary" button |

## File Organization

```
madkure/
├── backend/
│   ├── src/main/java/com/medkura/
│   │   ├── controller/          # REST endpoints
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── config/              # Spring configuration
│   │   └── exception/           # Custom exceptions
│   └── src/main/resources/
│       └── application.yml      # Configuration file
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── services/            # API services
│   │   ├── store/               # Zustand state
│   │   ├── lib/                 # Utilities
│   │   ├── App.tsx              # Main app
│   │   └── main.tsx             # Entry point
│   └── vite.config.js           # Vite configuration
├── docker-compose.yml           # Docker compose file
└── README.md                    # Project overview
```

## Environment Variables

### Backend (application.yml)
| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/medkura_db` | Database JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `medkura_user` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | `password` | Database password |
| `APP_JWT_SECRET` | `dev-secret-...` | JWT signing secret |
| `APP_STORAGE_PATH` | `./uploads` | File upload directory |

### Frontend (.env.local)
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API URL |

## Support

For issues or questions, refer to the [README.md](README.md) for architecture details and the [GitHub repository](https://github.com/anuragsingh/madkure) for source code.
