const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const functions = require('../backend/functions');

const app = express();

app.use(cors());
app.use(bodyParser.json());



//这里用的hard code, 参数（地址）需要从database拿
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
app.post('/createRecord/:hospitalId',async (req, res) =>{
    // Finding address and key of hospital by ID
    const findHospital = 'SELECT address, private_key FROM users WHERE id = ?'; // Replace 'id' with the appropriate column name for pet identification
    const userId = req.params.hospitalId; // Retrieve the petId from the query parameter 'id'
    const hospitalInfo = await pool.query(findHospital, [userId]);
    
    // 我们想从table里拿到 address和privatekey两个column里的数据
    const hospitalAddress = hospitalInfo[0];
    const privateKey = hospitalInfo[1];

    // 用hospital的密钥deploy合约
    const contractAddress = functions.deploy(privateKey);

    const {ownerId, petId, billAmount, recordId} = req.body;

    // Finding address of owner by ID
    const findOwner ='SELECT address FROM users WHERE id = ?';
    const ownerInfo = await pool.query(findOwner, [ownerId]);
    const ownerAddress = ownerInfo[0];

    // After getting all data from the chain, we have to insert 
    const result = functions.CreateMedicalRecord(
        contractAddress, hospitalAddress, privateKey,
        ownerId, petId, billAmount, recordId, ownerAddress
    );

    /* 
        到这里chain的储存已经ok了，但是还需要把东西存到数据库
    */
})


app.get('/setInsurance', (req,res) =>{
    const findInsurance = 'SELECT address, private_key FROM users WHERE id = ?'
})
  

app.listen(8080, () => console.log('API is running on http://localhost:8080'));