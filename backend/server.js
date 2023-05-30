const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const functions = require('./functions');


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
  const { Address, privatekey } = await functions.CreateAccount();


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
      'INSERT INTO users (username, email, password, first_name,last_name, type, phone_number, address, private_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ["",email, hashedPassword, firstName, lastName, userType, phoneNumber, Address, privatekey]

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

    // Query to retrieve the pet data from the database
    const query = 'SELECT * FROM users WHERE id = ?';
    const userId = req.id; // Retrieve the petId from the query parameter 'id'

    // Execute the query
    const results = await pool.query(query, [userId]);

    if (results.length === 0) {
      // No pet found with the provided ID
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    const userData = results[0][0];

    res.json(userData);
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

app.get('/getpetbyhospital',authenticateUser, async (req, res) => {
  const hospitalId = req.id;
  try {
    const query = 'SELECT * FROM pets WHERE hospital_id = ?'; // Replace 'id' with the appropriate column name for pet identification
    const results = await pool.query(query, [hospitalId]);
    const query2 = 'SELECT first_name, last_name FROM users WHERE id = ?'; // Replace 'id' with the appropriate column name for pet identification
    //for each pet, get the owner name, use map or foreach
    for (let i = 0; i < results[0].length; i++) {
      const ownerId = results[0][i].owner_id;
      const names = await pool.query(query2, [ownerId]);
      results[0][i].owner_name = names[0][0].first_name + " " + names[0][0].last_name;
    }
    res.json(results[0]);
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

    res.json(results[0]);
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

app.get('/getPetToken/:petId', (req, res) => {
  const petId = req.params.petId;

  const token = jwt.sign({ petId }, process.env.JWT_SECRET, { expiresIn: '30m' });

  res.json({ token });
});

app.put('/verifyPetToken',authenticateUser,(req, res) => {
  const { petToken, name } = req.body;
  const id = req.id;

  // Verify and decode the token
  let decoded;
  try {
      decoded = jwt.verify(petToken, process.env.JWT_SECRET);
  } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
  }


  const { petId } = decoded;
  const sql = `UPDATE pets SET staff_name = ?, hospital_id = ? WHERE id = ?`;
  pool.query(sql, [name, id, petId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ message: 'Record updated successfully.' });
    }
  });

  // Do something with the petId and name...

  res.status(200).json({ petId });
});

app.get('/viewMedRecord', (req, res) =>{
  const result = functions.ViewMedicalRecord("0x83b4f166e1ea0f04238f0a7a0347275895cac0d0");
  const resolved = result.then((resolvedData) => {
      console.log("Getting the record: ", resolvedData);
      res.json({
          ownerId: resolvedData.ownerId,
          petId:resolvedData.petId,
          billAmount:resolvedData.billAmount,
          recordId:resolvedData.recordId
       });
  });
})


// 这里需要从数据库，通过前端传进来的hospital的id,在数据库里
// 找到对应的账户地址和密钥
// record具体内容通过前端，同时记录在chain和数据库中
  // 数据库储存具体信息，chain储存id
  //
app.post('/createRecord',authenticateUser,async (req, res) =>{
  // Finding address and key of hospital by ID
  const findHospital = 'SELECT address, private_key FROM users WHERE id = ?'; // Replace 'id' with the appropriate column name for pet identification
  const hospitalId = req.id; // Retrieve the petId from the query parameter 'id'
  const hospitalInfo = await pool.query(findHospital, [hospitalId]);

  // 我们想从table里拿到 address和privatekey两个column里的数据
  const {address, private_key} = hospitalInfo[0][0];

  // 用hospital的密钥deploy合约
  const contractAddress = await functions.deploy(private_key);

  const {petId, visitedDate, diagnosis, procedure, prescription, procedureFee, medicationFee, notes, title } = req.body;
  console.log(title)

  //Find owner id by pet id
  try {
  const findOwnerByPet = 'SELECT owner_id FROM pets WHERE id = ?';
  const petInfo = await pool.query(findOwnerByPet, [petId]);
  const ownerId = petInfo[0][0].owner_id;


  // Finding address of owner by ID
  const findOwner ='SELECT address FROM users WHERE id = ?';
  const ownerInfo = await pool.query(findOwner, [ownerId]);
  const ownerAddress = ownerInfo[0][0].address;
  const billAmount = procedureFee + medicationFee;
  const [rows] = await pool.query(
    `INSERT INTO medical_records (pet_id, hospital_id, visited_date, diagnosis, medical_procedure, prescription, procedure_fee, medication_fee, notes, title)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [parseInt(petId), hospitalId, visitedDate, diagnosis, procedure, prescription, parseInt(procedureFee), parseInt(medicationFee), notes, title]
  );
  const hash = functions.createHash(petId, hospitalId, visitedDate, diagnosis, procedure, prescription, procedureFee, medicationFee);
  const recordId = rows.insertId;
  console.log(contractAddress, address, private_key, ownerId, petId, billAmount, recordId, ownerAddress, "0x"+hash)
  const transactionHash = await functions.CreateMedicalRecord(
    contractAddress, address, private_key,
    ownerId, petId, billAmount, recordId, ownerAddress, "0x"+hash
  );
  const sql = `UPDATE medical_records SET transaction_hash = ? WHERE id = ?`;
  pool.query(sql, [transactionHash, recordId]);
  res.status(200).json({ message: 'Record created successfully', recordId: recordId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }

  // After getting all data from the chain, we have to insert



})


app.get('/setInsurance', (req,res) =>{
  const findInsurance = 'SELECT address, private_key FROM users WHERE id = ?'
})

app.get('/getrecord/:recordId',authenticateUser, async (req, res) => {
  const recordId = req.params.recordId;
  try{
    const data = await pool.query('SELECT * FROM medical_records WHERE id = ?', [recordId]);
    res.json(data[0][0]);
  }
  catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving data.' });
  }
});

app.get('/getrecords/:petId',authenticateUser, async (req, res) => {
  const petId = req.params.petId;

  try {
    const [rows] = await pool.query('SELECT * FROM medical_records WHERE pet_id = ?', [petId]);
    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: 'An error occurred when retrieving data.' });
  }
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));
