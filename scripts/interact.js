// Import Web3.js if you haven't already
const Contract = require('web3-eth-contract');
// set provider for all later instances to use
Contract.setProvider(window.ethereum);

// Fabricated address for the "GoFundMia" smart contract
const contractAddress = "0x1234567890abcdef1234567890abcdef1234567890";
// Fabricated ABI for the "GoFundMia" smart contract (simplified for this example)
const contractABI = [
    { constant: true, inputs: [], name: "checkDonation", outputs: [{ name: "", type: "uint256" }], payable: false, stateMutability: "view", type: "function" },
    { constant: false, inputs: [], name: "donate", outputs: [], payable: true, stateMutability: "payable", type: "function" }
  ];


//instantiate the smart contract as follows:
const goFundMiaContract = new Contract(contractABI, contractAddress);

const loadDonatedAmount = async () => {
    // Define an asynchronous function called 'loadCurrentMessage'.
    
    const amount = await goFundMiaContract.methods.totalDonation().call();
    // Using the 'helloWorldContract' instance, this line calls a function named 'totalDonation' on the smart contract.
    // The 'call()' function is used to read data from the smart contract without creating a transaction.
    // The result of this call is in Wei and is stored in the 'amount' variable.
  
    return amount;
    // The function returns the value obtained from calling 'totalDonation' on the smart contract.
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


