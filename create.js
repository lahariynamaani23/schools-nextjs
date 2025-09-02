import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import { query } from '@/lib/db';

export const config = {
  api: { bodyParser: false }
};

function first(v) {
  return Array.isArray(v) ? v[0] : v;
}

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true, maxFileSize: 10 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Invalid form data' });

    try {
      const name = first(fields.name);
      const address = first(fields.address);
      const city = first(fields.city);
      const state = first(fields.state);
      const email = first(fields.email_id);
      const contact = String(first(fields.contact) || '').replace(/\D/g, '');

      // Validation
      const required = { name, address, city, state, email, contact };
      for (const [k, v] of Object.entries(required)) {
        if (!v || String(v).trim() === '') {
          return res.status(400).json({ error: `${k} is required` });
        }
      }

      // Upload image to Cloudinary if exists
      let imageUrl = '';
      const img = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;

      if (img && img.filepath) {
        const uploadRes = await cloudinary.v2.uploader.upload(img.filepath, {
          folder: 'schools',
          transformation: [{ width: 800, height: 600, crop: 'limit' }]
        });
        imageUrl = uploadRes.secure_url;
      }

      // Save to MySQL
      await query(
        'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, address, city, state, contact, imageUrl, email]
      );

      return res.status(201).json({ message: 'School saved', image: imageUrl });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Server error' });
    }
  });
}