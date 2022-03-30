import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import "./App.css";

const isMetamask = typeof window.ethereum !== "undefined";

function App() {
  const [contractAddress, setContactAddress] = useState("");
  const [value, setValue] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const getGreeting = async () => {
    // test for metamask injected wallet
    if (isMetamask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet();
        console.log("data", data);
        setValue(data);
      } catch (e) {
        console.log("error", e);
      }
    }
  };

  const setGreeting = async () => {
    if (!value) return;

    if (isMetamask) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        Greeter.abi,
        signer
      );

      try {
        const transaction = await contract.setGreeting(value);
        const result = await transaction.wait();

        console.log("transaction/result", { transaction, result });

        setTransactions([...transactions, { ...transaction, result }]);
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const requestAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccounts(accounts);

    await getGreeting();
  };

  // useEffect(() => {
  //   const init = async () => {
  //     await getGreeting();
  //   };

  //   init();
  // }, []);

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
        <button onClick={requestAccount}>Connect</button>
      </header>

      <div>
        <input
          value={value}
          placeholder="Set Greeting"
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={setGreeting}>Set Greeting</button>
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
