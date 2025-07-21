const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../database/db');
const JWT_SECRET = 'yourSuperSecretKey';


router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Username already taken.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
      username,
      hashedPassword,
      role,
    ]);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    if(user.role !== "admin"){
        return res.status(401).json({ message: 'Invalid user role' });

    }


    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '4h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 4 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
