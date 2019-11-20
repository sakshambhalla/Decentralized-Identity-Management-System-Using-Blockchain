import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Digital_Identity from '../abis/Digital_Identity.json';
import Navbar from './Navbar';
import Main from './Main';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts(); 
    this.setState({ account: accounts[0] });
    window.ethereum.on('accountsChanged', (accounts) => {
      this.setState({ account: accounts[0] });
    });
    const networkId = await web3.eth.net.getId();
    const networkData = Digital_Identity.networks[networkId];
    if(networkData) {
      const identity = web3.eth.Contract(Digital_Identity.abi, networkData.address);
      this.setState({ identity });
      this.setState({ loading: false });
    } else {
      window.alert('Digital Identity contract not deployed to detect network.');
    }
  }

async fn(details,data){
  return new Promise((resolve, reject)=>{
      if(details.fn){
          if(details.fn === data.fn)
          resolve()
          else
          reject("invalid firstname")
      }
      else
      resolve()    
  })
}
async ln(details,data){
  return new Promise((resolve, reject) => {
      if(details.ln){
          if(details.ln === data.ln)
          resolve()
          else
          reject("invalid lastname");
      }
      else
      resolve();    
  })
  }
async mail(details,data){
  return new Promise((resolve, reject) => {
      if(details.mail){
          if(details.mail === data.mail)
          resolve()
          else
          reject("invalid mail");
      }
      else
      resolve();    
  })
}
async phone(details,data){
  return new Promise((resolve, reject) => {
      if(details.phone){
          if(details.phone === data.phone)
          resolve()
          else 
          reject("invalid phone number");
      }
      else
      resolve();
  })
}
async aadhar(details,data){
  return new Promise((resolve, reject) => {
      if(details.aadhar){
          if(details.aadhar === data.aadhar)
          resolve()
          else
          reject("invalid aadhar number");
      }
      else
      resolve();
  })
}
async age(details,data){
  return new Promise((resolve, reject) => {
      if(details.age){
          if(details.age === data.age)
          resolve()
          else
          reject("invalid age")
      }
      else 
      resolve();
  })
}

  verify(res) {
    let verify = window.web3.eth.accounts.recover(res);
    let auth = '0x42BA89C26397348bD326932e43beF5Be0f2a0072';
    if(auth !== verify) {
      window.alert("Authentication Failed!\nPlease Try Again...");
      return false;
    }
    return true;
  }

  async retrieveIdentity(publicKey) {
    //this.setState({loading: true});
    try {
      const did = await this.state.identity.methods.identities(publicKey).call();
      this.setState({loading: false});
      let data = await ipfs.get(did.contentAddress);
      let d = JSON.parse(data[0].content.toString())
      if(this.verify(d)) {
        let data = JSON.parse(d.message);
        let str = "DID: " + data.UserPublicKey + "\n";
        for(let key in data.data) {
          str += key +": " + data.data[key] + "\n";
        }
        window.alert("Identity Retrieved and Verified Successfully...\n" + str);
      }
    } catch(err) {
      this.setState({loading: false});
      window.alert("Invalid Digital Identity");
    }
  }
  async verifierEntity(verifierData){
    //this.setState({loading: true});
    const did = await this.state.identity.methods.identities(verifierData.publicKey).call();
    this.setState({loading: false});
    if(did.contentAddress) {
      let data = await ipfs.get(did.contentAddress);
      let d = JSON.parse(data[0].content.toString())
      if(this.verify(d)) {
        let data = JSON.parse(d.message);

        var details = {};
    details.publicKey = verifierData.publicKey;
    if(verifierData.fn !== '')
    details.fn = verifierData.fn;
    
    if(verifierData.ln !== '')
    details.ln = verifierData.ln;
    
    if(verifierData.age !== '')
    details.age = verifierData.age;
    
    if(verifierData.aadhar !== '')
    details.aadhar = verifierData.aadhar;
    
    if(verifierData.mail !== '')
    details.mail = verifierData.mail;
    
    if(verifierData.phone !== '')
    details.phone = verifierData.phone;
    console.log(data);

    this.fn(details,data.data)
    .then( () => {return this.ln(details,data.data)})
    .then( () => {return this.mail(details,data.data)})
    .then( () => {return this.phone(details,data.data)})
    .then( () => {return this.aadhar(details,data.data)})
    .then( () => {return this.age(details,data.data)})
    .then( () => {  window.alert("Identity Verified Successfully...\n");})
    .catch((error) => {window.alert(error)})
      }
    } else {
      window.alert("Invalid Digital Signature");
    }
  }

  async addIPFS(res){
    if(this.verify(res)) {
      var buf = Buffer.from(JSON.stringify(res));
      ipfs.add(buf,async (error,result) => {
        if(error) {
          return;
        }
        this.state.identity.methods.createIdentity(result[0].hash).send({ from: this.state.account });
        console.log(this.state.account);
        window.alert("Digital Identity Created Successfully...\nDID: " + this.state.account);
      });
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      identityCount: 0,
      loading: true
    }

    this.retrieveIdentity = this.retrieveIdentity.bind(this);
    this.addIPFS = this.addIPFS.bind(this);
    this.verifierEntity = this.verifierEntity.bind(this);
  }
  
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <Navbar account={this.state.account} />
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {
                this.state.loading 
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                : <Main
                  did={this.state.did}
                  retrieveIdentity={this.retrieveIdentity}
                  verifierEntity={this.verifierEntity}
                  publicKey = {this.state.account}
                  addIPFS = {this.addIPFS}
                  />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
