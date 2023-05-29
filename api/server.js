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
  database: 'pawprints'
});

const authenticateUser = (req, res, next) => {
  // Check if the user is authenticated (e.g., by validating the JWT)
  const token = req.headers.authorization.split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Verify and decode the JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user information to the request object
    req.id =  decoded.id;
    next();
  } catch (err) {
    console.error('Failed to decode the token: ', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
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
    const role = rows[0].type;
    const id = rows[0].id;

    if (!match) {
      return res.status(401).send({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    const payload = { email: user.email, id: user.id};

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send({ token, role});

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, userType, phoneNumber }  = req.body;

  // validate if email and password are provided
  if (!email || !password|| !firstName || !lastName || !userType || !phoneNumber) {
    return res.status(400).send({ error: 'Miss Fields' });
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
      'INSERT INTO users (username, email, password, first_name,last_name,type, phone_number) VALUES (?, ?, ?, ?, ?, ?,?)',
      ["",email, hashedPassword, firstName, lastName, userType, phoneNumber]

    );

    // create token payload
    const payload =  { email: email, id: result.insertId };

    // sign the token with secret
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });



    // send the token back to the client
    res.send({ token });

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/addpet', authenticateUser, async (req, res) => {
  try {
    const { name, species, colors, breed, gender, birthday, isNeutered, insuranceProvider, weight, ownerId } = req.body;
    const query = `
      INSERT INTO pets (owner_id, name, species, breed, gender, color, birthday, is_neutered, weight, insurance_provider)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [req.id, name, species.toUpperCase(), breed, gender, colors, birthday, isNeutered, weight, insuranceProvider];

    const results = await pool.query(query, params);

    res.json({ message: 'Pet added successfully!', results:results}); // Include the petId in the response

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getuser',authenticateUser, async (req, res) => {
  try {
    // Assuming you have a pets table in your database

    // Query to retrieve the pet data from the database
    const query = 'SELECT * FROM users WHERE id = ?'; // Replace 'id' with the appropriate column name for pet identification
    const userId = req.id; // Retrieve the petId from the query parameter 'id'

    // Execute the query
    const results = await pool.query(query, [userId]);

    if (results.length === 0) {
      // No pet found with the provided ID
      res.status(404).json({ error: 'Pet not found' });
      return;
    } 
    const petData = results[0]; // Assuming only one pet is returned with the provided ID

    res.json(petData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/getpet', async (req, res) => {
  try {
    // Assuming you have a pets table in your database

    // Query to retrieve the pet data from the database
    const query = 'SELECT * FROM pets WHERE id = ?'; // Replace 'id' with the appropriate column name for pet identification
    const petId = req.query.id; // Retrieve the petId from the query parameter 'id'

    // Execute the query
    const results = await pool.query(query, [petId]);

    if (results.length === 0) {
      // No pet found with the provided ID
      res.status(404).json({ error: 'Pet not found' });
      return;
    }

    const petData = results[0]; // Assuming only one pet is returned with the provided ID

    res.json(petData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getpets',authenticateUser, async (req, res) => {
  try {
    // Assuming you have a pets table in your database
    const userId = req.id;
    // Query to retrieve the list of pets from the database
    const query = 'SELECT * FROM pets WHERE owner_id = ?'; // Replace 'pets' with the actual table name in your database

    // Execute the query
    const results = await pool.query(query,[userId]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/share-pet', (req, res) => {
  // Assuming the user ID is coming in the request body for simplicity
  const petId = req.body.petId;
  const token = jwt.sign({id: petId }, process.env.JWT_SECRET, { expiresIn: '30m' });
  // Return the generated token
  res.json({ token });
});

app.post('/verify-pet', (req, res) => {
  // Assuming the token is coming in the request body for simplicity
  const token = req.body.token;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // The decoded object will contain the pet ID and the iat (issued at) and exp (expires) timestamps.
      // Here, we're just sending the decoded object back to the client, but you could use the user ID to
      // look up additional information in your database if necessary.
      res.json({ decoded });
  } catch (err) {
      // If the token is not valid or has expired, jwt.verify will throw an error
      console.error('Failed to verify token', err);
      res.sendStatus(401); // Send a 401 Unauthorized response
  }
});


app.listen(8080, () => console.log('API is running on http://localhost:8080'));
