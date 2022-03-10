import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TWCircleSpinner } from '../../components'
import { ContractDeployment } from "../../components/contracts"
import { getContractDeployment } from '../../lib/queries'

const ContractDeploymentPage = () => {
  const router = useRouter()
  const deploymentId = router.query.contractDeploymentId
  
  const [deployment, setDeployment] = useState()

  useEffect(() => {
    if (!deploymentId) return;

    const loadDeployment = async () => {
      const _deployment = await getContractDeployment(deploymentId)
      setDeployment(_deployment)
    }

    loadDeployment()
  }, [deploymentId])

  if (!deployment) {
    return (
      <TWCircleSpinner
        message='Loading deployment...'
      />
    )
  }

  return (
    <ContractDeployment
      deployment={deployment}
    />
  )

}

export default ContractDeploymentPage;