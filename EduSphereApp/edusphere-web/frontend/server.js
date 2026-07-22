import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ─── Mock API Routes (proper JSON responses) ───────────────────
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};
  res.json({
    token: 'edusphere_jwt_token_' + Date.now(),
    user: {
      id: Date.now(),
      name: email ? email.split('@')[0] : 'Learner',
      email: email || 'user@edusphere.com',
      role: email && email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email } = req.body || {};
  res.json({
    token: 'edusphere_jwt_token_' + Date.now(),
    user: {
      id: Date.now(),
      name: name || 'Learner',
      email: email || 'user@edusphere.com',
      role: 'USER'
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ id: 1, name: 'EduSphere User', email: 'user@edusphere.com', role: 'USER' });
});

app.get('/api/progress/summary', (req, res) => {
  res.json({ completedLessons: 14, totalPoints: 580, streakDays: 7, certificatesCount: 3 });
});

app.get('/api/progress/completions', (req, res) => res.json([]));
app.get('/api/progress/weekly', (req, res) => res.json([]));
app.get('/api/progress/certificates', (req, res) => res.json([]));
app.get('/api/progress/leaderboard', (req, res) => res.json([]));
app.get('/api/progress/bookmarks', (req, res) => res.json([]));
app.get('/api/progress/notes', (req, res) => res.json([]));
app.get('/api/notes', (req, res) => res.json([]));

app.post('/api/ai/chat', (req, res) => {
  res.json({ reply: "I am your EduSphere AI Tutor. How can I help you master your subjects today?" });
});

app.post('/api/ai/planner', (req, res) => {
  res.json({ schedule: [{ day: 'Day 1', topic: 'Core Science Concepts', time: '45 mins' }] });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({ totalUsers: 1240, activeCourses: 35, totalCompletions: 4890 });
});

app.get('/api/admin/users', (req, res) => res.json([]));

// Catch-all for any other /api routes
app.all('/api/*', (req, res) => {
  res.json({ status: 'success' });
});

// ─── Serve static frontend ─────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`EduSphere server running on port ${PORT}`);
});
