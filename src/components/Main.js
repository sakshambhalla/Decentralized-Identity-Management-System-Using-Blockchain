import React, { Component } from 'react';
class Main extends Component {
  render() {
    return (
      <div id="content">
        <div id="add">
          <h1>Add Identity to the authority </h1>
          <form id="formAuth" onSubmit={ async (event) => {
            event.preventDefault();
            var formData = new FormData(document.getElementById('formAuth'));
            let jsonObject = {};
            for(const [key,value] of formData.entries()){
              jsonObject[key] = value;
            }
            console.log(jsonObject);
            fetch('http://localhost:8002/',{
              method:"post",
              body: JSON.stringify({jsonObject}),
              headers: {
                'Content-Type': 'application/json'
              },
            }).then(async(res) => {var id = await res.json();window.alert(`Your Unique Identity Number is ${id.identity}`);})
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
        <hr />
        
        <div id="generate">
          <h1>Create Digital Identity (User) </h1>
          <form id="form" onSubmit={ async (event) => {
            event.preventDefault();
            var formData = new FormData(document.getElementById('form'));
            let jsonObject = {};
            formData.append("UserPublicKey", this.props.publicKey);
            for(const [key,value] of formData.entries()){
              jsonObject[key] = value;
            }
            fetch('http://localhost:8002/authenticate',{
              method:"post",
              body: JSON.stringify({jsonObject}),
              headers: {
                'Content-Type': 'application/json'
              },
            }).then(async (res) => {
              return new Promise((resolve, reject)=> {
                if(res.status === 400){
                  reject('Invalid details')
                }
                else resolve(res.json());
              });
            }).then(async (res) =>{
              this.props.addIPFS(res);
           }).catch((err) => {window.alert(err)});  
          }}>
            <div className="form-group mr-sm-2">
              <input name="identity" type="text" className="form-control" placeholder="Unique Identity Number" required />
              <input name="fn" type="text" className="form-control" placeholder="firstname"  required/>
              <input name="ln" type="text" className="form-control" placeholder="lastname"  required/>
              <input name="phone" type="number" className="form-control" placeholder="Phone number"  required/>
              <input name="age" type="number" className="form-control" placeholder="Age" required/>
              <input name="mail" type="email" className="form-control" placeholder="Email"  required/>
              <input name="aadhar" type="number" className="form-control" placeholder="Aadhar Number"  required/>
            </div>
            <button type="submit" className="btn btn-primary">Generate</button>
          </form>
        </div>
        <hr />
        
        <div id="retrieve-user">
          <h1>Retrieve Identity (User)</h1>
          <form onSubmit={async (event) => {
            event.preventDefault();
            let inp = document.getElementById("did")
            if(inp.value !== '')
              await this.props.retrieveIdentity(inp.value);
            else
              await this.props.retrieveIdentity(this.props.publicKey);
          }}>
            <div className="form-group mr-sm-2">
              <input name="DID" type="text" className="form-control" placeholder="Digital Identification Number" id="did" />
            </div>
            <button type="submit" className="btn btn-primary">Retrieve Identity Information</button>
          </form>
        </div>
        <hr />

          <div id="verifier">
          <h1>Verifier/Third Party  </h1>
          <form id="third" onSubmit={async (event) => {
            event.preventDefault();
            var formData = new FormData(document.getElementById('third'));
            let jsonObject = {};
            let inp = document.getElementById("didv");

            if(inp.value === '')
            formData.append("publicKey", this.props.publicKey);
            for(const [key,value] of formData.entries()){
              jsonObject[key] = value;
            }
            
              await this.props.verifierEntity(jsonObject);
          }}>
            <div className="form-group mr-sm-2">
            <input name="fn" type="text" className="form-control" placeholder="firstname"  />
              <input name="ln" type="text" className="form-control" placeholder="lastname"  />
              <input name="phone" type="number" className="form-control" placeholder="Phone number"  />
              <input name="age" type="number" className="form-control" placeholder="Age" />
              <input name="mail" type="email" className="form-control" placeholder="Email"  />
              <input name="aadhar" type="number" className="form-control" placeholder="Aadhar Number"  />
              <input name="publicKey" type="text" className="form-control" placeholder="Digital Identification Number" id="didv" />
            </div>
            <button type="submit" className="btn btn-primary">Verifiy/Authenticate</button>
          </form>
        </div>
        <hr />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default Main;
