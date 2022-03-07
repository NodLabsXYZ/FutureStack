const CodeDashboard = ({ project }) => {
  console.log("HI", project)

  return (
    <div>
      <h2 className='text-lg'>Code: {project.title}</h2>

      HI!
    </div>
  )
}

export default CodeDashboard;