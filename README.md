# dineflow-os

## Express API server

This project now includes an Express server for:
- authentication with JWT
- MongoDB persistence
- image upload to Cloudinary

### Folder

`server/src`

### Setup

1. Copy env template:

```bash
cp server/.env.example server/.env
```

2. Fill in your MongoDB and Cloudinary credentials in `server/.env`.

3. Start API server:

```bash
npm run server
```

For auto-reload during development:

```bash
npm run server:dev
```

### API endpoints

- `GET /api/health` - health check
- `POST /api/auth/register` - register user (`name`, `email`, `password`)
- `POST /api/auth/login` - login user (`email`, `password`)
- `GET /api/images` - list authenticated user's uploads
- `POST /api/images/upload` - upload image file (`multipart/form-data`, field name: `image`)
