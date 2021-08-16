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

    if (chainId != 97) {
      document.getElementById("divPools").style.display = "none";
      document.getElementById("button1").style.display = "none";
      alert("Conecta con BSC Testnet por favor");
    } else coso();


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


  const tokenContract = await new web3.eth.Contract(window.tokenAbi, "0xDaac95fa5761b808794e5D5b2C402350940c91e8");
  const farmContract = await new web3.eth.Contract(window.farmAbi, "0xe0979c566153602B24f7f07999cbFbc7D499eE66");

  const aprobar1 = document.getElementById("botonAp1");
  const depo1 = document.getElementById("botonDep1");
  const harvest1 = document.getElementById("botHarvest1");


  let pendingReward = await farmContract.methods.pendingD20(0, tuCuenta[0]).call();

  let pendingHumano = web3.utils.fromWei(pendingReward);

  document.getElementById("harvest1").innerText = pendingHumano;


  let depositado = await farmContract.methods.userInfo(0, tuCuenta[0]).call();

  let depositadoHumano = web3.utils.fromWei(depositado[0]);

  document.getElementById("depo1").innerText = depositadoHumano;




  document.getElementById("button1").onclick = mint;
  aprobar1.onclick = funcAprob1;
  depo1.onclick = funcDepo1;
  harvest1.onclick = funcHarvest1;

}


let refrescar = setInterval(coso, 3000);

const funcAprob1 = async () => {

  let cuenta = await web3.eth.getAccounts();
  const tokenContract = await new web3.eth.Contract(window.tokenAbi, "0xDaac95fa5761b808794e5D5b2C402350940c91e8");
  await tokenContract.methods.approve("0xe0979c566153602B24f7f07999cbFbc7D499eE66", BigInt(1e25)).send({ from: cuenta[0] });

}

const funcDepo1 = async () => {
  let cuenta = await web3.eth.getAccounts();
  const farmContract = await new web3.eth.Contract(window.farmAbi, "0xe0979c566153602B24f7f07999cbFbc7D499eE66");
  await farmContract.methods.deposit(0, BigInt(1e18)).send({ from: cuenta[0] });

}

const funcHarvest1 = async () => {
  let cuenta = await web3.eth.getAccounts();
  const farmContract = await new web3.eth.Contract(window.farmAbi, "0xe0979c566153602B24f7f07999cbFbc7D499eE66");
  await farmContract.methods.deposit(0, 0).send({ from: cuenta[0] });

}


const mint = async () => {
  let cuenta = await web3.eth.getAccounts();
  const tokenContract = await new web3.eth.Contract(window.tokenAbi, "0xDaac95fa5761b808794e5D5b2C402350940c91e8");
  await tokenContract.methods.mint(cuenta[0], BigInt(1e18)).send({ from: cuenta[0] });

}







