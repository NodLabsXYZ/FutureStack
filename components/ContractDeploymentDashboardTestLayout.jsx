import {
  ContractDeploymentDashboardHeader
} from '.'

const ContractDeploymentDashboardTestLayout = ({ children }) => {

  return (
    <div className='container px-6'>
      <ContractDeploymentDashboardHeader />
      {children}
    </div>
  )

}

export default ContractDeploymentDashboardTestLayout