import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import './App.css';

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [blocks, setBlocks] = useState([]);
  const [activeBlock, setActiveBlock] = useState(null);

  const getBlocks = () => {
    provider.on('block', async (blockNumber) => {
      const block = await provider.getBlock(blockNumber);
      const transactions = await Promise.all(block.transactions.map(async (trx) => {
        const trxDetails = await provider.getTransaction(trx);
        return trxDetails;
      }));
      block.transactions = transactions;

      setBlocks((blocks) => [block, ...blocks].slice(0, 10));
    });
  };

  useEffect(() => {
    getBlocks();
  }, []);

  const showBlockTransactions = async (block) => {
    setActiveBlock(block);
  };

  if(activeBlock !== null) return (
    <div className='main-content'>
      <h1 style={{ fontSize: '60px' }}>Block Viewer</h1>
      <button onClick={() => setActiveBlock(null)}>Back to All Blocks</button>
      <br />
      <br />
      <p><b>Showing Transactions from Block Number :</b> <span style={{ color: "#b465fc" }}>{activeBlock.number}</span></p>
      <p><b>Block Hash :</b> <span style={{ color: "#b465fc" }}>{activeBlock.hash}</span></p>
      <p><b>Block Gas Limit :</b> <span style={{ color: "#b465fc" }}>{activeBlock.gasLimit.toString()}</span></p>
      <p><b>Transaction Count :</b> <span style={{ color: "#b465fc" }}>{activeBlock.transactions.length}</span></p>
      <br />
      <br />

      <table>
        <tr>
          <th>Transaction Hash</th>
          <th>From</th>
          <th>To</th>
          <th>Value</th>
        </tr>
        {activeBlock.transactions.map((trx) => (<tr>
            <td className='trx-hash'>{trx.hash}</td>
            <td className='trx-hash'>{trx.from}</td>
            <td className='trx-hash'>{trx.to}</td>
            <td className='trx-hash'>{ethers.utils.formatEther(trx.value)} ETH</td>
          </tr>
        ))}
      </table>
    </div>
  );

  return <div className='main-content'>
    <h1 style={{ fontSize: '60px' }}>Block Viewer</h1>
    <p>* 10 Latest blocks are shown</p>
    
    <div className='grid'>
    <table>
      <tr>
        <th>Block Number</th>
        <th>Block hash</th>
        <th>Gas Limit</th>
        <th>Transaction Count</th>
        <th>Timestamp</th>
      </tr>
      {blocks.map((block) => (<tr>
          <td><span className='block-number' onClick={() => showBlockTransactions(block)}>{block.number}</span></td>
          <td>{block.hash}</td>
          <td>{block.gasLimit.toString()}</td>
          <td>{block.transactions.length}</td>
          <td>{new Date(block.timestamp * 1000).toLocaleString()}</td>
        </tr>
      ))}
    </table>
    </div>
  </div>;
}

export default App
