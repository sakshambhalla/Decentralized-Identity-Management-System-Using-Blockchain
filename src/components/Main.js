import React, { Component } from 'react';
import Web3 from 'web3';
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
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
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
          <form action="http://localhost:8001/" method="POST">
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
        
        <div id="generate">
          <h1>Generate Verifiable Claim </h1>
          <form id="form" method="post" onSubmit={ async (event) => {
            event.preventDefault();
            var formData = new FormData(document.getElementById('form'));
            await this.loadWeb3();
            formData.append('publicKey',await this.loadBlockchainData());

            console.log(formData.publicKey)
            fetch('http://localhost:8001/authenticate',{
              method:"post",
              body: JSON.stringify({formData}),
              headers: {
                'Content-Type': 'application/json'
              },
            })
          }}>
            <div className="form-group mr-sm-2">
              <input name="fn" type="text" className="form-control" placeholder="firstname"  />
              <input name="ln" type="text" className="form-control" placeholder="lastname"  />
              <input name="phone" type="number" className="form-control" placeholder="Phone number"  />
              <input name="age" type="number" className="form-control" placeholder="Age" />
              <input name="mail" type="email" className="form-control" placeholder="Email"  />
              <input name="aadhar" type="number" className="form-control" placeholder="Aadhar Number"  />
            </div>
            <button type="submit" className="btn btn-primary">Generate</button>
          </form>
        </div>
        
      </div>
    );
  }
}

export default Main;