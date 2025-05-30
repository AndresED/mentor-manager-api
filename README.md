# DevTrack Pro - API Documentation

## Description
DevTrack Pro is a professional development tracking system designed for tech leads and mentors to monitor and manage team progress. This API provides the backend services for tracking developer progress, managing projects, and handling mentorship activities.

## Technology Stack
- NestJS Framework
- TypeScript
- MongoDB
- JWT Authentication
- CQRS Pattern

## Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Project Setup

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
```

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## API Endpoints

### Authentication
```
POST /auth/login
- Login user and get access token
- Body: { email: string, password: string }

POST /auth/refresh-token
- Refresh access token
- Body: { refreshToken: string }

POST /auth/revoke-token
- Revoke specific token
- Body: { token: string }
```

### Users
```
GET /users
- Get all users
- Protected: Requires authentication

GET /users/:id
- Get specific user
- Protected: Requires authentication

POST /users
- Create new user
- Protected: Requires admin role
- Body: { name: string, email: string, role: string }

PATCH /users/:id
- Update user
- Protected: Requires authentication
- Body: { name?: string, email?: string }
```

### Projects
```
GET /projects
- Get all projects
- Protected: Requires authentication

POST /projects
- Create new project
- Protected: Requires authentication
- Body: { name: string, description: string }

GET /projects/:id
- Get specific project
- Protected: Requires authentication

PATCH /projects/:id
- Update project
- Protected: Project owner or admin
- Body: { name?: string, description?: string }

DELETE /projects/:id
- Delete project
- Protected: Project owner or admin
```

### Tracking
```
GET /tracking/:userId
- Get user's tracking records
- Protected: User or mentor access

POST /tracking
- Create tracking record
- Protected: Mentor access
- Body: { userId: string, type: string, notes: string }

PATCH /tracking/:id
- Update tracking record
- Protected: Mentor access
- Body: { notes?: string, status?: string }
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "statusCode": number,
  "message": string,
  "error": string
}
```

## Authentication

The API uses JWT for authentication. Include the token in requests:
```
Authorization: Bearer <token>
```

## Environment Variables

```env
# Server Configuration
PORT=3000                    # Puerto para la aplicación (opcional)
NODE_ENV=development        # Entorno de la aplicación

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/devtrack    # URI de conexión a MongoDB

# JWT Configuration
JWT_SECRET=your-secret-key          # Clave secreta para JWT
JWT_EXPIRATION=1h                   # Tiempo de expiración del token de acceso
JWT_REFRESH_SECRET=your-refresh-key # Clave secreta para refresh token
JWT_REFRESH_EXPIRATION=7d           # Tiempo de expiración del refresh token

# Email Configuration (EmailJS)
EMAILJS_PUBLIC_KEY=your-public-key   # Clave pública de EmailJS
EMAILJS_PRIVATE_KEY=your-private-key # Clave privada de EmailJS
EMAILJS_SERVICE_ID=service-id        # ID del servicio de EmailJS
EMAILJS_TEMPLATE_ID=template-id      # ID de la plantilla de EmailJS
```

## Testing

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Development Guidelines

1. Follow NestJS best practices
2. Use CQRS pattern for complex operations
3. Write unit tests for new features
4. Follow semantic versioning
5. Document new endpoints

## Support

For support and questions, please open an issue in the repository or contact the development team.

## License

This project is [MIT licensed](LICENSE).
