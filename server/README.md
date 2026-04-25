# DineFlow API Server

Express backend for API calls, authentication, MongoDB persistence, and Cloudinary image storage.

## Quick start

1. Install dependencies:

```bash
cd server
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Set your MongoDB and Cloudinary credentials in `.env`.

4. Run server:

```bash
npm run dev
```

## Endpoints

- `GET /api/health`
- `POST /api/auth/company/register`
  - body: `{ "email": "OWNER@MAIL.COM", "companyId": "COMPANYID", "password": "...", "confirmPassword": "..." }`
- `POST /api/auth/company/login`
  - body: `{ "identifier": "OWNER@MAIL.COM or COMPANYID", "password": "..." }`
- `POST /api/auth/workers/invite`
  - owner token required
  - body: `{ "email": "chef@restaurant.com", "role": "chef", "specialties": ["Burgers"] }`
- `POST /api/auth/workers/register`
  - body: `{ "companyId": "COMPANYID", "email": "chef@restaurant.com", "name": "Chef", "password": "...", "confirmPassword": "..." }`
- `POST /api/auth/workers/login`
  - body: `{ "email": "chef@restaurant.com", "password": "..." }`
- `GET /api/images`
- `POST /api/images/upload` (multipart form field: `image`)
