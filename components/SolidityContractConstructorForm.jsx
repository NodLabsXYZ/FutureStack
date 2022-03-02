import {
  SolidityABIFormInput
} from '.'

import { useEffect, useRef, useMemo } from 'react'

const SolidityContractConstructorForm = ({ abi, onChange }) => {
  const args = useRef({})

  const constructor = abi.find(
    (item) => item.type === 'constructor'
  )

  const onChangeIfArgsComplete = useMemo(() => () => {
    const validArgCount = Object.values(args.current).filter(
      (value) => value?.length > 0
    ).length

    if (validArgCount === constructor.inputs.length) {
      const orderedArgs = []
      for (const input of constructor.inputs) {
        orderedArgs.push({
          name: input.name,
          value: args.current[input.name]
        })
      }
      onChange(orderedArgs)
    } else {
      onChange(null)
    }
  }, [constructor.inputs, onChange])

  const onInternalChange = (name, value) => {
    args.current = {
      ...args.current,
      [name]: value
    }

    onChangeIfArgsComplete()
  }

  useEffect(() => {
    onChangeIfArgsComplete()
  }, [onChangeIfArgsComplete])
  
  return (
    <div>
      {constructor.inputs.map(
        (input, index) => (
          <SolidityABIFormInput
            key={`abi-input-${index}`}
            className='py-1 first-letter:capitalize'
            abiInput={input}
            onChange={onInternalChange}
          />
        )
      )}
    </div>
  )

}

export default SolidityContractConstructorForm;