import {
  TWButton,
  NextLink
} from '..'

const NewProjectButton = () => {
  return (
    <TWButton>
      <NextLink href="/project/new">
        <a>
          New Project
        </a>
      </NextLink>
    </TWButton>
  )
}

export default NewProjectButton;