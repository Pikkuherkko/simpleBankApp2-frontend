import Web3Modal from "web3modal";
import { abi, contractAddresses } from "../constants/index.js";
import { useState, useEffect, useRef } from "react";
import { Contract, providers, ethers } from "ethers";

export default function BankFunction() {
  const [depositAmount, setDepositAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("0");
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider; // if not signer then return provider
  };

  async function getBalance() {
    try {
      const provider = await getProviderOrSigner(false);
      const { chainId } = await provider.getNetwork();
      const bankAddress = contractAddresses[chainId][0];
      const bankContract = new Contract(bankAddress, abi, provider);
      const bal = await bankContract.getBalance();
      setBalance(bal);
    } catch (err) {
      console.error(err);
    }
  }

  async function Deposit() {
    try {
      const signer = await getProviderOrSigner(true);
      const provider = await getProviderOrSigner(false);
      const { chainId } = await provider.getNetwork();
      const bankAddress = contractAddresses[chainId][0];
      const bankContract = new Contract(bankAddress, abi, signer);
      const tx = await bankContract.Deposit({
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait(1);
    } catch (err) {
      console.log(err);
    }
  }

  async function Withdraw() {
    try {
      const signer = await getProviderOrSigner(true);
      const provider = await getProviderOrSigner(false);
      const { chainId } = await provider.getNetwork();
      const bankAddress = contractAddresses[chainId][0];
      const bankContract = new Contract(bankAddress, abi, signer);
      if (withdrawAmount > 0) {
        const tx = await bankContract.Withdraw(
          ethers.utils.parseEther(withdrawAmount)
        );
        await tx.wait(1);
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function updateUI() {
    const calledBalance = (await getBalance()).toString();
    setBalance(calledBalance);
  }

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    updateUI();
  };

  useEffect(() => {
    web3ModalRef.current = new Web3Modal({
      network: "rinkeby",
      providerOptions: {},
      disableInjectedProvider: false,
    });
  }, []);

  return (
    <div className="p-10 flex flex-col items-center font">
      <h2 className="mt-40 text-3xl text-white">Deposit and withdraw eth</h2>
      <div id="functionalities" className="flex flex-row text-white">
        <div id="deposits" className="mt-10">
          <input
            type="text"
            placeholder="deposit"
            className="border-2 border-black text-center rounded text-black p-1"
            onChange={(event) => setDepositAmount(event.target.value)}
          />
          <button
            className="bg-black rounded p-1 ml-5"
            onClick={async () => {
              await Deposit({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Deposit ETH
          </button>
        </div>
        <div id="withdraws" className="mt-10 ml-20 ">
          <input
            type="text"
            placeholder="withdraw"
            className="border-2 border-black text-center rounded text-black p-1"
            onChange={(event) => setWithdrawAmount(event.target.value)}
          />
          <button
            className="bg-black rounded p-1 ml-5"
            onClick={async () => {
              await Withdraw({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
            Withdraw ETH
          </button>
        </div>
      </div>
      <div className="mt-20 flex flex-row">
        <button
          className="bg-black text-white rounded p-1"
          onClick={async () => {
            await getBalance({
              onSuccess: handleSuccess,
              onError: (error) => console.log(error),
            });
          }}
        >
          Get balance
        </button>
        <p className="ml-5 bg-white text-black w-20 rounded flex justify-center p-1">
          {balance ? ethers.utils.formatUnits(balance, "ether") : 0.0}
        </p>
      </div>
    </div>
  );
}
