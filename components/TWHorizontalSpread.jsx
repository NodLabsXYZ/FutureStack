import classMapMerge from '../lib/classMapMerge'
import {
  TWHorizontal
} from '.'

const TWHorizontalSpread = ({ classMap, children }) => {
  return (
    <TWHorizontal
      className={
        classMapMerge(
          {
            justify: 'justify-between'
          },
          classMap
        )
      }
    >
      {children}
    </TWHorizontal>
  );
}

TWHorizontalSpread.defaultProps = {
  children: ['child1', 'child2', 'child3'].map(
    (child, index) => <div key={'child-' + index}>{child}</div>
  ),
  classMap: "classMap"
}

export default TWHorizontalSpread;