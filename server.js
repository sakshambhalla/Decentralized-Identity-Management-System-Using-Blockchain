
const express = require('express');
const uniqid = require('uniqid');
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
var wallet = web3.eth.accounts.privateKeyToAccount('0x511853cf9946a28c62596cb67b97826312d333446a2ccde1bcf9881cfc74ba20');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'jF7TyOzUEa',
  password : 'NEemBqzDZI',
  database : 'jF7TyOzUEa'
});

connection.connect();
app.post('/', function(req, res){
     var details = req.body.jsonObject;
     details.identity = uniqid();
     console.log(details)
    connection.query(`Create table if not exists UserIdentity(
        Identity varchar(100) PRIMARY KEY,
        FirstName varchar(30),
        LastName varchar(30),
        PhoneNumber varchar(40),
        AadharNumber varchar(20),
        Email varchar(100),
        Age varchar(50)
        );`, (err, data) => {
            if(err) throw err;
            else{
                connection.query(`Insert into UserIdentity(Identity,FirstName,LastName,PhoneNumber,AadharNumber,Email,Age) values('${details.identity}', '${details.fn}','${details.ln}','${details.phone}','${details.aadhar}','${details.mail}','${details.age}');`, function(err,data){
                    if(err) throw err;
                    else res.status(200).send({identity:details.identity})
                    });
            }
        });         
})

function fn(details,data){
    return new Promise((resolve, reject)=>{
        if(details.fn){
            if(details.fn == data.FirstName)
            resolve()
            else
            reject("invalid firstname")
        }
        else
        resolve()    
    })
}
function ln(details,data){
    return new Promise((resolve, reject) => {
        if(details.ln){
            if(details.ln == data.LastName)
            resolve()
            else
            reject("invalid lastname");
        }
        else
        resolve();    
    })
    }
function mail(details,data){
    return new Promise((resolve, reject) => {
        if(details.mail){
            if(details.mail == data.Email)
            resolve()
            else
            reject("invalid mail");
        }
        else
        resolve();    
    })
}
function phone(details,data){
    return new Promise((resolve, reject) => {
        if(details.phone){
            if(details.phone == data.PhoneNumber)
            resolve()
            else 
            reject("invalid phone number");
        }
        else
        resolve();
    })
}
function aadhar(details,data){
    return new Promise((resolve, reject) => {
        if(details.aadhar){
            if(details.aadhar == data.AadharNumber)
            resolve()
            else
            reject("invalid aadhar number");
        }
        else
        resolve();
    })
}
function age(details,data){
    return new Promise((resolve, reject) => {
        if(details.age){
            if(details.age == data.Age)
            resolve()
            else
            reject("invalid age")
        }
        else 
        resolve();
    })
}

// async function signData(details){
//     return new Promise((resolve, reject) => {
       
//         resolve(x)
//     })
// }

app.post('/authenticate',upload.none(), (req, res) => {
    var details = {};
    details.identity = req.body.jsonObject.identity;
    if(req.body.jsonObject.fn != '')
    details.fn = req.body.jsonObject.fn;
    
    if(req.body.jsonObject.ln != '')
    details.ln = req.body.jsonObject.ln;
    
    if(req.body.jsonObject.age != '')
    details.age = req.body.jsonObject.age;
    
    if(req.body.jsonObject.aadhar != '')
    details.aadhar = req.body.jsonObject.aadhar;
    
    if(req.body.jsonObject.mail != '')
    details.mail = req.body.jsonObject.mail;
    
    if(req.body.jsonObject.phone != '')
    details.phone = req.body.jsonObject.phone;
    connection.query(`Select * from UserIdentity where Identity='${details.identity}'`, (err, data) => {
        if(err)throw err;
        else{
           fn(details,data[0])
           .then( () => {return ln(details,data[0])})
           .then( () => {return mail(details,data[0])})
           .then( () => {return phone(details,data[0])})
           .then( () => {return aadhar(details,data[0])})
           .then( () => {return age(details,data[0])})
           .then( () => {
               var signedResponse = { 
                   data: details,
                   UserPublicKey: req.body.jsonObject.UserPublicKey
               }
               res.status(200).send(web3.eth.accounts.sign(JSON.stringify(signedResponse), wallet.privateKey));
            })
           .catch((err) => {res.status(400).send({message:err})})
        }
    });
})

app.listen(8002, (err) => {
    console.log(`Server is running on port 8002`);
});