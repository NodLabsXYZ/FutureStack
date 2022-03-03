import { useRouter } from "next/router";
import { useState } from "react";
import { BoldTitleAndValue, TWButton } from "..";
import { simpleApiCall } from "../../lib";

const NewProject = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');

  const onSubmit = async () => {
    const { json, status } = await simpleApiCall(
      'projects',
      'POST',
      {
        title
      }
    )

    if (status === 200) {
      router.push(`/project/${json.id}`)
    }
  }

  return (
    <div>
      <h2>New Project</h2>
      <div className='py-3'>
        <BoldTitleAndValue
          title="Title"
          value={(
            <input
              type="text"
              className='border px-3 py-1'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          )}
        />
      </div>
      <TWButton
        onClick={onSubmit}
      >
        Create Project
      </TWButton>
    </div>
  )
  
}

export default NewProject;