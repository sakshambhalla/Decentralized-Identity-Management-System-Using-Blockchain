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
    //await this.createIdentity('Vinay', 21);
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
    const networkId = await web3.eth.net.getId();
    const networkData = Digital_Identity.networks[networkId];
    if(networkData) {
      const identity = web3.eth.Contract(Digital_Identity.abi, networkData.address);
      this.setState({ identity });
      // const identityCount = await identity.methods.identityCount().call();
      // this.setState({ identityCount });
      this.setState({ loading: false });
      // if(identityCount)
      //   console.log(identityCount.toNumber());
    } else {
      window.alert('Digital Identity contract not deployed to detect network.');
    }
  }

  // async createIdentity (name, age) {
  //   this.setState({ loading: true });
  //   this.state.identity.methods.createIdentity(name, age).send({ from: this.state.account });
  //   this.setState({loading: false});
  // }

  async retrieveIdentity() {
    this.setState({loading: true});
    const did = await this.state.identity.methods.identities(this.state.account).call();
    this.setState({loading: false});
    console.log(did);
    let data = await ipfs.get(did.contentAddress);
    let d = JSON.parse(data[0].content.toString())
    //console.log(d);
    console.log("data: ", JSON.parse(d.message));
    console.log("signature: ", d.signature);
  }

  async addIPFS(res){
    var buf = Buffer.from(JSON.stringify(res));
    ipfs.add(buf,async (error,result) => {
      if(error) {
        return;
      }
      console.log(result[0].hash);
      console.log(this.state.identity);
      this.state.identity.methods.createIdentity(result[0].hash).send({ from: this.state.account });
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      identityCount: 0,
      loading: true
    }

    //this.createIdentity = this.createIdentity.bind(this);
    this.retrieveIdentity = this.retrieveIdentity.bind(this);
    this.addIPFS = this.addIPFS.bind(this);
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
                  // createIdentity={this.createIdentity}
                  retrieveIdentity={this.retrieveIdentity}
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
