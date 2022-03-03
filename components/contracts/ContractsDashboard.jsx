import { ContractDeploymentDashboardContract } from "..";

const ContractsDashboard = ({ project }) => {
  return (
    <div>
      <h2 className='text-lg'>Contracts</h2>
      {project.contracts.sort(
        (a, b) => new Date(b.compiledAt) - new Date(a.compiledAt)
      ).map(
        (contract, index) => (
          <div 
            key={`contract-${index}`}
            className='py-3'
          >
            <ContractDeploymentDashboardContract
              provider={provider}
              contract={contract}
            />
          </div>
        )
      )}
    </div>
  )
}

export default ContractsDashboard;