import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import BoldTitleAndValue from '../BoldTitleAndValue';
import TWButton from '../TWButton';

const BlockchainAddress = ({ address, privateKey }) => {
  const [expanded, setExpanded] = useState(false);
  const [balance, setBalance] = useState();
  const [tempBalance, setTempBalance] = useState();

  useEffect(() => {
    const loadBalances = async () => {
      const getBalanceUrl = `${process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}/api/getBalance`;
      const balanceJson = await fetch(getBalanceUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address }),
      })
      console.log("balanceJson", balanceJson)
      const _balance = await balanceJson.json()
      setBalance(ethers.BigNumber.from(_balance.hexValue));
      setTempBalance(_balance.stringValue)
    }

    loadBalances();
  }, [address])

  const submitBalance = async () => {
    const setBalanceUrl = `${process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}/api/setBalance`;
    const balanceData = await fetch(setBalanceUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        balance: {
          [address]: tempBalance
        }
      }),
    })
    const _balance = await balanceData.json()
    setBalance(ethers.BigNumber.from(_balance.hexValue));
    setTempBalance(_balance.stringValue)
  }

  return (
    <div className='border rounded px-3 pb-1'>
      <div 
        onClick={() => setExpanded(!expanded)}
        className='cursor-pointer'
      >
        <span className='text-2xl mr-1'>
          {expanded ? <>&#x025BE;</> :  <>&#x025B8;</>}
        </span>
        {address} {balance && `(${ethers.utils.formatEther(balance)} ETH)`}
      </div>
      {expanded && (
        <div className='pl-6 pt-3 text-sm'>
          <BoldTitleAndValue
            className='pb-3'
            title='Private Key'
            value={privateKey}
          />

          <BoldTitleAndValue
            className='pb-3'
            title='Set Balance'
            value={(
              <>
                <input 
                  className='border p-1 mr-1 w-1/4'
                  type='text' 
                  value={tempBalance}
                  onChange={(e) => setTempBalance(e.target.value)}
                />
                <span className='mr-3'>
                  WEI
                </span>
                <TWButton
                  onClick={() => submitBalance()}
                >
                  Submit
                </TWButton>
              </>
            )}
          />
        </div>
      )}
    </div>
  )

}

export default BlockchainAddress;