import  {
  NextLink
} from '..'

const ProjectListing = ({ project }) => {
  return (
    <NextLink
      href={`/project/${project.id}`}
    >
      <a 
        className='block border p-3'
      >
        {project.title}
        <br/>
        <span className='text-xs'>{project.team.title}</span>
      </a>
    </NextLink>
  )
}

export default ProjectListing;