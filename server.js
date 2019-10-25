const express = require('express');
const route = require('express').Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'jF7TyOzUEa',
  password : 'NEemBqzDZI',
  database : 'jF7TyOzUEa'
});

connection.connect();
route.post('/', function(req, res){
    var details = req.body.details;
    connection.query(`Create table if not exists UserIdentity(
        id int primary key AUTO_INCREMENT,
        FirstName varchar(30),
        LastName varchar(30),
        PhoneNumber varchar(40),
        AadharNumber varchar(20),
        Email varchar(100),
        ); 
        Insert into UserIdentity(FirstName,LastName,PhoneNumber,AadharNumber,Email) values('${details.firstname}','${details.lastname}','${details.PhoneNumber}','${details.AadharNumber}','${details.Email}');`, function(err,data){
    if(err) throw err;
    });
        
})

app.listen(8000, (err) => {
    console.log(`Server is running on port 8000`);
});