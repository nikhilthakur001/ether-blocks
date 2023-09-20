import { useEffect, useState } from 'react';
import * as eva from 'eva-icons';

import { ethers } from 'ethers';

// const network = import.meta.env.VITE_INFURA_NETWORK;
// const apiKey = import.meta.env.VITE_INFURA_API_KEY;
// const provider = new ethers.providers.InfuraProvider(network, apiKey);

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

function TokenTransfer() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [transferEth, setTransferEth] = useState(null);
  const [transferAddr, setTransferAddr] = useState('');
  const [transferETHAmount, setTransferETHAmount] = useState(0);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    /** For loading the arrow (eva) icons */
    eva.replace();
  }, [transferEth, accountAddress, transferring]);

  const connectYourWallet = () => {
    if (window.ethereum) {
      provider.send("eth_requestAccounts", []).then(async () => {
        await accountChangedHandler(provider.getSigner());
      });
    } else {
      setErrorMessage("Please Install Metamask!!!");
    }
  }

  const accountChangedHandler = async (newAccount) => {
    const address = await newAccount.getAddress();
    setAccountAddress(address);
    const balance = await newAccount.getBalance()
    setUserBalance(ethers.utils.formatEther(balance));
  }

  const getUserLatestBalance = async (address) => {
    const balance = await provider.getBalance(address, "latest");
    setUserBalance(ethers.utils.formatEther(balance));
  }

  const handleTransfer = async () => {
    setErrorMessage(null);
    setTransferring(true);
    try {
      const data = await signer.sendTransaction({
        to: transferAddr,
        value: ethers.utils.parseEther(transferETHAmount)
      });

      getUserLatestBalance(accountAddress);

      setTransferAddr('');
      setTransferETHAmount(0);
      setSuccessMessage(`Transaction Hash ${data.hash}`);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (e) {
      console.log(e);
      setErrorMessage(e.message);
    }
    setTransferring(false);
  };

  const handleBackToWallet = () => {
    setTransferEth(false);
    setTransferAddr('');
    setTransferETHAmount(0);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  return <div className="h-screen flex flex-col justify-center items-center">
    <h2 className="text-5xl font-bold text-green-500 mb-10">Token Transfer App</h2>
    {transferEth && (
      <button onClick={handleBackToWallet} className="-mt-5 mb-10 self-center hover:scale-110 transition-all bg-sky-600 uppercase font-semibold text-white pr-3 rounded-md flex justify-between">
        <span className='bg-sky-700 p-3 rounded-md rounded-tr-none rounded-br-none'>
          <span data-eva="arrow-back-outline" data-eva-fill="#fff" />
        </span>
        <span className='mt-1 p-3 text-sm'>Back to My Wallet</span>
      </button>
    )}
    {errorMessage && <div className="text-red-500 mb-10 px-10">ERROR: {errorMessage}</div>}
    {successMessage && <div className="text-green-500 mb-10 px-10">SUCCESS: {successMessage}</div>}

    {(accountAddress && !transferEth) && (<div className='flex flex-col'>
      <div>
        <div className="text-lg font-bold text-green-600">Account Address</div>
        <div className="text-2xl font-bold text-green-500 mb-10 bg-slate-700 rounded-lg px-4 py-2">{accountAddress}</div>
      </div>

      <div>
        <div className="text-lg font-bold text-green-600">Account Balance</div>
        <div className="text-2xl font-bold text-green-500 mb-10 bg-slate-700 rounded-lg px-4 py-2">{userBalance} ETH</div>
      </div>

      <button onClick={() => setTransferEth(true)} className="self-end hover:scale-110 transition-all bg-sky-600 uppercase font-semibold text-white pl-4 rounded-md flex justify-between w-1/3">
        <span className='p-4'>Transfer ETH</span>
        <span className='bg-sky-700 p-4 rounded-md rounded-tl-none rounded-bl-none'>
          <span data-eva="arrow-forward-outline" data-eva-fill="#fff" />
        </span>
      </button>
    </div>)}

    {(accountAddress && transferEth) && (<div className='flex flex-col w-2/3'>
      <div>
        <div className="text-lg font-bold text-green-600 mb-1">Recepient Ethereum Address</div>
        <input value={transferAddr} onChange={(e) => setTransferAddr(e.target.value)} type="text" placeholder='Starts with "0x"' className="border-2 w-full text-2xl font-bold text-green-500 mb-10 bg-slate-700 rounded-lg px-4 py-2" />
      </div>

      <div>
        <div className="text-lg font-bold text-green-600 mb-1">ETH to Transfer</div>
        <input value={transferETHAmount} onChange={(e) => setTransferETHAmount(e.target.value)} type="number" className="border-2 w-full text-2xl font-bold text-green-500 mb-10 bg-slate-700 rounded-lg px-4 py-2" />
      </div>

      <button disabled={transferring} onClick={handleTransfer} className="self-end relative hover:scale-110 transition-all bg-sky-600 uppercase font-semibold text-white pl-4 rounded-md flex justify-between w-1/3">
        {transferring && (<div role="status" className='p-3'>
          <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>)}
        {!transferring && (<>
          <span className='p-4'>Transfer</span>
          <span className='bg-sky-700 p-4 rounded-md rounded-tl-none rounded-bl-none'>
            <span data-eva="arrow-forward-outline" data-eva-fill="#fff" />
          </span>
        </>)}
      </button>
    </div>)}

    {!accountAddress && (
      <button onClick={connectYourWallet} className="relative hover:scale-110 transition-all bg-sky-600 uppercase font-semibold text-white pl-4 rounded-md flex justify-between">
        <span className='p-4'>Connect Your Wallet</span>
        <span className='bg-sky-700 p-4 rounded-md rounded-tl-none rounded-bl-none'>
          <span data-eva="arrow-forward-outline" data-eva-fill="#fff" />
        </span>
      </button>
    )}
  </div>;
}

export default TokenTransfer;