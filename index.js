import { abi, contractAddress } from "./constants.js";
import { ethers } from "./ethers-5.6.esm.min.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withDrawButton = document.getElementById("withDrawButton");

/********* Connecting HTML to Metamask *********/
const connect = async () => {
  if (typeof window.ethereum !== "undefined") {
    // connect to Metamask
    try {
      await window?.ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected!";
    } catch (error) {
      console.log("error:", error);
    }
  } else {
    connectButton.innerHTML = "Please install Metamask to connect!";
  }
};

/********* Reading from the Blockchain *********/
const getBalance = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(`Balance: ${ethers.utils.formatEther(balance)}`);
  }
};

/********* Sending a transaction from a Website *********/
const fund = async () => {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      // Wait for this transaction to finish
      await listenedForTransectionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.error(error);
    }
  }
};

/********* Withdraw Function *********/
const withDraw = async () => {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();

      // Wait for this transaction to finish
      await listenedForTransectionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.error(error);
    }
  }
};

/********* Listening for Events and Completed Transactions *********/
const listenedForTransectionMine = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}...`);
  // listen for this transaction to finish
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
};

// call a function when a onclick
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withDrawButton.onclick = withDraw;
