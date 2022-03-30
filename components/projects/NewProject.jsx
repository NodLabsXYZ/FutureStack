import { useRouter } from "next/router";
import { useState } from "react";
import { BoldTitleAndValue, TWButton } from "..";
import { createProject, getProfileTeamsProjects } from "../../lib/queries";

const NewProject = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');

  const onSubmit = async () => {
    const profile = await getProfileTeamsProjects();

    const project = await createProject(profile.teams[0], {
      title
    })

    router.push(`/project/${project.id}`)
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