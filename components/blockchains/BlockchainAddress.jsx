import { ethers } from 'ethers';
import { useEffect, useState } from "react";

const BlockchainAddress = ({ address, privateKey }) => {
  const [balance, setBalance] = useState();

  useEffect(() => {

    const loadBalances = async () => {
      const getBalanceUrl = `${process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}/api/getBalance`;
      const balanceData = await fetch(getBalanceUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address }),
      })
      const _balance = await balanceData.json()
      setBalance(ethers.BigNumber.from(_balance.hexValue));
    }

    loadBalances();
  }, [address])

  return (
    <div>
      {address} {balance && `(${balance} WEI)`}
    </div>
  )

}

export default BlockchainAddress;