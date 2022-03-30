import { useEffect, useState } from 'react';
import { simpleApiCall } from '../../lib';

const FundsPreview = () => {
  const [funds, setFunds] = useState();
  const [price, setPrice] = useState();

  useEffect(() => {
    const loadFunds = async () => {
      const { json } = await simpleApiCall(
        'uploader/funds'
      )

      setFunds(json.funds)
      setPrice(json.price)
    }

    loadFunds();
  }, [])


  return (
    <div className='border p-3 text-sm'>
      <h2 className='text-lg font-semibold mb-3'>Funds</h2>

      {funds && (
        <div>
          {funds} at {price}/MB = {funds / price} MB
        </div>
      )}

      {!funds && (
        <div>Querying Funds...</div>
      )}
    </div>
  )

}

export default FundsPreview;