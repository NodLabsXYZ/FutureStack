import {
  TWButton,
  NextLink
} from '..'

const NewProjectButton = () => {
  return (
    <NextLink href="/new-project">
      <TWButton>
        New Project
      </TWButton>
    </NextLink>
  )
}

export default NewProjectButton;