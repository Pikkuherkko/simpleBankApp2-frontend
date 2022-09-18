import { ethers } from "ethers";
import { useState, useEffect } from "react";

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [hasMetamask, setHasMetamask] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setSigner(provider.getSigner());
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }
  return (
    <div className="flex flex-row justify-between p-10 font">
      <h1 className="text-3xl text-white">Bank App</h1>
      <div className="text-2xl bg-red-500 rounded p-2 border-black">
        {hasMetamask ? (
          isConnected ? (
            "Connected!"
          ) : (
            <button className="" onClick={() => connect()}>
              Connect
            </button>
          )
        ) : (
          "Please Install Metamask"
        )}
      </div>
    </div>
  );
}
