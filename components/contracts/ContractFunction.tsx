import { ethers } from "ethers"
import { FunctionComponent, useRef, useState } from "react"
import switchBlockchain from "../../lib/switchBlockchain"
import { TWButton } from ".."

type ContractFunctionProps = {
  provider: any
  info: any
  chainId: number
  address: string
  abi: any
  index: number
}

const ContractFunction: FunctionComponent<ContractFunctionProps> = ({ provider, info, chainId, address, abi, index }) => {
  const { name, inputs, outputs } = info
  const inputValues = useRef<any[]>([])
  const [response, setResponse] = useState<any|null>(null)

  const onChange = (input: any, index: number, value: string) => {
    let formattedValue: any = value
    if (input.type.indexOf('uint') > -1) {
      formattedValue = ethers.BigNumber.from(value)
    }
    inputValues.current[index] = formattedValue
  }

  const onClick = async () => {
    const correctNetwork = await switchBlockchain(window, chainId)
    if (!correctNetwork) {
      alert(`Please switch to the correct blockchain. You need to be on ${chainId}`)
      return
    }

    if (inputs.length && inputValues.current.length !== inputs.length) {
      alert('Please provide all arguments')
    } else {
      try {
        const contract = new ethers.Contract(address, abi, provider)                
        const signer = provider.getSigner()
        const connected = contract.connect(signer)
        const tx = await connected[name](...inputValues.current)
        if (tx.wait) {
          const receipt = await tx.wait()
          setResponse(receipt)
        } else {
          setResponse(tx)
        }    
      } catch (e) {
        alert("There was an error. Please see the console for details.")
        console.error(e)
      }
    }
  }
    
  return (
    <div className={`p-3 ${index % 2 == 0 ? 'bg-slate-200' : 'bg-yellow-200'}`}>
      <div className='mb-2 flex'>
        <div className='font-semibold'>{name}</div>
        <div className='ml-3 text-xs text-gray-800'>
          ({inputs.map((input: any) => `${input.name}: ${input.type}`).join(', ')}) 
          &nbsp;=&gt;&nbsp; 
          {outputs.map((output: any) => output.type).join(', ')}
          {outputs.length === 0 && 'void'}
        </div>
      </div>
      <div className='flex pt-2'>
        {inputs.map((input: any, index: number) => {
          return (
            <div key={`input-${index}`} className='mr-3'>
              <label className='mr-1'> 
                {input.name}: 
              </label>
              <input 
                onChange={(e: any) => onChange(input, index, e.target.value)}
              />
            </div>
          )
        })}     
        <TWButton
          classMap={{
            margin: '-mt-2',
            background: 'bg-white'
          }}
          onClick={onClick}
        >
          Call
        </TWButton>
        <div className='ml-3 -mt-2 px-6 py-1 bg-white'>
          {(response || "").toString()}
        </div>
      </div>      
    </div>
  )

}

export default ContractFunction
