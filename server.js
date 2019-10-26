const express = require('express');
const route = require('express').Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const app = express();  
const multer = require('multer');
var upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

var web3 = new Web3('HTTP://127.0.0.1:7545');
var wallet = web3.eth.accounts.create();
// console.log(wallet);
// var publicKey = wallet.address;
// var pr
var details;

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'jF7TyOzUEa',
  password : 'NEemBqzDZI',
  database : 'jF7TyOzUEa'
});

connection.connect();
app.post('/', function(req, res){
     details = req.body;
    connection.query(`Create table if not exists UserIdentity(
        FirstName varchar(30),
        LastName varchar(30),
        PhoneNumber varchar(40),
        AadharNumber varchar(20),
        Email varchar(100),
        Age varchar(5)
        );`, function(err, data){if(err)throw err}); 
    connection.query(`Insert into UserIdentity(FirstName,LastName,PhoneNumber,AadharNumber,Email,Age) values('${details.fn}','${details.ln}','${details.phone}','${details.aadhar}','${details.mail}','${details.age}');`, function(err,data){
    if(err) throw err;
    });        
    res.sendStatus(200);
})

app.post('/authenticate',upload.none(), (req, res) => {
    console.log(req.body);
    connection.query('Select * from UserIdentity ', (err, data) => {

    });
})

app.listen(8002, (err) => {
    console.log(`Server is running on port 8002`);
});