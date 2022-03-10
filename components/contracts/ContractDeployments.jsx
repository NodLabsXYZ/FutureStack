import {
  ContractDeploymentPreview
} from '.'

const ContractDeployments = ({ deployments }) => {
  return (
    <div>
      <h2 className='font-bold'>Deployed Contracts</h2>
      {deployments.length === 0 && (
        <p className='text-sm pt-3'>
          You have not yet deployed any contracts.
        </p>
      )}
      {deployments.sort(
        (a, b) => b.deployedAt - a.deployedAt
      ).map(
        (deployment, index) => (
          <div 
            key={`deployment-${index}`}
            className='pt-3 flex'
          >
            <ContractDeploymentPreview
              deployment={deployment}
            />
          </div>
        )
      )}
    </div>
  )
}

export default ContractDeployments;