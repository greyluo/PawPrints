const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'users'
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: 'Missing email or password' });
  }

  // Check if the email format is correct
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).send({ error: 'Invalid email format' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    // Compare the hashed password in DB with the password provided by user
    const match = await bcrypt.compare(password, rows[0].password);

    if (!match) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    const payload = { email: user.email, id: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({ token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // validate if email and password are provided
  if (!email || !password) {
    return res.status(400).send({ error: 'Email and Password are required.' });
  }

  try {
    // check if user already exists
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length) {
      return res.status(409).send({ error: 'User already exists.' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert new user into the database
    const [result] = await pool.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    // create token payload
    const payload = { email: email, id: result.insertId };

    // sign the token with secret
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // send the token back to the client
    res.send({ token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));
