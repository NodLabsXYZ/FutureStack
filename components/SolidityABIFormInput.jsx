import store from 'store2';
import { useEffect, useState } from 'react';

const SolidityABIFormInput = ({ abiInput, className, onChange }) => {
  const { name, type } = abiInput;
  const storeInput = store.namespace('abiInput')

  const [value, setValue] = useState(storeInput(name) || "")

  useEffect(() => {
    if (value?.length) {
      onChange(name, value)
    }
  }, [onChange, name, value])

  const getInputType = () => {
    switch (type) {
      case 'string':
        return 'text';
      case 'uint256':
        return 'number'
      
    }
  }

  const internalChange = (event) => {
    const newValue = event.target.value;
    storeInput(name, newValue)
    setValue(newValue)
  }

  return (
    <div className={className}>
      <span className='mr-1 font-semibold'>
        {name}: 
      </span>
      <input 
        className='border px-3 py-1'
        type={getInputType()} 
        onChange={internalChange} 
        value={value}
      />
    </div>
  )

}

export default SolidityABIFormInput;