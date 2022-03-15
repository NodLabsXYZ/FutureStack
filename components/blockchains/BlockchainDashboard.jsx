import React, { Suspense, useEffect, useState } from "react";
import BlockchainAddress from "./BlockchainAddress";

const ReactJson = React.lazy(() => import('react-json-view'));

const BlockchainDashboard = () => {
  const [chainId, setChainId] = useState(null);
  const [accountData, setAccountData] = useState()

  useEffect(() => {
    const loadAccountData = async () => {
      const accountJson = await fetch(`${process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}/api/accounts`, {
        mode: "no-cors",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const _accountData = await accountJson.json()
      setAccountData(_accountData);
    }
    
    loadAccountData();
  }, [])

  useEffect(() => {
    const loadChainId = async () => {
      const chainJson = await fetch(`${process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}/api/chainId`, {
        mode: "no-cors",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const chainData = await chainJson.json()
      setChainId(chainData.chainId);
    }
    
    loadChainId();
  }, [])

  // <Suspense fallback={<div>Loading...</div>}>
  //   <ReactJson
  //     src={accountData}
  //     theme="bright:inverted"
  //     displayObjectSize={false}
  //     displayDataTypes={false}
  //     enableClipboard={false}
  //   />                    
  // </Suspense>

  return (
    <div className='text-sm'>
      <p className='py-3'>
        This blockchain is hosted at
        <code className='p-1 bg-slate-300 mx-1'>
          {process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}
        </code>
        {chainId && (
          <span>
            with a chainID of {chainId}
          </span>
        )}
      </p>
      {Object.entries(accountData?.private_keys || {}).map(
        ([address, privateKey], index) => (
          <div
            key={`address-${index}`}
            className='pt-3'
          >
            <BlockchainAddress
              address={address}
              privateKey={privateKey}
            />
          </div>
        )
      )}
    </div>
  )
}

export default BlockchainDashboard;