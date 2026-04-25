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
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/images`
- `POST /api/images/upload` (multipart form field: `image`)
