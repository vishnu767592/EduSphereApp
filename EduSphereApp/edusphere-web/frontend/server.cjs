// EduSphere Web Application Server (CommonJS - Ultra Compatible)
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// In-memory data store for live demo functionality
const usersDB = [
  { id: 1, name: 'Sharath User', email: 'user@edusphere.com', password: 'password', role: 'USER' },
  { id: 2, name: 'EduSphere Admin', email: 'admin@edusphere.com', password: 'admin', role: 'ADMIN' }
];

const notesDB = [
  { id: 1, title: 'Welcome to EduSphere', content: 'Explore subjects, complete quizzes, and chat with AI Tutor.', createdAt: new Date().toISOString() }
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
};

// Helper: parse request JSON body
function getRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Helper: send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // -------------------------------------------------------------
  // REST API ROUTER (/api/*)
  // -------------------------------------------------------------
  if (pathname.startsWith('/api')) {
    // Healthcheck
    if (pathname === '/api/health') {
      return sendJson(res, 200, { status: 'UP', service: 'EduSphere Web Service', timestamp: new Date().toISOString() });
    }

    // Login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = await getRequestBody(req);
      const user = usersDB.find(u => u.email === email) || {
        id: Date.now(),
        name: email ? email.split('@')[0] : 'Learner',
        email: email || 'user@edusphere.com',
        role: 'USER'
      };
      const token = `edusphere_jwt_token_${user.id}_${Date.now()}`;
      return sendJson(res, 200, {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }

    // Register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const { name, email, password } = await getRequestBody(req);
      const newUser = { id: Date.now(), name: name || 'New User', email: email || 'user@edusphere.com', role: 'USER' };
      usersDB.push(newUser);
      const token = `edusphere_jwt_token_${newUser.id}_${Date.now()}`;
      return sendJson(res, 200, {
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }

    // Current User Profile (/api/auth/me)
    if (pathname === '/api/auth/me') {
      return sendJson(res, 200, { id: 1, name: 'Sharath User', email: 'user@edusphere.com', role: 'USER' });
    }

    // Progress Summary
    if (pathname === '/api/progress/summary') {
      return sendJson(res, 200, { completedLessons: 14, totalPoints: 580, streakDays: 7, certificatesCount: 3 });
    }

    // Progress Completions
    if (pathname === '/api/progress/completions') {
      return sendJson(res, 200, [1, 2, 3, 5, 8]);
    }

    // Progress Weekly
    if (pathname === '/api/progress/weekly') {
      return sendJson(res, 200, [
        { day: 'Mon', hours: 1.5 },
        { day: 'Tue', hours: 2.0 },
        { day: 'Wed', hours: 1.2 },
        { day: 'Thu', hours: 2.5 },
        { day: 'Fri', hours: 3.0 },
        { day: 'Sat', hours: 1.8 },
        { day: 'Sun', hours: 2.2 }
      ]);
    }

    // Progress Certificates
    if (pathname === '/api/progress/certificates') {
      return sendJson(res, 200, [
        { id: 'CERT-01', title: 'React Fundamentals Master', date: '2026-07-15' },
        { id: 'CERT-02', title: 'Full Stack Java Spring Boot', date: '2026-07-20' }
      ]);
    }

    // Progress Leaderboard
    if (pathname === '/api/progress/leaderboard') {
      return sendJson(res, 200, [
        { rank: 1, name: 'Sharath User', points: 580 },
        { rank: 2, name: 'Ananya Sharma', points: 540 },
        { rank: 3, name: 'Rahul Verma', points: 490 },
        { rank: 4, name: 'Priya Patel', points: 430 }
      ]);
    }

    // Notes API
    if (pathname === '/api/progress/notes') {
      if (req.method === 'POST') {
        const { title, content } = await getRequestBody(req);
        const newNote = { id: Date.now(), title: title || 'Untitled Note', content: content || '', createdAt: new Date().toISOString() };
        notesDB.push(newNote);
        return sendJson(res, 200, newNote);
      }
      return sendJson(res, 200, notesDB);
    }

    // AI Tutor Chat (/api/ai/chat)
    if (pathname === '/api/ai/chat' && req.method === 'POST') {
      const { message } = await getRequestBody(req);
      const reply = `I am your EduSphere AI Tutor. Regarding "${message || 'your request'}": Keep practicing core concepts, work on interactive quizzes, and track your daily learning streak!`;
      return sendJson(res, 200, { reply });
    }

    // AI Study Planner (/api/ai/planner)
    if (pathname === '/api/ai/planner') {
      return sendJson(res, 200, {
        schedule: [
          { day: 'Day 1', topic: 'Spring Boot Architecture & REST Endpoints', time: '45 mins' },
          { day: 'Day 2', topic: 'React State Management & Hooks', time: '60 mins' },
          { day: 'Day 3', topic: 'Database Normalization & JPA Repositories', time: '50 mins' }
        ]
      });
    }

    // Quiz Submission
    if (pathname === '/api/quiz/submit' && req.method === 'POST') {
      return sendJson(res, 200, { status: 'success', score: 100, pointsEarned: 50 });
    }

    // Admin Stats
    if (pathname === '/api/admin/stats') {
      return sendJson(res, 200, { totalUsers: 1240, activeCourses: 35, totalCompletions: 4890 });
    }

    // Fallback for any unhandled /api path
    return sendJson(res, 200, { message: 'API request processed successfully' });
  }

  // -------------------------------------------------------------
  // STATIC ASSETS & SPA ROUTING
  // -------------------------------------------------------------
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  filePath = filePath.split('?')[0];

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      filePath = path.join(DIST_DIR, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(parseInt(PORT), '0.0.0.0', () => {
  console.log(`EduSphere Web Application server running on http://0.0.0.0:${PORT}`);
});
