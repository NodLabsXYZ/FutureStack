import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { ProjectWrapper, TWCircleSpinner } from '../../../../components';
import { Contract } from '../../../../components/contracts';
import { getContract } from '../../../../lib/queries';

const ContractPage = () => {
  const router = useRouter()
  const contractId = router.query.contractId 
  
  const [contract, setContract] = useState()

  useEffect(() => {
    if (!contractId) return;

    const loadContract = async () => {
      const _contract = await getContract(contractId)
      setContract(_contract)
    }

    loadContract()
  }, [contractId])

  if (!contract) {
    return (
      <TWCircleSpinner
        message='Loading contract...'
      />
    )
  }

  return (
    <ProjectWrapper>
      <Contract
        contract={contract}
      />
    </ProjectWrapper>
  )
}

export default ContractPage;