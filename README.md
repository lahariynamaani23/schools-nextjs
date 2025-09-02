# Schools Directory — Next.js + MySQL

A 2-page mini-project per assignment:

- **/addSchool** — form with validations (react-hook-form) + image upload saved to `/public/schoolImages` and DB insert.
- **/showSchools** — card-style listing showing **name, address, city, image** like an ecommerce grid.

## Tech
- Next.js (Pages Router) so pages are `addSchool.jsx` and `showSchools.jsx`.
- MySQL via `mysql2` pool.
- File upload via `formidable` (saves to `/public/schoolImages`).

## Environment
Create `.env.local` at project root:

```bash
MYSQL_HOST=localhost
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=schoolsdb
MYSQL_PORT=3306
```

## SQL — Create DB + Table
Run this in your MySQL client:

```sql
CREATE DATABASE IF NOT EXISTS schoolsdb;
USE schoolsdb;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(20) NOT NULL,
  image TEXT,
  email_id TEXT NOT NULL
);
```

(Also in `scripts/schema.sql`).

## Run locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000/addSchool` to add data, and `http://localhost:3000/showSchools` to view.

## Deploy (Vercel recommended)
1. Push this repo to GitHub.
2. Import repo in Vercel.
3. Add the same **Environment Variables** in Vercel Project Settings → Environment Variables.
4. Deploy.  
> Tip: Saving images to project filesystem is fine in local/dev or a traditional server. On serverless (Vercel/Netlify), files are ephemeral. For production, swap to an object store (e.g., Cloudinary/S3).

## Folder Overview
```
/pages
  /api/schools/index.js      # GET list
  /api/schools/create.js     # POST create with image upload
  addSchool.jsx              # form page
  showSchools.jsx            # listing page
/lib/db.js                   # mysql2 pool helper
/public/schoolImages         # uploaded images
/scripts/schema.sql          # table DDL
/styles/globals.css          # minimal responsive styles
```


## Cloudinary Pro Upgrade
This version uses **Cloudinary** for image hosting (production-ready).

### Setup
1. Create free account at [cloudinary.com](https://cloudinary.com).
2. Get credentials from dashboard.
3. Add to `.env.local`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Images will be uploaded to Cloudinary folder `schools/` and served via CDN.
