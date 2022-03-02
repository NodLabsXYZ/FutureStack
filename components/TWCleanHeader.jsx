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
            fontColor: 'text-slate-800',
            background: 'bg-white',
            padding: 'p-6'
          },
          classMap
        )
      }>
      <TWHorizontalSpread 
        classMap={{ padding: 'sm:px-12 md:px-24' }}
      >
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