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
     details = req.body.jsonObject;
     console.log(details)
    connection.query(`Create table if not exists UserIdentity(
        PublicKey varchar(100) PRIMARY KEY,
        FirstName varchar(30),
        LastName varchar(30),
        PhoneNumber varchar(40),
        AadharNumber varchar(20),
        Email varchar(100),
        Age varchar(50)
        );`, (err, data) => {
            if(err) throw err;
            else{
                connection.query(`Insert into UserIdentity(PublicKey,FirstName,LastName,PhoneNumber,AadharNumber,Email,Age) values('${details.publicKey}', '${details.fn}','${details.ln}','${details.phone}','${details.aadhar}','${details.mail}','${details.age}');`, function(err,data){
                    if(err) throw err;
                    else res.sendStatus(200)
                    });
            }
        });         
})

function fn(details,data){
    return new Promise((resolve, reject)=>{
        if(details.fn!=''){
            if(details.fn == data.FirstName)
            resolve()
            else
            reject()
        }
        else
        resolve()    
    })
}
function ln(details,data){
    return new Promise((resolve, reject) => {
        if(details.ln!=''){
            if(details.ln == data.LastName)
            resolve()
            else
            reject();
        }
        else
        resolve();    
    })
    }
function mail(details,data){
    return new Promise((resolve, reject) => {
        if(details.mail!= '' ){
            if(details.mail == data.Email)
            resolve()
            else
            reject();
        }
        else
        resolve();    
    })
}
function phone(details,data){
    return new Promise((resolve, reject) => {
        if(details.phone!= ''){
            if(details.phone == data.PhoneNumber)
            resolve()
            else 
            reject();
        }
        else
        resolve();
    })
}
function aadhar(details,data){
    return new Promise((resolve, reject) => {
        if(details.aadhar!=''){
            if(details.aadhar == data.AadharNumber)
            resolve()
            else
            reject();
        }
        else
        resolve();
    })
}
function age(details,data){
    return new Promise((resolve, reject) => {
        if(details.age!= ''){
            if(details.age == data.Age)
            resolve()
            else
            reject()
        }
        else 
        resolve();
    })
}

app.post('/authenticate',upload.none(), (req, res) => {
    const details = req.body.jsonObject;
    connection.query(`Select * from UserIdentity where PublicKey='${details.publicKey}'`, (err, data) => {
        if(err)throw err;
        else{
           fn(details,data[0])
           .then( () => {return ln(details,data[0])})
           .then( () => {return mail(details,data[0])})
           .then( () => {return phone(details,data[0])})
           .then( () => {return aadhar(details,data[0])})
           .then( () => {return age(details,data[0])})
           .then( () => {console.log("SUCCESS NIGGA")})
           .catch( () => {console.log('FAILURE NIGGA')})
        }
    });
    res.sendStatus(200);
})

app.listen(8002, (err) => {
    console.log(`Server is running on port 8002`);
});