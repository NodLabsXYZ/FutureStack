import {
  ethereumNetworkIdToName,
  dateStringDiffToWords,
  commify,
  bigNumberToEth,
  bigNumberFrom
} from '../lib'

import {
  BoldKeyAndValue
} from '.'

const SolidityContractDeployment = ({ deployment }) => {
  return (
    <div 
      className='border p-3 mr-3 text-sm'
    >
      <div className='font-bold'>
        {ethereumNetworkIdToName(deployment.network)}: 
        &nbsp;
        {dateStringDiffToWords(deployment.deployedAt)}
      </div>
      <div className='text-xs pt-3'>
        <BoldKeyAndValue
          title="Address"
          value={deployment.contractAddress}
        />
        <BoldKeyAndValue
          title="Gas Used"
          value={commify(deployment.gasUsed)}
        />
        <BoldKeyAndValue
          title="Cost"
          value={`${bigNumberToEth(
            bigNumberFrom(deployment.effectiveGasPrice).mul(
              bigNumberFrom(deployment.gasUsed)
            )
          )} ETH`}
        />
        <BoldKeyAndValue
          title="Arguments"
          value={(
            <div className='pl-3'>
              {deployment.deploymentArguments.map(
                (arg, argIndex) => (
                  <BoldKeyAndValue
                    key={`deployment-arg-${deployment.id}-${argIndex}`}
                    title={arg.name || argIndex + 1}
                    value={arg.value || arg}
                  />
                )
              )}
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default SolidityContractDeployment;