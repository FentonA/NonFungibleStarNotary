import Web3 from "web3";
import starNotaryArtifacts from "../../build/contracts/starNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try{
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifacts.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifacts.abi,
        deployedNetwork.address,
      );
      const accunts = await web3.eth.getAccounts();
      this.accounts = accounts[0];

    } catch(error){
      console.error("Could not connect to contract or chain");
    }

},
setStatus: function(message){
  const status = document.getElementById("status");
  status.innerHTML = message;
}, 

createStar: async function(){
  const {createStar} = this.meta.methods;
  const name = document.getElementById("starName").Value;
  const id = document.getElementById('starId').value;
  await createStar(name, id).send({from: this.account});
  App.setStatus("New Star OWner is" + this.account + ".")
}
};
window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
