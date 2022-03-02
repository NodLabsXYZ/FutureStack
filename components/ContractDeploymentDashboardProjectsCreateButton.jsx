import {
  TWButton
} from '.'

import { useState } from 'react';

const ContractDeploymentDashboardProjectsCreateButton = () => {
  const [title, setTitle] = useState()

  const onClick = () => {
    
  }
  
  return (
    <TWButton
      onClick={onClick}
    >
      Create
    </TWButton>
  )
}

export default ContractDeploymentDashboardProjectsCreateButton;