import React, { Component } from 'react';
import Web3 from 'web3';
import stringify from 'json-stringify-safe'
class Main extends Component {

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
    const web3 = window.web3.eth;
    return web3;
  }

  render() {
    return (
      <div id="content">
        <div id="create">
          <h1>Create Identity</h1>
          <form onSubmit={async (event) => {
            event.preventDefault();
            const name = this.name.value;
            const age = this.age.value - 0;
            await this.props.createIdentity(name, age);
            this.name.value = '';
            this.age.value = 0;
          }}>
            <div className="form-group mr-sm-2">
              <input id="name" type="text" ref={(input) => {this.name = input}}
                className="form-control" placeholder="Name" required />
            </div>
            <div className="form-group mr-sm-2">
              <input id="age" type="number" ref={(input) => {this.age = input}} 
                className="form-control" placeholder="Age" required />
            </div>
            <button type="submit" className="btn btn-primary">Genereate digital Identity</button>
          </form>
        </div>
        <hr />
        <div id="retrieve">
          <h1>Retrieve Identity</h1>
          <form onSubmit={async (event) => {
            event.preventDefault();
            const id = parseInt(this.id.value);
            await this.props.retrieveIdentity(id);
            //console.log(this.props.did);
            //this.id.value = '';
          }}>
            <div className="form-group mr-sm-2">
              <input id="id" type="number" ref={(input) => {this.id = input}}
                className="form-control" placeholder="Digital Identity" required />
            </div>
            <button type="submit" className="btn btn-primary">Retrieve Identity Information</button>
          </form>
        </div>
        <div id="add">
          <h1>Add Identity to the authority </h1>
          <form action="http://localhost:8001/" method="POST" onSubmit={async(event) => {
            await this.loadWeb3();
            var data = await this.loadBlockchainData();
            var c =await data.getAccounts();
            fetch('http://localhost:8001/add', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({account:c[0]})
              }).then(res=>{})
                .then(res => console.log(res));
          }}>
            <div className="form-group mr-sm-2">
              <input name="fn" type="text" className="form-control" placeholder="firstname" required />
              <input name="ln" type="text" className="form-control" placeholder="lastname" required />
              <input name="phone" type="number" className="form-control" placeholder="Phone number" required />
              <input name="age" type="number" className="form-control" placeholder="Age" required />
              <input name="mail" type="email" className="form-control" placeholder="Email" required />
              <input name="aadhar" type="number" className="form-control" placeholder="Aadhar Number" required />
            </div>
            <button type="submit" className="btn btn-primary">Store</button>
          </form>
        </div>
        
      </div>
    );
  }
}

export default Main;