import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Token from "./artifacts/contracts/Token.sol/Token.json";
import "./App.css";

const isMetamask = typeof window.ethereum !== "undefined";

function App() {
  const [accounts, setAccounts] = useState([]);
  const [contractAddress, setContactAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // helper
  const isConnected = accounts.length > 0;

  const getBalance = async () => {
    console.log("getBalance", { isConnected, accounts, balance });
    // if (!isConnected) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, Token.abi, provider);
    const data = await contract.balanceOf(accounts[0]);
    // data returns: ​BigNumber {_hex: '0x0f4240', _isBigNumber: true}
    // how to properly convert without eventually losing presicion??

    setBalance(data.toString());
  };

  const transfer = async () => {
    if (!toAddress || !amount) return;
    if (!isConnected) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Token.abi, signer);

    try {
      const transaction = await contract.transfer(toAddress, amount);
      const result = await transaction.wait();

      alert(`Sent ${amount} tokens to address ${toAddress}`);

      console.log("transaction/result", { transaction, result });

      setTransactions([...transactions, { ...transaction, result }]);
    } catch (e) {
      alert(e.message);
    }
  };

  const connect = async () => {
    if (!isMetamask) return;

    const data = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccounts(data);
  };

  useEffect(() => {
    const init = () => {
      if (!isConnected) return;

      getBalance();
    };

    init();
  }, [isConnected]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <span>Contract Adress</span>
          <input
            value={contractAddress}
            placeholder="Contact Adress"
            onChange={(e) => setContactAddress(e.target.value)}
            style={{ width: 350 }}
          />
        </p>
        <button onClick={connect}>Connect</button>
      </header>

      <div>
        <span>Balance: {balance}</span>

        <button onClick={getBalance}>getBalance</button>

        <input
          value={toAddress}
          placeholder="Send To"
          onChange={(e) => setToAddress(e.target.value)}
        />

        <input
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />

        <button onClick={transfer}>Send</button>
      </div>

      <h3>Accounts</h3>
      <div>
        {accounts.map((a) => (
          <span key={a}>{a}</span>
        ))}
      </div>

      <h3>Transactions</h3>
      <div>
        {transactions.map((t) => (
          <div id={t.hash}>
            <p>Tx hash: {t.hash}</p>
            <p>
              Result from/to: {t.result.from}/{t.result.to}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
