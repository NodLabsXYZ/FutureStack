import { useEffect, useState } from 'react';
import { simpleApiCall } from '../../lib';
import TWButton from '../TWButton';

const FundsPreview = () => {
  const [funds, setFunds] = useState();
  const [price, setPrice] = useState();
  const [additionalFunds, setAdditionalFunds] = useState();

  useEffect(() => {
    const loadFunds = async () => {
      const { json } = await simpleApiCall(
        'uploader/funds'
      )

      setFunds(json.funds)
      setPrice(json.mbPrice)
    }

    loadFunds();
  }, [])

  const addFunds = async () => {
    const totalFunds = parseInt(funds || 0) + parseInt(additionalFunds || 0)
    const additionalMB = parseInt(totalFunds / price)

    const { json } = await simpleApiCall(
      'uploader/fund_account',
      'POST',
      { byteCount: additionalMB * 1024 * 1024 }
    )

    setFunds(json.funds)
    setAdditionalFunds('')
  }


  return (
    <div className='border p-3 text-sm'>
      <h2 className='text-lg font-semibold mb-3'>Funds</h2>

      {funds && (
        <div>
          <div>
            {funds} at {price}/MB = {parseInt(funds / price)} MB
          </div>
          <div className='py-3'>
            <span className='font-bold'>Add Funds:</span>
            <input 
              type='number' 
              className='border p-1 mx-1'
              onChange={(e) => setAdditionalFunds(e.target.value)}
            />
            <span className='mr-3'>
              ({parseInt((additionalFunds || 0) / price)} MB)
            </span>
            <TWButton
              onClick={addFunds}
            >
              Add
            </TWButton>

          </div>
        </div>
      )}

      {!funds && (
        <div>Querying Funds...</div>
      )}
    </div>
  )

}

export default FundsPreview;