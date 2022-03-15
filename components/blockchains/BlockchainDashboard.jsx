import React, { Suspense, useEffect, useState } from "react";
import BlockchainAddress from "./BlockchainAddress";

const ReactJson = React.lazy(() => import('react-json-view'));

const BlockchainDashboard = () => {
  const [accountData, setAccountData] = useState()

  useEffect(() => {
    const loadAccountData = async () => {
      const rawAccountData = await fetch(`${process.env.NEXT_PUBLIC_GANACHE_SERVICE_URL}/api/accounts`)
      const _accountData = await rawAccountData.json()
      setAccountData(_accountData);
    }
    
    loadAccountData();
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
    <div>
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