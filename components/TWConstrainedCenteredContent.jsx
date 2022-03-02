import {
  TWCenteredContent
} from '.'

const TWConstrainedCenteredContent = ({ width, children }) => {
  return (
    <TWCenteredContent>
      <div className={`${width || 'w-96'}`}>
        {children}
      </div>
    </TWCenteredContent>
  )
}

export default TWConstrainedCenteredContent;