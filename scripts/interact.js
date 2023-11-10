// Import Web3.js if you haven't already
const Contract = require('web3-eth-contract');
// set provider for all later instances to use
Contract.setProvider(window.ethereum);

//"GoFundMia" smart contract address
const contractAddress = "0xB57c7EF9BE454b5200704F8Eb8C112920Db7697D";
//GoFundMia" smart contract ABI
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"DonationReceived","type":"event"},{"inputs":[],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDonation","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}]


//instantiate the smart contract as follows:
const goFundMiaContract = new Contract(contractABI, contractAddress);

const loadDonatedAmount = async () => {
    // Define an asynchronous function called 'loadCurrentMessage'.
    
    const amount = await goFundMiaContract.methods.totalDonation().call();
    // Using the helloWorldContract instance, this line calls a function named totalDonation on the smart contract.
    // The call() function is used to read data from the smart contract without creating a transaction.
    // The result of this call is in Wei and is stored in the amount variable.
  
    return amount;
    // The function returns the value obtained from calling totalDonation on the smart contract.
};

const donate = async (address,amount) => {
  let amountToWei=amount*(10**18)
  //initial checks
  if (!window.ethereum) {
    return {
      "error":
        "Connect your Metamask wallet.",
    };
  }
  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: goFundMiaContract.methods.donate().encodeABI(),
    value:`0x${amountToWei.toString(16)}`
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      trx:`${txHash}`
    };
  } catch (error) {
    return {
      "error":error.message,
    };
  }
};


