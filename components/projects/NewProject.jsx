import { useRouter } from "next/router";
import { useState } from "react";
import { BoldTitleAndValue, TWButton } from "..";
import { simpleApiCall } from "../../lib";

const NewProject = () => {
  const router = useRouter();
  const [title, setTitle] = useState();

  onSubmit = async () => {
    const { data, status } = await simpleApiCall(
      'projects',
      'POST',
      {
        title
      }
    )

    if (status === 200) {
      router.push(`/projects/${data.id}`)
    }
  }

  return (
    <div>
      <h2>New Project</h2>
      <div>
        <BoldTitleAndValue
          title="Title"
          value={(
            <input
              type="text"
              onChange={setTitle}
              value={title}
            />
          )}
        />
        <TWButton
          onClick={onSubmit}
        >
          Create Project
        </TWButton>
      </div>
    </div>
  )
  
}

export default NewProject;