import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { ethereumNetworkIdToName, dateStringDiffToWords } from '../lib'
import {
  getProject,
  getContract,
  getContractDeployment
} from '../lib/queries'
import { NextLink } from '.';

const FutureStackNavigation = ({ user }) => {
  const [stack, setStack] = useState([]);
  const router = useRouter()

  const linkify = (text, route) => (
    <NextLink href={route}>
      <a className='underline text-blue-600'>{text}</a>
    </NextLink>
  )

  useEffect(() => {
    if (!user) {
      setStack([])
      return;
    }

    const loadStack = async () => {
      const _stack = [
        linkify('Projects', '/'),
      ]
      const keys = ['projectId', 'contractId', 'contractDeploymentId']
      for (const key of keys) {
        const id = router.query[key];
        if (!id) continue;

        switch (key) {
          case 'projectId':
            const project = await getProject(id);
            _stack.push(linkify(project.title, `/project/${id}`));
            break;
          case 'contractId':
            const contract = await getContract(id);
            const projectId = router.query.projectId
            _stack.push(linkify('contracts', `/project/${projectId}/contract`));
            _stack.push(linkify(contract.name, `/project/${projectId}/contract/${contract.id}`));
            break;
          case 'contractDeploymentId':
            const deployment = await getContractDeployment(id);
            const { id: pId, title } = deployment.project;
            _stack.push(linkify(title, `/project/${pId}`));

            const { id: cId, name } = deployment.contract;
            _stack.push(linkify('contracts', `/project/${pId}/contract`));
            _stack.push(linkify(name, `/project/${pId}/contract/${cId}`));;    
            const networkName = ethereumNetworkIdToName(deployment.info.network);
            const dateDiff = dateStringDiffToWords(deployment.deployed_at);
            _stack.push(linkify(`${networkName} (${dateDiff})`, `/contract_deployments/${id}`));
            break;
        }
      }

      if (router.asPath.includes('asset')) {
        const { projectId } = router.query;
        _stack.push(linkify('Assets', `project/${projectId}/asset`));
      }

      
      setStack(_stack);
    }

    loadStack();
  }, [user, router]);

  return (
    <div className='pb-6 flex text-sm'>
      {stack.map((item, index) => (
        <div key={`stack-${index}`}>
          {index > 0 && <span className='px-1'>&gt;</span>}
          {item}
        </div>
      ))}
    </div>
  ) 
}

export default FutureStackNavigation;