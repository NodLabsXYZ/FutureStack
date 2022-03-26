import { useEffect } from "react";
import AssetTable from "./AssetTable";

const AssetDashboard = ({ project }) => {

  return (
    <div>
      <h2 className='text-lg'>Assets: {project.title}</h2>

      <div className='py-6'>
        <AssetTable project={project} />
      </div>
    </div>
  )
}

export default AssetDashboard;