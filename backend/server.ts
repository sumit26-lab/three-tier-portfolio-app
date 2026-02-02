

import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { authenticateAdmin} from './middelware/authMiddleware';
import {generateToken} from './utils/auth'
import dotenv from 'dotenv';
import { upload } from './utils/cloudinary';
import { Resend } from 'resend';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 2. URL encoded data ki limit badhayein
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MySQL Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin_password',
  database: process.env.DB_NAME || 'news_db'
});
db.getConnection()
  .then(() => console.log("✅ Connected to MySQL Database"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));
// --- AUTH API ---

app.post('/api/login', async (req: Request, res: Response) => {
  console.log(req.body)
  const { username, password } = req.body;
  try {
    const [rows]: any = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    // Simple password check (Production mein bcrypt.compare use karein)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token, message: "Login Successful!" });
  } catch (err) {
    res.status(500).json({ error: "Login system down hai" });
  }
});

// --- PUBLIC APIs (No Token Required) ---

app.get('/api/articles', async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// app.get('/api/articles/:slug', async (req: Request, res: Response) => {
//   try {
//     const [rows]: any = await db.query('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
//     res.json(rows[0] || { message: "Not found" });
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// --- PROTECTED ADMIN APIs (Token Required) ---

app.get('/api/admin/articles', authenticateAdmin, async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles ORDER BY id DESC');
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/articles', authenticateAdmin, upload.single('image'), async (req: any, res: Response) => {
  const { title, slug, summary, content, category, tags } = req.body;
  
  // Cloudinary image URL yahan milega
  const imageUrl = req.file ? req.file.path : null; 

  if (!title || !slug) {
    return res.status(400).json({ message: "Title and Slug are required!" });
  }

  try {
    const sql = `INSERT INTO articles (title, slug, summary, content, category, tags, coverImage) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.query(sql, [
      title, 
      slug, 
      summary, 
      content, 
      category, 
      JSON.stringify(tags || []), 
      imageUrl 
    ]);
    
    res.status(201).json({ 
      message: "Article created on Cloudinary!", 
      url: imageUrl 
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.patch('/api/admin/articles/:id', authenticateAdmin, upload.single('image'), async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, slug, summary, content, category, tags } = req.body;
  
  try {
    // 1. Pehle check karo ki article exist karta hai ya nahi
    const [rows]: any = await db.query('SELECT coverImage FROM articles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Article not found!" });
    }

    // 2. Agar nayi image upload hui hai toh naya URL lo, warna purana hi rehne do
    const imageUrl = req.file ? req.file.path : rows[0].coverImage;

    // 3. Database update query
    const sql = `
      UPDATE articles 
      SET title = ?, slug = ?, summary = ?, content = ?, category = ?, tags = ?, coverImage = ?
      WHERE id = ?
    `;
    
    await db.query(sql, [
      title, 
      slug, 
      summary, 
      content, 
      category, 
      JSON.stringify(tags || []), 
      imageUrl, 
      id
    ]);

    res.json({ 
      message: "Article updated successfully!", 
      updatedImageUrl: imageUrl 
    });

  } catch (err: any) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete Article
app.delete('/api/admin/articles/:id', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    await db.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.json({ message: "Article Deleted!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Categories list fetch karne ke liye
app.get('/api/categories', async (_req, res) => {
  try {
    const [rows]: any = await db.query('SELECT DISTINCT category FROM articles WHERE category IS NOT NULL');
    res.json(rows.map((r: any) => r.category));
  } catch (err) {
    res.status(500).json([]);
  }
});

// Tags list fetch karne ke liye
app.get('/api/tags', async (_req, res) => {
  try {
    // MySQL mein JSON tags se unique list nikalna thoda complex hai, 
    // toh hum manually filter kar rahe hain simple rakhte hue
    const [rows]: any = await db.query('SELECT tags FROM articles');
    const allTags = new Set();
    rows.forEach((row: any) => {
      const tags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
      if (Array.isArray(tags)) tags.forEach(t => allTags.add(t));
    });
    res.json(Array.from(allTags));
  } catch (err) {
    res.status(500).json([]);
  }
})

// 🔍 Fetch single article by ID (Edit form ke liye zaroori hai)
// app.get('/api/articles/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     // Agar id number hai toh ID se dhoondo, warna slug se (safe side)
//     const query = isNaN(Number(id)) 
//       ? 'SELECT * FROM articles WHERE slug = ?' 
//       : 'SELECT * FROM articles WHERE id = ?';
      
//     const [rows]: any = await db.query(query, [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Article nahi mila!" });
//     }
    
//     res.json(rows[0]); // ✅ Frontend ko pura article object mil jayega
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });
 //new code number of view on articles
 // 🔍 Fetch single article + increment views
app.get('/api/articles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1️⃣ Find article
    const query = isNaN(Number(id))
      ? 'SELECT * FROM articles WHERE slug = ?'
      : 'SELECT * FROM articles WHERE id = ?';

    const [rows]: any = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Article is not Found" });
    }

    const article = rows[0];

    // 2️⃣ Increment views
    await db.query(
      'UPDATE articles SET views = views + 1 WHERE id = ?',
      [article.id]
    );

    // 3️⃣ Return article (views + 1)
    article.views += 1;

    res.json(article);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET hero (public)
app.get('/api/hero', async (_req, res) => {
  try {
    const [rows]: any = await db.query('SELECT * FROM hero LIMIT 1');
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// CHANGE PASSWORD (ADMIN ONLY)
// ===============================
app.put('/api/admin/change-password', authenticateAdmin, async (req: any, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const userId = req.user.id; // middleware se milta hai

    const [rows]: any = await db.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    const user = rows[0];

    // ❌ wrong old password
    if (!user || user.password !== oldPassword) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    // ✅ update password
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


app.put('/api/admin/hero', authenticateAdmin, (req, res) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err) {
      // FORCED LOGGING: This will print the full JSON structure of the error
      console.log("❌ UPLOAD ERROR DETECTED:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      return res.status(400).json({ message: "Upload failed", details: err.message });
    }

    try {
      const { name, title, description, phone, email, location } = req.body;
      const [rows]: any = await db.query('SELECT profileImage, resumeUrl FROM hero WHERE id = 1');
      const current = rows[0] || {};

      const profileImage = req.files?.['image']?.[0]?.path || current.profileImage;
      const resumeUrl = req.files?.['resume']?.[0]?.path || current.resumeUrl;

      await db.query(
        `UPDATE hero SET name=?, title=?, description=?, phone=?, email=?, location=?, profileImage=?, resumeUrl=? WHERE id=1`,
        [name, title, description, phone, email, location, profileImage, resumeUrl]
      );

      res.json({ success: true });
    } catch (dbErr: any) {
      console.log("❌ DB ERROR:", JSON.stringify(dbErr, Object.getOwnPropertyNames(dbErr), 2));
      res.status(500).json({ message: "DB Error" });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});