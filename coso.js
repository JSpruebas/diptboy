const web3 = new Web3;
const farmAdd = "0xe0979c566153602B24f7f07999cbFbc7D499eE66";
const tokenAdd = "0xDaac95fa5761b808794e5D5b2C402350940c91e8";
let chainId;
let tokenContract, farmContract;
let tuCuenta, tuBalance, allowance

const aprobar1 = document.getElementById("botonAp1");
const harvest1 = document.getElementById("botHarvest1");
const mint1 = document.getElementById("button1");

mint1.addEventListener("click", mint);
  harvest1.addEventListener("click", funcHarvest1);

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

  tuCuenta = await web3.eth.getAccounts();
  document.getElementById("add").textContent = `${String(tuCuenta).substring(1, 5)}...${String(tuCuenta).substring(38)} `;
  tuBalance = await web3.eth.getBalance(tuCuenta[0]);
  tuBalance = Number(web3.utils.fromWei(tuBalance)).toFixed(3);
  document.getElementById("bal").textContent = tuBalance;

  tokenContract = await new web3.eth.Contract(window.tokenAbi, tokenAdd);
  farmContract = await new web3.eth.Contract(window.farmAbi, farmAdd);

  allowance = await tokenContract.methods.allowance(tuCuenta[0], farmAdd).call()

  if (allowance > 1e24) {
    aprobar1.textContent = "DEPOSITAR"
    aprobar1.addEventListener("click", funcDepo1);
  } else {
    aprobar1.addEventListener("click", funcAprob1);
  } 


  let pendingReward = await farmContract.methods.pendingD20(0, tuCuenta[0]).call();
  let pendingHumano = Number(web3.utils.fromWei(pendingReward)).toFixed(3);
  document.getElementById("harvest1").textContent = pendingHumano;


  let depositado = await farmContract.methods.userInfo(0, tuCuenta[0]).call();
  let depositadoHumano = Number(web3.utils.fromWei(depositado[0])).toFixed(1);
  document.getElementById("depo1").textContent = depositadoHumano;

  refrescar();

}

function refrescar() { setInterval(coso, 5000) };


const funcAprob1 = async () => {
  let cuenta = await web3.eth.getAccounts();
  await tokenContract.methods.approve(farmAdd, BigInt(1e25)).send({ from: cuenta[0] });
}

const funcDepo1 = async () => {
  let cuenta = await web3.eth.getAccounts();
  await farmContract.methods.deposit(0, BigInt(1e18)).send({ from: cuenta[0] });
}

const funcHarvest1 = async () => {
  let cuenta = await web3.eth.getAccounts();
  await farmContract.methods.deposit(0, 0).send({ from: cuenta[0] });
}


async function mint() {
  let cuenta = await web3.eth.getAccounts();
  await tokenContract.methods.mint(cuenta[0], BigInt(1e18)).send({ from: cuenta[0] });

}







