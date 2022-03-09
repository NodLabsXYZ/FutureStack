import {
  SolidityContractDeployment
} from '.'

const SolidityContractDeployments = ({ provider, contract, deployments }) => {
  return (
    <div>
      <h2 className='font-bold'>Deployments</h2>
      {deployments.sort(
        (a, b) => b.deployedAt - a.deployedAt
      ).map(
        (deployment, index) => (
          <div 
            key={`deployment-${index}`}
            className='pt-3'
          >
            <SolidityContractDeployment
              provider={provider}
              contract={contract}
              deployment={deployment}
            />
          </div>
        )
      )}
      <div className='text-xs pt-1'>
        Run `nod import` or `nod import [ADDRESS]` from any project to
        <br/>
        import contract information (network, abi, and address).
        <br/><br/>
        Example: `nod import {deployments[0].contractAddress}`
      </div>
    </div>
  )
}

export default SolidityContractDeployments;