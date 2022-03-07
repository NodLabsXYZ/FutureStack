import { ContractsDashboard } from "../../../../components/contracts";
import { ProjectLoader } from '../../../../components';

const ContractsPage = () => {
  return (
    <ProjectLoader>
      <ContractsDashboard />
    </ProjectLoader>
  )
}

export default ContractsPage;