import classMapMerge from '../lib/classMapMerge'
import {
  TWHorizontalSpread
} from '.'

const TWCleanHeader = ({ classMap, children }) => {
  return (
    <div 
      className={
        classMapMerge(
          {
            leading: 'leading-10',
            fontColor: 'text-slate-900',
            padding: 'py-6'
          },
          classMap
        )
      }
    >
      <TWHorizontalSpread>
        {children}
      </TWHorizontalSpread>
    </div>
  );
}

TWCleanHeader.defaultProps = {
  children: ['child1', 'child2', 'child3'].map(
    (child, index) => <div key={'child-' + index}>{child}</div>
  ),
  classMap: "classMap"
}

export default TWCleanHeader;