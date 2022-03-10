import { useRouter } from 'next/router';

import {
  ethereumNetworkIdToName,
  dateStringDiffToWords
} from '../../lib'

const ContractDeploymentPreview = ({ deployment }) => {
  const { info, deployed_at } = deployment;
  const router = useRouter();

  const onClick = () => {
    router.push(`/contract_deployment/${deployment.id}`);
  }

  return (
    <div 
      className='border p-3 mr-3 text-sm cursor-pointer'
      onClick={onClick}
    >
      <div className='font-bold'>
        {ethereumNetworkIdToName(info.network)}: 
        &nbsp;
        {dateStringDiffToWords(deployed_at)}
      </div>
    </div>
  )
}

export default ContractDeploymentPreview;