import {
  dateStringDiffToWords
} from '../../lib'

import { NextLink } from '..';

const ContractPreview = ({ project, contract }) => {
  
  return (
    <div>
      <NextLink href={`/project/${project.id}/contract/${contract.id}`}>
        <a>
          <div className='border p-3'>
            <h3 className='font-bold mb-3'>
              {contract.name}
            </h3>
            <div className='text-xs mb-6'>
              <span className='font-semibold mr-1'>
                Last Compiled: 
              </span>
              {dateStringDiffToWords(contract.compiledAt)}
            </div>
          </div>
        </a>
      </NextLink>
    </div>
  )
  
}

export default ContractPreview;