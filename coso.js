
const web3 = new Web3;
let chainId;

window.onload = async () => {
  const provider = await detectEthereumProvider({ timeout: 2000 })
  if (provider) {
    provider.on('chainChanged', () => location.reload())
    provider.on('accountsChanged', () => location.reload())
    provider.on('disconnect', () => location.reload())

    await provider.request({ method: 'eth_requestAccounts' })

    web3.setProvider(provider)

    chainId = await web3.eth.getChainId()

    if (chainId!= 97) {
      alert("Conecta con BSC Testnet amigo");
      return;
    }


    coso();


  } else {
    console.error('Web3 provider not detected')
    alert("Metamask no detectado, use navegador dapp")
  }
}

const coso = async () => {

  let tuCuenta = await web3.eth.getAccounts();
  document.getElementById("add").innerText = tuCuenta;
  try {
    let tuBalance = await web3.eth.getBalance(tuCuenta[0]);
    tuBalance = web3.utils.fromWei(tuBalance);
    document.getElementById("bal").innerText = tuBalance;
  } catch (err) { console.error(err) }


  if (chainId == 97) { 
    

    //const zeroStratContract = await new web3.eth.Contract(window.abi1, "0xaafAb69eC1984c43dE9720F20743033B04E09aFA");
    //let pendingReward = await zeroStratContract.methods.calculateTotalPendingCakeRewards().call();   
    
    //let pendingHumano = web3.utils.fromWei(pendingReward); 

    //document.getElementById("depo1").innerText = pendingHumano;


   // let lastHarvest = await zeroStratContract.methods.lastHarvestedTime().call();
   // let horaHarvest = lastHarvest * 1000;
    //horaHarvest = new Date(horaHarvest);
    //document.getElementById("lastHarvest").innerText = horaHarvest;

    
    //document.getElementById("horas").innerText = tiempo + " horas";

    //document.getElementById("BSC").style.display = "inline-block";

  }



  document.getElementById("button1").onclick = mint;

}


let refrescar = setInterval(coso, 3000);



const mint = async () => {

  let cuenta = await web3.eth.getAccounts();

  const tokenContract = await new web3.eth.Contract(window.tokenAbi, "0xDaac95fa5761b808794e5D5b2C402350940c91e8");
  await tokenContract.methods.mint(cuenta[0], BigInt(1e18)).send({ from: cuenta[0] });

}







